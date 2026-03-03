"use client";

import { useMutation } from "@tanstack/react-query";
import type { CartItem } from "@/stores/use-cart-store";
import { useCartItemCount, useCartItems, useCartStore } from "@/stores/use-cart-store";
import { syncCartOperation, type CartSyncOperation } from "@/lib/services/cart-service";

type OptimisticCartContext = {
  previousItems: CartItem[];
};

export const useCart = () => {
  const hasCartHydrated = useCartStore((state) => state.hasHydrated);
  const rawAddToCart = useCartStore((state) => state.addToCart);
  const rawRemoveFromCart = useCartStore((state) => state.removeFromCart);
  const rawUpdateQuantity = useCartStore((state) => state.updateQuantity);
  const rawClearCart = useCartStore((state) => state.clearCart);
  const items = useCartItems();
  const itemCount = useCartItemCount();

  const restoreItems = (previousItems: CartItem[]) => {
    rawClearCart();
    for (const item of previousItems) {
      rawAddToCart(item.productId, item.size, item.quantity);
    }
  };

  const mutation = useMutation({
    mutationFn: syncCartOperation,
    onMutate: async (payload: CartSyncOperation) => {
      const previousItems = [...items];

      switch (payload.type) {
        case "add":
          rawAddToCart(payload.productId, payload.size, payload.quantity);
          break;
        case "remove":
          rawRemoveFromCart(payload.productId, payload.size);
          break;
        case "update":
          rawUpdateQuantity(payload.productId, payload.size, payload.quantity);
          break;
        case "clear":
          rawClearCart();
          break;
        default:
          break;
      }

      return { previousItems } satisfies OptimisticCartContext;
    },
    onError: (_error, _payload, context) => {
      restoreItems(context?.previousItems ?? []);
    },
  });

  return {
    items,
    itemCount,
    hasCartHydrated,
    addToCart: async (productId: string, size: string, quantity = 1) => {
      await mutation.mutateAsync({
        type: "add",
        productId,
        size,
        quantity,
      });
    },
    removeFromCart: async (productId: string, size: string) => {
      await mutation.mutateAsync({
        type: "remove",
        productId,
        size,
      });
    },
    updateQuantity: async (productId: string, size: string, quantity: number) => {
      await mutation.mutateAsync({
        type: "update",
        productId,
        size,
        quantity,
      });
    },
    clearCart: async () => {
      await mutation.mutateAsync({
        type: "clear",
      });
    },
    isCartSyncing: mutation.isPending,
  };
};
