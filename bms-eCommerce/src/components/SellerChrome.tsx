import { useState } from "react";
import { useNavigate } from "react-router";
import { Star as StarIcon, LifeBuoy, Store as StoreIcon } from "lucide-react";
import Icon from "./landing/Icon";
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

export function SellerHeader({ active }: { active?: (typeof SELLER_NAV)[number]["id"] }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[var(--color-neutral-300)] px-6 py-[18px]">
      <div className="flex items-center gap-6 w-full">
        <div className="flex items-center gap-6 shrink-0 w-[378px]">
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

        <nav className="flex-1 min-w-0 flex items-center justify-center gap-4 h-9">
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

        <div className="flex items-center justify-end gap-6 shrink-0 w-[378px]">
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
  { kind: "leaf", icon: "cart", label: "คำสั่งซื้อ", to: "/seller/orders" },
  { kind: "leaf", icon: "files", label: "ใบเสนอราคา", to: "/seller/quotes" },
  {
    kind: "group",
    icon: "package",
    label: "สินค้า",
    children: [
      { kind: "leaf", icon: "package", label: "การจัดการสินค้า", to: "/seller/products" },
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
      { kind: "leaf", icon: "dollar", label: "การวิเคราะห์รายได้" },
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
      {icon === "star" ? <StarIcon size={14} /> : <Icon name={icon} size={14} />}
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

export function SellerSidebar({ active }: { active?: string }) {
  const navigate = useNavigate();
  const groupOfActive = SIDEBAR_ENTRIES.findIndex(
    (e) => e.kind === "group" && e.children.some((c) => c.label === active)
  );
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>(
    groupOfActive >= 0 ? { [groupOfActive]: true } : {}
  );
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

  const go = (leaf: SidebarLeaf) => {
    if (leaf.to) navigate(leaf.to);
  };

  return (
    <aside className={`${collapsed ? "w-[68px]" : "w-[232px]"} shrink-0 bg-white border-r border-[var(--color-neutral-300)] sticky top-[72px] self-start h-[calc(100vh-72px)] overflow-y-auto scrollbar-none flex flex-col justify-between py-4 transition-[width] duration-200`}>
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
          {!collapsed && <><span className="flex-1 min-w-0 truncate">BMS E-Commerce</span><Icon name="link" size={16} className="text-[var(--color-neutral-600)]" /></>}
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          title={collapsed ? "BMS Affiliate" : undefined}
          className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5"} px-2 py-2 rounded-lg text-[14px] text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] transition-colors`}
        >
          <IconBadge icon="users" />
          {!collapsed && <><span className="flex-1 min-w-0 truncate">BMS Affiliate</span><Icon name="link" size={16} className="text-[var(--color-neutral-600)]" /></>}
        </a>
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
  );
}
