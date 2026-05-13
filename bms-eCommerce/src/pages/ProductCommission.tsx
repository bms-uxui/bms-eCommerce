import { useState } from "react";
import { Link } from "react-router";
import Icon from "../components/landing/Icon";
import Pagination from "../components/Pagination";
import TabBar from "../components/landing/TabBar";
import { AffiliateHeader, AffiliateSidebar } from "../components/AffiliateChrome";
import CommissionBulkBar from "../components/CommissionBulkBar";
import CommissionProductCard from "../components/CommissionProductCard";
import { makeProducts } from "../components/landing/mockData";

const RATES = [48.0, 12.5, 30.0, 25.0, 18.0, 12.0, 22.0, 35.0];
const SOLD = ["12.3k", "8.7k", "1.2k", "640", "3.4k", "9.2k", "15k", "210"];
const GRID_PRODUCTS = makeProducts(12).map((p, i) => ({
  ...p,
  rate: RATES[i % RATES.length],
  sold: SOLD[i % SOLD.length],
}));

const CATEGORIES = [
  "ทั้งหมด",
  "เครื่องประดับ",
  "เครื่องแต่งกาย",
  "ของใช้ในบ้าน",
  "อุปกรณ์อิเล็กทรอนิกส์",
  "อาหารและเครื่องดื่ม",
  "ผลิตภัณฑ์เพื่อสุขภาพ",
  "ผลิตภัณฑ์ความงาม",
] as const;
type Cat = (typeof CATEGORIES)[number];

const SORTS = [
  { key: "latest" as const, label: "ล่าสุด" },
  { key: "rate" as const, label: "คอมมิชชัน (%)" },
];
type SortKey = (typeof SORTS)[number]["key"];

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

export default function ProductCommission() {
  const [sort, setSort] = useState<SortKey>("latest");
  const [cat, setCat] = useState<Cat>("ทั้งหมด");
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const allOnPage = GRID_PRODUCTS.length > 0 && GRID_PRODUCTS.every((p) => checked[p.id]);
  const toggleAll = () =>
    setChecked(allOnPage ? {} : Object.fromEntries(GRID_PRODUCTS.map((p) => [p.id, true])));
  const selectedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <AffiliateHeader />
      <div className="flex">
        <AffiliateSidebar active="คอมมิชชันสินค้า" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 flex flex-col gap-5 pb-24">
          <Breadcrumb />

          {/* Filter bar */}
          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-5 flex flex-col gap-4">
            <h1 className="text-[16px] font-semibold text-[var(--color-neutral-900)]">คอมมิชชันสินค้า</h1>
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="flex items-center gap-3 lg:w-[492px]">
                <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-lg border border-[var(--color-neutral-300)] bg-white">
                  <Icon name="search" size={18} className="text-[var(--color-neutral-500)]" />
                  <input
                    placeholder="ค้นหาสินค้าทั้งหมด"
                    className="flex-1 min-w-0 bg-transparent text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="h-10 w-20 shrink-0 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
                >
                  ค้นหา
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] lg:ml-auto">
                <span className="text-[var(--color-neutral-700)] whitespace-nowrap">เรียงลำดับตาม</span>
                <div className="flex items-center gap-1 bg-[var(--color-neutral-200)] rounded-lg p-1">
                  {SORTS.map((s) => {
                    const active = sort === s.key;
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setSort(s.key)}
                        className={[
                          "h-8 px-3 rounded text-[14px] font-medium transition whitespace-nowrap",
                          active
                            ? "bg-[var(--color-primary)] text-white shadow-[0_0_1px_0_rgba(29,33,45,0.2),0_0_2px_0_rgba(29,33,45,0.08),0_2px_4px_0_rgba(29,33,45,0.08)]"
                            : "text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)]",
                        ].join(" ")}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Category tabs + product grid + pagination */}
          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] overflow-hidden flex flex-col">
            <TabBar items={CATEGORIES.map((c) => ({ key: c, label: c }))} active={cat} onChange={setCat} />
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {GRID_PRODUCTS.map((p) => (
                <CommissionProductCard
                  key={p.id}
                  product={p}
                  checked={!!checked[p.id]}
                  onToggle={() => setChecked((c) => ({ ...c, [p.id]: !c[p.id] }))}
                />
              ))}
            </div>
            <div className="px-4 pb-4">
              <Pagination page={page} onPageChange={setPage} />
            </div>
          </section>
        </main>
      </div>
      <CommissionBulkBar selectedCount={selectedCount} allChecked={allOnPage} onToggleAll={toggleAll} />
    </div>
  );
}
