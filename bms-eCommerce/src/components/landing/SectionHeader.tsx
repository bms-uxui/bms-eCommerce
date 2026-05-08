import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

export default function SectionHeader({
  title,
  badge,
  trailing,
  showAll = true,
  href = "/products",
}: {
  title: React.ReactNode;
  badge?: React.ReactNode;
  trailing?: React.ReactNode;
  showAll?: boolean;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-4 mb-3">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {badge}
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[var(--color-neutral-900)] truncate">
          {title}
        </h2>
        {trailing}
      </div>
      {showAll && (
        <Link
          to={href}
          className="flex items-center gap-1 text-sm text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] transition-colors"
        >
          ดูทั้งหมด
          <ChevronRight size={20} />
        </Link>
      )}
    </div>
  );
}
