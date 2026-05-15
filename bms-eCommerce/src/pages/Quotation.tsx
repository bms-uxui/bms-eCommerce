import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import TabBar from "../components/landing/TabBar";
import ProfilePageShell from "../components/landing/ProfilePageShell";

type QuoteStatus =
  | "pending"
  | "contacted"
  | "quoted"
  | "accepted"
  | "ordered"
  | "closed"
  | "expired"
  | "cancelled";

type TabKey = "all" | QuoteStatus;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "pending", label: "รอดำเนินการ" },
  { key: "contacted", label: "ติดต่อแล้ว" },
  { key: "quoted", label: "เสนอราคาแล้ว" },
  { key: "accepted", label: "ยอมรับแล้ว" },
  { key: "ordered", label: "สร้างคำสั่งซื้อแล้ว" },
  { key: "expired", label: "หมดอายุ" },
  { key: "cancelled", label: "ยกเลิก" },
];

const STATUS_LABEL: Record<QuoteStatus, string> = {
  pending: "รอดำเนินการ",
  contacted: "ติดต่อแล้ว",
  quoted: "เสนอราคาแล้ว",
  accepted: "ยอมรับแล้ว",
  ordered: "สร้างคำสั่งซื้อแล้ว",
  closed: "ปิด",
  expired: "หมดอายุ",
  cancelled: "ยกเลิกแล้ว",
};

const STATUS_STYLE: Record<QuoteStatus, string> = {
  pending: "bg-[#fdefb0] text-[#863a00]",
  contacted: "bg-[#cce7ff] text-[#025094]",
  quoted: "bg-[#f5ebfe] text-[#5824d4]",
  accepted: "bg-[#d6fc92] text-[#235c04]",
  ordered: "bg-[#d6fc92] text-[#235c04]",
  closed: "bg-[#feeaed] text-[#a3072b]",
  expired: "bg-[#feeaed] text-[#a3072b]",
  cancelled: "bg-[#feeaed] text-[#a3072b]",
};

type Quote = {
  id: string;
  number: string;
  requestedAt: string;
  itemCount: number;
  status: QuoteStatus;
};

const STATUS_POOL: QuoteStatus[] = [
  "pending",
  "contacted",
  "quoted",
  "accepted",
  "ordered",
  "closed",
  "expired",
  "cancelled",
];

function pad(n: number, width: number) {
  return n.toString().padStart(width, "0");
}

const QUOTES: Quote[] = Array.from({ length: 237 }, (_, i) => {
  const day = (i % 28) + 1;
  const month = ((i * 3) % 12) + 1;
  const hour = (i * 7) % 24;
  const minute = (i * 13) % 60;
  return {
    id: `q-${i + 1}`,
    number: `#BMS-09876${pad(54 + i, 2)}-${pad((i * 11) % 100, 2)}`,
    requestedAt: `${pad(day, 2)}/${pad(month, 2)}/2026 ${pad(hour, 2)}:${pad(minute, 2)}`,
    itemCount: ((i * 5) % 8) + 1,
    status: STATUS_POOL[i % STATUS_POOL.length],
  };
});

function StatusBadge({ status }: { status: QuoteStatus }) {
  return (
    <span
      className={`inline-flex items-center justify-center px-2 sm:px-4 py-1 rounded text-[11px] sm:text-[12px] font-medium whitespace-nowrap ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function QuoteRow({ quote }: { quote: Quote }) {
  const navigate = useNavigate();
  const slug = quote.number.replace(/^#/, "");
  const open = () => navigate(`/quotation/${slug}?status=${quote.status}`);
  return (
    <div
      className="flex items-center px-4 py-3 border-b border-[#e9f0f4] text-[14px] text-[var(--color-neutral-900)] cursor-pointer hover:bg-[var(--color-neutral-100)] transition-colors"
      onClick={open}
    >
      <div className="flex-1 leading-4 truncate">{quote.number}</div>
      <div className="flex-1 text-center leading-4">{quote.requestedAt}</div>
      <div className="flex-1 text-center leading-4">{quote.itemCount}</div>
      <div className="flex-1 flex justify-center">
        <StatusBadge status={quote.status} />
      </div>
      <div className="flex-1 text-center">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); open(); }}
          className="text-[var(--color-primary)] hover:underline leading-4 text-[14px]"
        >
          ดูรายละเอียด
        </button>
      </div>
    </div>
  );
}

function PaginationFooter({
  total,
  pageSize,
  page,
  pageCount,
  onPageChange,
  onPageSizeChange,
}: {
  total: number;
  pageSize: number;
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (n: number) => void;
}) {
  const pagesShown = (() => {
    if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
    // Show: 1, 2, …, current-1, current, current+1, …, pageCount (deduped)
    const set = new Set<number | "…">();
    const add = (v: number | "…") => set.add(v);
    add(1);
    add(2);
    if (page > 4) add("…");
    for (let p = Math.max(3, page - 1); p <= Math.min(pageCount - 2, page + 1); p++) {
      add(p);
    }
    if (page < pageCount - 3) add("…");
    add(pageCount - 1);
    add(pageCount);
    return Array.from(set);
  })();

  return (
    <div className="border-t border-[var(--color-neutral-300)] min-h-[56px] flex flex-wrap items-center justify-between px-2 sm:px-4 py-2 gap-2">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-2 text-[13px] sm:text-[14px]">
          <span className="text-[var(--color-neutral-900)] tabular-nums">
            {total.toLocaleString("en-US")}
          </span>
          <span className="text-[var(--color-neutral-500)]">รายการ</span>
        </div>
        <span className="w-px h-6 bg-[var(--color-neutral-300)]" />
        <div className="flex items-center gap-1 sm:gap-2 text-[13px] sm:text-[14px]">
          <span className="text-[var(--color-neutral-500)]">แสดง</span>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="appearance-none bg-white border border-[var(--color-neutral-300)] rounded-lg h-8 pl-3 pr-8 text-[14px] font-semibold text-[var(--color-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-neutral-700)]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] disabled:opacity-40 transition"
          aria-label="ก่อนหน้า"
        >
          <ChevronLeft size={16} />
        </button>
        {pagesShown.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-[var(--color-neutral-600)]"
            >
              <MoreHorizontal size={16} />
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={[
                "min-w-8 h-8 px-2 flex items-center justify-center rounded text-[12px] font-medium transition",
                page === p
                  ? "bg-[#dcf2fe] text-[#0e3ed0]"
                  : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)]",
              ].join(" ")}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          disabled={page === pageCount}
          className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] disabled:opacity-40 transition"
          aria-label="ถัดไป"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default function Quotation() {
  const [active, setActive] = useState<TabKey>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered =
    active === "all" ? QUOTES : QUOTES.filter((q) => q.status === active);

  const totalRecords = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const changePageSize = (n: number) => {
    setPageSize(n);
    setPage(1);
  };
  const changeTab = (k: TabKey) => {
    setActive(k);
    setPage(1);
  };

  return (
    <ProfilePageShell activeKey="quotes">
      <div
        className="flex flex-col page-section-in"
        style={{ animationDelay: "200ms" }}
      >
        <div className="bg-white rounded-2xl border border-[var(--color-neutral-300)] flex flex-col">
          <TabBar
            sticky
            active={active}
            onChange={changeTab}
            items={TABS}
            className="rounded-t-2xl"
          />

          {/* Table */}
          <div className="shadow-[0_0_0.5px_rgba(29,33,45,0.2),0_0_1px_rgba(29,33,45,0.08),0_2px_2px_rgba(29,33,45,0.08)] m-2 rounded-xl bg-white flex flex-col">
            {/* Column headers */}
            <div className="flex items-center bg-[var(--color-primary-100)] border-b border-[#e9f0f4] rounded-t-xl px-4">
              <div className="flex-1 py-2.5 text-[12px] font-medium text-[var(--color-neutral-600)] uppercase">
                หมายเลขคำขอ
              </div>
              <div className="flex-1 py-2.5 text-[12px] font-medium text-[var(--color-neutral-600)] uppercase text-center">
                วันที่ขอ
              </div>
              <div className="flex-1 py-2.5 text-[12px] font-medium text-[var(--color-neutral-600)] uppercase text-center">
                จำนวนสินค้า (อย่าง)
              </div>
              <div className="flex-1 py-2.5 text-[12px] font-medium text-[var(--color-neutral-600)] uppercase text-center">
                สถานะ
              </div>
              <div className="flex-1 py-2.5 text-[12px] font-medium text-[var(--color-neutral-600)] uppercase text-center">
                การดำเนินการ
              </div>
            </div>

            {/* Rows: fixed height for 10 rows (~41px each); scrolls when more */}
            <div className="flex flex-col h-[410px] overflow-y-auto">
              {visible.length === 0 ? (
                <div className="py-16 text-center text-[14px] text-[var(--color-neutral-500)]">
                  ไม่พบรายการ
                </div>
              ) : (
                visible.map((q) => <QuoteRow key={q.id} quote={q} />)
              )}
            </div>

            <PaginationFooter
              total={totalRecords}
              pageSize={pageSize}
              page={safePage}
              pageCount={pageCount}
              onPageChange={setPage}
              onPageSizeChange={changePageSize}
            />
          </div>
        </div>
      </div>
    </ProfilePageShell>
  );
}
