const CART_SYNC_DELAY_MS = 450;
const CART_SYNC_ERROR_RATE = 0.12;

export type AddCartOperation = {
  type: "add";
  productId: string;
  size: string;
  quantity: number;
};

export type RemoveCartOperation = {
  type: "remove";
  productId: string;
  size: string;
};

export type UpdateCartOperation = {
  type: "update";
  productId: string;
  size: string;
  quantity: number;
};

export type ClearCartOperation = {
  type: "clear";
};

export type CartSyncOperation =
  | AddCartOperation
  | RemoveCartOperation
  | UpdateCartOperation
  | ClearCartOperation;

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * Simulates a cart sync call to backend.
 * This intentionally fails occasionally so optimistic rollback behavior can be tested.
 */
export async function syncCartOperation(
  input: CartSyncOperation,
): Promise<CartSyncOperation> {
  await delay(CART_SYNC_DELAY_MS);

  if (Math.random() < CART_SYNC_ERROR_RATE) {
    throw new Error("Cart sync failed. Please try again.");
  }

  return input;
}
