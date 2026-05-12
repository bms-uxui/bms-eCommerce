import Icon from "./landing/Icon";

const DEFAULT_PAGES: (number | "…")[] = [1, 2, 3, 4, 5, "…", 12];

export type PaginationProps = {
  page: number;
  onPageChange: (page: number) => void;
  pages?: (number | "…")[];
  total?: number;
  perPage?: number;
  className?: string;
};

/** Shared list pagination footer (count + page-size + page buttons), seller-style. */
export default function Pagination({
  page,
  onPageChange,
  pages = DEFAULT_PAGES,
  total = 10488,
  perPage = 20,
  className = "",
}: PaginationProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[var(--color-neutral-200)] ${className}`}
    >
      <div className="flex items-center gap-4">
        <p className="text-[14px]">
          <span className="text-[var(--color-neutral-900)]">{total.toLocaleString()} </span>
          <span className="text-[var(--color-neutral-500)]">รายการ</span>
        </p>
        <span className="w-px h-6 bg-[var(--color-neutral-300)]" />
        <div className="flex items-center gap-2">
          <span className="text-[14px] text-[var(--color-neutral-500)]">แสดง</span>
          <button
            type="button"
            className="h-8 pl-3 pr-2 flex items-center gap-2 rounded-lg bg-white border border-[var(--color-neutral-300)] text-[14px] font-semibold text-[var(--color-primary)]"
          >
            {perPage}
            <Icon name="chevron-down" size={14} className="text-[var(--color-neutral-600)]" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          aria-label="ก่อนหน้า"
          className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
        >
          <Icon name="chevron-left" size={16} />
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={i}
              className="w-8 h-8 flex items-center justify-center text-[12px] text-[var(--color-neutral-600)]"
            >
              …
            </span>
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => onPageChange(p)}
              className={[
                "min-w-8 h-8 px-2 flex items-center justify-center rounded text-[12px] font-medium transition-colors",
                p === page
                  ? "bg-[#dcf2fe] text-[#0e3ed0]"
                  : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]",
              ].join(" ")}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          aria-label="ถัดไป"
          className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
        >
          <Icon name="chevron-right" size={16} />
        </button>
      </div>
    </div>
  );
}
