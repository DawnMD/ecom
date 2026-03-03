"use client";

import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import type { CartItem } from "@/stores/use-cart-store";
import {
  getActiveCartKey,
  useCartItemCount,
  useCartItems,
  useCartStore,
} from "@/stores/use-cart-store";
import { syncCartOperation, type CartSyncOperation } from "@/lib/services/cart-service";

type OptimisticCartContext = {
  cartKey: string;
  previousItems: CartItem[];
};

export const useCart = () => {
  const hasCartHydrated = useCartStore((state) => state.hasHydrated);
  const rawAddToCart = useCartStore((state) => state.addToCart);
  const rawRemoveFromCart = useCartStore((state) => state.removeFromCart);
  const rawUpdateQuantity = useCartStore((state) => state.updateQuantity);
  const rawClearCart = useCartStore((state) => state.clearCart);
  const replaceItemsForCartKey = useCartStore((state) => state.replaceItemsForCartKey);
  const items = useCartItems();
  const itemCount = useCartItemCount();
  const operationQueueRef = useRef<Promise<unknown>>(Promise.resolve());

  const restoreItems = (cartKey: string, previousItems: CartItem[]) => {
    replaceItemsForCartKey(cartKey, previousItems);
  };

  const mutation = useMutation({
    mutationFn: syncCartOperation,
    onMutate: async (payload: CartSyncOperation) => {
      const cartKey = getActiveCartKey();
      const state = useCartStore.getState();
      const previousItems =
        cartKey === "guest" ? [...state.guestItems] : [...(state.cartsByUser[cartKey] ?? [])];

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

      return { cartKey, previousItems } satisfies OptimisticCartContext;
    },
    onError: (_error, _payload, context) => {
      if (!context) {
        return;
      }

      restoreItems(context.cartKey, context.previousItems);
    },
  });

  const queueOperation = (operation: CartSyncOperation) => {
    const queuedOperation = operationQueueRef.current.then(() => mutation.mutateAsync(operation));
    operationQueueRef.current = queuedOperation.catch(() => undefined);
    return queuedOperation;
  };

  return {
    items,
    itemCount,
    hasCartHydrated,
    addToCart: async (productId: string, size: string, quantity = 1) => {
      await queueOperation({
        type: "add",
        productId,
        size,
        quantity,
      });
    },
    removeFromCart: async (productId: string, size: string) => {
      await queueOperation({
        type: "remove",
        productId,
        size,
      });
    },
    updateQuantity: async (productId: string, size: string, quantity: number) => {
      await queueOperation({
        type: "update",
        productId,
        size,
        quantity,
      });
    },
    clearCart: async () => {
      await queueOperation({
        type: "clear",
      });
    },
    isCartSyncing: mutation.isPending,
  };
};
