import { useState } from "react";
import { useNavigate } from "react-router";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { Star, Info, X } from "lucide-react";
import Icon from "../components/landing/Icon";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import storeAvatar from "../assets/store-avatar.png";
import p01 from "../assets/products/p01-skirt.jpg";
import p02 from "../assets/products/p02-paracetamol.jpg";
import p03 from "../assets/products/p03-bp-monitor.jpg";
import p08 from "../assets/products/p08-ginseng.jpg";

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= full ? "text-[#ffb800]" : "text-[var(--color-neutral-300)]"} fill={i <= full ? "#ffb800" : "transparent"} strokeWidth={1.5} />
      ))}
    </span>
  );
}

type Row = { id: string; name: string; img: string; rating: number; reviews: number };
const PRODUCTS: Row[] = [
  { id: "p1", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใสหัว", img: p01, rating: 5, reviews: 256 },
  { id: "p2", name: "ยาพาราเซตามอล 1000 mg.", img: p02, rating: 5, reviews: 2300 },
  { id: "p3", name: "เครื่องวัดความดัน BP-200", img: p03, rating: 4, reviews: 184 },
  { id: "p4", name: "โสมสกัดเข้มข้น บำรุงร่างกาย", img: p08, rating: 4, reviews: 92 },
  { id: "p5", name: "ชาอูหลงพรีเมียม (กล่อง 20 ซอง)", img: p08, rating: 3, reviews: 41 },
];

const RATING_TABS = [
  { key: "all" as const, label: "รีวิวทั้งหมด", filled: 0 },
  { key: 5 as const, label: "5 ดาว", filled: 5 },
  { key: 4 as const, label: "4 ดาว", filled: 4 },
  { key: 3 as const, label: "3 ดาว", filled: 3 },
  { key: 2 as const, label: "2 ดาว", filled: 2 },
  { key: 1 as const, label: "1 ดาว", filled: 1 },
  { key: 0 as const, label: "0 ดาว", filled: 0 },
];

const RULES = [
  "เกณฑ์ 4.0 - 5.0 ดาว เป็นร้านค้าแนะนำ ขึ้นฟีดบ่อย",
  "เกณฑ์ 2.5 - 3.9 ดาว เป็นร้านระดับกลาง",
  "เกณฑ์ 0.0 - 2.4 ดาว เป็นร้านค้าที่ต้องส่งข้อความตักเตือนการให้บริการ",
  "โทษสถานหนัก ปิดบัญชีและยึดเงินทั้งหมด เพื่อให้ร้านค้าดำเนินเรื่องชี้แจงและอุทธรณ์",
];

function RecommendedStoreModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" size="md" hideCloseButton scrollBehavior="inside" classNames={{ base: "rounded-2xl" }}>
      <ModalContent>
        <ModalHeader className="flex items-center justify-between gap-4 border-b border-[var(--color-neutral-300)] p-4">
          <h2 className="text-[18px] font-semibold leading-4 text-[var(--color-neutral-900)]">กฎเกณฑ์ในการคิดคะแนน "ร้านแนะนำ"</h2>
          <button type="button" aria-label="ปิด" onClick={onClose} className="w-6 h-6 rounded-full bg-[var(--color-neutral-200)] flex items-center justify-center text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-300)] transition"><X size={12} strokeWidth={2.5} /></button>
        </ModalHeader>
        <ModalBody className="p-5 flex flex-col gap-4">
          <p className="text-[14px] text-[var(--color-neutral-700)] leading-6">
            นำคะแนนสินค้าทั้งหมดมาคิดเป็นดาว 1.0 - 5.0 ดาว คิดจากดาวที่ลูกค้ารีวิวต่อสินค้า และนำคอมเมนต์มาวิเคราะห์พฤติกรรมของร้านค้าในการให้บริการ
          </p>
          <ol className="flex flex-col gap-3">
            {RULES.map((r, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary)] text-[13px] font-semibold flex items-center justify-center">{i + 1}</span>
                <span className="text-[14px] text-[var(--color-neutral-900)] leading-6">{r}</span>
              </li>
            ))}
          </ol>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const COLS = "grid-cols-[2.4fr_1fr_1fr]";

export default function SellerReviews() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof RATING_TABS)[number]["key"]>("all");
  const [page, setPage] = useState(2);
  const [rulesOpen, setRulesOpen] = useState(false);

  const rows = tab === "all" ? PRODUCTS : PRODUCTS.filter((p) => Math.round(p.rating) === tab);
  const pages = [1, 2, 3, 4, 5, "…", 12] as const;
  const storeRating = 4.8;

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader />
      <div className="flex">
        <SellerSidebar active="รีวิว & คะแนนร้านค้า" />
        <main className="flex-1 min-w-0 px-8 py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-[20px] font-semibold text-[var(--color-primary-700)]">รีวิว & คะแนนร้านค้า</h1>
            <div className="flex items-center">
              <input type="text" placeholder="ค้นหาสินค้าที่รีวิว" className="h-10 w-[360px] bg-white border border-[var(--color-neutral-300)] rounded-l-lg px-4 text-[16px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary)]" />
              <button type="button" aria-label="ค้นหา" className="h-10 px-4 flex items-center justify-center rounded-r-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-600)] transition-colors"><Icon name="search" size={20} /></button>
            </div>
          </div>

          {/* Store rating header */}
          <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] p-5 flex items-center gap-6">
            <div className="flex flex-col items-center shrink-0">
              <p className="text-[28px] font-bold text-[var(--color-neutral-900)] leading-none">{storeRating.toFixed(1)}<span className="text-[13px] font-normal text-[var(--color-neutral-500)] ml-1">เต็ม 5</span></p>
              <div className="mt-1.5"><Stars value={storeRating} size={18} /></div>
            </div>
            <span className="w-px h-12 bg-[var(--color-neutral-200)]" />
            <div className="flex items-center gap-3 shrink-0">
              <img src={storeAvatar} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[16px] font-semibold text-[var(--color-neutral-900)]">BMS.shop</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium text-white bg-[var(--color-primary)]">ร้านค้าแนะนำ</span>
                </div>
                <p className="text-[12px] text-[var(--color-neutral-500)] mt-0.5">ผู้รีวิว 2.3k</p>
              </div>
            </div>
            <div className="flex-1 flex items-start justify-end gap-1.5 text-[12px] text-[var(--color-neutral-500)] leading-5">
              <button type="button" onClick={() => setRulesOpen(true)} aria-label="กฎเกณฑ์ร้านค้าแนะนำ" className="shrink-0 mt-0.5 text-[var(--color-neutral-400)] hover:text-[var(--color-primary)] transition-colors"><Info size={14} /></button>
              <p className="max-w-[340px]">ร้านค้าของคุณได้รับเครื่องหมาย "ร้านค้าแนะนำ" เนื่องจากได้คะแนนการรีวิวสินค้าตามเกณฑ์ของบริษัท กรุณารักษามาตรฐานของคุณต่อไป</p>
            </div>
          </div>

          {/* Rating tabs */}
          <div className="flex bg-white border border-[var(--color-neutral-200)] rounded-lg p-1 gap-0 w-fit">
            {RATING_TABS.map((t) => {
              const active = t.key === tab;
              const count = t.key === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => Math.round(p.rating) === t.key).length;
              return (
                <button key={t.key} type="button" onClick={() => { setTab(t.key); setPage(1); }} className={["h-8 px-3 flex items-center gap-1.5 rounded text-[14px] font-medium transition-colors whitespace-nowrap", active ? "bg-[var(--color-primary)] text-white shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)]" : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"].join(" ")}>
                  {t.key !== "all" && <Star size={14} className={active ? "text-white" : "text-[#ffb800]"} fill={t.filled > 0 ? (active ? "#ffffff" : "#ffb800") : "transparent"} strokeWidth={1.5} />}
                  <span>{t.label}</span>
                  <span className={["inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[11px] leading-none", active ? "bg-white/25 text-white" : "bg-[var(--color-critical)] text-white"].join(" ")}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] flex flex-col flex-1 min-h-0">
            <div className={`grid ${COLS} bg-[var(--color-primary-100)] border-b border-[var(--color-neutral-200)] text-[12px] font-medium uppercase text-[var(--color-neutral-600)]`}>
              <div className="flex items-center h-9 px-4">สินค้า</div>
              <div className="flex items-center justify-center h-9 px-2">คะแนน</div>
              <div className="flex items-center justify-center h-9 px-2">จำนวนผู้รีวิว</div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {rows.map((r) => (
                <div key={r.id} role="button" tabIndex={0} onClick={() => navigate(`/seller/reviews/${r.id}`)} onKeyDown={(e) => { if (e.key === "Enter") navigate(`/seller/reviews/${r.id}`); }} className={`grid ${COLS} items-center border-b border-[var(--color-neutral-200)] last:border-b-0 py-3 hover:bg-[var(--color-primary-100)]/40 transition-colors cursor-pointer`}>
                  <div className="flex items-center gap-3 px-4 min-w-0">
                    <img src={r.img} alt="" className="w-11 h-11 rounded object-cover shrink-0" />
                    <p className="text-[14px] text-[var(--color-neutral-900)] truncate">{r.name}</p>
                  </div>
                  <div className="flex justify-center px-2"><Stars value={r.rating} /></div>
                  <div className="text-center px-2 text-[14px] text-[var(--color-neutral-900)]">{r.reviews.toLocaleString("th-TH")} รีวิว</div>
                </div>
              ))}
              {rows.length === 0 && <div className="py-16 text-center text-[14px] text-[var(--color-neutral-500)]">ไม่มีรีวิว</div>}
            </div>
            <div className="border-t border-[var(--color-neutral-300)] h-14 flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <p className="text-[14px]"><span className="text-[var(--color-neutral-900)]">5 </span><span className="text-[var(--color-neutral-500)]">รายการ</span></p>
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
      <RecommendedStoreModal isOpen={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}
