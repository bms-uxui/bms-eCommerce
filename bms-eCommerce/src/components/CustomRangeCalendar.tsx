import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

/* Mocked "today" so the prototype is deterministic. */
export const TODAY = new Date(2026, 4, 15);

export const THAI_MONTH_SHORT = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];
export const THAI_MONTH_LONG = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];
export const WEEKDAY_LABELS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
export function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
export function addDays(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}
export function addMonthsKeepDay(d: Date, n: number) {
  const result = new Date(d.getFullYear(), d.getMonth() + n, d.getDate());
  if (result.getDate() !== d.getDate()) result.setDate(0);
  return result;
}
export function weekRange(d: Date) {
  const dow = d.getDay();
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - dow);
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() - dow + 6);
  return { start, end };
}
export function isFutureDay(d: Date) {
  return startOfDay(d).getTime() > startOfDay(TODAY).getTime();
}
export function isFutureMonth(year: number, month: number) {
  return year > TODAY.getFullYear() || (year === TODAY.getFullYear() && month > TODAY.getMonth());
}
export function isFutureYear(year: number) {
  return year > TODAY.getFullYear();
}

export type DateRange = { start: Date; end: Date };

export const CUSTOM_SHORTCUTS: { key: string; label: string; build: () => DateRange }[] = [
  { key: "today", label: "วันนี้",         build: () => ({ start: TODAY, end: TODAY }) },
  { key: "7d",    label: "7 วันล่าสุด",     build: () => ({ start: addDays(TODAY, -6),   end: TODAY }) },
  { key: "14d",   label: "14 วันล่าสุด",    build: () => ({ start: addDays(TODAY, -13),  end: TODAY }) },
  { key: "1m",    label: "1 เดือนที่แล้ว",  build: () => ({ start: addMonthsKeepDay(TODAY, -1),  end: TODAY }) },
  { key: "6m",    label: "6 เดือนที่แล้ว",  build: () => ({ start: addMonthsKeepDay(TODAY, -6),  end: TODAY }) },
  { key: "12m",   label: "12 เดือนที่แล้ว", build: () => ({ start: addMonthsKeepDay(TODAY, -12), end: TODAY }) },
  { key: "1y",    label: "1 ปีที่แล้ว",     build: () => ({ start: addMonthsKeepDay(TODAY, -12), end: TODAY }) },
];

export function MonthGrid({
  year,
  month,
  selected,
  rangeStart,
  rangeEnd,
  hoverStart,
  hoverEnd,
  onPick,
  bothEndsCircle = false,
  onCellEnter,
  onGridLeave,
}: {
  year: number;
  month: number;
  selected: Date;
  rangeStart?: Date;
  rangeEnd?: Date;
  hoverStart?: Date;
  hoverEnd?: Date;
  onPick: (d: Date) => void;
  bothEndsCircle?: boolean;
  onCellEnter?: (d: Date) => void;
  onGridLeave?: () => void;
}) {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const rows = cells.length / 7;

  return (
    <div className="flex flex-col" onMouseLeave={onGridLeave}>
      <div className="grid grid-cols-7">
        {WEEKDAY_LABELS.map((w, i) => (
          <div key={i} className="h-12 flex items-center justify-center text-[14px] text-[#798aa3]">
            {w}
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid grid-cols-7">
          {cells.slice(r * 7, r * 7 + 7).map((d, i) => {
            if (d === null) return <div key={i} className="size-12" />;
            const date = new Date(year, month, d);
            const t0 = startOfDay(date).getTime();
            const inRange = rangeStart && rangeEnd
              ? t0 >= startOfDay(rangeStart).getTime() && t0 <= startOfDay(rangeEnd).getTime()
              : false;
            const isStart = rangeStart ? isSameDay(date, rangeStart) : false;
            const isEnd = rangeEnd ? isSameDay(date, rangeEnd) : false;
            const isSel = bothEndsCircle ? (isStart || isEnd) : isSameDay(date, selected);
            const isToday = isSameDay(date, TODAY);
            const inHover = hoverStart && hoverEnd
              ? t0 >= startOfDay(hoverStart).getTime() && t0 <= startOfDay(hoverEnd).getTime()
              : false;
            const isHoverStart = hoverStart ? isSameDay(date, hoverStart) : false;
            const isHoverEnd = hoverEnd ? isSameDay(date, hoverEnd) : false;
            const disabled = isFutureDay(date);
            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => onPick(date)}
                onMouseEnter={() => !disabled && onCellEnter?.(date)}
                className="size-12 relative flex items-center justify-center group disabled:cursor-not-allowed"
              >
                {inHover && !inRange && (
                  <span
                    className={[
                      "absolute top-0.5 bottom-0.5 left-0 right-0 bg-[#eff9fe]",
                      isHoverStart ? "left-1 rounded-l-full" : "",
                      isHoverEnd ? "right-1 rounded-r-full" : "",
                    ].join(" ")}
                  />
                )}
                {inRange && !(isStart && isEnd) && (
                  <span
                    className={[
                      "absolute top-0.5 bottom-0.5 left-0 right-0 bg-[#dcf2fe]",
                      isStart ? "left-1 rounded-l-full" : "",
                      isEnd ? "right-1 rounded-r-full" : "",
                    ].join(" ")}
                  />
                )}
                <span
                  className={[
                    "relative z-[1] size-9 flex items-center justify-center rounded-full text-[14px] transition-colors",
                    disabled
                      ? "text-[#c2cad6]"
                      : isSel
                        ? "bg-[#0485f7] text-white font-bold"
                        : isToday
                          ? "border border-[#0485f7] text-[#0485f7] font-bold group-hover:bg-[#dcf2fe]"
                          : inRange
                            ? "text-[#011070] group-hover:bg-white/60"
                            : "text-[#1d212d] group-hover:bg-[#eff9fe]",
                  ].join(" ")}
                >
                  {d}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function CustomRangePanel({
  range,
  onChange,
  onClose,
}: {
  range: DateRange;
  onChange: (r: DateRange) => void;
  onClose: () => void;
}) {
  const [view, setView] = useState(new Date(range.start.getFullYear(), range.start.getMonth(), 1));
  const [pendingStart, setPendingStart] = useState<Date | null>(null);

  const rightView = addMonths(view, 1);

  const handlePick = (d: Date) => {
    if (!pendingStart) {
      setPendingStart(d);
      return;
    }
    const a = startOfDay(pendingStart).getTime();
    const b = startOfDay(d).getTime();
    const start = a <= b ? pendingStart : d;
    const end = a <= b ? d : pendingStart;
    onChange({ start, end });
    setPendingStart(null);
    onClose();
  };

  const previewStart = pendingStart ?? range.start;
  const previewEnd = pendingStart ?? range.end;
  const showStart = startOfDay(previewStart).getTime() <= startOfDay(previewEnd).getTime() ? previewStart : previewEnd;
  const showEnd = startOfDay(previewStart).getTime() <= startOfDay(previewEnd).getTime() ? previewEnd : previewStart;

  const isShortcutActive = (r: DateRange) =>
    !pendingStart && isSameDay(r.start, range.start) && isSameDay(r.end, range.end);

  const renderHeader = (which: "left" | "right") => {
    const v = which === "left" ? view : rightView;
    return (
      <div className="h-12 flex items-center justify-between px-2">
        {which === "left" ? (
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setView(new Date(view.getFullYear() - 1, view.getMonth(), 1))}
              aria-label="ปีก่อน"
              className="size-8 flex items-center justify-center rounded text-[#5d6c87] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
            >
              <ChevronsLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => setView(addMonths(view, -1))}
              aria-label="เดือนก่อน"
              className="size-8 flex items-center justify-center rounded text-[#5d6c87] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        ) : <span className="size-8" />}

        <div className="text-[20px] font-medium text-[#1d212d]">
          <span className="text-[#011b31]">{THAI_MONTH_LONG[v.getMonth()]}</span>{" "}
          <span>{v.getFullYear()}</span>
        </div>

        {which === "right" ? (
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setView(addMonths(view, 1))}
              disabled={isFutureMonth(rightView.getFullYear(), rightView.getMonth() + 1)}
              aria-label="เดือนถัดไป"
              className="size-8 flex items-center justify-center rounded text-[#5d6c87] hover:bg-[var(--color-neutral-100,#f5f8fa)] disabled:cursor-not-allowed disabled:text-[#c2cad6] disabled:hover:bg-transparent"
            >
              <ChevronRight size={20} />
            </button>
            <button
              type="button"
              onClick={() => setView(new Date(view.getFullYear() + 1, view.getMonth(), 1))}
              disabled={isFutureMonth(rightView.getFullYear() + 1, rightView.getMonth())}
              aria-label="ปีถัดไป"
              className="size-8 flex items-center justify-center rounded text-[#5d6c87] hover:bg-[var(--color-neutral-100,#f5f8fa)] disabled:cursor-not-allowed disabled:text-[#c2cad6] disabled:hover:bg-transparent"
            >
              <ChevronsRight size={20} />
            </button>
          </div>
        ) : <span className="size-8" />}
      </div>
    );
  };

  return (
    <div className="flex items-stretch">
      <div className="flex">
        <div className="flex flex-col w-[336px] p-2">
          {renderHeader("left")}
          <MonthGrid
            year={view.getFullYear()}
            month={view.getMonth()}
            selected={showStart}
            rangeStart={showStart}
            rangeEnd={showEnd}
            onPick={handlePick}
            bothEndsCircle
          />
        </div>
        <div className="flex flex-col w-[336px] p-2">
          {renderHeader("right")}
          <MonthGrid
            year={rightView.getFullYear()}
            month={rightView.getMonth()}
            selected={showStart}
            rangeStart={showStart}
            rangeEnd={showEnd}
            onPick={handlePick}
            bothEndsCircle
          />
        </div>
      </div>
      <div className="border-l border-[var(--color-neutral-200,#e9f0f4)] flex flex-col gap-2 p-4 self-stretch">
        {CUSTOM_SHORTCUTS.map((s) => {
          const active = isShortcutActive(s.build());
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => {
                onChange(s.build());
                setPendingStart(null);
                onClose();
              }}
              className={[
                "w-[128px] px-4 py-2 rounded text-left text-[14px] leading-6 transition-colors",
                active
                  ? "bg-[#eff9fe] text-[var(--color-primary-700,#025094)]"
                  : "text-[#5d6c87] hover:bg-[var(--color-neutral-100,#f5f8fa)]",
              ].join(" ")}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatRangeLabel(r: DateRange): string {
  const sy = r.start.getFullYear();
  const ey = r.end.getFullYear();
  const startStr = `${r.start.getDate()} ${THAI_MONTH_SHORT[r.start.getMonth()]}${sy !== ey ? " " + sy : ""}`;
  const endStr = `${r.end.getDate()} ${THAI_MONTH_SHORT[r.end.getMonth()]} ${ey}`;
  if (isSameDay(r.start, r.end)) return endStr;
  return `${startStr} - ${endStr}`;
}

/** Trigger button + portal popover that wraps CustomRangePanel. */
export function CustomRangeField({
  value,
  defaultValue,
  onChange,
  className = "",
}: {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (r: DateRange) => void;
  className?: string;
}) {
  const [internal, setInternal] = useState<DateRange>(
    defaultValue ?? { start: addDays(TODAY, -13), end: TODAY }
  );
  const range = value ?? internal;
  const setRange = (r: DateRange) => {
    if (value === undefined) setInternal(r);
    onChange?.(r);
  };

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const popW = 832;
    let left = r.left + r.width / 2 - popW / 2;
    left = Math.max(8, Math.min(window.innerWidth - popW - 8, left));
    setPos({ left, top: r.bottom + 8 });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (popRef.current?.contains(e.target as Node)) return;
      if (triggerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={[
          "flex items-center justify-between gap-2 h-10 px-3 rounded-lg border bg-white text-[14px] text-[var(--color-neutral-900)] transition-colors",
          open ? "border-[var(--color-primary)]" : "border-[var(--color-neutral-300)] hover:border-[var(--color-primary-400)]",
          className,
        ].join(" ")}
      >
        <span className="whitespace-nowrap">{formatRangeLabel(range)}</span>
        <CalendarIcon size={18} className="text-[var(--color-primary)]" />
      </button>
      {open && pos && createPortal(
        <div
          ref={popRef}
          className="fixed z-[9999] bg-white rounded-[12px] p-2 shadow-[0_0_1px_rgba(29,33,45,0.2),0_1px_4px_rgba(29,33,45,0.15),0_16px_32px_rgba(29,33,45,0.1)]"
          style={{ left: pos.left, top: pos.top }}
        >
          <CustomRangePanel
            range={range}
            onChange={setRange}
            onClose={() => setOpen(false)}
          />
        </div>,
        document.body
      )}
    </>
  );
}
