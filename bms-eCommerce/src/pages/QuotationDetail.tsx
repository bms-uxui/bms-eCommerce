import { useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  ChevronLeft,
  X,
  Pencil,
  Copy,
  Check,
  MessageCircle,
  Info,
  Upload as UploadIcon,
  FileText,
  ExternalLink,
} from "lucide-react";
import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";
import paracetamol from "../assets/products/p02-paracetamol.jpg";

type StepStatus = "done" | "current" | "pending";

const STATUS_LABEL = {
  pending: "รอดำเนินการ",
  contacted: "ติดต่อแล้ว",
  quoted: "เสนอราคาแล้ว",
  accepted: "ยอมรับแล้ว",
  ordered: "สร้างคำสั่งซื้อแล้ว",
  closed: "ปิด",
  expired: "หมดอายุ",
  cancelled: "ยกเลิกแล้ว",
} as const;

const STATUS_STYLE = {
  pending: "bg-[#fdefb0] text-[#863a00]",
  contacted: "bg-[#cce7ff] text-[#025094]",
  quoted: "bg-[#f5ebfe] text-[#5824d4]",
  accepted: "bg-[#d6fc92] text-[#235c04]",
  ordered: "bg-[#d6fc92] text-[#235c04]",
  closed: "bg-[#feeaed] text-[#a3072b]",
  expired: "bg-[#feeaed] text-[#a3072b]",
  cancelled: "bg-[#feeaed] text-[#a3072b]",
} as const;

type StatusKey = keyof typeof STATUS_LABEL;

const TIMELINE: { label: string; date: string }[] = [
  { label: "คำขอใบเสนอราคา", date: "วันที่ 24 ส.ค. 2569" },
  { label: "รอดำเนินการ", date: "วันที่ 24 ส.ค. 2569" },
  { label: "ติดต่อแล้ว", date: "วันที่ 24 ส.ค. 2569" },
  { label: "เสนอราคาแล้ว", date: "วันที่ 24 ส.ค. 2569" },
  { label: "ยอมรับใบเสนอแล้ว", date: "วันที่ 24 ส.ค. 2569" },
  { label: "สร้างคำสั่งซื้อแล้ว", date: "วันที่ 24 ส.ค. 2569" },
  { label: "ยกเลิกคำขอใบเสนอราคา", date: "วันที่ 24 ส.ค. 2569" },
];

function CustomerField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[14px] text-[var(--color-neutral-500)]">
        {label}
      </span>
      <span className="text-[16px] text-[var(--color-neutral-900)]">
        {value}
      </span>
    </div>
  );
}

function StepDot({ status, n }: { status: StepStatus; n: number }) {
  const styles =
    status === "done"
      ? "bg-[var(--color-primary)] text-white"
      : status === "current"
        ? "bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/20"
        : "bg-white text-[var(--color-neutral-500)] border border-[var(--color-neutral-300)]";
  return (
    <span
      className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0 ${styles}`}
    >
      {n}
    </span>
  );
}

function ProductRow({
  image,
  name,
  qty,
  price,
}: {
  image: string;
  name: string;
  qty: number;
  price: number;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-t border-[var(--color-neutral-200)]">
      <img
        src={image}
        alt=""
        className="w-16 h-16 rounded object-cover shrink-0"
      />
      <p className="flex-1 min-w-0 text-[16px] text-[var(--color-neutral-900)] truncate">
        {name}
      </p>
      <span className="w-20 text-center text-[16px] text-[var(--color-neutral-700)]">
        x{qty}
      </span>
      <span className="w-24 text-right text-[16px] font-semibold text-[var(--color-neutral-900)] tabular-nums">
        ฿ {price.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
      </span>
    </div>
  );
}

const STATUS_TO_STEP: Record<StatusKey, number> = {
  pending: 1,
  contacted: 2,
  quoted: 3,
  accepted: 4,
  ordered: 5,
  closed: 6,
  expired: 6,
  cancelled: 6,
};

export default function QuotationDetail() {
  const navigate = useNavigate();
  const { id = "BMS-0987654-87" } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const rawStatus = (searchParams.get("status") ?? "contacted") as StatusKey;
  const status: StatusKey = (Object.keys(STATUS_TO_STEP) as StatusKey[]).includes(
    rawStatus
  )
    ? rawStatus
    : "contacted";
  const currentStep = STATUS_TO_STEP[status];

  // Upload card visible from step 4 (เสนอราคาแล้ว) onwards
  const showUploadCard = currentStep >= 3;
  // Order CTA appears when the order has been created
  const showOrderCTA = currentStep >= 5 && status === "ordered";
  // For accepted/ordered states, pre-populate as if buyer already uploaded the signed PDF
  const initiallyUploaded = status === "accepted" || status === "ordered";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(
    initiallyUploaded ? "ไฟล์ชื่อ.pdf" : null
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onPickFile = () => fileInputRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.type !== "application/pdf") {
      setUploadError("รองรับเฉพาะไฟล์ PDF");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setUploadError("ขนาดไฟล์ต้องไม่เกิน 5 MB");
      return;
    }
    setUploadedName(f.name);
  };

  const subtotal = 250;
  const discountPct = 10;
  const discount = (subtotal * discountPct) / 100;
  const total = subtotal - discount;

  const [copied, setCopied] = useState(false);
  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(`#${id}`);
    } catch {
      // ignore
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />

      <div className="max-w-[1240px] mx-auto px-3 sm:px-4 lg:px-5 pt-6 pb-12">
        {/* Top action bar */}
        <div className="h-[88px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/quotation")}
              aria-label="กลับ"
              className="w-10 h-10 flex items-center justify-center rounded text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)] transition"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-[22px] font-medium text-[var(--color-neutral-900)] tracking-[-0.011em]">
              #{id}
            </span>
            <span
              className={`px-4 py-1 rounded text-[12px] font-medium ${STATUS_STYLE[status]}`}
            >
              {STATUS_LABEL[status]}
            </span>
          </div>
          <button
            type="button"
            className="h-10 px-4 rounded-lg border border-[var(--color-critical)] text-[var(--color-critical)] text-[14px] font-medium flex items-center gap-2 hover:bg-[var(--color-critical)]/5 transition"
          >
            <X size={15} />
            ยกเลิกคำขอ
          </button>
        </div>

        {/* Two-column body */}
        <div className="flex flex-col lg:flex-row gap-6 page-section-in" style={{ animationDelay: "120ms" }}>
          {/* Left column */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Left: details card */}
          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] flex flex-col">
            <div className="flex items-center justify-between h-20 px-6">
              <h2 className="text-[20px] font-medium text-[var(--color-neutral-900)]">
                รายละเอียดใบเสนอราคา
              </h2>
              <button
                type="button"
                className="h-10 px-4 rounded-lg border border-[var(--color-neutral-400)] text-[var(--color-neutral-900)] text-[14px] font-medium flex items-center gap-2 hover:bg-[var(--color-neutral-100)] transition"
              >
                <Pencil size={16} />
                แก้ไขคำขอ
              </button>
            </div>

            {/* Customer info */}
            <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 border-t border-[var(--color-neutral-200)]">
              <CustomerField label="หมายเลขคำขอ" value="Deenee" />
              <CustomerField label="นามสกุล" value="kadum" />
              <CustomerField
                label="ชื่อหน่วยงาน/โรงพยาบาลที่สังกัด"
                value="โรงพยาบาลจุฬาลงกรณ์"
              />
              <CustomerField label="ตำแหน่ง" value="แพทย์ชำนาญการตา" />
              <CustomerField label="เบอร์โทรศัพท์" value="0987654567" />
              <CustomerField label="อีเมล" value="dfghjk;lkjhgs@gmail.com" />
              <div className="md:col-span-2">
                <CustomerField
                  label="ข้อมูลที่อยู่สำหรับจัดส่ง"
                  value="เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์ 33 แขวงราษฎร์บูรณะ เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140"
                />
              </div>
            </div>

            {/* Products */}
            <div className="flex flex-col">
              <ProductRow
                image={paracetamol}
                name="ชาอูหลงผสมดอกหอมหมื่นลี้"
                qty={1}
                price={150}
              />
              <ProductRow
                image={paracetamol}
                name="ชาอูหลงผสมดอกหอมหมื่นลี้"
                qty={1}
                price={100}
              />
            </div>

            {/* Summary */}
            <div className="px-6 py-6 flex flex-col gap-4 border-t border-[var(--color-neutral-200)]">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[var(--color-neutral-900)]">
                  หมายเลขคำขอ
                </span>
                <div className="flex items-center gap-2 relative">
                  <span className="text-[14px] text-[var(--color-neutral-900)]">
                    #{id}
                  </span>
                  <button
                    type="button"
                    onClick={copyNumber}
                    aria-label="คัดลอกหมายเลขคำขอ"
                    className="text-[var(--color-neutral-700)] hover:text-[var(--color-primary)] transition"
                  >
                    {copied ? (
                      <Check size={20} className="text-[var(--color-positive-700)]" />
                    ) : (
                      <Copy size={20} />
                    )}
                  </button>
                  {copied && (
                    <span
                      role="status"
                      className="pointer-events-none absolute right-0 top-[calc(100%+4px)] whitespace-nowrap rounded-md bg-[var(--color-neutral-900)] px-2 py-1 text-[12px] font-medium text-white shadow-md z-20"
                    >
                      คัดลอกแล้ว
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[var(--color-neutral-900)]">
                  วันที่ส่งคำขอใบเสนอราคา
                </span>
                <span className="text-[14px] text-[var(--color-neutral-900)]">
                  5 พ.ค. 2569 15.42
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[var(--color-neutral-900)]">
                  ราคาสินค้ารวมที่เสนอ
                </span>
                <span className="text-[14px] text-[var(--color-neutral-900)] tabular-nums">
                  ฿ {subtotal.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[var(--color-neutral-900)]">
                  ส่วนลด {discountPct}%
                </span>
                <span className="text-[14px] text-[var(--color-critical)] tabular-nums">
                  - ฿ {discount.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span className="text-[14px] text-[var(--color-neutral-900)]">
                  ยอดรวม
                </span>
                <span className="text-[14px] text-[var(--color-primary)] tabular-nums">
                  ฿ {total.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Note */}
            <div className="px-6 py-6 flex flex-col gap-2 border-t border-[var(--color-neutral-200)]">
              <span className="text-[14px] text-[var(--color-neutral-500)]">
                หมายเหตุ
              </span>
              <p className="text-[16px] text-[var(--color-neutral-900)]">-</p>
            </div>
          </section>

          {/* Upload card — ตอบรับใบเสนอราคา */}
          {showUploadCard && (
            <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] flex flex-col">
              <div className="px-6 py-5 border-b border-[var(--color-neutral-200)]">
                <h3 className="text-[18px] font-medium text-[var(--color-neutral-900)]">
                  ตอบรับใบเสนอราคา
                </h3>
              </div>
              <div className="px-6 py-6 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[14px] text-[var(--color-neutral-700)]">
                    <Info size={16} className="shrink-0" />
                    <span>ดาวน์โหลด PDF แล้วลงนาม จากนั้นอัปโหลดกลับเพื่อตอบรับ</span>
                  </div>
                  <button
                    type="button"
                    className="h-10 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition shrink-0"
                  >
                    ดาวน์โหลด PDF
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={onFileChange}
                  className="hidden"
                  aria-label="อัปโหลดใบเสนอราคา"
                />

                {uploadedName ? (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#ecfccb] border border-[#d6fc92]">
                    <FileText size={20} className="text-[#235c04] shrink-0" />
                    <span className="flex-1 text-[14px] text-[#235c04] truncate">
                      {uploadedName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setUploadedName(null)}
                      aria-label="ลบไฟล์"
                      className="text-[var(--color-critical)] hover:bg-[var(--color-critical)]/10 rounded p-1 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={onPickFile}
                    className="w-full rounded-lg border border-dashed border-[var(--color-neutral-300)] py-10 flex flex-col items-center justify-center gap-3 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-100)]/40 transition"
                  >
                    <UploadIcon size={32} className="text-[var(--color-neutral-700)]" />
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-[14px] text-[var(--color-neutral-900)]">
                        <span className="text-[var(--color-primary)] font-medium">
                          อัปโหลด
                        </span>{" "}
                        ใบเสนอราคาที่ลงนามแล้ว
                      </p>
                      <p className="text-[12px] text-[var(--color-neutral-500)]">
                        ไฟล์ PDF และขนาดไม่เกิน 5 MB
                      </p>
                    </div>
                  </button>
                )}
                {uploadError && (
                  <p className="text-[12px] text-[var(--color-critical)]">
                    {uploadError}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Order created CTA */}
          {showOrderCTA && (
            <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] flex flex-col">
              <div className="px-6 py-4 flex items-center gap-2 text-[14px] text-[var(--color-neutral-700)]">
                <Info size={16} className="shrink-0" />
                <span>ใบเสนอราคานี้ถูกแปลงเป็นคำสั่งซื้อแล้ว</span>
              </div>
              <div className="px-6 pb-6">
                <button
                  type="button"
                  onClick={() => navigate("/delivery")}
                  className="w-full h-10 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium flex items-center justify-center gap-2 hover:brightness-110 transition"
                >
                  <ExternalLink size={16} />
                  ดูคำสั่งซื้อ #BMS-098765-987
                </button>
              </div>
            </section>
          )}
          </div>

          {/* Right: timeline card */}
          <aside className="w-full lg:w-[364px] shrink-0 bg-white rounded-2xl border border-[var(--color-neutral-300)] flex flex-col self-start lg:sticky lg:top-[120px]">
            <div className="px-6 py-5 border-b border-[var(--color-neutral-200)]">
              <h3 className="text-[20px] font-medium text-[var(--color-neutral-900)]">
                การดำเนินการ
              </h3>
            </div>

            <ol className="px-8 py-6 flex flex-col">
              {TIMELINE.map((step, i) => {
                const stepStatus: StepStatus =
                  i < currentStep ? "done" : i === currentStep ? "current" : "pending";
                const isLast = i === TIMELINE.length - 1;
                return (
                  <li key={step.label} className="relative flex gap-3">
                    <div className="flex flex-col items-center">
                      <StepDot status={stepStatus} n={i + 1} />
                      {!isLast && (
                        <span
                          className={`w-px flex-1 my-1 ${
                            stepStatus === "done"
                              ? "bg-[var(--color-primary)]"
                              : "bg-[var(--color-neutral-300)]"
                          }`}
                        />
                      )}
                    </div>
                    <div className={`flex flex-col gap-1 pb-6 ${isLast ? "pb-0" : ""}`}>
                      <p
                        className={`text-[14px] font-medium ${
                          stepStatus === "pending"
                            ? "text-[var(--color-neutral-500)]"
                            : "text-[var(--color-primary)]"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[12px] text-[var(--color-neutral-500)]">
                        {step.date}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="px-6 py-6 border-t border-[var(--color-neutral-200)]">
              <button
                type="button"
                className="w-full h-10 px-4 rounded-lg border border-[var(--color-neutral-400)] text-[var(--color-neutral-900)] text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-[var(--color-neutral-100)] transition"
              >
                <MessageCircle size={20} />
                แชทร้านค้า
              </button>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
