import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { Input } from "@heroui/react";
import Icon from "./Icon";
import paracetamol from "../../assets/products/p02-paracetamol.jpg";
import avatar from "../../assets/avatar.jpg";

function LoginIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}

function StorefrontIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M3 9v0a3 3 0 0 0 6 0v0a3 3 0 0 0 6 0v0a3 3 0 0 0 6 0" />
      <path d="M4 9.5V20h16V9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

function BrightifyLogo({ size = 36 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center shrink-0 rounded-lg shadow-[0_2px_4px_rgba(4,133,247,0.3)]"
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(135deg, #21bdff 0%, #0485f7 50%, #036ac6 100%)",
      }}
    >
      <span
        className="font-extrabold text-white leading-none"
        style={{ fontSize: size * 0.62 }}
      >
        B
      </span>
    </div>
  );
}

function VDivider() {
  return <span className="h-[18px] w-px bg-white/40 shrink-0" />;
}

function MenuLink({
  iconName,
  customIcon,
  children,
  trailingIcon,
}: {
  iconName?: string;
  customIcon?: React.ReactNode;
  children: React.ReactNode;
  trailingIcon?: string;
}) {
  return (
    <button className="flex items-center gap-1 px-1.5 py-1 rounded-lg text-white text-[13px] lg:text-[14px] font-medium leading-[18px] hover:bg-white/15 active:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition-colors whitespace-nowrap shrink-0">
      {customIcon ?? (iconName && <Icon name={iconName} size={16} />)}
      <span>{children}</span>
      {trailingIcon && <Icon name={trailingIcon} size={16} />}
    </button>
  );
}

const LANGUAGES = [
  { code: "th", label: "ภาษาไทย" },
  { code: "en", label: "English" },
] as const;

function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<(typeof LANGUAGES)[number]["code"]>("th");
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !ref.current) return;
    const update = () => {
      const r = ref.current!.getBoundingClientRect();
      setPos({ top: r.bottom + 8, left: r.left - 47 });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
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

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          "flex items-center gap-1 px-1.5 py-1 rounded-lg",
          "text-white text-[13px] lg:text-[14px] font-medium leading-[18px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition-colors whitespace-nowrap",
          open
            ? "bg-[rgba(0,66,221,0.4)]"
            : "hover:bg-white/15 active:bg-white/20",
        ].join(" ")}
      >
        <Icon name="world" size={16} />
        <span>{current.label}</span>
        <Icon
          name="chevron-down"
          size={16}
          className={open ? "rotate-180 transition-transform" : "transition-transform"}
        />
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          role="listbox"
          style={{ top: pos.top, left: pos.left }}
          className="animate-dropdown fixed w-[155px] z-[1000] bg-white rounded-xl p-2 flex flex-col gap-2 shadow-[0_0_1px_rgba(29,33,45,0.2),0_1px_4px_rgba(29,33,45,0.15),0_16px_32px_rgba(29,33,45,0.1)]"
        >
          {LANGUAGES.map((l) => {
            const selected = l.code === lang;
            return (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={[
                  "w-full flex items-center pl-2 pr-4 py-1 rounded text-left text-[14px] tracking-[-0.006em] leading-6",
                  selected
                    ? "bg-[var(--color-primary-100)] text-[var(--color-primary)]"
                    : "bg-white text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                ].join(" ")}
              >
                {l.label}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}

const HELP_ITEMS = [
  { icon: "book", label: "คู่มือการใช้งาน" },
  { icon: "comments", label: "แชทกับเจ้าหน้าที่" },
  { icon: "phone-set", label: "โทร 02-427-9991" },
  { icon: "question-circle", label: "คำถามที่พบบ่อย FAQ" },
] as const;

function HelpSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !ref.current) return;
    const update = () => {
      const r = ref.current!.getBoundingClientRect();
      setPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
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
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={[
          "flex items-center gap-1 px-1.5 py-1 rounded-lg",
          "text-white text-[13px] lg:text-[14px] font-medium leading-[18px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition-colors whitespace-nowrap",
          open
            ? "bg-[rgba(0,66,221,0.4)]"
            : "hover:bg-white/15 active:bg-white/20",
        ].join(" ")}
      >
        <Icon name="question-circle" size={16} />
        <span>ช่วยเหลือ</span>
        <Icon
          name="chevron-down"
          size={16}
          className={open ? "rotate-180 transition-transform" : "transition-transform"}
        />
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          role="menu"
          style={{ top: pos.top, right: pos.right }}
          className="animate-dropdown fixed w-[220px] z-[1000] bg-white rounded-xl p-2 flex flex-col shadow-[0_0_1px_rgba(29,33,45,0.2),0_1px_4px_rgba(29,33,45,0.15),0_16px_32px_rgba(29,33,45,0.1)]"
        >
          {HELP_ITEMS.map((item, i) => {
            const selected = i === active;
            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setActive(i);
                  setOpen(false);
                }}
                className={[
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-[14px] leading-6 transition-colors",
                  selected
                    ? "bg-[var(--color-primary-100)] text-[var(--color-primary)]"
                    : "text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                ].join(" ")}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}

const CART_ITEMS = [
  {
    id: 1,
    image: paracetamol,
    name: "ยาพาราเซตามอล 1000 mg",
    desc: "แก้ปวดได้ดีที่เดียวนะkmkmkmkmksma",
    price: 100,
  },
  {
    id: 2,
    image: paracetamol,
    name: "ยาพาราเซตามอล 1000 mg",
    desc: "แก้ปวดได้ดีที่เดียวนะkmkmkmkmksma",
    price: 100,
  },
  {
    id: 3,
    image: paracetamol,
    name: "ยาพาราเซตามอล 1000 mg",
    desc: "แก้ปวดได้ดีที่เดียวนะkmkmkmkmksma",
    price: 100,
  },
];

function CartButton() {
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
    <div ref={ref} className="relative group shrink-0">
      <button
        type="button"
        aria-label="ตะกร้า"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={[
          "relative flex items-center justify-center shrink-0",
          "w-9 h-9 rounded-full",
          "border border-transparent transition-all duration-150",
          "active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 focus-visible:ring-offset-1",
          open
            ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/15"
            : "text-[var(--color-neutral-600)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/15",
        ].join(" ")}
      >
        <Icon name="cart" size={22} />
        {CART_ITEMS.length > 0 && (
          <span className="absolute -top-0.5 right-0 min-w-[16px] h-[16px] px-1 rounded-full bg-[var(--color-critical)] text-[9px] font-semibold text-white flex items-center justify-center leading-none ring-2 ring-white">
            {CART_ITEMS.length}
          </span>
        )}
      </button>
      {!open && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 z-50 whitespace-nowrap rounded-md bg-[var(--color-neutral-900)] px-2 py-1 text-[11px] font-medium text-white opacity-0 scale-95 shadow-md transition-all duration-150 group-hover:opacity-100 group-hover:scale-100"
        >
          ตะกร้า
        </span>
      )}

      {open && (
        <div
          role="dialog"
          className="animate-dropdown absolute right-0 top-[calc(100%+8px)] w-[440px] z-50 bg-white rounded-xl shadow-[0_0_1px_rgba(29,33,45,0.2),0_1px_4px_rgba(29,33,45,0.15),0_16px_32px_rgba(29,33,45,0.1)] overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-neutral-300)]">
            <p className="text-[14px] font-semibold text-[var(--color-neutral-900)]">
              สินค้าในตะกร้า
            </p>
            <p className="text-[12px] font-medium text-[var(--color-critical)]">
              {CART_ITEMS.length} ชิ้น
            </p>
          </div>

          <ul className="max-h-[360px] overflow-y-auto">
            {CART_ITEMS.map((it) => {
              return (
                <li
                  key={it.id}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[var(--color-primary-100)]"
                >
                  <img
                    src={it.image}
                    alt={it.name}
                    loading="lazy"
                    decoding="async"
                    className="w-12 h-12 rounded-lg object-cover bg-[var(--color-neutral-200)] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[var(--color-neutral-900)] truncate">
                      {it.name}
                    </p>
                    <p className="text-[12px] text-[var(--color-neutral-600)] truncate">
                      {it.desc}
                    </p>
                  </div>
                  <p className="text-[14px] font-semibold text-[var(--color-primary)] shrink-0">
                    ฿{it.price}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-[var(--color-neutral-300)] px-4 py-3 text-center">
            <a
              href="#"
              className="text-[14px] font-medium text-[var(--color-primary)] hover:underline"
            >
              ดูตะกร้าสินค้า
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

const NOTIFICATIONS = [
  {
    id: 1,
    title: "ดีลสุดพิเศษ! ซื้อ 1 แถม 1",
    desc: "ลดค่าส่งทันที! ฉลองวันช้างไทย",
    time: "2 ชม. ที่แล้ว",
    unread: true,
  },
  {
    id: 2,
    title: "ส่งฟรีทั่วไทย",
    desc: "ลดค่าส่งทันที! ฉลองวันช้างไทย",
    time: "2 ชม. ที่แล้ว",
    unread: true,
  },
  {
    id: 3,
    title: "สินค้าใหม่ล่าสุดมาแล้ว!",
    desc: "ลดค่าส่งทันที! ฉลองวันช้างไทย",
    time: "2 ชม. ที่แล้ว",
    unread: true,
  },
  {
    id: 4,
    title: "โปรส่งท้ายเดือน",
    desc: "ช้อปครบ 1,000 บาท รับฟรีคูปองส่วนลด 100 บาท",
    time: "1 ชั่วโมง ที่แล้ว",
    unread: true,
  },
];

function NotificationButton() {
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

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div ref={ref} className="relative group shrink-0">
      <button
        type="button"
        aria-label="การแจ้งเตือน"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={[
          "relative flex items-center justify-center shrink-0",
          "w-9 h-9 rounded-full",
          "border border-transparent transition-all duration-150",
          "active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 focus-visible:ring-offset-1",
          open
            ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/15"
            : "text-[var(--color-neutral-600)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/15",
        ].join(" ")}
      >
        <Icon name="alarm" size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 right-0 min-w-[16px] h-[16px] px-1 rounded-full bg-[var(--color-critical)] text-[9px] font-semibold text-white flex items-center justify-center leading-none ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {!open && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 z-50 whitespace-nowrap rounded-md bg-[var(--color-neutral-900)] px-2 py-1 text-[11px] font-medium text-white opacity-0 scale-95 shadow-md transition-all duration-150 group-hover:opacity-100 group-hover:scale-100"
        >
          การแจ้งเตือน
        </span>
      )}

      {open && (
        <div
          role="dialog"
          className="animate-dropdown absolute right-0 top-[calc(100%+8px)] w-[400px] z-50 bg-white rounded-xl shadow-[0_0_1px_rgba(29,33,45,0.2),0_1px_4px_rgba(29,33,45,0.15),0_16px_32px_rgba(29,33,45,0.1)] overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-neutral-300)]">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-semibold text-[var(--color-neutral-900)]">
                การแจ้งเตือน
              </p>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[var(--color-critical)] text-white text-[11px] font-semibold leading-none">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              type="button"
              className="text-[12px] font-medium text-[var(--color-primary)] hover:underline"
            >
              อ่านทั้งหมด
            </button>
          </div>

          <ul className="max-h-[420px] overflow-y-auto">
            {NOTIFICATIONS.map((n) => (
              <li
                key={n.id}
                className="relative flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[var(--color-primary-100)]"
              >
                <div className="w-12 h-12 rounded-lg bg-[var(--color-primary-100)] shrink-0" />
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-[13px] font-semibold text-[var(--color-neutral-900)]">
                    {n.title}
                  </p>
                  <p className="text-[12px] text-[var(--color-neutral-600)] mt-0.5">
                    {n.desc}
                  </p>
                  <p className="text-[11px] text-[var(--color-neutral-500)] mt-1">
                    {n.time}
                  </p>
                </div>
                {n.unread && (
                  <span
                    aria-label="ยังไม่อ่าน"
                    className="absolute right-4 top-4 w-2 h-2 rounded-full bg-[var(--color-critical)]"
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="border-t border-[var(--color-neutral-300)] px-4 py-3 text-center">
            <a
              href="#"
              className="text-[14px] font-medium text-[var(--color-primary)] hover:underline"
            >
              ดูการแจ้งเตือนทั้งหมด
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

const PROFILE_ITEMS = [
  { icon: "user", label: "บัญชีของฉัน", href: "/settings" },
  { icon: "package", label: "การสั่งซื้อของฉัน", href: "/settings" },
  { icon: "clipboard", label: "ใบเสนอราคาของฉัน", href: "/settings" },
  { icon: "crown", label: "BMS Member", href: "/settings" },
  { icon: "alarm", label: "การแจ้งเตือน", href: "/settings" },
  { icon: "tag", label: "โค้ดส่วนลด", href: "/settings" },
  { icon: "heart", label: "สิ่งที่ถูกใจ", href: "/settings" },
  { icon: "cog", label: "การตั้งค่า", href: "/settings" },
] as const;

function ProfileMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !ref.current) return;
    const update = () => {
      const r = ref.current!.getBoundingClientRect();
      setPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
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

  const logout = () => {
    sessionStorage.removeItem("loggedIn");
    navigate("/");
  };

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={[
          "flex items-center gap-1.5 pr-1 py-1 rounded-full",
          "transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30",
          open ? "bg-[var(--color-primary)]/10" : "hover:bg-[var(--color-primary)]/5",
        ].join(" ")}
      >
        <img
          src={avatar}
          alt="Profile"
          className={[
            "w-9 h-9 rounded-full object-cover",
            open ? "ring-2 ring-[var(--color-primary)]" : "",
          ].join(" ")}
        />
        <Icon
          name="chevron-down"
          size={18}
          className={[
            "text-[var(--color-neutral-600)] transition-transform",
            open ? "rotate-180 text-[var(--color-primary)]" : "",
          ].join(" ")}
        />
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          role="menu"
          style={{ top: pos.top, right: pos.right }}
          className="animate-dropdown fixed w-[280px] z-[1000] bg-white rounded-2xl overflow-hidden shadow-[0_0_1px_rgba(29,33,45,0.2),0_1px_4px_rgba(29,33,45,0.15),0_16px_32px_rgba(29,33,45,0.1)]"
        >
          {/* Header */}
          <div className="bg-gradient-to-b from-[var(--color-primary-100)] to-white px-4 py-4 flex items-center gap-3">
            <img
              src={avatar}
              alt=""
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-[var(--color-neutral-900)] truncate">
                Paiboon Kaewmong
              </p>
              <p className="text-[12px] text-[var(--color-neutral-600)] mt-0.5">
                <span>2 ผู้ติดตาม</span>
                <span className="mx-1.5 text-[var(--color-neutral-300)]">|</span>
                <span>2 กำลังติดตาม</span>
              </p>
            </div>
          </div>

          {/* Items */}
          <ul className="p-2">
            {PROFILE_ITEMS.map((item, i) => {
              const selected = i === active;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setActive(i);
                      setOpen(false);
                      navigate(item.href);
                    }}
                    className={[
                      "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-[14px] leading-6 transition-colors",
                      selected
                        ? "bg-[var(--color-primary-100)] text-[var(--color-primary)] font-medium"
                        : "text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                    ].join(" ")}
                  >
                    <Icon name={item.icon} size={18} />
                    <span className="flex-1 text-left">{item.label}</span>
                    <Icon name="chevron-right" size={16} className="opacity-60" />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Logout */}
          <div className="border-t border-[var(--color-neutral-300)] p-2">
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-[14px] leading-6 text-[var(--color-critical)] hover:bg-[var(--color-critical)]/10 transition-colors"
            >
              <Icon name="exit" size={18} />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function HeaderIcon({
  iconName,
  badge,
  label,
}: {
  iconName: string;
  badge?: number;
  label?: string;
}) {
  return (
    <div className="relative group shrink-0">
      <button
        aria-label={label}
        className={[
          "relative flex items-center justify-center shrink-0",
          "w-9 h-9 rounded-full",
          "text-[var(--color-neutral-600)]",
          "border border-transparent",
          "transition-all duration-150",
          "hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/15",
          "active:scale-95 active:bg-[var(--color-primary)]/15",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 focus-visible:ring-offset-1",
        ].join(" ")}
      >
        <Icon name={iconName} size={22} />
        {badge !== undefined && (
          <span className="absolute -top-0.5 right-0 min-w-[16px] h-[16px] px-1 rounded-full bg-[var(--color-critical)] text-[9px] font-semibold text-white flex items-center justify-center leading-none ring-2 ring-white">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </button>
      {label && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 z-50 whitespace-nowrap rounded-md bg-[var(--color-neutral-900)] px-2 py-1 text-[11px] font-medium text-white opacity-0 scale-95 shadow-md transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100"
        >
          {label}
        </span>
      )}
    </div>
  );
}

const SEARCH_HISTORY = [
  "กางเกงวิ่งผู้ชาย",
  "เครื่องสำอาง",
  "ครีมทาหน้า",
  "ตู้เสื้อผ้า",
  "มะนาว",
];
const POPULAR_SEARCHES = [
  "เสื้อผ้าแฟชั่น",
  "กางเกงใน",
  "กางเกงยีน",
  "เครื่องวัดหัวใจ",
];

function SearchBar() {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
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

  const select = (term: string) => {
    setValue(term);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative flex-1 lg:flex-none lg:w-[500px]">
      <Input
        aria-label="ค้นหาสินค้า"
        placeholder="ค้นหาสินค้า..."
        value={value}
        onValueChange={setValue}
        onFocus={() => setOpen(true)}
        radius="sm"
        size="sm"
        classNames={{
          base: "w-full",
          inputWrapper: [
            "h-9 pr-0 shadow-none transition-all duration-150",
            "bg-[var(--color-neutral-200)]",
            "border border-transparent",
            "data-[hover=true]:bg-white data-[hover=true]:border-[var(--color-primary-400)]",
            "group-data-[focus=true]:bg-white",
            "group-data-[focus=true]:border-[var(--color-primary)]",
            "group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-[var(--color-primary)]/20",
          ].join(" "),
          input: [
            "text-[14px] text-[var(--color-neutral-800)]",
            "placeholder:text-[var(--color-neutral-500)]",
            "caret-[var(--color-primary)]",
          ].join(" "),
        }}
        endContent={
          <div className="flex items-center h-full">
            {value && (
              <button
                type="button"
                onClick={() => setValue("")}
                className="mr-3 w-5 h-5 rounded-full flex items-center justify-center text-[var(--color-neutral-500)] hover:bg-[var(--color-neutral-300)] hover:text-[var(--color-neutral-800)] active:scale-90 transition-all"
                aria-label="ล้างคำค้นหา"
              >
                <Icon name="close" size={12} />
              </button>
            )}
            <span className="h-9 w-px bg-[var(--color-neutral-300)]" />
            <button
              type="button"
              className="px-3 h-full flex items-center text-[var(--color-neutral-500)] hover:text-[var(--color-primary)] active:scale-95 transition-all"
              aria-label="ค้นหา"
            >
              <Icon name="search" size={16} />
            </button>
          </div>
        }
      />

      {open && (
        <div className="animate-dropdown absolute left-0 right-0 top-[calc(100%+6px)] z-50 bg-white rounded-xl py-3 shadow-[0_0_1px_rgba(29,33,45,0.2),0_1px_4px_rgba(29,33,45,0.15),0_16px_32px_rgba(29,33,45,0.1)]">
          <div className="px-4 pb-2 text-[12px] text-[var(--color-neutral-500)]">
            ประวัติการค้นหา
          </div>
          <ul className="px-2">
            {SEARCH_HISTORY.map((term, i) => (
              <li key={term}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(term)}
                  className={[
                    "w-full text-left px-3 py-1.5 rounded text-[14px] leading-6 transition-colors",
                    i === 0
                      ? "bg-[var(--color-primary-100)] text-[var(--color-primary)]"
                      : "text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                  ].join(" ")}
                >
                  {term}
                </button>
              </li>
            ))}
          </ul>
          <div className="px-4 pt-3 pb-2 text-[12px] text-[var(--color-neutral-500)]">
            สินค้ายอดนิยม
          </div>
          <ul className="px-2">
            {POPULAR_SEARCHES.map((term, i) => (
              <li key={term}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(term)}
                  className="w-full flex items-center gap-3 px-3 py-1.5 rounded text-[14px] leading-6 text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] transition-colors"
                >
                  <span className="text-[var(--color-primary)] font-bold w-4">
                    {i + 1}
                  </span>
                  <span>{term}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn =
    typeof window !== "undefined" && sessionStorage.getItem("loggedIn") === "1";

  return (
    <header className="sticky top-0 z-50 isolate bg-[var(--color-primary)] pb-2">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[120px]">
        {/* Top white bar */}
        <div className="bg-white rounded-b-2xl lg:rounded-b-3xl shadow-[0_4px_6px_rgba(0,118,223,0.4)] p-3 lg:p-[14px]">
          {/* Desktop row (lg+): logo | search | actions in one line */}
          <div className="hidden lg:flex items-center justify-between gap-6 h-9">
            {/* Logo block */}
            <a
              href="/"
              className="flex items-center gap-2 shrink-0 w-[220px] h-9 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 transition-opacity hover:opacity-90"
            >
              <BrightifyLogo size={36} />
              <div className="flex-1 h-full flex flex-col justify-center gap-1.5">
                <p className="text-[20px] font-extrabold text-[var(--color-neutral-900)] leading-[16.8px]">
                  BRIGHTIFY
                </p>
                <p className="text-[12px] text-[var(--color-neutral-500)] leading-[12px]">
                  E-Commerce by BMS
                </p>
              </div>
            </a>

            <SearchBar />

            <div className="flex items-center shrink-0 h-9">
              <div className="flex items-center gap-1">
                <CartButton />
                <HeaderIcon iconName="clipboard" label="ใบเสนอราคา" />
                <HeaderIcon iconName="heart" label="รายการโปรด" />
                <NotificationButton />
              </div>
              {isLoggedIn ? (
                <div className="ml-3">
                  <ProfileMenu />
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="ml-3 bg-[var(--color-primary)] text-white text-[14px] font-semibold rounded-lg h-9 px-3 flex items-center justify-center gap-1.5 hover:bg-[var(--color-primary-600)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 focus-visible:ring-offset-1 transition-all whitespace-nowrap"
                >
                  <LoginIcon size={14} />
                  <span>เข้าสู่ระบบ</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile / tablet rows (< lg) */}
          <div className="lg:hidden flex flex-col gap-2.5">
            {/* Row 1: hamburger / logo / actions */}
            <div className="flex items-center justify-between gap-3 h-9">
              <button
                aria-label="เมนู"
                onClick={() => setMobileMenuOpen((s) => !s)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--color-neutral-700)] hover:bg-[var(--color-primary)]/10 active:scale-95 transition-all"
              >
                <Icon name={mobileMenuOpen ? "close" : "menu"} size={22} />
              </button>

              <a href="/" className="flex items-center gap-2 shrink-0 min-w-0">
                <BrightifyLogo size={32} />
                <p className="text-[17px] sm:text-[18px] font-extrabold text-[var(--color-neutral-900)] leading-none truncate">
                  BRIGHTIFY
                </p>
              </a>

              <div className="flex items-center gap-1 shrink-0">
                <CartButton />
                <NotificationButton />
                {isLoggedIn ? (
                  <ProfileMenu />
                ) : (
                  <button
                    aria-label="เข้าสู่ระบบ"
                    onClick={() => navigate("/login")}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-600)] active:scale-95 transition-all"
                  >
                    <LoginIcon size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Row 2: full-width search */}
            <SearchBar />
          </div>
        </div>

        {/* Rich menu — desktop: full layout / tablet: scroll / mobile: collapsible */}
        <div className="hidden lg:flex items-center justify-between mt-2 h-[26px]">
          <div className="flex items-center gap-3">
            <MenuLink customIcon={<StorefrontIcon size={16} />}>
              สร้างร้านค้า
            </MenuLink>
            <VDivider />
            <MenuLink iconName="users">สมัคร Affiliate</MenuLink>
            <VDivider />
            <MenuLink iconName="coin">สมัครสมาชิก BMS Member</MenuLink>
          </div>
          <div className="flex items-center gap-3">
            {!isLoggedIn && <MenuLink iconName="user">สร้างบัญชีใหม่</MenuLink>}
            <VDivider />
            <LanguageSwitcher />
            <VDivider />
            <HelpSwitcher />
          </div>
        </div>

        {/* Tablet rich menu (md - lg) — scrollable horizontal */}
        <div className="hidden md:flex lg:hidden items-center gap-3 mt-2 h-[26px] overflow-x-auto scrollbar-none">
          <MenuLink customIcon={<StorefrontIcon size={16} />}>
            สร้างร้านค้า
          </MenuLink>
          <VDivider />
          <MenuLink iconName="users">สมัคร Affiliate</MenuLink>
          <VDivider />
          <MenuLink iconName="coin">BMS Member</MenuLink>
          <VDivider />
          {!isLoggedIn && <MenuLink iconName="user">สร้างบัญชี</MenuLink>}
          <VDivider />
          <LanguageSwitcher />
          <VDivider />
          <HelpSwitcher />
        </div>

        {/* Mobile rich menu — collapsible drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 flex flex-col gap-1 pb-2">
            <MenuLink customIcon={<StorefrontIcon size={16} />}>
              สร้างร้านค้า
            </MenuLink>
            <MenuLink iconName="users">สมัคร Affiliate</MenuLink>
            <MenuLink iconName="coin">สมัครสมาชิก BMS Member</MenuLink>
            {!isLoggedIn && <MenuLink iconName="user">สร้างบัญชีใหม่</MenuLink>}
            <LanguageSwitcher />
            <HelpSwitcher />
          </div>
        )}
      </div>
    </header>
  );
}
