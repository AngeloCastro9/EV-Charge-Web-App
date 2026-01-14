import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("token");
      
      if (!token) {
        try {
          const { useAuthStore } = await import("@/store/auth-store");
          token = useAuthStore.getState().token;
          if (token) {
            localStorage.setItem("token", token);
          }
        } catch (e) {
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

let isLoggingOut = false;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !isLoggingOut) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const requestUrl = error.config?.url || "";
        
        if (requestUrl.includes("/auth/login") || requestUrl.includes("/auth/signup")) {
          return Promise.reject(error);
        }
        
        const token = localStorage.getItem("token");
        if (!token) {
          return Promise.reject(error);
        }
        
        if (currentPath !== "/login" && currentPath !== "/signup" && !currentPath.startsWith("/_next")) {
          isLoggingOut = true;
          
          localStorage.removeItem("token");
          
          try {
            const { useAuthStore } = await import("@/store/auth-store");
            useAuthStore.getState().logout();
          } catch (e) {
          }
          
          if (currentPath.startsWith("/dashboard")) {
            setTimeout(() => {
              window.location.href = "/login";
            }, 100);
          }
          
          setTimeout(() => {
            isLoggingOut = false;
          }, 1000);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

