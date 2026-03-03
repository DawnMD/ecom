"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
    sizeOptions,
    colorOptions,
    isLoadingFilters,
    isFilterOptionsError,
    refetchFilterOptions,
    filterOptionsErrorMessage,
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

  const getColorSwatchStyle = (color: string) => ({
    backgroundColor: color.toLowerCase(),
  });
  const loadingPriceMin = 0;
  const loadingPriceMax = 1;

  return (
    <div className="bg-accent p-1.5 rounded-md flex flex-col gap-2">
      <div className="flex items-center justify-between p-1">
        <p>Filters</p>
        <Button variant="link">Advanced</Button>
      </div>

      {isFilterOptionsError ? (
        <Card className="p-3 space-y-3">
          <p className="text-sm text-muted-foreground">
            {filterOptionsErrorMessage}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetchFilterOptions()}
          >
            Retry filters
          </Button>
        </Card>
      ) : null}

      {!isFilterOptionsError ? (
        <>
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
              <Skeleton className="h-4 w-28" />
            ) : null}
            <Slider
              value={
                isLoadingFilters
                  ? [loadingPriceMin, loadingPriceMax]
                  : [selectedMinPrice, selectedMaxPrice]
              }
              onValueChange={handlePriceRangeChange}
              min={isLoadingFilters ? loadingPriceMin : priceMin}
              max={isLoadingFilters ? loadingPriceMax : priceMax}
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
                  value={isLoadingFilters ? loadingPriceMin : selectedMinPrice}
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
                  value={isLoadingFilters ? loadingPriceMax : selectedMaxPrice}
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
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-14" />
                  <Skeleton className="h-8 w-14" />
                  <Skeleton className="h-8 w-14" />
                </div>
              ) : (
                <ToggleGroup
                  variant="outline"
                  spacing={2}
                  multiple
                  value={filters.size}
                  onValueChange={setSizeFilter}
                >
                  {sizeOptions.map((size) => (
                    <ToggleGroupItem key={size} value={size} aria-label={`Toggle ${size}`}>
                      {size}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Color</p>
              {isLoadingFilters ? (
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              ) : (
                <ToggleGroup
                  variant="outline"
                  spacing={2}
                  multiple
                  value={filters.color}
                  onValueChange={setColorFilter}
                >
                  {colorOptions.map((color) => (
                    <ToggleGroupItem
                      key={color}
                      value={color}
                      aria-label={`Toggle ${color}`}
                      className="h-8 w-8 p-0"
                    >
                      <span className="sr-only">{color}</span>
                      <span
                        aria-hidden
                        className="h-4 w-4 rounded-full border border-black/20"
                        style={getColorSwatchStyle(color)}
                      />
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
};
