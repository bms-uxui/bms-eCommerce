import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, Star, Info, X, ZoomIn } from "lucide-react";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
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

const PRODUCT_INFO: Record<string, { name: string; img: string; price: number; rating: number }> = {
  p1: { name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใสหัว", img: p01, price: 590, rating: 5 },
  p2: { name: "ยาพาราเซตามอล 1000 mg.", img: p02, price: 420, rating: 5 },
  p3: { name: "เครื่องวัดความดัน BP-200", img: p03, price: 1290, rating: 4 },
  p4: { name: "โสมสกัดเข้มข้น บำรุงร่างกาย", img: p08, price: 850, rating: 4 },
  p5: { name: "ชาอูหลงพรีเมียม (กล่อง 20 ซอง)", img: p08, price: 350, rating: 3 },
};

type Review = { id: string; user: string; rating: number; comment: string; media: string[]; date: string };
const REVIEWS: Review[] = [
  { id: "r1", user: "denee sadee", rating: 5, comment: "เริ่ดๆๆๆ ใช้แล้วแก้ปวดหัวได้แทบจะทุกครั้ง", media: [p02], date: "10/05/2026-11.59" },
  { id: "r2", user: "denee sadee", rating: 4, comment: "เริ่ดๆๆๆ ใช้แล้วแก้ปวดหัวได้แทบจะทุกครั้ง", media: [p02, p02], date: "10/05/2026-11.59" },
  { id: "r3", user: "denee sadee", rating: 3, comment: "เริ่ดๆๆๆ ใช้แล้วแก้ปวดหัวได้แทบจะทุกครั้ง", media: [], date: "10/05/2026-11.59" },
  { id: "r4", user: "denee sadee", rating: 2, comment: "เริ่ดๆๆๆ ใช้แล้วแก้ปวดหัวได้แทบจะทุกครั้ง", media: [p02], date: "10/05/2026-11.59" },
  { id: "r5", user: "denee sadee", rating: 1, comment: "เริ่ดๆๆๆ ใช้แล้วแก้ปวดหัวได้แทบจะทุกครั้ง", media: [p02], date: "10/05/2026-11.59" },
  { id: "r6", user: "denee sadee", rating: 0, comment: "-", media: [p02], date: "10/05/2026-11.59" },
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

const COLS = "grid-cols-[1fr_1fr_2.2fr_1fr_1fr]";

export default function SellerReviewDetail() {
  const navigate = useNavigate();
  const { id = "p2" } = useParams();
  const product = PRODUCT_INFO[id] ?? { name: "สินค้า", img: p02, price: 0, rating: 0 };
  const [tab, setTab] = useState<(typeof RATING_TABS)[number]["key"]>("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const rows = tab === "all" ? REVIEWS : REVIEWS.filter((r) => r.rating === tab);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader onMenuClick={() => setMobileMenuOpen(true)} />
      <div className="flex">
        <SellerSidebar active="รีวิว & คะแนนร้านค้า" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <button type="button" onClick={() => navigate("/seller/reviews")} aria-label="ย้อนกลับ" className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors"><ChevronLeft size={20} /></button>
              <h1 className="text-[20px] font-semibold text-[var(--color-primary-700)] truncate">{product.name}</h1>
            </div>
            <p className="flex items-center gap-1.5 text-[12px] text-[var(--color-neutral-500)] shrink-0"><Info size={14} />อัปเดตข้อมูลล่าสุด 10/05/2026-11.59</p>
          </div>

          {/* Product rating header */}
          <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] p-5 flex items-center gap-6">
            <div className="flex flex-col items-center shrink-0">
              <p className="text-[28px] font-bold text-[var(--color-neutral-900)] leading-none">{(4.8).toFixed(1)}<span className="text-[13px] font-normal text-[var(--color-neutral-500)] ml-1">เต็ม 5</span></p>
              <div className="mt-1.5"><Stars value={4.8} size={18} /></div>
            </div>
            <span className="w-px h-12 bg-[var(--color-neutral-200)]" />
            <div className="flex items-center gap-3">
              <img src={product.img} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <p className="text-[16px] font-semibold text-[var(--color-neutral-900)]">{product.name}</p>
                <p className="text-[14px] font-semibold text-[var(--color-primary)] mt-0.5">฿ {product.price.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>

          {/* Rating tabs */}
          <div className="flex bg-white border border-[var(--color-neutral-200)] rounded-lg p-1 gap-0 w-fit">
            {RATING_TABS.map((t) => {
              const active = t.key === tab;
              const count = t.key === "all" ? REVIEWS.length : REVIEWS.filter((r) => r.rating === t.key).length;
              return (
                <button key={t.key} type="button" onClick={() => setTab(t.key)} className={["h-8 px-3 flex items-center gap-1.5 rounded text-[14px] font-medium transition-colors whitespace-nowrap", active ? "bg-[var(--color-primary)] text-white shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)]" : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"].join(" ")}>
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
              <div className="flex items-center h-9 px-4">ผู้รีวิว</div>
              <div className="flex items-center h-9 px-2">คะแนน</div>
              <div className="flex items-center h-9 px-2">ความเห็น</div>
              <div className="flex items-center h-9 px-2">รูปภาพและวิดีโอ</div>
              <div className="flex items-center h-9 px-2">วันที่</div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {rows.map((r) => (
                <div key={r.id} className={`grid ${COLS} items-center border-b border-[var(--color-neutral-200)] last:border-b-0 py-3`}>
                  <div className="px-4 text-[14px] text-[var(--color-neutral-900)]">{r.user}</div>
                  <div className="px-2"><Stars value={r.rating} size={14} /></div>
                  <div className="px-2 text-[14px] text-[var(--color-neutral-700)] pr-4">{r.comment}</div>
                  <div className="px-2 flex items-center gap-2">
                    {r.media.length === 0 ? <span className="text-[13px] text-[var(--color-neutral-400)]">—</span> : r.media.map((src, i) => (
                      <button key={i} type="button" onClick={() => setLightbox(src)} className="relative w-9 h-9 rounded overflow-hidden shrink-0 group cursor-zoom-in">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"><ZoomIn size={14} /></span>
                      </button>
                    ))}
                  </div>
                  <div className="px-2 text-[14px] text-[var(--color-neutral-600)]">{r.date}</div>
                </div>
              ))}
              {rows.length === 0 && <div className="py-16 text-center text-[14px] text-[var(--color-neutral-500)]">ไม่มีรีวิว</div>}
            </div>
          </div>
        </main>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6 drawer-overlay-in" onClick={() => setLightbox(null)}>
          <button type="button" aria-label="ปิด" className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition" onClick={() => setLightbox(null)}><X size={18} /></button>
          <img src={lightbox} alt="" onClick={(e) => e.stopPropagation()} className="max-w-[90vw] max-h-[85vh] rounded-lg object-contain shadow-2xl" />
        </div>
      )}
    </div>
  );
}
