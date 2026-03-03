"use client";

import { SearchBar } from "@/components/features/search/search-bar";
import { ShippingBar } from "@/components/layout/shipping-bar";
import { usePathname } from "next/navigation";

const AUTH_PATH_PREFIXES = ["/login", "/auth"];

type AppChromeProps = {
  children: React.ReactNode;
};

const shouldHideGlobalBars = (pathname: string) =>
  AUTH_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const hideGlobalBars = pathname ? shouldHideGlobalBars(pathname) : false;

  return (
    <>
      {!hideGlobalBars ? (
        <>
          <ShippingBar />
          <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
            <SearchBar />
          </header>
        </>
      ) : null}
      {children}
    </>
  );
}
