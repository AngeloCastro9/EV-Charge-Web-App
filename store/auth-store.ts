import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const apiClient = (await import("@/lib/axios")).default;
          const response = await apiClient.post("/auth/login", {
            email,
            password,
          });
          // Backend returns access_token, but we'll support both token and access_token
          const token = response.data.access_token || response.data.token;
          const user = response.data.user || response.data;
          
          if (!token) {
            throw new Error("No token received from server");
          }
          
          // Sync both Zustand and localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
          }
          set({
            user: user ? { id: user.id, email: user.email, name: user.name } : null,
            token,
            isAuthenticated: true,
          });
        } catch (error: any) {
          throw new Error(error.response?.data?.message || error.message || "Login failed");
        }
      },
      signup: async (email: string, password: string, name: string) => {
        try {
          const apiClient = (await import("@/lib/axios")).default;
          const response = await apiClient.post("/auth/signup", {
            email,
            password,
            name,
          });
          // Backend returns access_token, but we'll support both token and access_token
          const token = response.data.access_token || response.data.token;
          const user = response.data.user || response.data;
          
          if (!token) {
            throw new Error("No token received from server");
          }
          
          // Sync both Zustand and localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
          }
          set({
            user: user ? { id: user.id, email: user.email, name: user.name } : null,
            token,
            isAuthenticated: true,
          });
        } catch (error: any) {
          throw new Error(error.response?.data?.message || error.message || "Signup failed");
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

