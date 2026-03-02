import { Banner } from "@/components/banner";
import { PopularitySortDropdown } from "@/components/popularity-sort-dropdown";
import { ProductFilter } from "@/components/product-filter";
import { ViewModeToggle } from "@/components/view-mode-toggle";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <>
      <Banner />
      <div className="p-4 lg:p-8 flex flex-col gap-4 lg:gap-8">
        <p className="text-2xl font-bold">6 products found</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="hidden lg:block lg:col-span-2">
            <ProductFilter />
          </div>
          <div className="lg:col-span-10 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <ViewModeToggle />
              <PopularitySortDropdown />
            </div>
            <Separator />
            <div>gird</div>
          </div>
        </div>
      </div>
    </>
  );
}
