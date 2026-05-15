import { useState } from "react";
import { useNavigate } from "react-router";
import { Info } from "lucide-react";
import Icon from "../components/landing/Icon";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";

// Airmail-style diagonal stripe (blue / pink), matching Figma node 1665:38060
const CARD_STRIP =
  "repeating-linear-gradient(32deg, #0485f7 0 16px, #ffffff 16px 20px, #f64669 20px 36px, #ffffff 16px 40px)";

const ORDER_STEPS = [
  "คำสั่งซื้อ",
  "รอการชำระ",
  "ชำระแล้ว",
  "กำลังจัดเตรียม",
  "จัดเตรียมเสร็จสิ้น",
  "กำลังจัดส่ง",
  "จัดส่งสำเร็จ",
  "ยกเลิกคำสั่งซื้อ",
];

const LINE_ITEMS = [
  { name: "ชาบูเซ็ตเตอร์ดอกพอนเฮ้นนี้", qty: 1, price: 350.0 },
  { name: "ชาบูเซ็ตเตอร์ดอกพอนเฮ้นนี้", qty: 1, price: 150.0 },
];

function Card({
  children,
  className = "",
  strip = false,
}: {
  children: React.ReactNode;
  className?: string;
  strip?: boolean;
}) {
  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] ${className}`}>
      {strip && <div className="h-[6px]" style={{ backgroundImage: CARD_STRIP }} />}
      <div className="p-5">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "primary" | "critical" }) {
  const c =
    tone === "primary" ? "text-[var(--color-primary)]" : tone === "critical" ? "text-[var(--color-critical)]" : "text-[var(--color-neutral-900)]";
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-[14px]">
      <span className="text-[var(--color-neutral-600)]">{label}</span>
      <span className={`text-right ${c}`}>{value}</span>
    </div>
  );
}

function OrderTimeline() {
  const current = 3;
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] flex flex-col sticky top-[88px]">
      <div className="px-5 pt-5 pb-3 border-b border-[var(--color-neutral-200)]">
        <p className="text-[18px] font-bold text-black">การดำเนินการ</p>
      </div>
      <div className="px-5 py-5 flex-1">
        {ORDER_STEPS.map((label, i) => {
          const isLast = i === ORDER_STEPS.length - 1;
          const done = i < current;
          const isCurrent = i === current;
          const dotClass = done
            ? "bg-[var(--color-primary)] text-white"
            : isCurrent
            ? "bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)]"
            : "bg-white border-2 border-[var(--color-neutral-500)] text-[var(--color-neutral-500)]";
          const lineClass = i < current ? "bg-[var(--color-primary)]" : "bg-[var(--color-neutral-300)]";
          const labelClass = done || isCurrent ? "text-[var(--color-primary)]" : "text-[var(--color-neutral-900)]";
          const dateClass = done || isCurrent ? "text-[var(--color-neutral-900)]" : "text-[var(--color-neutral-500)]";
          return (
            <div key={label} className="flex gap-5 items-stretch">
              <div className="flex flex-col items-center w-6 shrink-0">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${dotClass}`}>
                  {i + 1}
                </span>
                {!isLast && <span className={`w-0.5 flex-1 my-1 rounded-full ${lineClass}`} />}
              </div>
              <div className={`flex-1 ${isLast ? "" : "pb-5"}`}>
                <p className={`text-[14px] font-medium ${labelClass}`}>{label}</p>
                <p className={`text-[12px] mt-1.5 ${dateClass}`}>วันที่ 24 ส.ค. 2569</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-[var(--color-neutral-200)] p-5 flex gap-3">
        <button
          type="button"
          className="flex-1 h-10 rounded-lg border border-[var(--color-neutral-300)] text-[14px] font-medium text-[var(--color-neutral-900)] flex items-center justify-center gap-2 hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.06258 7.48587C4.02115 7.21883 3.99965 6.94525 3.99965 6.66668C3.99965 3.72116 6.40317 1.33334 9.36807 1.33334C12.333 1.33334 14.7365 3.72116 14.7365 6.66668C14.7365 7.33206 14.6138 7.96898 14.3898 8.55635C14.3432 8.67833 14.32 8.73933 14.3094 8.78695C14.2989 8.83413 14.2949 8.86733 14.2938 8.91564C14.2926 8.96441 14.2992 9.01813 14.3125 9.12556L14.5808 11.3057C14.6099 11.5417 14.6244 11.6597 14.5852 11.7455C14.5508 11.8207 14.4897 11.8804 14.4137 11.913C14.3271 11.9503 14.2094 11.933 13.9742 11.8986L11.8506 11.5873C11.7398 11.571 11.6843 11.5629 11.6338 11.5632C11.5839 11.5635 11.5493 11.5672 11.5004 11.5774C11.451 11.5878 11.3879 11.6115 11.2617 11.6588C10.6728 11.8793 10.0346 12 9.36807 12C9.08928 12 8.81545 11.9789 8.54811 11.9382M5.08739 14.6667C7.06399 14.6667 8.66634 13.0251 8.66634 11C8.66634 8.97497 7.06399 7.33334 5.08739 7.33334C3.1108 7.33334 1.50845 8.97497 1.50845 11C1.50845 11.4071 1.57319 11.7986 1.69271 12.1645C1.74323 12.3191 1.76849 12.3965 1.77678 12.4493C1.78543 12.5045 1.78695 12.5354 1.78373 12.5912C1.78064 12.6445 1.76728 12.7049 1.74057 12.8255L1.33301 14.6667L3.32954 14.394C3.43852 14.3791 3.49301 14.3717 3.54059 14.372C3.59069 14.3723 3.61728 14.3751 3.66641 14.3849C3.71308 14.3942 3.78245 14.4186 3.92119 14.4676C4.28674 14.5966 4.67908 14.6667 5.08739 14.6667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          แชทลูกค้า
        </button>
        <button
          type="button"
          className="flex-1 h-10 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:bg-[var(--color-primary-600)] transition-colors"
        >
          ดำเนินการต่อ
        </button>
      </div>
    </div>
  );
}

export default function SellerOrderDetail() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader onMenuClick={() => setMobileMenuOpen(true)} />
      <div className="flex">
        <SellerSidebar active="คำสั่งซื้อ" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
          {/* Top bar */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => navigate("/seller/orders")}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-200)] transition-colors"
              aria-label="ย้อนกลับ"
            >
              <Icon name="chevron-left" size={20} />
            </button>
            <h1 className="text-[18px] font-bold text-[var(--color-neutral-900)]">#BMS-0987654-87</h1>
            <span className="inline-flex items-center px-3 py-1 rounded text-[12px] font-medium" style={{ backgroundColor: "#fdefb0", color: "#863a00" }}>
              รอชำระเงิน
            </span>
            <div className="ml-auto flex items-center gap-3">
              <button type="button" className="h-10 px-4 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[14px] font-medium flex items-center gap-2 hover:bg-[var(--color-primary-100)] transition-colors">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.6668 1.8916V5.33372C11.6668 5.80043 11.6668 6.03378 11.7577 6.21204C11.8376 6.36885 11.965 6.49633 12.1218 6.57622C12.3001 6.66705 12.5335 6.66705 13.0002 6.66705H16.4423M13.3335 10.8337H6.66683M13.3335 14.167H6.66683M8.3335 7.50033H6.66683M11.6668 1.66699H7.3335C5.93336 1.66699 5.2333 1.66699 4.69852 1.93948C4.22811 2.17916 3.84566 2.56161 3.60598 3.03202C3.3335 3.5668 3.3335 4.26686 3.3335 5.66699V14.3337C3.3335 15.7338 3.3335 16.4339 3.60598 16.9686C3.84566 17.439 4.22811 17.8215 4.69852 18.0612C5.2333 18.3337 5.93336 18.3337 7.3335 18.3337H12.6668C14.067 18.3337 14.767 18.3337 15.3018 18.0612C15.7722 17.8215 16.1547 17.439 16.3943 16.9686C16.6668 16.4339 16.6668 15.7338 16.6668 14.3337V6.66699L11.6668 1.66699Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                พิมพ์ใบเสร็จคำสั่งซื้อ
              </button>
              <button type="button" className="h-10 px-4 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[14px] font-medium flex items-center gap-2 hover:bg-[var(--color-primary-100)] transition-colors">
                <Icon name="printer" size={18} />
                พิมพ์ใบปะหน้าสินค้า
              </button>
            </div>
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 items-start">
            {/* Left */}
            <div className="flex flex-col gap-4 min-w-0">
              {/* Shipping address */}
              <Card strip>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[16px] font-semibold text-[var(--color-neutral-900)]">ที่อยู่ในการจัดส่ง</p>
                  <p className="text-[12px] text-[var(--color-neutral-500)] flex items-center gap-1">
                    <Info size={14} className="shrink-0" />
                    ที่อยู่อัปเดตล่าสุดเมื่อ 24 ส.ค. 2569
                  </p>
                </div>
                <p className="mt-3 text-[14px] text-[var(--color-neutral-900)] font-medium">
                  นายต้นปีบ ดูศักดิ์ <span className="text-[var(--color-neutral-600)] font-normal">(+66)93 695 5934</span>
                </p>
                <p className="mt-1 text-[14px] text-[var(--color-neutral-600)] leading-relaxed">
                  เลขที่ 2 ซอยพุทธวิถี33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140
                </p>
              </Card>

              {/* Order details */}
              <Card>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[16px] font-semibold text-[var(--color-neutral-900)]">รายละเอียดคำสั่งซื้อ</p>
                  <button type="button" className="h-9 px-4 rounded-lg border border-[var(--color-critical)] text-[var(--color-critical)] text-[13px] font-medium hover:bg-[var(--color-critical)]/10 transition-colors">
                    ยกเลิกคำสั่งซื้อ
                  </button>
                </div>

                {/* Line items */}
                <ul className="mt-4 flex flex-col gap-3">
                  {LINE_ITEMS.map((it, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-12 h-12 rounded-lg bg-[var(--color-neutral-200)] shrink-0" />
                      <span className="flex-1 min-w-0 text-[14px] text-[var(--color-neutral-900)] truncate">{it.name}</span>
                      <span className="text-[14px] text-[var(--color-neutral-600)]">x{it.qty}</span>
                      <span className="text-[14px] font-medium text-[var(--color-neutral-900)] tabular-nums w-24 text-right">
                        ฿ {it.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Summary */}
                <div className="mt-5 border-t border-[var(--color-neutral-200)] pt-4">
                  <SummaryRow label="หมายเลขคำสั่งซื้อ" value="#BMS-0987654-87" />
                  <SummaryRow label="ยอดชำระเงิน" value="ธนาคารกรุงไทย ฿400.00" tone="primary" />
                  <SummaryRow label="ยอดรวมสินค้าในออเดอร์" value="฿500.00" />
                  <SummaryRow label="ค่าจัดส่ง" value="฿50.00" />
                  <SummaryRow label="โค้ดส่วนลดอบ" value="-฿50.00" tone="critical" />
                  <SummaryRow label="โค้ดส่วนลดจากร้านค้า" value="-฿50.00" tone="critical" />
                  <SummaryRow label="BMS Member" value="-฿50.00" tone="critical" />
                </div>

                {/* Dates */}
                <div className="mt-4 border-t border-[var(--color-neutral-200)] pt-4">
                  <SummaryRow label="วันที่สั่งซื้อ" value="5 พ.ค. 2569 15.42" />
                  <SummaryRow label="เวลาที่ชำระเงิน" value="5 พ.ค. 2569 15.42" />
                  <SummaryRow label="วันที่จัดส่งโดยประมาณ" value="5 พ.ค. 2569 15.42" />
                  <SummaryRow label="หมายเลขการติดตาม" value="#BMS-0987654-87" />
                </div>

                {/* Note */}
                <div className="mt-4">
                  <p className="text-[14px] text-[var(--color-neutral-600)] mb-2">หมายเหตุ</p>
                  <textarea
                    rows={3}
                    placeholder="ข้อความจากลูกค้าถึงผู้ขายเรื่องการจัดส่ง"
                    className="w-full rounded-lg border border-[var(--color-neutral-300)] p-3 text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] resize-none focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </Card>
            </div>

            {/* Right — timeline */}
            <OrderTimeline />
          </div>
        </main>
      </div>
    </div>
  );
}
