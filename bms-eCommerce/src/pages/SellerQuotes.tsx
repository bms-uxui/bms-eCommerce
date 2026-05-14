import { useState } from "react";
import { useNavigate } from "react-router";
import { Ban, Mail, Pencil, Phone, X } from "lucide-react";
import Icon from "../components/landing/Icon";
import SearchIcon from "../components/SearchIcon";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import CheckBox from "../components/CheckBox";

type QuoteStatus =
  | "pending"
  | "contacted"
  | "quoted"
  | "accepted"
  | "ordered"
  | "expired"
  | "cancelled";

const STATUS: Record<
  QuoteStatus,
  { label: string; bg: string; text: string; step: number }
> = {
  pending: { label: "รอดำเนินการ", bg: "#fdefb0", text: "#863a00", step: 2 },
  contacted: { label: "ติดต่อแล้ว", bg: "#cce7ff", text: "#025094", step: 3 },
  quoted: { label: "เสนอราคาแล้ว", bg: "#f5ebfe", text: "#5824d4", step: 4 },
  accepted: { label: "ยอมรับแล้ว", bg: "#d6fc92", text: "#235c04", step: 5 },
  ordered: { label: "สร้างคำสั่งซื้อแล้ว", bg: "#d6fc92", text: "#235c04", step: 6 },
  expired: { label: "หมดอายุ", bg: "#feeaed", text: "#a3072b", step: 7 },
  cancelled: { label: "ยกเลิกแล้ว", bg: "#feeaed", text: "#a3072b", step: 7 },
};

const TABS: { key: "all" | QuoteStatus; label: string; count: number }[] = [
  { key: "all", label: "ทั้งหมด", count: 6 },
  { key: "pending", label: "รอดำเนินการ", count: 1 },
  { key: "contacted", label: "ติดต่อแล้ว", count: 1 },
  { key: "quoted", label: "เสนอราคาแล้ว", count: 1 },
  { key: "accepted", label: "ยอมรับแล้ว", count: 1 },
  { key: "ordered", label: "สร้างคำสั่งซื้อแล้ว", count: 1 },
  { key: "expired", label: "หมดอายุ", count: 1 },
  { key: "cancelled", label: "ยกเลิกคำขอ", count: 1 },
];

const TIMELINE = [
  "คำขอใบเสนอราคา",
  "รอดำเนินการ",
  "ติดต่อแล้ว",
  "เสนอราคาแล้ว",
  "ลูกค้ายอมรับใบเสนอราคาแล้ว",
  "สร้างคำสั่งซื้อแล้ว",
  "ยกเลิกคำขอใบเสนอราคา",
];

type QuoteRow = {
  id: string;
  number: string;
  customer: string;
  items: number;
  datetime: string;
  status: QuoteStatus;
};

const QUOTES: QuoteRow[] = [
  { id: "q1", number: "#BMS-0987654-87", customer: "ananda kongsai", items: 1, datetime: "12/09/2026-15.07", status: "pending" },
  { id: "q2", number: "#BMS-0987654-87", customer: "ananda kongsai", items: 1, datetime: "12/09/2026-15.07", status: "contacted" },
  { id: "q3", number: "#BMS-0987654-87", customer: "ananda kongsai", items: 1, datetime: "12/09/2026-15.07", status: "quoted" },
  { id: "q4", number: "#BMS-0987654-87", customer: "ananda kongsai", items: 1, datetime: "12/09/2026-15.07", status: "accepted" },
  { id: "q5", number: "#BMS-0987654-87", customer: "ananda kongsai", items: 1, datetime: "12/09/2026-15.07", status: "ordered" },
  { id: "q6", number: "#BMS-0987654-87", customer: "ananda kongsai", items: 1, datetime: "12/09/2026-15.07", status: "expired" },
  { id: "q7", number: "#BMS-0987654-87", customer: "ananda kongsai", items: 1, datetime: "12/09/2026-15.07", status: "cancelled" },
];

const COLS = "grid-cols-[48px_1fr_1fr_1fr_1fr_1fr_1fr]";

function StatusBadge({ status }: { status: QuoteStatus }) {
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


// Steps 1-6 are the linear progression; step 7 (ยกเลิกคำขอ) is a terminal state
// that "ดำเนินการต่อ" never advances into.
const LAST_PROGRESS_STEP = 6;

function ActionDrawer({
  quote,
  onClose,
}: {
  quote: QuoteRow;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(STATUS[quote.status].step);
  const canAdvance = current < LAST_PROGRESS_STEP;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="ปิด"
        onClick={onClose}
        className="drawer-overlay-in absolute inset-0 bg-black/30"
      />
      <aside className="drawer-panel-in relative w-[420px] max-w-[90vw] h-full bg-white shadow-[0_0_1px_rgba(29,33,45,0.2),0_16px_32px_rgba(29,33,45,0.16)] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-neutral-200)]">
          <h2 className="text-[18px] font-semibold text-[var(--color-neutral-900)]">
            การดำเนินการ
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {TIMELINE.map((label, i) => {
            const stepNo = i + 1;
            const done = stepNo < current;
            const isCurrent = stepNo === current;
            const reached = done || isCurrent;
            const last = i === TIMELINE.length - 1;
            return (
              <div
                key={label}
                className="step-row-in flex gap-3"
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <div className="flex flex-col items-center">
                  <span
                    className={[
                      "w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0 transition-all duration-300",
                      done
                        ? "bg-[var(--color-primary)] text-white"
                        : isCurrent
                          ? "border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-white"
                          : "bg-[var(--color-neutral-200)] text-[var(--color-neutral-500)]",
                    ].join(" ")}
                  >
                    {stepNo}
                  </span>
                  {!last && (
                    <span
                      className={[
                        "w-px flex-1 min-h-[28px] my-1 transition-colors duration-500",
                        reached && stepNo < current
                          ? "bg-[var(--color-primary)]"
                          : "bg-[var(--color-neutral-200)]",
                      ].join(" ")}
                    />
                  )}
                </div>
                <div className={`pb-6 ${last ? "pb-0" : ""}`}>
                  <p
                    className={[
                      "text-[14px] leading-5 transition-colors duration-300",
                      reached
                        ? "font-medium text-[var(--color-neutral-900)]"
                        : "text-[var(--color-neutral-500)]",
                    ].join(" ")}
                  >
                    {label}
                  </p>
                  <p className="text-[12px] text-[var(--color-neutral-500)] mt-0.5">
                    วันที่ 24 ส.ค. 2569
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--color-neutral-200)] px-6 py-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => canAdvance && setCurrent((s) => s + 1)}
            disabled={!canAdvance}
            className="h-10 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:bg-[var(--color-primary-600)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-primary)]"
          >
            ดำเนินการต่อ
          </button>
          <p className="text-[12px] text-[var(--color-neutral-500)]">
            ช่องทางการติดต่อลูกค้า
          </p>
          <button
            type="button"
            className="h-10 rounded-lg border border-[var(--color-neutral-300)] text-[14px] font-medium text-[var(--color-neutral-900)] flex items-center justify-center gap-2 hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors"
          >
            <Mail size={16} />
            ติดต่อด้วยอีเมล
          </button>
          <button
            type="button"
            className="h-10 rounded-lg border border-[var(--color-neutral-300)] text-[14px] font-medium text-[var(--color-neutral-900)] flex items-center justify-center gap-2 hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors"
          >
            <Phone size={16} />
            ติดต่อด้วยการโทร
          </button>
        </div>
      </aside>
    </div>
  );
}

function SelectionBar({
  count,
  onClear,
  onUpdate,
  canUpdate,
}: {
  count: number;
  onClear: () => void;
  onUpdate: () => void;
  canUpdate: boolean;
}) {
  return (
    <div className="fixed bottom-6 left-[232px] right-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="dock-bar-in pointer-events-auto flex items-stretch bg-[var(--color-primary)] text-white rounded-xl shadow-[0_8px_24px_rgba(29,33,45,0.24)] overflow-hidden">
        <div className="flex items-center px-5 text-[14px] font-medium whitespace-nowrap">
          {count} รายการ
        </div>
        <span className="w-px bg-white/25" />
        <button
          type="button"
          onClick={onUpdate}
          disabled={!canUpdate}
          title={canUpdate ? undefined : "เลือกได้เฉพาะคำขอที่มีสถานะเดียวกัน"}
          className="flex items-center gap-2 px-5 py-3 text-[14px] hover:bg-white/10 transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          <Pencil size={16} />
          อัปเดตคำขอ
        </button>
        <span className="w-px bg-white/25" />
        <button
          type="button"
          className="flex items-center gap-2 px-5 py-3 text-[14px] hover:bg-white/10 transition-colors whitespace-nowrap"
        >
          <Ban size={16} />
          ยกเลิกคำขอ
        </button>
        <span className="w-px bg-white/25" />
        <button
          type="button"
          onClick={onClear}
          aria-label="ยกเลิกการเลือก"
          className="flex items-center px-4 hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

export default function SellerQuotes() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [page, setPage] = useState(2);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawerQuote, setDrawerQuote] = useState<QuoteRow | null>(null);

  const rows = tab === "all" ? QUOTES : QUOTES.filter((q) => q.status === tab);
  const pages = [1, 2, 3, 4, 5, "…", 12] as const;
  const openDetail = (q: QuoteRow) =>
    navigate(`/seller/quotes/${q.number.replace(/^#/, "")}?status=${q.status}`);

  const selectedQuotes = QUOTES.filter((q) => selected.has(q.id));
  const sameStatus =
    selectedQuotes.length > 0 &&
    selectedQuotes.every((q) => q.status === selectedQuotes[0].status);

  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allOnPageSelected =
    rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggleAll = () =>
    setSelected((s) => {
      const next = new Set(s);
      if (allOnPageSelected) rows.forEach((r) => next.delete(r.id));
      else rows.forEach((r) => next.add(r.id));
      return next;
    });

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader />
      <div className="flex">
        <SellerSidebar active="ใบเสนอราคา" />
        <main className="flex-1 min-w-0 px-8 py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
          {/* Title + search */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-[20px] font-semibold text-[var(--color-primary-700)]">
              ใบเสนอราคา
            </h1>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="ค้นหาหมายเลขคำสั่งซื้อ, ชื่อลูกค้า, หน่วยงาน"
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
                  }}
                  className={[
                    "flex-1 h-8 px-3 flex items-center justify-center gap-1.5 rounded text-[14px] font-medium tracking-[-0.006em] transition-colors whitespace-nowrap",
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
                <CheckBox checked={allOnPageSelected} onChange={toggleAll} />
              </div>
              <div className="flex items-center h-8 pr-4">หมายเลขคำขอ</div>
              <div className="flex items-center h-8 pr-4">ลูกค้าผู้ติดต่อ</div>
              <div className="flex items-center justify-center h-8 px-4">จำนวนสินค้า (อย่าง)</div>
              <div className="flex items-center justify-center h-8 px-4">วันที่-เวลา</div>
              <div className="flex items-center justify-center h-8 px-4">สถานะ</div>
              <div className="flex items-center justify-center h-8 px-4">การดำเนินการ</div>
            </div>

            {/* Rows */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {rows.map((q) => (
                <div
                  key={q.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openDetail(q)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openDetail(q);
                    }
                  }}
                  className={`grid ${COLS} items-center border-b border-[var(--color-neutral-200)] last:border-b-0 py-3 cursor-pointer transition-colors ${
                    selected.has(q.id)
                      ? "bg-[var(--color-primary-100)]/60"
                      : "hover:bg-[var(--color-primary-100)]/40"
                  }`}
                >
                  <div
                    className="flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CheckBox checked={selected.has(q.id)} onChange={() => toggle(q.id)} />
                  </div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] pr-4">{q.number}</div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] pr-4 truncate">{q.customer}</div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] text-center px-4">{q.items}</div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] text-center px-4">{q.datetime}</div>
                  <div className="flex justify-center px-4">
                    <StatusBadge status={q.status} />
                  </div>
                  <div className="px-4 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetail(q);
                      }}
                      className="text-[14px] text-[var(--color-primary)] hover:underline"
                    >
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
              ))}
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
        <SelectionBar
          count={selected.size}
          canUpdate={sameStatus}
          onClear={() => setSelected(new Set())}
          onUpdate={() => {
            if (sameStatus && selectedQuotes[0]) setDrawerQuote(selectedQuotes[0]);
          }}
        />
      )}
      {drawerQuote && (
        <ActionDrawer quote={drawerQuote} onClose={() => setDrawerQuote(null)} />
      )}
    </div>
  );
}
