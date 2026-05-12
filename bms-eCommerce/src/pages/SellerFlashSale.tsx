import { useState } from "react";
import { useNavigate } from "react-router";
import { Switch } from "@heroui/react";
import { Calendar, Info, Package, Pencil, Plus, Trash2 } from "lucide-react";
import Icon from "../components/landing/Icon";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import AddFlashSaleProductModal from "../components/landing/AddFlashSaleProductModal";
import FlashSaleTermsModal from "../components/landing/FlashSaleTermsModal";
import paracetamol from "../assets/products/p02-paracetamol.jpg";
import flashsaleArt from "../assets/marketing/flashsale-art.png";

const CARD_BG = "linear-gradient(180deg, #f64669 0%, #ff0105 100%)";

type EventState = "live" | "join" | "joined";
type EventCard = {
  id: string;
  title: string;
  state: EventState;
  items: number;
  dateRange: string;
  countdown?: [string, string, string]; // hh, mm, ss — for "live"
};
const EVENTS: EventCard[] = [
  { id: "5.5", title: "Flash Sale 5.5", state: "live", items: 12, dateRange: "5 พ.ค. 2569 - 6 พ.ค. 2569", countdown: ["02", "14", "33"] },
  { id: "5.6", title: "Flash Sale 5.6", state: "live", items: 8, dateRange: "6 พ.ค. 2569 - 7 พ.ค. 2569", countdown: ["09", "48", "21"] },
  { id: "5.15", title: "Flash Sale กลางเดือน", state: "joined", items: 20, dateRange: "15 พ.ค. 2569 - 16 พ.ค. 2569" },
  { id: "5.25", title: "Flash Sale วันเงินเดือนออก", state: "join", items: 0, dateRange: "25 พ.ค. 2569 - 27 พ.ค. 2569" },
  { id: "6.6", title: "Flash Sale 6.6", state: "join", items: 0, dateRange: "6 มิ.ย. 2569 - 7 มิ.ย. 2569" },
  { id: "6.30", title: "Flash Sale เคลียร์สต็อกสิ้นเดือน", state: "joined", items: 6, dateRange: "28 มิ.ย. 2569 - 30 มิ.ย. 2569" },
];

type FStatus = "active" | "draft" | "scheduled" | "expired" | "disabled";
const STATUS: Record<FStatus, { label: string; bg: string; text: string }> = {
  active: { label: "กำลังใช้งาน", bg: "#d6fc92", text: "#235c04" },
  draft: { label: "ฉบับร่าง", bg: "#e5e9ee", text: "#56657a" },
  scheduled: { label: "กำหนดไว้", bg: "#fdefb0", text: "#863a00" },
  expired: { label: "หมดอายุ", bg: "#feeaed", text: "#a3072b" },
  disabled: { label: "ปิดใช้งาน", bg: "#f5ebfe", text: "#5824d4" },
};
const TABS: { key: "all" | FStatus; label: string; count: number }[] = [
  { key: "all", label: "Flash Sale ที่เข้าร่วม", count: 6 },
  { key: "active", label: "กำลังใช้งาน", count: 3 },
  { key: "scheduled", label: "กำหนดไว้", count: 1 },
  { key: "expired", label: "หมดอายุ", count: 1 },
  { key: "disabled", label: "ปิดใช้งาน", count: 1 },
];

type Row = { id: string; name: string; normal: number; discount: number; status: FStatus };
const ROWS: Row[] = [
  { id: "f1", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใส", normal: 180, discount: 5, status: "active" },
  { id: "f2", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใส", normal: 180, discount: 5, status: "active" },
  { id: "f3", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใส", normal: 180, discount: 5, status: "scheduled" },
  { id: "f4", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใส", normal: 180, discount: 5, status: "disabled" },
  { id: "f5", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใส", normal: 180, discount: 5, status: "expired" },
  { id: "f6", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใส", normal: 180, discount: 5, status: "active" },
];
const COLS = "grid-cols-[2.2fr_1fr_1.4fr_1.6fr_1fr_1.1fr]";

function CountBox({ v }: { v: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-white text-[13px] font-bold tabular-nums"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2)), linear-gradient(180deg, #e62e05 0%, #bc1b06 100%)" }}
    >
      {v}
    </span>
  );
}
function Sep() {
  return <span className="text-[16px] font-semibold text-black leading-none">:</span>;
}

export default function SellerFlashSale() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [page, setPage] = useState(2);
  const [addOpen, setAddOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
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
          {/* Section 1: Flash Sale Event */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-[20px] font-semibold text-[var(--color-primary-700)]">Flash Sale Event</h1>
            <button type="button" onClick={() => setTermsOpen(true)} className="flex items-center gap-1.5 text-[13px] text-[var(--color-neutral-500)] hover:text-[var(--color-primary)] hover:underline transition-colors"><Info size={14} className="shrink-0" />เข้าร่วมกับ Flash Sale กับทาง BMS เพื่อรับข้อเสนอสุดพิเศษ</button>
          </div>
          <div className="-mx-8 overflow-x-auto scrollbar-none">
            <div className="flex gap-4 px-8 pb-1 w-max">
              {EVENTS.map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => navigate(`/seller/flashsale/${ev.id}`)}
                  className="relative shrink-0 w-[360px] max-w-[85vw] overflow-hidden rounded-2xl p-4 min-h-[130px] flex flex-col gap-4 text-left text-white shadow-[0_4px_12px_rgba(241,11,39,0.2)]"
                  style={{ backgroundImage: CARD_BG }}
                >
                  <img src={flashsaleArt} alt="" className="pointer-events-none select-none absolute right-0 bottom-0 w-[112px]" />
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="text-[16px] font-semibold truncate">{ev.title}</span>
                    {ev.state === "live" && ev.countdown && <span className="flex items-center gap-1 shrink-0"><CountBox v={ev.countdown[0]} /><Sep /><CountBox v={ev.countdown[1]} /><Sep /><CountBox v={ev.countdown[2]} /></span>}
                    {ev.state === "join" && <span onClick={(e) => { e.stopPropagation(); setTermsOpen(true); }} className="shrink-0 px-4 py-1.5 rounded-full bg-white text-[#f10b27] text-[13px] font-semibold cursor-pointer hover:bg-white/90 transition">เข้าร่วมเลย</span>}
                    {ev.state === "joined" && <span className="shrink-0 px-3 py-1.5 rounded-full border border-white/70 text-white text-[12px] font-medium whitespace-nowrap">เข้าร่วมแล้วรอเวลากิจกรรม</span>}
                  </div>
                  <div className="relative z-10 flex flex-col gap-2 text-[13px]">
                    <p className="flex items-center gap-2"><Package size={15} />{ev.items > 0 ? `จำนวน ${ev.items} รายการ` : "คุณยังไม่มีสินค้าเข้าร่วม"}</p>
                    <p className="flex items-center gap-2"><Calendar size={15} />{ev.dateRange}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Flash Sale (products) */}
          <div className="flex items-center justify-between gap-4 mt-2">
            <h2 className="text-[20px] font-semibold text-[var(--color-primary-700)]">Flash Sale</h2>
            <button type="button" onClick={() => setAddOpen(true)} className="h-10 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium flex items-center gap-2 hover:bg-[var(--color-primary-600)] transition-colors shrink-0"><Plus size={16} />เพิ่มสินค้า Flash Sale</button>
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
                  <div className="px-2 text-[14px] flex items-center gap-2"><span className="text-[var(--color-critical)]">- {r.discount}%</span><span className="text-[var(--color-critical)] font-medium tabular-nums">฿ {(r.normal * (1 - r.discount / 100)).toLocaleString("th-TH", { minimumFractionDigits: 2 })}</span></div>
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
      <AddFlashSaleProductModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
      <FlashSaleTermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  );
}
