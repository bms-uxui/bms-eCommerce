import { useState } from "react";
import { useNavigate } from "react-router";
import Icon from "../components/landing/Icon";
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
            <Icon name={a.icon} size={20} />
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
            <Icon name="comments" size={18} />
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
      <SellerHeader />
      <div className="flex">
        <SellerSidebar active="คำสั่งซื้อ" />
        <main className="flex-1 min-w-0 px-8 py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
          {/* Title + search */}
          <div className="flex items-center justify-between gap-4">
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
                <Icon name="search" size={20} />
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
