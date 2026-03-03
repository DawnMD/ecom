"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  size: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  hasHydrated: boolean;
  addToCart: (productId: string, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  setHasHydrated: (value: boolean) => void;
};

const isSameLineItem = (item: CartItem, productId: string, size: string) =>
  item.productId === productId && item.size === size;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,
      addToCart: (productId, size, quantity = 1) =>
        set((state) => {
          const normalizedQuantity = Math.max(1, quantity);
          const existingIndex = state.items.findIndex((item) =>
            isSameLineItem(item, productId, size),
          );

          if (existingIndex === -1) {
            return {
              items: [
                ...state.items,
                { productId, size, quantity: normalizedQuantity },
              ],
            };
          }

          return {
            items: state.items.map((item, index) =>
              index === existingIndex
                ? { ...item, quantity: item.quantity + normalizedQuantity }
                : item,
            ),
          };
        }),
      removeFromCart: (productId, size) =>
        set((state) => ({
          items: state.items.filter((item) => !isSameLineItem(item, productId, size)),
        })),
      updateQuantity: (productId, size, quantity) =>
        set((state) => {
          const normalizedQuantity = Math.max(0, quantity);
          if (normalizedQuantity === 0) {
            return {
              items: state.items.filter(
                (item) => !isSameLineItem(item, productId, size),
              ),
            };
          }

          return {
            items: state.items.map((item) =>
              isSameLineItem(item, productId, size)
                ? { ...item, quantity: normalizedQuantity }
                : item,
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "cart-store",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const useCartItemCount = () =>
  useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
