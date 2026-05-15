import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Icon from "./landing/Icon";
import CartIcon from "./CartIcon";
import QuoteIcon from "./QuoteIcon";
import avatar from "../assets/avatar.jpg";

const SELLER_MENU = [
  { icon: "cart", label: "คำสั่งซื้อ", to: "/seller/orders" },
  { icon: "files", label: "ใบเสนอราคา", to: "/seller/quotes" },
  { icon: "delivery", label: "โลจิสติกส์", to: "/seller/logistics" },
  { icon: "wallet", label: "กระเป๋าเงิน", to: "/seller/wallet" },
  { icon: "cog", label: "การตั้งค่าร้านค้า", to: "/seller/settings" },
] as const;

export default function SellerProfile() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
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

  const logout = () => {
    sessionStorage.removeItem("sellerLoggedIn");
    sessionStorage.removeItem("loggedIn");
    setOpen(false);
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
          "flex items-center gap-3 pr-2 py-0.5 rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30",
          open ? "bg-[var(--color-primary-100)]" : "hover:bg-[var(--color-primary)]/5",
        ].join(" ")}
      >
        <img src={avatar} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
        <Icon
          name="chevron-down"
          size={20}
          className={`transition-transform ${
            open ? "rotate-180 text-[var(--color-primary)]" : "text-[var(--color-neutral-600)]"
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-dropdown absolute right-0 top-[44px] z-50 w-[280px] bg-white rounded-xl overflow-hidden shadow-[0_0_1px_rgba(29,33,45,0.2),0_1px_4px_rgba(29,33,45,0.15),0_16px_32px_rgba(29,33,45,0.1)]"
        >
          {/* Header */}
          <div
            className="px-2 py-4 flex items-center gap-3"
            style={{
              backgroundImage:
                "linear-gradient(128deg, #bce5ff 0%, #f7fcff 59%, #85d8ff 117%)",
            }}
          >
            <div className="relative shrink-0 w-[50px] h-[50px]">
              <img src={avatar} alt="Profile" className="block w-[50px] h-[50px] rounded-full object-cover shadow-[0_2px_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.08),0_0_0.5px_rgba(29,33,45,0.2)]" />
              <span className="absolute bottom-0 right-0 bg-white rounded-full p-[3px] flex items-center justify-center">
                <Icon name="camera" size={10} className="text-[var(--color-neutral-700)]" />
              </span>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-[18px] font-semibold text-[var(--color-neutral-900)] leading-6 truncate">
                ระบุชื่อร้าน
              </p>
              <p className="text-[10px] text-[var(--color-neutral-500)]">
                ID ร้านค้า : BMS1234
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="p-2 flex flex-col gap-1">
            {SELLER_MENU.map((item, i) => {
              const sel = i === active;
              return (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setActive(i);
                    setOpen(false);
                    navigate(item.to);
                  }}
                  className={[
                    "w-full flex items-center gap-2 px-2 py-1 rounded text-left text-[14px] leading-6 tracking-[-0.006em] transition-colors",
                    sel
                      ? "bg-[var(--color-primary-100)] text-[var(--color-primary)]"
                      : "text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                  ].join(" ")}
                >
                  {item.icon === "cart" ? <CartIcon size={16} /> : item.icon === "files" ? <QuoteIcon size={16} /> : item.icon === "wallet" ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.333 6.33332V4.79999C13.333 4.05325 13.333 3.67989 13.1877 3.39467C13.0599 3.14379 12.8559 2.93981 12.605 2.81198C12.3198 2.66666 11.9464 2.66666 11.1997 2.66666H3.46634C2.7196 2.66666 2.34624 2.66666 2.06102 2.81198C1.81014 2.93981 1.60616 3.14379 1.47833 3.39467C1.33301 3.67988 1.33301 4.05325 1.33301 4.79999V11.2C1.33301 11.9467 1.33301 12.3201 1.47833 12.6053C1.60616 12.8562 1.81014 13.0602 2.06102 13.188C2.34624 13.3333 2.7196 13.3333 3.46634 13.3333L11.1997 13.3333C11.9464 13.3333 12.3198 13.3333 12.605 13.188C12.8559 13.0602 13.0599 12.8562 13.1877 12.6053C13.333 12.3201 13.333 11.9467 13.333 11.2V9.66666M9.99967 7.99999C9.99967 7.69022 9.99967 7.53534 10.0253 7.40654C10.1305 6.87762 10.544 6.46415 11.0729 6.35894C11.2017 6.33332 11.3566 6.33332 11.6663 6.33332H12.9997C13.3094 6.33332 13.4643 6.33332 13.5931 6.35894C14.122 6.46415 14.5355 6.87762 14.6407 7.40654C14.6663 7.53534 14.6663 7.69022 14.6663 7.99999C14.6663 8.30976 14.6663 8.46465 14.6407 8.59344C14.5355 9.12236 14.122 9.53583 13.5931 9.64104C13.4643 9.66666 13.3094 9.66666 12.9997 9.66666H11.6663C11.3566 9.66666 11.2017 9.66666 11.0729 9.64104C10.544 9.53583 10.1305 9.12236 10.0253 8.59344C9.99967 8.46464 9.99967 8.30976 9.99967 7.99999Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="6" cy="8" r="1" fill="currentColor"/>
                    </svg>
                  ) : <Icon name={item.icon} size={16} />}
                  <span className="flex-1">{item.label}</span>
                  <Icon name="chevron-right" size={16} className="opacity-60" />
                </button>
              );
            })}
            <span className="block w-full h-px bg-[var(--color-neutral-200)] my-1" />
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              className="w-full flex items-center gap-2 px-2 py-1 rounded text-left text-[14px] leading-6 text-[var(--color-critical)] hover:bg-[var(--color-critical)]/10 transition-colors"
            >
              <Icon name="exit" size={16} />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
