import { create } from "zustand";
import { axiosInstance } from "./axioxInstance";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { playNotificationSound } from "./keyStrokeSound";

export interface ChatUser {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  lastActive?: string;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatStore {
  contacts: ChatUser[];
  selectedUser: ChatUser | null;
  messages: Message[];
  isContactsLoading: boolean;
  isMessagesLoading: boolean;
  isSending: boolean;

  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  getContacts: () => Promise<void>;
  setSelectedUser: (user: ChatUser | null) => void;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (userId: string, data: { text?: string; image?: string }) => Promise<void>;
  subscribeToMessage: () => () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  contacts: [],
  selectedUser: null,
  messages: [],
  isContactsLoading: false,
  isMessagesLoading: false,
  isSending: false,
  soundEnabled: localStorage.getItem("soundEnabled") !== "false",

  setSoundEnabled: (enabled) => {
    localStorage.setItem("soundEnabled", String(enabled));
    set({ soundEnabled: enabled });
  },

  getContacts: async () => {
    set({ isContactsLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ contacts: res.data.contacts });
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      set({ isContactsLoading: false });
    }
  },

  setSelectedUser: (user) => set({ selectedUser: user }),

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data.messages });
    } catch {
      toast.error("Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (userId: string, data: { text?: string; image?: string }) => {
    set({ isSending: true });
    try {
      const res = await axiosInstance.post(`/messages/send/${userId}`, data);
      set({ messages: [...get().messages, res.data.data] });
    } catch {
      toast.error("Failed to send message");
    } finally {
      set({ isSending: false });
    }
  },
  subscribeToMessage() {
    const { selectedUser } = get();
    if (!selectedUser) return () => {};

    const socket = useAuthStore.getState().socket;
    if (!socket) return () => {};

    socket.off("newMessage");

    socket.on("newMessage", (message) => {
      const { selectedUser, soundEnabled } = get();
      if (!selectedUser) return;

      if (message.senderId !== selectedUser._id) return;

      set({ messages: [...get().messages, message] });
      if (soundEnabled) {
        playNotificationSound();
      }
    });

    return () => {
      socket.off("newMessage");
    };
  },

}));
