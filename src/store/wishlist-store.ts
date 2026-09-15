"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  stock: number;
}

interface WishlistState {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  replaceItems: (items: WishlistItem[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      toggleItem: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.id === item.id);
          return {
            items: exists
              ? state.items.filter((i) => i.id !== item.id)
              : [...state.items, item],
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      clearWishlist: () => set({ items: [] }),
      replaceItems: (items) => set({ items }),
    }),
    {
      name: "nova-wishlist",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export const isInWishlist = (items: WishlistItem[], id: string) =>
  items.some((item) => item.id === id);