import Icon from "./landing/Icon";
import CheckBox from "./CheckBox";

export type CommissionProduct = {
  id: string | number;
  image: string;
  name: string;
  price: number;
  /** Discount percentage shown as a `-X%` badge; omit to hide the badge. */
  discount?: number;
  /** Commission rate (percent). */
  rate: number;
  /** Sold-count label, e.g. `"12.3k"`. */
  sold?: string;
};

/** Affiliate commission product card (image + checkbox + discount badge + price/sold + commission + รับลิงก์). */
export default function CommissionProductCard({
  product,
  checked,
  onToggle,
}: {
  product: CommissionProduct;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col bg-white border-[0.5px] border-[var(--color-neutral-300)] rounded-lg overflow-hidden hover:shadow-md hover:border-[var(--color-primary-400)] transition-all">
      <div className="relative h-[170px] overflow-hidden bg-[var(--color-neutral-200)]">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-0 left-0 p-3">
          <CheckBox checked={checked} onChange={onToggle} />
        </div>
        {product.discount !== undefined && (
          <div className="absolute top-0 right-0 min-w-10 h-5 px-1.5 rounded-bl-xl bg-gradient-to-b from-[var(--color-primary-400)] via-[var(--color-primary)] to-[var(--color-primary-600)] flex items-center justify-center">
            <span className="text-white text-[12px] font-semibold">-{product.discount}%</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 p-3 flex-1">
        <p className="text-[13px] font-medium text-[var(--color-neutral-900)] leading-snug line-clamp-2 min-h-[34px]">
          {product.name}
        </p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2 whitespace-nowrap">
            <span className="text-[16px] font-bold text-[var(--color-primary)]">฿ {product.price.toLocaleString()}</span>
            {product.sold && <span className="text-[12px] text-[var(--color-neutral-600)]">{product.sold} ขายแล้ว</span>}
          </div>
          <p className="text-[12px] text-[#449C0A]">ค่าคอมมิชชัน {product.rate.toFixed(1)}%</p>
        </div>
        <button
          type="button"
          className="mt-auto h-7 rounded border border-[var(--color-primary)] bg-white text-[var(--color-primary)] text-[12px] font-medium inline-flex items-center justify-center gap-2 hover:bg-[var(--color-primary-100)] transition"
        >
          <Icon name="link" size={14} />
          รับลิงก์
        </button>
      </div>
    </div>
  );
}
