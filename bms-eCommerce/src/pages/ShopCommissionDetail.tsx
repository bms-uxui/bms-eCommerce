import { useState } from "react";
import { Link, useParams } from "react-router";
import Icon from "../components/landing/Icon";
import Pagination from "../components/Pagination";
import { AffiliateHeader, AffiliateSidebar } from "../components/AffiliateChrome";
import CommissionBulkBar from "../components/CommissionBulkBar";
import { makeProducts } from "../components/landing/mockData";

const RATES = [1.5, 2.0, 3.0, 2.5, 1.8, 1.2, 2.2, 3.5];
const GRID_PRODUCTS = makeProducts(18).map((p, i) => ({ ...p, rate: RATES[i % RATES.length] }));

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

function CommissionCard({ product }: { product: (typeof GRID_PRODUCTS)[number] }) {
  return (
    <div className="flex flex-col bg-white border border-[var(--color-neutral-300)] rounded-xl overflow-hidden hover:shadow-md hover:border-[var(--color-primary-400)] transition-all">
      <div className="relative aspect-[4/3] overflow-hidden">
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

export default function ShopCommissionDetail() {
  const { id } = useParams();
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  void id;

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <AffiliateHeader />
      <div className="flex">
        <AffiliateSidebar active="คอมมิชชันร้านค้า" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 flex flex-col gap-5 pb-24">
          <Breadcrumb />

          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h1 className="text-[20px] font-bold text-[var(--color-primary-700)]">
                  รายละเอียดร้านค้า
                </h1>
                <p className="text-[13px] text-[var(--color-neutral-600)]">
                  อัตราคอมมิชชัน: <span className="font-medium text-[var(--color-neutral-900)]">สูงสุด 3.0%</span>
                </p>
                <p className="text-[13px] text-[var(--color-neutral-600)]">
                  ระยะคอมมิชชัน: 15/04/2026 - 00:00 ถึง 20/08/2026 - 11:59
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition self-start"
              >
                <Icon name="link" size={18} />
                รับลิงก์
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-lg border border-[var(--color-neutral-300)] bg-white">
                  <Icon name="search" size={18} className="text-[var(--color-neutral-500)]" />
                  <input
                    placeholder="ค้นหาร้านค้า"
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
              <div className="flex items-center gap-2 text-[13px]">
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

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {GRID_PRODUCTS.map((p) => (
                <CommissionCard key={p.id} product={p} />
              ))}
            </div>

            <Pagination page={page} onPageChange={setPage} />
          </section>
        </main>
      </div>
      <CommissionBulkBar />
    </div>
  );
}
