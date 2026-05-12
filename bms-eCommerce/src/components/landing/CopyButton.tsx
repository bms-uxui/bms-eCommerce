import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({
  value,
  size = 16,
  label = "คัดลอกแล้ว",
  className = "",
}: {
  value: string;
  size?: number;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const onCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard?.writeText(value);
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <span className="relative inline-flex shrink-0">
      <button
        type="button"
        onClick={onCopy}
        aria-label="คัดลอก"
        className={`text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] transition-colors ${className}`}
      >
        {copied ? <Check size={size} className="text-[var(--color-positive-700)]" strokeWidth={2.5} /> : <Copy size={size} />}
      </button>
      {copied && (
        <span
          role="status"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[calc(100%+4px)] whitespace-nowrap rounded-md bg-[var(--color-neutral-900)] px-2 py-1 text-[12px] font-medium text-white shadow-md z-20"
        >
          {label}
        </span>
      )}
    </span>
  );
}
