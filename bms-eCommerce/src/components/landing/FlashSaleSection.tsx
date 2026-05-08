import { Zap } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ProductCarousel from "./ProductCarousel";
import CountdownTimer from "./CountdownTimer";
import type { Product } from "./ProductCard";

export default function FlashSaleSection({ products }: { products: Product[] }) {
  return (
    <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-6">
      <SectionHeader
        title={
          <span className="bg-gradient-to-r from-[var(--color-flash-from)] to-[var(--color-flash-to)] bg-clip-text text-transparent">
            FLASHSALE
          </span>
        }
        badge={
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-flash-from)] to-[var(--color-flash-to)] flex items-center justify-center text-white">
            <Zap size={22} className="fill-white" />
          </div>
        }
        trailing={<CountdownTimer hours={12} minutes={34} seconds={56} />}
      />
      <ProductCarousel products={products} flashSale />
    </section>
  );
}
