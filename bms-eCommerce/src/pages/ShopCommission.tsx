import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Icon from "../components/landing/Icon";
import Pagination from "../components/Pagination";
import { AffiliateHeader, AffiliateSidebar } from "../components/AffiliateChrome";
import CommissionBulkBar from "../components/CommissionBulkBar";
import CheckBox from "../components/CheckBox";
import { makeProducts } from "../components/landing/mockData";

const OWNERS = ["อลิสา", "ชนิกา", "ณัฐพล", "พิชญา", "ธนากร", "ศศิธร", "วรินทร์", "กิตติพงษ์"];
const RATES = [1.5, 2.0, 3.0, 2.5, 1.8, 1.2, 2.2, 3.5];

const SHOPS = makeProducts(24).map((p, i) => ({
  ...p,
  name: `${p.name.split(" ")[0]} By ${OWNERS[i % OWNERS.length]}`,
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
      <span className="text-[var(--color-neutral-900)]">คอมมิชชันร้านค้า</span>
    </nav>
  );
}

const TH = "px-3 py-2.5 text-[12px] font-medium text-[var(--color-neutral-500)] align-bottom bg-[#EFF9FE]";
const TD = "px-3 py-3 text-[14px] text-[var(--color-neutral-900)] align-middle";

export default function ShopCommission() {
  const navigate = useNavigate();
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(2);
  const [checked, setChecked] = useState<Record<string | number, boolean>>({});

  const rows = SHOPS.slice(0, PAGE_SIZE);
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
        <AffiliateSidebar active="คอมมิชชันร้านค้า" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 flex flex-col gap-5 pb-24">
          <Breadcrumb />

          {/* Filter bar */}
          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-5 flex flex-col gap-4">
            <h1 className="text-[16px] font-semibold text-[var(--color-neutral-900)]">คอมมิชชันร้านค้า</h1>
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="flex items-center gap-3 lg:w-[492px]">
                <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-lg border border-[var(--color-neutral-300)] bg-white">
                  <Icon name="search" size={18} className="text-[var(--color-neutral-500)]" />
                  <input
                    placeholder="ค้นหาร้านค้า"
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

          {/* Table */}
          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-5 flex flex-col gap-4">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse">
                <thead>
                  <tr>
                    <th className={`${TH} rounded-l-lg w-12 text-left`}>
                      <CheckBox checked={allOnPage} onChange={toggleAll} />
                    </th>
                    <th className={`${TH} text-left`}>ชื่อร้านค้า</th>
                    <th className={`${TH} text-center`}>ระยะเวลาคอมมิชชัน</th>
                    <th className={`${TH} text-center`}>อัตราคอมมิชชัน</th>
                    <th className={`${TH} rounded-r-lg text-center`}>การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p.id} className="border-b border-[var(--color-neutral-200)] last:border-b-0">
                      <td className={TD}>
                        <CheckBox checked={!!checked[p.id]} onChange={() => setChecked((c) => ({ ...c, [p.id]: !c[p.id] }))} />
                      </td>
                      <td className={TD}>
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.image}
                            alt=""
                            className="w-9 h-9 rounded-md object-cover shrink-0 border border-[var(--color-neutral-200)]"
                          />
                          <span className="truncate max-w-[280px]">{p.name}</span>
                        </div>
                      </td>
                      <td className={`${TD} whitespace-nowrap text-[12px] text-[var(--color-neutral-600)] text-center`}>
                        <div className="inline-flex flex-col gap-0.5">
                          <div className="flex gap-1.5"><span className="w-12 shrink-0 text-right">เริ่มต้น :</span><span>{p.start}</span></div>
                          <div className="flex gap-1.5"><span className="w-12 shrink-0 text-right">สิ้นสุด :</span><span>{p.end}</span></div>
                        </div>
                      </td>
                      <td className={`${TD} whitespace-nowrap text-center`}>สูงสุด {p.rate.toFixed(1)}%</td>
                      <td className={`${TD} text-center whitespace-nowrap`}>
                        <span className="inline-flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => navigate(`/affiliate/commission/shop/${p.id}`)}
                            className="text-[13px] text-[var(--color-primary)] hover:underline"
                          >
                            ดูรายละเอียด
                          </button>
                          <span className="w-px h-3.5 bg-[var(--color-neutral-300)]" />
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
