import { useState } from "react";
import { useNavigate } from "react-router";
import Icon from "../components/landing/Icon";
import SearchIcon from "../components/SearchIcon";
import CopyButton from "../components/landing/CopyButton";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";

type RStatus = "pending" | "approved" | "returning" | "returned" | "refunded" | "rejected";

const STATUS: Record<RStatus, { label: string; bg: string; text: string }> = {
  pending: { label: "รอการตรวจสอบ", bg: "#fdefb0", text: "#863a00" },
  approved: { label: "อนุมัติคำขอ", bg: "#d6fc92", text: "#235c04" },
  returning: { label: "กำลังส่งคืนสินค้า", bg: "#cce7ff", text: "#025094" },
  returned: { label: "ส่งคืนสินค้าสำเร็จ", bg: "#d6fc92", text: "#235c04" },
  refunded: { label: "คืนเงินแล้ว", bg: "#d6fc92", text: "#235c04" },
  rejected: { label: "ปฏิเสธคำขอ", bg: "#feeaed", text: "#a3072b" },
};

const TABS: { key: "all" | RStatus; label: string; count: number }[] = [
  { key: "all", label: "คำขอทั้งหมด", count: 6 },
  { key: "pending", label: "รอตรวจสอบ", count: 2 },
  { key: "approved", label: "อนุมัติแล้ว", count: 1 },
  { key: "returning", label: "กำลังส่งคืน", count: 1 },
  { key: "refunded", label: "คืนเงินแล้ว", count: 1 },
  { key: "rejected", label: "ปฏิเสธ", count: 1 },
];

type RefundType = "refund_only" | "refund_return";
const TYPE_LABEL: Record<RefundType, string> = {
  refund_only: "คืนเงินเท่านั้น",
  refund_return: "คืนเงินและคืนสินค้า",
};

type Row = {
  id: string;
  no: string;
  orderNo: string;
  date: string;
  type: RefundType;
  reason: string;
  status: RStatus;
};

const REASONS = ["สินค้าไม่ตรงปก", "พัสดุหรือสินค้าเสียหาย", "ได้รับสินค้าไม่ครบ", "สินค้าผิดไซส์/ผิดสี"];

const REQUESTS: Row[] = Array.from({ length: 9 }, (_, i) => {
  const statuses: RStatus[] = ["pending", "pending", "approved", "approved", "rejected", "rejected", "returning", "returned", "refunded"];
  return {
    id: `r${i + 1}`,
    no: `BMS-4567890-${23 + i}`,
    orderNo: "#BMS-0987654-87",
    date: "24 ส.ค. 2569",
    type: i % 2 === 0 ? "refund_only" : "refund_return",
    reason: REASONS[i % REASONS.length],
    status: statuses[i] ?? "pending",
  };
});

const COLS = "grid-cols-[1.2fr_1.2fr_1fr_1.1fr_1.4fr_1fr]";

export default function SellerRefunds() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [page, setPage] = useState(2);

  const rows = tab === "all" ? REQUESTS : REQUESTS.filter((r) => r.status === tab);
  const pages = [1, 2, 3, 4, 5, "…", 12] as const;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader onMenuClick={() => setMobileMenuOpen(true)} />
      <div className="flex">
        <SellerSidebar active="คำขอคืนเงิน/คืนสินค้า" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
          {/* Title + search */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-[20px] font-semibold text-[var(--color-primary-700)]">คำขอคืนเงิน/คืนสินค้า</h1>
            <div className="flex items-center">
              <input type="text" placeholder="ค้นหาหมายเลขคำขอ, เลขคำสั่งซื้อ" className="h-10 w-[400px] bg-white border border-[var(--color-neutral-300)] rounded-l-lg px-4 text-[16px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary)]" />
              <button type="button" aria-label="ค้นหา" className="h-10 px-4 flex items-center justify-center rounded-r-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-600)] transition-colors"><SearchIcon size={20} /></button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white border border-[var(--color-neutral-200)] rounded-lg p-1 gap-0 w-fit">
            {TABS.map((t) => {
              const active = t.key === tab;
              return (
                <button key={t.key} type="button" onClick={() => { setTab(t.key); setPage(1); }}
                  className={["h-8 px-4 flex items-center gap-2 rounded text-[14px] font-medium transition-colors whitespace-nowrap", active ? "bg-[var(--color-primary)] text-white shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)]" : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"].join(" ")}>
                  <span>{t.label}</span>
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-[var(--color-critical)] text-white text-[12px] leading-none">{t.count}</span>
                </button>
              );
            })}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] flex flex-col flex-1 min-h-0">
            <div className={`grid ${COLS} bg-[var(--color-primary-100)] border-b border-[var(--color-neutral-200)] text-[12px] font-medium uppercase text-[var(--color-neutral-600)]`}>
              <div className="flex items-center h-9 px-4">เลขที่คำขอ</div>
              <div className="flex items-center h-9 px-2">เลขคำสั่งซื้อ</div>
              <div className="flex items-center h-9 px-2">วันที่</div>
              <div className="flex items-center h-9 px-2">ประเภทคำขอ</div>
              <div className="flex items-center h-9 px-2">เหตุผล</div>
              <div className="flex items-center justify-center h-9 px-2">สถานะ</div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              {rows.map((r) => (
                <div key={r.id} role="button" tabIndex={0}
                  onClick={() => navigate(`/seller/refunds/${r.no}`)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(`/seller/refunds/${r.no}`); } }}
                  className={`grid ${COLS} items-center border-b border-[var(--color-neutral-200)] last:border-b-0 py-3 cursor-pointer hover:bg-[var(--color-primary-100)]/40 transition-colors`}>
                  <div className="text-[14px] text-[var(--color-neutral-900)] px-4">{r.no}</div>
                  <div className="flex items-center gap-2 px-2 text-[14px] text-[var(--color-neutral-900)]">
                    {r.orderNo}
                    <CopyButton value={r.orderNo} />
                  </div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] px-2">{r.date}</div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] px-2">{TYPE_LABEL[r.type]}</div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] px-2 truncate">{r.reason}</div>
                  <div className="flex justify-center px-2">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded text-[12px] font-medium whitespace-nowrap" style={{ backgroundColor: STATUS[r.status].bg, color: STATUS[r.status].text }}>{STATUS[r.status].label}</span>
                  </div>
                </div>
              ))}
              {rows.length === 0 && <div className="py-16 text-center text-[14px] text-[var(--color-neutral-500)]">ไม่มีคำขอ</div>}
            </div>

            {/* Pagination */}
            <div className="border-t border-[var(--color-neutral-300)] h-14 flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <p className="text-[14px]"><span className="text-[var(--color-neutral-900)]">10,488 </span><span className="text-[var(--color-neutral-500)]">รายการ</span></p>
                <span className="w-px h-6 bg-[var(--color-neutral-300)]" />
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[var(--color-neutral-500)]">แสดง</span>
                  <button type="button" className="h-8 pl-3 pr-2 flex items-center gap-2 rounded-lg bg-white border border-[var(--color-neutral-300)] text-[14px] font-semibold text-[var(--color-primary)]">20<Icon name="chevron-down" size={14} className="text-[var(--color-neutral-600)]" /></button>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]" aria-label="ก่อนหน้า"><Icon name="chevron-left" size={16} /></button>
                {pages.map((p, i) => p === "…" ? (
                  <span key={i} className="w-8 h-8 flex items-center justify-center text-[12px] text-[var(--color-neutral-600)]">…</span>
                ) : (
                  <button key={i} type="button" onClick={() => setPage(p)} className={["min-w-8 h-8 px-2 flex items-center justify-center rounded text-[12px] font-medium transition-colors", p === page ? "bg-[#dcf2fe] text-[#0e3ed0]" : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"].join(" ")}>{p}</button>
                ))}
                <button type="button" onClick={() => setPage((p) => p + 1)} className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]" aria-label="ถัดไป"><Icon name="chevron-right" size={16} /></button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
