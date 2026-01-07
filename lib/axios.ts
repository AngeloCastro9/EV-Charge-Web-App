import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("token");
      
      // Try to get token from Zustand store if not in localStorage
      if (!token) {
        try {
          const { useAuthStore } = await import("@/store/auth-store");
          token = useAuthStore.getState().token;
          // Sync to localStorage if found in store
          if (token) {
            localStorage.setItem("token", token);
          }
        } catch (e) {
          // Store might not be available yet
        }
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
let isLoggingOut = false; // Prevent multiple logout attempts

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Only handle 401 if it's a real authentication error from the server
    // Ignore network errors (no response) or CORS errors
    if (error.response?.status === 401 && !isLoggingOut) {
      // Don't logout if we're already on login/signup pages or if it's an auth endpoint
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const requestUrl = error.config?.url || "";
        
        // Don't logout on auth endpoints (login/signup)
        if (requestUrl.includes("/auth/login") || requestUrl.includes("/auth/signup")) {
          return Promise.reject(error);
        }
        
        // Check if we have a token - if not, don't logout (might be a network error)
        const token = localStorage.getItem("token");
        if (!token) {
          return Promise.reject(error);
        }
        
        // Only logout if we're on a protected route and have a token
        if (currentPath !== "/login" && currentPath !== "/signup" && !currentPath.startsWith("/_next")) {
          isLoggingOut = true;
          
          // Clear token from localStorage
          localStorage.removeItem("token");
          
          // Clear Zustand store if available
          try {
            const { useAuthStore } = await import("@/store/auth-store");
            useAuthStore.getState().logout();
          } catch (e) {
            // Store might not be available yet
          }
          
          // Only redirect if we're on dashboard
          if (currentPath.startsWith("/dashboard")) {
            // Small delay to prevent multiple redirects
            setTimeout(() => {
              window.location.href = "/login";
            }, 100);
          }
          
          // Reset flag after a delay
          setTimeout(() => {
            isLoggingOut = false;
          }, 1000);
        }
      }
    }
    // For network errors (no response) or other errors, just reject without logging out
    return Promise.reject(error);
  }
);

export default apiClient;

