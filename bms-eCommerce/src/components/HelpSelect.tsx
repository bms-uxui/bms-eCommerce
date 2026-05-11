import { useEffect, useRef, useState } from "react";
import Icon from "./landing/Icon";

const HELP_ITEMS = [
  { icon: "book", label: "คู่มือการใช้งาน" },
  { icon: "comments", label: "แชทกับเจ้าหน้าที่" },
  { icon: "phone-set", label: "โทร 02-427-9991" },
  { icon: "question-circle", label: "คำถามที่พบบ่อย FAQ" },
] as const;

type HelpSelectProps = {
  className?: string;
  onSelect?: (label: string) => void;
};

export default function HelpSelect({ className = "", onSelect }: HelpSelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(0);
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

  return (
    <div ref={ref} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={[
          "flex items-center gap-1 px-2 py-1 rounded-lg",
          "text-[14px] font-medium leading-[18px] whitespace-nowrap",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 transition-colors",
          open
            ? "bg-[var(--color-primary-100)] text-[var(--color-primary)]"
            : "text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] active:bg-[var(--color-primary-100)]",
        ].join(" ")}
      >
        <Icon name="question-circle" size={16} />
        <span>ช่วยเหลือ</span>
        <Icon
          name="chevron-down"
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-dropdown absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] z-50 w-[191px] bg-white rounded-xl p-2 flex flex-col shadow-[0_0_1px_rgba(29,33,45,0.2),0_1px_4px_rgba(29,33,45,0.15),0_16px_32px_rgba(29,33,45,0.1)]"
        >
          {HELP_ITEMS.map((item, i) => {
            const selected = i === active;
            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setActive(i);
                  onSelect?.(item.label);
                  setOpen(false);
                }}
                className={[
                  "w-full flex items-center gap-2 px-2 py-1 rounded text-left text-[14px] tracking-[-0.006em] leading-6 transition-colors",
                  "focus-visible:outline-none focus-visible:bg-[var(--color-primary-100)] focus-visible:text-[var(--color-primary)]",
                  selected
                    ? "bg-[var(--color-primary-100)] text-[var(--color-primary)] font-medium"
                    : "bg-white text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                ].join(" ")}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
