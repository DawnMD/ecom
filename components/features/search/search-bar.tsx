"use client";

import { debounce } from "nuqs";
import { usePathname, useRouter } from "next/navigation";
import { Building } from "lucide-react";
import { useEffect, useState } from "react";
import { HeaderAccountMenu } from "@/components/header/header-account-menu";
import { HeaderCartButton } from "@/components/header/header-cart-button";
import {
  HeaderCompactLanguageMenu,
  HeaderLocaleThemeControls,
} from "@/components/header/header-locale-theme-controls";
import { HeaderSearchInput } from "@/components/header/header-search-input";
import { HeaderWishlistMenu } from "@/components/header/header-wishlist-menu";
import { useCart } from "@/hooks/use-cart";
import { useSearch } from "@/hooks/use-search";
import { useWishlistProducts } from "@/hooks/use-wishlist-products";
import { useAuthStore } from "@/stores/use-auth-store";
import { useWishlistStore } from "@/stores/use-wishlist-store";
import Link from "next/link";

const SEARCH_DEBOUNCE_MS = 250;

export const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const authUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const hasAuthHydrated = useAuthStore((state) => state.hasHydrated);
  const { itemCount: cartItemCount, hasCartHydrated } = useCart();
  const wishlistProductIds = useWishlistStore(
    (state) => state.wishlistProductIds,
  );
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist,
  );
  const hasWishlistHydrated = useWishlistStore((state) => state.hasHydrated);
  const pathname = usePathname();
  const router = useRouter();
  const [draftSearchQuery, setDraftSearchQuery] = useState(searchQuery);
  const isCartRoute = pathname === "/cart" || pathname.startsWith("/cart/");
  const wishlistCount = wishlistProductIds.length;
  const {
    wishlistProducts,
    isPending: isWishlistPending,
    isError: isWishlistError,
  } = useWishlistProducts({
    wishlistProductIds,
    hasWishlistHydrated,
  });

  useEffect(() => {
    setDraftSearchQuery(searchQuery);
  }, [searchQuery]);

  const updateSearchQuery = (value: string) => {
    setSearchQuery(value, {
      limitUrlUpdates: debounce(SEARCH_DEBOUNCE_MS),
    });
  };

  const navigateToResults = (value: string) => {
    const normalizedValue = value.trim();
    if (!normalizedValue) {
      router.push("/");
      return;
    }

    router.push(`/?search=${encodeURIComponent(normalizedValue)}`);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSearchSubmit = () => {
    if (pathname !== "/") {
      navigateToResults(draftSearchQuery);
      return;
    }

    updateSearchQuery(draftSearchQuery);
  };

  const handleDraftSearchChange = (nextValue: string) => {
    setDraftSearchQuery(nextValue);

    if (pathname === "/") {
      updateSearchQuery(nextValue);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4 md:justify-start md:gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Building size={24} />
            <span className="text-2xl font-bold">STELLA</span>
          </Link>
          <div className="flex items-center gap-3 md:hidden">
            <HeaderCompactLanguageMenu />
            <HeaderAccountMenu
              compact
              hasAuthHydrated={hasAuthHydrated}
              authUser={authUser}
              onLogout={handleLogout}
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-3 md:contents">
          {!isCartRoute ? (
            <HeaderSearchInput
              value={draftSearchQuery}
              onValueChange={handleDraftSearchChange}
              onSubmit={handleSearchSubmit}
            />
          ) : null}

          <div className="ml-auto flex items-center gap-2 md:gap-4">
            <HeaderCartButton
              hasCartHydrated={hasCartHydrated}
              cartItemCount={cartItemCount}
            />
            <HeaderWishlistMenu
              hasWishlistHydrated={hasWishlistHydrated}
              wishlistCount={wishlistCount}
              isWishlistPending={isWishlistPending}
              isWishlistError={isWishlistError}
              wishlistProducts={wishlistProducts}
              onRemoveWishlistItem={removeFromWishlist}
            />
            <HeaderLocaleThemeControls />
            <HeaderAccountMenu
              hasAuthHydrated={hasAuthHydrated}
              authUser={authUser}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
