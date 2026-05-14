import { type ReactNode, useEffect, useRef, useState } from "react";
import Icon from "./landing/Icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#phone-clip)">
        <path d="M9.36514 3.99992C10.0163 4.12696 10.6147 4.44542 11.0838 4.91454C11.553 5.38366 11.8714 5.98209 11.9985 6.63325M9.36514 1.33325C10.718 1.48354 11.9795 2.08937 12.9426 3.05126C13.9057 4.01315 14.5131 5.27392 14.6651 6.62658M6.81646 9.24196C6.01541 8.44091 5.38288 7.53515 4.91888 6.56874C4.87897 6.48561 4.85902 6.44405 4.84368 6.39145C4.7892 6.20455 4.82834 5.97505 4.94168 5.81676C4.97357 5.77222 5.01168 5.73411 5.08788 5.65791C5.32095 5.42483 5.43749 5.3083 5.51368 5.19111C5.80101 4.74919 5.80101 4.17947 5.51368 3.73754C5.43749 3.62035 5.32095 3.50382 5.08788 3.27075L4.95797 3.14084C4.60367 2.78654 4.42653 2.60939 4.23627 2.51316C3.8579 2.32178 3.41106 2.32178 3.03268 2.51316C2.84243 2.60939 2.66528 2.78654 2.31099 3.14084L2.2059 3.24592C1.85281 3.59901 1.67627 3.77555 1.54144 4.01557C1.39183 4.28191 1.28425 4.69557 1.28516 5.00105C1.28598 5.27635 1.33938 5.4645 1.44619 5.84079C2.02017 7.86306 3.10315 9.7713 4.69514 11.3633C6.28712 12.9553 8.19537 14.0383 10.2176 14.6122C10.5939 14.719 10.7821 14.7724 11.0574 14.7733C11.3629 14.7742 11.7765 14.6666 12.0429 14.517C12.2829 14.3821 12.4594 14.2056 12.8125 13.8525L12.9176 13.7474C13.2719 13.3931 13.449 13.216 13.5453 13.0257C13.7366 12.6474 13.7366 12.2005 13.5453 11.8221C13.449 11.6319 13.2719 11.4547 12.9176 11.1005L12.7877 10.9705C12.5546 10.7375 12.4381 10.6209 12.3209 10.5447C11.879 10.2574 11.3092 10.2574 10.8673 10.5447C10.7501 10.6209 10.6336 10.7375 10.4005 10.9705C10.3243 11.0467 10.2862 11.0849 10.2417 11.1167C10.0834 11.2301 9.85387 11.2692 9.66697 11.2147C9.61438 11.1994 9.57281 11.1795 9.48968 11.1395C8.52327 10.6755 7.61751 10.043 6.81646 9.24196Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="phone-clip">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#chat-clip)">
        <path d="M4.06161 7.48578C4.02017 7.21874 3.99867 6.94516 3.99867 6.66658C3.99867 3.72107 6.4022 1.33325 9.36709 1.33325C12.332 1.33325 14.7355 3.72107 14.7355 6.66658C14.7355 7.33197 14.6129 7.96889 14.3888 8.55625C14.3423 8.67824 14.319 8.73924 14.3084 8.78686C14.298 8.83404 14.2939 8.86723 14.2928 8.91555C14.2916 8.96432 14.2982 9.01803 14.3115 9.12547L14.5799 11.3056C14.6089 11.5416 14.6234 11.6596 14.5842 11.7454C14.5498 11.8206 14.4887 11.8803 14.4128 11.9129C14.3261 11.9502 14.2085 11.9329 13.9732 11.8985L11.8497 11.5872C11.7388 11.5709 11.6833 11.5628 11.6329 11.5631C11.5829 11.5634 11.5483 11.5671 11.4995 11.5773C11.4501 11.5877 11.3869 11.6114 11.2607 11.6587C10.6718 11.8792 10.0336 11.9999 9.36709 11.9999C9.0883 11.9999 8.81447 11.9788 8.54714 11.9381M5.08642 14.6666C7.06301 14.6666 8.66536 13.025 8.66536 10.9999C8.66536 8.97487 7.06301 7.33325 5.08642 7.33325C3.10982 7.33325 1.50747 8.97487 1.50747 10.9999C1.50747 11.407 1.57222 11.7985 1.69173 12.1644C1.74225 12.3191 1.76751 12.3964 1.7758 12.4492C1.78446 12.5044 1.78597 12.5353 1.78275 12.5911C1.77966 12.6444 1.76631 12.7048 1.73959 12.8255L1.33203 14.6666L3.32857 14.3939C3.43754 14.379 3.49203 14.3716 3.53961 14.3719C3.58971 14.3723 3.6163 14.375 3.66544 14.3848C3.7121 14.3941 3.78147 14.4186 3.92021 14.4675C4.28576 14.5965 4.6781 14.6666 5.08642 14.6666Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="chat-clip">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}


type HelpItem = { icon: ReactNode; label: string };

const HELP_ITEMS: HelpItem[] = [
{ icon: <ChatIcon />, label: "แชทกับเจ้าหน้าที่" },
  { icon: <PhoneIcon />, label: "โทร 02-427-9991" },
  { icon: <Icon name="question-circle" size={16} />, label: "คำถามที่พบบ่อย FAQ" },
];

type HelpSelectProps = {
  className?: string;
  variant?: "light" | "dark";
  onSelect?: (label: string) => void;
};

export default function HelpSelect({ className = "", variant = "light", onSelect }: HelpSelectProps) {
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
    <div ref={ref} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={[
          "flex items-center gap-1 px-2 py-1 rounded-lg",
          "text-[14px] font-medium leading-[18px] whitespace-nowrap",
          "focus-visible:outline-none transition-colors",
          variant === "dark"
            ? open
              ? "bg-[rgba(0,66,221,0.4)] text-white focus-visible:ring-2 focus-visible:ring-white/40"
              : "text-white hover:bg-white/15 active:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/40"
            : open
              ? "bg-[var(--color-primary-100)] text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
              : "text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] active:bg-[var(--color-primary-100)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30",
        ].join(" ")}
      >
        <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: 16, width: 16, height: 16 }} />
        <span>ช่วยเหลือ</span>
        <Icon
          name="chevron-down"
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-dropdown absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] z-50 w-[191px] bg-white rounded-xl p-2 flex flex-col shadow-[0_0_1px_rgba(29,33,45,0.2),0_1px_4px_rgba(29,33,45,0.15),0_16px_32px_rgba(29,33,45,0.1)]"
        >
          {HELP_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                onSelect?.(item.label);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1 rounded text-left text-[14px] tracking-[-0.006em] leading-6 transition-colors bg-white text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:bg-[var(--color-primary-100)] focus-visible:text-[var(--color-primary)]"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
