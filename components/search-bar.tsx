"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "nuqs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Building,
  ChevronDownIcon,
  X,
  Heart,
  SearchIcon,
  ShoppingCart,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useSearch } from "@/hooks/use-search";
import { getProducts } from "@/lib/services/product-service";
import { useWishlistStore } from "@/stores/use-wishlist-store";

const SEARCH_DEBOUNCE_MS = 250;

export const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const wishlistProductIds = useWishlistStore((state) => state.wishlistProductIds);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const hasWishlistHydrated = useWishlistStore((state) => state.hasHydrated);
  const pathname = usePathname();
  const router = useRouter();
  const [draftSearchQuery, setDraftSearchQuery] = useState(searchQuery);
  const wishlistCount = wishlistProductIds.length;
  const wishlistProductsQuery = useQuery({
    queryKey: ["wishlist-products"],
    queryFn: () => getProducts(),
    staleTime: 60_000,
  });
  const wishlistProducts = useMemo(
    () =>
      (wishlistProductsQuery.data?.products ?? [])
        .filter((product) => wishlistProductIds.includes(product.id))
        .sort(
          (a, b) =>
            wishlistProductIds.indexOf(a.id) - wishlistProductIds.indexOf(b.id),
        ),
    [wishlistProductIds, wishlistProductsQuery.data?.products],
  );

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

  return (
    <div className="p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4 md:justify-start md:gap-2">
          <div className="flex items-center gap-2">
            <Building size={24} />
            <span className="text-2xl font-bold">STELLA</span>
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="flex items-center justify-center rounded-full border bg-background p-0"
                  >
                    <Avatar className="size-7">
                      <AvatarImage
                        src="https://flagcdn.com/us.svg"
                        alt="United States"
                      />
                    </Avatar>
                    <ChevronDownIcon className="ml-1 hidden size-4 md:inline-block" />
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem>English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="flex size-10 items-center justify-center rounded-full border bg-background p-0"
                  >
                    <Avatar className="size-8">
                      <AvatarFallback>AR</AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem variant={"destructive"}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex w-full items-center gap-3 md:contents">
          <Field className="flex-1 md:mx-4 md:max-w-xl">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (pathname !== "/") {
                  navigateToResults(draftSearchQuery);
                  return;
                }

                updateSearchQuery(draftSearchQuery);
              }}
            >
              <InputGroup>
                <InputGroupInput
                  id="input-group-search"
                  placeholder="What are you looking for?"
                  value={draftSearchQuery}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setDraftSearchQuery(nextValue);

                    if (pathname === "/") {
                      updateSearchQuery(nextValue);
                    }
                  }}
                />
                <InputGroupAddon align="inline-start">
                  <SearchIcon size={16} />
                </InputGroupAddon>
              </InputGroup>
            </form>
          </Field>

          <div className="flex items-center gap-2 md:gap-4">
            <Button variant={"ghost"} size={"icon"} className="relative">
              <Badge
                variant={"destructive"}
                className="absolute -top-2 -right-2"
              >
                <span className="md:hidden">20</span>
                <span className="hidden md:inline">0</span>
              </Badge>
              <ShoppingCart />
              <span className="sr-only">Cart</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant={"ghost"} size={"icon"} className="relative">
                    {hasWishlistHydrated ? (
                      <Badge
                        variant={"destructive"}
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
                  {!hasWishlistHydrated || wishlistProductsQuery.isPending ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={`wishlist-skeleton-${index}`} className="flex items-center gap-2 rounded-md p-1">
                          <Skeleton className="h-12 w-12 rounded-md" />
                          <div className="flex-1 space-y-1">
                            <Skeleton className="h-3 w-3/4" />
                            <Skeleton className="h-3 w-1/3" />
                          </div>
                          <Skeleton className="h-7 w-7 rounded-md" />
                        </div>
                      ))}
                    </div>
                  ) : wishlistProductsQuery.isError ? (
                    <p className="px-2 py-3 text-xs text-muted-foreground">
                      Could not load wishlist items right now. Please try again.
                    </p>
                  ) : wishlistProducts.length === 0 ? (
                    <p className="px-2 py-3 text-xs text-muted-foreground">
                      Your wishlist is empty. Tap the heart on any product to save it.
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {wishlistProducts.map((product) => (
                        <div key={product.id} className="flex items-center gap-2 rounded-md p-1 hover:bg-accent/50">
                          <Link href={`/products/${product.id}`} className="flex min-w-0 flex-1 items-center gap-2">
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
                              <p className="text-xs text-muted-foreground">SAR {product.price.toFixed(2)}</p>
                            </div>
                          </Link>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0"
                            aria-label={`Remove ${product.name} from wishlist`}
                            onClick={() => removeFromWishlist(product.id)}
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

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant={"ghost"}
                    size={"lg"}
                    className="hidden items-center gap-2 md:flex"
                  >
                    <Avatar size="sm">
                      <AvatarImage
                        src="https://flagcdn.com/us.svg"
                        alt="United States"
                      />
                    </Avatar>
                    <span>English</span>
                    <ChevronDownIcon className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem>English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ModeToggle />

            <Separator orientation="vertical" className="hidden md:block" />

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant={"ghost"}
                    size={"lg"}
                    className="hidden items-center gap-2 md:flex"
                  >
                    <Avatar size="sm">
                      <AvatarFallback>MD</AvatarFallback>
                    </Avatar>
                    <span className="flex flex-col items-start justify-start text-xs font-light">
                      <span>Welcome back </span>
                      <span className="font-bold">John Doe</span>
                    </span>
                    <ChevronDownIcon className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem variant={"destructive"}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
