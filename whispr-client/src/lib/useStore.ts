import { create } from "zustand";


export const useStore = create((set)=> ({
    authUser: null,
    isLoggedIn: false,
    isLoading: false,

    login: () => (set({isLoggedIn: true, isLoading: true})) 
}))