import { useState } from "react";
import { Switch } from "@heroui/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Icon from "../components/landing/Icon";
import SearchIcon from "../components/SearchIcon";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import CreatePromotionModal from "../components/landing/CreatePromotionModal";
import paracetamol from "../assets/products/p02-paracetamol.jpg";

type PStatus = "active" | "scheduled" | "disabled" | "expired";
const STATUS: Record<PStatus, { label: string; bg: string; text: string }> = {
  active: { label: "กำลังใช้งาน", bg: "#d6fc92", text: "#235c04" },
  scheduled: { label: "ก่อนหน้านี้", bg: "#cce7ff", text: "#025094" },
  disabled: { label: "ปิดใช้งาน", bg: "#f5ebfe", text: "#5824d4" },
  expired: { label: "หมดอายุ", bg: "#feeaed", text: "#a3072b" },
};
const TABS: { key: "all" | PStatus; label: string; count: number }[] = [
  { key: "all", label: "โปรโมชั่นทั้งหมด", count: 6 },
  { key: "active", label: "กำลังใช้งาน", count: 3 },
  { key: "scheduled", label: "ก่อนหน้านี้", count: 1 },
  { key: "expired", label: "หมดอายุ", count: 1 },
  { key: "disabled", label: "ปิดใช้งาน", count: 1 },
];

type Row = { id: string; name: string; items: number; discount: string; sub?: string; start: string; end: string; status: PStatus };
const PROMOS: Row[] = [
  { id: "p1", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใสหัว", items: 1, discount: "฿ 80", start: "10/04/2026-00.00", end: "10/05/2026-11.59", status: "active" },
  { id: "p2", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใสหัว", items: 2, discount: "10 %", start: "10/04/2026-00.00", end: "10/05/2026-11.59", status: "active" },
  { id: "p3", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใสหัว", items: 2, discount: "10 %", sub: "สูงสุด ฿ 300", start: "10/04/2026-00.00", end: "10/05/2026-11.59", status: "active" },
  { id: "p4", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใสหัว", items: 2, discount: "10 %", start: "10/04/2026-00.00", end: "10/05/2026-11.59", status: "scheduled" },
  { id: "p5", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใสหัว", items: 3, discount: "15 %", start: "10/04/2026-00.00", end: "10/05/2026-11.59", status: "disabled" },
  { id: "p6", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใสหัว", items: 3, discount: "฿ 100", start: "10/04/2026-00.00", end: "10/05/2026-11.59", status: "expired" },
];

const COLS = "grid-cols-[2.2fr_1fr_1.2fr_1.6fr_1fr_1.1fr]";

export default function SellerPromotions() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [page, setPage] = useState(2);
  const [createOpen, setCreateOpen] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, PStatus>>(() => Object.fromEntries(PROMOS.map((p) => [p.id, p.status])));
  const toggle = (row: Row, on: boolean) => setStatuses((s) => ({ ...s, [row.id]: on ? "active" : row.status === "active" ? "disabled" : row.status }));

  const rows = tab === "all" ? PROMOS : PROMOS.filter((p) => statuses[p.id] === tab);
  const pages = [1, 2, 3, 4, 5, "…", 12] as const;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader onMenuClick={() => setMobileMenuOpen(true)} />
      <div className="flex">
        <SellerSidebar active="โปรโมชั่น" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-[20px] font-semibold text-[var(--color-primary-700)]">โปรโมชั่น</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <input type="text" placeholder="ค้นหาโปรโมชั่น" className="h-10 w-[360px] bg-white border border-[var(--color-neutral-300)] rounded-l-lg px-4 text-[16px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary)]" />
                <button type="button" aria-label="ค้นหา" className="h-10 px-4 flex items-center justify-center rounded-r-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-600)] transition-colors"><SearchIcon size={20} /></button>
              </div>
              <button type="button" onClick={() => setCreateOpen(true)} className="h-10 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium flex items-center gap-2 hover:bg-[var(--color-primary-600)] transition-colors shrink-0"><Plus size={16} />สร้างโปรโมชั่น</button>
            </div>
          </div>

          <div className="flex bg-white border border-[var(--color-neutral-200)] rounded-lg p-1 gap-0 w-fit">
            {TABS.map((t) => {
              const active = t.key === tab;
              return (
                <button key={t.key} type="button" onClick={() => { setTab(t.key); setPage(1); }} className={["h-8 px-4 flex items-center gap-2 rounded text-[14px] font-medium transition-colors whitespace-nowrap", active ? "bg-[var(--color-primary)] text-white shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)]" : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"].join(" ")}>
                  <span>{t.label}</span>
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-[var(--color-critical)] text-white text-[12px] leading-none">{t.count}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] flex flex-col flex-1 min-h-0">
            <div className={`grid ${COLS} bg-[var(--color-primary-100)] border-b border-[var(--color-neutral-200)] text-[12px] font-medium uppercase text-[var(--color-neutral-600)]`}>
              <div className="flex items-center h-9 px-4">โปรโมชั่น</div>
              <div className="flex items-center h-9 px-2">สินค้าในชุด</div>
              <div className="flex items-center h-9 px-2">ส่วนลด</div>
              <div className="flex items-center h-9 px-2">ระยะเวลา</div>
              <div className="flex items-center justify-center h-9 px-2">สถานะ</div>
              <div className="flex items-center justify-center h-9 px-2">การดำเนินการ</div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {rows.map((r) => (
                <div key={r.id} className={`grid ${COLS} items-center border-b border-[var(--color-neutral-200)] last:border-b-0 py-3 hover:bg-[var(--color-primary-100)]/40 transition-colors`}>
                  <div className="flex items-center gap-3 px-4 min-w-0">
                    <img src={paracetamol} alt="" className="w-11 h-11 rounded object-cover shrink-0" />
                    <p className="text-[14px] text-[var(--color-neutral-900)] truncate">{r.name}</p>
                  </div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] px-2">{r.items}</div>
                  <div className="px-2">
                    <p className="text-[14px] text-[var(--color-neutral-900)]">{r.discount}</p>
                    {r.sub && <p className="text-[12px] text-[var(--color-neutral-500)]">{r.sub}</p>}
                  </div>
                  <div className="px-2 text-[12px] text-[var(--color-neutral-600)] leading-5">
                    <p>เริ่มต้น : {r.start}</p>
                    <p>สิ้นสุด : {r.end}</p>
                  </div>
                  <div className="flex justify-center px-2">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded text-[12px] font-medium whitespace-nowrap" style={{ backgroundColor: STATUS[statuses[r.id]].bg, color: STATUS[statuses[r.id]].text }}>{STATUS[statuses[r.id]].label}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 px-2">
                    <Switch size="sm" color="success" isSelected={statuses[r.id] === "active"} onValueChange={(on) => toggle(r, on)} aria-label="เปิด/ปิดโปรโมชั่น" />
                    <button type="button" onClick={() => setCreateOpen(true)} aria-label="แก้ไข" className="w-7 h-7 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors"><Pencil size={16} /></button>
                    <button type="button" aria-label="ลบ" className="w-7 h-7 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-critical)]/10 hover:text-[var(--color-critical)] transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {rows.length === 0 && <div className="py-16 text-center text-[14px] text-[var(--color-neutral-500)]">ไม่มีโปรโมชั่น</div>}
            </div>
            <div className="border-t border-[var(--color-neutral-300)] h-14 flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <p className="text-[14px]"><span className="text-[var(--color-neutral-900)]">10,488 </span><span className="text-[var(--color-neutral-500)]">รายการ</span></p>
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
      <CreatePromotionModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
