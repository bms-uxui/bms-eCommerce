export type TabBarItem<K extends string> = {
  key: K;
  label: string;
  count?: number;
};

export default function TabBar<K extends string>({
  items,
  active,
  onChange,
  sticky = false,
  className,
}: {
  items: TabBarItem<K>[];
  active: K;
  onChange: (k: K) => void;
  sticky?: boolean;
  className?: string;
}) {
  return (
    <div
      className={[
        "bg-white rounded-t-2xl p-2 border-b border-[var(--color-neutral-300)] z-10",
        sticky ? "lg:sticky lg:top-[106px]" : "",
        className ?? "",
      ].join(" ")}
    >
      <div className="bg-[var(--color-neutral-200)] rounded-lg p-1 flex h-10 overflow-x-auto scrollbar-none">
        {items.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={[
                "shrink-0 sm:flex-1 sm:shrink flex items-center justify-center gap-2 h-8 px-4 py-1 rounded text-[14px] font-medium tracking-[-0.006em] transition",
                isActive
                  ? "bg-[var(--color-primary)] text-white shadow-[0_0_1px_0_rgba(29,33,45,0.2),0_0_2px_0_rgba(29,33,45,0.08),0_2px_4px_0_rgba(29,33,45,0.08)]"
                  : "text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)]",
              ].join(" ")}
            >
              <span className="whitespace-nowrap">{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="w-5 h-5 rounded-full bg-[var(--color-critical)] text-white text-[12px] flex items-center justify-center shrink-0">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
