import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
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
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Only handle 401 if it's a real authentication error from the server
    // Ignore network errors (no response) or CORS errors
    if (error.response?.status === 401) {
      // Don't logout if we're already on login/signup pages or if it's an auth endpoint
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const requestUrl = error.config?.url || "";
        
        // Don't logout on auth endpoints (login/signup)
        if (requestUrl.includes("/auth/login") || requestUrl.includes("/auth/signup")) {
          return Promise.reject(error);
        }
        
        // Only logout if we're on a protected route
        if (currentPath !== "/login" && currentPath !== "/signup" && !currentPath.startsWith("/_next")) {
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
            window.location.href = "/login";
          }
        }
      }
    }
    // For network errors (no response) or other errors, just reject without logging out
    return Promise.reject(error);
  }
);

export default apiClient;

