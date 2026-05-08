import { useState } from "react";
import { Button } from "@heroui/react";
import {
  Star,
  ShoppingBag,
  Truck,
  PackageCheck,
  Minus,
  Plus,
  Heart,
  Share2,
  Facebook,
  Instagram,
  Twitter,
  Link as LinkIcon,
  Zap,
} from "lucide-react";

export type ProductDetail = {
  name: string;
  rating: number;
  sold: string;
  reviews: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  flashSale?: boolean;
  countdown?: { hh: string; mm: string; ss: string };
  shipping?: { eta: string; freeShipping?: boolean };
  sizes?: string[];
  variants?: string[];
  stock?: number;
  likes?: number;
  gallery: string[];
};

function CountdownPill({ value }: { value: string }) {
  return (
    <span
      className="size-8 rounded-lg flex items-center justify-center text-white text-[16px] font-semibold tracking-wide"
      style={{
        background:
          "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), linear-gradient(180deg, #e62e05 0%, #bc1b06 100%)",
      }}
    >
      {value}
    </span>
  );
}

function FlashSaleBanner({
  countdown = { hh: "12", mm: "13", ss: "08" },
}: {
  countdown?: { hh: string; mm: string; ss: string };
}) {
  return (
    <div className="bg-[#e62e05] flex items-center gap-2 p-2 rounded-t-2xl">
      <div className="flex-1 flex items-center gap-2.5 py-1.5 px-1">
        <Zap size={20} className="fill-white text-white" />
        <span className="text-white text-[20px] font-bold tracking-[1px]">
          FLASHSALE
        </span>
      </div>
      <div className="flex items-center gap-1">
        <CountdownPill value={countdown.hh} />
        <span className="text-white text-[20px]">:</span>
        <CountdownPill value={countdown.mm} />
        <span className="text-white text-[20px]">:</span>
        <CountdownPill value={countdown.ss} />
      </div>
    </div>
  );
}

function PillRow({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-start gap-2.5">
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={[
              "px-4 py-1 rounded text-[12px] border transition-colors",
              active
                ? "border-[var(--color-primary)] bg-[var(--color-primary-100)] text-[var(--color-primary)]"
                : "border-[#a8b9ca] text-[var(--color-neutral-900)] hover:border-[var(--color-primary)]",
            ].join(" ")}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6 items-start w-full">
      <span className="w-[100px] shrink-0 text-[14px] text-[var(--color-neutral-900)] pt-1">
        {label}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export default function ProductDetailHero({
  product,
}: {
  product: ProductDetail;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(product.sizes?.[0] ?? "");
  const [variant, setVariant] = useState(product.variants?.[0] ?? "");
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);

  return (
    <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 grid grid-cols-1 lg:grid-cols-[588px_1fr] gap-6">
      {/* Gallery */}
      <div className="flex flex-col gap-2.5 h-[568px]">
        <div className="flex-1 min-h-0 rounded-lg overflow-hidden bg-[var(--color-neutral-200)]">
          <img
            src={product.gallery[activeImg]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="bg-[var(--color-neutral-200)] rounded-xl p-2.5 flex gap-2.5 overflow-x-auto scrollbar-none h-[100px] shrink-0">
          {product.gallery.map((src, i) => {
            const active = i === activeImg;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                className={[
                  "size-20 shrink-0 rounded-lg overflow-hidden transition-all",
                  active
                    ? "ring-[3px] ring-[var(--color-primary)]/30 ring-offset-1 ring-offset-white"
                    : "",
                ].join(" ")}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Buy box */}
      <div className="flex flex-col gap-8 self-stretch">
        {/* Title + meta */}
        <div className="flex flex-col gap-3">
          <h1 className="text-[24px] font-medium text-black line-clamp-2">
            {product.name}
          </h1>
          <div className="flex items-center gap-4 text-[16px] text-[var(--color-neutral-900)]">
            <span className="flex items-center gap-2">
              <Star size={16} className="fill-[#FFB800] text-[#FFB800]" />
              <span>{product.rating}/5</span>
            </span>
            <span className="w-px h-5 bg-[var(--color-neutral-300)]" />
            <span className="flex items-center gap-2">
              <ShoppingBag size={16} />
              <span>ขายแล้ว {product.sold}</span>
            </span>
            <span className="w-px h-5 bg-[var(--color-neutral-300)]" />
            <span>
              <span className="underline">{product.reviews}</span>{" "}
              <span className="text-[14px] text-[var(--color-neutral-500)]">รีวิว</span>
            </span>
          </div>
        </div>

        {/* Flash-sale price card */}
        <div className="rounded-2xl overflow-hidden">
          {product.flashSale && <FlashSaleBanner countdown={product.countdown} />}
          <div
            className={[
              "flex items-center gap-3 p-2",
              product.flashSale ? "bg-[#FEF4F5]" : "bg-white",
            ].join(" ")}
          >
            <span className="text-[24px] font-bold text-[#cd0004] tracking-tight">
              ฿ {product.price.toFixed(2)}
            </span>
            {product.originalPrice !== undefined && (
              <span className="text-[16px] text-[var(--color-neutral-500)] line-through">
                ฿ {product.originalPrice.toFixed(2)}
              </span>
            )}
            {product.discount !== undefined && (
              <span className="border-[0.5px] border-[#ff0105] bg-[#feeaed] text-[#ff0105] text-[12px] rounded px-1.5 py-0.5">
                ลด {product.discount}%
              </span>
            )}
          </div>
        </div>

        {/* Shipping */}
        {product.shipping && (
          <FieldRow label="การจัดส่ง">
            <div className="flex flex-wrap items-center gap-2.5">
              {product.shipping.freeShipping && (
                <span className="inline-flex items-center gap-1 h-6 px-1.5 rounded bg-[var(--color-positive-200)] text-[var(--color-positive-700)] text-[12px] font-semibold">
                  <Truck size={14} />
                  จัดส่งฟรี
                </span>
              )}
              <span className="text-[14px] font-medium text-[var(--color-positive-700)]">
                จะได้รับสินค้าภายใน {product.shipping.eta}
              </span>
            </div>
          </FieldRow>
        )}

        {/* Size */}
        {product.sizes && (
          <FieldRow label="ขนาดสินค้า">
            <PillRow options={product.sizes} value={size} onChange={setSize} />
          </FieldRow>
        )}

        {/* Variant */}
        {product.variants && (
          <FieldRow label="ตัวเลือกสินค้า">
            <PillRow options={product.variants} value={variant} onChange={setVariant} />
          </FieldRow>
        )}

        {/* Quantity */}
        <FieldRow label="จำนวนสินค้า">
          <div className="flex items-center gap-4">
            <div className="bg-[var(--color-neutral-200)] rounded-lg flex items-center gap-6 px-4 py-2">
              <button
                type="button"
                aria-label="ลด"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="size-3 flex items-center justify-center text-black hover:text-[var(--color-primary)] transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="text-[14px] font-medium text-black tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                aria-label="เพิ่ม"
                onClick={() => setQty((q) => q + 1)}
                className="size-3 flex items-center justify-center text-black hover:text-[var(--color-primary)] transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
            {product.stock !== undefined && (
              <span className="flex items-center gap-2 text-[12px] text-[var(--color-neutral-500)]">
                <PackageCheck size={16} />
                เหลือเพียง {product.stock} ชิ้น
              </span>
            )}
          </div>
        </FieldRow>

        {/* CTA */}
        <div className="flex gap-4 w-full">
          <Button
            radius="md"
            startContent={<ShoppingBag size={16} />}
            className="flex-1 h-11 bg-[var(--color-primary-100)] border border-[var(--color-primary)] text-[var(--color-primary)] text-[16px] font-medium tracking-[-0.011em] hover:bg-[var(--color-primary-100)]/80 transition"
          >
            เพิ่มไปที่ตะกร้า
          </Button>
          <Button
            radius="md"
            className="flex-1 h-11 bg-[var(--color-primary)] text-white text-[16px] font-medium tracking-[-0.011em] hover:brightness-110 transition"
          >
            ซื้อสินค้า
          </Button>
        </div>

        {/* Share + likes */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 flex items-center gap-4">
            <span className="text-[14px] text-[var(--color-neutral-900)]">แชร์สินค้า</span>
            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook, color: "#1877F2", label: "Facebook" },
                { Icon: Twitter, color: "#000000", label: "X" },
                { Icon: Instagram, color: "#E1306C", label: "Instagram" },
                { Icon: Share2, color: "#06C755", label: "Line" },
              ].map(({ Icon, color, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="size-6 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                >
                  <Icon size={14} />
                </button>
              ))}
              <button
                aria-label="คัดลอกลิงก์"
                className="size-6 rounded-full bg-[var(--color-neutral-300)] flex items-center justify-center text-[var(--color-neutral-700)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] transition"
              >
                <LinkIcon size={14} />
              </button>
            </div>
          </div>
          <span className="w-px h-8 bg-[var(--color-neutral-300)]" />
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            className="flex-1 flex items-center justify-center gap-2 text-[16px] text-[var(--color-neutral-800)] hover:text-[var(--color-critical)] transition-colors"
          >
            <Heart
              size={20}
              className={liked ? "fill-[var(--color-critical)] text-[var(--color-critical)]" : ""}
            />
            <span>ถูกใจ ({product.likes ?? 0})</span>
          </button>
        </div>
      </div>
    </section>
  );
}
