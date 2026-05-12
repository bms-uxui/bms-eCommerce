import { useState } from "react";
import { Link } from "react-router";
import Icon from "../components/landing/Icon";
import { AffiliateHeader, AffiliateSidebar } from "../components/AffiliateChrome";
import { makeProducts } from "../components/landing/mockData";

const RATES = [1.5, 2.0, 3.0, 2.5, 1.8, 1.2, 2.2, 3.5];
const GRID_PRODUCTS = makeProducts(18).map((p, i) => ({ ...p, rate: RATES[i % RATES.length] }));

const CATEGORIES = [
  "ทั้งหมด", "เสื้อผ้าแฟชั่น", "รองเท้า", "กระเป๋า", "เครื่องสำอาง",
  "เครื่องประดับ", "นาฬิกา", "หมวก", "ของใช้ในบ้าน",
];

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 text-[13px] text-[var(--color-neutral-500)]">
      <Link to="/affiliate/overview" className="hover:text-[var(--color-primary)]">
        สินค้าลิงก์คอมมิชชัน
      </Link>
      <span>/</span>
      <span className="text-[var(--color-neutral-900)]">คอมมิชชันสินค้า</span>
    </nav>
  );
}

function CommissionCard({ product }: { product: (typeof GRID_PRODUCTS)[number] }) {
  return (
    <div className="flex flex-col bg-white border border-[var(--color-neutral-300)] rounded-lg overflow-hidden hover:shadow-md hover:border-[var(--color-primary-400)] transition-all">
      <div className="relative aspect-square overflow-hidden">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
        {product.discount !== undefined && (
          <div className="absolute top-0 right-0 w-10 h-5 rounded-bl-xl bg-gradient-to-b from-[var(--color-primary-400)] via-[var(--color-primary)] to-[var(--color-primary-600)] flex items-center justify-center">
            <span className="text-white text-[12px] font-semibold">-{product.discount}%</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-2.5 flex-1">
        <p className="text-[13px] text-[var(--color-neutral-900)] leading-snug line-clamp-2 min-h-[34px]">
          {product.name}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[15px] font-bold text-[var(--color-primary)]">฿{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-[11px] text-[var(--color-neutral-500)] line-through">
              ฿{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <p className="text-[12px] text-[var(--color-positive-700)] font-medium">
          คอมมิชชัน สูงสุด {product.rate.toFixed(1)}%
        </p>
        <button
          type="button"
          className="mt-1 h-8 rounded-lg bg-[var(--color-primary)] text-white text-[13px] font-medium inline-flex items-center justify-center gap-1 hover:brightness-110 transition"
        >
          <Icon name="link" size={14} />
          รับลิงก์
        </button>
      </div>
    </div>
  );
}

export default function ProductCommission() {
  const [sort, setSort] = useState("latest");
  const [cat, setCat] = useState("ทั้งหมด");
  const [page, setPage] = useState(1);

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <AffiliateHeader />
      <div className="flex">
        <AffiliateSidebar active="คอมมิชชันสินค้า" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 flex flex-col gap-5 pb-24">
          <Breadcrumb />

          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-5 flex flex-col gap-4">
            <h1 className="text-[20px] font-bold text-[var(--color-primary-700)]">คอมมิชชันสินค้า</h1>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-lg border border-[var(--color-neutral-300)] bg-white">
                <Icon name="search" size={18} className="text-[var(--color-neutral-500)]" />
                <input
                  placeholder="ค้นหาสินค้า"
                  className="flex-1 min-w-0 bg-transparent text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] outline-none"
                />
              </div>
              <button
                type="button"
                className="h-10 px-6 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
              >
                ค้นหา
              </button>
            </div>

            {/* Category chips + sort */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {CATEGORIES.map((c) => {
                  const active = cat === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCat(c)}
                      className={[
                        "h-8 px-3 rounded-lg text-[13px] whitespace-nowrap transition-colors",
                        active
                          ? "bg-[var(--color-primary-100)] text-[var(--color-primary)] font-medium"
                          : "text-[var(--color-neutral-700)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                      ].join(" ")}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 text-[13px] shrink-0">
                <span className="text-[var(--color-neutral-600)]">เรียงตามคำสั่งซื้อ</span>
                {[
                  { id: "latest", label: "ล่าสุด" },
                  { id: "rate", label: "คอมมิชชัน (%)" },
                ].map((c) => {
                  const active = sort === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSort(c.id)}
                      className={[
                        "h-8 px-3 rounded-lg text-[13px] transition-colors",
                        active
                          ? "bg-[var(--color-primary)] text-white font-medium"
                          : "border border-[var(--color-neutral-300)] text-[var(--color-neutral-700)] hover:border-[var(--color-primary-400)]",
                      ].join(" ")}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {GRID_PRODUCTS.map((p) => (
                <CommissionCard key={p.id} product={p} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-[14px] text-[var(--color-neutral-600)]">
                <span>10,488 รายการ</span>
                <span className="flex items-center gap-1">
                  แสดง
                  <span className="inline-flex items-center gap-2 h-8 px-2.5 rounded-lg border border-[var(--color-neutral-300)] text-[var(--color-neutral-900)] font-medium">
                    20
                    <Icon name="chevron-down" size={14} className="text-[var(--color-neutral-600)]" />
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="min-w-8 h-8 px-2 rounded-lg text-[var(--color-neutral-700)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] flex items-center justify-center"
                >
                  <Icon name="chevron-left" size={16} />
                </button>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={[
                      "min-w-8 h-8 px-2 rounded-lg text-[14px] flex items-center justify-center transition-colors",
                      n === page
                        ? "bg-[var(--color-primary)] text-white font-medium"
                        : "text-[var(--color-neutral-700)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                    ].join(" ")}
                  >
                    {n}
                  </button>
                ))}
                <span className="px-1 text-[var(--color-neutral-500)]">…</span>
                <button
                  type="button"
                  onClick={() => setPage(12)}
                  className="min-w-8 h-8 px-2 rounded-lg text-[14px] text-[var(--color-neutral-700)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] flex items-center justify-center"
                >
                  12
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="min-w-8 h-8 px-2 rounded-lg text-[var(--color-neutral-700)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] flex items-center justify-center"
                >
                  <Icon name="chevron-right" size={16} />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <div className="sticky bottom-0 z-20 bg-[var(--color-primary)] text-white">
        <div className="flex items-center justify-between gap-4 px-4 sm:px-8 py-3 ml-0 lg:ml-[232px]">
          <label className="flex items-center gap-2 text-[14px] cursor-pointer">
            <input type="checkbox" className="accent-white w-4 h-4" />
            เลือกสินค้าคอมมิชชันทั้งหมดในหน้านี้
          </label>
          <div className="flex items-center gap-4">
            <span className="text-[14px]">0/100</span>
            <button
              type="button"
              className="h-9 px-4 rounded-lg bg-white text-[var(--color-primary)] text-[14px] font-medium hover:bg-white/90 transition"
            >
              รับลิงก์แบบทันทีทั้งหมด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
