import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "@heroui/react";
import { ChevronRight, Truck, Ticket } from "lucide-react";
import paracetamol from "../assets/products/p02-paracetamol.jpg";
import avatar from "../assets/avatar.jpg";
import brigtifyLogo from "../assets/checkout/brigtify-logo.svg";
import bmsMemberLogo from "../assets/checkout/bms-member.png";
import promptpayIcon from "../assets/checkout/promptpay-icon.png";
import promptpayArt from "../assets/checkout/promptpay-art.png";
import bankIcon from "../assets/checkout/bank-icon.png";
import bankArt from "../assets/checkout/bank-art.png";
import cardIcon from "../assets/checkout/card-icon.png";
import cardArt from "../assets/checkout/card-art.png";
import codIcon from "../assets/checkout/cod-icon.png";
import codArt from "../assets/checkout/cod-art.png";
import CartItemRow from "../components/landing/CartItemRow";
import {
  AddCardModal,
  AddBankModal,
  SelectCardModal,
  SelectBankModal,
} from "../components/landing/PaymentModals";
import {
  SelectAddressModal,
  AddAddressModal,
  type AddressData,
} from "../components/landing/AddressModals";

const baht = (n: number) =>
  `฿${n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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
      <span className="font-extrabold text-white leading-none" style={{ fontSize: size * 0.62 }}>
        B
      </span>
    </div>
  );
}

function SlimHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[var(--color-neutral-300)] h-[72px]">
      <div className="max-w-[1200px] h-full mx-auto flex items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <BrightifyLogo size={36} />
          <span className="text-[24px] font-medium text-[var(--color-primary)] leading-none">
            BRIGHTIFY
          </span>
        </Link>
        <span className="hidden md:block w-px h-6 bg-[var(--color-neutral-300)]" />
        <h1 className="hidden md:block text-[20px] font-semibold text-[var(--color-neutral-900)]">
          การชำระเงิน
        </h1>
        <div className="ml-auto flex items-center gap-4">
          <button className="flex items-center gap-1 text-[14px] text-[var(--color-neutral-900)] hover:text-[var(--color-primary)] transition-colors">
            <span>🌐</span>
            <span>ภาษาไทย</span>
          </button>
          <span className="hidden sm:block w-px h-5 bg-[var(--color-neutral-300)]" />
          <button className="hidden sm:flex items-center gap-1 text-[14px] text-[var(--color-neutral-900)] hover:text-[var(--color-primary)] transition-colors">
            <span>?</span>
            <span>ช่วยเหลือ</span>
          </button>
          <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
        </div>
      </div>
    </header>
  );
}

function AddressCard() {
  const [address, setAddress] = useState<AddressData>({
    id: "default",
    name: "นายดิอนันท์ สุทัศน์",
    phone: "(+66)93 695 5934",
    detail:
      "เลขที่ 2 ชั้นที่ 2 ซอยสุขุมวิท 33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140",
    isDefault: true,
  });
  const [selectOpen, setSelectOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <section className="bg-white rounded-lg overflow-hidden flex flex-col">
      <div
        className="h-1.5 w-full"
        style={{
          background:
            "repeating-linear-gradient(45deg, #0485f7 0 14px, #ffffff 14px 16px, #f64669 16px 30px, #ffffff 30px 32px)",
        }}
      />
      <div className="p-4 flex flex-col gap-3">
      <h2 className="text-[20px] font-medium text-[var(--color-primary)]">
        ที่อยู่ในการจัดส่ง
      </h2>
      <div className="bg-[#f7fcfe] rounded p-4 flex items-center gap-6">
        <div className="flex-1 min-w-0 flex flex-col gap-3 justify-center">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[16px] font-semibold text-black">
              {address.name}
            </span>
            <span className="text-[16px] text-black">{address.phone}</span>
            {address.isDefault && (
              <span className="inline-flex items-center text-[10px] text-white bg-[#0088ff] rounded px-3 py-1">
                ที่อยู่หลัก
              </span>
            )}
          </div>
          <p className="text-[14px] text-black">{address.detail}</p>
        </div>
        <button
          type="button"
          onClick={() => setSelectOpen(true)}
          className="shrink-0 px-4 py-1 rounded border border-[var(--color-primary)] text-[12px] font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-100)] transition"
        >
          เปลี่ยน
        </button>
      </div>
      </div>

      <SelectAddressModal
        isOpen={selectOpen}
        onClose={() => setSelectOpen(false)}
        onSelect={(a) => setAddress(a)}
        onAdd={() => {
          setSelectOpen(false);
          setAddOpen(true);
        }}
      />
      <AddAddressModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={(d) => {
          setAddress({
            id: `addr-${Date.now()}`,
            name: `${d.firstName} ${d.lastName}`,
            phone: d.phone,
            detail: `${d.line} แขวง${d.subdistrict}, เขต${d.district} ${d.province} ${d.postcode}`,
            isDefault: d.isDefault,
          });
        }}
      />
    </section>
  );
}

function ItemsCard() {
  const [note, setNote] = useState("");
  return (
    <section className="bg-white rounded-xl border border-[var(--color-neutral-300)] overflow-hidden">
      {/* Column header */}
      <div className="px-4 py-3 grid grid-cols-[1fr_80px_100px_100px] items-center gap-4 text-[13px] text-[var(--color-neutral-700)] border-b border-[var(--color-neutral-300)]">
        <span>รายการที่ต้องชำระเงิน</span>
        <span className="text-center">จำนวน</span>
        <span className="text-center">ราคาต่อชิ้น</span>
        <span className="text-center">ราคารวมทั้งหมด</span>
      </div>

      {/* Shop section */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-[var(--color-neutral-300)] bg-[var(--color-neutral-100)]">
        <span className="text-[15px] font-semibold text-[var(--color-neutral-900)]">
          BMS SHOP
        </span>
        <Link
          to="/store/bms"
          className="ml-auto flex items-center gap-1 text-[13px] text-[var(--color-neutral-500)] hover:text-[var(--color-primary)] transition"
        >
          <span>ไปที่ร้านค้า</span>
          <ChevronRight size={18} />
        </Link>
      </div>

      {/* Item row */}
      <div className="px-4 py-4 grid grid-cols-[1fr_80px_100px_100px] items-center gap-4">
        <CartItemRow
          item={{
            name: "ยาพาราเซตามอล 1000 mg แก้ปวดได้ดีทีเดียวนะkmkmkmkmksma",
            image: paracetamol,
          }}
        />
        <span className="text-center text-[14px] text-[var(--color-neutral-900)]">
          x1
        </span>
        <span className="text-center text-[14px] text-[var(--color-neutral-900)] tabular-nums">
          ฿95.00
        </span>
        <span className="text-center text-[14px] font-semibold text-[var(--color-primary)] tabular-nums">
          ฿95.00
        </span>
      </div>

      {/* Note + delivery/coupon */}
      <div className="px-4 py-3 flex flex-col lg:flex-row gap-4 border-t border-[var(--color-neutral-300)]">
        <div className="lg:w-[300px] shrink-0 flex items-center gap-2">
          <span className="text-[13px] text-[var(--color-neutral-700)] shrink-0">
            หมายเหตุ
          </span>
          <Input
            value={note}
            onValueChange={setNote}
            placeholder="ฝากข้อความถึงผู้ขายและขนส่ง"
            radius="sm"
            size="sm"
            classNames={{
              inputWrapper:
                "h-8 bg-white border border-[var(--color-neutral-300)] shadow-none",
              input:
                "text-[12px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)]",
            }}
          />
        </div>
        <div className="flex-1 flex flex-col gap-2 text-[13px]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-[var(--color-positive-700)]">
              <Truck size={16} />
              จัดส่งฟรี เมื่อซื้อครบ 100 บาท
            </span>
            <span className="text-[var(--color-neutral-700)]">
              จะได้รับสินค้าภายใน วันที่ 1 เม.ย. - 3 เม.ย.
            </span>
            <span className="ml-auto text-[var(--color-neutral-900)] tabular-nums">
              ฿0.00
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-[var(--color-critical)]">
              <Ticket size={16} />
              โค้ดส่วนลดวันสงกรานต์
            </span>
            <button className="text-[var(--color-primary)] hover:underline">
              ดูเงื่อนไขเพิ่มเติม
            </button>
            <span className="ml-auto text-[var(--color-critical)] tabular-nums">
              -฿12.00
            </span>
          </div>
        </div>
      </div>

      {/* Subtotal */}
      <div className="px-4 py-3 border-t border-[var(--color-neutral-300)] flex items-center justify-between">
        <span className="text-[14px] font-semibold text-[var(--color-neutral-900)]">
          คำสั่งซื้อทั้งหมด (1ชิ้น)
        </span>
        <span className="text-[16px] font-bold text-[var(--color-primary)] tabular-nums">
          ฿368.00
        </span>
      </div>
    </section>
  );
}

function CouponCard() {
  return (
    <section className="bg-white rounded-lg p-4 flex items-center">
      <div className="flex items-center gap-4 w-[452px] shrink-0">
        <img src={brigtifyLogo} alt="" className="w-10 h-10 shrink-0" />
        <div className="flex flex-col gap-[3px] min-w-0">
          <p className="text-[16px] font-medium text-[#011b31]">
            ส่วนลดจาก Brigtify
          </p>
          <p className="text-[12px] text-[var(--color-neutral-500)]">
            โค้ดส่วนลดประจำเคมเปญ
          </p>
        </div>
      </div>
      <div className="flex-1 min-w-0 pl-4 flex items-center gap-4">
        <Ticket size={16} className="text-[#dd214f] shrink-0" />
        <span className="text-[14px] font-medium text-[#dd214f] whitespace-nowrap">
          ส่วนลด 4.4 เดือนเมษายน
        </span>
        <button className="flex-1 text-left text-[14px] text-[var(--color-primary)] hover:underline">
          ดูเงื่อนไขเพิ่มเติม
        </button>
        <span className="w-[120px] text-right text-[16px] text-[var(--color-critical)] tabular-nums">
          - ฿12.00
        </span>
      </div>
    </section>
  );
}

function MemberPointsCard() {
  const [point, setPoint] = useState("");
  const reduce = Math.floor(Number(point || 0) / 100);
  return (
    <section className="bg-white rounded-lg p-4 flex items-center gap-4">
      <div className="flex-1 min-w-0 flex items-center gap-4">
        <img src={bmsMemberLogo} alt="" className="w-10 h-10 shrink-0" />
        <div className="flex flex-col gap-[3px]">
          <p className="text-[16px] font-medium text-[#011b31]">BMS Member</p>
          <p className="text-[12px] text-[var(--color-neutral-500)]">
            ใช้ Point สะสมแลกเป็นส่วนลด
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-[3px] shrink-0">
        <div className="flex items-end gap-1">
          <span className="text-[16px] font-bold text-[var(--color-primary)] leading-none">
            237
          </span>
          <span className="text-[12px] text-[var(--color-neutral-500)] leading-none">
            Point
          </span>
        </div>
        <p className="text-[12px] text-[var(--color-neutral-900)]">
          100 Point = 1 บาท
        </p>
      </div>
      <input
        value={point}
        onChange={(e) => setPoint(e.target.value.replace(/\D/g, "").slice(0, 4))}
        placeholder="0 Point"
        className="w-[100px] h-9 px-3 rounded-lg border border-[var(--color-neutral-300)] text-[14px] text-center text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary)] focus:text-[var(--color-neutral-900)]"
      />
      <span className="text-[14px] text-[var(--color-neutral-500)]">=</span>
      <div className="w-[100px] h-9 px-3 rounded-lg border border-[var(--color-neutral-300)] flex items-center justify-center text-[14px] text-[var(--color-neutral-500)]">
        ลด{" "}
        <span className="mx-1 text-[var(--color-primary)]">{reduce}</span> บาท
      </div>
    </section>
  );
}

type PaymentKey = "promptpay" | "bank" | "card" | "cod";

function PaymentMethodCard({
  selected,
  onClick,
  icon,
  art,
  title,
  subtitle,
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  art: string;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative text-left rounded-lg p-4 overflow-hidden flex flex-col gap-2.5 min-h-[110px] transition-all",
        selected
          ? "border border-[var(--color-primary)] bg-[var(--color-primary-100)]"
          : "border border-[var(--color-neutral-300)] bg-white/50 hover:border-[var(--color-primary-400)]",
      ].join(" ")}
    >
      <div className="flex items-center gap-2.5 z-10">
        <img src={icon} alt="" className="w-10 h-10 rounded-lg shrink-0 object-cover" />
        <span className="text-[16px] font-medium text-black">{title}</span>
      </div>
      <p className="text-[14px] text-black z-10 pr-24">{subtitle}</p>
      <img
        src={art}
        alt=""
        aria-hidden
        className="absolute right-2 bottom-0 w-[100px] h-[100px] object-contain pointer-events-none select-none"
      />
    </button>
  );
}

function PaymentMethodsCard() {
  const [method, setMethod] = useState<PaymentKey>("promptpay");
  const [cardSelectOpen, setCardSelectOpen] = useState(false);
  const [bankSelectOpen, setBankSelectOpen] = useState(false);
  const [cardAddOpen, setCardAddOpen] = useState(false);
  const [bankAddOpen, setBankAddOpen] = useState(false);

  return (
    <section className="bg-white rounded-lg p-4">
      <h3 className="text-[20px] font-medium text-black mb-4">
        ช่องชำระเงิน
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PaymentMethodCard
          selected={method === "promptpay"}
          onClick={() => setMethod("promptpay")}
          icon={promptpayIcon}
          art={promptpayArt}
          title="พร้อมเพย์ PromptPay"
          subtitle="แสกน QR Code ชำระเงิน"
        />
        <PaymentMethodCard
          selected={method === "bank"}
          onClick={() => {
            setMethod("bank");
            setBankSelectOpen(true);
          }}
          icon={bankIcon}
          art={bankArt}
          title="บัญชีธนาคาร"
          subtitle="โอนเงินผ่านบัญชีธนาคารร้านค้า"
        />
        <PaymentMethodCard
          selected={method === "card"}
          onClick={() => {
            setMethod("card");
            setCardSelectOpen(true);
          }}
          icon={cardIcon}
          art={cardArt}
          title="บัตรเครดิต/บัตรเดบิต"
          subtitle="ชำระเงินผ่านบัตรเครดิต/บัตรเดบิต"
        />
        <PaymentMethodCard
          selected={method === "cod"}
          onClick={() => setMethod("cod")}
          icon={codIcon}
          art={codArt}
          title="ชำระเงินปลายทาง (COD)"
          subtitle="ชำระเงินเมื่อได้รับสินค้าแล้ว (อาจมีค่าบริการเพิ่ม)"
        />
      </div>

      <SelectCardModal
        isOpen={cardSelectOpen}
        onClose={() => setCardSelectOpen(false)}
        onConfirm={() => setCardSelectOpen(false)}
        onAdd={() => {
          setCardSelectOpen(false);
          setCardAddOpen(true);
        }}
      />
      <SelectBankModal
        isOpen={bankSelectOpen}
        onClose={() => setBankSelectOpen(false)}
        onConfirm={() => setBankSelectOpen(false)}
        onAdd={() => {
          setBankSelectOpen(false);
          setBankAddOpen(true);
        }}
      />
      <AddCardModal
        isOpen={cardAddOpen}
        onClose={() => setCardAddOpen(false)}
        onSubmit={() => setCardAddOpen(false)}
      />
      <AddBankModal
        isOpen={bankAddOpen}
        onClose={() => setBankAddOpen(false)}
        onSubmit={() => setBankAddOpen(false)}
      />
    </section>
  );
}

function SummaryCard() {
  const rows = [
    { label: "ราคาเดิมของสินค้า", value: "฿400.00", color: "neutral" },
    { label: "สินค้าที่ลดราคา", value: "- ฿20.00", color: "critical" },
    { label: "ส่วนลดจากร้านค้า", value: "- ฿12.00", color: "critical" },
    { label: "ส่วนลดจาก BMS Member", value: "฿0.00", color: "neutral" },
    { label: "ค่าจัดส่ง", value: "฿0.00", color: "neutral" },
    { label: "ส่วนลดจาก Bright", value: "- ฿59.00", color: "critical" },
  ] as const;
  return (
    <section className="bg-white rounded-xl border border-[var(--color-neutral-300)] p-5">
      <h3 className="text-[15px] font-semibold text-[var(--color-neutral-900)] mb-4">
        สรุปยอดออเดอร์ทั้งหมด
      </h3>

      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-neutral-300)]">
        <span className="text-[14px] font-semibold text-[var(--color-neutral-900)]">
          ยอดที่ต้องชำระทั้งหมด
        </span>
        <span className="text-[16px] font-bold text-[var(--color-primary)] tabular-nums">
          ฿368.00
        </span>
      </div>

      <dl className="space-y-2 text-[13px]">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <dt className="text-[var(--color-neutral-600)]">{r.label}</dt>
            <dd
              className={[
                "tabular-nums",
                r.color === "critical"
                  ? "text-[var(--color-critical)]"
                  : "text-[var(--color-neutral-900)]",
              ].join(" ")}
            >
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 pt-4 border-t border-[var(--color-neutral-300)] flex items-center justify-between">
        <span className="text-[15px] font-bold text-[var(--color-neutral-900)]">
          ยอดรวมทั้งหมด
        </span>
        <span className="text-[18px] font-bold text-[var(--color-primary)] tabular-nums">
          ฿368.00
        </span>
      </div>
    </section>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const total = 368;
  const savings = 32;
  const itemCount = 3;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <SlimHeader />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 pb-32 space-y-4">
        <AddressCard />
        <ItemsCard />
        <CouponCard />
        <MemberPointsCard />
        <PaymentMethodsCard />
        <SummaryCard />
      </main>

      {/* Sticky checkout bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 px-4 sm:px-6 pointer-events-none">
        <div
          className="max-w-[1200px] mx-auto bg-[var(--color-primary)] border-l border-r border-t border-[var(--color-neutral-300)] rounded-tl-[32px] rounded-tr-[32px] pt-6 pb-8 px-8 flex items-center gap-10 pointer-events-auto"
          style={{ filter: "drop-shadow(0 0 4px #68b6fa)" }}
        >
          <div className="flex flex-1 items-center gap-2.5 min-w-0 text-white">
            <div className="flex flex-col gap-3 w-[220px] shrink-0">
              <p className="text-[20px] font-semibold leading-4">
                มูลค่าสินค้าทั้งหมด
              </p>
              <p className="text-[14px] leading-4">
                เลือกสินค้าทั้งหมด {itemCount} รายการ
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-1 min-w-0 text-right">
              <p className="text-[20px] font-semibold leading-4 tabular-nums">
                {baht(total)}
              </p>
              <p className="text-[14px] leading-4">
                ประหยัดไปทั้งหมด {savings} บาท
              </p>
            </div>
          </div>
          <span className="w-px h-12 bg-white/40" />
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 px-4 py-3 rounded-lg bg-white text-[var(--color-primary)] text-[16px] font-semibold tracking-[-0.011em] shadow-[0_2px_4px_1px_var(--color-primary-600)] hover:brightness-95 active:scale-[0.98] transition"
          >
            สั่งสินค้า
          </button>
        </div>
      </div>
    </div>
  );
}
