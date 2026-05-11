import { useMemo, useState } from "react";
import { SellerHeader } from "../components/SellerChrome";
import Icon from "../components/landing/Icon";
import ProductCard, { type Product } from "../components/landing/ProductCard";
import ProductDetailHero from "../components/landing/ProductDetailHero";
import { DetailsCard, ReviewsCard } from "./ProductDetail";
import { makeProducts } from "../components/landing/mockData";
import { StoreHero, SegmentedTabs, type Tab } from "./StoreProfile";
import paracetamol from "../assets/products/p02-paracetamol.jpg";

function ProductQuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <button type="button" aria-label="ปิด" onClick={onClose} className="fixed inset-0 bg-black/30" />
      <div className="relative w-full max-w-[1240px] bg-[var(--color-bg)] rounded-2xl shadow-[0_16px_48px_rgba(29,33,45,0.2)] my-4 p-4 sm:p-6 space-y-3">
        <button
          type="button"
          aria-label="ปิด"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white border border-[var(--color-neutral-300)] flex items-center justify-center text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-200)] transition-colors"
        >
          <Icon name="close" size={18} />
        </button>

        <ProductDetailHero
          product={{
            name: product.name,
            rating: product.rating,
            sold: product.sold,
            reviews: "1k",
            price: product.price,
            originalPrice: product.originalPrice ?? Math.round(product.price * 1.4),
            discount: product.discount ?? 40,
            flashSale: true,
            countdown: { hh: "12", mm: "13", ss: "08" },
            shipping: { eta: "วันที่ 1 เม.ย. - 3 เม.ย.", freeShipping: true },
            sizes: ["ไซส์ SS", "ไซส์ S", "ไซส์ M", "ไซส์ L", "ไซส์ XL"],
            variants: ["ตัวเลือก 1", "ตัวเลือก 2", "ตัวเลือก 3", "ตัวเลือก 4", "ตัวเลือก 5"],
            stock: 10,
            likes: 100,
            gallery: Array.from({ length: 8 }, () => product.image || paracetamol),
            isMedical: true,
          }}
        />
        <DetailsCard />
        <ReviewsCard />
      </div>
    </div>
  );
}

export default function SellerProducts() {
  const [tab, setTab] = useState<Tab>("ทั้งหมด");
  const [quickView, setQuickView] = useState<Product | null>(null);
  const products = useMemo(() => makeProducts(30), []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SellerHeader active="storefront" />

      <StoreHero />

      <main className="max-w-[1240px] mx-auto px-3 sm:px-4 lg:px-5 pt-6 pb-12 space-y-6">
        <div className="page-section-in" style={{ animationDelay: "120ms" }}>
          <SegmentedTabs value={tab} onChange={setTab} />
        </div>

        <div
          className="page-section-in grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
          style={{ animationDelay: "200ms" }}
        >
          {products.map((p, i) => (
            <div
              key={p.id}
              className="cursor-pointer"
              onClickCapture={(e) => {
                e.preventDefault();
                setQuickView(p);
              }}
            >
              <ProductCard product={p} flashSale={i % 3 === 0} />
            </div>
          ))}
        </div>
      </main>

      {quickView && <ProductQuickView product={quickView} onClose={() => setQuickView(null)} />}
    </div>
  );
}
