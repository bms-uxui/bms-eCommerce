import { useState } from "react";
import Icon from "../components/landing/Icon";
import { AffiliateHeader, AffiliateSidebar } from "../components/AffiliateChrome";
import DateRangePicker from "../components/DateRangePicker";

const SOURCES = ["Facebook", "Facebook", "Facebook", "Facebook", "Youtube", "Facebook", "Instagram"];
const SUB_IDS = ["paiboon", "paiboon", "paiboon", "-", "-", "paiboon", "paiboon"];

const ROWS = SOURCES.map((src, i) => ({
  id: i,
  source: src,
  date: "10/08/2026",
  time: "15.50",
  subId: SUB_IDS[i],
}));

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 min-w-0">
      <span className="text-[13px] text-[var(--color-neutral-700)]">{label}</span>
      {children}
    </label>
  );
}

const TH = "px-3 py-3 text-[12px] font-medium text-[var(--color-neutral-500)] align-bottom whitespace-nowrap";
const TD = "px-3 py-3.5 text-[14px] text-[var(--color-neutral-900)] align-middle";

export default function ClickReport() {
  const [page, setPage] = useState(2);

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <AffiliateHeader />
      <div className="flex">
        <AffiliateSidebar active="รายงานการคลิก" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 flex flex-col gap-5">
          <nav className="flex items-center gap-1.5 text-[13px] text-[var(--color-neutral-500)]">
            <span>รายงาน</span>
            <span>/</span>
            <span className="text-[var(--color-neutral-900)]">รายงานการคลิก</span>
          </nav>

          {/* Filters */}
          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-[20px] font-bold text-[var(--color-primary-700)]">รายงานการคลิก</h1>
              <p className="text-[13px] text-[var(--color-neutral-500)]">
                ข้อมูลจะอัปเดตทุกวันเวลา 00:00 AM
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
              <FilterField label="ประเภทโซเชียลที่คลิก">
                <button
                  type="button"
                  className="h-10 px-3 rounded-lg border border-[var(--color-neutral-300)] bg-white text-[14px] text-[var(--color-neutral-900)] flex items-center justify-between gap-2 hover:border-[var(--color-primary-400)] transition-colors"
                >
                  <span>ทั้งหมด</span>
                  <Icon name="chevron-down" size={16} className="text-[var(--color-neutral-600)]" />
                </button>
              </FilterField>
              <FilterField label="วันที่คลิก">
                <DateRangePicker className="!flex" />
              </FilterField>
              <FilterField label="Sub_id">
                <input
                  placeholder="กรุณากรอกข้อมูล"
                  className="h-10 px-3 rounded-lg border border-[var(--color-neutral-300)] bg-white text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] outline-none focus:border-[var(--color-primary)]"
                />
              </FilterField>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="h-10 px-8 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
              >
                ค้นหา
              </button>
              <button
                type="button"
                className="h-10 px-8 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[14px] font-medium hover:bg-[var(--color-primary-100)] transition"
              >
                รีเซ็ต
              </button>
            </div>
          </section>

          {/* Table */}
          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[18px] font-bold text-[var(--color-primary-700)]">แสดงผลแบบตาราง</h2>
              <button
                type="button"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--color-primary-100)] text-[var(--color-primary-700)] text-[14px] font-medium hover:brightness-95 transition"
              >
                <Icon name="download" size={18} />
                ดาวน์โหลดรายงาน
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[var(--color-neutral-200)]">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="bg-[#f1f6fc] text-left">
                    <th className={TH}>ประเภทโซเชียลที่คลิก</th>
                    <th className={TH}>วันที่คลิก</th>
                    <th className={TH}>เวลาที่คลิก</th>
                    <th className={TH}>Sub_id</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.id} className="border-t border-[var(--color-neutral-200)]">
                      <td className={TD}>{r.source}</td>
                      <td className={TD}>{r.date}</td>
                      <td className={TD}>{r.time}</td>
                      <td className={`${TD} ${r.subId === "-" ? "text-[var(--color-neutral-500)]" : ""}`}>
                        {r.subId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
    </div>
  );
}
