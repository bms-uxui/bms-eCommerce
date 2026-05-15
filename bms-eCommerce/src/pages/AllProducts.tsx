import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Checkbox, Select, SelectItem, Tooltip } from "@heroui/react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
  ListFilter,
} from "lucide-react";
import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";
import ProductCard from "../components/landing/ProductCard";
import CategoryGrid from "../components/landing/CategoryGrid";
import { makeProducts } from "../components/landing/mockData";

// ---------- Filter section ----------
function FilterSection({
  title,
  children,
  withDivider = true,
  pad = true,
}: {
  title: string;
  children: React.ReactNode;
  withDivider?: boolean;
  pad?: boolean;
}) {
  return (
    <>
      {withDivider && (
        <hr className="border-t border-[var(--color-neutral-300)] my-5 w-full" />
      )}
      <div className="w-full flex flex-col gap-3.5">
        <h4 className="text-[16px] font-semibold leading-4 text-[var(--color-primary-700)]">
          {title}
        </h4>
        <div className={["flex flex-col gap-3", pad ? "pl-3" : ""].join(" ")}>
          {children}
        </div>
      </div>
    </>
  );
}

const checkboxClassNames = {
  base: "items-center gap-2 m-0 p-0 max-w-full",
  wrapper:
    "before:border-[var(--color-neutral-300)] before:rounded after:rounded after:bg-[var(--color-primary)] mr-0",
  label:
    "text-[14px] leading-4 text-[var(--color-neutral-900)] tracking-normal",
};

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Checkbox
      size="sm"
      isSelected={checked}
      onValueChange={onChange}
      classNames={checkboxClassNames}
    >
      {label}
    </Checkbox>
  );
}

const filterSelectCN = {
  trigger:
    "h-10 min-h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] shadow-none rounded-lg",
  value: "text-[14px] text-[var(--color-neutral-900)] data-[has-value=false]:text-[var(--color-neutral-500)]",
};

function FilterSelect({
  items,
  placeholder,
  selected,
  onChange,
}: {
  items: string[];
  placeholder: string;
  selected: Record<string, boolean>;
  onChange: (next: Record<string, boolean>) => void;
}) {
  const selectedKeys = items.filter((i) => selected[i]);
  return (
    <Select
      aria-label={placeholder}
      placeholder={placeholder}
      selectionMode="multiple"
      radius="sm"
      classNames={filterSelectCN}
      listboxProps={{
        itemClasses: {
          base: "data-[hover=true]:bg-[var(--color-primary-100)] data-[hover=true]:text-[var(--color-primary)] data-[focus=true]:bg-[var(--color-primary-100)] data-[focus=true]:text-[var(--color-primary)] data-[selectable=true]:focus:bg-[var(--color-primary-100)] data-[selectable=true]:focus:text-[var(--color-primary)] data-[selected=true]:text-[var(--color-primary)] data-[selected=true]:font-medium",
          selectedIcon: "text-[var(--color-primary)]",
        },
      }}
      selectedKeys={new Set(selectedKeys)}
      onSelectionChange={(keys) => {
        const set = keys === "all" ? new Set(items) : new Set(Array.from(keys as Set<React.Key>, String));
        const next = { ...selected };
        items.forEach((i) => { next[i] = set.has(i); });
        onChange(next);
      }}
    >
      {items.map((i) => (
        <SelectItem key={i}>{i}</SelectItem>
      ))}
    </Select>
  );
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center justify-between w-full" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Tooltip key={n} content={`${n} ดาว`} placement="top" size="sm" closeDelay={0}>
          <button
            type="button"
            aria-label={`${n} ดาว`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(value === n ? 0 : n)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={26}
              className={n <= shown ? "fill-[#FFB800] text-[#FFB800]" : "fill-transparent text-[var(--color-neutral-300)]"}
            />
          </button>
        </Tooltip>
      ))}
    </div>
  );
}

function PriceInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="h-10 flex items-center gap-1 rounded-lg border border-[var(--color-neutral-300)] px-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 transition-colors">
      <input
        value={value ? Number(value).toLocaleString("en-US") : ""}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        placeholder={placeholder}
        inputMode="numeric"
        className="flex-1 min-w-0 bg-transparent text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] tracking-[-0.011em] focus:outline-none"
      />
      <span className="text-[14px] text-[var(--color-neutral-500)] tracking-[-0.011em]">
        บาท
      </span>
    </div>
  );
}

const FILTERS = {
  promo: ["จัดส่งฟรี", "FLASHSALE", "ร้านค้าแนะนำ", "ร้านขายส่ง", "สินค้าพร้อมจัดส่ง"],
  shipping: ["กรุงเทพและปริมณฑล", "ภาคเหนือ", "ภาคใต้", "ภาคอีสาน", "ภาคตะวันออก"],
  condition: ["มือ 1", "มือ 2"],
  payment: ["บัตรเครดิต/เดบิต", "พร้อมเพย์", "ธนาคาร", "เก็บเงินปลายทาง"],
};

function FiltersSidebar() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [rating, setRating] = useState(0);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [open, setOpen] = useState(false);

  const toggle = (key: string) => (v: boolean) =>
    setChecked((s) => ({ ...s, [key]: v }));

  const hasActive =
    Object.values(checked).some(Boolean) || rating > 0 || !!priceMin || !!priceMax;

  const activeCount = [
    ...Object.values(checked).filter(Boolean),
    rating > 0 && true,
    !!priceMin && true,
    !!priceMax && true,
  ].filter(Boolean).length;

  const resetAll = () => {
    setChecked({});
    setRating(0);
    setPriceMin("");
    setPriceMax("");
  };

  const filterBody = (
    <>
      <FilterSection title="บริการและโปรโมชัน" pad={false}>
        <FilterSelect items={FILTERS.promo} placeholder="เลือกบริการ/โปรโมชัน" selected={checked} onChange={setChecked} />
      </FilterSection>
      <FilterSection title="พื้นที่การจัดส่ง" pad={false}>
        <FilterSelect items={FILTERS.shipping} placeholder="เลือกพื้นที่จัดส่ง" selected={checked} onChange={setChecked} />
      </FilterSection>
      <FilterSection title="ระดับดาว" pad={false}>
        <StarRating value={rating} onChange={setRating} />
      </FilterSection>
      <FilterSection title="ราคา" pad={false}>
        <div className="flex flex-col gap-3">
          <PriceInput value={priceMin} onChange={setPriceMin} placeholder="ราคาต่ำสุด" />
          <PriceInput value={priceMax} onChange={setPriceMax} placeholder="ราคาสูงสุด" />
        </div>
      </FilterSection>
      <FilterSection title="สภาพสินค้า" pad={false}>
        <CheckboxRow label="สินค้ามือหนึ่ง" checked={!!checked["สินค้ามือหนึ่ง"]} onChange={toggle("สินค้ามือหนึ่ง")} />
      </FilterSection>
      <FilterSection title="ช่องทางการชำระ" pad={false}>
        <FilterSelect items={FILTERS.payment} placeholder="เลือกช่องทางชำระ" selected={checked} onChange={setChecked} />
      </FilterSection>
    </>
  );

  return (
    <div className="w-full lg:w-[216px] shrink-0 self-start lg:sticky lg:top-[124px]">
      {/* Mobile / tablet: collapsible dropdown */}
      <div className="lg:hidden bg-white rounded-xl border border-[var(--color-neutral-300)] overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <ListFilter size={18} className="text-[var(--color-neutral-900)]" />
            <span className="text-[16px] font-bold text-[var(--color-neutral-900)]">ตัวกรอง</span>
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[11px] font-semibold">
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {hasActive && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); resetAll(); }}
                className="text-[13px] font-medium text-[var(--color-primary)] hover:underline"
              >
                ล้างทั้งหมด
              </button>
            )}
            <ChevronDown
              size={18}
              className={["text-[var(--color-neutral-600)] transition-transform duration-200", open ? "rotate-180" : ""].join(" ")}
            />
          </div>
        </button>
        {open && (
          <div className="px-4 pb-4 border-t border-[var(--color-neutral-300)]">
            {filterBody}
          </div>
        )}
      </div>

      {/* Desktop: always-visible sticky sidebar */}
      <aside className="hidden lg:block bg-white rounded-xl border border-[var(--color-neutral-300)] p-4 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-none">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ListFilter size={20} className="text-[var(--color-neutral-900)]" />
            <h3 className="text-[20px] font-bold leading-6 text-[var(--color-neutral-900)]">
              ตัวกรอง
            </h3>
          </div>
          <button
            type="button"
            onClick={resetAll}
            disabled={!hasActive}
            className="text-[13px] font-medium text-[var(--color-primary)] hover:underline disabled:text-[var(--color-neutral-400)] disabled:no-underline disabled:cursor-default"
          >
            ล้างทั้งหมด
          </button>
        </div>
        {filterBody}
      </aside>
    </div>
  );
}

// ---------- Pagination ----------
function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const pages = useMemo(() => {
    const result: (number | "…")[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) result.push(i);
    } else {
      result.push(1);
      const start = Math.max(2, page - 1);
      const end = Math.min(total - 1, page + 1);
      if (start > 2) result.push("…");
      for (let i = start; i <= end; i++) result.push(i);
      if (end < total - 1) result.push("…");
      result.push(total);
    }
    return result;
  }, [page, total]);

  const arrowCls =
    "w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[#f5f8fa] disabled:opacity-40 disabled:cursor-not-allowed transition-colors";

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous"
        className={arrowCls}
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`e-${i}`}
            className="w-8 h-8 flex items-center justify-center text-[12px] text-[var(--color-neutral-600)]"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={[
              "min-w-8 h-8 px-2 flex items-center justify-center rounded text-[12px] font-medium transition-colors",
              p === page
                ? "bg-[#dcf2fe] text-[#0e3ed0]"
                : "text-[var(--color-neutral-600)] hover:bg-[#f5f8fa]",
            ].join(" ")}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page === total}
        aria-label="Next"
        className={arrowCls}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

// ---------- Page ----------
export default function AllProducts() {
  const [page, setPage] = useState(1);
  const totalPages = 7;
  const products = useMemo(() => makeProducts(30), [page]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />

      <main className="max-w-[1240px] mx-auto px-3 sm:px-4 lg:px-5 pb-12 mt-4 space-y-3">
        {/* Breadcrumb */}
        <nav
          className="page-section-in flex items-center gap-1.5 text-[13px] text-[var(--color-neutral-600)]"
          style={{ animationDelay: "60ms" }}
        >
          <Link to="/" className="hover:text-[var(--color-primary)] transition-colors">
            หน้าแรก
          </Link>
          <ChevronRight size={12} />
          <span className="text-[var(--color-neutral-900)] font-medium">สินค้าทั้งหมด</span>
        </nav>

        {/* Category strip */}
        <div className="page-section-in" style={{ animationDelay: "120ms" }}>
          <CategoryGrid />
        </div>

        {/* Filters + Grid */}
        <div
          className="page-section-in flex flex-col lg:flex-row gap-3"
          style={{ animationDelay: "200ms" }}
        >
          <FiltersSidebar />

          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {products.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  flashSale={i % 3 === 0}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Pagination page={page} total={totalPages} onChange={setPage} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
