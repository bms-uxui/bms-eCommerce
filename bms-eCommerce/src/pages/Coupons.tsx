import { useState } from "react";
import { Clock } from "lucide-react";
import ProfilePageShell from "../components/landing/ProfilePageShell";
import bmsLogo from "../assets/checkout/bms-member.png";

type CouponCategory = "brightify" | "shop" | "freeship";
type CouponStatus = "active" | "used" | "expired";
type TabKey = "all" | CouponCategory | "used" | "expired";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "brightify", label: "ส่วนลด Brightify" },
  { key: "shop", label: "ส่วนลดของร้านค้า" },
  { key: "freeship", label: "ส่งฟรี" },
  { key: "used", label: "ใช้แล้ว" },
  { key: "expired", label: "หมดอายุ" },
];

type Coupon = {
  id: string;
  category: CouponCategory;
  status: CouponStatus;
  stub: { label?: string; sub: string; color: string; logo?: string };
  title: string;
  minSpend: string;
  tag?: string;
  validity: string;
};

const COUPONS: Coupon[] = [
  { id: "1", category: "brightify", status: "active", stub: { label: "MH", sub: "โค้ดส่วนลด", color: "#0485f7" }, title: "ส่วนลด ฿30", minSpend: "ขั้นต่ำ ฿150", tag: "ทุกร้านค้า", validity: "ใช้ได้ถึง: 25.03.2026" },
  { id: "2", category: "freeship", status: "active", stub: { label: "FREE", sub: "โค้ดส่งฟรี", color: "#1da33b" }, title: "ส่งฟรี", minSpend: "ขั้นต่ำ ฿0", tag: "ส่งด่วน", validity: "ใช้ได้ในอีก: 1 วัน" },
  { id: "3", category: "freeship", status: "active", stub: { label: "FREE", sub: "โค้ดส่งฟรี", color: "#1da33b" }, title: "ส่งฟรี", minSpend: "ขั้นต่ำ ฿0", tag: "ส่งด่วน", validity: "ใช้ได้ในอีก: 1 วัน" },
  { id: "4", category: "freeship", status: "active", stub: { label: "FREE", sub: "โค้ดส่งฟรี", color: "#1da33b" }, title: "ส่งฟรี", minSpend: "ขั้นต่ำ ฿0", tag: "ส่งด่วน", validity: "ใช้ได้ในอีก: 12 ชั่วโมง" },
  { id: "5", category: "shop", status: "active", stub: { label: "MH", sub: "โค้ดส่วนลด", color: "#0485f7" }, title: "ส่วนลด 27% ลดสูงสุด ฿1,000", minSpend: "ขั้นต่ำ ฿500", validity: "ใช้ได้ตั้งแต่: 24.03.2026" },
  { id: "6", category: "shop", status: "active", stub: { label: "MH", sub: "โค้ดส่วนลด", color: "#0485f7" }, title: "ส่วนลด 23% ลดสูงสุด ฿1,000", minSpend: "ขั้นต่ำ ฿500", validity: "ใช้ได้ตั้งแต่: 24.03.2026" },
  { id: "7", category: "shop", status: "expired", stub: { label: "MH", sub: "โค้ดส่วนลด", color: "#0485f7" }, title: "ส่วนลด 27% ลดสูงสุด ฿1,000", minSpend: "ขั้นต่ำ ฿500", validity: "ใช้ได้ตั้งแต่: 24.03.2026" },
  { id: "8", category: "brightify", status: "expired", stub: { label: "VIP", sub: "โค้ดส่วนลด", color: "#7c3aed" }, title: "ส่วนลด 50% ลดสูงสุด ฿100", minSpend: "ขั้นต่ำ ฿199", validity: "ใช้ได้ในอีก: 1 วัน" },
  { id: "9", category: "shop", status: "expired", stub: { sub: "BMS.shop", color: "#036ac6", logo: bmsLogo }, title: "ส่วนลด 17% ลดสูงสุด ฿3,000", minSpend: "ขั้นต่ำ ฿200", validity: "ใช้ได้ตั้งแต่: 24.03.2026" },
  { id: "10", category: "freeship", status: "expired", stub: { label: "FREE", sub: "โค้ดส่งฟรี", color: "#1da33b" }, title: "ส่งฟรี", minSpend: "ขั้นต่ำ ฿0", tag: "ส่งด่วน", validity: "ใช้ได้ในอีก: 1 วัน" },
  { id: "11", category: "brightify", status: "used", stub: { label: "MH", sub: "โค้ดส่วนลด", color: "#0485f7" }, title: "ส่วนลด ฿20", minSpend: "ขั้นต่ำ ฿100", tag: "ทุกร้านค้า", validity: "ใช้ได้ถึง: 14.03.2026" },
  { id: "12", category: "freeship", status: "used", stub: { label: "FREE", sub: "โค้ดส่งฟรี", color: "#1da33b" }, title: "ส่งฟรี", minSpend: "ขั้นต่ำ ฿0", tag: "ส่งด่วน", validity: "ใช้ได้ถึง: 10.03.2026" },
];

function CouponCard({ coupon }: { coupon: Coupon }) {
  const muted = coupon.status !== "active";
  return (
    <div
      className={`bg-white border-[0.5px] border-[#e8e8e8] rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.08)] overflow-hidden flex items-stretch ${muted ? "opacity-70" : ""}`}
    >
      {/* Colored stub */}
      <div
        className="relative w-[100px] shrink-0 flex flex-col items-center justify-center gap-1 text-white"
        style={{ backgroundColor: coupon.stub.color }}
      >
        {coupon.stub.logo ? (
          <img
            src={coupon.stub.logo}
            alt=""
            className="w-14 h-14 rounded-full object-contain bg-white p-1"
          />
        ) : (
          <span className="text-[22px] font-bold leading-none">
            {coupon.stub.label}
          </span>
        )}
        <span className="text-[10px]">{coupon.stub.sub}</span>
        {/* perforated notch circles on the right edge */}
        <span className="absolute right-[-6px] top-[18px] w-3 h-3 rounded-full bg-[var(--color-neutral-100)]" />
        <span className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--color-neutral-100)]" />
        <span className="absolute right-[-6px] bottom-[18px] w-3 h-3 rounded-full bg-[var(--color-neutral-100)]" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-col gap-1.5 min-w-0">
          <p className="text-[14px] font-medium text-[#222] truncate">
            {coupon.title}
          </p>
          <p className="text-[12px] text-[#757575]">{coupon.minSpend}</p>
          {coupon.tag && (
            <span className="w-fit px-2 py-0.5 rounded border-[0.5px] border-[#0485f7] text-[10px] text-[#0485f7]">
              {coupon.tag}
            </span>
          )}
          <div className="flex items-center gap-2 text-[11px] text-[#999]">
            <Clock size={12} className="shrink-0" />
            <span>{coupon.validity}</span>
            <button
              type="button"
              className="text-[#0485f7] hover:underline"
            >
              เงื่อนไข
            </button>
          </div>
        </div>
        <div className="shrink-0">
          {coupon.status === "active" ? (
            <button
              type="button"
              className="px-4 py-1.5 rounded border border-[#0485f7] text-[13px] font-medium text-[#0485f7] hover:bg-[#0485f7]/5 transition whitespace-nowrap"
            >
              ใช้งาน
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="px-4 py-1.5 rounded border border-[var(--color-neutral-300)] text-[13px] font-medium text-[var(--color-neutral-500)] bg-[var(--color-neutral-100)] cursor-not-allowed whitespace-nowrap"
            >
              {coupon.status === "used" ? "ใช้แล้ว" : "หมดอายุแล้ว"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Coupons() {
  const [active, setActive] = useState<TabKey>("all");

  const visible = COUPONS.filter((c) => {
    if (active === "all") return true;
    if (active === "used") return c.status === "used";
    if (active === "expired") return c.status === "expired";
    return c.category === active;
  });
  const allCount = COUPONS.filter((c) => c.status === "active").length;

  return (
    <ProfilePageShell activeKey="coupons">
      <div
        className="page-section-in bg-white rounded-2xl border border-[var(--color-neutral-300)] flex flex-col overflow-hidden"
        style={{ animationDelay: "200ms" }}
      >
        {/* Tab strip */}
        <div className="px-2 py-2 border-b border-[var(--color-neutral-300)]">
          <div className="bg-[var(--color-neutral-200)] rounded-lg p-1 flex h-10 overflow-x-auto scrollbar-none">
            {TABS.map((tab) => {
              const isActive = active === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActive(tab.key)}
                  className={[
                    "shrink-0 flex items-center justify-center gap-2 h-8 px-4 py-1 rounded text-[14px] font-medium tracking-[-0.006em] transition",
                    isActive
                      ? "bg-[var(--color-primary)] text-white shadow-[0_0_1px_0_rgba(29,33,45,0.2),0_0_2px_0_rgba(29,33,45,0.08),0_2px_4px_0_rgba(29,33,45,0.08)]"
                      : "text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)]",
                  ].join(" ")}
                >
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.key === "all" && allCount > 0 && (
                    <span className="min-w-5 h-5 px-1 rounded-full bg-[var(--color-critical)] text-white text-[12px] flex items-center justify-center">
                      {allCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Coupon grid */}
        <div className="p-4 sm:p-6">
          {visible.length === 0 ? (
            <div className="py-16 text-center text-[14px] text-[var(--color-neutral-500)]">
              ไม่มีคูปอง
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {visible.map((c) => (
                <CouponCard key={c.id} coupon={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProfilePageShell>
  );
}
