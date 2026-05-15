import { useState, useSyncExternalStore } from "react";
import { useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import Icon from "./landing/Icon";
import LanguageSelect from "./LanguageSelect";
import NotificationBell from "./NotificationBell";
import HelpSelect from "./HelpSelect";
import AffiliateProfile from "./AffiliateProfile";

/* ---- mobile sidebar drawer state (shared between header trigger and sidebar) ---- */
let drawerOpen = false;
const drawerListeners = new Set<() => void>();
function setDrawerOpen(v: boolean) {
  if (drawerOpen === v) return;
  drawerOpen = v;
  drawerListeners.forEach((l) => l());
}
function useDrawerOpen() {
  return useSyncExternalStore(
    (cb) => {
      drawerListeners.add(cb);
      return () => drawerListeners.delete(cb);
    },
    () => drawerOpen,
    () => false,
  );
}

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

export function AffiliateHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[var(--color-neutral-300)] px-4 sm:px-6 py-[18px]">
      <div className="flex items-center justify-between gap-3 sm:gap-6 w-full">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            type="button"
            aria-label="เปิดเมนู"
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden w-9 h-9 -ml-1 shrink-0 flex items-center justify-center rounded-lg text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
          >
            <Menu size={22} />
          </button>
          <a href="/affiliate/overview" className="flex items-center gap-4 sm:gap-6 h-9 min-w-0 shrink">
            <span className="flex items-center gap-2 min-w-0">
              <BrightifyLogo size={36} />
              <span className="hidden min-[420px]:block text-[22px] sm:text-[24px] font-medium leading-none text-[var(--color-primary)] truncate">
                BRIGHTIFY
              </span>
            </span>
            <span className="hidden sm:block w-px h-6 bg-[var(--color-neutral-300)]" />
            <span className="hidden sm:block text-[20px] font-semibold leading-none text-[var(--color-neutral-900)]">
              Affiliate
            </span>
          </a>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <div className="hidden md:flex items-center gap-1">
            <LanguageSelect />
            <HelpSelect />
          </div>
          <span className="hidden md:block w-px h-[18.5px] bg-[var(--color-neutral-300)]" />
          <NotificationBell />
          <AffiliateProfile />
        </div>
      </div>
    </header>
  );
}

type SidebarLeaf = { kind: "leaf"; icon: string; label: string; to?: string };
type SidebarGroup = { kind: "group"; icon: string; label: string; children: SidebarLeaf[] };
type SidebarEntry = SidebarLeaf | SidebarGroup;

const SIDEBAR_ENTRIES: SidebarEntry[] = [
  { kind: "leaf", icon: "grid-alt", label: "ภาพรวม Affiliate", to: "/affiliate/overview" },
  {
    kind: "group",
    icon: "link",
    label: "สินค้าลิงก์คอมมิชชัน",
    children: [
      { kind: "leaf", icon: "package", label: "คอมมิชชัน BRIGHTIFY", to: "/affiliate/commission/brightify" },
      { kind: "leaf", icon: "shop", label: "คอมมิชชันร้านค้า", to: "/affiliate/commission/shop" },
      { kind: "leaf", icon: "tag", label: "คอมมิชชันสินค้า", to: "/affiliate/commission/product" },
      { kind: "leaf", icon: "unlink", label: "ลิงก์ที่กำหนดเอง", to: "/affiliate/commission/custom-link" },
    ],
  },
  { kind: "leaf", icon: "cup", label: "แคมเปญ Affiliate", to: "/affiliate/campaign" },
  {
    kind: "group",
    icon: "files",
    label: "รายงาน",
    children: [
      { kind: "leaf", icon: "clipboard", label: "รายงานคำสั่งซื้อ", to: "/affiliate/reports/orders" },
      { kind: "leaf", icon: "pointer", label: "รายงานการคลิก", to: "/affiliate/reports/clicks" },
    ],
  },
  {
    kind: "group",
    icon: "wallet",
    label: "รายได้คอมมิชชัน",
    children: [
      { kind: "leaf", icon: "coin", label: "สรุปค่าคอมมิชชัน", to: "/affiliate/commission-income/summary" },
      { kind: "leaf", icon: "credit-cards", label: "ถอนเงินคอมมิชชัน", to: "/affiliate/commission-income/withdraw" },
    ],
  },
  { kind: "leaf", icon: "cog", label: "การตั้งค่า", to: "/affiliate/settings" },
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
      {icon === "cart" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.6666 6.00004V4.00004C10.6666 2.52728 9.47268 1.33337 7.99992 1.33337C6.52716 1.33337 5.33325 2.52728 5.33325 4.00004V6.00004M2.39459 6.90135L1.99459 11.168C1.88086 12.3812 1.82399 12.9877 2.02529 13.4562C2.20212 13.8678 2.512 14.2081 2.90527 14.4226C3.35294 14.6667 3.96216 14.6667 5.18062 14.6667H10.8192C12.0377 14.6667 12.6469 14.6667 13.0946 14.4226C13.4878 14.2081 13.7977 13.8678 13.9746 13.4562C14.1758 12.9877 14.119 12.3812 14.0053 11.168L13.6053 6.90135C13.5092 5.87694 13.4612 5.36473 13.2308 4.97748C13.0279 4.63643 12.7281 4.36345 12.3696 4.19327C11.9626 4.00004 11.4481 4.00004 10.4192 4.00004L5.58062 4.00004C4.55171 4.00004 4.03726 4.00004 3.6302 4.19327C3.2717 4.36345 2.97193 4.63643 2.76903 4.97748C2.53865 5.36473 2.49063 5.87694 2.39459 6.90135Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 7H7.87549C8.49287 7 8.96757 7.13143 9.29961 7.39429C9.63165 7.65714 9.79767 8.03143 9.79767 8.51714C9.79767 8.78571 9.7406 9.02 9.62646 9.22C9.51232 9.42 9.33333 9.6 9.08949 9.76V9.77714C9.41115 9.92571 9.64202 10.1143 9.7821 10.3429C9.92737 10.5714 10 10.8629 10 11.2171C10 11.7886 9.84436 12.2286 9.53307 12.5371C9.22698 12.8457 8.79118 13 8.22568 13H6V7ZM7.94553 9.34857C8.12711 9.34857 8.26978 9.28857 8.37354 9.16857C8.48249 9.04286 8.53696 8.87714 8.53696 8.67143C8.53696 8.26 8.29053 8.05429 7.79767 8.05429H7.25292V9.34857H7.94553ZM8.10895 11.9457C8.31128 11.9457 8.46952 11.8714 8.58366 11.7229C8.70298 11.5743 8.76265 11.3743 8.76265 11.1229C8.76265 10.8486 8.69261 10.6514 8.55253 10.5314C8.41245 10.4057 8.18418 10.3429 7.8677 10.3429H7.25292V11.9457H8.10895Z" fill="currentColor"/>
        </svg>
      ) : icon === "package" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.33008 2C8.81781 2.00001 9.92161 2.25202 10.6416 2.75586C11.3736 3.24786 11.7402 4.00441 11.7402 5.02441C11.7402 5.73195 11.5842 6.3137 11.2725 6.76953C10.9605 7.22544 10.4743 7.58004 9.81445 7.83203V7.88574C10.2169 7.995 10.5665 8.13695 10.8643 8.30957L9.93262 9.24121C9.89463 9.20852 9.85566 9.17647 9.81445 9.14648C9.29845 8.76248 8.47566 8.57031 7.34766 8.57031H5.65625V13.2676H7.00098C6.99632 13.727 7.10896 14.1863 7.33691 14.5996H4V2H7.33008ZM5.65625 7.30957H7.74414C8.51207 7.30955 9.09426 7.12951 9.49023 6.76953C9.88592 6.39761 10.0839 5.85799 10.084 5.15039C10.084 4.51439 9.86755 4.05167 9.43555 3.76367C9.00352 3.47588 8.31945 3.33203 7.38379 3.33203H5.65625V7.30957Z" fill="currentColor"/>
          <g clipPath="url(#affiliatePkgClip)">
            <path d="M12.2355 14.1214L11.7641 14.5928C11.1132 15.2437 10.058 15.2437 9.4071 14.5928C8.75623 13.9419 8.75623 12.8866 9.4071 12.2358L9.87851 11.7644M14.1211 12.2358L14.5926 11.7644C15.2434 11.1135 15.2434 10.0582 14.5926 9.40734C13.9417 8.75647 12.8864 8.75647 12.2355 9.40734L11.7641 9.87875M10.8332 13.1667L13.1665 10.8334" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="affiliatePkgClip">
              <rect width="8" height="8" fill="white" transform="translate(8 8)"/>
            </clipPath>
          </defs>
        </svg>
      ) : icon === "shop" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#affiliateShopClip0)">
            <path d="M10.9697 0.742188C11.1593 0.760813 11.3459 0.807525 11.5225 0.880859C11.7573 0.978424 11.9709 1.12167 12.1504 1.30176L15.0908 4.24219C15.0971 4.24852 15.1014 4.25713 15.1074 4.26367C15.1283 4.28638 15.1488 4.30924 15.166 4.33496C15.1699 4.34079 15.1721 4.34758 15.1758 4.35352C15.2323 4.44491 15.2666 4.55165 15.2666 4.66699V6.66699C15.2666 6.86112 15.2367 7.05208 15.1807 7.23438C14.7983 7.07327 14.3897 6.99606 13.9814 7.00195C14.0347 6.89883 14.0664 6.78513 14.0664 6.66699V5.2666H1.93262V6.66699C1.93268 6.86132 2.01009 7.04809 2.14746 7.18555C2.28208 7.32017 2.46426 7.39525 2.6543 7.39844C2.90618 7.38013 3.14629 7.28385 3.33984 7.12109C3.35104 7.11167 3.36314 7.10233 3.375 7.09375C3.55672 6.96249 3.77583 6.89165 4 6.8916L4.16602 6.90527C4.33059 6.93126 4.48768 6.99533 4.62402 7.09375C4.63592 7.10235 4.64794 7.11165 4.65918 7.12109C4.84964 7.28136 5.08549 7.37692 5.33301 7.39746C5.5805 7.37697 5.81636 7.28127 6.00684 7.12109L6.04199 7.09375C6.22358 6.96265 6.44205 6.89172 6.66602 6.8916C6.89025 6.8916 7.10924 6.96246 7.29102 7.09375C7.30296 7.10238 7.31489 7.1116 7.32617 7.12109C7.51646 7.2812 7.75176 7.37681 7.99902 7.39746C8.24675 7.37708 8.48319 7.28141 8.67383 7.12109L8.70801 7.09375C8.88976 6.96241 9.10877 6.89165 9.33301 6.8916L9.5 6.90527C9.60971 6.92267 9.71634 6.95662 9.81543 7.00684L9.95801 7.09375L9.99219 7.12109C10.1826 7.28129 10.4186 7.37686 10.666 7.39746C10.9136 7.37703 11.1493 7.28132 11.3398 7.12109C11.351 7.11167 11.3631 7.10233 11.375 7.09375C11.5567 6.96249 11.7758 6.89165 12 6.8916L12.166 6.90527C12.3306 6.93126 12.4877 6.99533 12.624 7.09375C12.6359 7.10235 12.6479 7.11165 12.6592 7.12109C12.7165 7.16936 12.7791 7.20983 12.8438 7.24609C12.509 7.3908 12.1944 7.59761 11.9209 7.87109L11.3086 8.48242C11.1124 8.5469 10.9081 8.58811 10.6992 8.59961C10.6775 8.60079 10.6555 8.60079 10.6338 8.59961C10.162 8.5736 9.71025 8.40697 9.33301 8.12598C8.95576 8.40689 8.50396 8.57365 8.03223 8.59961C8.01052 8.60078 7.9885 8.6008 7.9668 8.59961C7.49495 8.57359 7.0433 8.40706 6.66602 8.12598C6.28887 8.40675 5.83778 8.57361 5.36621 8.59961C5.34433 8.6008 5.32169 8.60081 5.2998 8.59961C4.82795 8.57355 4.37629 8.40711 3.99902 8.12598C3.77699 8.29124 3.52889 8.4153 3.2666 8.49609V13.333C3.2666 13.5273 3.34412 13.7141 3.48145 13.8516C3.61888 13.9889 3.80568 14.0663 4 14.0664H5.40039V12C5.40048 11.4874 5.6034 10.9953 5.96582 10.6328C6.32831 10.2703 6.82037 10.0675 7.33301 10.0674H8.66699C8.96672 10.0674 9.25858 10.1385 9.52246 10.2686L8.71289 11.0791L8.52539 11.2666H7.33301C7.13863 11.2667 6.9519 11.344 6.81445 11.4814C6.67708 11.6189 6.5997 11.8057 6.59961 12V14.0664H7.00195C7.00769 14.4774 7.09944 14.886 7.27441 15.2666H4C3.48742 15.2665 2.99529 15.0626 2.63281 14.7002C2.27045 14.3377 2.06738 13.8456 2.06738 13.333V8.50293C1.78061 8.40935 1.51602 8.25137 1.29883 8.03418C0.936417 7.67168 0.733463 7.17958 0.733398 6.66699V4.66699C0.733398 4.60352 0.745432 4.54275 0.763672 4.48535C0.768611 4.46978 0.772081 4.45368 0.77832 4.43848C0.804194 4.37558 0.842212 4.31954 0.886719 4.26953C0.894506 4.26078 0.900791 4.25058 0.90918 4.24219L3.84863 1.30176V1.30273C4.02823 1.12229 4.24147 0.978583 4.47656 0.880859C4.71195 0.783059 4.96484 0.733284 5.21973 0.733398H10.7793L10.9697 0.742188ZM5.21875 1.93262C5.12228 1.93263 5.0266 1.95227 4.9375 1.98926C4.84819 2.02639 4.76643 2.08082 4.69824 2.14941L2.78027 4.06738H13.2188L11.3008 2.14941C11.2327 2.081 11.1516 2.02634 11.0625 1.98926C10.9733 1.95222 10.8769 1.93256 10.7803 1.93262H5.21875Z" fill="currentColor"/>
            <g clipPath="url(#affiliateShopClip1)">
              <path d="M12.2355 14.1214L11.7641 14.5928C11.1132 15.2437 10.058 15.2437 9.4071 14.5928C8.75623 13.9419 8.75623 12.8866 9.4071 12.2358L9.87851 11.7644M14.1211 12.2358L14.5926 11.7644C15.2434 11.1135 15.2434 10.0582 14.5926 9.40734C13.9417 8.75647 12.8864 8.75647 12.2355 9.40734L11.7641 9.87875M10.8332 13.1667L13.1665 10.8334" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          </g>
          <defs>
            <clipPath id="affiliateShopClip0"><rect width="16" height="16" fill="white"/></clipPath>
            <clipPath id="affiliateShopClip1"><rect width="8" height="8" fill="white" transform="translate(8 8)"/></clipPath>
          </defs>
        </svg>
      ) : icon === "grid-alt" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
          <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
          <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
          <rect x="9" y="9" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      ) : icon === "store" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#affiliateStoreClip)">
            <path d="M1.33301 4.66671L4.27301 1.72671C4.39705 1.60193 4.54455 1.50293 4.70703 1.43543C4.8695 1.36792 5.04373 1.33324 5.21967 1.33337H10.7797C10.9556 1.33324 11.1298 1.36792 11.2923 1.43543C11.4548 1.50293 11.6023 1.60193 11.7263 1.72671L14.6663 4.66671" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.66699 8V13.3333C2.66699 13.687 2.80747 14.0261 3.05752 14.2761C3.30756 14.5262 3.6467 14.6667 4.00033 14.6667H12.0003C12.3539 14.6667 12.6931 14.5262 12.9431 14.2761C13.1932 14.0261 13.3337 13.687 13.3337 13.3333V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 14.6666V12C10 11.6463 9.85952 11.3072 9.60948 11.0572C9.35943 10.8071 9.02029 10.6666 8.66667 10.6666H7.33333C6.97971 10.6666 6.64057 10.8071 6.39052 11.0572C6.14048 11.3072 6 11.6463 6 12V14.6666" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.33301 4.66663H14.6663" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.6663 4.66663V6.66663C14.6663 7.02025 14.5259 7.35939 14.2758 7.60943C14.0258 7.85948 13.6866 7.99996 13.333 7.99996C12.9435 7.97852 12.5715 7.83112 12.273 7.57996C12.1935 7.52248 12.0978 7.49153 11.9997 7.49153C11.9015 7.49153 11.8059 7.52248 11.7263 7.57996C11.4279 7.83112 11.0559 7.97852 10.6663 7.99996C10.2768 7.97852 9.90483 7.83112 9.60634 7.57996C9.52679 7.52248 9.43115 7.49153 9.33301 7.49153C9.23486 7.49153 9.13922 7.52248 9.05967 7.57996C8.76119 7.83112 8.38918 7.97852 7.99967 7.99996C7.61016 7.97852 7.23816 7.83112 6.93967 7.57996C6.86013 7.52248 6.76448 7.49153 6.66634 7.49153C6.5682 7.49153 6.47255 7.52248 6.39301 7.57996C6.09452 7.83112 5.72252 7.97852 5.33301 7.99996C4.9435 7.97852 4.57149 7.83112 4.27301 7.57996C4.19346 7.52248 4.09782 7.49153 3.99967 7.49153C3.90153 7.49153 3.80589 7.52248 3.72634 7.57996C3.42785 7.83112 3.05585 7.97852 2.66634 7.99996C2.31272 7.99996 1.97358 7.85948 1.72353 7.60943C1.47348 7.35939 1.33301 7.02025 1.33301 6.66663V4.66663" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="affiliateStoreClip"><rect width="16" height="16" fill="white"/></clipPath>
          </defs>
        </svg>
      ) : icon === "cog" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#affiliateCogClip)">
            <path d="M7.99967 10C9.10424 10 9.99967 9.10461 9.99967 8.00004C9.99967 6.89547 9.10424 6.00004 7.99967 6.00004C6.8951 6.00004 5.99967 6.89547 5.99967 8.00004C5.99967 9.10461 6.8951 10 7.99967 10Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.4845 9.81822C12.4038 10.001 12.3798 10.2038 12.4154 10.4004C12.4511 10.597 12.5448 10.7784 12.6845 10.9213L12.7209 10.9576C12.8336 11.0702 12.923 11.2039 12.984 11.351C13.045 11.4982 13.0764 11.6559 13.0764 11.8152C13.0764 11.9745 13.045 12.1322 12.984 12.2794C12.923 12.4265 12.8336 12.5602 12.7209 12.6728C12.6083 12.7855 12.4746 12.8749 12.3275 12.9359C12.1803 12.9969 12.0226 13.0283 11.8633 13.0283C11.704 13.0283 11.5463 12.9969 11.3991 12.9359C11.252 12.8749 11.1183 12.7855 11.0057 12.6728L10.9694 12.6364C10.8265 12.4967 10.6451 12.403 10.4485 12.3673C10.2519 12.3317 10.0491 12.3557 9.86634 12.4364C9.68709 12.5132 9.53421 12.6408 9.42653 12.8034C9.31884 12.966 9.26106 13.1565 9.26028 13.3516V13.4546C9.26028 13.7761 9.13257 14.0844 8.90526 14.3117C8.67794 14.539 8.36963 14.6667 8.04816 14.6667C7.72668 14.6667 7.41838 14.539 7.19106 14.3117C6.96374 14.0844 6.83604 13.7761 6.83604 13.4546V13.4C6.83135 13.1994 6.76641 13.0049 6.64968 12.8417C6.53295 12.6785 6.36982 12.5542 6.18149 12.4849C5.99869 12.4042 5.79592 12.3801 5.59932 12.4158C5.40271 12.4514 5.2213 12.5452 5.07846 12.6849L5.0421 12.7213C4.92953 12.834 4.79584 12.9234 4.64869 12.9844C4.50154 13.0454 4.34381 13.0768 4.18452 13.0768C4.02523 13.0768 3.8675 13.0454 3.72035 12.9844C3.5732 12.9234 3.43952 12.834 3.32695 12.7213C3.21425 12.6087 3.12484 12.475 3.06384 12.3278C3.00285 12.1807 2.97145 12.023 2.97145 11.8637C2.97145 11.7044 3.00285 11.5467 3.06384 11.3995C3.12484 11.2524 3.21425 11.1187 3.32695 11.0061L3.36331 10.9697C3.50303 10.8269 3.59676 10.6455 3.6324 10.4489C3.66805 10.2523 3.64399 10.0495 3.56331 9.86671C3.48648 9.68745 3.35892 9.53458 3.19632 9.42689C3.03372 9.31921 2.84318 9.26142 2.64816 9.26065H2.54513C2.22365 9.26065 1.91535 9.13294 1.68803 8.90562C1.46071 8.67831 1.33301 8.37 1.33301 8.04853C1.33301 7.72705 1.46071 7.41874 1.68803 7.19143C1.91535 6.96411 2.22365 6.8364 2.54513 6.8364H2.59967C2.80028 6.83171 2.99483 6.76678 3.15804 6.65005C3.32125 6.53331 3.44556 6.37018 3.51483 6.18186C3.5955 5.99906 3.61957 5.79629 3.58392 5.59968C3.54827 5.40308 3.45455 5.22166 3.31483 5.07883L3.27846 5.04246C3.16576 4.92989 3.07636 4.79621 3.01536 4.64906C2.95436 4.50191 2.92296 4.34418 2.92296 4.18489C2.92296 4.0256 2.95436 3.86787 3.01536 3.72072C3.07636 3.57357 3.16576 3.43989 3.27846 3.32731C3.39104 3.21461 3.52472 3.12521 3.67187 3.06421C3.81902 3.00321 3.97675 2.97181 4.13604 2.97181C4.29533 2.97181 4.45306 3.00321 4.60021 3.06421C4.74736 3.12521 4.88104 3.21461 4.99361 3.32731L5.02998 3.36368C5.17281 3.5034 5.35423 3.59712 5.55083 3.63277C5.74744 3.66842 5.95021 3.64435 6.13301 3.56368H6.18149C6.36075 3.48685 6.51362 3.35929 6.62131 3.19669C6.72899 3.03409 6.78678 2.84355 6.78755 2.64853V2.5455C6.78755 2.22402 6.91526 1.91571 7.14258 1.6884C7.36989 1.46108 7.6782 1.33337 7.99967 1.33337C8.32115 1.33337 8.62946 1.46108 8.85677 1.6884C9.08409 1.91571 9.2118 2.22402 9.2118 2.5455V2.60004C9.21257 2.79506 9.27036 2.9856 9.37804 3.1482C9.48572 3.3108 9.6386 3.43837 9.81786 3.51519C10.0007 3.59587 10.2034 3.61993 10.4 3.58429C10.5966 3.54864 10.7781 3.45491 10.9209 3.31519L10.9572 3.27883C11.0698 3.16613 11.2035 3.07672 11.3507 3.01573C11.4978 2.95473 11.6555 2.92333 11.8148 2.92333C11.9741 2.92333 12.1318 2.95473 12.279 3.01573C12.4261 3.07672 12.5598 3.16613 12.6724 3.27883C12.7851 3.3914 12.8745 3.52509 12.9355 3.67223C12.9965 3.81938 13.0279 3.97711 13.0279 4.1364C13.0279 4.2957 12.9965 4.45343 12.9355 4.60057C12.8745 4.74772 12.7851 4.88141 12.6724 4.99398L12.636 5.03034C12.4963 5.17318 12.4026 5.3546 12.3669 5.5512C12.3313 5.7478 12.3554 5.95058 12.436 6.13337V6.18186C12.5129 6.36111 12.6404 6.51399 12.803 6.62167C12.9656 6.72935 13.1562 6.78714 13.3512 6.78792H13.4542C13.7757 6.78792 14.084 6.91562 14.3113 7.14294C14.5386 7.37026 14.6663 7.67857 14.6663 8.00004C14.6663 8.32151 14.5386 8.62982 14.3113 8.85714C14.084 9.08446 13.7757 9.21216 13.4542 9.21216H13.3997C13.2047 9.21294 13.0141 9.27073 12.8515 9.37841C12.6889 9.48609 12.5613 9.63897 12.4845 9.81822Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="affiliateCogClip"><rect width="16" height="16" fill="white"/></clipPath>
          </defs>
        </svg>
      ) : icon === "credit-cards" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.99967 11.3333L7.99967 13.3333L5.99967 11.3333M7.99967 13.3333V8.66663M14.6663 5.99996H1.33301M3.66634 12H3.46634C2.7196 12 2.34624 12 2.06102 11.8546C1.81014 11.7268 1.60616 11.5228 1.47833 11.2719C1.33301 10.9867 1.33301 10.6134 1.33301 9.86663V4.79996C1.33301 4.05322 1.33301 3.67985 1.47833 3.39464C1.60616 3.14376 1.81014 2.93978 2.06102 2.81195C2.34624 2.66663 2.7196 2.66663 3.46634 2.66663H12.533C13.2797 2.66663 13.6531 2.66663 13.9383 2.81195C14.1892 2.93978 14.3932 3.14376 14.521 3.39464C14.6663 3.67986 14.6663 4.05322 14.6663 4.79996V9.86663C14.6663 10.6134 14.6663 10.9867 14.521 11.2719C14.3932 11.5228 14.1892 11.7268 13.9383 11.8546C13.6531 12 13.2797 12 12.533 12H12.333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : icon === "coin" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#affiliateCoinClip)">
            <path d="M9.01933 5.56795C8.63772 5.84001 8.17072 6.00004 7.66634 6.00004C6.37768 6.00004 5.33301 4.95537 5.33301 3.66671C5.33301 2.37804 6.37768 1.33337 7.66634 1.33337C8.50167 1.33337 9.23447 1.77232 9.64668 2.43214M3.99967 13.3915H5.73987C5.96676 13.3915 6.19226 13.4185 6.41222 13.4725L8.25094 13.9193C8.6499 14.0165 9.06553 14.0259 9.46866 13.9476L11.5017 13.5521C12.0387 13.4475 12.5327 13.1903 12.9199 12.8137L14.3583 11.4145C14.769 11.0156 14.769 10.3683 14.3583 9.96875C13.9884 9.609 13.4028 9.5685 12.9844 9.87358L11.3081 11.0966C11.068 11.2721 10.7759 11.3666 10.4754 11.3666H8.85667L9.88705 11.3665C10.4678 11.3665 10.9382 10.9089 10.9382 10.344V10.1395C10.9382 9.67037 10.6101 9.26135 10.1424 9.14795L8.55207 8.7612C8.29326 8.69843 8.02821 8.66671 7.76177 8.66671C7.11856 8.66671 5.95427 9.19925 5.95427 9.19925L3.99967 10.0166M13.333 4.33337C13.333 5.62204 12.2883 6.66671 10.9997 6.66671C9.71101 6.66671 8.66634 5.62204 8.66634 4.33337C8.66634 3.04471 9.71101 2.00004 10.9997 2.00004C12.2883 2.00004 13.333 3.04471 13.333 4.33337ZM1.33301 9.73337L1.33301 13.6C1.33301 13.9734 1.33301 14.1601 1.40567 14.3027C1.46959 14.4281 1.57157 14.5301 1.69701 14.594C1.83962 14.6667 2.02631 14.6667 2.39967 14.6667H2.93301C3.30638 14.6667 3.49306 14.6667 3.63567 14.594C3.76111 14.5301 3.8631 14.4281 3.92701 14.3027C3.99967 14.1601 3.99967 13.9734 3.99967 13.6V9.73337C3.99967 9.36001 3.99967 9.17332 3.92701 9.03071C3.8631 8.90527 3.76111 8.80329 3.63567 8.73937C3.49306 8.66671 3.30638 8.66671 2.93301 8.66671L2.39967 8.66671C2.02631 8.66671 1.83962 8.66671 1.69701 8.73937C1.57157 8.80328 1.46959 8.90527 1.40567 9.03071C1.33301 9.17332 1.33301 9.36001 1.33301 9.73337Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="affiliateCoinClip"><rect width="16" height="16" fill="white"/></clipPath>
          </defs>
        </svg>
      ) : icon === "wallet" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.99967 7.33329V9.99996M11.9997 5.99996V8.66662M11.333 2.66663C12.9655 2.66663 13.8484 2.91647 14.2878 3.11025C14.3463 3.13606 14.3755 3.14897 14.4599 3.22954C14.5105 3.27784 14.6029 3.41955 14.6267 3.48535C14.6663 3.59512 14.6663 3.65512 14.6663 3.77512V10.9407C14.6663 11.5466 14.6663 11.8495 14.5755 12.0052C14.4831 12.1636 14.3939 12.2372 14.221 12.2981C14.0509 12.3579 13.7077 12.292 13.0211 12.1601C12.5406 12.0677 11.9707 12 11.333 12C9.33301 12 7.33301 13.3333 4.66634 13.3333C3.03387 13.3333 2.15092 13.0835 1.7116 12.8897C1.65309 12.8639 1.62384 12.851 1.53941 12.7704C1.4888 12.7221 1.39642 12.5804 1.37265 12.5146C1.33301 12.4048 1.33301 12.3448 1.33301 12.2248L1.33301 5.05919C1.33301 4.45335 1.33301 4.15043 1.42386 3.99472C1.51628 3.83634 1.6054 3.7627 1.77838 3.70183C1.94843 3.64199 2.2917 3.70795 2.97823 3.83986C3.45875 3.93219 4.02866 3.99996 4.66634 3.99996C6.66634 3.99996 8.66634 2.66663 11.333 2.66663ZM9.66634 7.99996C9.66634 8.92043 8.92015 9.66662 7.99967 9.66662C7.0792 9.66662 6.33301 8.92043 6.33301 7.99996C6.33301 7.07948 7.0792 6.33329 7.99967 6.33329C8.92015 6.33329 9.66634 7.07948 9.66634 7.99996Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : icon === "pointer" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.3337 6.66671V4.53337C13.3337 3.41327 13.3337 2.85322 13.1157 2.42539C12.9239 2.04907 12.618 1.74311 12.2416 1.55136C11.8138 1.33337 11.2538 1.33337 10.1337 1.33337H5.86699C4.74689 1.33337 4.18683 1.33337 3.75901 1.55136C3.38269 1.74311 3.07673 2.04907 2.88498 2.42539C2.66699 2.85322 2.66699 3.41327 2.66699 4.53337V11.4667C2.66699 12.5868 2.66699 13.1469 2.88498 13.5747C3.07673 13.951 3.38269 14.257 3.75901 14.4487C4.18683 14.6667 4.74689 14.6667 5.86699 14.6667H7.00033M8.66699 7.33337H5.33366M7.33366 10H5.33366M10.667 4.66671H5.33366" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <g clipPath="url(#affiliatePointerClip)">
            <path d="M12.3333 12.3333L14.3333 14.3333M9 9L11.3567 14.6567L12.1933 12.1933L14.6567 11.3567L9 9Z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="affiliatePointerClip"><rect width="8" height="8" fill="white" transform="translate(8 8)"/></clipPath>
          </defs>
        </svg>
      ) : icon === "clipboard" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.3337 6.66671V4.53337C13.3337 3.41327 13.3337 2.85322 13.1157 2.42539C12.9239 2.04907 12.618 1.74311 12.2416 1.55136C11.8138 1.33337 11.2538 1.33337 10.1337 1.33337H5.86699C4.74689 1.33337 4.18683 1.33337 3.75901 1.55136C3.38269 1.74311 3.07673 2.04907 2.88498 2.42539C2.66699 2.85322 2.66699 3.41327 2.66699 4.53337V11.4667C2.66699 12.5868 2.66699 13.1469 2.88498 13.5747C3.07673 13.951 3.38269 14.257 3.75901 14.4487C4.18683 14.6667 4.74689 14.6667 5.86699 14.6667H7.00033M8.66699 7.33337H5.33366M7.33366 10H5.33366M10.667 4.66671H5.33366" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.3097 11.1V10.2C13.3097 9.53726 12.7233 9 12 9C11.2767 9 10.6903 9.53726 10.6903 10.2V11.1M9.24703 11.5056L9.05058 13.4256C8.99472 13.9715 8.96679 14.2445 9.06566 14.4553C9.15251 14.6405 9.3047 14.7936 9.49784 14.8901C9.71771 15 10.0169 15 10.6153 15H13.3847C13.9831 15 14.2823 15 14.5022 14.8901C14.6953 14.7936 14.8475 14.6405 14.9343 14.4553C15.0332 14.2445 15.0053 13.9715 14.9494 13.4256L14.753 11.5056C14.7058 11.0446 14.6822 10.8141 14.5691 10.6398C14.4694 10.4864 14.3222 10.3635 14.1461 10.287C13.9462 10.2 13.6935 10.2 13.1882 10.2L10.8118 10.2C10.3065 10.2 10.0538 10.2 9.85388 10.287C9.67781 10.3635 9.53058 10.4864 9.43093 10.6398C9.31779 10.8141 9.2942 11.0446 9.24703 11.5056Z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : icon === "files" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.33366 1.51306V4.26676C9.33366 4.64012 9.33366 4.82681 9.40632 4.96941C9.47024 5.09486 9.57222 5.19684 9.69767 5.26076C9.84027 5.33342 10.027 5.33342 10.4003 5.33342H13.154M10.667 8.66671H5.33366M10.667 11.3334H5.33366M6.66699 6.00004H5.33366M9.33366 1.33337H5.86699C4.74689 1.33337 4.18683 1.33337 3.75901 1.55136C3.38269 1.74311 3.07673 2.04907 2.88498 2.42539C2.66699 2.85322 2.66699 3.41327 2.66699 4.53337V11.4667C2.66699 12.5868 2.66699 13.1469 2.88498 13.5747C3.07673 13.951 3.38269 14.257 3.75901 14.4487C4.18683 14.6667 4.74689 14.6667 5.86699 14.6667H10.1337C11.2538 14.6667 11.8138 14.6667 12.2416 14.4487C12.618 14.257 12.9239 13.951 13.1157 13.5747C13.3337 13.1469 13.3337 12.5868 13.3337 11.4667V5.33337L9.33366 1.33337Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : icon === "cup" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#affiliateCupClip)">
            <path d="M7.99967 10C5.79054 10 3.99967 8.20918 3.99967 6.00004V2.29634C3.99967 2.02044 3.99967 1.88249 4.03988 1.77203C4.10728 1.58685 4.25315 1.44098 4.43833 1.37358C4.54879 1.33337 4.68674 1.33337 4.96264 1.33337H11.0367C11.3126 1.33337 11.4506 1.33337 11.561 1.37358C11.7462 1.44098 11.8921 1.58685 11.9595 1.77203C11.9997 1.88249 11.9997 2.02044 11.9997 2.29634V6.00004C11.9997 8.20918 10.2088 10 7.99967 10ZM7.99967 10V12M11.9997 2.66671H13.6663C13.977 2.66671 14.1323 2.66671 14.2548 2.71745C14.4181 2.78512 14.5479 2.9149 14.6156 3.07825C14.6663 3.20077 14.6663 3.35608 14.6663 3.66671V4.00004C14.6663 4.62002 14.6663 4.93001 14.5982 5.18435C14.4133 5.87453 13.8742 6.41362 13.184 6.59856C12.9296 6.66671 12.6197 6.66671 11.9997 6.66671M3.99967 2.66671H2.33301C2.02238 2.66671 1.86707 2.66671 1.74455 2.71745C1.5812 2.78512 1.45142 2.9149 1.38375 3.07825C1.33301 3.20077 1.33301 3.35608 1.33301 3.66671V4.00004C1.33301 4.62002 1.33301 4.93001 1.40116 5.18435C1.58609 5.87453 2.12519 6.41362 2.81537 6.59856C3.0697 6.66671 3.37969 6.66671 3.99967 6.66671M4.96264 14.6667H11.0367C11.2004 14.6667 11.333 14.5341 11.333 14.3704C11.333 13.0613 10.2718 12 8.96264 12H7.03671C5.72759 12 4.66634 13.0613 4.66634 14.3704C4.66634 14.5341 4.799 14.6667 4.96264 14.6667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="affiliateCupClip"><rect width="16" height="16" fill="white"/></clipPath>
          </defs>
        </svg>
      ) : icon === "tag" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 6.33333L5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.74536 0.854981C7.91343 0.820459 8.08705 0.820491 8.25512 0.854981C8.46657 0.89847 8.65475 1.01004 8.80981 1.09619L13.7434 3.8374C13.9069 3.92821 14.1113 4.03412 14.2649 4.20068C14.387 4.33326 14.4798 4.49046 14.5364 4.66162C14.6075 4.8769 14.5998 5.10735 14.5998 5.29443V7.05518C14.2039 6.97762 13.7955 6.98345 13.4006 7.06787V5.68604L8.59985 8.35205V11.1929L7.87231 11.9204C7.6836 12.1091 7.52804 12.3189 7.40063 12.5396V8.35205L2.59985 5.68604V10.7056C2.59985 10.8265 2.6009 10.8913 2.60375 10.939C2.60621 10.9797 2.60905 10.9774 2.60375 10.9614C2.60666 10.9702 2.61123 10.979 2.61743 10.9858C2.60641 10.974 2.60418 10.976 2.63793 10.9976C2.67816 11.0232 2.73461 11.0552 2.84008 11.1138L7.05493 13.4536C6.96406 13.9206 6.98697 14.4052 7.12133 14.8638L2.25707 12.1626C2.09359 12.0718 1.88912 11.9659 1.73559 11.7993C1.61345 11.6667 1.52066 11.5095 1.46411 11.3384C1.39299 11.1231 1.40063 10.8927 1.40063 10.7056V5.29443C1.40063 5.10737 1.39304 4.87689 1.46411 4.66162C1.52066 4.49047 1.61346 4.33326 1.73559 4.20068C1.88911 4.0341 2.09358 3.92821 2.25707 3.8374L7.19067 1.09619C7.34571 1.01006 7.53391 0.898521 7.74536 0.854981ZM7.96801 2.04053C7.92743 2.06011 7.8739 2.09032 7.77368 2.146L3.23461 4.6665L8.00024 7.31299L12.7649 4.6665L8.2268 2.146C8.12655 2.0903 8.07304 2.0601 8.03247 2.04053C7.9983 2.02406 7.99866 2.02759 8.01391 2.03076C8.00512 2.02899 7.99535 2.02896 7.98657 2.03076C8.00208 2.02757 8.00256 2.02386 7.96801 2.04053Z" fill="currentColor"/>
          <g clipPath="url(#affiliateTagClip)">
            <path d="M12.2355 14.1214L11.7641 14.5928C11.1132 15.2437 10.058 15.2437 9.4071 14.5928C8.75623 13.9419 8.75623 12.8866 9.4071 12.2358L9.87851 11.7644M14.1211 12.2358L14.5926 11.7644C15.2434 11.1135 15.2434 10.0582 14.5926 9.40734C13.9417 8.75647 12.8864 8.75647 12.2355 9.40734L11.7641 9.87875M10.8332 13.1667L13.1665 10.8334" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="affiliateTagClip"><rect width="8" height="8" fill="white" transform="translate(8 8)"/></clipPath>
          </defs>
        </svg>
      ) : icon === "unlink" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#affiliateUnlinkClip)">
            <path d="M5.66634 10.3332L10.333 5.66657M5.99967 2.66659V1.33325M9.99967 13.3333V14.6666M2.66634 5.99992H1.33301M13.333 9.99992H14.6663M3.27582 3.27606L2.33301 2.33325M12.7236 12.7237L13.6664 13.6665M7.9997 11.7711L6.58548 13.1853C5.54409 14.2267 3.85565 14.2267 2.81425 13.1853C1.77285 12.1439 1.77285 10.4555 2.81425 9.41407L4.22846 7.99986M11.7709 7.99986L13.1851 6.58565C14.2265 5.54425 14.2265 3.85581 13.1851 2.81441C12.1437 1.77301 10.4553 1.77301 9.41391 2.81441L7.9997 4.22862" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="affiliateUnlinkClip"><rect width="16" height="16" fill="white"/></clipPath>
          </defs>
        </svg>
      ) : icon === "link" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.47167 12.2425L7.52886 13.1853C6.22711 14.4871 4.11656 14.4871 2.81481 13.1853C1.51306 11.8836 1.51306 9.77305 2.81481 8.4713L3.75762 7.52849M12.2429 8.4713L13.1857 7.52849C14.4875 6.22674 14.4875 4.11619 13.1857 2.81445C11.884 1.5127 9.77341 1.5127 8.47167 2.81445L7.52886 3.75725M5.66693 10.3332L10.3336 5.66655" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <Icon name={icon} size={14} />
      )}
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
    return (
      <button
        type="button"
        title={group.label}
        onClick={onToggle}
        className={[
          "w-full flex items-center justify-center p-2 rounded-lg transition-colors",
          hasActiveChild
            ? "bg-[var(--color-primary-100)] text-[var(--color-neutral-900)]"
            : "bg-white text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
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

export function AffiliateSidebar({ active }: { active?: string }) {
  const navigate = useNavigate();
  const drawerIsOpen = useDrawerOpen();
  const groupOfActive = SIDEBAR_ENTRIES.findIndex(
    (e) => e.kind === "group" && e.children.some((c) => c.label === active)
  );
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>(
    groupOfActive >= 0 ? { [groupOfActive]: true } : {}
  );
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("affiliateSidebarCollapsed") === "1"; } catch { return false; }
  });
  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      try { localStorage.setItem("affiliateSidebarCollapsed", next ? "1" : "0"); } catch { /* ignore */ }
      return next;
    });
  };

  const go = (leaf: SidebarLeaf) => {
    if (leaf.to) {
      navigate(leaf.to);
      setDrawerOpen(false);
    }
  };

  const navContent = (isMobile = false) => (
    <>
      <nav className={`${!isMobile && collapsed ? "px-3" : "px-4"} flex flex-col gap-2`}>
        {SIDEBAR_ENTRIES.map((entry, i) => {
          if (entry.kind === "leaf") {
            return (
              <LeafRow
                key={entry.label}
                icon={entry.icon}
                label={entry.label}
                active={entry.label === active}
                collapsed={!isMobile && collapsed}
                onClick={() => go(entry)}
              />
            );
          }
          return (
            <GroupRow
              key={entry.label}
              group={entry}
              open={!!openGroups[i]}
              collapsed={!isMobile && collapsed}
              onToggle={() => setOpenGroups((s) => ({ ...s, [i]: !s[i] }))}
              activeChildLabel={active}
              onSelectChild={go}
            />
          );
        })}
      </nav>

      <div className={`${!isMobile && collapsed ? "px-3" : "px-4"} mt-auto flex flex-col gap-2 pt-4`}>
        <span className="block w-full h-px bg-[var(--color-neutral-200)]" />
        <a
          href="/"
          title={!isMobile && collapsed ? "BMS E-Commerce" : undefined}
          className={`w-full flex items-center ${!isMobile && collapsed ? "justify-center" : "gap-2.5"} px-2 py-2 rounded-lg text-[14px] text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] transition-colors`}
        >
          <IconBadge icon="cart" />
          {(isMobile || !collapsed) && <><span className="flex-1 min-w-0 truncate">BMS E-Commerce</span><svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0"><path d="M12.5 2.5H17.5L17.5 7.5M17.5 2.5L10.8333 9.16667M8.33333 4.16667H6.5C5.09987 4.16667 4.3998 4.16667 3.86502 4.43915C3.39462 4.67883 3.01217 5.06129 2.77248 5.53169C2.5 6.06647 2.5 6.76654 2.5 8.16667V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H11.8333C13.2335 17.5 13.9335 17.5 14.4683 17.2275C14.9387 16.9878 15.3212 16.6054 15.5608 16.135C15.8333 15.6002 15.8333 14.9001 15.8333 13.5V11.6667" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></>}
        </a>
        <a
          href="/seller/overview"
          title={!isMobile && collapsed ? "BMS Seller" : undefined}
          className={`w-full flex items-center ${!isMobile && collapsed ? "justify-center" : "gap-2.5"} px-2 py-2 rounded-lg text-[14px] text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] transition-colors`}
        >
          <IconBadge icon="store" />
          {(isMobile || !collapsed) && <><span className="flex-1 min-w-0 truncate">BMS Seller</span><svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0"><path d="M12.5 2.5H17.5L17.5 7.5M17.5 2.5L10.8333 9.16667M8.33333 4.16667H6.5C5.09987 4.16667 4.3998 4.16667 3.86502 4.43915C3.39462 4.67883 3.01217 5.06129 2.77248 5.53169C2.5 6.06647 2.5 6.76654 2.5 8.16667V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H11.8333C13.2335 17.5 13.9335 17.5 14.4683 17.2275C14.9387 16.9878 15.3212 16.6054 15.5608 16.135C15.8333 15.6002 15.8333 14.9001 15.8333 13.5V11.6667" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></>}
        </a>
        {!isMobile && (
          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? "ขยายเมนู" : "ย่อเมนู"}
            className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5"} px-2 py-2 rounded-lg text-[14px] text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] transition-colors`}
          >
            {!collapsed && <span className="flex-1 text-left">ย่อเมนู</span>}
            <Icon name="arrow-left-circle" size={18} className={`text-[var(--color-neutral-600)] transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex ${collapsed ? "w-[68px]" : "w-[232px]"} shrink-0 bg-white border-r border-[var(--color-neutral-300)] sticky top-[72px] self-start h-[calc(100vh-72px)] overflow-y-auto scrollbar-none flex-col py-4 transition-[width] duration-200`}>
        {navContent()}
      </aside>

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed inset-0 z-40 ${drawerIsOpen ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${drawerIsOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute top-0 left-0 h-full w-[280px] max-w-[85vw] bg-white shadow-xl flex flex-col transition-transform duration-200 ${drawerIsOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-4 h-[60px] shrink-0 border-b border-[var(--color-neutral-200)]">
            <span className="flex items-center gap-2">
              <BrightifyLogo size={28} />
              <span className="text-[18px] font-medium text-[var(--color-primary)]">BRIGHTIFY</span>
            </span>
            <button
              type="button"
              aria-label="ปิดเมนู"
              onClick={() => setDrawerOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-neutral-200)]"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col justify-between py-4">{navContent(true)}</div>
        </aside>
      </div>
    </>
  );
}
