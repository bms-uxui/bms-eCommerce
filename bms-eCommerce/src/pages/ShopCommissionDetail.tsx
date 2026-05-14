import { useState } from "react";
import { Link, useParams } from "react-router";
import Icon from "../components/landing/Icon";
import SearchIcon from "../components/SearchIcon";
import Pagination from "../components/Pagination";
import { AffiliateHeader, AffiliateSidebar } from "../components/AffiliateChrome";
import CommissionBulkBar from "../components/CommissionBulkBar";
import CommissionProductCard from "../components/CommissionProductCard";
import { makeProducts } from "../components/landing/mockData";

const RATES = [1.5, 2.0, 3.0, 2.5, 1.8, 1.2, 2.2, 3.5];
const SOLD = ["12.3k", "8.7k", "1.2k", "640", "3.4k", "9.2k", "15k", "210"];
const GRID_PRODUCTS = makeProducts(18).map((p, i) => ({
  ...p,
  rate: RATES[i % RATES.length],
  sold: SOLD[i % SOLD.length],
}));

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 text-[13px] text-[var(--color-neutral-500)]">
      <Link to="/affiliate/overview" className="hover:text-[var(--color-primary)]">
        สินค้าลิงก์คอมมิชชัน
      </Link>
      <span>/</span>
      <Link to="/affiliate/commission/shop" className="hover:text-[var(--color-primary)]">
        คอมมิชชันร้านค้า
      </Link>
      <span>/</span>
      <span className="text-[var(--color-neutral-900)]">รายละเอียดร้านค้า</span>
    </nav>
  );
}

const SORTS = [
  { id: "rate", label: "คอมมิชชัน (%)" },
  { id: "sold", label: "ขายดี" },
];

export default function ShopCommissionDetail() {
  const { id } = useParams();
  const [sort, setSort] = useState("rate");
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  void id;

  const allOnPage = GRID_PRODUCTS.length > 0 && GRID_PRODUCTS.every((p) => checked[p.id]);
  const toggleAll = () =>
    setChecked(allOnPage ? {} : Object.fromEntries(GRID_PRODUCTS.map((p) => [p.id, true])));
  const selectedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <AffiliateHeader />
      <div className="flex">
        <AffiliateSidebar active="คอมมิชชันร้านค้า" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 flex flex-col gap-5 pb-24">
          <Breadcrumb />

          {/* Shop info + filter bar */}
          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex flex-col gap-2 min-w-0">
                <h1 className="text-[16px] font-semibold text-[var(--color-neutral-900)]">รายละเอียดร้านค้า</h1>
                <div className="flex flex-col gap-1 text-[14px]">
                  <p className="text-[var(--color-neutral-600)]">
                    ชื่อร้านค้า : <span className="text-[var(--color-neutral-900)]">กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใส</span>
                  </p>
                  <p className="text-[var(--color-neutral-600)]">
                    อัตราคอมมิชชัน : <span className="text-[var(--color-neutral-900)]">สูงสุด 3.0%</span>
                  </p>
                  <p className="text-[var(--color-neutral-600)]">
                    ระยะเวลาคอมมิชชัน : <span className="text-[var(--color-neutral-900)]">15/04/2026 - 00:00 / 20/08/2026 - 11:59</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[var(--color-primary)] bg-white text-[var(--color-primary)] text-[14px] font-medium hover:bg-[var(--color-primary-100)] transition self-start shrink-0"
              >
                <Icon name="link" size={16} />
                รับลิงก์
              </button>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="flex items-center gap-3 lg:w-[492px]">
                <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-lg border border-[var(--color-neutral-300)] bg-white">
                  <SearchIcon size={18} className="text-[var(--color-neutral-500)]" />
                  <input
                    placeholder="ค้นหาสินค้าในร้านค้า"
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
                  {SORTS.map((c) => {
                    const active = sort === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSort(c.id)}
                        className={[
                          "h-8 px-3 rounded text-[14px] font-medium transition whitespace-nowrap",
                          active
                            ? "bg-[var(--color-primary)] text-white shadow-[0_0_1px_0_rgba(29,33,45,0.2),0_0_2px_0_rgba(29,33,45,0.08),0_2px_4px_0_rgba(29,33,45,0.08)]"
                            : "text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)]",
                        ].join(" ")}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Product grid + pagination */}
          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {GRID_PRODUCTS.map((p) => (
                <CommissionProductCard
                  key={p.id}
                  product={p}
                  checked={!!checked[p.id]}
                  onToggle={() => setChecked((c) => ({ ...c, [p.id]: !c[p.id] }))}
                />
              ))}
            </div>
            <Pagination page={page} onPageChange={setPage} />
          </section>
        </main>
      </div>
      <CommissionBulkBar selectedCount={selectedCount} allChecked={allOnPage} onToggleAll={toggleAll} />
    </div>
  );
}
