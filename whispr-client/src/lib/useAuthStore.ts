import { create } from "zustand";
import { axiosInstance } from "./axioxInstance";
import axios from "axios";
import toast from "react-hot-toast";

interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  profilepic?: string;
}
interface StoreItems {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  checkAuth: () => void;
  setAuthUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<StoreItems>((set) => ({
  authUser: null,
  isCheckingAuth: true,

  setAuthUser: (user) => set({ authUser: user }),

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/checkUser");
      set({ authUser: res.data.user });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // 401 is expected when user is not logged in — not a real error
          console.log("checkAuth: user not authenticated");
        } else {
          console.error(
            "checkAuth error:",
            error.response?.status,
            error.response?.data,
          );
        }
      } else {
        console.error("checkAuth unexpected error:", error);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/signout");
      set({ authUser: null });
      toast.success("Logout successful");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Logout failed. Please try again.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  },
}));
