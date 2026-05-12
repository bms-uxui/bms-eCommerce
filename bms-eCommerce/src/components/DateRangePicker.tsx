import { useEffect, useRef, useState } from "react";
import Icon from "./landing/Icon";

const WEEK_DAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];
const THAI_MONTHS_SHORT = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth() + n, d.getDate());
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const fmt = (d: Date) => `${d.getDate()} ${THAI_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;

type DateRangePickerProps = {
  initialStart?: Date;
  initialEnd?: Date;
  onChange?: (start: Date, end: Date) => void;
  className?: string;
};

export default function DateRangePicker({
  initialStart = new Date(2026, 7, 10),
  initialEnd = new Date(2026, 7, 24),
  onChange,
  className = "",
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(startOfDay(initialStart));
  const [end, setEnd] = useState(startOfDay(initialEnd));
  const [pendingStart, setPendingStart] = useState<Date | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>("14 วันล่าสุด");
  const [viewYear, setViewYear] = useState(initialStart.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialStart.getMonth());
  const [mode, setMode] = useState<"day" | "month" | "year">("day");
  const [yearPage, setYearPage] = useState(() => Math.floor(initialStart.getFullYear() / 12) * 12);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const commit = (a: Date, b: Date, preset: string | null) => {
    const lo = a <= b ? a : b;
    const hi = a <= b ? b : a;
    setStart(lo);
    setEnd(hi);
    setPendingStart(null);
    setActivePreset(preset);
    setViewYear(lo.getFullYear());
    setViewMonth(lo.getMonth());
    setMode("day");
    onChange?.(lo, hi);
  };

  const pickDay = (d: Date) => {
    if (pendingStart === null) {
      setPendingStart(d);
      setActivePreset(null);
    } else {
      commit(pendingStart, d, null);
    }
  };

  const today = startOfDay(new Date());
  const presets: { label: string; range: () => [Date, Date] }[] = [
    { label: "วันนี้", range: () => [today, today] },
    { label: "7 วันล่าสุด", range: () => [addDays(today, -6), today] },
    { label: "14 วันล่าสุด", range: () => [addDays(today, -13), today] },
    { label: "1 เดือนที่แล้ว", range: () => [addMonths(today, -1), today] },
    { label: "6 เดือนที่แล้ว", range: () => [addMonths(today, -6), today] },
    { label: "12 เดือนที่แล้ว", range: () => [addMonths(today, -12), today] },
    { label: "1 ปีที่แล้ว", range: () => [addMonths(today, -12), today] },
  ];

  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<number | null>(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const rStart = pendingStart ?? start;
  const rEnd = pendingStart ?? end;

  const goMonth = (delta: number) => {
    const m = viewMonth + delta;
    setViewMonth(((m % 12) + 12) % 12);
    setViewYear(viewYear + Math.floor(m / 12));
  };
  const goPrev = () => {
    if (mode === "day") goMonth(-1);
    else if (mode === "month") setViewYear(viewYear - 1);
    else setYearPage(yearPage - 12);
  };
  const goNext = () => {
    if (mode === "day") goMonth(1);
    else if (mode === "month") setViewYear(viewYear + 1);
    else setYearPage(yearPage + 12);
  };
  const yearCells = Array.from({ length: 12 }, (_, i) => yearPage + i);
  const todayDate = new Date();
  const isTodayYM = (y: number, m: number) =>
    todayDate.getFullYear() === y && todayDate.getMonth() === m;

  return (
    <div ref={ref} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => {
          setMode("day");
          setOpen((v) => !v);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={[
          "flex items-center gap-2 h-10 px-3 rounded-lg border bg-white text-[14px] text-[var(--color-neutral-900)] transition-colors",
          open
            ? "border-[var(--color-primary)]"
            : "border-[var(--color-neutral-300)] hover:border-[var(--color-primary-400)]",
        ].join(" ")}
      >
        <span className="whitespace-nowrap">
          {fmt(start)} - {fmt(end)}
        </span>
        <Icon name="calendar" size={18} className="text-[var(--color-primary)]" />
      </button>

      {open && (
        <div className="animate-dropdown absolute right-0 top-[calc(100%+8px)] z-50 bg-white rounded-2xl flex shadow-[0_0_1px_rgba(29,33,45,0.2),0_1px_4px_rgba(29,33,45,0.15),0_16px_32px_rgba(29,33,45,0.1)]">
          {/* Calendar */}
          <div className="p-4 w-[352px]">
            <div className="flex items-center justify-between px-1 pb-2">
              <div className="flex items-center gap-2 text-[16px] font-medium text-[var(--color-primary)]">
                <button
                  type="button"
                  onClick={() => setMode(mode === "month" ? "day" : "month")}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-[var(--color-primary-100)]"
                >
                  {THAI_MONTHS[viewMonth]}
                  <Icon
                    name="chevron-down"
                    size={14}
                    className={`transition-transform ${mode === "month" ? "rotate-180" : ""}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "year" ? "day" : "year");
                    setYearPage(Math.floor(viewYear / 12) * 12);
                  }}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-[var(--color-primary-100)]"
                >
                  {viewYear}
                  <Icon
                    name="chevron-down"
                    size={14}
                    className={`transition-transform ${mode === "year" ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="ก่อนหน้า"
                  className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
                >
                  <Icon name="chevron-left" size={18} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="ถัดไป"
                  className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
                >
                  <Icon name="chevron-right" size={18} />
                </button>
              </div>
            </div>

            {mode === "day" && (
              <>
                <div className="grid grid-cols-7">
                  {WEEK_DAYS.map((d) => (
                    <div
                      key={d}
                      className="h-10 flex items-center justify-center text-[14px] text-[var(--color-neutral-500)]"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7">
                  {cells.map((d, i) => {
                if (d === null) return <div key={i} className="h-11" />;
                const date = new Date(viewYear, viewMonth, d);
                const inRange = date >= rStart && date <= rEnd;
                const isStart = sameDay(date, rStart);
                const isEnd = sameDay(date, rEnd);
                const col = i % 7;
                const band = inRange
                  ? [
                      "bg-[var(--color-primary-100)]",
                      isStart || col === 0 || d === 1 ? "rounded-l-full" : "",
                      isEnd || col === 6 || d === daysInMonth ? "rounded-r-full" : "",
                    ].join(" ")
                  : "";
                return (
                  <div key={i} className={`h-11 flex items-center justify-center ${band}`}>
                    <button
                      type="button"
                      onClick={() => pickDay(date)}
                      className={[
                        "w-9 h-9 rounded-full flex items-center justify-center text-[14px] transition-colors",
                        isStart || isEnd
                          ? "bg-[var(--color-primary)] text-white font-bold"
                          : inRange
                          ? "text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
                          : "text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                      ].join(" ")}
                    >
                      {d}
                    </button>
                  </div>
                );
              })}
                </div>
              </>
            )}

            {mode === "month" && (
              <div className="grid grid-cols-2 gap-x-3 pt-2">
                {THAI_MONTHS.map((m, i) => {
                  const selected = i === viewMonth;
                  const current = isTodayYM(viewYear, i);
                  return (
                    <div key={m} className="h-12 flex items-center justify-center p-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setViewMonth(i);
                          setMode("day");
                        }}
                        className={[
                          "flex-1 h-9 rounded-full flex items-center justify-center text-[14px] transition-colors",
                          selected
                            ? "bg-[var(--color-primary)] text-white font-bold"
                            : current
                            ? "border border-[var(--color-primary)] text-[var(--color-primary)] font-bold"
                            : "text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                        ].join(" ")}
                      >
                        {m}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {mode === "year" && (
              <div className="grid grid-cols-3 gap-x-3 pt-2">
                {yearCells.map((y) => {
                  const selected = y === viewYear;
                  const current = y === todayDate.getFullYear();
                  return (
                    <div key={y} className="h-12 flex items-center justify-center p-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setViewYear(y);
                          setMode("month");
                        }}
                        className={[
                          "flex-1 h-9 rounded-full flex items-center justify-center text-[14px] transition-colors",
                          selected
                            ? "bg-[var(--color-primary)] text-white font-bold"
                            : current
                            ? "border border-[var(--color-primary)] text-[var(--color-primary)] font-bold"
                            : "text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                        ].join(" ")}
                      >
                        {y}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <span className="w-px bg-[var(--color-neutral-200)] my-4" />

          {/* Presets */}
          <div className="py-4 w-[176px] flex flex-col">
            {presets.map((p) => {
              const active = activePreset === p.label;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    const [a, b] = p.range();
                    commit(a, b, p.label);
                  }}
                  className={[
                    "text-left px-4 py-2 text-[14px] transition-colors",
                    active
                      ? "bg-[var(--color-primary-100)] text-[var(--color-primary)] font-medium"
                      : "text-[var(--color-neutral-700)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                  ].join(" ")}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
