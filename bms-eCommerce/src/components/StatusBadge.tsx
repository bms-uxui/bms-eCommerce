export type StatusTone = "success" | "danger" | "pending" | "info" | "neutral";

const TONE: Record<StatusTone, { bg: string; text: string }> = {
  success: { bg: "#d6fc92", text: "#235c04" },
  danger: { bg: "#feeaed", text: "#a3072b" },
  pending: { bg: "#fdefb0", text: "#863a00" },
  info: { bg: "#cce7ff", text: "#025094" },
  neutral: { bg: "#e9f0f4", text: "#5d6c87" },
};

/** Pastel-pill status badge, matching the seller order tables. */
export default function StatusBadge({
  tone,
  children,
  className = "",
}: {
  tone: StatusTone;
  children: React.ReactNode;
  className?: string;
}) {
  const c = TONE[tone];
  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-1 rounded text-[12px] font-medium whitespace-nowrap ${className}`}
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {children}
    </span>
  );
}
