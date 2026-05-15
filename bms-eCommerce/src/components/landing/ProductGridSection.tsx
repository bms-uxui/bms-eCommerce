import { Link } from "react-router";
import SectionHeader from "./SectionHeader";
import ProductCard, { type Product } from "./ProductCard";
import { ChevronRight } from "lucide-react";

export default function ProductGridSection({
  title,
  products,
  showLoadMore = false,
  recommended = false,
}: {
  title: string;
  products: Product[];
  showLoadMore?: boolean;
  recommended?: boolean;
}) {
  return (
    <section className="bg-white rounded-xl lg:rounded-2xl border border-[var(--color-neutral-300)] p-3 sm:p-4 lg:p-6">
      <SectionHeader title={title} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} recommended={recommended} />
        ))}
      </div>
      {showLoadMore && (
        <div className="flex justify-center mt-6">
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] px-6 py-2 rounded-full border border-[var(--color-neutral-300)] transition-colors"
          >
            ดูทั้งหมด
            <ChevronRight size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}
