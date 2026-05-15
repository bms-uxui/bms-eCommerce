import { useState } from "react";
import { useNavigate } from "react-router";
import { Star as StarIcon, LifeBuoy, Store as StoreIcon, Menu, X as XIcon } from "lucide-react";
import Icon from "./landing/Icon";
import CartIcon from "./CartIcon";
import QuoteIcon from "./QuoteIcon";
import LanguageSelect from "./LanguageSelect";
import NotificationBell from "./NotificationBell";
import HelpSelect from "./HelpSelect";
import SellerProfile from "./SellerProfile";

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

const SELLER_NAV = [
  { id: "manage", Glyph: LifeBuoy, label: "การจัดการร้านค้า", to: "/seller/overview" },
  { id: "storefront", Glyph: StoreIcon, label: "หน้าร้านค้า", to: "/seller/shop" },
] as const;

export function SellerHeader({
  active,
  onMenuClick,
}: {
  active?: (typeof SELLER_NAV)[number]["id"];
  onMenuClick?: () => void;
}) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[var(--color-neutral-300)] px-6 py-[18px]">
      <div className="flex items-center gap-6 w-full">
        {/* Mobile: logo + hamburger only */}
        <div className="flex items-center justify-between w-full lg:hidden">
          <a href="/seller/overview" className="flex items-center gap-2 h-9 shrink-0">
            <BrightifyLogo size={36} />
            <span className="text-[24px] font-medium leading-[16.8px] text-[var(--color-primary)]">
              BRIGHTIFY
            </span>
          </a>
          <button
            type="button"
            aria-label="เปิดเมนู"
            onClick={onMenuClick}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)] transition-colors"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Desktop: full layout */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          <a href="/seller/overview" className="flex items-center gap-2 h-9 shrink-0">
            <BrightifyLogo size={36} />
            <span className="text-[24px] font-medium leading-[16.8px] text-[var(--color-primary)]">
              BRIGHTIFY
            </span>
          </a>
          <span className="w-px h-6 bg-[var(--color-neutral-300)]" />
          <p className="text-[20px] font-semibold leading-[16.8px] text-[var(--color-neutral-900)]">
            ร้านค้า
          </p>
        </div>

        <nav className="hidden lg:flex flex-1 min-w-0 items-center justify-center gap-4 h-9">
          {SELLER_NAV.map((item) => {
            const isActive = item.id === (active ?? "manage");
            const Glyph = item.Glyph;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.to)}
                className={[
                  "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[16px] font-medium leading-[18px] whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-neutral-500)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-100)]",
                ].join(" ")}
              >
                <Glyph size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center justify-end gap-6 shrink-0">
          <div className="flex items-center gap-4">
            <LanguageSelect />
            <HelpSelect />
          </div>
          <span className="w-px h-[18.5px] bg-[var(--color-neutral-300)]" />
          <NotificationBell />
          <SellerProfile />
        </div>
      </div>
    </header>
  );
}

type SidebarLeaf = { kind: "leaf"; icon: string; label: string; to?: string };
type SidebarGroup = { kind: "group"; icon: string; label: string; children: SidebarLeaf[] };
type SidebarEntry = SidebarLeaf | SidebarGroup;

const SIDEBAR_ENTRIES: SidebarEntry[] = [
  { kind: "leaf", icon: "grid-alt", label: "ภาพรวมร้านค้า", to: "/seller/overview" },
  { kind: "leaf", icon: "bag", label: "คำสั่งซื้อ", to: "/seller/orders" },
  { kind: "leaf", icon: "files", label: "ใบเสนอราคา", to: "/seller/quotes" },
  {
    kind: "group",
    icon: "box",
    label: "สินค้า",
    children: [
      { kind: "leaf", icon: "pkg-manage", label: "การจัดการสินค้า", to: "/seller/products" },
      { kind: "leaf", icon: "reload", label: "คำขอคืนเงิน/คืนสินค้า", to: "/seller/refunds" },
    ],
  },
  {
    kind: "group",
    icon: "bullhorn",
    label: "การตลาด",
    children: [
      { kind: "leaf", icon: "tag", label: "โปรโมชั่น", to: "/seller/promotions" },
      { kind: "leaf", icon: "ticket", label: "โค้ดส่วนลด", to: "/seller/discounts" },
      { kind: "leaf", icon: "bolt-alt", label: "Flash Sale", to: "/seller/flashsale" },
    ],
  },
  { kind: "leaf", icon: "delivery", label: "โลจิสติกส์", to: "/seller/logistics" },
  { kind: "leaf", icon: "star", label: "รีวิว & คะแนนร้านค้า", to: "/seller/reviews" },
  { kind: "leaf", icon: "comments", label: "แชท", to: "/seller/chat" },
  {
    kind: "group",
    icon: "bar-chart",
    label: "การวิเคราะห์",
    children: [
      { kind: "leaf", icon: "dollar", label: "การวิเคราะห์รายได้", to: "/seller/analytics/revenue" },
      { kind: "leaf", icon: "users", label: "การวิเคราะห์ลูกค้า" },
      { kind: "leaf", icon: "package", label: "การวิเคราะห์สินค้า" },
      { kind: "leaf", icon: "bullhorn", label: "การวิเคราะห์การตลาด" },
    ],
  },
  { kind: "leaf", icon: "wallet", label: "กระเป๋าเงิน", to: "/seller/wallet" },
  { kind: "leaf", icon: "cog", label: "การตั้งค่าร้านค้า", to: "/seller/settings" },
];

type BadgeVariant = "default" | "white" | "primary";

function IconBadge({ icon, variant = "default" }: { icon: string; variant?: BadgeVariant }) {
  const styles: Record<BadgeVariant, string> = {
    default: "bg-[var(--color-neutral-200)] text-[var(--color-neutral-900)]",
    white: "bg-white text-[var(--color-neutral-900)]",
    primary: "bg-[var(--color-primary)] text-white",
  };
  return (
    <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${styles[variant]}`}>
      {icon === "wallet" ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.333 6.33335V4.80002C13.333 4.05328 13.333 3.67992 13.1877 3.3947C13.0599 3.14382 12.8559 2.93984 12.605 2.81201C12.3198 2.66669 11.9464 2.66669 11.1997 2.66669H3.46634C2.7196 2.66669 2.34624 2.66669 2.06102 2.81201C1.81014 2.93984 1.60616 3.14382 1.47833 3.3947C1.33301 3.67992 1.33301 4.05328 1.33301 4.80002V11.2C1.33301 11.9468 1.33301 12.3201 1.47833 12.6053C1.60616 12.8562 1.81014 13.0602 2.06102 13.188C2.34624 13.3334 2.7196 13.3334 3.46634 13.3334L11.1997 13.3334C11.9464 13.3334 12.3198 13.3334 12.605 13.188C12.8559 13.0602 13.0599 12.8562 13.1877 12.6053C13.333 12.3201 13.333 11.9468 13.333 11.2V9.66669M9.99967 8.00002C9.99967 7.69025 9.99967 7.53537 10.0253 7.40657C10.1305 6.87765 10.544 6.46418 11.0729 6.35897C11.2017 6.33335 11.3566 6.33335 11.6663 6.33335H12.9997C13.3094 6.33335 13.4643 6.33335 13.5931 6.35897C14.122 6.46418 14.5355 6.87765 14.6407 7.40657C14.6663 7.53537 14.6663 7.69025 14.6663 8.00002C14.6663 8.30979 14.6663 8.46468 14.6407 8.59347C14.5355 9.1224 14.122 9.53586 13.5931 9.64107C13.4643 9.66669 13.3094 9.66669 12.9997 9.66669H11.6663C11.3566 9.66669 11.2017 9.66669 11.0729 9.64107C10.544 9.53586 10.1305 9.12239 10.0253 8.59347C9.99967 8.46468 9.99967 8.30979 9.99967 8.00002Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6" cy="8" r="1" fill="currentColor"/>
          </svg>
        ) : icon === "dollar" ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.99967 7.33335V10M11.9997 6.00002V8.66669M11.333 2.66669C12.9655 2.66669 13.8484 2.91653 14.2878 3.11032C14.3463 3.13612 14.3755 3.14903 14.4599 3.2296C14.5105 3.2779 14.6029 3.41962 14.6267 3.48541C14.6663 3.59518 14.6663 3.65518 14.6663 3.77518V10.9408C14.6663 11.5466 14.6663 11.8496 14.5755 12.0053C14.4831 12.1636 14.3939 12.2373 14.221 12.2981C14.0509 12.358 13.7077 12.292 13.0211 12.1601C12.5406 12.0678 11.9707 12 11.333 12C9.33301 12 7.33301 13.3334 4.66634 13.3334C3.03387 13.3334 2.15092 13.0835 1.7116 12.8897C1.65309 12.8639 1.62384 12.851 1.53941 12.7704C1.4888 12.7221 1.39642 12.5804 1.37265 12.5146C1.33301 12.4049 1.33301 12.3449 1.33301 12.2249L1.33301 5.05926C1.33301 4.45341 1.33301 4.15049 1.42386 3.99478C1.51628 3.8364 1.6054 3.76276 1.77838 3.70189C1.94843 3.64205 2.2917 3.70801 2.97823 3.83992C3.45875 3.93225 4.02866 4.00002 4.66634 4.00002C6.66634 4.00002 8.66634 2.66669 11.333 2.66669ZM9.66634 8.00002C9.66634 8.92049 8.92015 9.66669 7.99967 9.66669C7.0792 9.66669 6.33301 8.92049 6.33301 8.00002C6.33301 7.07954 7.0792 6.33335 7.99967 6.33335C8.92015 6.33335 9.66634 7.07954 9.66634 8.00002Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : icon === "bar-chart" ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.33333 8.66667V11.3333M10.6667 7.33333V11.3333M8 4.66667V11.3333M5.2 14H10.8C11.9201 14 12.4802 14 12.908 13.782C13.2843 13.5903 13.5903 13.2843 13.782 12.908C14 12.4802 14 11.9201 14 10.8V5.2C14 4.0799 14 3.51984 13.782 3.09202C13.5903 2.71569 13.2843 2.40973 12.908 2.21799C12.4802 2 11.9201 2 10.8 2H5.2C4.0799 2 3.51984 2 3.09202 2.21799C2.71569 2.40973 2.40973 2.71569 2.21799 3.09202C2 3.51984 2 4.0799 2 5.2V10.8C2 11.9201 2 12.4802 2.21799 12.908C2.40973 13.2843 2.71569 13.5903 3.09202 13.782C3.51984 14 4.0799 14 5.2 14Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : icon === "comments" ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#sellerChatClip)">
              <path d="M4.06258 7.48587C4.02115 7.21883 3.99965 6.94525 3.99965 6.66668C3.99965 3.72116 6.40317 1.33334 9.36807 1.33334C12.333 1.33334 14.7365 3.72116 14.7365 6.66668C14.7365 7.33206 14.6138 7.96898 14.3898 8.55635C14.3432 8.67833 14.32 8.73933 14.3094 8.78695C14.2989 8.83413 14.2949 8.86733 14.2938 8.91564C14.2926 8.96441 14.2992 9.01813 14.3125 9.12556L14.5808 11.3057C14.6099 11.5417 14.6244 11.6597 14.5852 11.7455C14.5508 11.8207 14.4897 11.8804 14.4137 11.913C14.3271 11.9503 14.2094 11.933 13.9742 11.8986L11.8506 11.5873C11.7398 11.571 11.6843 11.5629 11.6338 11.5632C11.5839 11.5635 11.5493 11.5672 11.5004 11.5774C11.451 11.5878 11.3879 11.6115 11.2617 11.6588C10.6728 11.8793 10.0346 12 9.36807 12C9.08928 12 8.81545 11.9789 8.54811 11.9382M5.08739 14.6667C7.06399 14.6667 8.66634 13.0251 8.66634 11C8.66634 8.97497 7.06399 7.33334 5.08739 7.33334C3.1108 7.33334 1.50845 8.97497 1.50845 11C1.50845 11.4071 1.57319 11.7986 1.69271 12.1645C1.74323 12.3191 1.76849 12.3965 1.77678 12.4493C1.78543 12.5045 1.78695 12.5354 1.78373 12.5912C1.78064 12.6445 1.76728 12.7049 1.74057 12.8255L1.33301 14.6667L3.32954 14.394C3.43852 14.3791 3.49301 14.3717 3.54059 14.372C3.59069 14.3723 3.61728 14.3751 3.66641 14.3849C3.71308 14.3942 3.78245 14.4186 3.92119 14.4676C4.28674 14.5966 4.67908 14.6667 5.08739 14.6667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs><clipPath id="sellerChatClip"><rect width="16" height="16" fill="white"/></clipPath></defs>
          </svg>
        ) : icon === "bolt-alt" ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.66625 1.33334L2.72855 8.45858C2.49601 8.73763 2.37974 8.87715 2.37797 8.99498C2.37642 9.09742 2.42207 9.19488 2.50175 9.25927C2.59341 9.33334 2.77503 9.33334 3.13827 9.33334H7.99958L7.33292 14.6667L13.2706 7.54144C13.5032 7.26239 13.6194 7.12287 13.6212 7.00504C13.6227 6.9026 13.5771 6.80514 13.4974 6.74075C13.4058 6.66668 13.2241 6.66668 12.8609 6.66668H7.99958L8.66625 1.33334Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : icon === "ticket" ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.66634 5.33334V4.66667M6.66634 8.33334V7.66667M6.66634 11.3333V10.6667M3.46634 2.66667H12.533C13.2797 2.66667 13.6531 2.66667 13.9383 2.812C14.1892 2.93983 14.3932 3.1438 14.521 3.39468C14.6663 3.6799 14.6663 4.05327 14.6663 4.8V5.66667C13.3777 5.66667 12.333 6.71134 12.333 8C12.333 9.28867 13.3777 10.3333 14.6663 10.3333V11.2C14.6663 11.9467 14.6663 12.3201 14.521 12.6053C14.3932 12.8562 14.1892 13.0602 13.9383 13.188C13.6531 13.3333 13.2797 13.3333 12.533 13.3333H3.46634C2.7196 13.3333 2.34624 13.3333 2.06102 13.188C1.81014 13.0602 1.60616 12.8562 1.47833 12.6053C1.33301 12.3201 1.33301 11.9467 1.33301 11.2V10.3333C2.62167 10.3333 3.66634 9.28867 3.66634 8C3.66634 6.71134 2.62167 5.66667 1.33301 5.66667V4.8C1.33301 4.05327 1.33301 3.6799 1.47833 3.39468C1.60616 3.1438 1.81014 2.93983 2.06102 2.812C2.34624 2.66667 2.7196 2.66667 3.46634 2.66667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : icon === "tag" ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#sellerTagClip)">
              <path d="M5.33301 5.33333H5.33968M1.33301 3.46666L1.33301 6.44967C1.33301 6.77579 1.33301 6.93885 1.36985 7.0923C1.40251 7.22835 1.45638 7.35841 1.52949 7.47771C1.61194 7.61226 1.72724 7.72756 1.95785 7.95817L7.07027 13.0706C7.8623 13.8626 8.25832 14.2586 8.71497 14.407C9.11666 14.5375 9.54935 14.5375 9.95104 14.407C10.4077 14.2586 10.8037 13.8626 11.5958 13.0706L13.0703 11.5961C13.8623 10.804 14.2583 10.408 14.4067 9.95136C14.5372 9.54967 14.5372 9.11698 14.4067 8.71529C14.2583 8.25864 13.8623 7.86262 13.0703 7.07058L7.95784 1.95817C7.72724 1.72756 7.61194 1.61226 7.47739 1.52981C7.35809 1.4567 7.22803 1.40283 7.09198 1.37017C6.93853 1.33333 6.77547 1.33333 6.44935 1.33333L3.46634 1.33333C2.7196 1.33333 2.34624 1.33333 2.06102 1.47865C1.81014 1.60648 1.60616 1.81046 1.47833 2.06134C1.33301 2.34656 1.33301 2.71992 1.33301 3.46666ZM5.66634 5.33333C5.66634 5.51742 5.5171 5.66666 5.33301 5.66666C5.14891 5.66666 4.99968 5.51742 4.99968 5.33333C4.99968 5.14923 5.14891 4.99999 5.33301 4.99999C5.5171 4.99999 5.66634 5.14923 5.66634 5.33333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs><clipPath id="sellerTagClip"><rect width="16" height="16" fill="white"/></clipPath></defs>
          </svg>
        ) : icon === "pkg-manage" ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.6666 4.85183L7.99998 7.99998M7.99998 7.99998L2.33331 4.85183M7.99998 7.99998L8 14.3333M9.33333 13.9259L8.51802 14.3789C8.32895 14.4839 8.23442 14.5364 8.1343 14.557C8.0457 14.5753 7.95431 14.5753 7.8657 14.557C7.76559 14.5364 7.67105 14.4839 7.48198 14.3789L2.54865 11.6381C2.34897 11.5272 2.24912 11.4717 2.17642 11.3928C2.11211 11.3231 2.06343 11.2403 2.03366 11.1502C2 11.0483 2 10.9341 2 10.7057V5.2943C2 5.06587 2 4.95166 2.03366 4.84979C2.06343 4.75967 2.11211 4.67695 2.17642 4.60716C2.24912 4.52827 2.34897 4.4728 2.54865 4.36186L7.48198 1.62112C7.67105 1.51609 7.76559 1.46356 7.8657 1.44297C7.95431 1.42475 8.0457 1.42475 8.1343 1.44297C8.23442 1.46356 8.32895 1.51608 8.51802 1.62112L13.4514 4.36186C13.651 4.4728 13.7509 4.52827 13.8236 4.60716C13.8879 4.67695 13.9366 4.75967 13.9663 4.84979C14 4.95165 14 5.06587 14 5.2943L14 8.33333M5 3L11 6.33333M10.6667 12L12 13.3333L14.6667 10.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : icon === "box" ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.6666 4.85183L7.99998 7.99998M7.99998 7.99998L2.33331 4.85183M7.99998 7.99998L8 14.3333M14 10.7057V5.2943C14 5.06587 14 4.95165 13.9663 4.84979C13.9366 4.75967 13.8879 4.67695 13.8236 4.60716C13.7509 4.52827 13.651 4.4728 13.4514 4.36186L8.51802 1.62112C8.32895 1.51608 8.23442 1.46356 8.1343 1.44297C8.0457 1.42475 7.95431 1.42475 7.8657 1.44297C7.76559 1.46356 7.67105 1.51608 7.48198 1.62112L2.54865 4.36186C2.34896 4.4728 2.24912 4.52827 2.17642 4.60716C2.11211 4.67695 2.06343 4.75967 2.03366 4.84979C2 4.95166 2 5.06587 2 5.2943V10.7057C2 10.9341 2 11.0483 2.03366 11.1502C2.06343 11.2403 2.11211 11.3231 2.17642 11.3928C2.24912 11.4717 2.34897 11.5272 2.54865 11.6381L7.48198 14.3789C7.67105 14.4839 7.76559 14.5364 7.8657 14.557C7.95431 14.5752 8.0457 14.5752 8.1343 14.557C8.23442 14.5364 8.32895 14.4839 8.51802 14.3789L13.4514 11.6381C13.651 11.5272 13.7509 11.4717 13.8236 11.3928C13.8879 11.3231 13.9366 11.2403 13.9663 11.1502C14 11.0483 14 10.9341 14 10.7057Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 6.33333L5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : icon === "bag" ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.6666 6V4C10.6666 2.52724 9.47268 1.33334 7.99992 1.33334C6.52716 1.33334 5.33325 2.52724 5.33325 4V6M2.39459 6.90131L1.99459 11.168C1.88086 12.3811 1.82399 12.9877 2.02529 13.4562C2.20212 13.8678 2.512 14.208 2.90527 14.4225C3.35294 14.6667 3.96216 14.6667 5.18062 14.6667H10.8192C12.0377 14.6667 12.6469 14.6667 13.0946 14.4225C13.4878 14.208 13.7977 13.8678 13.9746 13.4562C14.1758 12.9877 14.119 12.3811 14.0053 11.168L13.6053 6.90131C13.5092 5.8769 13.4612 5.36469 13.2308 4.97745C13.0279 4.63639 12.7281 4.36341 12.3696 4.19323C11.9626 4 11.4481 4 10.4192 4L5.58062 4C4.55171 4 4.03726 4 3.6302 4.19323C3.2717 4.36341 2.97193 4.63639 2.76903 4.97744C2.53865 5.36469 2.49063 5.8769 2.39459 6.90131Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : icon === "star" ? <StarIcon size={14} />
        : icon === "cart" ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.6666 6.00004V4.00004C10.6666 2.52728 9.47268 1.33337 7.99992 1.33337C6.52716 1.33337 5.33325 2.52728 5.33325 4.00004V6.00004M2.39459 6.90135L1.99459 11.168C1.88086 12.3812 1.82399 12.9877 2.02529 13.4562C2.20212 13.8678 2.512 14.2081 2.90527 14.4226C3.35294 14.6667 3.96216 14.6667 5.18062 14.6667H10.8192C12.0377 14.6667 12.6469 14.6667 13.0946 14.4226C13.4878 14.2081 13.7977 13.8678 13.9746 13.4562C14.1758 12.9877 14.119 12.3812 14.0053 11.168L13.6053 6.90135C13.5092 5.87694 13.4612 5.36473 13.2308 4.97748C13.0279 4.63643 12.7281 4.36345 12.3696 4.19327C11.9626 4.00004 11.4481 4.00004 10.4192 4.00004L5.58062 4.00004C4.55171 4.00004 4.03726 4.00004 3.6302 4.19327C3.2717 4.36345 2.97193 4.63643 2.76903 4.97748C2.53865 5.36473 2.49063 5.87694 2.39459 6.90135Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 7H7.87549C8.49287 7 8.96757 7.13143 9.29961 7.39429C9.63165 7.65714 9.79767 8.03143 9.79767 8.51714C9.79767 8.78571 9.7406 9.02 9.62646 9.22C9.51232 9.42 9.33333 9.6 9.08949 9.76V9.77714C9.41115 9.92571 9.64202 10.1143 9.7821 10.3429C9.92737 10.5714 10 10.8629 10 11.2171C10 11.7886 9.84436 12.2286 9.53307 12.5371C9.22698 12.8457 8.79118 13 8.22568 13H6V7ZM7.94553 9.34857C8.12711 9.34857 8.26978 9.28857 8.37354 9.16857C8.48249 9.04286 8.53696 8.87714 8.53696 8.67143C8.53696 8.26 8.29053 8.05429 7.79767 8.05429H7.25292V9.34857H7.94553ZM8.10895 11.9457C8.31128 11.9457 8.46952 11.8714 8.58366 11.7229C8.70298 11.5743 8.76265 11.3743 8.76265 11.1229C8.76265 10.8486 8.69261 10.6514 8.55253 10.5314C8.41245 10.4057 8.18418 10.3429 7.8677 10.3429H7.25292V11.9457H8.10895Z" fill="currentColor"/>
          </svg>
        ) : icon === "affiliate" ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.6663 12L11.9997 13.3333L14.6663 10.6667M7.99967 10H5.33301C4.0905 10 3.46924 10 2.97919 10.203C2.32578 10.4736 1.80665 10.9928 1.536 11.6462C1.33301 12.1362 1.33301 12.7575 1.33301 14M10.333 2.19384C11.3103 2.58943 11.9997 3.54754 11.9997 4.66667C11.9997 5.78579 11.3103 6.7439 10.333 7.13949M8.99967 4.66667C8.99967 6.13943 7.80577 7.33333 6.33301 7.33333C4.86025 7.33333 3.66634 6.13943 3.66634 4.66667C3.66634 3.19391 4.86025 2 6.33301 2C7.80577 2 8.99967 3.19391 8.99967 4.66667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : icon === "cog" ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : icon === "files" ? <QuoteIcon size={14} /> : <Icon name={icon} size={14} />}
    </span>
  );
}

function LeafRow({
  icon,
  label,
  active,
  collapsed,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={[
        "w-full flex items-center p-2 rounded-lg text-left text-[14px] transition-colors",
        collapsed ? "justify-center" : "gap-2.5",
        active
          ? "bg-[var(--color-primary-100)] text-[var(--color-neutral-900)] font-medium"
          : "bg-white text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
      ].join(" ")}
    >
      <IconBadge icon={icon} variant={active ? "primary" : "default"} />
      {!collapsed && <span className="flex-1 min-w-0 truncate">{label}</span>}
    </button>
  );
}

function GroupRow({
  group,
  open,
  collapsed,
  onToggle,
  activeChildLabel,
  onSelectChild,
}: {
  group: SidebarGroup;
  open: boolean;
  collapsed?: boolean;
  onToggle: () => void;
  activeChildLabel?: string;
  onSelectChild: (c: SidebarLeaf) => void;
}) {
  const hasActiveChild = group.children.some((c) => c.label === activeChildLabel);

  if (collapsed) {
    const first = group.children.find((c) => c.to) ?? group.children[0];
    return (
      <button
        type="button"
        onClick={() => onSelectChild(first)}
        title={group.label}
        className={[
          "w-full flex items-center justify-center p-2 rounded-lg transition-colors",
          hasActiveChild
            ? "bg-[var(--color-primary-100)]"
            : "bg-white hover:bg-[var(--color-primary-100)]",
        ].join(" ")}
      >
        <IconBadge icon={group.icon} variant={hasActiveChild ? "primary" : "default"} />
      </button>
    );
  }

  return (
    <div className="w-full flex flex-col gap-1">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={[
          "w-full flex items-center justify-between p-2 rounded-lg text-left text-[14px] transition-colors",
          open
            ? "bg-[var(--color-neutral-100,#f5f8fa)] text-[var(--color-neutral-900)]"
            : "bg-white text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
        ].join(" ")}
      >
        <span className="flex items-center gap-2.5 min-w-0 flex-1">
          <IconBadge icon={group.icon} variant={open ? "white" : "default"} />
          <span className="flex-1 min-w-0 truncate">{group.label}</span>
        </span>
        <Icon
          name="chevron-down"
          size={14}
          className={`text-[var(--color-neutral-600)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="bg-white border border-[var(--color-neutral-200)] rounded-lg p-2 flex flex-col gap-1">
          {group.children.map((c) => (
            <LeafRow
              key={c.label}
              icon={c.icon}
              label={c.label}
              active={c.label === activeChildLabel}
              onClick={() => onSelectChild(c)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent({
  active,
  collapsed,
  onClose,
}: {
  active?: string;
  collapsed: boolean;
  onClose?: () => void;
}) {
  const navigate = useNavigate();
  const groupOfActive = SIDEBAR_ENTRIES.findIndex(
    (e) => e.kind === "group" && e.children.some((c) => c.label === active)
  );
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>(
    groupOfActive >= 0 ? { [groupOfActive]: true } : {}
  );

  const go = (leaf: SidebarLeaf) => {
    if (leaf.to) navigate(leaf.to);
    onClose?.();
  };

  return (
    <>
      <nav className={`${collapsed ? "px-3" : "px-4"} flex flex-col gap-2`}>
        {SIDEBAR_ENTRIES.map((entry, i) => {
          if (entry.kind === "leaf") {
            return (
              <LeafRow
                key={entry.label}
                icon={entry.icon}
                label={entry.label}
                active={entry.label === active}
                collapsed={collapsed}
                onClick={() => go(entry)}
              />
            );
          }
          return (
            <GroupRow
              key={entry.label}
              group={entry}
              open={!!openGroups[i]}
              collapsed={collapsed}
              onToggle={() => setOpenGroups((s) => ({ ...s, [i]: !s[i] }))}
              activeChildLabel={active}
              onSelectChild={go}
            />
          );
        })}
      </nav>

      <div className={`${collapsed ? "px-3" : "px-4"} flex flex-col gap-2 pt-4`}>
        <span className="block w-full h-px bg-[var(--color-neutral-200)]" />
        <a
          href="/"
          title={collapsed ? "BMS E-Commerce" : undefined}
          className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5"} px-2 py-2 rounded-lg text-[14px] text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] transition-colors`}
        >
          <IconBadge icon="cart" />
          {!collapsed && <><span className="flex-1 min-w-0 truncate">BMS E-Commerce</span><svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0"><path d="M12.5 2.5H17.5L17.5 7.5M17.5 2.5L10.8333 9.16667M8.33333 4.16667H6.5C5.09987 4.16667 4.3998 4.16667 3.86502 4.43915C3.39462 4.67883 3.01217 5.06129 2.77248 5.53169C2.5 6.06647 2.5 6.76654 2.5 8.16667V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H11.8333C13.2335 17.5 13.9335 17.5 14.4683 17.2275C14.9387 16.9878 15.3212 16.6054 15.5608 16.135C15.8333 15.6002 15.8333 14.9001 15.8333 13.5V11.6667" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></>}
        </a>
        <a
          href="/affiliate/overview"
          title={collapsed ? "BMS Affiliate" : undefined}
          className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5"} px-2 py-2 rounded-lg text-[14px] text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] transition-colors`}
        >
          <IconBadge icon="affiliate" />
          {!collapsed && <><span className="flex-1 min-w-0 truncate">BMS Affiliate</span><svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0"><path d="M12.5 2.5H17.5L17.5 7.5M17.5 2.5L10.8333 9.16667M8.33333 4.16667H6.5C5.09987 4.16667 4.3998 4.16667 3.86502 4.43915C3.39462 4.67883 3.01217 5.06129 2.77248 5.53169C2.5 6.06647 2.5 6.76654 2.5 8.16667V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H11.8333C13.2335 17.5 13.9335 17.5 14.4683 17.2275C14.9387 16.9878 15.3212 16.6054 15.5608 16.135C15.8333 15.6002 15.8333 14.9001 15.8333 13.5V11.6667" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></>}
        </a>
      </div>
    </>
  );
}

export function SellerSidebar({
  active,
  mobileOpen,
  onClose,
}: {
  active?: string;
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("sellerSidebarCollapsed") === "1"; } catch { return false; }
  });
  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      try { localStorage.setItem("sellerSidebarCollapsed", next ? "1" : "0"); } catch { /* ignore */ }
      return next;
    });
  };

  return (
    <>
      {/* Mobile drawer */}
      <div className="lg:hidden">
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={onClose}
        />
        {/* Panel */}
        <aside
          className={`fixed left-0 top-0 h-full w-[260px] bg-white z-50 shadow-xl flex flex-col justify-between py-4 overflow-y-auto scrollbar-none transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Mobile header with close button */}
          <div className="flex items-center justify-between px-4 pb-3 border-b border-[var(--color-neutral-200)] mb-2">
            <a href="/seller/overview" className="flex items-center gap-2 shrink-0">
              <span className="text-[16px] font-semibold text-[var(--color-primary)]">เมนูร้านค้า</span>
            </a>
            <button
              type="button"
              aria-label="ปิดเมนู"
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--color-neutral-200)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-300)] transition-colors"
            >
              <XIcon size={14} strokeWidth={2.5} />
            </button>
          </div>
          <SidebarContent active={active} collapsed={false} onClose={onClose} />
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex ${collapsed ? "w-[68px]" : "w-[232px]"} shrink-0 bg-white border-r border-[var(--color-neutral-300)] sticky top-[72px] self-start h-[calc(100vh-72px)] overflow-y-auto scrollbar-none flex-col justify-between py-4 transition-[width] duration-200`}>
        <SidebarContent active={active} collapsed={collapsed} />
        <div className={`${collapsed ? "px-3" : "px-4"} pt-2`}>
          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? "ขยายเมนู" : "ย่อเมนู"}
            className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5"} px-2 py-2 rounded-lg text-[14px] text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] transition-colors`}
          >
            {!collapsed && <span className="flex-1 text-left">ย่อเมนู</span>}
            <Icon name="arrow-left-circle" size={18} className={`text-[var(--color-neutral-600)] transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
      </aside>
    </>
  );
}
