import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Checkbox } from "@heroui/react";
import {
  ChevronRight,
  ChevronDown,
  Truck,
  Ticket,
  Trash2,
  Minus,
  Plus,
} from "lucide-react";
import paracetamol from "../assets/products/p02-paracetamol.jpg";
import CartItemRow from "../components/landing/CartItemRow";
import { ProfileMenu } from "../components/landing/Header";
import LanguageSelect from "../components/LanguageSelect";
import HelpSelect from "../components/HelpSelect";

type CartItem = {
  id: string;
  name: string;
  image: string;
  variant?: string;
  unitPrice: number;
  originalPrice?: number;
  qty: number;
  freeShipping?: boolean;
  discountPct?: number;
  shopDiscountPct?: number;
};

type Shop = {
  id: string;
  name: string;
  items: CartItem[];
  shippingNote?: { freeShipOver?: number; eta: string };
  coupon?: string;
};

const INITIAL_SHOPS: Shop[] = [
  {
    id: "bms",
    name: "BMS SHOP",
    items: [
      {
        id: "1",
        name: "ยาพาราเซตามอล 1000 mg แก้ปวดได้ดีที่เดียวนะkmkmkmkmksma",
        image: paracetamol,
        unitPrice: 95,
        originalPrice: 100,
        qty: 1,
        freeShipping: true,
        discountPct: 40,
      },
      {
        id: "2",
        name: "ยาพาราเซตามอล 1000 mg แก้ปวดได้ดีที่เดียวนะkmkmkmkmksma",
        image: paracetamol,
        variant: "ตัวเลือก",
        unitPrice: 95,
        originalPrice: 100,
        qty: 1,
        freeShipping: true,
        discountPct: 40,
        shopDiscountPct: 30,
      },
    ],
    shippingNote: { freeShipOver: 100, eta: "1 เม.ย. - 3 เม.ย." },
    coupon: "โค้ดส่วนลดวันสงกรานต์",
  },
  {
    id: "ggg",
    name: "GGG.Store",
    items: [
      {
        id: "3",
        name: "ยาพาราเซตามอล 1000 mg แก้ปวดได้ดีที่เดียวนะkmkmkmkmksma",
        image: paracetamol,
        unitPrice: 95,
        originalPrice: 100,
        qty: 1,
        freeShipping: true,
        discountPct: 40,
      },
    ],
    shippingNote: { eta: "1 เม.ย. - 3 เม.ย." },
    coupon: "โค้ดส่วนลดวันสงกรานต์",
  },
];

function BrightifyLogo({ size = 36 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center shrink-0 rounded-lg shadow-[0_2px_4px_rgba(4,133,247,0.3)]"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #21bdff 0%, #0485f7 50%, #036ac6 100%)",
      }}
    >
      <span className="font-extrabold text-white leading-none" style={{ fontSize: size * 0.62 }}>
        B
      </span>
    </div>
  );
}

function SlimHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[var(--color-neutral-300)] h-[72px]">
      <div className="max-w-[1200px] h-full mx-auto flex items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <BrightifyLogo size={36} />
          <span className="text-[24px] font-medium text-[var(--color-primary)] leading-none">
            BRIGHTIFY
          </span>
        </Link>
        <span className="hidden md:block w-px h-6 bg-[var(--color-neutral-300)]" />
        <h1 className="hidden md:block text-[20px] font-semibold text-[var(--color-neutral-900)]">
          ตะกร้าสินค้า
        </h1>
        <div className="ml-auto flex items-center gap-4">
          <LanguageSelect />
          <span className="hidden sm:block w-px h-5 bg-[var(--color-neutral-300)]" />
          <HelpSelect className="hidden sm:flex" />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

function QtyStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="inline-flex items-center bg-[var(--color-neutral-200)] rounded-md">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-8 h-8 flex items-center justify-center text-[var(--color-neutral-700)] hover:text-[var(--color-primary)]"
        aria-label="ลด"
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-[14px] font-medium text-[var(--color-neutral-900)] tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 flex items-center justify-center text-[var(--color-neutral-700)] hover:text-[var(--color-primary)]"
        aria-label="เพิ่ม"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

const baht = (n: number) =>
  `฿${n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const MOCK_VARIANT_OPTIONS = [
  "ตัวเลือก 1",
  "ตัวเลือก 2",
  "ตัวเลือก 3",
  "ตัวเลือก 4",
];

function VariantDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          "inline-flex items-center gap-1 px-3 h-8 rounded-md text-[13px] transition-colors",
          open
            ? "bg-[var(--color-primary-100)] text-[var(--color-primary)]"
            : "text-[var(--color-neutral-700)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-100)]",
        ].join(" ")}
      >
        {value}
        <ChevronDown
          size={14}
          className={[
            "transition-transform",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="animate-dropdown absolute left-1/2 -translate-x-1/2 top-[calc(100%+6px)] w-[160px] z-30 bg-white rounded-xl p-1 flex flex-col shadow-[0_0_1px_rgba(29,33,45,0.2),0_1px_4px_rgba(29,33,45,0.15),0_16px_32px_rgba(29,33,45,0.1)]"
        >
          {MOCK_VARIANT_OPTIONS.map((opt) => {
            const selected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={[
                  "w-full text-left px-3 py-1.5 rounded text-[13px] leading-6 transition-colors",
                  selected
                    ? "bg-[var(--color-primary-100)] text-[var(--color-primary)] font-medium"
                    : "text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                ].join(" ")}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Cart() {
  const [shops, setShops] = useState<Shop[]>(INITIAL_SHOPS);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(INITIAL_SHOPS.flatMap((s) => s.items.map((i) => i.id)))
  );
  const navigate = useNavigate();

  const allIds = useMemo(
    () => shops.flatMap((s) => s.items.map((i) => i.id)),
    [shops]
  );
  const allSelected = allIds.length > 0 && selected.size === allIds.length;

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(allIds));

  const toggleShop = (shop: Shop) => {
    const ids = shop.items.map((i) => i.id);
    const allOn = ids.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOn) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  };

  const toggleItem = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const updateQty = (id: string, qty: number) =>
    setShops((prev) =>
      prev.map((s) => ({
        ...s,
        items: s.items.map((it) => (it.id === id ? { ...it, qty } : it)),
      }))
    );

  const updateVariant = (id: string, variant: string) =>
    setShops((prev) =>
      prev.map((s) => ({
        ...s,
        items: s.items.map((it) => (it.id === id ? { ...it, variant } : it)),
      }))
    );

  const removeItem = (id: string) => {
    setShops((prev) =>
      prev
        .map((s) => ({ ...s, items: s.items.filter((it) => it.id !== id) }))
        .filter((s) => s.items.length > 0)
    );
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const selectedItems = shops
    .flatMap((s) => s.items)
    .filter((i) => selected.has(i.id));
  const subtotal = selectedItems.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  const discount = selectedItems.reduce(
    (sum, i) => sum + (i.originalPrice ? Math.max(0, i.originalPrice - i.unitPrice) : 0) * i.qty,
    0
  );
  const total = subtotal;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <SlimHeader />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 pb-32 space-y-3">
        {/* Column header */}
        <div className="bg-white rounded-xl border border-[var(--color-neutral-300)] px-4 py-3 grid grid-cols-[24px_1fr_120px_120px_120px_140px_60px] items-center gap-4 text-[13px] text-[var(--color-neutral-700)]">
          <Checkbox
            size="sm"
            isSelected={allSelected}
            onValueChange={toggleAll}
            aria-label="เลือกสินค้าทั้งหมด"
            classNames={{ wrapper: "before:rounded after:rounded mr-0", base: "m-0 p-0" }}
          />
          <span>เลือกสินค้าทั้งหมด</span>
          <span className="text-center">ตัวเลือก</span>
          <span className="text-center">จำนวน</span>
          <span className="text-center">ราคาต่อชิ้น</span>
          <span className="text-center">ราคารวมทั้งหมด</span>
          <span className="text-center">ลบสินค้า</span>
        </div>

        {/* Shop sections */}
        {shops.map((shop) => {
          const shopAllOn = shop.items.every((i) => selected.has(i.id));
          return (
            <section
              key={shop.id}
              className="bg-white rounded-xl border border-[var(--color-neutral-300)] overflow-hidden"
            >
              {/* Shop header */}
              <div className="px-4 py-3 flex items-center gap-3 border-b border-[var(--color-neutral-300)]">
                <Checkbox
                  size="sm"
                  isSelected={shopAllOn}
                  onValueChange={() => toggleShop(shop)}
                  aria-label={`เลือก ${shop.name}`}
                  classNames={{ wrapper: "before:rounded after:rounded mr-0", base: "m-0 p-0" }}
                />
                <Link
                  to={`/store/${shop.id}`}
                  className="text-[15px] font-semibold text-[var(--color-neutral-900)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {shop.name}
                </Link>
                <Link
                  to={`/store/${shop.id}`}
                  aria-label={`ไปที่ร้าน ${shop.name}`}
                  className="ml-auto inline-flex items-center gap-1 h-8 px-2 rounded-md text-[13px] font-medium text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-100)] transition-colors"
                >
                  <span>ไปที่ร้านค้า</span>
                  <ChevronRight size={18} />
                </Link>
              </div>

              {/* Items */}
              {shop.items.map((it) => {
                const lineTotal = it.unitPrice * it.qty;
                return (
                  <div
                    key={it.id}
                    className="px-4 py-4 grid grid-cols-[24px_1fr_120px_120px_120px_140px_60px] items-center gap-4"
                  >
                    <Checkbox
                      size="sm"
                      isSelected={selected.has(it.id)}
                      onValueChange={() => toggleItem(it.id)}
                      aria-label={it.name}
                      classNames={{ wrapper: "before:rounded after:rounded mr-0", base: "m-0 p-0" }}
                    />

                    {/* Image + name + badges */}
                    <div className="min-w-0">
                      <CartItemRow
                        multiline
                        item={{
                          name: it.name,
                          image: it.image,
                          badges: [
                            ...(it.freeShipping ? [{ kind: "free-shipping" } as const] : []),
                            ...(it.discountPct !== undefined
                              ? [{ kind: "discount", percent: it.discountPct } as const]
                              : []),
                            ...(it.shopDiscountPct !== undefined
                              ? [{ kind: "shop-discount", percent: it.shopDiscountPct } as const]
                              : []),
                          ],
                        }}
                      />
                    </div>

                    {/* Variant dropdown */}
                    <div className="flex justify-center">
                      {it.variant ? (
                        <VariantDropdown
                          value={it.variant}
                          onChange={(v) => updateVariant(it.id, v)}
                        />
                      ) : (
                        <span className="text-[13px] text-[var(--color-neutral-500)]">
                          –
                        </span>
                      )}
                    </div>

                    {/* Qty */}
                    <div className="flex justify-center">
                      <QtyStepper
                        value={it.qty}
                        onChange={(n) => updateQty(it.id, n)}
                      />
                    </div>

                    {/* Unit price */}
                    <div className="text-center text-[14px] text-[var(--color-neutral-900)] tabular-nums">
                      {baht(it.unitPrice)}
                    </div>

                    {/* Line total (highlighted) */}
                    <div className="text-center text-[14px] font-semibold text-[var(--color-primary)] tabular-nums">
                      {baht(lineTotal)}
                    </div>

                    {/* Delete */}
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => removeItem(it.id)}
                        className="w-8 h-8 rounded-md text-[var(--color-neutral-500)] hover:text-[var(--color-critical)] hover:bg-[var(--color-critical)]/10 flex items-center justify-center transition"
                        aria-label="ลบสินค้า"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Shipping note */}
              {shop.shippingNote && (
                <div className="px-4 py-2.5 border-t border-[var(--color-neutral-300)] flex items-center gap-3 text-[13px]">
                  <span className="flex items-center gap-2 text-[var(--color-positive-700)]">
                    <Truck size={16} />
                    {shop.shippingNote.freeShipOver
                      ? `จัดส่งฟรี เมื่อซื้อครบ ${shop.shippingNote.freeShipOver} บาท`
                      : "จัดส่งฟรี"}
                  </span>
                  <span className="text-[var(--color-neutral-700)]">
                    จะได้รับสินค้าภายใน วันที่ {shop.shippingNote.eta}
                  </span>
                </div>
              )}

              {/* Coupon */}
              {shop.coupon && (
                <div className="px-4 py-2.5 border-t border-[var(--color-neutral-300)] flex items-center gap-3 text-[13px]">
                  <span className="flex items-center gap-2 text-[var(--color-critical)]">
                    <Ticket size={16} />
                    {shop.coupon}
                  </span>
                  <button className="text-[var(--color-primary)] hover:underline">
                    ดูเงื่อนไขเพิ่มเติม
                  </button>
                </div>
              )}
            </section>
          );
        })}

        {shops.length === 0 && (
          <div className="bg-white rounded-xl border border-[var(--color-neutral-300)] py-16 text-center">
            <p className="text-[15px] font-medium text-[var(--color-neutral-900)]">
              ตะกร้าของคุณว่างเปล่า
            </p>
            <p className="mt-1 text-[13px] text-[var(--color-neutral-500)]">
              กลับไปเลือกสินค้าเพิ่มเติม
            </p>
            <Link
              to="/products"
              className="inline-flex mt-4 h-10 px-5 items-center rounded-md bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
            >
              เลือกสินค้า
            </Link>
          </div>
        )}
      </main>

      {/* Fixed checkout footer */}
      <div className="fixed bottom-0 inset-x-0 z-30 px-4 sm:px-6 pointer-events-none">
        <div
          className="max-w-[1200px] mx-auto bg-[var(--color-primary)] border-l border-r border-t border-[var(--color-neutral-300)] rounded-tl-[32px] rounded-tr-[32px] pt-6 pb-8 px-8 flex items-center gap-10 pointer-events-auto"
          style={{ filter: "drop-shadow(0 0 4px #68b6fa)" }}
        >
          <div className="flex flex-1 items-center gap-2.5 min-w-0 text-white">
            <div className="flex flex-col gap-3 w-[200px] shrink-0">
              <p className="text-[20px] font-semibold leading-4">
                มูลค่าสินค้าทั้งหมด
              </p>
              <p className="text-[14px] leading-4">
                เลือกสินค้าทั้งหมด {selectedItems.length} รายการ
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-1 min-w-0 text-right">
              <p className="text-[20px] font-semibold leading-4 tabular-nums">
                {baht(total)}
              </p>
              <p className="text-[14px] leading-4">
                ส่วนลด ฿{discount.toLocaleString()}
              </p>
            </div>
          </div>

          <span className="w-px h-12 bg-white/40" />

          <button
            type="button"
            onClick={() => navigate("/checkout")}
            disabled={selectedItems.length === 0}
            className="flex-1 px-4 py-3 rounded-lg bg-white text-[var(--color-primary)] text-[16px] font-semibold tracking-[-0.011em] shadow-[0_2px_4px_1px_var(--color-primary-600)] hover:brightness-95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ดำเนินการชำระเงิน
          </button>
        </div>
      </div>
    </div>
  );
}
