import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Switch } from "@heroui/react";
import { ChevronLeft, Calendar, Pencil, Plus, Trash2 } from "lucide-react";
import Icon from "../components/landing/Icon";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import AddFlashSaleProductModal from "../components/landing/AddFlashSaleProductModal";
import paracetamol from "../assets/products/p02-paracetamol.jpg";

type FStatus = "active" | "draft" | "scheduled" | "expired" | "disabled";
const STATUS: Record<FStatus, { label: string; bg: string; text: string }> = {
  active: { label: "กำลังใช้งาน", bg: "#d6fc92", text: "#235c04" },
  draft: { label: "ฉบับร่าง", bg: "#e5e9ee", text: "#56657a" },
  scheduled: { label: "กำหนดไว้", bg: "#fdefb0", text: "#863a00" },
  expired: { label: "หมดอายุ", bg: "#feeaed", text: "#a3072b" },
  disabled: { label: "ปิดใช้งาน", bg: "#f5ebfe", text: "#5824d4" },
};
type Row = { id: string; name: string; normal: number; discount: number; status: FStatus };
const ROWS: Row[] = [
  { id: "f1", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใส", normal: 590, discount: 20, status: "active" },
  { id: "f2", name: "ชาอูหลงผสมดอกหอมหมื่นลี้ (กล่อง 20 ซอง)", normal: 350, discount: 15, status: "active" },
  { id: "f3", name: "ยาสีฟันสมุนไพรเข้มข้น 160 กรัม", normal: 120, discount: 10, status: "active" },
  { id: "f4", name: "เครื่องวัดความดันโลหิตอัตโนมัติ รุ่น BP-200", normal: 1290, discount: 18, status: "scheduled" },
  { id: "f5", name: "นมสดพาสเจอร์ไรส์ 1 ลิตร (แพ็ก 4)", normal: 220, discount: 12, status: "expired" },
  { id: "f6", name: "ชุดทดสอบเบตาแลคแทมเเบนิดดี้", normal: 250, discount: 8, status: "disabled" },
];
const TABS: { key: "all" | FStatus; label: string }[] = [
  { key: "all", label: "สินค้าทั้งหมด" },
  { key: "active", label: "กำลังใช้งาน" },
  { key: "draft", label: "ฉบับร่าง" },
  { key: "scheduled", label: "กำหนดไว้" },
  { key: "expired", label: "หมดอายุ" },
  { key: "disabled", label: "ปิดใช้งาน" },
];
const tabCount = (k: "all" | FStatus) => (k === "all" ? ROWS.length : ROWS.filter((r) => r.status === k).length);

const EVENT_INFO: Record<string, { title: string; dateRange: string; countdown: [string, string, string] }> = {
  "5.5": { title: "Flash Sale 5.5", dateRange: "5 พ.ค. 2569 09:00 - 6 พ.ค. 2569 23:59", countdown: ["02", "14", "33"] },
  "5.6": { title: "Flash Sale 5.6", dateRange: "6 พ.ค. 2569 09:00 - 7 พ.ค. 2569 23:59", countdown: ["09", "48", "21"] },
  "5.15": { title: "Flash Sale กลางเดือน", dateRange: "15 พ.ค. 2569 00:00 - 16 พ.ค. 2569 23:59", countdown: ["18", "05", "42"] },
  "5.25": { title: "Flash Sale วันเงินเดือนออก", dateRange: "25 พ.ค. 2569 00:00 - 27 พ.ค. 2569 23:59", countdown: ["41", "27", "09"] },
  "6.6": { title: "Flash Sale 6.6", dateRange: "6 มิ.ย. 2569 09:00 - 7 มิ.ย. 2569 23:59", countdown: ["30", "12", "55"] },
  "6.30": { title: "Flash Sale เคลียร์สต็อกสิ้นเดือน", dateRange: "28 มิ.ย. 2569 00:00 - 30 มิ.ย. 2569 23:59", countdown: ["52", "44", "18"] },
};
const fp = (normal: number, pct: number) => normal * (1 - pct / 100);
const COLS = "grid-cols-[2.2fr_1fr_1.4fr_1.6fr_1fr_1.1fr]";

function CountBox({ v }: { v: string }) {
  return <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 rounded bg-[#e6483c] text-white text-[14px] font-semibold tabular-nums">{v}</span>;
}

export default function SellerFlashSaleDetail() {
  const navigate = useNavigate();
  const { id = "5.5" } = useParams<{ id: string }>();
  const ev = EVENT_INFO[id] ?? { title: `Flash Sale ${id}`, dateRange: "—", countdown: ["00", "00", "00"] as [string, string, string] };
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [page, setPage] = useState(2);
  const [addOpen, setAddOpen] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, FStatus>>(() => Object.fromEntries(ROWS.map((r) => [r.id, r.status])));
  const toggle = (row: Row, on: boolean) => setStatuses((s) => ({ ...s, [row.id]: on ? "active" : row.status === "active" ? "disabled" : row.status }));

  const rows = tab === "all" ? ROWS : ROWS.filter((r) => statuses[r.id] === tab);
  const pages = [1, 2, 3, 4, 5, "…", 12] as const;

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader />
      <div className="flex">
        <SellerSidebar active="Flash Sale" />
        <main className="flex-1 min-w-0 px-8 py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => navigate("/seller/flashsale")} aria-label="กลับ" className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors"><ChevronLeft size={20} /></button>
              <h1 className="text-[20px] font-semibold text-[var(--color-neutral-900)]">{ev.title}</h1>
            </div>
            <button type="button" onClick={() => setAddOpen(true)} className="h-10 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium flex items-center gap-2 hover:bg-[var(--color-primary-600)] transition-colors shrink-0"><Plus size={16} />เพิ่มสินค้า Flash Sale</button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[14px] text-[var(--color-neutral-700)]">
            <span className="flex items-center gap-1.5"><Calendar size={16} className="text-[var(--color-neutral-500)]" />{ev.dateRange}</span>
            <span className="flex items-center gap-1"><CountBox v={ev.countdown[0]} /><span className="text-[var(--color-neutral-500)]">:</span><CountBox v={ev.countdown[1]} /><span className="text-[var(--color-neutral-500)]">:</span><CountBox v={ev.countdown[2]} /></span>
          </div>

          <div className="flex bg-white border border-[var(--color-neutral-200)] rounded-lg p-1 gap-0 w-fit">
            {TABS.map((t) => {
              const active = t.key === tab;
              return (
                <button key={t.key} type="button" onClick={() => { setTab(t.key); setPage(1); }} className={["h-8 px-4 flex items-center gap-2 rounded text-[14px] font-medium transition-colors whitespace-nowrap", active ? "bg-[var(--color-primary)] text-white shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)]" : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"].join(" ")}>
                  <span>{t.label}</span>
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-[var(--color-critical)] text-white text-[12px] leading-none">{tabCount(t.key)}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] flex flex-col flex-1 min-h-0">
            <div className={`grid ${COLS} bg-[var(--color-primary-100)] border-b border-[var(--color-neutral-200)] text-[12px] font-medium uppercase text-[var(--color-neutral-600)]`}>
              <div className="flex items-center h-9 px-4">สินค้า</div>
              <div className="flex items-center justify-end h-9 px-2">ราคาปกติ (฿)</div>
              <div className="flex items-center h-9 px-2">ราคา FLASH SALE (฿)</div>
              <div className="flex items-center h-9 px-2">ระยะเวลา</div>
              <div className="flex items-center justify-center h-9 px-2">สถานะ</div>
              <div className="flex items-center justify-center h-9 px-2">การดำเนินการ</div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {rows.map((r) => (
                <div key={r.id} className={`grid ${COLS} items-center border-b border-[var(--color-neutral-200)] last:border-b-0 py-3 hover:bg-[var(--color-primary-100)]/40 transition-colors`}>
                  <div className="flex items-center gap-3 px-4 min-w-0"><img src={paracetamol} alt="" className="w-11 h-11 rounded object-cover shrink-0" /><p className="text-[14px] text-[var(--color-neutral-900)] truncate">{r.name}</p></div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] px-2 text-right tabular-nums">{r.normal.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</div>
                  <div className="px-2 text-[14px] flex items-center gap-2"><span className="text-[var(--color-critical)]">- {r.discount}%</span><span className="text-[var(--color-critical)] font-medium tabular-nums">฿ {fp(r.normal, r.discount).toLocaleString("th-TH", { minimumFractionDigits: 2 })}</span></div>
                  <div className="px-2 text-[12px] text-[var(--color-neutral-600)] leading-5"><p>เริ่มต้น : 10/04/2026-00.00</p><p>สิ้นสุด : 10/05/2026-11.59</p></div>
                  <div className="flex justify-center px-2"><span className="inline-flex items-center justify-center px-3 py-1 rounded text-[12px] font-medium whitespace-nowrap" style={{ backgroundColor: STATUS[statuses[r.id]].bg, color: STATUS[statuses[r.id]].text }}>{STATUS[statuses[r.id]].label}</span></div>
                  <div className="flex items-center justify-center gap-2 px-2">
                    <Switch size="sm" color="success" isSelected={statuses[r.id] === "active"} onValueChange={(on) => toggle(r, on)} aria-label="เปิด/ปิด" />
                    <button type="button" onClick={() => setAddOpen(true)} aria-label="แก้ไข" className="w-7 h-7 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors"><Pencil size={16} /></button>
                    <button type="button" aria-label="ลบ" className="w-7 h-7 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-critical)]/10 hover:text-[var(--color-critical)] transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {rows.length === 0 && <div className="py-16 text-center text-[14px] text-[var(--color-neutral-500)]">ไม่มีสินค้า</div>}
            </div>
            <div className="border-t border-[var(--color-neutral-300)] h-14 flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <p className="text-[14px]"><span className="text-[var(--color-neutral-900)]">{ROWS.length} </span><span className="text-[var(--color-neutral-500)]">รายการ</span></p>
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
      <AddFlashSaleProductModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
