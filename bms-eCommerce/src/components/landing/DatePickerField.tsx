import { DatePicker } from "@heroui/react";

export default function DatePickerField({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[14px] text-[var(--color-neutral-700)]">
        {label}
        {required && <span className="text-[var(--color-critical)]"> *</span>}
      </span>
      <DatePicker
        aria-label={label}
        radius="sm"
        granularity="day"
        classNames={{
          base: "w-full",
          inputWrapper:
            "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] shadow-none",
          input: "text-[14px] text-[var(--color-neutral-900)]",
        }}
        calendarProps={{
          // Always mark "today" with a clear ring in the popup calendar.
          classNames: {
            cellButton:
              "data-[today=true]:font-semibold data-[today=true]:ring-2 data-[today=true]:ring-inset data-[today=true]:ring-[var(--color-primary)]/60",
          },
        }}
      />
    </div>
  );
}
