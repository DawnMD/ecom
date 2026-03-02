"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  StaticMultiselect,
  StaticMultiselectControl,
  StaticMultiselectInput,
  StaticMultiselectList,
  StaticMultiselectResults,
  StaticMultiselectSelectedBadges,
} from "@/components/ui/static-multiselect";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useFilters } from "@/hooks/use-filters";

export const ProductFilter = () => {
  const {
    filters,
    brandOptions,
    isLoadingFilters,
    selectedMinPrice,
    selectedMaxPrice,
    priceMin,
    priceMax,
    handlePriceRangeChange,
    handleMinPriceChange,
    handleMaxPriceChange,
    setBrandFilter,
    setSizeFilter,
    setColorFilter,
  } = useFilters();

  return (
    <div className="bg-accent p-1.5 rounded-md flex flex-col gap-2">
      <div className="flex items-center justify-between p-1">
        <p>Filters</p>
        <Button variant="link">Advanced</Button>
      </div>

      <Card className="p-2">
        <StaticMultiselect
          value={filters.brand}
          onValueChange={setBrandFilter}
        >
          <StaticMultiselectControl>
            <StaticMultiselectSelectedBadges options={brandOptions} />
            <StaticMultiselectInput placeholder="Search by brand..." />
          </StaticMultiselectControl>
          <StaticMultiselectList>
            <StaticMultiselectResults
              items={brandOptions}
              loading={isLoadingFilters}
              loadingText="Loading brands..."
              emptyText="No brands found."
            />
          </StaticMultiselectList>
        </StaticMultiselect>
      </Card>
      <Card className="p-2 space-y-3">
        {isLoadingFilters ? (
          <p className="text-xs text-muted-foreground">Loading prices...</p>
        ) : null}
        <Slider
          value={[selectedMinPrice, selectedMaxPrice]}
          onValueChange={handlePriceRangeChange}
          min={priceMin}
          max={priceMax}
          step={1}
          disabled={isLoadingFilters}
        />
        <FieldGroup className="grid max-w-sm grid-cols-2">
          <Field>
            <FieldLabel htmlFor="min-price">Min. Price</FieldLabel>
            <Input
              id="min-price"
              type="number"
              min={priceMin}
              max={priceMax}
              value={selectedMinPrice}
              onChange={(event) => handleMinPriceChange(event.target.value)}
              disabled={isLoadingFilters}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="max-price">Max. Price</FieldLabel>
            <Input
              id="max-price"
              type="number"
              min={priceMin}
              max={priceMax}
              value={selectedMaxPrice}
              onChange={(event) => handleMaxPriceChange(event.target.value)}
              disabled={isLoadingFilters}
            />
          </Field>
        </FieldGroup>
      </Card>
      <Card className="p-2 space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Size</p>
          {isLoadingFilters ? (
            <p className="text-xs text-muted-foreground">Loading sizes...</p>
          ) : null}
          <ToggleGroup
            variant="outline"
            spacing={2}
            multiple
            value={filters.size}
            onValueChange={setSizeFilter}
          >
            <ToggleGroupItem
              value="xs"
              aria-label="Toggle XS"
              disabled={isLoadingFilters}
            >
              XS
            </ToggleGroupItem>
            <ToggleGroupItem
              value="s"
              aria-label="Toggle S"
              disabled={isLoadingFilters}
            >
              S
            </ToggleGroupItem>
            <ToggleGroupItem
              value="m"
              aria-label="Toggle M"
              disabled={isLoadingFilters}
            >
              M
            </ToggleGroupItem>
            <ToggleGroupItem
              value="l"
              aria-label="Toggle L"
              disabled={isLoadingFilters}
            >
              L
            </ToggleGroupItem>
            <ToggleGroupItem
              value="xl"
              aria-label="Toggle XL"
              disabled={isLoadingFilters}
            >
              XL
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Color</p>
          {isLoadingFilters ? (
            <p className="text-xs text-muted-foreground">Loading colors...</p>
          ) : null}
          <ToggleGroup
            variant="outline"
            spacing={2}
            multiple
            value={filters.color}
            onValueChange={setColorFilter}
          >
            <ToggleGroupItem
              value="black"
              aria-label="Toggle black"
              className="h-8 w-8 p-0"
              disabled={isLoadingFilters}
            >
              <span className="sr-only">Black</span>
              <span
                aria-hidden
                className="h-4 w-4 rounded-full border border-black/20 bg-black"
              />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="white"
              aria-label="Toggle white"
              className="h-8 w-8 p-0"
              disabled={isLoadingFilters}
            >
              <span className="sr-only">White</span>
              <span
                aria-hidden
                className="h-4 w-4 rounded-full border border-black/20 bg-white"
              />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="blue"
              aria-label="Toggle blue"
              className="h-8 w-8 p-0"
              disabled={isLoadingFilters}
            >
              <span className="sr-only">Blue</span>
              <span
                aria-hidden
                className="h-4 w-4 rounded-full border border-black/20 bg-blue-500"
              />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="red"
              aria-label="Toggle red"
              className="h-8 w-8 p-0"
              disabled={isLoadingFilters}
            >
              <span className="sr-only">Red</span>
              <span
                aria-hidden
                className="h-4 w-4 rounded-full border border-black/20 bg-red-500"
              />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="green"
              aria-label="Toggle green"
              className="h-8 w-8 p-0"
              disabled={isLoadingFilters}
            >
              <span className="sr-only">Green</span>
              <span
                aria-hidden
                className="h-4 w-4 rounded-full border border-black/20 bg-green-500"
              />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Card>
    </div>
  );
};
