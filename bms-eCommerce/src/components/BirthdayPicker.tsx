import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

const ROW_HEIGHT = 32;
const VISIBLE_ROWS = 5;
const WHEEL_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS;
const PAD = ROW_HEIGHT * Math.floor(VISIBLE_ROWS / 2);

export type BirthdayValue = { day: number; month: number; year: number };

type BirthdayPickerProps = {
  value?: BirthdayValue | null;
  onChange?: (v: BirthdayValue) => void;
  placeholder?: string;
  className?: string;
  minYearBE?: number;
  maxYearBE?: number;
};

function Wheel({
  items,
  value,
  onChange,
  format = (v) => String(v).padStart(2, "0"),
}: {
  items: number[];
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const settleRef = useRef<number | null>(null);
  const [centerIdx, setCenterIdx] = useState(() => Math.max(0, items.indexOf(value)));

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const i = items.indexOf(value);
    if (i < 0) return;
    el.scrollTop = i * ROW_HEIGHT;
    setCenterIdx(i);
  }, [value, items]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const raw = el.scrollTop / ROW_HEIGHT;
    const idx = Math.max(0, Math.min(items.length - 1, Math.round(raw)));
    setCenterIdx(idx);
    if (settleRef.current) window.clearTimeout(settleRef.current);
    settleRef.current = window.setTimeout(() => {
      const next = items[idx];
      if (next !== value) onChange(next);
    }, 120);
  };

  const scrollTo = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: idx * ROW_HEIGHT, behavior: "smooth" });
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="relative flex-1 overflow-y-auto scrollbar-none"
      style={{ height: WHEEL_HEIGHT, scrollSnapType: "y mandatory" }}
    >
      <div style={{ paddingTop: PAD, paddingBottom: PAD }}>
        {items.map((item, i) => {
          const d = Math.abs(i - centerIdx);
          const color =
            d === 0
              ? "text-[var(--color-primary)] font-medium"
              : d === 1
              ? "text-[var(--color-neutral-900)]"
              : "text-[var(--color-neutral-500)]";
          return (
            <button
              key={item}
              type="button"
              onClick={() => {
                scrollTo(i);
                onChange(item);
              }}
              className={`w-full flex items-center justify-center text-[14px] leading-6 transition-colors ${color}`}
              style={{ height: ROW_HEIGHT, scrollSnapAlign: "center" }}
            >
              {format(item)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function BirthdayPicker({
  value,
  onChange,
  placeholder = "วัน/เดือน/ปีเกิด (12/12/2569)",
  className = "",
  minYearBE,
  maxYearBE,
}: BirthdayPickerProps) {
  const currentBE = new Date().getFullYear() + 543;
  const yMax = maxYearBE ?? currentBE;
  const yMin = minYearBE ?? yMax - 100;

  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<BirthdayValue>({
    day: 1,
    month: 1,
    year: yMax - 25,
  });
  const current = value ?? internal;

  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
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

  const daysInMonth = useMemo(() => {
    const ce = current.year - 543;
    return new Date(ce, current.month, 0).getDate();
  }, [current.month, current.year]);

  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const years = useMemo(
    () => Array.from({ length: yMax - yMin + 1 }, (_, i) => yMax - i),
    [yMin, yMax]
  );

  const update = (next: BirthdayValue) => {
    const maxDay = new Date(next.year - 543, next.month, 0).getDate();
    const clamped = { ...next, day: Math.min(next.day, maxDay) };
    if (value === undefined) setInternal(clamped);
    onChange?.(clamped);
  };

  const hasValue = value !== null && value !== undefined;
  const label = hasValue
    ? `${String(current.day).padStart(2, "0")}/${String(current.month).padStart(2, "0")}/${current.year}`
    : placeholder;

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={[
          "w-full flex items-center gap-3 bg-white rounded-lg px-3 py-2 text-left transition-shadow",
          "focus-visible:outline-none",
          open
            ? "shadow-[0_0_0_1px_rgba(255,255,255,0.6),0_0_0_3px_rgba(4,133,247,0.3)]"
            : "border border-[var(--color-neutral-300)] hover:border-[var(--color-primary-400)]",
        ].join(" ")}
      >
        <span
          className={[
            "flex-1 text-[16px] leading-6 tracking-[-0.011em]",
            hasValue ? "text-[var(--color-neutral-900)]" : "text-[var(--color-neutral-500)]",
          ].join(" ")}
          style={{ fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
        >
          {label}
        </span>
        <CalendarIcon size={20} className="text-[var(--color-primary)] shrink-0" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="เลือกวันเกิด"
          className="animate-dropdown absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-white rounded-xl p-2 shadow-[0_0_1px_rgba(29,33,45,0.2),0_1px_4px_rgba(29,33,45,0.15),0_16px_32px_rgba(29,33,45,0.1)]"
        >
          <div className="relative">
            <div
              aria-hidden
              className="absolute left-2 right-2 top-1/2 -translate-y-1/2 bg-[var(--color-primary-100)] rounded pointer-events-none"
              style={{ height: ROW_HEIGHT }}
            />
            <div className="relative flex items-stretch px-2">
              <Wheel
                items={days}
                value={current.day}
                onChange={(d) => update({ ...current, day: d })}
              />
              <Wheel
                items={months}
                value={current.month}
                onChange={(m) => update({ ...current, month: m })}
              />
              <Wheel
                items={years}
                value={current.year}
                onChange={(y) => update({ ...current, year: y })}
                format={(v) => String(v)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
