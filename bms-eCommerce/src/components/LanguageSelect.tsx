import { useEffect, useRef, useState } from "react";
import Icon from "./landing/Icon";

const LANGUAGES = [
  { code: "th", label: "ภาษาไทย" },
  { code: "en", label: "English" },
] as const;

type LangCode = (typeof LANGUAGES)[number]["code"];

type LanguageSelectProps = {
  value?: LangCode;
  onChange?: (code: LangCode) => void;
  className?: string;
};

export default function LanguageSelect({
  value,
  onChange,
  className = "",
}: LanguageSelectProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<LangCode>("th");
  const lang = value ?? internal;
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

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  const select = (code: LangCode) => {
    if (value === undefined) setInternal(code);
    onChange?.(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
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
        <Icon name="world" size={16} />
        <span>{current.label}</span>
        <Icon
          name="chevron-down"
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="animate-dropdown absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] z-50 w-[155px] bg-white rounded-xl p-2 flex flex-col gap-2 shadow-[0_0_1px_rgba(29,33,45,0.2),0_1px_4px_rgba(29,33,45,0.15),0_16px_32px_rgba(29,33,45,0.1)]"
        >
          {LANGUAGES.map((l) => {
            const selected = l.code === lang;
            return (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => select(l.code)}
                className={[
                  "w-full flex items-center pl-2 pr-4 py-1 rounded text-left text-[14px] tracking-[-0.006em] leading-6 transition-colors",
                  "focus-visible:outline-none focus-visible:bg-[var(--color-primary-100)] focus-visible:text-[var(--color-primary)]",
                  selected
                    ? "bg-[var(--color-primary-100)] text-[var(--color-primary)] font-medium"
                    : "bg-white text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                ].join(" ")}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
