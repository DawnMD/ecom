import { Banner } from "@/components/layout/banner";
import { PopularitySortDropdown } from "@/components/features/products/popularity-sort-dropdown";
import { ProductFilter } from "@/components/features/products/product-filter";
import { ProductGrid } from "@/components/features/products/product-grid";
import { ProductResultsCount } from "@/components/features/products/product-results-count";
import { ViewModeToggle } from "@/components/features/products/view-mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <>
      <Banner />
      <div className="p-4 lg:p-8 flex flex-col gap-4 lg:gap-8">
        <ProductResultsCount />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="hidden lg:block lg:col-span-2">
            <ProductFilter />
          </div>
          <div className="lg:col-span-10 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <ViewModeToggle />
                <PopularitySortDropdown />
              </div>
              <Drawer direction="bottom">
                <DrawerTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full lg:hidden"
                  >
                    Filters
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Filters</DrawerTitle>
                    <DrawerDescription>
                      Refine your product search.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="min-h-0 flex-1 overflow-y-auto p-3">
                    <ProductFilter />
                  </div>
                  <DrawerFooter className="border-t bg-background p-3">
                    <DrawerClose asChild>
                      <Button type="button" className="w-full">
                        Done
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
            <Separator />
            <ProductGrid />
          </div>
        </div>
      </div>
    </>
  );
}
