import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Store,
  MessageCircle,
  MapPin,
  Users,
  CalendarHeart,
  CheckCircle2,
  Package,
} from "lucide-react";
import CartIcon from "../components/CartIcon";
import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";
import ProductCard, { type Product } from "../components/landing/ProductCard";
import ProductDetailHero from "../components/landing/ProductDetailHero";
import SectionHeader from "../components/landing/SectionHeader";
import { makeProducts } from "../components/landing/mockData";
import paracetamol from "../assets/products/p02-paracetamol.jpg";
import avatar from "../assets/store-avatar.png";


// ---------- Shop card ----------
function InfoChip({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-2 text-[13px] text-[var(--color-neutral-700)]">
      <Icon size={16} className="text-[var(--color-neutral-500)] shrink-0" />
      {children}
    </span>
  );
}

export function ShopCard() {
  return (
    <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 flex gap-4 items-start">
      <img
        src={avatar}
        alt="BMS.shop"
        className="w-[54px] h-[54px] rounded-full object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-[16px] font-semibold text-[var(--color-neutral-900)]">
            BMS.shop
          </h3>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary)] text-[11px] font-medium">
            <CheckCircle2 size={12} />
            ยืนยันแล้ว
          </span>
          <span className="ml-auto flex items-center gap-2">
            <Link
              to="/store/bms-shop"
              className="h-8 px-3 rounded-md border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium flex items-center gap-1.5 hover:bg-[var(--color-primary-100)] transition"
            >
              <Store size={16} />
              ดูร้านค้า
            </Link>
            <button className="h-8 px-3 rounded-md border border-[var(--color-neutral-300)] text-[var(--color-neutral-700)] text-[13px] font-medium flex items-center gap-1.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition">
              <MessageCircle size={16} />
              แชท
            </button>
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 text-[12px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-positive-700)]" />
          <span className="text-[var(--color-neutral-600)]">ออนไลน์</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 mt-4">
          <InfoChip icon={MapPin}>เชียงราย</InfoChip>
          <InfoChip icon={MessageCircle}>ตอบกลับ 96%</InfoChip>
          <InfoChip icon={Star}>4.5 คะแนน (ผู้รีวิว 2.3k)</InfoChip>
          <InfoChip icon={Package}>สินค้า 37 รายการ</InfoChip>
          <InfoChip icon={CalendarHeart}>เข้าร่วม กุมภาพันธ์ 2567</InfoChip>
          <InfoChip icon={MessageCircle}>ภายใน 10 นาที</InfoChip>
          <InfoChip icon={Users}>ผู้ติดตาม 2,589 คน</InfoChip>
          <InfoChip icon={CartIcon}>ขายแล้ว 10,453+</InfoChip>
        </div>
      </div>
    </section>
  );
}

// ---------- Details + specs ----------
export function DetailsCard() {
  return (
    <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 lg:p-6">
      <h2 className="text-[18px] font-semibold text-[var(--color-neutral-900)] mb-2">
        รายละเอียดผลิตภัณฑ์
      </h2>
      <p className="text-[14px] text-[var(--color-neutral-700)] leading-relaxed">
        สัมผัสรสละมุนของชาออร์แกนิกแท้ 100% จากยอดเขาบรรทัด ปลูกด้วยใจรัก ปราศจากสารเคมีปรุงแต่ง เพื่อสุขภาพที่ดีของคุณ
      </p>

      <hr className="my-6 border-t border-[var(--color-neutral-300)]" />

      <h3 className="text-[18px] font-semibold text-[var(--color-neutral-900)] mb-4">
        ข้อมูลจำเพาะ
      </h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-12 text-[14px]">
        {[
          ["น้ำหนักสุทธิ :", "50 กรัม"],
          ["ประเภท :", "ชาสมุนไพร"],
          ["รหัส SKU :", "MH-ORG-TEA-2024"],
          ["รูปแบบ :", "ใบชาอบแห้ง"],
        ].map(([k, v]) => (
          <div key={k} className="flex gap-3">
            <dt className="w-[88px] text-[var(--color-neutral-600)] shrink-0">
              {k}
            </dt>
            <dd className="text-[var(--color-neutral-900)]">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// ---------- Reviews ----------
const REVIEW_FILTERS = [
  "ทั้งหมด",
  "5 ดาว",
  "4 ดาว",
  "3 ดาว",
  "2 ดาว",
  "1 ดาว",
  "มีรูปภาพ (54)",
  "มีคำติชม (32)",
];

function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < n
              ? "fill-[#FFB800] text-[#FFB800]"
              : "fill-[var(--color-neutral-300)] text-[var(--color-neutral-300)]"
          }
        />
      ))}
    </span>
  );
}

function ReviewCard({ withPhotos = true }: { withPhotos?: boolean }) {
  return (
    <article className="border-t border-[var(--color-neutral-300)] py-4 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary)] font-semibold flex items-center justify-center">
          ส
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-medium text-[var(--color-neutral-900)]">
            สมชาย ใจดี
          </p>
          <div className="flex items-center gap-2 text-[12px] text-[var(--color-neutral-500)]">
            <Stars n={5} size={12} />
            <span>15 มี.ค. 2024 - 19:20 น.</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[14px] text-[var(--color-neutral-800)]">
        สินค้าดีมากครับ รสชาติเยี่ยม ส่งไวมาก บรรจุภัณฑ์สวย
      </p>
      {withPhotos && (
        <div className="flex gap-2 mt-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <img
              key={i}
              src={paracetamol}
              alt=""
              className="w-12 h-12 rounded-md object-cover"
            />
          ))}
        </div>
      )}
    </article>
  );
}

export function ReviewsCard() {
  const [filter, setFilter] = useState(REVIEW_FILTERS[0]);
  return (
    <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 lg:p-6">
      <h2 className="text-[18px] font-semibold text-[var(--color-neutral-900)] mb-4">
        รีวิวสินค้า
      </h2>

      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
        <div className="shrink-0">
          <div className="flex items-end gap-1">
            <span className="text-[28px] font-bold text-[var(--color-neutral-900)] leading-none">
              4.8
            </span>
            <span className="text-[12px] text-[var(--color-neutral-500)] pb-1">
              เต็ม 5
            </span>
          </div>
          <div className="mt-1.5">
            <Stars n={5} size={16} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {REVIEW_FILTERS.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={[
                  "h-8 px-3 rounded-md border text-[13px] transition-colors",
                  active
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-100)] text-[var(--color-primary)]"
                    : "border-[var(--color-neutral-300)] text-[var(--color-neutral-700)] hover:border-[var(--color-primary)]",
                ].join(" ")}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-col">
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
        <ReviewCard withPhotos={false} />
      </div>

      <ReviewsPagination />
    </section>
  );
}

function ReviewsPagination() {
  const [p, setP] = useState(1);
  const total = 7;
  const arrowCls =
    "w-8 h-8 flex items-center justify-center rounded-md border border-[var(--color-neutral-300)] text-[var(--color-neutral-600)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors";
  const pages = useMemo(() => {
    const r: (number | "…")[] = [];
    if (total <= 7) for (let i = 1; i <= total; i++) r.push(i);
    else {
      r.push(1);
      const s = Math.max(2, p - 1);
      const e = Math.min(total - 1, p + 1);
      if (s > 2) r.push("…");
      for (let i = s; i <= e; i++) r.push(i);
      if (e < total - 1) r.push("…");
      r.push(total);
    }
    return r;
  }, [p, total]);
  return (
    <nav className="mt-6 flex items-center justify-center gap-1.5">
      <button
        onClick={() => setP(Math.max(1, p - 1))}
        disabled={p === 1}
        className={arrowCls}
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((x, i) =>
        x === "…" ? (
          <span key={`e-${i}`} className="w-6 h-8 flex items-center justify-center text-[13px] text-[var(--color-neutral-500)]">
            …
          </span>
        ) : (
          <button
            key={x}
            onClick={() => setP(x)}
            className={[
              "min-w-[32px] h-8 px-2 rounded-md text-[13px] font-medium transition-colors",
              x === p
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
            ].join(" ")}
          >
            {x}
          </button>
        )
      )}
      <button
        onClick={() => setP(Math.min(total, p + 1))}
        disabled={p === total}
        className={arrowCls}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

// ---------- Carousels ----------
function ProductRow({ title, products }: { title: string; products: Product[] }) {
  return (
    <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 lg:p-6">
      <SectionHeader title={title} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

// ---------- Page ----------
export default function ProductDetail() {
  useParams<{ id: string }>();
  const shopProducts = useMemo(() => makeProducts(6), []);
  const recommended = useMemo(() => makeProducts(6), []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />

      <main className="max-w-[1240px] mx-auto px-3 sm:px-4 lg:px-5 pb-12 mt-4 space-y-3">
        <nav
          className="page-section-in flex items-center gap-1.5 text-[13px] text-[var(--color-neutral-600)]"
          style={{ animationDelay: "60ms" }}
        >
          <Link to="/" className="hover:text-[var(--color-primary)] transition-colors">
            หน้าแรก
          </Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-[var(--color-primary)] transition-colors">
            สินค้าทั้งหมด
          </Link>
          <ChevronRight size={12} />
          <span className="text-[var(--color-neutral-900)] font-medium truncate">
            ยาพาราเซตามอล 1000 mg
          </span>
        </nav>

        <div className="page-section-in" style={{ animationDelay: "120ms" }}>
          <ProductDetailHero
            product={{
              name: "ยาพาราเซตามอล 1000 mg แก้ปวดได้ดีทีเดียวนะ",
              rating: 4.6,
              sold: "3 ชิ้น",
              reviews: "1k",
              price: 0,
              originalPrice: 0,
              discount: 40,
              flashSale: true,
              countdown: { hh: "12", mm: "13", ss: "08" },
              shipping: { eta: "วันที่ 1 เม.ย. - 3 เม.ย.", freeShipping: true },
              sizes: ["ไซส์ SS", "ไซส์ S", "ไซส์ M", "ไซส์ L", "ไซส์ XL"],
              variants: ["ตัวเลือก 1", "ตัวเลือก 2", "ตัวเลือก 3", "ตัวเลือก 4", "ตัวเลือก 5"],
              stock: 10,
              likes: 100,
              gallery: Array.from({ length: 10 }, () => paracetamol),
              isMedical: true,
            }}
          />
        </div>
        <div className="page-section-in" style={{ animationDelay: "180ms" }}>
          <ShopCard />
        </div>
        <div className="page-section-in" style={{ animationDelay: "240ms" }}>
          <DetailsCard />
        </div>
        <div className="page-section-in" style={{ animationDelay: "300ms" }}>
          <ReviewsCard />
        </div>
        <div className="page-section-in" style={{ animationDelay: "360ms" }}>
          <ProductRow title="สินค้าภายในร้าน" products={shopProducts} />
        </div>
        <div className="page-section-in" style={{ animationDelay: "420ms" }}>
          <ProductRow title="สินค้าแนะนำ" products={recommended} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
