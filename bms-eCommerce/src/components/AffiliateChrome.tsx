import { useState, useSyncExternalStore } from "react";
import { useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import Icon from "./landing/Icon";
import CartIcon from "./CartIcon";
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
      {icon === "cart" ? <CartIcon size={14} /> : <Icon name={icon} size={14} />}
    </span>
  );
}

function LeafRow({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-[14px] transition-colors",
        active
          ? "bg-[var(--color-primary-100)] text-[var(--color-neutral-900)] font-medium"
          : "bg-white text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
      ].join(" ")}
    >
      <IconBadge icon={icon} variant={active ? "primary" : "default"} />
      <span className="flex-1 min-w-0 truncate">{label}</span>
    </button>
  );
}

function GroupRow({
  group,
  open,
  onToggle,
  activeChildLabel,
  onSelectChild,
}: {
  group: SidebarGroup;
  open: boolean;
  onToggle: () => void;
  activeChildLabel?: string;
  onSelectChild: (c: SidebarLeaf) => void;
}) {
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

  const go = (leaf: SidebarLeaf) => {
    if (leaf.to) {
      navigate(leaf.to);
      setDrawerOpen(false);
    }
  };

  const navContent = (
    <>
      <nav className="px-4 flex flex-col gap-2">
        {SIDEBAR_ENTRIES.map((entry, i) => {
          if (entry.kind === "leaf") {
            return (
              <LeafRow
                key={entry.label}
                icon={entry.icon}
                label={entry.label}
                active={entry.label === active}
                onClick={() => go(entry)}
              />
            );
          }
          return (
            <GroupRow
              key={entry.label}
              group={entry}
              open={!!openGroups[i]}
              onToggle={() => setOpenGroups((s) => ({ ...s, [i]: !s[i] }))}
              activeChildLabel={active}
              onSelectChild={go}
            />
          );
        })}
      </nav>

      <div className="flex flex-col gap-2 pt-4">
        <span className="block w-full h-px bg-[var(--color-neutral-200)]" />
        <div className="px-4 flex flex-col gap-2">
          <a
            href="/"
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-[14px] text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] transition-colors"
          >
            <IconBadge icon="cart" />
            <span className="flex-1 min-w-0 truncate">BMS E-Commerce</span>
            <Icon name="popup" size={18} className="text-[var(--color-primary)]" />
          </a>
          <a
            href="/seller/overview"
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-[14px] text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] transition-colors"
          >
            <IconBadge icon="shop" />
            <span className="flex-1 min-w-0 truncate">BMS Seller</span>
            <Icon name="popup" size={18} className="text-[var(--color-primary)]" />
          </a>
          <button
            type="button"
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-[14px] text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] transition-colors"
          >
            <span className="flex-1 text-left">ย่อเมนู</span>
            <Icon name="arrow-left-circle" size={18} className="text-[var(--color-neutral-600)]" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[232px] shrink-0 bg-white border-r border-[var(--color-neutral-300)] sticky top-[72px] self-start h-[calc(100vh-72px)] overflow-y-auto scrollbar-none flex-col justify-between py-4">
        {navContent}
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
          <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col justify-between py-4">{navContent}</div>
        </aside>
      </div>
    </>
  );
}
