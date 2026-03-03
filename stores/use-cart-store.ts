"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/stores/use-auth-store";

export type CartItem = {
  productId: string;
  size: string;
  quantity: number;
};

type CartState = {
  cartsByUser: Record<string, CartItem[]>;
  guestItems: CartItem[];
  hasHydrated: boolean;
  addToCart: (productId: string, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  replaceItemsForCartKey: (cartKey: string, items: CartItem[]) => void;
  setHasHydrated: (value: boolean) => void;
};

const isSameLineItem = (item: CartItem, productId: string, size: string) =>
  item.productId === productId && item.size === size;

const EMPTY_CART_ITEMS: CartItem[] = [];

const normalizeEmail = (email?: string | null) => email?.trim().toLowerCase() ?? null;

export const getActiveCartKey = () => normalizeEmail(useAuthStore.getState().user?.email) ?? "guest";

const getItemsForKey = (state: CartState, key: string) =>
  key === "guest" ? state.guestItems : (state.cartsByUser[key] ?? []);

const setItemsForKey = (state: CartState, key: string, items: CartItem[]) =>
  key === "guest"
    ? { guestItems: items }
    : {
        cartsByUser: {
          ...state.cartsByUser,
          [key]: items,
        },
      };

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartsByUser: {},
      guestItems: [],
      hasHydrated: false,
      addToCart: (productId, size, quantity = 1) =>
        set((state) => {
          const cartKey = getActiveCartKey();
          const activeItems = getItemsForKey(state, cartKey);
          const normalizedQuantity = Math.max(1, quantity);
          const existingIndex = activeItems.findIndex((item) =>
            isSameLineItem(item, productId, size),
          );

          if (existingIndex === -1) {
            return setItemsForKey(state, cartKey, [
              ...activeItems,
              { productId, size, quantity: normalizedQuantity },
            ]);
          }

          return setItemsForKey(
            state,
            cartKey,
            activeItems.map((item, index) =>
              index === existingIndex
                ? { ...item, quantity: item.quantity + normalizedQuantity }
                : item,
            ),
          );
        }),
      removeFromCart: (productId, size) =>
        set((state) => {
          const cartKey = getActiveCartKey();
          const activeItems = getItemsForKey(state, cartKey);
          return setItemsForKey(
            state,
            cartKey,
            activeItems.filter((item) => !isSameLineItem(item, productId, size)),
          );
        }),
      updateQuantity: (productId, size, quantity) =>
        set((state) => {
          const cartKey = getActiveCartKey();
          const activeItems = getItemsForKey(state, cartKey);
          const normalizedQuantity = Math.max(0, quantity);
          if (normalizedQuantity === 0) {
            return setItemsForKey(
              state,
              cartKey,
              activeItems.filter((item) => !isSameLineItem(item, productId, size)),
            );
          }

          return setItemsForKey(
            state,
            cartKey,
            activeItems.map((item) =>
              isSameLineItem(item, productId, size)
                ? { ...item, quantity: normalizedQuantity }
                : item,
            ),
          );
        }),
      clearCart: () =>
        set((state) => {
          const cartKey = getActiveCartKey();
          return setItemsForKey(state, cartKey, []);
        }),
      replaceItemsForCartKey: (cartKey, items) =>
        set((state) => setItemsForKey(state, cartKey, [...items])),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "cart-store",
      version: 2,
      partialize: (state) => ({
        cartsByUser: state.cartsByUser,
        guestItems: state.guestItems,
      }),
      migrate: (persistedState, version) => {
        const state = persistedState as
          | {
              items?: CartItem[];
              cartsByUser?: Record<string, CartItem[]>;
              guestItems?: CartItem[];
            }
          | undefined;

        if (!state) {
          return {
            cartsByUser: {},
            guestItems: [],
          };
        }

        if (version < 2) {
          return {
            cartsByUser: state.cartsByUser ?? {},
            guestItems: state.guestItems ?? state.items ?? [],
          };
        }

        return {
          cartsByUser: state.cartsByUser ?? {},
          guestItems: state.guestItems ?? [],
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const useCartItems = () => {
  const userEmail = useAuthStore((state) => normalizeEmail(state.user?.email));
  return useCartStore((state) =>
    userEmail ? (state.cartsByUser[userEmail] ?? EMPTY_CART_ITEMS) : state.guestItems,
  );
};

export const useCartItemCount = () =>
  useCartItems().reduce((total, item) => total + item.quantity, 0);
