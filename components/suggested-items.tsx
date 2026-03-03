import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { createSerializer, parseAsNativeArrayOf, parseAsString } from "nuqs/server";
import { Card, CardContent } from "@/components/ui/card";
import { SuggestedItemPrice } from "./suggested-item-price";

const productBrandSearchSerializer = createSerializer({
  brand: parseAsNativeArrayOf(parseAsString),
});

const SuggestedItemCard = ({ item }: { item: Product }) => (
  <Link href={`/products/${item.id}`} className="group block">
    <Card className="h-full gap-0 overflow-hidden rounded-2xl py-0">
      <div className="relative aspect-4/5 overflow-hidden">
        <Image
          src={item.images[0]}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <CardContent className="space-y-1 p-3">
        <p className="text-xs uppercase tracking-[0.18em]">{item.brand}</p>
        <p className="line-clamp-1 text-lg font-semibold">{item.name}</p>
        <SuggestedItemPrice productId={item.id} fallbackPrice={item.price} />
      </CardContent>
    </Card>
  </Link>
);

export const SuggestedItems = ({ products }: { products: Product[] }) => {
  if (!products.length) return null;

  return (
    <section className="space-y-4 pt-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold lg:text-3xl">
          More From {products[0].brand}
        </h2>
        <Link
          className="text-primary underline-offset-4 hover:underline"
          href={productBrandSearchSerializer("/", { brand: [products[0].brand] })}
        >
          See all
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        {products.map((item) => (
          <SuggestedItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};
