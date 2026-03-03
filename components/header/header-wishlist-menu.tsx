"use client";

import { Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { InlineQueryFeedback } from "@/components/ui/inline-query-feedback";
import type { Product } from "@/types/product";

type HeaderWishlistMenuProps = {
  hasWishlistHydrated: boolean;
  wishlistCount: number;
  isWishlistPending: boolean;
  isWishlistError: boolean;
  wishlistProducts: Product[];
  onRemoveWishlistItem: (productId: string) => void;
};

export const HeaderWishlistMenu = ({
  hasWishlistHydrated,
  wishlistCount,
  isWishlistPending,
  isWishlistError,
  wishlistProducts,
  onRemoveWishlistItem,
}: HeaderWishlistMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      render={
        <Button variant="ghost" size="icon" className="relative">
          {hasWishlistHydrated ? (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 min-w-5 justify-center px-1.5"
            >
              {wishlistCount}
            </Badge>
          ) : (
            <Skeleton className="absolute -top-2 -right-2 h-5 w-5 rounded-full" />
          )}
          <Heart />
          <span className="sr-only">Wishlist</span>
        </Button>
      }
    />
    <DropdownMenuContent align="end" className="w-80 p-0">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <p className="text-sm font-semibold">Wishlist</p>
        {hasWishlistHydrated ? (
          <Badge variant="secondary">{wishlistCount} items</Badge>
        ) : (
          <Skeleton className="h-5 w-16 rounded-full" />
        )}
      </div>
      <div className="max-h-80 overflow-auto p-2">
        {!hasWishlistHydrated || isWishlistPending ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`wishlist-skeleton-${index}`}
                className="flex items-center gap-2 rounded-md p-1"
              >
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            ))}
          </div>
        ) : isWishlistError ? (
          <InlineQueryFeedback
            className="m-1 p-3 text-xs"
            message="Could not load wishlist items right now."
          />
        ) : wishlistProducts.length === 0 ? (
          <p className="px-2 py-3 text-xs text-muted-foreground">
            Your wishlist is empty. Tap the heart on any product to save it.
          </p>
        ) : (
          <div className="space-y-1">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-2 rounded-md p-1 hover:bg-accent/50"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="flex min-w-0 flex-1 items-center gap-2"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      SAR {product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  aria-label={`Remove ${product.name} from wishlist`}
                  onClick={() => onRemoveWishlistItem(product.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
);
