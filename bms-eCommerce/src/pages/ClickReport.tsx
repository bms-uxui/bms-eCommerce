import { useState } from "react";
import Icon from "../components/landing/Icon";
import Pagination from "../components/Pagination";
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

const TH = "px-3 py-2.5 text-[12px] font-medium text-[var(--color-neutral-500)] align-bottom bg-[#EFF9FE]";
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
                <DateRangePicker className="!flex w-full" />
              </FilterField>
              <FilterField label="Sub_id">
                <input
                  placeholder="กรุณากรอกข้อมูล"
                  className="h-10 px-3 rounded-lg border border-[var(--color-neutral-300)] bg-white text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] outline-none focus:border-[var(--color-primary)]"
                />
              </FilterField>
            </div>

            <div className="flex items-center justify-center gap-3">
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[18px] font-bold text-[var(--color-primary-700)]">แสดงผลแบบตาราง</h2>
              <button
                type="button"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
              >
                <Icon name="download" size={18} />
                ดาวน์โหลดรายงาน
              </button>
            </div>

            <hr className="border-t border-[var(--color-neutral-200)]" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="text-left">
                    <th className={`${TH} rounded-l-lg`}>ประเภทโซเชียลที่คลิก</th>
                    <th className={TH}>วันที่คลิก</th>
                    <th className={TH}>เวลาที่คลิก</th>
                    <th className={`${TH} rounded-r-lg`}>Sub_id</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.id} className="border-b border-[var(--color-neutral-200)] last:border-b-0">
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

            <Pagination page={page} onPageChange={setPage} />
          </section>
        </main>
      </div>
    </div>
  );
}
