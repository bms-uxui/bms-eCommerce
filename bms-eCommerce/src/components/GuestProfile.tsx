import { useNavigate } from "react-router";
import Icon from "./landing/Icon";

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
  const size = compact ? 36 : 40;
  return (
    <button
      type="button"
      aria-label="เข้าสู่ระบบ"
      onClick={() => navigate(to)}
      className={[
        "flex items-center gap-2 pr-2 py-0.5 rounded-full",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30",
        "hover:bg-[var(--color-primary)]/5 active:bg-[var(--color-primary)]/10",
        className,
      ].join(" ")}
    >
      <span
        className="flex items-center justify-center rounded-full bg-[var(--color-neutral-200)] text-[var(--color-neutral-600)] shrink-0"
        style={{ width: size, height: size }}
      >
        <Icon name="user" size={Math.round(size * 0.55)} />
      </span>
      <Icon
        name="chevron-down"
        size={compact ? 18 : 20}
        className="text-[var(--color-neutral-600)]"
      />
    </button>
  );
}
