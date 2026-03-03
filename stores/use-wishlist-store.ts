"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  wishlistProductIds: string[];
  hasHydrated: boolean;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  setHasHydrated: (value: boolean) => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      wishlistProductIds: [],
      hasHydrated: false,
      addToWishlist: (productId) =>
        set((state) => {
          if (state.wishlistProductIds.includes(productId)) {
            return state;
          }

          return { wishlistProductIds: [...state.wishlistProductIds, productId] };
        }),
      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlistProductIds: state.wishlistProductIds.filter((id) => id !== productId),
        })),
      toggleWishlist: (productId) =>
        set((state) => ({
          wishlistProductIds: state.wishlistProductIds.includes(productId)
            ? state.wishlistProductIds.filter((id) => id !== productId)
            : [...state.wishlistProductIds, productId],
        })),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "wishlist-store",
      partialize: (state) => ({ wishlistProductIds: state.wishlistProductIds }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
