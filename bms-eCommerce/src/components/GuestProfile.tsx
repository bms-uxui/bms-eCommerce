import { useNavigate } from "react-router";
import { LogIn } from "lucide-react";

type GuestProfileProps = {
  compact?: boolean;
  to?: string;
  className?: string;
};

export default function GuestProfile({
  compact = false,
  to = "/login",
  className = "",
}: GuestProfileProps) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={[
        "flex items-center gap-1 px-[10px] h-9 rounded-lg shrink-0",
        "bg-[var(--color-primary)] text-white",
        "text-[14px] font-semibold whitespace-nowrap",
        "transition-opacity hover:opacity-90 active:opacity-80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40",
        compact ? "text-[13px]" : "",
        className,
      ].join(" ")}
    >
      <LogIn size={14} strokeWidth={2.5} />
      เข้าสู่ระบบ
    </button>
  );
}
