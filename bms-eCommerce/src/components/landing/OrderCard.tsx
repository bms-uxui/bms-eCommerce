import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Copy, Info, MessageCircle, Star } from "lucide-react";
import jtLogo from "../../assets/shipping/jt.png";
import kerryLogo from "../../assets/shipping/kerry.png";
import flashLogo from "../../assets/shipping/flash.png";
import thaipostLogo from "../../assets/shipping/thaipost.png";

export type OrderStatus =
  | "wait_pay"
  | "arranging"
  | "shipping"
  | "delivered"
  | "received"
  | "cancelled";

const STATUS_LABEL: Record<OrderStatus, string> = {
  wait_pay: "รอชำระเงิน",
  arranging: "กำลังจัดเตรียม",
  shipping: "กำลังจัดส่ง",
  delivered: "จัดส่งสำเร็จแล้ว",
  received: "ได้รับสินค้าแล้ว",
  cancelled: "ยกเลิกคำสั่งซื้อ",
};

const STATUS_BG: Record<OrderStatus, string> = {
  wait_pay: "bg-[#fdefb0] text-[#863a00]",
  arranging: "bg-[#f5ebfe] text-[#5824d4]",
  shipping: "bg-[#c8efff] text-[#025094]",
  delivered: "bg-[#d6fc92] text-[#235c04]",
  received: "bg-[#d6fc92] text-[#235c04]",
  cancelled: "bg-[#feeaed] text-[#a3072b]",
};

const CARRIER_LOGOS: Record<string, string> = {
  "J&T Express": jtLogo,
  "Kerry Express": kerryLogo,
  "Flash Express": flashLogo,
  "Thai Post": thaipostLogo,
};

export type OrderItem = {
  image: string;
  name: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  shop: string;
  orderNo: string;
  status: OrderStatus;
  placedAt: string;
  arriveBy: string;
  items: OrderItem[];
  total: number;
  address: string;
  paymentMethod: string;
  carrier?: string;
  tracking?: string;
};

const baht = (n: number) =>
  `฿${n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function ActionButton({
  children,
  variant = "primary",
  icon,
  onClick,
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline-primary" | "outline-critical" | "outline-neutral";
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  const styles: Record<string, string> = {
    "primary":
      "bg-[var(--color-primary)] text-white hover:brightness-110",
    "outline-primary":
      "bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-100)]",
    "outline-critical":
      "bg-white border border-[var(--color-critical)] text-[var(--color-critical)] hover:bg-[var(--color-critical)]/5",
    "outline-neutral":
      "bg-white border border-[var(--color-neutral-400)] text-[var(--color-neutral-900)] hover:border-[var(--color-primary)]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 sm:flex-none sm:min-w-[150px] h-10 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-[14px] sm:text-[16px] font-medium tracking-[-0.011em] transition whitespace-nowrap ${styles[variant]}`}
    >
      {icon}
      {children}
    </button>
  );
}

const PRICE_ROWS = [
  { label: "ราคาเดิมของสินค้า", value: "฿ 400.00", critical: false },
  { label: "สินค้าที่ลดราคา", value: "- ฿ 20.00", critical: true },
  { label: "ส่วนลดจากร้านค้า", value: "- ฿ 12.00", critical: true },
  { label: "ค่าจัดส่ง", value: "฿ 0.00", critical: false },
  { label: "ส่วนลดจาก Bright", value: "- ฿ 59.00", critical: true },
];

export default function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyTracking = async () => {
    if (!order.tracking) return;
    try {
      await navigator.clipboard.writeText(order.tracking);
    } catch {
      // ignore; non-secure contexts may reject
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article className="bg-white rounded-2xl flex flex-col w-full overflow-hidden">
      {/* Header */}
      <div className="border-b border-[var(--color-neutral-300)] flex flex-col gap-2 p-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
          <span className="text-[18px] sm:text-[20px] font-medium text-black">
            {order.shop}
          </span>
          <span className="text-[13px] sm:text-[14px] text-[var(--color-neutral-900)]">
            จะได้รับสินค้าภายใน วันที่ {order.arriveBy}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[14px] sm:text-[16px] text-black">{order.orderNo}</span>
            <span
              className={`px-3 py-1 rounded text-[12px] font-medium ${STATUS_BG[order.status]}`}
            >
              {STATUS_LABEL[order.status]}
            </span>
          </div>
          <span className="text-[13px] sm:text-[14px] text-[#8e8e93]">{order.placedAt}</span>
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col pt-2 px-4">
        <div className="flex flex-col gap-2.5 py-1">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 sm:gap-4 sm:pr-8 w-full"
            >
              <div className="flex flex-1 min-w-0 items-center gap-3 sm:gap-4">
                <img
                  src={item.image}
                  alt=""
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                />
                <p className="flex-1 min-w-0 text-[14px] sm:text-[16px] text-[var(--color-neutral-900)] leading-[22px] line-clamp-2 sm:line-clamp-1">
                  {item.name}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 shrink-0 items-end gap-1">
                <span className="sm:w-[120px] sm:text-center text-[14px] sm:text-[16px] font-semibold text-[var(--color-neutral-500)]">
                  x{item.qty}
                </span>
                <span className="sm:w-[120px] text-right text-[14px] sm:text-[16px] font-bold text-[var(--color-neutral-900)] tabular-nums">
                  {baht(item.price)}
                </span>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setPriceOpen((o) => !o)}
            className="border-t border-dashed border-[var(--color-neutral-300)] flex items-center gap-2 py-2 w-full"
          >
            <span className="flex-1 text-left text-[16px] font-semibold text-black">
              Total
            </span>
            <span className="flex-1 text-right text-[16px] font-semibold text-[var(--color-primary)] tabular-nums">
              {baht(order.total)}
            </span>
            {priceOpen ? (
              <ChevronUp size={24} className="text-[var(--color-neutral-700)] shrink-0" />
            ) : (
              <ChevronDown size={24} className="text-[var(--color-neutral-700)] shrink-0" />
            )}
          </button>

          {/* Price breakdown */}
          {priceOpen && (
            <div className="flex flex-col gap-4 py-2">
              {PRICE_ROWS.map((r) => (
                <div key={r.label} className="flex items-center gap-2 pl-4 pr-8">
                  <span className="flex-1 text-[16px] text-[var(--color-neutral-500)]">{r.label}</span>
                  <span className={`text-[16px] tabular-nums ${r.critical ? "text-[#f64669]" : "text-[var(--color-neutral-800)]"}`}>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shipping / tracking */}
      {open && order.carrier && order.tracking && (
        <div className="border-t border-[var(--color-neutral-300)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4">
          <div className="flex flex-1 items-center gap-2">
            {CARRIER_LOGOS[order.carrier] ? (
              <img
                src={CARRIER_LOGOS[order.carrier]}
                alt=""
                className="w-[61px] h-6 object-cover object-center border border-[var(--color-neutral-300)] rounded bg-white"
              />
            ) : (
              <span className="w-[61px] h-6 border border-[var(--color-neutral-300)] rounded bg-white" />
            )}
            <p className="text-[16px] text-[var(--color-neutral-900)] leading-[18px]">
              {order.carrier}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-[16px] font-medium text-[var(--color-neutral-900)] tracking-[-0.011em]">
              {order.tracking}
            </p>
            <div className="relative">
              <button
                type="button"
                onClick={copyTracking}
                aria-label="คัดลอกรหัสติดตาม"
                className="text-[var(--color-neutral-700)] hover:text-[var(--color-primary)] transition"
              >
                {copied ? (
                  <Check size={24} className="text-[var(--color-positive-700)]" />
                ) : (
                  <Copy size={24} />
                )}
              </button>
              {copied && (
                <span
                  role="status"
                  className="pointer-events-none absolute right-0 top-[calc(100%+6px)] whitespace-nowrap rounded-md bg-[var(--color-neutral-900)] px-2 py-1 text-[12px] font-medium text-white shadow-md z-20"
                >
                  คัดลอกแล้ว
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer: address/payment + actions */}
      {open && (
        <div className="border-t border-[var(--color-neutral-300)] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4 p-4">
          <div className="flex-1 min-w-0 flex flex-col gap-1 text-[13px] sm:text-[14px] leading-[18px]">
            <div className="flex flex-wrap gap-x-2 gap-y-1 items-start">
              <span className="text-[#71717a] shrink-0">ที่อยู่จัดส่ง :</span>
              <span className="text-[#18181b] break-words">{order.address}</span>
              {order.status === "wait_pay" && (
                <button
                  type="button"
                  className="text-[var(--color-primary)] underline shrink-0"
                >
                  เปลี่ยนที่อยู่
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-1 items-start">
              <span className="text-[#71717a] shrink-0">ชำระด้วย :</span>
              <span className="text-[#18181b] break-words">{order.paymentMethod}</span>
              {order.status === "wait_pay" && (
                <button
                  type="button"
                  className="text-[var(--color-primary)] underline shrink-0"
                >
                  เปลี่ยนวิธีการชำระ
                </button>
              )}
            </div>
          </div>
          <OrderActions status={order.status} />
        </div>
      )}
    </article>
  );
}

function OrderActions({ status }: { status: OrderStatus }) {
  switch (status) {
    case "wait_pay":
      return (
        <div className="flex w-full lg:w-auto items-center gap-2 sm:gap-3 lg:shrink-0">
          <ActionButton variant="outline-critical">ยกเลิกคำสั่งซื้อ</ActionButton>
          <ActionButton variant="primary">ชำระเงินอีกครั้ง</ActionButton>
        </div>
      );
    case "arranging":
      return (
        <div className="flex w-full lg:w-auto items-center lg:shrink-0">
          <ActionButton
            variant="outline-primary"
            icon={<MessageCircle size={20} />}
          >
            ติดต่อร้านค้า
          </ActionButton>
        </div>
      );
    case "shipping":
      return (
        <div className="flex w-full lg:w-auto items-center lg:shrink-0">
          <ActionButton
            variant="outline-primary"
            icon={<MessageCircle size={20} />}
          >
            ติดต่อร้านค้า
          </ActionButton>
        </div>
      );
    case "delivered":
      return (
        <div className="flex w-full lg:w-auto items-center lg:shrink-0">
          <ActionButton variant="primary">ยืนยันการรับสินค้า</ActionButton>
        </div>
      );
    case "received":
      return (
        <div className="flex w-full lg:w-auto items-center gap-2 sm:gap-3 lg:shrink-0">
          <ActionButton
            variant="outline-neutral"
            icon={<Info size={20} />}
          >
            ขอคืนเงิน/คืนสินค้า
          </ActionButton>
          <ActionButton variant="primary" icon={<Star size={20} />}>
            รีวิวสินค้า
          </ActionButton>
        </div>
      );
    case "cancelled":
      return (
        <div className="flex w-full lg:w-auto items-center lg:shrink-0">
          <ActionButton variant="outline-primary">ซื้ออีกครั้ง</ActionButton>
        </div>
      );
  }
}
