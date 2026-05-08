import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import ProductCard, { type Product } from "./ProductCard";

export default function ProductCarousel({
  products,
  flashSale = false,
  variant = "default",
}: {
  products: Product[];
  flashSale?: boolean;
  variant?: "default" | "quote";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    ref.current?.scrollBy({
      left: dir === "left" ? -600 : 600,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        aria-label="เลื่อนซ้าย"
        className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[var(--color-neutral-300)] shadow-md items-center justify-center text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary-400)] active:scale-95 transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => scroll("right")}
        aria-label="เลื่อนขวา"
        className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[var(--color-neutral-300)] shadow-md items-center justify-center text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary-400)] active:scale-95 transition-all"
      >
        <ChevronRight size={20} />
      </button>

      <div
        ref={ref}
        className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-none scroll-smooth -mx-1 px-1"
      >
        {products.map((p) => (
          <div key={p.id} className="shrink-0 w-[150px] sm:w-[170px] lg:w-[190px]">
            <ProductCard product={p} flashSale={flashSale} variant={variant} />
          </div>
        ))}
      </div>
    </div>
  );
}
