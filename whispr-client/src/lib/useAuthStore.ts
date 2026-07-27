import { create } from "zustand";
import { axiosInstance } from "./axioxInstance";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  profilepic?: string;
}
interface StoreItems {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  isUpdatingProfile: boolean;
  socket: ReturnType<typeof io> | null;
  onlineUsers: string[];
  checkAuth: () => void;
  setAuthUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  updateProfile: (data: { fullName?: string; profilePic?: string }) => Promise<boolean>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const baseUrl =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create<StoreItems>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  setAuthUser: (user) => set({ authUser: user }),
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/checkUser");
      set({ authUser: res.data.user });
      get().connectSocket();
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

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.patch("/auth/update-profile", data);
      set({ authUser: res.data.user });
      toast.success("Profile updated successfully! ✨");
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Profile update failed.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      return false;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/signout");
      set({ authUser: null });
      toast.success("Logout successful");
      get().disconnectSocket();
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
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(`${baseUrl}`, {
      withCredentials: true,
    });

    set({ socket });

    socket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    get().socket?.disconnect();
    set({ socket: null, onlineUsers: [] });
  },
}));
