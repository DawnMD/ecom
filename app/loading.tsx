import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="p-4 lg:p-8">
      <Skeleton className="h-8 w-64" />
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="hidden lg:col-span-2 lg:block">
          <Skeleton className="h-112 w-full rounded-xl" />
        </div>
        <div className="space-y-4 lg:col-span-10">
          <Skeleton className="h-10 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={`app-loading-${index}`} className="aspect-4/5 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
