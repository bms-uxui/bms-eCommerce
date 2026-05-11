import { useState } from "react";
import ProfilePageShell from "../components/landing/ProfilePageShell";
import ProductCard, { type Product } from "../components/landing/ProductCard";
import paracetamol from "../assets/products/p02-paracetamol.jpg";
import vitaminC from "../assets/products/p04-vitamin-c.jpg";
import bpMonitor from "../assets/products/p03-bp-monitor.jpg";
import mask from "../assets/products/p05-mask.jpg";
import skirt from "../assets/products/p01-skirt.jpg";

type FavVariant = "default" | "quote";

type FavItem = {
  product: Product;
  variant: FavVariant;
  flashSale?: boolean;
};

type TabKey = "all" | "quote" | "flashsale";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "quote", label: "สินค้าใบเสนอราคา" },
  { key: "flashsale", label: "สินค้า Flashsale" },
];

const FAVORITES: FavItem[] = [
  {
    variant: "default",
    flashSale: true,
    product: { id: "f1", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใส", price: 420, originalPrice: 790, discount: 20, image: skirt, rating: 4.6, sold: "17.5k", freeShipping: true, shopDiscount: true, cod: true },
  },
  {
    variant: "default",
    product: { id: "f2", name: "ยาพาราเซตามอล 1000 mg.", price: 420, originalPrice: 790, discount: 20, image: paracetamol, rating: 4.6, sold: "14.5k", freeShipping: true, shopDiscount: true, cod: true },
  },
  {
    variant: "default",
    product: { id: "f3", name: "วิตามินซี 500 mg เสริมภูมิคุ้มกัน", price: 150, originalPrice: 200, discount: 25, image: vitaminC, rating: 4.8, sold: "9.2k", freeShipping: true, shopDiscount: true, cod: true },
  },
  {
    variant: "quote",
    product: { id: "f4", name: "ยาพาราเซตามอล 1000 mg.", price: 420, originalPrice: 790, discount: 20, image: paracetamol, rating: 4.6, sold: "3", freeShipping: true, shopDiscount: true, cod: true },
  },
  {
    variant: "quote",
    product: { id: "f5", name: "เครื่องวัดความดันโลหิตอัตโนมัติ", price: 1200, originalPrice: 1500, discount: 20, image: bpMonitor, rating: 4.7, sold: "120", freeShipping: true, shopDiscount: true, cod: true },
  },
  {
    variant: "quote",
    product: { id: "f6", name: "หน้ากากอนามัยทางการแพทย์ 50 ชิ้น", price: 89, originalPrice: 120, discount: 26, image: mask, rating: 4.5, sold: "8", freeShipping: true, shopDiscount: true, cod: true },
  },
  {
    variant: "quote",
    product: { id: "f7", name: "แคลเซียมเสริมกระดูกแข็งแรง พร้อมวิตามินดี", price: 660, originalPrice: 800, discount: 18, image: vitaminC, rating: 4.6, sold: "66", freeShipping: true, shopDiscount: true, cod: true },
  },
  {
    variant: "default",
    flashSale: true,
    product: { id: "f8", name: "น้ำมันปลาโอเมก้า 3 บำรุงสมองและหัวใจ", price: 480, originalPrice: 600, discount: 20, image: vitaminC, rating: 4.6, sold: "12.5k", freeShipping: true, shopDiscount: true, cod: true },
  },
  {
    variant: "default",
    product: { id: "f9", name: "เจลล้างมือแอลกอฮอล์ 70% ขนาด 500 ml", price: 129, originalPrice: 159, discount: 19, image: mask, rating: 4.4, sold: "5.8k", freeShipping: true, shopDiscount: true, cod: true },
  },
  {
    variant: "quote",
    product: { id: "f10", name: "ยาพาราเซตามอล 1000 mg.", price: 420, originalPrice: 790, discount: 20, image: paracetamol, rating: 4.6, sold: "3", freeShipping: true, shopDiscount: true, cod: true },
  },
];

export default function Favorites() {
  const [active, setActive] = useState<TabKey>("all");

  const visible = FAVORITES.filter((f) => {
    if (active === "all") return true;
    if (active === "quote") return f.variant === "quote";
    return !!f.flashSale;
  });
  const allCount = FAVORITES.length;

  return (
    <ProfilePageShell activeKey="wishlist">
      <div
        className="page-section-in bg-white rounded-2xl border border-[var(--color-neutral-300)] flex flex-col overflow-hidden"
        style={{ animationDelay: "200ms" }}
      >
        {/* Tab strip */}
        <div className="px-2 py-2 border-b border-[var(--color-neutral-300)]">
          <div className="bg-[var(--color-neutral-200)] rounded-lg p-1 flex h-10 overflow-x-auto scrollbar-none">
            {TABS.map((tab) => {
              const isActive = active === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActive(tab.key)}
                  className={[
                    "shrink-0 flex items-center justify-center gap-2 h-8 px-4 py-1 rounded text-[14px] font-medium tracking-[-0.006em] transition",
                    isActive
                      ? "bg-[var(--color-primary)] text-white shadow-[0_0_1px_0_rgba(29,33,45,0.2),0_0_2px_0_rgba(29,33,45,0.08),0_2px_4px_0_rgba(29,33,45,0.08)]"
                      : "text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)]",
                  ].join(" ")}
                >
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.key === "all" && allCount > 0 && (
                    <span className="min-w-5 h-5 px-1 rounded-full bg-[var(--color-critical)] text-white text-[12px] flex items-center justify-center">
                      {allCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product grid */}
        <div className="p-4">
          {visible.length === 0 ? (
            <div className="py-16 text-center text-[14px] text-[var(--color-neutral-500)]">
              ยังไม่มีสินค้าที่ถูกใจ
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
              {visible.map((f) => (
                <ProductCard
                  key={f.product.id}
                  product={f.product}
                  variant={f.variant}
                  flashSale={!!f.flashSale}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProfilePageShell>
  );
}
