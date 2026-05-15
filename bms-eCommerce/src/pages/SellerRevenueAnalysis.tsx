import { useMemo, useRef, useState } from "react";
import { Calendar } from "lucide-react";
import Icon from "../components/landing/Icon";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import { ChangeBadge } from "./SellerOverview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

type PeriodKey = "day" | "week" | "month" | "year" | "custom";

const PERIOD_TABS: { key: PeriodKey; label: string }[] = [
  { key: "day", label: "รายวัน" },
  { key: "week", label: "รายสัปดาห์" },
  { key: "month", label: "รายเดือน" },
  { key: "year", label: "รายปี" },
  { key: "custom", label: "กำหนดเอง" },
];

const CARD_SHADOW =
  "shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)]";

function SectionHint({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 max-w-[300px]">
      <FontAwesomeIcon
        icon={faCircleInfo}
        className="mt-0.5 shrink-0 text-[var(--color-neutral-500)] text-[14px]"
      />
      <p className="text-[12px] leading-4 text-[var(--color-neutral-500)]">{text}</p>
    </div>
  );
}

/* ---------- Date selector ---------- */

const THAI_MONTH_SHORT = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

function formatDateRange(period: PeriodKey, base: Date): string {
  const y = base.getFullYear() + 543;
  if (period === "day") {
    return `${base.getDate()} ${THAI_MONTH_SHORT[base.getMonth()]} ${y}`;
  }
  if (period === "week") {
    const start = new Date(base);
    start.setDate(base.getDate() - 6);
    return `${start.getDate()} ${THAI_MONTH_SHORT[start.getMonth()]} - ${base.getDate()} ${THAI_MONTH_SHORT[base.getMonth()]} ${y}`;
  }
  if (period === "month") {
    return `${THAI_MONTH_SHORT[base.getMonth()]} ${y}`;
  }
  if (period === "year") {
    return `${y}`;
  }
  return `${base.getDate()} ${THAI_MONTH_SHORT[base.getMonth()]} ${y}`;
}

function PeriodSelector({
  period,
  onChange,
  label,
  onPrev,
  onNext,
}: {
  period: PeriodKey;
  onChange: (p: PeriodKey) => void;
  label: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Segmented control */}
      <div className="bg-[#e9f0f4] rounded-[8px] p-[4px] flex items-center justify-center h-10">
        {PERIOD_TABS.map((t) => {
          const isActive = t.key === period;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={[
                "h-8 px-4 rounded-[4px] text-[14px] font-medium transition-all whitespace-nowrap",
                isActive
                  ? "bg-white text-[var(--color-primary)] shadow-[0_0_1px_rgba(29,33,45,0.2),0_0_2px_rgba(29,33,45,0.08),0_2px_4px_rgba(29,33,45,0.08)]"
                  : "text-[#5d6c87] hover:text-[var(--color-primary)]",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Date navigator */}
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={onPrev}
          aria-label="ก่อนหน้า"
          className="w-8 h-8 flex items-center justify-center bg-white border border-[#e9f0f4] rounded-[4px] text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors"
        >
          <Icon name="chevron-left" size={16} />
        </button>
        <div className="flex items-center gap-2 text-[16px] text-[#1d212d]">
          <span>{label}</span>
          <Calendar size={20} className="text-[#5d6c87]" />
        </div>
        <button
          type="button"
          onClick={onNext}
          aria-label="ถัดไป"
          className="w-8 h-8 flex items-center justify-center bg-white border border-[#e9f0f4] rounded-[4px] text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors"
        >
          <Icon name="chevron-right" size={16} />
        </button>
      </div>
    </div>
  );
}

/* ---------- Bar chart ---------- */

type BarPoint = { label: string; sales: number; orders: number };

const HOURLY_DATA: BarPoint[] = [
  { label: "08:00", sales: 70000, orders: 1300 },
  { label: "10:00", sales: 45000, orders: 600 },
  { label: "14:00", sales: 95000, orders: 1900 },
  { label: "16:00", sales: 28058, orders: 150 },
  { label: "18:00", sales: 38000, orders: 700 },
  { label: "20:00", sales: 30000, orders: 500 },
  { label: "22:00", sales: 56000, orders: 1400 },
];

const SALES_TICKS = [100000, 50000, 20000, 15000, 10000, 5000, 0];
const ORDER_TICKS = [3000, 2000, 1500, 1000, 500, 100, 0];

function thousands(n: number): string {
  return n.toLocaleString("en-US");
}

function BarChart({ data, dateLabel }: { data: BarPoint[]; dateLabel: string }) {
  const [hover, setHover] = useState<number | null>(3);
  const maxSales = SALES_TICKS[0];
  const maxOrders = ORDER_TICKS[0];

  return (
    <div className="w-full">
      <div className="relative">
        <div className="grid grid-cols-[46px_1fr_46px] gap-2">
          {/* Left axis labels (sales ฿) */}
          <div className="relative h-[297px]">
            {SALES_TICKS.map((t, i) => (
              <span
                key={i}
                className="absolute right-0 -translate-y-1/2 text-[12px] text-[var(--color-neutral-500)] tabular-nums"
                style={{ top: `${(i / (SALES_TICKS.length - 1)) * 100}%` }}
              >
                {thousands(t)}
              </span>
            ))}
          </div>

          {/* Plot area */}
          <div className="relative h-[297px]">
            {/* Horizontal gridlines */}
            {SALES_TICKS.map((_, i) => (
              <span
                key={i}
                className="absolute left-0 right-0 border-t border-dashed border-[var(--color-neutral-200)]"
                style={{ top: `${(i / (SALES_TICKS.length - 1)) * 100}%` }}
              />
            ))}

            {/* Bars */}
            <div className="absolute inset-0 grid grid-cols-7">
              {data.map((d, i) => {
                const salesPct = (d.sales / maxSales) * 100;
                const ordersPct = (d.orders / maxOrders) * 100;
                const isHover = hover === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                    className="relative flex items-end justify-center gap-2 h-full focus:outline-none"
                  >
                    {/* Sales bar (blue) */}
                    <span
                      className="block w-[39px] rounded-t bg-gradient-to-b from-[#0485f7] via-[#21bdff] to-[#cdedff] transition-opacity"
                      style={{ height: `${salesPct}%`, opacity: isHover ? 1 : 0.95 }}
                    />
                    {/* Orders bar (green) */}
                    <span
                      className="block w-[39px] rounded-t bg-gradient-to-b from-[#5dbf36] via-[#a5e36a] to-[#e6f8d0] transition-opacity"
                      style={{ height: `${ordersPct}%`, opacity: isHover ? 1 : 0.95 }}
                    />

                    {/* Tooltip */}
                    {isHover && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none"
                        style={{ bottom: `${Math.max(salesPct, ordersPct) + 4}%` }}
                      >
                        <div className="relative bg-[#1d212d] text-white rounded-lg px-3 py-2.5 w-[230px] shadow-lg text-left">
                          <div className="flex items-center justify-between text-[12px] text-white">
                            <span>{dateLabel}</span>
                            <span>
                              {d.label.replace(":", ".")} น.
                            </span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-1">
                            <p className="text-[13px] text-[#7cd2ff]">
                              ยอดขาย : <span className="tabular-nums">{thousands(d.sales)}</span> บาท
                            </p>
                            <p className="text-[13px] text-[#6ACE13]">
                              จำนวนคำสั่งซื้อ : <span className="tabular-nums">{thousands(d.orders)}</span> รายการ
                            </p>
                          </div>
                          <span
                            className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0"
                            style={{
                              borderLeft: "8px solid transparent",
                              borderRight: "8px solid transparent",
                              borderTop: "8px solid #1d212d",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right axis labels (orders) */}
          <div className="relative h-[297px]">
            {ORDER_TICKS.map((t, i) => (
              <span
                key={i}
                className="absolute left-0 -translate-y-1/2 text-[12px] text-[var(--color-neutral-500)] tabular-nums"
                style={{ top: `${(i / (ORDER_TICKS.length - 1)) * 100}%` }}
              >
                {thousands(t)}
              </span>
            ))}
          </div>
        </div>

        {/* X labels */}
        <div className="grid grid-cols-[46px_1fr_46px] gap-2 mt-3">
          <span />
          <div className="grid grid-cols-7">
            {data.map((d) => (
              <span
                key={d.label}
                className="text-center text-[14px] text-[var(--color-neutral-700)]"
              >
                {d.label}
              </span>
            ))}
          </div>
          <span />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0485f7]" />
          <span className="text-[14px] text-[var(--color-neutral-700)]">ยอดขาย (฿)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#5dbf36]" />
          <span className="text-[14px] text-[var(--color-neutral-700)]">
            จำนวนคำสั่งซื้อ (รายการ)
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Stat mini card ---------- */

function StatMini({
  title,
  value,
  change,
  tone,
}: {
  title: string;
  value: string;
  change: string;
  tone: "positive" | "critical" | "neutral";
}) {
  return (
    <div className="bg-white rounded-xl p-4 flex flex-col gap-4 border border-[var(--color-neutral-300)]">
      <div className="flex items-center gap-1.5">
        <FontAwesomeIcon icon={faCircleInfo} className="text-[var(--color-neutral-500)] text-[14px]" />
        <p className="text-[14px] text-[var(--color-neutral-700)]">{title}</p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[20px] font-semibold text-[var(--color-neutral-900)] tabular-nums">
          {value}
        </p>
        <ChangeBadge value={change} tone={tone} />
      </div>
    </div>
  );
}

/* ---------- Pie chart ---------- */

type Category = {
  label: string;
  percent: number;
  color: string;
  labelColor: string;
  textColor: string;
  count: number;
  amount: number;
};

const CATEGORIES: Category[] = [
  { label: "เครื่องใช้ไฟฟ้า", percent: 40, color: "url(#grad-blue)",   labelColor: "#5bbde8", textColor: "#000000", count: 120, amount: 55578 },
  { label: "เสื้อผ้า",         percent: 30, color: "url(#grad-green)",  labelColor: "#7dd155", textColor: "#000000", count: 300, amount: 78578 },
  { label: "เครื่องครัว",      percent: 18, color: "url(#grad-purple)", labelColor: "#a07de0", textColor: "#000000", count: 111, amount: 8378 },
  { label: "รองเท้า",          percent: 12, color: "url(#grad-pink)",   labelColor: "#f095a8", textColor: "#000000", count: 341, amount: 35078 },
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function piePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polarToCartesian(cx, cy, r, endDeg);
  const end = polarToCartesian(cx, cy, r, startDeg);
  const large = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} Z`;
}

function PieChart({ slices }: { slices: Category[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  // Draw smallest → largest so smaller slices end up at the top (matches Figma).
  const drawOrder = [...slices].sort((a, b) => a.percent - b.percent);
  const total = drawOrder.reduce((a, s) => a + s.percent, 0);
  const cx = 110;
  const cy = 110;
  const radius = 100;

  let acc = 0;
  const segments = drawOrder.map((s) => {
    const start = (acc / total) * 360;
    acc += s.percent;
    const end = (acc / total) * 360;
    const mid = (start + end) / 2;
    const labelPos = polarToCartesian(cx, cy, radius * 0.6, mid);
    return { ...s, start, end, labelPos, mid };
  });

  const hovered = hoveredIdx !== null ? segments[hoveredIdx] : null;

  // Tooltip width + arrow
  const TIP_W = 183;
  const ARROW = 8;
  const TIP_H = 90;

  // Position tooltip to left or right of cursor based on which side of pie the slice is
  const tipLeft = hovered
    ? (hovered.mid > 90 && hovered.mid < 270)
      ? mouse.x - TIP_W - ARROW - 8   // slice on left → tooltip to the left
      : mouse.x + ARROW + 8           // slice on right → tooltip to the right
    : 0;
  const tipTop = hovered ? mouse.y - TIP_H / 2 : 0;
  const arrowRight = hovered && hovered.mid > 90 && hovered.mid < 270;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (rect) setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div ref={wrapRef} className="relative flex items-center justify-center w-full" onMouseMove={handleMouseMove}>
      {/* Tooltip */}
      {hovered && (
        <div
          className="absolute pointer-events-none z-10"
          style={{ left: tipLeft, top: tipTop }}
        >
          <div className={`flex items-center ${arrowRight ? "flex-row" : "flex-row-reverse"}`}>
            <div className="bg-[#011b31] rounded-[4px] p-3 w-[183px] flex flex-col gap-2">
              <span className="text-[14px] font-medium leading-4 whitespace-nowrap" style={{ color: hovered.labelColor }}>{hovered.label}</span>
              <span className="text-[12px] font-medium text-white whitespace-nowrap">รายการสินค้า : {hovered.count.toLocaleString()} รายการ</span>
              <span className="text-[12px] font-medium text-white whitespace-nowrap">มูลค่าสินค้า (฿) : {hovered.amount.toLocaleString("th-TH", { minimumFractionDigits: 2 })} บาท</span>
            </div>
            {/* Arrow */}
            <div
              className="shrink-0 w-0 h-0"
              style={arrowRight ? {
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderLeft: "8px solid #011b31",
              } : {
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderRight: "8px solid #011b31",
              }}
            />
          </div>
        </div>
      )}

      <svg viewBox="0 0 220 220" className="w-[220px] h-[220px]">
        <defs>
          <linearGradient id="grad-blue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5bbde8" />
            <stop offset="100%" stopColor="#c2e9fa" />
          </linearGradient>
          <linearGradient id="grad-green" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd155" />
            <stop offset="100%" stopColor="#c8ecaa" />
          </linearGradient>
          <linearGradient id="grad-purple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a07de0" />
            <stop offset="100%" stopColor="#d8bef8" />
          </linearGradient>
          <linearGradient id="grad-pink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f095a8" />
            <stop offset="100%" stopColor="#fad5db" />
          </linearGradient>
        </defs>
        {segments.map((seg, i) => (
          <path
            key={i}
            d={piePath(cx, cy, radius, seg.start, seg.end)}
            fill={seg.color}
            stroke="white"
            strokeWidth={2.5}
            strokeLinejoin="round"
            className="cursor-pointer transition-opacity"
            style={{ opacity: hoveredIdx === null || hoveredIdx === i ? 1 : 0.55 }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          />
        ))}
        {segments.map((seg, i) => (
          <text
            key={i}
            x={seg.labelPos.x}
            y={seg.labelPos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={seg.textColor}
            style={{ fontSize: 10, fontWeight: 500, pointerEvents: "none" }}
          >
            {seg.percent} %
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ---------- Report table ---------- */

type ReportRow = {
  id: string;
  deliveredAt: string;
  customer: string;
  category: string;
  productImg: string;
  productName: string;
  qty: number;
  amount: number;
};

const REPORT_CATEGORIES = ["เครื่องใช้ไฟฟ้า", "เสื้อผ้า", "เครื่องครัว", "รองเท้า"];
const REPORT_ROWS: ReportRow[] = Array.from({ length: 9 }, (_, i) => ({
  id: "#BMS-0987654-87",
  deliveredAt: "10/08/2026",
  customer: "panida setung",
  category: REPORT_CATEGORIES[i % REPORT_CATEGORIES.length],
  productImg:
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=120&q=60",
  productName: "กระโปรงพลีทสั้นลา...",
  qty: (i % 2) + 1,
  amount: 578.0,
}));

function PaginationFooter({
  total,
  page,
  pages,
  onPage,
}: {
  total: number;
  page: number;
  pages: (number | "…")[];
  onPage: (p: number) => void;
}) {
  return (
    <div className="border-t border-[var(--color-neutral-200)] h-14 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <p className="text-[14px]">
          <span className="text-[var(--color-neutral-900)]">{total.toLocaleString()} </span>
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
          onClick={() => onPage(Math.max(1, page - 1))}
          className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
          aria-label="ก่อนหน้า"
        >
          <Icon name="chevron-left" size={16} />
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={i}
              className="w-8 h-8 flex items-center justify-center text-[12px] text-[var(--color-neutral-600)]"
            >
              …
            </span>
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => onPage(p)}
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
          onClick={() => onPage(page + 1)}
          className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
          aria-label="ถัดไป"
        >
          <Icon name="chevron-right" size={16} />
        </button>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function SellerRevenueAnalysis() {
  const [period, setPeriod] = useState<PeriodKey>("day");
  const [page, setPage] = useState(2);
  const [baseDate, setBaseDate] = useState(() => new Date(2026, 7, 24));

  const dateLabel = formatDateRange(period, baseDate);

  const shift = (delta: number) => {
    const next = new Date(baseDate);
    if (period === "day" || period === "custom") next.setDate(next.getDate() + delta);
    else if (period === "week") next.setDate(next.getDate() + 7 * delta);
    else if (period === "month") next.setMonth(next.getMonth() + delta);
    else next.setFullYear(next.getFullYear() + delta);
    setBaseDate(next);
  };

  const totalCount = CATEGORIES.reduce((a, c) => a + c.count, 0);
  const totalAmount = CATEGORIES.reduce((a, c) => a + c.amount, 0);

  const pageNumbers = useMemo<(number | "…")[]>(
    () => [1, 2, 3, 4, 5, "…", 12],
    []
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader onMenuClick={() => setMobileMenuOpen(true)} />
      <div className="flex">
        <SellerSidebar active="การวิเคราะห์รายได้" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-6">
          {/* === Section 1 : Revenue analysis (chart) === */}
          <section className={`bg-white rounded-2xl ${CARD_SHADOW} p-6 flex flex-col gap-5`}>
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <h1 className="text-[20px] font-semibold text-[var(--color-primary-700)] leading-7">
                การวิเคราะห์รายได้
              </h1>
              <SectionHint text="การวิเคราะห์รายได้เป็นการสรุปรายได้ทั้งหมดและนำเสนอ ในรูปแบบกราฟแท่งและมีรายงานให้ดาวน์โหลดได้" />
            </div>

            <PeriodSelector
              period={period}
              onChange={setPeriod}
              label={dateLabel}
              onPrev={() => shift(-1)}
              onNext={() => shift(1)}
            />

            <BarChart data={HOURLY_DATA} dateLabel={dateLabel} />
          </section>

          {/* === Section 1b : 4 stat cards === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatMini title="ยอดขายรายวัน" value="฿ 0.00" change="12.5%" tone="critical" />
            <StatMini title="ยอดขายรายสัปดาห์" value="฿ 0.00" change="0.0%" tone="neutral" />
            <StatMini title="ยอดขายรายเดือน" value="฿ 0.00" change="12.5%" tone="positive" />
            <StatMini title="ยอดขายรายปี" value="฿ 0.00" change="12.5%" tone="positive" />
          </div>

          {/* === Section 2 : Revenue by category === */}
          <section className={`bg-white rounded-2xl ${CARD_SHADOW} p-6 flex flex-col gap-5`}>
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <h2 className="text-[20px] font-semibold text-[var(--color-primary-700)] leading-7">
                การวิเคราะห์รายได้แยกประเภทสินค้า
              </h2>
              <SectionHint text="การวิเคราะห์รายได้เป็นการสรุปรายได้แยกประเภทสินค้า และนำเสนอในรูปแบบกราฟวงกลม" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div className="flex items-center justify-center">
                <PieChart slices={CATEGORIES} />
              </div>
              <div className="bg-white border border-[var(--color-neutral-200)] rounded-xl overflow-hidden">
                <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-3 px-5 py-3 text-[14px] text-[var(--color-neutral-500)] border-b border-[var(--color-neutral-200)]">
                  <span>ประเภทสินค้า</span>
                  <span className="text-center">รายการสินค้า</span>
                  <span className="text-center">มูลค่าสินค้า (฿)</span>
                </div>
                {CATEGORIES.map((c) => (
                  <div
                    key={c.label}
                    className="grid grid-cols-[1.4fr_1fr_1fr] gap-3 px-5 py-3 items-center text-[14px]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-4 h-4 rounded-sm shrink-0"
                        style={{ backgroundColor: c.labelColor }}
                      />
                      <span className="truncate text-[var(--color-neutral-900)]">{c.label}</span>
                    </div>
                    <span className="text-center text-[var(--color-neutral-900)] tabular-nums">
                      {c.count.toLocaleString()}
                    </span>
                    <span className="text-center text-[var(--color-neutral-900)] tabular-nums">
                      {c.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
                <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-3 px-5 py-3 items-center text-[14px] font-semibold bg-[#eaf6ff] border-t border-[var(--color-neutral-200)]">
                  <span className="text-[var(--color-neutral-900)]">รวม</span>
                  <span className="text-center text-[var(--color-primary)] tabular-nums">
                    {totalCount.toLocaleString()}
                  </span>
                  <span className="text-center text-[var(--color-primary)] tabular-nums">
                    {totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* === Section 3 : Overall report === */}
          <section className={`bg-white rounded-2xl ${CARD_SHADOW} flex flex-col`}>
            {/* Section header */}
            <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-[var(--color-neutral-200)]">
              <h2 className="text-[20px] font-semibold text-[var(--color-primary-700)]">
                รายงานผลโดยรวม
              </h2>
              <button
                type="button"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
              >
                ดาวน์โหลดรายงาน
              </button>
            </div>

            {/* Table */}
            <div className="flex flex-col gap-0 p-4">
              {/* Header row */}
              <div className="flex items-center gap-4 bg-[#eff9fe] rounded-[4px] px-2 py-1 text-[12px] text-[#1d212d] mb-2">
                <span className="flex-1 min-w-0">หมายเลขคำสั่งซื้อ</span>
                <span className="flex-1 min-w-0">ลูกค้า</span>
                <span className="flex-1 min-w-0">ประเภทสินค้า</span>
                <span className="flex-1 min-w-0">ข้อมูลสินค้า</span>
                <span className="flex-1 min-w-0 text-center">รายการสินค้า</span>
                <span className="flex-1 min-w-0 text-center">มูลค่าสินค้า (฿)</span>
              </div>

              {/* Data rows */}
              {REPORT_ROWS.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-2 py-3 border-b border-[var(--color-neutral-200)] last:border-b-0 text-[14px] text-[#1d212d]"
                >
                  {/* Order ID */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="truncate font-medium">{r.id}</p>
                    <p className="text-[12px] text-[#798aa3] truncate">
                      วันที่ส่งสำเร็จ : {r.deliveredAt}
                    </p>
                  </div>
                  {/* Customer */}
                  <p className="flex-1 min-w-0 truncate">{r.customer}</p>
                  {/* Category */}
                  <p className="flex-1 min-w-0 truncate">{r.category}</p>
                  {/* Product */}
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <img
                      src={r.productImg}
                      alt=""
                      className="w-9 h-9 rounded object-cover shrink-0"
                    />
                    <p className="truncate">{r.productName}</p>
                  </div>
                  {/* Qty */}
                  <p className="flex-1 min-w-0 text-center tabular-nums">{r.qty}</p>
                  {/* Amount */}
                  <p className="flex-1 min-w-0 text-center tabular-nums">
                    {r.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>

            <PaginationFooter
              total={100}
              page={page}
              pages={pageNumbers}
              onPage={setPage}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
