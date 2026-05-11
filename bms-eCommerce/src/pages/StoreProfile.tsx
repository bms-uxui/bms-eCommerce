import { useMemo, useState } from "react";
import {
  CalendarHeart,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Package,
  Plus,
  ShoppingBag,
  Star,
  Users,
  Clock,
} from "lucide-react";
import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";
import ProductCard from "../components/landing/ProductCard";
import { makeProducts } from "../components/landing/mockData";
import storeAvatar from "../assets/store-avatar.png";

export const TABS = ["ทั้งหมด", "สินค้าแนะนำ", "ใหม่ล่าสุด"] as const;
export type Tab = (typeof TABS)[number];

function InfoChip({
  icon: Icon,
  children,
}: {
  icon: typeof MapPin;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-2 text-[13px] text-[var(--color-neutral-700)]">
      <Icon size={16} className="text-[var(--color-neutral-500)] shrink-0" />
      {children}
    </span>
  );
}

export function StoreHero() {
  return (
    <section className="relative">
      {/* Banner */}
      <div
        className="h-[250px] w-full"
        style={{
          background:
            "linear-gradient(135deg, #5dd6f0 0%, #21bdff 30%, #0485f7 60%, #f0c674 100%)",
        }}
      />

      {/* Info card overlapping banner */}
      <div className="max-w-[1240px] mx-auto px-3 sm:px-4 lg:px-5 -mt-[152px] relative z-10">
        <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(2,77,143,0.12)] p-6 flex gap-6 items-start">
          {/* Avatar + badge */}
          <div className="shrink-0 flex flex-col items-center -mt-12">
            <img
              src={storeAvatar}
              alt="BMS.shop"
              className="w-[90px] h-[90px] rounded-full object-cover ring-4 ring-white"
            />
            <span className="-mt-2 px-2 py-0.5 rounded-md bg-[var(--color-primary)] text-white text-[12px] font-medium whitespace-nowrap">
              ร้านค้าแนะนำ
            </span>
          </div>

          {/* Right column */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[20px] font-bold text-[var(--color-neutral-900)]">
                BMS.shop
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary)] text-[12px] font-medium">
                <CheckCircle2 size={14} />
                ยืนยันตัวตนแล้ว
              </span>
              <span className="ml-auto flex items-center gap-2">
                <button className="h-8 px-3 rounded-md bg-[var(--color-primary)] text-white text-[13px] font-medium flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition">
                  <Plus size={16} />
                  ติดตาม
                </button>
                <button className="h-8 px-3 rounded-md border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium flex items-center gap-1.5 hover:bg-[var(--color-primary-100)] transition">
                  <MessageCircle size={16} />
                  แชท
                </button>
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-1.5 text-[12px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-positive-700)]" />
              <span className="text-[var(--color-neutral-600)]">ออนไลน์</span>
            </div>

            <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-neutral-700)]">
              BMS-HOSxP เป็นโปรแกรมบริหารจัดการโรงพยาบาลและสถานพยาบาล (Hospital
              Information System - HIS) พัฒนาโดยบริษัท บางกอก เมดิคอล ซอฟต์แวร์
              จำกัด ใช้สำหรับจัดการข้อมูลผู้ป่วย งานนัดหมาย และการเงิน มีทั้งรุ่น{" "}
              <a className="text-[var(--color-primary)] underline" href="#">
                HOSxP V3
              </a>{" "}
              และ{" "}
              <a className="text-[var(--color-primary)] underline" href="#">
                HOSxP XE
              </a>{" "}
              (รุ่นใหม่) โดยรองรับการเชื่อมต่อข้อมูล OP/IP กับ สปสช. (NHSO) และเชื่อมต่อผ่านระบบคลาวด์
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 mt-5">
              <InfoChip icon={MapPin}>เชียงราย</InfoChip>
              <InfoChip icon={MessageCircle}>ตอบกลับ 96%</InfoChip>
              <InfoChip icon={Star}>4.5 คะแนน (ผู้รีวิว 2.3k)</InfoChip>
              <InfoChip icon={Package}>สินค้า 37 รายการ</InfoChip>
              <InfoChip icon={CalendarHeart}>เข้าร่วม กุมภาพันธ์ 2567</InfoChip>
              <InfoChip icon={Clock}>ภายใน 10 นาที</InfoChip>
              <InfoChip icon={Users}>ผู้ติดตาม 2,589 คน</InfoChip>
              <InfoChip icon={ShoppingBag}>ขายแล้ว 10,453+</InfoChip>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SegmentedTabs({
  value,
  onChange,
}: {
  value: Tab;
  onChange: (v: Tab) => void;
}) {
  return (
    <div className="flex border-b border-[var(--color-neutral-300)]">
      <div className="bg-[var(--color-neutral-200)] rounded-lg p-1 inline-flex gap-1">
        {TABS.map((t) => {
          const active = t === value;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={[
                "h-8 px-4 rounded-md text-[14px] font-medium transition-all",
                active
                  ? "bg-white text-[var(--color-primary)] shadow-sm"
                  : "text-[var(--color-neutral-700)] hover:text-[var(--color-primary)]",
              ].join(" ")}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function StoreProfile() {
  const [tab, setTab] = useState<Tab>("ทั้งหมด");
  const products = useMemo(() => makeProducts(30), []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />

      <StoreHero />

      <main className="max-w-[1240px] mx-auto px-3 sm:px-4 lg:px-5 pt-6 pb-12 space-y-6">
        <div
          className="page-section-in"
          style={{ animationDelay: "120ms" }}
        >
          <SegmentedTabs value={tab} onChange={setTab} />
        </div>

        <div
          className="page-section-in grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
          style={{ animationDelay: "200ms" }}
        >
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} flashSale={i % 3 === 0} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
