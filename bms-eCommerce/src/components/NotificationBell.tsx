import BellIcon from "./BellIcon";

type NotificationBellProps = {
  /** Unread badge count. Badge is hidden when 0. */
  count?: number;
  size?: number;
  className?: string;
  onClick?: () => void;
};

/** Shared header notification bell with unread badge. */
export default function NotificationBell({
  count = 10,
  size = 24,
  className = "",
  onClick,
}: NotificationBellProps) {
  return (
    <button
      type="button"
      aria-label="การแจ้งเตือน"
      onClick={onClick}
      className={`relative text-[var(--color-neutral-900)] hover:text-[var(--color-primary)] transition-colors ${className}`}
    >
      <BellIcon size={size} />
      {count > 0 && (
        <span className="absolute -top-1 left-[14px] min-w-[14px] h-[14px] px-1 rounded-full bg-[var(--color-critical)] text-white text-[8px] font-medium leading-[14px] text-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
