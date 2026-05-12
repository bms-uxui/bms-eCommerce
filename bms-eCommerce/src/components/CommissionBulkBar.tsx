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

/** Sticky bottom bulk-action bar used on the affiliate commission list pages. */
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
    <div className="fixed bottom-0 inset-x-0 z-30 bg-[var(--color-primary)] text-white shadow-[0_-2px_12px_rgba(4,133,247,0.25)]">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-8 py-3 ml-0 lg:ml-[232px]">
        <label className="flex items-center gap-2 text-[14px] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={() => onToggleAll?.()}
            className="accent-white w-4 h-4"
          />
          {selectLabel}
        </label>
        <div className="flex items-center gap-4">
          <span className="text-[14px] whitespace-nowrap">
            {selectedCount}/{max}
          </span>
          <button
            type="button"
            onClick={onSubmit}
            className="h-9 px-4 rounded-lg bg-white text-[var(--color-primary)] text-[14px] font-medium hover:bg-white/90 transition whitespace-nowrap"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
