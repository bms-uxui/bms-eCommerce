import { Truck } from "lucide-react";

export type CartItemBadge =
  | { kind: "free-shipping" }
  | { kind: "discount"; percent: number }
  | { kind: "shop-discount"; percent: number };

export type CartItemRowData = {
  name: string;
  image: string;
  badges?: CartItemBadge[];
};

function FreeShippingPill() {
  return (
    <span className="inline-flex items-center gap-0.5 rounded p-0.5 bg-[var(--color-positive-200)]">
      <Truck size={12} className="text-[var(--color-positive-700)]" />
      <span className="text-[10px] font-semibold leading-none text-[var(--color-positive-700)]">
        จัดส่งฟรี
      </span>
    </span>
  );
}

function DiscountPill({ percent }: { percent: number }) {
  return (
    <span className="inline-flex items-center justify-center h-[17px] px-1 rounded border-[0.5px] border-[#ff0105] bg-[#feeaed]">
      <span className="text-[10px] leading-none text-[#ff0105]">
        ลด {percent}%
      </span>
    </span>
  );
}

function ShopDiscountPill({ percent }: { percent: number }) {
  return (
    <span className="inline-flex items-center justify-center h-[17px] px-1 rounded border-[0.5px] border-[var(--color-promote-700)] bg-[var(--color-promote-200)]">
      <span className="text-[10px] leading-none text-[var(--color-promote-700)]">
        ส่วนลด {percent}%
      </span>
    </span>
  );
}

export default function CartItemRow({
  item,
  multiline = false,
}: {
  item: CartItemRowData;
  multiline?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 min-w-0">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-[var(--color-neutral-200)] shrink-0">
        <img
          src={item.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <p
          className={[
            "text-[16px] font-medium leading-[22px] text-[var(--color-neutral-900)]",
            multiline
              ? "line-clamp-2"
              : "overflow-hidden text-ellipsis whitespace-nowrap",
          ].join(" ")}
        >
          {item.name}
        </p>
        {item.badges && item.badges.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {item.badges.map((b, i) => {
              if (b.kind === "free-shipping") return <FreeShippingPill key={i} />;
              if (b.kind === "discount")
                return <DiscountPill key={i} percent={b.percent} />;
              return <ShopDiscountPill key={i} percent={b.percent} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
