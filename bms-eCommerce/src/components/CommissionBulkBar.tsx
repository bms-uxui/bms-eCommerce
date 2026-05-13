import CheckBox from "./CheckBox";

export type CommissionBulkBarProps = {
  /** Number of selected items, shown as `{count}/{max}`. */
  selectedCount?: number;
  max?: number;
  /** Whether the "select all on this page" checkbox is checked. */
  allChecked?: boolean;
  onToggleAll?: () => void;
  onSubmit?: () => void;
  selectLabel?: string;
  submitLabel?: string;
};

/** Sticky bottom bulk-action bar used on the affiliate commission list pages. Spans the content column (not full screen). */
export default function CommissionBulkBar({
  selectedCount = 0,
  max = 100,
  allChecked = false,
  onToggleAll,
  onSubmit,
  selectLabel = "เลือกสินค้าคอมมิชชันทั้งหมดในหน้านี้",
  submitLabel = "รับลิงก์แบบทีเดียวทั้งหมด",
}: CommissionBulkBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 lg:left-[232px] z-30 px-3 sm:px-8 pointer-events-none">
      <div className="pointer-events-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-[var(--color-primary)] text-white rounded-t-2xl drop-shadow-[0_0_4px_#68b6fa] px-4 pt-3 pb-4 sm:pt-4 sm:pb-6">
        <label className="flex-1 min-w-0 flex items-center gap-2 cursor-pointer select-none">
          <CheckBox variant="onPrimary" checked={allChecked} onChange={() => onToggleAll?.()} />
          <span className="flex-1 min-w-0 text-[14px] sm:text-[16px] font-medium leading-tight">{selectLabel}</span>
        </label>
        <div className="flex items-center justify-end gap-3 shrink-0">
          <span className="text-[14px] sm:text-[16px] font-medium whitespace-nowrap">
            {selectedCount}/{max}
          </span>
          <button
            type="button"
            onClick={onSubmit}
            className="flex-1 sm:flex-none sm:w-[200px] px-4 py-2 rounded-lg bg-white text-[var(--color-primary)] text-[14px] sm:text-[16px] font-semibold shadow-[0_2px_4px_1px_#036ac6] hover:bg-white/95 transition whitespace-nowrap"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
