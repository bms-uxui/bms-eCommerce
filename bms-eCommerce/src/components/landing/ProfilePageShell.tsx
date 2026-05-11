import { useNavigate, useLocation } from "react-router";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  User as UserIcon,
  Package,
  ClipboardList,
  Crown,
  Bell,
  Tag,
  Heart,
  CreditCard,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import avatar from "../../assets/avatar.jpg";
import profileBanner from "../../assets/banners/profile-banner.png";

export type SidebarKey =
  | "account"
  | "orders"
  | "quotes"
  | "member"
  | "notifications"
  | "coupons"
  | "wishlist"
  | "payment"
  | "settings";

export type SidebarItem = {
  icon: LucideIcon;
  label: string;
  key: SidebarKey;
  path?: string;
};

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { icon: UserIcon, label: "บัญชีของฉัน", key: "account", path: "/settings" },
  { icon: Package, label: "การสั่งซื้อ", key: "orders", path: "/delivery" },
  { icon: ClipboardList, label: "ใบเสนอราคา", key: "quotes", path: "/quotation" },
  { icon: Crown, label: "BMS Member", key: "member", path: "/bms-member" },
  { icon: Bell, label: "การแจ้งเตือน", key: "notifications", path: "/notifications" },
  { icon: Tag, label: "โค้ดส่วนลด", key: "coupons", path: "/coupons" },
  { icon: Heart, label: "สิ่งที่ถูกใจ", key: "wishlist", path: "/favorites" },
  { icon: CreditCard, label: "วิธีการชำระเงิน", key: "payment", path: "/settings" },
  { icon: SettingsIcon, label: "การตั้งค่า", key: "settings", path: "/settings" },
];

function ProfileBanner({ avatarSrc }: { avatarSrc?: string }) {
  return (
    <section className="relative">
      <div className="h-[120px] sm:h-[150px] lg:h-[180px] w-full bg-[#cce7ff] overflow-hidden">
        <img
          src={profileBanner}
          alt=""
          aria-hidden
          className="w-full h-full object-cover object-bottom pointer-events-none select-none"
        />
      </div>

      <div className="max-w-[1240px] mx-auto px-3 sm:px-4 lg:px-5 relative z-10">
        <div className="relative pt-3 sm:pt-6 sm:pl-[174px]">
          <img
            src={avatarSrc ?? avatar}
            alt=""
            className="block sm:absolute mx-auto sm:mx-0 sm:left-0 -mt-[50px] sm:mt-0 sm:-top-[75px] w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] rounded-full object-cover ring-4 ring-white"
          />
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-6 pt-3 sm:pt-0 text-center sm:text-left">
            <div className="flex flex-col gap-2 sm:gap-3 min-w-0">
              <h2 className="text-[22px] sm:text-[28px] lg:text-[32px] font-semibold text-black leading-tight truncate">
                Okinowa Kawasaki
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-[14px] sm:text-[16px] text-black">
                <span className="flex items-center gap-2 sm:gap-3">
                  <span>2</span>
                  <span>ผู้ติดตาม</span>
                </span>
                <span className="w-px h-[18px] sm:h-[22px] bg-[var(--color-neutral-300)]" />
                <span className="flex items-center gap-2 sm:gap-3">
                  <span>2</span>
                  <span>กำลังติดตาม</span>
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-4 shrink-0">
              <button
                type="button"
                className="flex-1 sm:flex-none h-10 sm:h-[60px] sm:w-[200px] px-4 rounded-lg bg-white border border-[var(--color-neutral-300)] text-black text-[14px] sm:text-[16px] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-[0.98] transition shadow-sm"
              >
                Seller
              </button>
              <button
                type="button"
                className="flex-1 sm:flex-none h-10 sm:h-[60px] sm:w-[200px] px-4 rounded-lg bg-white border border-[var(--color-neutral-300)] text-black text-[14px] sm:text-[16px] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-[0.98] transition shadow-sm"
              >
                Affiliate
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProfileSidebar({
  activeKey,
  onItemClick,
}: {
  activeKey: SidebarKey;
  onItemClick?: (item: SidebarItem) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (item: SidebarItem) => {
    if (onItemClick) {
      onItemClick(item);
      return;
    }
    if (item.path && item.path !== location.pathname) {
      navigate(item.path);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("loggedIn");
    navigate("/");
  };

  return (
    <>
      {/* Mobile: horizontal scrollable pills */}
      <nav className="lg:hidden -mx-3 sm:-mx-4 px-3 sm:px-4 overflow-x-auto scrollbar-none">
        <ul className="flex gap-2 w-max pb-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => handleClick(item)}
                  className={[
                    "flex items-center gap-2 px-3 h-9 rounded-full whitespace-nowrap text-[13px] transition-colors border",
                    isActive
                      ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] font-semibold"
                      : "bg-white text-[var(--color-neutral-900)] border-[var(--color-neutral-300)] hover:border-[var(--color-primary)]",
                  ].join(" ")}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 px-3 h-9 rounded-full whitespace-nowrap text-[13px] bg-white text-[var(--color-critical)] border border-[var(--color-critical)]/40 hover:bg-[var(--color-critical)]/10 transition-colors"
            >
              <LogOut size={16} />
              ออกจากระบบ
            </button>
          </li>
        </ul>
      </nav>

      {/* Desktop: vertical sticky sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 bg-white rounded-2xl border border-[var(--color-neutral-300)] p-2 self-start sticky top-[120px]">
        <ul className="flex flex-col">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => handleClick(item)}
                  className={[
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors",
                    isActive
                      ? "bg-[var(--color-primary-100)] text-[var(--color-primary)] font-semibold"
                      : "text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                  ].join(" ")}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
        <hr className="my-2 border-t border-[var(--color-neutral-300)]" />
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-[var(--color-critical)] hover:bg-[var(--color-critical)]/10 transition-colors"
        >
          <LogOut size={18} />
          ออกจากระบบ
        </button>
      </aside>
    </>
  );
}

export default function ProfilePageShell({
  activeKey,
  onItemClick,
  children,
  avatarSrc,
}: {
  activeKey: SidebarKey;
  onItemClick?: (item: SidebarItem) => void;
  children: ReactNode;
  avatarSrc?: string;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />
      <ProfileBanner avatarSrc={avatarSrc} />
      <main className="max-w-[1240px] mx-auto px-3 sm:px-4 lg:px-5 pt-4 sm:pt-6 pb-12">
        <div className="flex flex-col lg:flex-row gap-4">
          <ProfileSidebar activeKey={activeKey} onItemClick={onItemClick} />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
