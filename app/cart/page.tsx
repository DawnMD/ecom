"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "@/lib/services/product-service";
import { useAuthStore } from "@/stores/use-auth-store";
import { useCartStore } from "@/stores/use-cart-store";

const formatPrice = (price: number) =>
  `SAR ${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CartPage() {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const hasAuthHydrated = useAuthStore((state) => state.hasHydrated);
  const hasCartHydrated = useCartStore((state) => state.hasHydrated);
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const productsQuery = useQuery({
    queryKey: ["cart-products"],
    queryFn: () => getProducts(),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (hasAuthHydrated && !authUser) {
      router.replace("/login?next=/cart");
    }
  }, [authUser, hasAuthHydrated, router]);

  const productById = useMemo(
    () =>
      new Map((productsQuery.data?.products ?? []).map((product) => [product.id, product])),
    [productsQuery.data?.products],
  );

  const enrichedItems = useMemo(
    () =>
      items
        .map((item) => ({
          ...item,
          product: productById.get(item.productId),
        }))
        .filter((item) => Boolean(item.product)),
    [items, productById],
  );

  const subtotal = useMemo(
    () =>
      enrichedItems.reduce((total, item) => {
        if (!item.product) {
          return total;
        }

        return total + item.product.price * item.quantity;
      }, 0),
    [enrichedItems],
  );

  if (!hasAuthHydrated || !hasCartHydrated || (hasAuthHydrated && !authUser)) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8">
        <Skeleton className="h-8 w-36" />
        <div className="mt-6 space-y-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Your cart</h1>
        <Button variant="outline" onClick={() => router.push("/")}>
          Continue shopping
        </Button>
      </div>

      {productsQuery.isError ? (
        <Card className="mt-6">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Could not load cart items right now. Please refresh and try again.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {!productsQuery.isError && productsQuery.isPending ? (
        <div className="mt-6 space-y-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : null}

      {!productsQuery.isError && !productsQuery.isPending && enrichedItems.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Your cart is empty. Browse products and add something you love.
            </p>
            <Button className="mt-3" onClick={() => router.push("/")}>
              Browse products
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!productsQuery.isError && !productsQuery.isPending && enrichedItems.length > 0 ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            {enrichedItems.map((item) => {
              if (!item.product) {
                return null;
              }

              return (
                <Card key={`${item.productId}-${item.size}`}>
                  <CardContent className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Size {item.size} - {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.quantity - 1)
                        }
                        aria-label={`Decrease quantity for ${item.product.name}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="min-w-7 text-center text-sm">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.quantity + 1)
                        }
                        aria-label={`Increase quantity for ${item.product.name}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeFromCart(item.productId, item.size)}
                        aria-label={`Remove ${item.product.name} from cart`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <Card className="h-fit">
            <CardHeader className="border-b">
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </main>
  );
}
