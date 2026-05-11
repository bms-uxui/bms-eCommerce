import { useState } from "react";
import { Link } from "react-router";
import Icon from "./Icon";
import QuoteRequestModal from "./QuoteRequestModal";

export type Product = {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  rating: number;
  sold: string;
  freeShipping?: boolean;
  shopDiscount?: boolean;
  cod?: boolean;
};

function Badge({
  bg,
  fg,
  children,
}: {
  bg: string;
  fg: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-1 py-0.5 text-[10px] font-semibold"
      style={{ backgroundColor: bg, color: fg }}
    >
      {children}
    </span>
  );
}

function CountdownBox({ value }: { value: string }) {
  return (
    <span className="bg-white text-[var(--color-neutral-900)] text-[8px] font-bold rounded-[2px] w-[14px] h-[14px] flex items-center justify-center ring-[0.2px] ring-[var(--color-warning-700)]">
      {value}
    </span>
  );
}

export default function ProductCard({
  product,
  flashSale = false,
  variant = "default",
}: {
  product: Product;
  flashSale?: boolean;
  variant?: "default" | "quote";
}) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  return (
    <>
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col bg-white border border-[var(--color-neutral-300)] rounded-lg overflow-hidden hover:shadow-md hover:border-[var(--color-primary-400)] transition-all"
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Discount tag */}
        {product.discount !== undefined && (
          <div className="absolute top-0 right-0 w-10 h-5 rounded-bl-xl bg-gradient-to-b from-[var(--color-primary-400)] via-[var(--color-primary)] to-[var(--color-primary-600)] flex items-center justify-center">
            <span className="text-white text-[12px] font-semibold">
              -{product.discount}%
            </span>
          </div>
        )}

        {/* Flashsale strip */}
        {flashSale && (
          <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-b from-[var(--color-flash-from)] to-[var(--color-flash-to)] flex items-center px-2 gap-1">
            <p className="flex-1 text-white text-[12px] font-bold tracking-wide">
              FLASH<span className="font-normal">SALE</span>
            </p>
            <div className="flex items-center gap-1">
              <CountdownBox value="12" />
              <span className="text-white text-[10px] font-bold">:</span>
              <CountdownBox value="34" />
              <span className="text-white text-[10px] font-bold">:</span>
              <CountdownBox value="56" />
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-2">
        <p className="text-[12px] leading-4 text-[var(--color-neutral-900)] line-clamp-2 h-8">
          {product.name}
        </p>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1">
            <span className="text-[16px] font-bold text-[var(--color-primary)]">
              ฿ {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-[var(--color-neutral-500)] line-through">
                ฿{product.originalPrice.toFixed(2)}
              </span>
            )}
            <Icon name="tag" size={12} className="text-[var(--color-primary)]" />
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            {product.freeShipping && (
              <Badge bg="var(--color-positive-200)" fg="var(--color-positive-700)">
                <Icon name="delivery" size={10} />
                จัดส่งฟรี
              </Badge>
            )}
            {product.shopDiscount && (
              <Badge bg="var(--color-promote-200)" fg="var(--color-promote-700)">
                ส่วนลดร้านค้า
              </Badge>
            )}
            {product.cod && (
              <Badge bg="var(--color-warning-200)" fg="var(--color-warning-700)">
                COD
              </Badge>
            )}
          </div>
        </div>

        {variant === "quote" ? (
          <div className="flex items-stretch gap-1 h-[29px]">
            <button
              type="button"
              aria-label="เพิ่มลงรถเข็น"
              onClick={(e) => e.preventDefault()}
              className="w-[29px] shrink-0 flex items-center justify-center rounded border-[0.5px] border-[var(--color-primary)] bg-[var(--color-primary-100)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
            >
              <Icon name="cart" size={16} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuoteOpen(true);
              }}
              className="flex-1 min-w-0 px-4 rounded bg-[var(--color-primary)] text-white text-[14px] font-medium tracking-[-0.011em] hover:brightness-110 active:scale-[0.98] transition"
            >
              ขอใบเสนอราคา
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[12px] text-[var(--color-neutral-900)]">
            <Icon name="star-fill" size={12} className="text-[#FFB800]" />
            <span>{product.rating}/5</span>
            <span className="h-3 w-px bg-[var(--color-neutral-300)] mx-0.5" />
            <span>{product.sold} ขายแล้ว</span>
          </div>
        )}
      </div>
    </Link>
    {variant === "quote" && (
      <QuoteRequestModal
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        initialProducts={[
          {
            id: String(product.id),
            image: product.image,
            name: product.name,
            unitPrice: product.price,
            qty: 100,
            minOrderQty: 100,
          },
        ]}
        discountPercent={product.discount ?? 10}
      />
    )}
    </>
  );
}
