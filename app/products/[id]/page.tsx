import { ProductDetailBackButton } from "@/components/product-detail-back-button";
import { ProductCommerceDetails } from "@/components/product-commerce-details";
import { SuggestedItems } from "@/components/suggested-items";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProductById, getProducts } from "@/lib/services/product-service";
import { ShieldCheck, Sparkles, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Product } from "@/types/product";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const { products } = await getProducts();
    return products.map((product) => ({ id: product.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | ${product.brand}`,
    description: `Shop ${product.name} by ${product.brand}. Premium fit, expressive design, and dynamic live pricing.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  let relatedProducts: Product[] = [];
  try {
    const { products } = await getProducts({
      filter: { brand: [product.brand] },
    });
    relatedProducts = products
      .filter((entry) => entry.id !== product.id)
      .slice(0, 4);
  } catch {
    relatedProducts = [];
  }

  const mainImage = product.images[0];
  const secondaryImages = product.images.slice(1, 3);

  return (
    <main className={`relative isolate overflow-hidden`}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ProductDetailBackButton />
        </div>

        <section className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="grid gap-4 lg:grid-cols-5">
              <Card className="relative min-h-88 overflow-hidden rounded-3xl py-0 lg:col-span-3 lg:min-h-140">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 40vw"
                  priority
                />
                <Badge
                  variant="secondary"
                  className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]"
                >
                  {product.category}
                </Badge>
              </Card>
              <div className="grid gap-4 lg:col-span-2">
                {secondaryImages.length > 0 ? (
                  secondaryImages.map((image, index) => (
                    <Card
                      key={image}
                      className="relative min-h-44 overflow-hidden rounded-3xl py-0"
                    >
                      <Image
                        src={image}
                        alt={`${product.name} preview ${index + 2}`}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-[1.05]"
                        sizes="(max-width: 640px) 100vw, 20vw"
                      />
                    </Card>
                  ))
                ) : (
                  <Card className="flex min-h-44 items-center justify-center rounded-3xl p-4 text-center text-sm">
                    Additional gallery drops soon.
                  </Card>
                )}
                <Card className="min-h-44 rounded-3xl">
                  <CardContent className="flex h-full flex-col justify-between p-4">
                    <p className="text-xs uppercase tracking-[0.22em]">
                      Delivery Promise
                    </p>
                    <p className="text-2xl font-semibold leading-tight">
                      Delivered in 2-4 days with premium handling.
                    </p>
                    <div className="text-xs uppercase tracking-[0.18em]">
                      Free above SAR 100
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="sticky top-6 rounded-3xl p-0">
              <CardContent className="p-6">
                <p className="mb-2 text-xs uppercase tracking-[0.28em]">
                  {product.brand}
                </p>
                <h1
                  className={`text-4xl leading-[1.03] font-bold tracking-tight lg:text-5xl`}
                >
                  {product.name}
                </h1>

                <ProductCommerceDetails
                  productId={product.id}
                  fallbackPrice={product.price}
                  fallbackOriginalPrice={product.originalPrice}
                  fallbackRating={product.rating}
                  fallbackReviewCount={product.reviewCount}
                  fallbackColors={product.colors ?? []}
                  fallbackSizes={product.sizes}
                  fallbackInStock={product.inStock}
                  fallbackStockQuantity={product.stockQuantity}
                />

                <div className="mt-5">
                  <div className="grid gap-2 text-sm lg:grid-cols-3">
                    <Card size="sm" className="rounded-2xl p-3">
                      <Truck className="mb-1.5 h-4 w-4" />
                      Express Shipping
                    </Card>
                    <Card size="sm" className="rounded-2xl p-3">
                      <ShieldCheck className="mb-1.5 h-4 w-4" />
                      30-day returns
                    </Card>
                    <Card size="sm" className="rounded-2xl p-3">
                      <Sparkles className="mb-1.5 h-4 w-4" />
                      Authentic verified
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <SuggestedItems products={relatedProducts} />
      </div>
    </main>
  );
}
