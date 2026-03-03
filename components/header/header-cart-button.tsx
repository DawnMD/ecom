"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type HeaderCartButtonProps = {
  hasCartHydrated: boolean;
  cartItemCount: number;
};

export const HeaderCartButton = ({
  hasCartHydrated,
  cartItemCount,
}: HeaderCartButtonProps) => (
  <Link
    href="/cart"
    aria-label="Go to cart"
    className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
  >
    {hasCartHydrated ? (
      <Badge
        variant="destructive"
        className="absolute -top-2 -right-2 min-w-5 justify-center px-1.5"
      >
        {cartItemCount}
      </Badge>
    ) : (
      <Skeleton className="absolute -top-2 -right-2 h-5 w-5 rounded-full" />
    )}
    <ShoppingCart />
    <span className="sr-only">Cart</span>
  </Link>
);
