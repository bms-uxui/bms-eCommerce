import { Check } from "lucide-react";

export type CheckBoxProps = {
  checked: boolean;
  onChange: () => void;
  /** "onPrimary" = white check for use on a colored (primary) background. */
  variant?: "default" | "onPrimary";
  className?: string;
};

/** Shared square checkbox used across seller tables and the affiliate commission pages. */
export default function CheckBox({ checked, onChange, variant = "default", className = "" }: CheckBoxProps) {
  const onPrimary = variant === "onPrimary";
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={[
        "w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors",
        onPrimary
          ? checked
            ? "bg-white border-white text-[var(--color-primary)]"
            : "bg-transparent border-white/70 hover:border-white"
          : checked
            ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
            : "bg-white border-[var(--color-neutral-300)] hover:border-[var(--color-primary)]",
        className,
      ].join(" ")}
    >
      {checked && <Check size={12} strokeWidth={3} />}
    </button>
  );
}
