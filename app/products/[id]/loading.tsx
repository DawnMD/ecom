import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      <Skeleton className="h-10 w-44" />
      <section className="mt-6 grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <div className="grid gap-4 lg:grid-cols-5">
            <Skeleton className="min-h-88 rounded-3xl lg:col-span-3 lg:min-h-140" />
            <div className="grid gap-4 lg:col-span-2">
              <Skeleton className="min-h-44 rounded-3xl" />
              <Skeleton className="min-h-44 rounded-3xl" />
              <Skeleton className="min-h-44 rounded-3xl" />
            </div>
          </div>
        </div>
        <div className="space-y-4 lg:col-span-5">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-10 w-44" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </section>
    </main>
  );
}
