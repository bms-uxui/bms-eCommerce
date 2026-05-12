import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Icon from "../components/landing/Icon";
import Pagination from "../components/Pagination";
import { AffiliateHeader, AffiliateSidebar } from "../components/AffiliateChrome";
import CommissionBulkBar from "../components/CommissionBulkBar";
import { makeProducts } from "../components/landing/mockData";

const CATEGORIES = [
  "เครื่องประดับ", "เสื้อแขนสั้น", "เสื้อผ้าแฟชั่น", "รองเท้า",
  "กระเป๋า", "หมวก", "เครื่องสำอาง", "นาฬิกา",
];
const RATES = [1.5, 2.0, 3.0, 2.5, 1.8, 1.2, 2.2, 3.5];

const COMMISSION_PRODUCTS = makeProducts(24).map((p, i) => ({
  ...p,
  category: CATEGORIES[i % CATEGORIES.length],
  rate: RATES[i % RATES.length],
  start: "10/04/2026 - 00:00",
  end: "10/05/2026 - 11:59",
}));

const PAGE_SIZE = 6;

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 text-[13px] text-[var(--color-neutral-500)]">
      <Link to="/affiliate/overview" className="hover:text-[var(--color-primary)]">
        สินค้าลิงก์คอมมิชชัน
      </Link>
      <span>/</span>
      <span className="text-[var(--color-neutral-900)]">คอมมิชชัน BRIGHTIFY</span>
    </nav>
  );
}

function SearchSortBar({ sort, setSort }: { sort: string; setSort: (s: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-lg border border-[var(--color-neutral-300)] bg-white">
          <Icon name="search" size={18} className="text-[var(--color-neutral-500)]" />
          <input
            placeholder="ค้นหาสินค้าคอมมิชชันที่สนใจ"
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
  );
}

const TH = "px-3 py-2.5 text-[12px] font-medium text-[var(--color-neutral-500)] align-bottom bg-[#EFF9FE]";
const TD = "px-3 py-3 text-[14px] text-[var(--color-neutral-900)] align-middle";

export default function BrightifyCommission() {
  const navigate = useNavigate();
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(2);
  const [checked, setChecked] = useState<Record<string | number, boolean>>({});

  const rows = COMMISSION_PRODUCTS.slice(0, PAGE_SIZE);
  const selectedCount = Object.values(checked).filter(Boolean).length;
  const allOnPage = rows.every((r) => checked[r.id]);
  const toggleAll = () =>
    setChecked((c) => {
      const next = { ...c };
      rows.forEach((r) => (next[r.id] = !allOnPage));
      return next;
    });

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <AffiliateHeader />
      <div className="flex">
        <AffiliateSidebar active="คอมมิชชัน BRIGHTIFY" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 flex flex-col gap-5 pb-24">
          <Breadcrumb />

          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-5 flex flex-col gap-4">
            <h1 className="text-[20px] font-bold text-[var(--color-primary-700)]">
              คอมมิชชัน BRIGHTIFY
            </h1>
            <SearchSortBar sort={sort} setSort={setSort} />

            <hr className="border-t border-[var(--color-neutral-200)]" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse">
                <thead>
                  <tr className="text-left">
                    <th className={`${TH} rounded-l-lg w-10`}>
                      <input
                        type="checkbox"
                        checked={allOnPage}
                        onChange={toggleAll}
                        className="accent-[var(--color-primary)]"
                      />
                    </th>
                    <th className={TH}>ชื่อสินค้าคอมมิชชัน</th>
                    <th className={TH}>ระยะเวลาคอมมิชชัน</th>
                    <th className={TH}>ประเภทคอมมิชชัน</th>
                    <th className={TH}>อัตราคอมมิชชัน</th>
                    <th className={`${TH} rounded-r-lg text-right`}>การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p.id} className="border-b border-[var(--color-neutral-200)] last:border-b-0">
                      <td className={TD}>
                        <input
                          type="checkbox"
                          checked={!!checked[p.id]}
                          onChange={() =>
                            setChecked((c) => ({ ...c, [p.id]: !c[p.id] }))
                          }
                          className="accent-[var(--color-primary)]"
                        />
                      </td>
                      <td className={TD}>
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.image}
                            alt=""
                            className="w-10 h-10 rounded-md object-cover shrink-0 border border-[var(--color-neutral-200)]"
                          />
                          <span className="truncate max-w-[260px]">{p.name}</span>
                        </div>
                      </td>
                      <td className={`${TD} whitespace-nowrap text-[12px] text-[var(--color-neutral-600)]`}>
                        <div>เริ่ม: {p.start}</div>
                        <div>สิ้นสุด: {p.end}</div>
                      </td>
                      <td className={TD}>{p.category}</td>
                      <td className={`${TD} whitespace-nowrap`}>สูงสุด {p.rate.toFixed(1)}%</td>
                      <td className={`${TD} text-right whitespace-nowrap`}>
                        <span className="inline-flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => navigate(`/affiliate/commission/brightify/${p.id}`)}
                            className="text-[13px] text-[var(--color-primary)] hover:underline"
                          >
                            ดูรายละเอียด
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-[13px] text-[var(--color-primary)] hover:underline"
                          >
                            <Icon name="link" size={15} />
                            รับลิงก์
                          </button>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination page={page} onPageChange={setPage} />
          </section>
        </main>
      </div>
      <CommissionBulkBar selectedCount={selectedCount} allChecked={allOnPage} onToggleAll={toggleAll} />
    </div>
  );
}
