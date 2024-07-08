import { create } from "zustand";
import { UserType } from "@/interfaces";

export const useUsersStore = create((set: any) => ({
  loggedInUserData: null,
  setLoggedInUserData: (data: UserType) => set({ loggedInUserData: data }),
})) as any;

export default useUsersStore;

export interface UsersStoreType {
  loggedInUserData: UserType | null;
  setLoggedInUserData: (data: UserType) => void;
}
