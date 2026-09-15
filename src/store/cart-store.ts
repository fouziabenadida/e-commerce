"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  stock: number;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  replaceItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.id === product.id
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      quantity: Math.min(
                        item.quantity + quantity,
                        product.stock || item.quantity + quantity
                      ),
                    }
                  : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...product, quantity: Math.min(quantity, product.stock || quantity) },
            ],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock || quantity)) }
              : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      replaceItems: (items) => set({ items }),
    }),
    {
      name: "nova-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export const getCartCount = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

export const getCartTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);