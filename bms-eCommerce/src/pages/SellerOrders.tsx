import { useState } from "react";
import { useNavigate } from "react-router";
import Icon from "../components/landing/Icon";
import SearchIcon from "../components/SearchIcon";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import CheckBox from "../components/CheckBox";

type StatusKey =
  | "pending"
  | "preparing"
  | "prepared"
  | "shipping"
  | "delivered"
  | "cancelled";

const STATUS: Record<StatusKey, { label: string; bg: string; text: string }> = {
  pending: { label: "รอชำระเงิน", bg: "#fdefb0", text: "#863a00" },
  preparing: { label: "กำลังจัดเตรียม", bg: "#f5ebfe", text: "#5824d4" },
  prepared: { label: "จัดเตรียมเสร็จสิ้น", bg: "#d6fc92", text: "#235c04" },
  shipping: { label: "กำลังจัดส่ง", bg: "#cce7ff", text: "#025094" },
  delivered: { label: "จัดส่งสำเร็จแล้ว", bg: "#d6fc92", text: "#235c04" },
  cancelled: { label: "ยกเลิกคำสั่งซื้อ", bg: "#feeaed", text: "#a3072b" },
};

const TABS: { key: "all" | StatusKey; label: string; count: number }[] = [
  { key: "all", label: "ทั้งหมด", count: 6 },
  { key: "pending", label: "รอชำระเงิน", count: 1 },
  { key: "preparing", label: "กำลังจัดเตรียม", count: 1 },
  { key: "prepared", label: "จัดเตรียมเสร็จสิ้น", count: 1 },
  { key: "shipping", label: "กำลังจัดส่ง", count: 1 },
  { key: "delivered", label: "จัดส่งสำเร็จแล้ว", count: 1 },
  { key: "cancelled", label: "ยกเลิกคำสั่งซื้อ", count: 1 },
];

type OrderRow = {
  id: string;
  customer: string;
  datetime: string;
  items: number;
  total: number;
  status: StatusKey;
};

const ORDERS: OrderRow[] = [
  { id: "#BMS-0987654-87", customer: "panida setung", datetime: "12/09/2026-15.07", items: 2, total: 356.0, status: "pending" },
  { id: "#BMS-0987654-87", customer: "ananda kongsai", datetime: "05/11/2024-09.30", items: 1, total: 1250.5, status: "preparing" },
  { id: "#BMS-0987654-87", customer: "napasorn chansa", datetime: "14/08/2024-12.00", items: 5, total: 1599.0, status: "prepared" },
  { id: "#BMS-0987654-87", customer: "sirikorn thumrong", datetime: "22/12/2025-18.45", items: 3, total: 785.75, status: "shipping" },
  { id: "#BMS-0987654-87", customer: "napasorn chansa", datetime: "14/08/2024-12.00", items: 5, total: 1599.0, status: "delivered" },
  { id: "#BMS-0987654-87", customer: "wanchai pum", datetime: "30/01/2026-07.50", items: 2, total: 450.25, status: "cancelled" },
];

const COLS = "grid-cols-[48px_1fr_1fr_1fr_1fr_1fr_1fr_1fr]";

const BULK_ACTIONS = [
  { id: "update", icon: "download", label: "อัปเดตคำสั่งซื้อ" },
  { id: "cancel", icon: "package", label: "ยกเลิกคำสั่งซื้อ" },
  { id: "receipt", icon: "files", label: "พิมพ์ใบเสร็จคำสั่งซื้อ" },
  { id: "label", icon: "printer", label: "พิมพ์ใบปะหน้าสินค้า" },
] as const;

function BulkActionBar({
  count,
  onClose,
  onUpdate,
}: {
  count: number;
  onClose: () => void;
  onUpdate: () => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <div className="pointer-events-auto bg-[var(--color-primary)] text-white rounded-xl p-4 flex items-center gap-6 shadow-[0_0_12px_rgba(104,182,250,0.55),0_8px_24px_rgba(4,133,247,0.3)]">
        <p className="text-[16px] font-medium whitespace-nowrap">{count} รายการ</p>
        <span className="self-stretch w-px bg-white/40" />
        {BULK_ACTIONS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={a.id === "update" ? onUpdate : undefined}
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 active:bg-white/15 transition-colors"
          >
            {a.icon === "download" ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6668 10.417V5.66699C16.6668 4.26686 16.6668 3.5668 16.3943 3.03202C16.1547 2.56161 15.7722 2.17916 15.3018 1.93948C14.767 1.66699 14.067 1.66699 12.6668 1.66699H7.3335C5.93336 1.66699 5.2333 1.66699 4.69852 1.93948C4.22811 2.17916 3.84566 2.56161 3.60598 3.03202C3.3335 3.5668 3.3335 4.26686 3.3335 5.66699V14.3337C3.3335 15.7338 3.3335 16.4339 3.60598 16.9686C3.84566 17.439 4.22811 17.8215 4.69852 18.0612C5.2333 18.3337 5.93333 18.3337 7.33338 18.3337H10.4168M11.6668 9.16699H6.66683M8.3335 12.5003H6.66683M13.3335 5.83366H6.66683M17.5002 15.8337L15.0002 18.3337L12.5002 15.8337M15.0002 18.3337V13.3337" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : a.icon === "package" ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.0833 6.06527L9.99997 10.0005M9.99997 10.0005L2.91664 6.06527M9.99997 10.0005L10 17.9171M11.6667 17.4079L10.6475 17.9741C10.4112 18.1054 10.293 18.171 10.1679 18.1968C10.0571 18.2195 9.94288 18.2195 9.83213 18.1968C9.70698 18.171 9.58881 18.1054 9.35248 17.9741L3.18581 14.5481C2.93621 14.4095 2.8114 14.3401 2.72053 14.2415C2.64013 14.1543 2.57929 14.0509 2.54207 13.9382C2.5 13.8109 2.5 13.6681 2.5 13.3826V6.61835C2.5 6.33281 2.5 6.19005 2.54207 6.06271C2.57929 5.95007 2.64013 5.84667 2.72053 5.75942C2.8114 5.66081 2.93621 5.59148 3.18581 5.45281L9.35248 2.02688C9.58881 1.89558 9.70698 1.82993 9.83213 1.80419C9.94288 1.78141 10.0571 1.78141 10.1679 1.80419C10.293 1.82993 10.4112 1.89558 10.6475 2.02688L16.8142 5.4528C17.0638 5.59147 17.1886 5.66081 17.2795 5.75942C17.3599 5.84666 17.4207 5.95007 17.4579 6.06271C17.5 6.19004 17.5 6.33281 17.5 6.61835L17.5 10.4171M6.25 3.75048L13.75 7.91714" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 14L15 17M15 14L18 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : a.icon === "files" ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.6668 1.8916V5.33372C11.6668 5.80043 11.6668 6.03378 11.7577 6.21204C11.8376 6.36885 11.965 6.49633 12.1218 6.57622C12.3001 6.66705 12.5335 6.66705 13.0002 6.66705H16.4423M13.3335 10.8337H6.66683M13.3335 14.167H6.66683M8.3335 7.50033H6.66683M11.6668 1.66699H7.3335C5.93336 1.66699 5.2333 1.66699 4.69852 1.93948C4.22811 2.17916 3.84566 2.56161 3.60598 3.03202C3.3335 3.5668 3.3335 4.26686 3.3335 5.66699V14.3337C3.3335 15.7338 3.3335 16.4339 3.60598 16.9686C3.84566 17.439 4.22811 17.8215 4.69852 18.0612C5.2333 18.3337 5.93336 18.3337 7.3335 18.3337H12.6668C14.067 18.3337 14.767 18.3337 15.3018 18.0612C15.7722 17.8215 16.1547 17.439 16.3943 16.9686C16.6668 16.4339 16.6668 15.7338 16.6668 14.3337V6.66699L11.6668 1.66699Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : <Icon name={a.icon} size={20} />}
            <span className="text-[12px] leading-tight whitespace-nowrap">{a.label}</span>
          </button>
        ))}
        <span className="self-stretch w-px bg-white/40" />
        <button
          type="button"
          aria-label="ยกเลิกการเลือก"
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
    </div>
  );
}

const ORDER_STEPS = [
  "คำสั่งซื้อ",
  "รอการชำระ",
  "ชำระแล้ว",
  "กำลังจัดเตรียม",
  "จัดเตรียมเสร็จสิ้น",
  "กำลังจัดส่ง",
  "จัดส่งสำเร็จ",
  "ยกเลิกคำสั่งซื้อ",
];

function UpdateOrderDrawer({ count, onClose }: { count: number; onClose: () => void }) {
  const current = 3; // index of the "next" step
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="ปิด"
        onClick={onClose}
        className="absolute inset-0 bg-black/25"
      />
      <aside className="relative w-[364px] max-w-full h-full bg-white rounded-l-2xl shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] flex flex-col animate-dropdown">
        {/* Header */}
        <div className="flex items-center gap-2 px-6 pt-6 pb-4 border-b border-[var(--color-neutral-200)]">
          <p className="flex-1 text-[18px] font-bold text-black">การดำเนินการ</p>
          <button
            type="button"
            aria-label="ปิด"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[var(--color-neutral-200)] flex items-center justify-center text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-300)] transition-colors"
          >
            <Icon name="close" size={14} />
          </button>
        </div>

        {/* Steps */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {ORDER_STEPS.map((label, i) => {
            const isLast = i === ORDER_STEPS.length - 1;
            const done = i < current;
            const isCurrent = i === current;
            const dotClass = done
              ? "bg-[var(--color-primary)] text-white"
              : isCurrent
              ? "bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)]"
              : "bg-white border-2 border-[var(--color-neutral-500)] text-[var(--color-neutral-500)]";
            const lineClass = i < current ? "bg-[var(--color-primary)]" : "bg-[var(--color-neutral-300)]";
            const labelClass = done || isCurrent ? "text-[var(--color-primary)]" : "text-[var(--color-neutral-900)]";
            const dateClass = done || isCurrent ? "text-[var(--color-neutral-900)]" : "text-[var(--color-neutral-500)]";
            return (
              <div key={label} className="flex gap-6 items-stretch">
                <div className="flex flex-col items-center w-6 shrink-0">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${dotClass}`}
                  >
                    {i + 1}
                  </span>
                  {!isLast && <span className={`w-0.5 flex-1 my-1 rounded-full ${lineClass}`} />}
                </div>
                <div className={`flex-1 ${isLast ? "" : "pb-6"}`}>
                  <p className={`text-[14px] font-medium ${labelClass}`}>{label}</p>
                  <p className={`text-[12px] mt-1.5 ${dateClass}`}>วันที่ 24 ส.ค. 2569</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--color-neutral-200)] p-6 flex gap-3">
          <button
            type="button"
            className="flex-1 h-10 rounded-lg border border-[var(--color-neutral-300)] text-[14px] font-medium text-[var(--color-neutral-900)] flex items-center justify-center gap-2 hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.06258 7.48587C4.02115 7.21883 3.99965 6.94525 3.99965 6.66668C3.99965 3.72116 6.40317 1.33334 9.36807 1.33334C12.333 1.33334 14.7365 3.72116 14.7365 6.66668C14.7365 7.33206 14.6138 7.96898 14.3898 8.55635C14.3432 8.67833 14.32 8.73933 14.3094 8.78695C14.2989 8.83413 14.2949 8.86733 14.2938 8.91564C14.2926 8.96441 14.2992 9.01813 14.3125 9.12556L14.5808 11.3057C14.6099 11.5417 14.6244 11.6597 14.5852 11.7455C14.5508 11.8207 14.4897 11.8804 14.4137 11.913C14.3271 11.9503 14.2094 11.933 13.9742 11.8986L11.8506 11.5873C11.7398 11.571 11.6843 11.5629 11.6338 11.5632C11.5839 11.5635 11.5493 11.5672 11.5004 11.5774C11.451 11.5878 11.3879 11.6115 11.2617 11.6588C10.6728 11.8793 10.0346 12 9.36807 12C9.08928 12 8.81545 11.9789 8.54811 11.9382M5.08739 14.6667C7.06399 14.6667 8.66634 13.0251 8.66634 11C8.66634 8.97497 7.06399 7.33334 5.08739 7.33334C3.1108 7.33334 1.50845 8.97497 1.50845 11C1.50845 11.4071 1.57319 11.7986 1.69271 12.1645C1.74323 12.3191 1.76849 12.3965 1.77678 12.4493C1.78543 12.5045 1.78695 12.5354 1.78373 12.5912C1.78064 12.6445 1.76728 12.7049 1.74057 12.8255L1.33301 14.6667L3.32954 14.394C3.43852 14.3791 3.49301 14.3717 3.54059 14.372C3.59069 14.3723 3.61728 14.3751 3.66641 14.3849C3.71308 14.3942 3.78245 14.4186 3.92119 14.4676C4.28674 14.5966 4.67908 14.6667 5.08739 14.6667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            แชทลูกค้า
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:bg-[var(--color-primary-600)] transition-colors"
          >
            ดำเนินการต่อ{count > 1 ? ` (${count})` : ""}
          </button>
        </div>
      </aside>
    </div>
  );
}

function StatusBadge({ status }: { status: StatusKey }) {
  const s = STATUS[status];
  return (
    <span
      className="inline-flex items-center justify-center px-4 py-1 rounded text-[12px] font-medium whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

function fmtMoney(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function SellerOrders() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [page, setPage] = useState(2);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rows = tab === "all" ? ORDERS : ORDERS.filter((o) => o.status === tab);
  const pages = [1, 2, 3, 4, 5, "…", 12] as const;

  const toggleRow = (i: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  const allSelected = rows.length > 0 && rows.every((_, i) => selected.has(i));
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(rows.map((_, i) => i)));
  const resetSelection = () => setSelected(new Set());

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader onMenuClick={() => setMobileMenuOpen(true)} />
      <div className="flex">
        <SellerSidebar active="คำสั่งซื้อ" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
          {/* Title + search */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-[20px] font-semibold text-[var(--color-primary-700)]">
              คำสั่งซื้อ
            </h1>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="ค้นหาหมายเลขคำสั่งซื้อ, ชื่อลูกค้า"
                className="h-10 w-[400px] bg-white border border-[var(--color-neutral-300)] rounded-l-lg px-4 text-[16px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary)]"
              />
              <button
                type="button"
                aria-label="ค้นหา"
                className="h-10 px-4 flex items-center justify-center rounded-r-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-600)] transition-colors"
              >
                <SearchIcon size={20} />
              </button>
            </div>
          </div>

          {/* Status tabs */}
          <div className="flex bg-white border border-[var(--color-neutral-200)] rounded-lg p-1 gap-0">
            {TABS.map((t) => {
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => {
                    setTab(t.key);
                    setPage(1);
                    resetSelection();
                  }}
                  className={[
                    "flex-1 h-8 px-4 flex items-center justify-center gap-2 rounded text-[14px] font-medium tracking-[-0.006em] transition-colors whitespace-nowrap",
                    active
                      ? "bg-[var(--color-primary)] text-white shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)]"
                      : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]",
                  ].join(" ")}
                >
                  <span>{t.label}</span>
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-[var(--color-critical)] text-white text-[12px] leading-none">
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] flex flex-col flex-1 min-h-0">
            {/* Header */}
            <div
              className={`grid ${COLS} bg-[var(--color-primary-100)] border-b border-[var(--color-neutral-200)] text-[12px] font-medium uppercase text-[var(--color-neutral-600)]`}
            >
              <div className="flex items-center justify-center h-8">
                <CheckBox checked={allSelected} onChange={toggleAll} />
              </div>
              <div className="flex items-center h-8 pr-4">หมายเลขคำสั่งซื้อ</div>
              <div className="flex items-center h-8 pr-4">ลูกค้า</div>
              <div className="flex items-center justify-center h-8 px-4">วันที่-เวลา</div>
              <div className="flex items-center justify-center h-8 px-4">รายการสินค้า</div>
              <div className="flex items-center justify-center h-8 px-4">ยอดรวม (฿)</div>
              <div className="flex items-center justify-center h-8 px-4">สถานะ</div>
              <div className="flex items-center justify-center h-8 px-4">การดำเนินการ</div>
            </div>

            {/* Rows */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {rows.map((o, i) => {
                const isSel = selected.has(i);
                return (
                <div
                  key={i}
                  onClick={() => navigate("/seller/orders/detail")}
                  className={[
                    "grid cursor-pointer",
                    COLS,
                    "items-center border-b border-[var(--color-neutral-200)] last:border-b-0 py-3 transition-colors",
                    isSel ? "bg-[#f7fcfe]" : "hover:bg-[var(--color-primary-100)]/40",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-center">
                    <CheckBox checked={isSel} onChange={() => toggleRow(i)} />
                  </div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] pr-4">{o.id}</div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] pr-4 truncate">{o.customer}</div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] text-center px-4">{o.datetime}</div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] text-center px-4">{o.items}</div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] text-center px-4 tabular-nums">{fmtMoney(o.total)}</div>
                  <div className="flex justify-center px-4">
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="px-4 text-center">
                    <button
                      type="button"
                      onClick={() => navigate("/seller/orders/detail")}
                      className="text-[14px] text-[var(--color-primary)] hover:underline"
                    >
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
                );
              })}
              {rows.length === 0 && (
                <div className="py-16 text-center text-[14px] text-[var(--color-neutral-500)]">
                  ไม่มีรายการ
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="border-t border-[var(--color-neutral-300)] h-14 flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <p className="text-[14px]">
                  <span className="text-[var(--color-neutral-900)]">10,488 </span>
                  <span className="text-[var(--color-neutral-500)]">รายการ</span>
                </p>
                <span className="w-px h-6 bg-[var(--color-neutral-300)]" />
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[var(--color-neutral-500)]">แสดง</span>
                  <button
                    type="button"
                    className="h-8 pl-3 pr-2 flex items-center gap-2 rounded-lg bg-white border border-[var(--color-neutral-300)] text-[14px] font-semibold text-[var(--color-primary)]"
                  >
                    20
                    <Icon name="chevron-down" size={14} className="text-[var(--color-neutral-600)]" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
                  aria-label="ก่อนหน้า"
                >
                  <Icon name="chevron-left" size={16} />
                </button>
                {pages.map((p, i) =>
                  p === "…" ? (
                    <span key={i} className="w-8 h-8 flex items-center justify-center text-[12px] text-[var(--color-neutral-600)]">
                      …
                    </span>
                  ) : (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPage(p)}
                      className={[
                        "min-w-8 h-8 px-2 flex items-center justify-center rounded text-[12px] font-medium transition-colors",
                        p === page
                          ? "bg-[#dcf2fe] text-[#0e3ed0]"
                          : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]",
                      ].join(" ")}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
                  aria-label="ถัดไป"
                >
                  <Icon name="chevron-right" size={16} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      {selected.size > 0 && (
        <BulkActionBar
          count={selected.size}
          onClose={resetSelection}
          onUpdate={() => setDrawerOpen(true)}
        />
      )}
      {drawerOpen && (
        <UpdateOrderDrawer count={selected.size} onClose={() => setDrawerOpen(false)} />
      )}
    </div>
  );
}
