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
  location?: string;
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
  recommended = false,
  variant = "default",
}: {
  product: Product;
  flashSale?: boolean;
  recommended?: boolean;
  variant?: "default" | "quote";
}) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  return (
    <>
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col bg-white border-[0.5px] border-[var(--color-neutral-300)] rounded-lg overflow-hidden hover:shadow-md hover:border-[var(--color-primary-400)] transition-all"
    >
      {/* Image area */}
      <div className="relative aspect-[208/190] overflow-hidden shrink-0">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Recommended badge */}
        {recommended && (
          <div className="absolute top-0 right-0 rounded-bl-[12px] bg-gradient-to-b from-[var(--color-primary-400)] via-[var(--color-primary)] to-[var(--color-primary-600)] px-[6px] py-[4px] flex items-center justify-center">
            <span className="text-white text-[12px] font-semibold whitespace-nowrap">สินค้าแนะนำ</span>
          </div>
        )}
        {/* Discount tag */}
        {!recommended && product.discount !== undefined && (
          <div className="absolute top-0 right-0 w-10 h-5 rounded-bl-xl bg-gradient-to-b from-[var(--color-primary-400)] via-[var(--color-primary)] to-[var(--color-primary-600)] flex items-center justify-center">
            <span className="text-white text-[12px] font-semibold">
              -{product.discount}%
            </span>
          </div>
        )}

        {/* Flashsale strip */}
        {flashSale && (
          <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-b from-[var(--color-flash-from)] to-[var(--color-flash-to)] flex items-center px-2 gap-1">
            <p className="flex-1 text-white text-[12px] font-bold tracking-[0.6px]">
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
      <div className="flex flex-col gap-2 p-2">
        <p className="text-[12px] leading-4 text-[var(--color-neutral-900)] line-clamp-2 h-8 tracking-[0.24px]">
          {product.name}
        </p>

        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center gap-1">
            <span className="text-[16px] font-bold text-[var(--color-primary)]">
              ฿ {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-[var(--color-neutral-500)] line-through">
                ฿{product.originalPrice.toFixed(2)}
              </span>
            )}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 4V3.5M5 6.25V5.75M5 8.5V8M2.6 2H9.4C9.96005 2 10.2401 2 10.454 2.10899C10.6422 2.20487 10.7951 2.35785 10.891 2.54601C11 2.75992 11 3.03995 11 3.6V4.25C10.0335 4.25 9.25 5.0335 9.25 6C9.25 6.9665 10.0335 7.75 11 7.75V8.4C11 8.96005 11 9.24008 10.891 9.45399C10.7951 9.64215 10.6422 9.79513 10.454 9.89101C10.2401 10 9.96005 10 9.4 10H2.6C2.03995 10 1.75992 10 1.54601 9.89101C1.35785 9.79513 1.20487 9.64215 1.10899 9.45399C1 9.24008 1 8.96005 1 8.4V7.75C1.9665 7.75 2.75 6.9665 2.75 6C2.75 5.0335 1.9665 4.25 1 4.25V3.6C1 3.03995 1 2.75992 1.10899 2.54601C1.20487 2.35785 1.35785 2.20487 1.54601 2.10899C1.75992 2 2.03995 2 2.6 2Z" stroke="#DD214F" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
          <div className="flex items-stretch gap-1 h-[29px] mt-1">
            <button
              type="button"
              aria-label="เพิ่มลงรถเข็น"
              onClick={(e) => e.preventDefault()}
              className="w-[29px] shrink-0 flex items-center justify-center rounded border-[0.5px] border-[var(--color-primary)] bg-[var(--color-primary-100)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#cartPlusClip)">
                  <path d="M8.00049 14.5C6.78203 14.5 3.35343 14.6673 2.90575 14.4232C2.51249 14.2087 2.20261 13.8684 2.02578 13.4568C1.82448 12.9883 1.88135 12.3818 1.99508 11.1686L2.39508 6.90196C2.49112 5.87755 2.53914 5.36534 2.76952 4.97809C2.97241 4.63704 3.27219 4.36406 3.63069 4.19388C4.03775 4.00065 4.5522 4.00065 5.58111 4.00065L10.4197 4.00065C11.4486 4.00065 11.9631 4.00065 12.3701 4.19388C12.7286 4.36406 13.0284 4.63704 13.2313 4.97809C13.4617 5.36534 13.9044 7.97559 14.0005 9M10.6671 6.00065V4.00065C10.6671 2.52789 9.47317 1.33398 8.00041 1.33398C6.52765 1.33398 5.33374 2.52789 5.33374 4.00065V6.00065" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M14 13H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </g>
                <defs>
                  <clipPath id="cartPlusClip"><rect width="16" height="16" fill="white"/></clipPath>
                </defs>
              </svg>
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
          <div className="flex items-center justify-between gap-1 text-[12px] text-[var(--color-neutral-900)]">
            <div className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  fill={product.rating >= 4 ? "#FFB800" : product.rating >= 3 ? "#FF8C00" : "#FF4D4D"}
                  stroke={product.rating >= 4 ? "#FFB800" : product.rating >= 3 ? "#FF8C00" : "#FF4D4D"}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
              <span>{product.rating}/5</span>
              {!product.location && (
                <>
                  <span className="h-3 w-px bg-[var(--color-neutral-300)] mx-0.5" />
                  <span>{product.sold} ขายแล้ว</span>
                </>
              )}
            </div>
            {product.location && (
              <div className="flex items-center gap-[4px] shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                </svg>
                <span>{product.location}</span>
              </div>
            )}
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
