import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download } from "lucide-react";
import Icon from "../components/landing/Icon";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import { ChangeBadge } from "./SellerOverview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import {
  CustomRangePanel,
  MonthGrid,
  THAI_MONTH_SHORT,
  THAI_MONTH_LONG,
  TODAY,
  startOfDay,
  isSameDay,
  addMonths,
  addDays,
  weekRange,
  isFutureDay,
  isFutureMonth,
  isFutureYear,
  type DateRange,
} from "../components/CustomRangeCalendar";

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

/* ---------- Calendar popover ---------- */

type PopoverMode = "day" | "week" | "month" | "year" | "custom";

function CalendarPanel({
  view,
  setView,
  selected,
  onPick,
  range,
}: {
  view: Date;
  setView: (d: Date) => void;
  selected: Date;
  onPick: (d: Date) => void;
  range?: { start: Date; end: Date };
}) {
  return (
    <div className="flex flex-col w-[336px]">
      <div className="h-12 flex items-center justify-between px-3">
        <button
          type="button"
          onClick={() => setView(addMonths(view, -1))}
          className="size-8 flex items-center justify-center rounded text-[#5d6c87] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
          aria-label="ก่อนหน้า"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-[20px] font-medium text-[#1d212d]">
          <span className="text-[#011b31]">{THAI_MONTH_LONG[view.getMonth()]}</span>{" "}
          <span>{view.getFullYear()}</span>
        </div>
        <button
          type="button"
          onClick={() => setView(addMonths(view, 1))}
          className="size-8 flex items-center justify-center rounded text-[#5d6c87] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
          aria-label="ถัดไป"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <MonthGrid
        year={view.getFullYear()}
        month={view.getMonth()}
        selected={selected}
        rangeStart={range?.start}
        rangeEnd={range?.end}
        onPick={onPick}
      />
    </div>
  );
}

function MonthPanel({
  viewYear,
  setViewYear,
  selected,
  onPick,
}: {
  viewYear: number;
  setViewYear: (y: number) => void;
  selected: Date;
  onPick: (year: number, month: number) => void;
}) {
  return (
    <div className="flex flex-col w-[336px]">
      <div className="h-12 flex items-center justify-between px-3">
        <button
          type="button"
          onClick={() => setViewYear(viewYear - 1)}
          className="size-8 flex items-center justify-center rounded text-[#5d6c87] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
          aria-label="ก่อนหน้า"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-[20px] font-medium text-[#1d212d]">{viewYear}</div>
        <button
          type="button"
          onClick={() => setViewYear(viewYear + 1)}
          className="size-8 flex items-center justify-center rounded text-[#5d6c87] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
          aria-label="ถัดไป"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-y-2 px-2 pb-2">
        {THAI_MONTH_LONG.map((name, i) => {
          const isSel = selected.getFullYear() === viewYear && selected.getMonth() === i;
          const isToday = TODAY.getFullYear() === viewYear && TODAY.getMonth() === i;
          const disabled = isFutureMonth(viewYear, i);
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onPick(viewYear, i)}
              className="h-10 flex items-center justify-center group disabled:cursor-not-allowed"
            >
              <span
                className={[
                  "h-9 px-4 flex items-center justify-center rounded-full text-[14px] min-w-[120px] text-center transition-colors",
                  disabled
                    ? "text-[#c2cad6]"
                    : isSel
                      ? "bg-[#0485f7] text-white font-bold"
                      : isToday
                        ? "border border-[#0485f7] text-[#0485f7] font-bold group-hover:bg-[#dcf2fe]"
                        : "text-[#1d212d] group-hover:bg-[#eff9fe]",
                ].join(" ")}
              >
                {name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function YearPanel({
  viewYear,
  setViewYear,
  selected,
  onPick,
}: {
  viewYear: number;
  setViewYear: (y: number) => void;
  selected: Date;
  onPick: (y: number) => void;
}) {
  const startYear = viewYear - 13;
  const years = Array.from({ length: 18 }, (_, i) => startYear + i);
  return (
    <div className="flex flex-col w-[336px]">
      <div className="h-12 flex items-center justify-between px-3">
        <button
          type="button"
          onClick={() => setViewYear(viewYear - 18)}
          className="size-8 flex items-center justify-center rounded text-[#5d6c87] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
          aria-label="ก่อนหน้า"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-[20px] font-medium text-[#0485f7]">{viewYear}</div>
        <button
          type="button"
          onClick={() => setViewYear(viewYear + 18)}
          className="size-8 flex items-center justify-center rounded text-[#5d6c87] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
          aria-label="ถัดไป"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-y-2 px-2 pb-2">
        {years.map((y) => {
          const isSel = selected.getFullYear() === y;
          const isToday = TODAY.getFullYear() === y;
          const disabled = isFutureYear(y);
          return (
            <button
              key={y}
              type="button"
              disabled={disabled}
              onClick={() => onPick(y)}
              className="h-10 flex items-center justify-center group disabled:cursor-not-allowed"
            >
              <span
                className={[
                  "h-9 px-5 flex items-center justify-center rounded-full text-[14px] min-w-[90px] transition-colors",
                  disabled
                    ? "text-[#c2cad6]"
                    : isSel
                      ? "bg-[#0485f7] text-white font-bold"
                      : isToday
                        ? "border border-[#0485f7] text-[#0485f7] font-bold group-hover:bg-[#dcf2fe]"
                        : "text-[#1d212d] group-hover:bg-[#eff9fe]",
                ].join(" ")}
              >
                {y}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeekCalendarPanel({
  value,
  onPick,
}: {
  value: Date;
  onPick: (d: Date) => void;
}) {
  const [view, setView] = useState(new Date(value.getFullYear(), value.getMonth(), 1));
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const { start: rangeStart, end: rangeEnd } = weekRange(value);
  const hoverWeek = hoverDate ? weekRange(hoverDate) : null;

  return (
    <div className="flex flex-col w-[336px]">
      <div className="h-12 flex items-center justify-between px-3">
        <button
          type="button"
          onClick={() => setView(addMonths(view, -1))}
          className="size-8 flex items-center justify-center rounded text-[#5d6c87] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
          aria-label="ก่อนหน้า"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-[20px] font-medium text-[#1d212d]">
          <span className="text-[#011b31]">{THAI_MONTH_LONG[view.getMonth()]}</span>{" "}
          <span>{view.getFullYear()}</span>
        </div>
        <button
          type="button"
          onClick={() => setView(addMonths(view, 1))}
          className="size-8 flex items-center justify-center rounded text-[#5d6c87] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
          aria-label="ถัดไป"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <MonthGrid
        year={view.getFullYear()}
        month={view.getMonth()}
        selected={value}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        hoverStart={hoverWeek?.start}
        hoverEnd={hoverWeek?.end}
        onPick={onPick}
        bothEndsCircle
        onCellEnter={setHoverDate}
        onGridLeave={() => setHoverDate(null)}
      />
    </div>
  );
}

function RevenueDatePopover({
  mode,
  value,
  onChange,
  onClose,
  anchorRef,
  customRange,
  onCustomChange,
}: {
  mode: PopoverMode;
  value: Date;
  onChange: (d: Date) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  customRange: DateRange;
  onCustomChange: (r: DateRange) => void;
}) {
  const [view, setView] = useState(new Date(value.getFullYear(), value.getMonth(), 1));
  const [viewYear, setViewYear] = useState(value.getFullYear());
  const popRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const popW = mode === "custom" ? 832 : 368;
    let left = r.left + r.width / 2 - popW / 2;
    left = Math.max(8, Math.min(window.innerWidth - popW - 8, left));
    setPos({ left, top: r.bottom + 8 });
  }, [anchorRef, mode]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (popRef.current?.contains(e.target as Node)) return;
      if (anchorRef.current?.contains(e.target as Node)) return;
      onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [onClose, anchorRef]);

  if (!pos) return null;

  const content =
    mode === "month" ? (
      <MonthPanel
        viewYear={viewYear}
        setViewYear={setViewYear}
        selected={value}
        onPick={(y, m) => {
          onChange(new Date(y, m, 1));
          onClose();
        }}
      />
    ) : mode === "year" ? (
      <YearPanel
        viewYear={viewYear}
        setViewYear={setViewYear}
        selected={value}
        onPick={(y) => {
          onChange(new Date(y, 0, 1));
          onClose();
        }}
      />
    ) : mode === "custom" ? (
      <CustomRangePanel
        range={customRange}
        onChange={onCustomChange}
        onClose={onClose}
      />
    ) : mode === "week" ? (
      <WeekCalendarPanel
        value={value}
        onPick={(d) => {
          onChange(d);
          onClose();
        }}
      />
    ) : (
      <CalendarPanel
        view={view}
        setView={setView}
        selected={value}
        onPick={(d) => {
          onChange(d);
          onClose();
        }}
      />
    );

  return createPortal(
    <div
      ref={popRef}
      className="fixed z-[9999] bg-white rounded-[12px] p-4 shadow-[0_0_1px_rgba(29,33,45,0.2),0_1px_4px_rgba(29,33,45,0.15),0_16px_32px_rgba(29,33,45,0.1)]"
      style={{ left: pos.left, top: pos.top }}
    >
      {content}
    </div>,
    document.body
  );
}

function formatCustomRange(r: DateRange): string {
  const sy = r.start.getFullYear() + 543;
  const ey = r.end.getFullYear() + 543;
  if (isSameDay(r.start, r.end)) {
    return `${r.end.getDate()} ${THAI_MONTH_SHORT[r.end.getMonth()]} ${ey}`;
  }
  const startStr = sy === ey
    ? `${r.start.getDate()} ${THAI_MONTH_SHORT[r.start.getMonth()]}`
    : `${r.start.getDate()} ${THAI_MONTH_SHORT[r.start.getMonth()]} ${sy}`;
  return `${startStr} - ${r.end.getDate()} ${THAI_MONTH_SHORT[r.end.getMonth()]} ${ey}`;
}

function formatDateRange(period: PeriodKey, base: Date): string {
  const y = base.getFullYear() + 543;
  if (period === "day") {
    return `${base.getDate()} ${THAI_MONTH_SHORT[base.getMonth()]} ${y}`;
  }
  if (period === "week") {
    const { start, end } = weekRange(base);
    const ey = end.getFullYear() + 543;
    return `${start.getDate()} ${THAI_MONTH_SHORT[start.getMonth()]} - ${end.getDate()} ${THAI_MONTH_SHORT[end.getMonth()]} ${ey}`;
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
  baseDate,
  setBaseDate,
  customRange,
  setCustomRange,
}: {
  period: PeriodKey;
  onChange: (p: PeriodKey) => void;
  label: string;
  onPrev: () => void;
  onNext: () => void;
  baseDate: Date;
  setBaseDate: (d: Date) => void;
  customRange: DateRange;
  setCustomRange: (r: DateRange) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const nextDisabled = (() => {
    if (period === "day") return isFutureDay(addDays(baseDate, 1));
    if (period === "week") return isFutureDay(addDays(weekRange(baseDate).end, 1));
    if (period === "month") return isFutureMonth(baseDate.getFullYear(), baseDate.getMonth() + 1);
    if (period === "year") return isFutureYear(baseDate.getFullYear() + 1);
    if (period === "custom") return isFutureDay(addDays(customRange.end, 1));
    return false;
  })();
  const popoverMode: PopoverMode | null =
    period === "day" || period === "week"
      ? period
      : period === "month"
        ? "month"
        : period === "year"
          ? "year"
          : period === "custom"
            ? "custom"
            : null;
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
        <button
          ref={triggerRef}
          type="button"
          onClick={() => popoverMode && setOpen((v) => !v)}
          disabled={!popoverMode}
          className="flex items-center gap-2 text-[16px] text-[#1d212d] disabled:cursor-default"
        >
          <span>{label}</span>
          <Calendar size={20} className="text-[#5d6c87]" />
        </button>
        {open && popoverMode && (
          <RevenueDatePopover
            mode={popoverMode}
            value={baseDate}
            onChange={setBaseDate}
            onClose={() => setOpen(false)}
            anchorRef={triggerRef}
            customRange={customRange}
            onCustomChange={setCustomRange}
          />
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          aria-label="ถัดไป"
          className="w-8 h-8 flex items-center justify-center bg-white border border-[#e9f0f4] rounded-[4px] text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors disabled:cursor-not-allowed disabled:text-[#c2cad6] disabled:hover:bg-white"
        >
          <Icon name="chevron-right" size={16} />
        </button>
      </div>
    </div>
  );
}

/* ---------- Bar chart ---------- */

type BarPoint = { label: string; sales: number; orders: number };

const HOURLY_SALES = [
  8000, 4500, 3000, 2000, 1500, 3500, 18000, 42000,
  70000, 52000, 45000, 60000, 78000, 88000, 95000, 62000,
  28058, 34000, 38000, 33000, 30000, 41000, 56000, 22000,
];
const HOURLY_ORDERS = [
  180, 90, 60, 40, 30, 70, 320, 800,
  1300, 900, 600, 1100, 1500, 1700, 1900, 1200,
  150, 500, 700, 600, 500, 850, 1400, 400,
];
const HOURLY_DATA: BarPoint[] = Array.from({ length: 24 }, (_, h) => ({
  label: `${String(h).padStart(2, "0")}:00`,
  sales: HOURLY_SALES[h],
  orders: HOURLY_ORDERS[h],
}));

const WEEKLY_SALES = [42000, 28000, 35000, 51000, 68000, 84000, 96000];
const WEEKLY_ORDERS = [650, 480, 720, 980, 1280, 1650, 1880];

const MONTHLY_SALES = [
  22000, 18000, 30000, 41000, 48000, 36000, 27000, 33000, 45000, 52000,
  61000, 58000, 47000, 39000, 44000, 51000, 63000, 72000, 68000, 55000,
  49000, 57000, 64000, 71000, 78000, 84000, 76000, 69000, 73000, 81000, 88000,
];
const MONTHLY_ORDERS = [
  320, 280, 410, 560, 640, 510, 380, 470, 610, 700,
  830, 790, 640, 540, 600, 700, 850, 970, 920, 750,
  670, 780, 870, 960, 1050, 1130, 1020, 940, 990, 1090, 1180,
];

const YEARLY_SALES = [
  32000, 41000, 38000, 46000, 52000, 58000,
  61000, 64000, 59000, 72000, 78000, 92000,
];
const YEARLY_ORDERS = [
  420, 720, 980, 1260, 1480, 1680, 1820, 2100, 1940, 2350, 2580, 2820,
];

function buildCustomChartData(range: DateRange): BarPoint[] {
  const days = Math.round((startOfDay(range.end).getTime() - startOfDay(range.start).getTime()) / 86400000) + 1;
  const n = Math.max(1, days);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(range.start);
    d.setDate(d.getDate() + i);
    return {
      label: `${d.getDate()} ${THAI_MONTH_SHORT[d.getMonth()]}`,
      sales: MONTHLY_SALES[i % MONTHLY_SALES.length],
      orders: MONTHLY_ORDERS[i % MONTHLY_ORDERS.length],
    };
  });
}

function buildChartData(period: PeriodKey, base: Date): BarPoint[] {
  if (period === "week") {
    const { start } = weekRange(base);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return {
        label: `${d.getDate()} ${THAI_MONTH_SHORT[d.getMonth()]}`,
        sales: WEEKLY_SALES[i],
        orders: WEEKLY_ORDERS[i],
      };
    });
  }
  if (period === "month") {
    const dim = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    return Array.from({ length: dim }, (_, i) => ({
      label: `${i + 1}`,
      sales: MONTHLY_SALES[i % MONTHLY_SALES.length],
      orders: MONTHLY_ORDERS[i % MONTHLY_ORDERS.length],
    }));
  }
  if (period === "year") {
    return Array.from({ length: 12 }, (_, i) => ({
      label: THAI_MONTH_SHORT[i],
      sales: YEARLY_SALES[i],
      orders: YEARLY_ORDERS[i],
    }));
  }
  return HOURLY_DATA;
}

const SALES_TICKS = [100000, 50000, 20000, 15000, 10000, 5000, 0];
const ORDER_TICKS = [3000, 2000, 1500, 1000, 500, 100, 0];

function thousands(n: number): string {
  return n.toLocaleString("en-US");
}

function BarChart({ data, dateLabel, period }: { data: BarPoint[]; dateLabel: string; period: PeriodKey }) {
  const [hover, setHover] = useState<{ index: number; x: number; y: number } | null>(null);
  const maxSales = SALES_TICKS[0];
  const maxOrders = ORDER_TICKS[0];

  const handleEnter = (i: number, el: HTMLElement) => {
    // Anchor at the top-center of the tallest inner bar
    const bars = el.querySelectorAll<HTMLSpanElement>("span[data-bar]");
    const btnRect = el.getBoundingClientRect();
    let top = btnRect.top;
    let centerX = btnRect.left + btnRect.width / 2;
    let firstBarTop = Number.POSITIVE_INFINITY;
    bars.forEach((b) => {
      const r = b.getBoundingClientRect();
      if (r.top < firstBarTop) {
        firstBarTop = r.top;
      }
    });
    if (Number.isFinite(firstBarTop)) top = firstBarTop;
    setHover({ index: i, x: centerX, y: top });
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="grid grid-cols-[46px_1fr_46px] gap-2 items-start">
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

          {/* Plot area (horizontally scrollable when many bars) */}
          <div className="overflow-x-auto">
            <div style={{ minWidth: `${data.length * 125}px` }}>
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
            <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>

              {data.map((d, i) => {
                const salesPct = (d.sales / maxSales) * 100;
                const ordersPct = (d.orders / maxOrders) * 100;
                const isHover = hover?.index === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={(e) => handleEnter(i, e.currentTarget)}
                    onMouseMove={(e) => handleEnter(i, e.currentTarget)}
                    onMouseLeave={() => setHover((h) => (h?.index === i ? null : h))}
                    onClick={(e) => {
                      if (hover?.index === i) setHover(null);
                      else handleEnter(i, e.currentTarget);
                    }}
                    className="relative flex items-end justify-center gap-2 h-full focus:outline-none"
                  >
                    {/* Sales bar (blue) */}
                    <span
                      data-bar
                      className="block w-[39px] rounded-t bg-gradient-to-b from-[#0485f7] via-[#21bdff] to-[#cdedff] transition-opacity"
                      style={{ height: `${salesPct}%`, opacity: isHover ? 1 : 0.95 }}
                    />
                    {/* Orders bar (green) */}
                    <span
                      data-bar
                      className="block w-[39px] rounded-t bg-gradient-to-b from-[#5dbf36] via-[#a5e36a] to-[#e6f8d0] transition-opacity"
                      style={{ height: `${ordersPct}%`, opacity: isHover ? 1 : 0.95 }}
                    />
                  </button>
                );
              })}
            </div>
            </div>
            {/* X labels (in same scroll container) */}
            <div className="grid mt-3" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
              {data.map((d) => (
                <span
                  key={d.label}
                  className="text-center text-[14px] text-[var(--color-neutral-700)] tabular-nums"
                >
                  {d.label}
                </span>
              ))}
            </div>
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

      </div>

      {/* Portal tooltip — escapes all overflow/scroll ancestors */}
      {hover &&
        createPortal(
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: hover.x,
              top: hover.y,
              transform: "translate(-50%, calc(-100% - 12px))",
            }}
          >
            <div className="relative bg-[#1d212d] text-white rounded-lg px-3 py-2.5 w-[230px] shadow-lg text-left">
              <div className="flex items-center justify-between text-[12px] text-white">
                {period === "day" ? (
                  <>
                    <span>{dateLabel}</span>
                    <span>{data[hover.index].label.replace(":", ".")} น.</span>
                  </>
                ) : (
                  <span>{data[hover.index].label}</span>
                )}
              </div>
              <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-1">
                <p className="text-[13px] text-[#7cd2ff]">
                  ยอดขาย : <span className="tabular-nums">{thousands(data[hover.index].sales)}</span> บาท
                </p>
                <p className="text-[13px] text-[#6ACE13]">
                  จำนวนคำสั่งซื้อ : <span className="tabular-nums">{thousands(data[hover.index].orders)}</span> รายการ
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
          </div>,
          document.body
        )}

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
  period,
  value,
  change,
  tone,
}: {
  title: string;
  period: string;
  value: string;
  change: string;
  tone: "positive" | "critical" | "neutral";
}) {
  return (
    <div className="bg-white rounded-xl p-4 flex flex-col gap-4 border border-[var(--color-neutral-300)]">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faCircleInfo} className="text-[var(--color-neutral-500)] text-[14px]" />
        <p className="text-[12px] text-[var(--color-neutral-900)] whitespace-nowrap">{title}</p>
        <p className="text-[12px] text-[var(--color-neutral-900)] whitespace-nowrap tabular-nums">{period}</p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[24px] font-bold text-[var(--color-primary)] tabular-nums">
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
  const [customRange, setCustomRange] = useState<DateRange>(() => ({
    start: addDays(TODAY, -13),
    end: TODAY,
  }));

  const dateLabel = period === "custom"
    ? formatCustomRange(customRange)
    : formatDateRange(period, baseDate);
  const chartData = useMemo(
    () => period === "custom" ? buildCustomChartData(customRange) : buildChartData(period, baseDate),
    [period, baseDate, customRange]
  );

  const shift = (delta: number) => {
    if (period === "custom") {
      const span = Math.round(
        (startOfDay(customRange.end).getTime() - startOfDay(customRange.start).getTime()) / 86400000
      ) + 1;
      setCustomRange({
        start: addDays(customRange.start, span * delta),
        end: addDays(customRange.end, span * delta),
      });
      return;
    }
    const next = new Date(baseDate);
    if (period === "day") next.setDate(next.getDate() + delta);
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
              baseDate={baseDate}
              setBaseDate={setBaseDate}
              customRange={customRange}
              setCustomRange={setCustomRange}
            />

            <BarChart data={chartData} dateLabel={dateLabel} period={period} />
          </section>

          {/* === Section 1b : 4 stat cards === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatMini title="วันที่ขายดีที่สุด" period="24 เม.ย. 2569" value="฿ 128,450" change="12.5%" tone="critical" />
            <StatMini title="สัปดาห์ที่ขายดีที่สุด" period="8 ก.พ. - 14 ก.พ. 2569" value="฿ 742,890" change="0.0%" tone="neutral" />
            <StatMini title="เดือนที่ขายดีที่สุด" period="ก.พ. 2569" value="฿ 2,915,670" change="12.5%" tone="positive" />
            <StatMini title="ปีที่ขายดีที่สุด" period="2569" value="฿ 28,470,320" change="12.5%" tone="positive" />
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
                <Download size={16} />
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
