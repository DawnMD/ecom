"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/services/product-service";

export const useWishlistProducts = ({
  wishlistProductIds,
  hasWishlistHydrated,
}: {
  wishlistProductIds: string[];
  hasWishlistHydrated: boolean;
}) => {
  const shouldFetchWishlistProducts =
    hasWishlistHydrated && wishlistProductIds.length > 0;

  const wishlistProductsQuery = useQuery({
    queryKey: ["wishlist-products"],
    queryFn: () => getProducts(),
    staleTime: 60_000,
    enabled: shouldFetchWishlistProducts,
  });

  const products = wishlistProductsQuery.data?.products ?? [];
  const wishlistProducts = products
    .filter((product) => wishlistProductIds.includes(product.id))
    .sort(
      (a, b) => wishlistProductIds.indexOf(a.id) - wishlistProductIds.indexOf(b.id),
    );

  return {
    wishlistProducts,
    isPending: shouldFetchWishlistProducts && wishlistProductsQuery.isPending,
    isError: shouldFetchWishlistProducts && wishlistProductsQuery.isError,
  };
};
