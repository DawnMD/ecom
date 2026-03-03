export const getEffectiveStockQuantity = (
  inStock: boolean,
  stockQuantity?: number,
) => {
  if (!inStock) {
    return 0
  }

  return Math.max(0, stockQuantity ?? 0)
}

export const isProductPurchasable = (
  inStock: boolean,
  stockQuantity?: number,
) => getEffectiveStockQuantity(inStock, stockQuantity) > 0

export const isLowStock = (
  inStock: boolean,
  stockQuantity?: number,
  threshold = 10,
) => {
  const quantity = getEffectiveStockQuantity(inStock, stockQuantity)
  return quantity > 0 && quantity <= threshold
}
