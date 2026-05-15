import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Icon from "./landing/Icon";
import avatar from "../assets/avatar.jpg";

const AFFILIATE_MENU = [
  { icon: "grid-alt", label: "หน้าแรก", to: "/affiliate/overview" },
  { icon: "link", label: "สินค้าลิงก์คอมมิชชัน", to: "/affiliate/commission/brightify" },
  { icon: "cup", label: "แคมเปญ Affiliate", to: "/affiliate/campaign" },
  { icon: "files", label: "รายงาน", to: "/affiliate/reports/orders" },
  { icon: "wallet", label: "รายได้คอมมิชชัน", to: "/affiliate/commission-income/summary" },
  { icon: "cog", label: "การตั้งค่า", to: "/affiliate/settings" },
] as const;

function AffiliateMenuIcon({ name }: { name: string }) {
  if (name === "grid-alt") return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="9" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/></svg>
  );
  if (name === "link") return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8.47167 12.2425L7.52886 13.1853C6.22711 14.4871 4.11656 14.4871 2.81481 13.1853C1.51306 11.8836 1.51306 9.77305 2.81481 8.4713L3.75762 7.52849M12.2429 8.4713L13.1857 7.52849C14.4875 6.22674 14.4875 4.11619 13.1857 2.81445C11.884 1.5127 9.77341 1.5127 8.47167 2.81445L7.52886 3.75725M5.66693 10.3332L10.3336 5.66655" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  if (name === "cup") return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><g clipPath="url(#apCupClip)"><path d="M7.99967 10C5.79054 10 3.99967 8.20918 3.99967 6.00004V2.29634C3.99967 2.02044 3.99967 1.88249 4.03988 1.77203C4.10728 1.58685 4.25315 1.44098 4.43833 1.37358C4.54879 1.33337 4.68674 1.33337 4.96264 1.33337H11.0367C11.3126 1.33337 11.4506 1.33337 11.561 1.37358C11.7462 1.44098 11.8921 1.58685 11.9595 1.77203C11.9997 1.88249 11.9997 2.02044 11.9997 2.29634V6.00004C11.9997 8.20918 10.2088 10 7.99967 10ZM7.99967 10V12M11.9997 2.66671H13.6663C13.977 2.66671 14.1323 2.66671 14.2548 2.71745C14.4181 2.78512 14.5479 2.9149 14.6156 3.07825C14.6663 3.20077 14.6663 3.35608 14.6663 3.66671V4.00004C14.6663 4.62002 14.6663 4.93001 14.5982 5.18435C14.4133 5.87453 13.8742 6.41362 13.184 6.59856C12.9296 6.66671 12.6197 6.66671 11.9997 6.66671M3.99967 2.66671H2.33301C2.02238 2.66671 1.86707 2.66671 1.74455 2.71745C1.5812 2.78512 1.45142 2.9149 1.38375 3.07825C1.33301 3.20077 1.33301 3.35608 1.33301 3.66671V4.00004C1.33301 4.62002 1.33301 4.93001 1.40116 5.18435C1.58609 5.87453 2.12519 6.41362 2.81537 6.59856C3.0697 6.66671 3.37969 6.66671 3.99967 6.66671M4.96264 14.6667H11.0367C11.2004 14.6667 11.333 14.5341 11.333 14.3704C11.333 13.0613 10.2718 12 8.96264 12H7.03671C5.72759 12 4.66634 13.0613 4.66634 14.3704C4.66634 14.5341 4.799 14.6667 4.96264 14.6667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="apCupClip"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>
  );
  if (name === "files") return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M9.33366 1.51306V4.26676C9.33366 4.64012 9.33366 4.82681 9.40632 4.96941C9.47024 5.09486 9.57222 5.19684 9.69767 5.26076C9.84027 5.33342 10.027 5.33342 10.4003 5.33342H13.154M10.667 8.66671H5.33366M10.667 11.3334H5.33366M6.66699 6.00004H5.33366M9.33366 1.33337H5.86699C4.74689 1.33337 4.18683 1.33337 3.75901 1.55136C3.38269 1.74311 3.07673 2.04907 2.88498 2.42539C2.66699 2.85322 2.66699 3.41327 2.66699 4.53337V11.4667C2.66699 12.5868 2.66699 13.1469 2.88498 13.5747C3.07673 13.951 3.38269 14.257 3.75901 14.4487C4.18683 14.6667 4.74689 14.6667 5.86699 14.6667H10.1337C11.2538 14.6667 11.8138 14.6667 12.2416 14.4487C12.618 14.257 12.9239 13.951 13.1157 13.5747C13.3337 13.1469 13.3337 12.5868 13.3337 11.4667V5.33337L9.33366 1.33337Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  if (name === "wallet") return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.99967 7.33329V9.99996M11.9997 5.99996V8.66662M11.333 2.66663C12.9655 2.66663 13.8484 2.91647 14.2878 3.11025C14.3463 3.13606 14.3755 3.14897 14.4599 3.22954C14.5105 3.27784 14.6029 3.41955 14.6267 3.48535C14.6663 3.59512 14.6663 3.65512 14.6663 3.77512V10.9407C14.6663 11.5466 14.6663 11.8495 14.5755 12.0052C14.4831 12.1636 14.3939 12.2372 14.221 12.2981C14.0509 12.3579 13.7077 12.292 13.0211 12.1601C12.5406 12.0677 11.9707 12 11.333 12C9.33301 12 7.33301 13.3333 4.66634 13.3333C3.03387 13.3333 2.15092 13.0835 1.7116 12.8897C1.65309 12.8639 1.62384 12.851 1.53941 12.7704C1.4888 12.7221 1.39642 12.5804 1.37265 12.5146C1.33301 12.4048 1.33301 12.3448 1.33301 12.2248L1.33301 5.05919C1.33301 4.45335 1.33301 4.15043 1.42386 3.99472C1.51628 3.83634 1.6054 3.7627 1.77838 3.70183C1.94843 3.64199 2.2917 3.70795 2.97823 3.83986C3.45875 3.93219 4.02866 3.99996 4.66634 3.99996C6.66634 3.99996 8.66634 2.66663 11.333 2.66663ZM9.66634 7.99996C9.66634 8.92043 8.92015 9.66662 7.99967 9.66662C7.0792 9.66662 6.33301 8.92043 6.33301 7.99996C6.33301 7.07948 7.0792 6.33329 7.99967 6.33329C8.92015 6.33329 9.66634 7.07948 9.66634 7.99996Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  if (name === "cog") return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><g clipPath="url(#apCogClip)"><path d="M7.99967 10C9.10424 10 9.99967 9.10461 9.99967 8.00004C9.99967 6.89547 9.10424 6.00004 7.99967 6.00004C6.8951 6.00004 5.99967 6.89547 5.99967 8.00004C5.99967 9.10461 6.8951 10 7.99967 10Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.4845 9.81822C12.4038 10.001 12.3798 10.2038 12.4154 10.4004C12.4511 10.597 12.5448 10.7784 12.6845 10.9213L12.7209 10.9576C12.8336 11.0702 12.923 11.2039 12.984 11.351C13.045 11.4982 13.0764 11.6559 13.0764 11.8152C13.0764 11.9745 13.045 12.1322 12.984 12.2794C12.923 12.4265 12.8336 12.5602 12.7209 12.6728C12.6083 12.7855 12.4746 12.8749 12.3275 12.9359C12.1803 12.9969 12.0226 13.0283 11.8633 13.0283C11.704 13.0283 11.5463 12.9969 11.3991 12.9359C11.252 12.8749 11.1183 12.7855 11.0057 12.6728L10.9694 12.6364C10.8265 12.4967 10.6451 12.403 10.4485 12.3673C10.2519 12.3317 10.0491 12.3557 9.86634 12.4364C9.68709 12.5132 9.53421 12.6408 9.42653 12.8034C9.31884 12.966 9.26106 13.1565 9.26028 13.3516V13.4546C9.26028 13.7761 9.13257 14.0844 8.90526 14.3117C8.67794 14.539 8.36963 14.6667 8.04816 14.6667C7.72668 14.6667 7.41838 14.539 7.19106 14.3117C6.96374 14.0844 6.83604 13.7761 6.83604 13.4546V13.4C6.83135 13.1994 6.76641 13.0049 6.64968 12.8417C6.53295 12.6785 6.36982 12.5542 6.18149 12.4849C5.99869 12.4042 5.79592 12.3801 5.59932 12.4158C5.40271 12.4514 5.2213 12.5452 5.07846 12.6849L5.0421 12.7213C4.92953 12.834 4.79584 12.9234 4.64869 12.9844C4.50154 13.0454 4.34381 13.0768 4.18452 13.0768C4.02523 13.0768 3.8675 13.0454 3.72035 12.9844C3.5732 12.9234 3.43952 12.834 3.32695 12.7213C3.21425 12.6087 3.12484 12.475 3.06384 12.3278C3.00285 12.1807 2.97145 12.023 2.97145 11.8637C2.97145 11.7044 3.00285 11.5467 3.06384 11.3995C3.12484 11.2524 3.21425 11.1187 3.32695 11.0061L3.36331 10.9697C3.50303 10.8269 3.59676 10.6455 3.6324 10.4489C3.66805 10.2523 3.64399 10.0495 3.56331 9.86671C3.48648 9.68745 3.35892 9.53458 3.19632 9.42689C3.03372 9.31921 2.84318 9.26142 2.64816 9.26065H2.54513C2.22365 9.26065 1.91535 9.13294 1.68803 8.90562C1.46071 8.67831 1.33301 8.37 1.33301 8.04853C1.33301 7.72705 1.46071 7.41874 1.68803 7.19143C1.91535 6.96411 2.22365 6.8364 2.54513 6.8364H2.59967C2.80028 6.83171 2.99483 6.76678 3.15804 6.65005C3.32125 6.53331 3.44556 6.37018 3.51483 6.18186C3.5955 5.99906 3.61957 5.79629 3.58392 5.59968C3.54827 5.40308 3.45455 5.22166 3.31483 5.07883L3.27846 5.04246C3.16576 4.92989 3.07636 4.79621 3.01536 4.64906C2.95436 4.50191 2.92296 4.34418 2.92296 4.18489C2.92296 4.0256 2.95436 3.86787 3.01536 3.72072C3.07636 3.57357 3.16576 3.43989 3.27846 3.32731C3.39104 3.21461 3.52472 3.12521 3.67187 3.06421C3.81902 3.00321 3.97675 2.97181 4.13604 2.97181C4.29533 2.97181 4.45306 3.00321 4.60021 3.06421C4.74736 3.12521 4.88104 3.21461 4.99361 3.32731L5.02998 3.36368C5.17281 3.5034 5.35423 3.59712 5.55083 3.63277C5.74744 3.66842 5.95021 3.64435 6.13301 3.56368H6.18149C6.36075 3.48685 6.51362 3.35929 6.62131 3.19669C6.72899 3.03409 6.78678 2.84355 6.78755 2.64853V2.5455C6.78755 2.22402 6.91526 1.91571 7.14258 1.6884C7.36989 1.46108 7.6782 1.33337 7.99967 1.33337C8.32115 1.33337 8.62946 1.46108 8.85677 1.6884C9.08409 1.91571 9.2118 2.22402 9.2118 2.5455V2.60004C9.21257 2.79506 9.27036 2.9856 9.37804 3.1482C9.48572 3.3108 9.6386 3.43837 9.81786 3.51519C10.0007 3.59587 10.2034 3.61993 10.4 3.58429C10.5966 3.54864 10.7781 3.45491 10.9209 3.31519L10.9572 3.27883C11.0698 3.16613 11.2035 3.07672 11.3507 3.01573C11.4978 2.95473 11.6555 2.92333 11.8148 2.92333C11.9741 2.92333 12.1318 2.95473 12.279 3.01573C12.4261 3.07672 12.5598 3.16613 12.6724 3.27883C12.7851 3.3914 12.8745 3.52509 12.9355 3.67223C12.9965 3.81938 13.0279 3.97711 13.0279 4.1364C13.0279 4.2957 12.9965 4.45343 12.9355 4.60057C12.8745 4.74772 12.7851 4.88141 12.6724 4.99398L12.636 5.03034C12.4963 5.17318 12.4026 5.3546 12.3669 5.5512C12.3313 5.7478 12.3554 5.95058 12.436 6.13337V6.18186C12.5129 6.36111 12.6404 6.51399 12.803 6.62167C12.9656 6.72935 13.1562 6.78714 13.3512 6.78792H13.4542C13.7757 6.78792 14.084 6.91562 14.3113 7.14294C14.5386 7.37026 14.6663 7.67857 14.6663 8.00004C14.6663 8.32151 14.5386 8.62982 14.3113 8.85714C14.084 9.08446 13.7757 9.21216 13.4542 9.21216H13.3997C13.2047 9.21294 13.0141 9.27073 12.8515 9.37841C12.6889 9.48609 12.5613 9.63897 12.4845 9.81822Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="apCogClip"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>
  );
  return <Icon name={name} size={14} />;
}

export default function AffiliateProfile() {
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
        <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
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
              <img
                src={avatar}
                alt=""
                className="block w-[50px] h-[50px] rounded-full object-cover shadow-[0_2px_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.08),0_0_0.5px_rgba(29,33,45,0.2)]"
              />
              <span className="absolute bottom-0 right-0 bg-white rounded-full p-[3px] flex items-center justify-center">
                <Icon name="camera" size={10} className="text-[var(--color-neutral-700)]" />
              </span>
            </div>
            <p className="text-[18px] font-semibold text-[var(--color-neutral-900)] leading-6 truncate min-w-0">
              paibooo karwllw
            </p>
          </div>

          {/* Items */}
          <div className="p-2 flex flex-col gap-1">
            {AFFILIATE_MENU.map((item, i) => {
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
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-[14px] leading-6 tracking-[-0.006em] transition-colors",
                    sel
                      ? "bg-[var(--color-primary-100)] text-[var(--color-primary)]"
                      : "text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                  ].join(" ")}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      sel ? "bg-white text-[var(--color-primary)]" : "bg-[var(--color-neutral-200)] text-[var(--color-neutral-700)]"
                    }`}
                  >
                    <AffiliateMenuIcon name={item.icon} />
                  </span>
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
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-[14px] leading-6 text-[var(--color-critical)] hover:bg-[var(--color-critical)]/10 transition-colors"
            >
              <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[var(--color-critical)]">
                <Icon name="exit" size={16} />
              </span>
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
