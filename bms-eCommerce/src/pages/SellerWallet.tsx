import { useMemo, useState } from "react";
import { DateRangePicker, type RangeValue } from "@heroui/react";
import { parseDate, type DateValue } from "@internationalized/date";
import { Info } from "lucide-react";
import Icon from "../components/landing/Icon";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import WithdrawModal, { type WithdrawStep } from "../components/landing/WithdrawModal";

type TxStatus = "processing" | "failed" | "success";
const TX_STATUS: Record<TxStatus, { label: string; bg: string; text: string; step: WithdrawStep }> = {
  processing: { label: "กำลังดำเนินการ", bg: "#fdefb0", text: "#863a00", step: "processing" },
  failed: { label: "ถอนเงินไม่สำเร็จ", bg: "#feeaed", text: "#a3072b", step: "failed" },
  success: { label: "ถอนเงินสำเร็จ", bg: "#d6fc92", text: "#235c04", step: "success" },
};

type Tx = { id: string; type: string; iso: string; time: string; amount: number; ref: string; status: TxStatus };
const TXS: Tx[] = [
  { id: "t1", type: "ถอนเงินรายได้ดีลในมิติ", iso: "2026-08-23", time: "12.15", amount: 578, ref: "56728904359487326", status: "processing" },
  { id: "t2", type: "คืนเงิน", iso: "2026-08-21", time: "09.40", amount: 1200, ref: "56728904359487327", status: "failed" },
  { id: "t3", type: "ถอนเงินรายได้ดีลในมิติ", iso: "2026-08-18", time: "14.05", amount: 850, ref: "56728904359487328", status: "success" },
  { id: "t4", type: "ถอนเงินรายได้ดีลในมิติ", iso: "2026-08-15", time: "10.22", amount: 2400, ref: "56728904359487329", status: "success" },
  { id: "t5", type: "ถอนเงินรายได้ดีลในมิติ", iso: "2026-08-12", time: "16.48", amount: 320, ref: "56728904359487330", status: "success" },
  { id: "t6", type: "ถอนเงินรายได้ดีลในมิติ", iso: "2026-08-09", time: "08.30", amount: 578, ref: "56728904359487331", status: "success" },
  { id: "t7", type: "ถอนเงินรายได้ดีลในมิติ", iso: "2026-08-04", time: "11.10", amount: 990, ref: "56728904359487332", status: "success" },
  { id: "t8", type: "คืนเงิน", iso: "2026-07-28", time: "13.55", amount: 450, ref: "56728904359487333", status: "failed" },
];

function fmtDate(iso: string, time: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y} - ${time}`;
}
function toKey(v: DateValue) {
  return v.year * 10000 + v.month * 100 + v.day;
}

const STATS = [
  { label: "ยอดถอนได้", value: 0, color: "#22c55e" },
  { label: "ยอด ESCROW", value: 0, color: "#f5a623" },
  { label: "รายได้สะสม", value: 0, color: "#0e7afe" },
  { label: "ยอดเงินสะสม", value: 0, color: "#ec4899" },
];

const COLS = "grid-cols-[1.4fr_1.2fr_1fr_1.6fr_1.1fr_1fr]";

export default function SellerWallet() {
  const [page, setPage] = useState(1);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<WithdrawStep>("form");
  const [range, setRange] = useState<RangeValue<DateValue> | null>({ start: parseDate("2026-08-10"), end: parseDate("2026-08-24") });
  const pages = [1, 2, 3, 4, 5, "…", 12] as const;

  const openWithdraw = (step: WithdrawStep) => { setWithdrawStep(step); setWithdrawOpen(true); };

  const rows = useMemo(() => {
    if (!range?.start || !range?.end) return TXS;
    const lo = toKey(range.start), hi = toKey(range.end);
    return TXS.filter((t) => {
      const [y, m, d] = t.iso.split("-").map(Number);
      const k = y * 10000 + m * 100 + d;
      return k >= lo && k <= hi;
    });
  }, [range]);

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader />
      <div className="flex">
        <SellerSidebar active="กระเป๋าเงิน" />
        <main className="flex-1 min-w-0 px-8 py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[20px] font-semibold text-[var(--color-primary-700)]">กระเป๋าเงิน</h1>
              <p className="flex items-start gap-1.5 text-[12px] text-[var(--color-neutral-500)] mt-1">
                <Info size={14} className="shrink-0 mt-0.5" />
                คุณสามารถถอนเงินด้วยตนเอง และสามารถตามดูสถานะการถอนเงินมูลค่าบิตในมิติได้ทุกวัน ระบบจะทำรอบยอดเงินได้วันละ 1 ครั้งเท่านั้น <a href="#" onClick={(e) => e.preventDefault()} className="text-[var(--color-primary)] hover:underline">ตั้งค่าการถอนเงินอัตโนมัติ</a>
              </p>
            </div>
            <button type="button" onClick={() => openWithdraw("form")} className="h-10 px-5 rounded-lg bg-[#22c55e] text-white text-[14px] font-semibold hover:brightness-110 transition shrink-0">ถอนเงิน</button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-4 shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] border-b-2" style={{ borderBottomColor: s.color }}>
                <p className="text-[12px] text-[var(--color-neutral-500)]">{s.label}</p>
                <p className="text-[22px] font-bold text-[var(--color-neutral-900)] mt-1 tabular-nums">฿ {s.value.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</p>
              </div>
            ))}
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[var(--color-neutral-200)]">
              <h2 className="text-[18px] font-semibold text-[var(--color-neutral-900)]">ประวัติการทำธุรกรรม</h2>
              <DateRangePicker
                aria-label="ช่วงวันที่"
                value={range}
                onChange={(v) => { setRange(v); setPage(1); }}
                visibleMonths={2}
                className="w-[300px]"
                classNames={{ inputWrapper: "h-9 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] shadow-none rounded-lg", innerWrapper: "text-[14px] text-[var(--color-neutral-700)]" }}
              />
            </div>
            <div className={`grid ${COLS} bg-[var(--color-primary-100)] border-b border-[var(--color-neutral-200)] text-[12px] font-medium uppercase text-[var(--color-neutral-600)]`}>
              <div className="flex items-center h-9 px-4">ประเภท</div>
              <div className="flex items-center h-9 px-2">วันที่-เวลา</div>
              <div className="flex items-center h-9 px-2">ยอดเงิน</div>
              <div className="flex items-center h-9 px-2">หมายเลขอ้างอิง</div>
              <div className="flex items-center justify-center h-9 px-2">สถานะ</div>
              <div className="flex items-center justify-center h-9 px-2">การดำเนินการ</div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {rows.map((t) => (
                <div key={t.id} className={`grid ${COLS} items-center border-b border-[var(--color-neutral-200)] last:border-b-0 py-3`}>
                  <div className="px-4 text-[14px] text-[var(--color-neutral-900)]">{t.type}</div>
                  <div className="px-2 text-[14px] text-[var(--color-neutral-600)]">{fmtDate(t.iso, t.time)}</div>
                  <div className="px-2 text-[14px] text-[var(--color-neutral-900)] tabular-nums">{t.amount.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</div>
                  <div className="px-2 text-[14px] text-[var(--color-neutral-600)] tabular-nums">{t.ref}</div>
                  <div className="flex justify-center px-2"><span className="inline-flex items-center justify-center px-3 py-1 rounded text-[12px] font-medium whitespace-nowrap" style={{ backgroundColor: TX_STATUS[t.status].bg, color: TX_STATUS[t.status].text }}>{TX_STATUS[t.status].label}</span></div>
                  <div className="flex justify-center px-2">
                    <button type="button" onClick={() => openWithdraw(TX_STATUS[t.status].step)} className="text-[14px] font-medium text-[var(--color-primary)] hover:underline">ดูรายละเอียด</button>
                  </div>
                </div>
              ))}
              {rows.length === 0 && <div className="py-16 text-center text-[14px] text-[var(--color-neutral-500)]">ไม่มีรายการในช่วงวันที่ที่เลือก</div>}
            </div>
            <div className="border-t border-[var(--color-neutral-300)] h-14 flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <p className="text-[14px]"><span className="text-[var(--color-neutral-900)]">{rows.length.toLocaleString("th-TH")} </span><span className="text-[var(--color-neutral-500)]">รายการ</span></p>
                <span className="w-px h-6 bg-[var(--color-neutral-300)]" />
                <div className="flex items-center gap-2"><span className="text-[14px] text-[var(--color-neutral-500)]">แสดง</span><button type="button" className="h-8 pl-3 pr-2 flex items-center gap-2 rounded-lg bg-white border border-[var(--color-neutral-300)] text-[14px] font-semibold text-[var(--color-primary)]">20<Icon name="chevron-down" size={14} className="text-[var(--color-neutral-600)]" /></button></div>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]" aria-label="ก่อนหน้า"><Icon name="chevron-left" size={16} /></button>
                {pages.map((p, i) => p === "…" ? <span key={i} className="w-8 h-8 flex items-center justify-center text-[12px] text-[var(--color-neutral-600)]">…</span> : <button key={i} type="button" onClick={() => setPage(p)} className={["min-w-8 h-8 px-2 flex items-center justify-center rounded text-[12px] font-medium transition-colors", p === page ? "bg-[#dcf2fe] text-[#0e3ed0]" : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"].join(" ")}>{p}</button>)}
                <button type="button" onClick={() => setPage((p) => p + 1)} className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]" aria-label="ถัดไป"><Icon name="chevron-right" size={16} /></button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <WithdrawModal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} balance={0} initialStep={withdrawStep} />
    </div>
  );
}
