import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";

export const Banner = () => {
  return (
    <section className="relative h-136 w-full overflow-hidden lg:h-120">
      <Image
        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Banner"
        fill
        sizes="100vw"
        priority
        className="object-cover object-[62%_center] lg:object-center"
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/25 via-black/10 to-transparent" />

      <div className="relative flex h-full items-start justify-between px-5 pt-8 lg:px-14 lg:pt-14">
        <h1 className="max-w-56 text-7xl font-light leading-[1.05] text-white lg:max-w-xs lg:text-7xl">
          Simple
          <br />
          <span className="ml-5 lg:ml-8">is More</span>
        </h1>

        <Button
          variant={"outline"}
          size={"lg"}
          className="hidden items-center justify-center rounded-full lg:flex"
        >
          <ChevronDownIcon size={16} />
          <span className="sr-only">Scroll down</span>
        </Button>
      </div>

      <div className="absolute right-10 top-1/2 text-base leading-tight font-light text-white/90 lg:hidden">
        DESIGNED TO
        <br />
        STAND OUT
      </div>

      <div className="absolute bottom-10 left-6 text-3xl leading-none font-light text-white/90 lg:hidden">
        LIMITED-EDITIONS
        <br />
        STYLES
      </div>
    </section>
  );
};
