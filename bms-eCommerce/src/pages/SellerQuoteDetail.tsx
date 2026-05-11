import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Switch, Tooltip } from "@heroui/react";
import {
  ChevronLeft,
  X,
  Copy,
  Check,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  User as UserIcon,
} from "lucide-react";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import SelectNameModal from "../components/landing/SelectNameModal";
import OwnSignatureModal from "../components/landing/OwnSignatureModal";
import type { SignatureResult } from "../components/landing/SignaturePad";

type SignerSig =
  | { kind: "none" }
  | { kind: "book" }
  | { kind: "drawn"; dataUrl: string }
  | { kind: "uploaded"; filename: string };
import paracetamol from "../assets/products/p02-paracetamol.jpg";

type QuoteStatus =
  | "pending"
  | "contacted"
  | "quoted"
  | "accepted"
  | "ordered"
  | "expired"
  | "cancelled";

const STATUS_LABEL: Record<QuoteStatus, string> = {
  pending: "รอดำเนินการ",
  contacted: "ติดต่อแล้ว",
  quoted: "เสนอราคาแล้ว",
  accepted: "ยอมรับแล้ว",
  ordered: "สร้างคำสั่งซื้อแล้ว",
  expired: "หมดอายุ",
  cancelled: "ยกเลิกแล้ว",
};

const STATUS_STYLE: Record<QuoteStatus, { bg: string; text: string }> = {
  pending: { bg: "#fdefb0", text: "#863a00" },
  contacted: { bg: "#cce7ff", text: "#025094" },
  quoted: { bg: "#f5ebfe", text: "#5824d4" },
  accepted: { bg: "#d6fc92", text: "#235c04" },
  ordered: { bg: "#d6fc92", text: "#235c04" },
  expired: { bg: "#feeaed", text: "#a3072b" },
  cancelled: { bg: "#feeaed", text: "#a3072b" },
};

const STATUS_TO_STEP: Record<QuoteStatus, number> = {
  pending: 2,
  contacted: 3,
  quoted: 4,
  accepted: 5,
  ordered: 6,
  expired: 7,
  cancelled: 7,
};

const TIMELINE = [
  "คำขอใบเสนอราคา",
  "รอดำเนินการ",
  "ติดต่อแล้ว",
  "เสนอราคาแล้ว",
  "ลูกค้ายอมรับใบเสนอราคาแล้ว",
  "สร้างคำสั่งซื้อแล้ว",
  "ยกเลิกคำขอใบเสนอราคา",
];

const CARD =
  "bg-white rounded-xl shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] flex flex-col";

function baht(n: number) {
  return `฿ ${n.toLocaleString("th-TH", { minimumFractionDigits: 2 })}`;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[14px] text-[var(--color-neutral-500)]">{label}</span>
      <span className="text-[16px] text-[var(--color-neutral-900)]">{value}</span>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  negative,
  bold,
  primary,
}: {
  label: string;
  value: string;
  negative?: boolean;
  bold?: boolean;
  primary?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-semibold" : ""}`}>
      <span className="text-[14px] text-[var(--color-neutral-900)]">{label}</span>
      <span
        className={`text-[14px] tabular-nums ${
          negative
            ? "text-[var(--color-critical)]"
            : primary
              ? "text-[var(--color-primary)]"
              : "text-[var(--color-neutral-900)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function FieldInput({
  label,
  required,
  placeholder,
}: {
  label: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[14px] text-[var(--color-neutral-700)]">
        {label}
        {required && <span className="text-[var(--color-critical)]"> *</span>}
      </span>
      <input
        type="text"
        placeholder={placeholder}
        className="h-10 rounded-lg border border-[var(--color-neutral-300)] px-3 text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary)]"
      />
    </div>
  );
}

function ManageProductRow({
  name,
  qty,
  basePrice,
}: {
  name: string;
  qty: number;
  basePrice: number;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-t border-[var(--color-neutral-200)]">
      <img src={paracetamol} alt="" className="w-16 h-16 rounded object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-[var(--color-neutral-900)] truncate">{name}</p>
        <p className="text-[14px] text-[var(--color-neutral-500)] mt-1">x{qty}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[12px] text-[var(--color-neutral-500)]">ราคาเดิม</p>
        <p className="text-[14px] font-semibold text-[var(--color-neutral-900)] tabular-nums mt-1">
          {baht(basePrice)}
        </p>
      </div>
      <div className="flex items-center h-10 w-[136px] shrink-0 rounded-lg border border-[var(--color-neutral-300)] px-3 focus-within:border-[var(--color-primary)]">
        <span className="text-[14px] text-[var(--color-neutral-500)]">฿</span>
        <input
          type="text"
          defaultValue={basePrice.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          className="flex-1 min-w-0 ml-2 text-[14px] text-[var(--color-neutral-900)] text-right focus:outline-none tabular-nums"
        />
      </div>
    </div>
  );
}

function StepDot({ state, n }: { state: "done" | "current" | "pending"; n: number }) {
  return (
    <span
      className={[
        "w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0",
        state === "done"
          ? "bg-[var(--color-primary)] text-white"
          : state === "current"
            ? "bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/20"
            : "bg-white text-[var(--color-neutral-500)] border border-[var(--color-neutral-300)]",
      ].join(" ")}
    >
      {n}
    </span>
  );
}

export default function SellerQuoteDetail() {
  const navigate = useNavigate();
  const { id = "BMS-0987654-87" } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const rawStatus = (searchParams.get("status") ?? "pending") as QuoteStatus;
  const status: QuoteStatus = (
    Object.keys(STATUS_LABEL) as QuoteStatus[]
  ).includes(rawStatus)
    ? rawStatus
    : "pending";
  const currentStep = STATUS_TO_STEP[status];

  const [vat, setVat] = useState(true);
  const [signers, setSigners] = useState({ proposer: "", approver: "" });
  const [sigState, setSigState] = useState<{ proposer: SignerSig; approver: SignerSig }>({
    proposer: { kind: "none" },
    approver: { kind: "none" },
  });
  const [nameModalFor, setNameModalFor] = useState<"proposer" | "approver" | null>(null);
  const [ownSigFor, setOwnSigFor] = useState<"proposer" | "approver" | null>(null);
  const [copied, setCopied] = useState(false);
  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(`#${id}`);
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader />
      <div className="flex">
        <SellerSidebar active="ใบเสนอราคา" />
        <main className="flex-1 min-w-0 px-8 py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/seller/quotes")}
                aria-label="กลับ"
                className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-[20px] font-semibold text-[var(--color-neutral-900)]">
                #{id}
              </span>
              <span
                className="px-4 py-1 rounded text-[12px] font-medium"
                style={{
                  backgroundColor: STATUS_STYLE[status].bg,
                  color: STATUS_STYLE[status].text,
                }}
              >
                {STATUS_LABEL[status]}
              </span>
            </div>
            <button
              type="button"
              className="h-10 px-4 rounded-lg border border-[var(--color-critical)] text-[var(--color-critical)] text-[14px] font-medium flex items-center gap-2 hover:bg-[var(--color-critical)]/5 transition-colors"
            >
              <X size={15} />
              ยกเลิกคำขอ
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left column */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              {/* Card 1: รายละเอียดใบเสนอราคา */}
              <section className={CARD}>
                <div className="px-6 py-5">
                  <h2 className="text-[20px] font-medium text-[var(--color-neutral-900)]">
                    รายละเอียดใบเสนอราคา
                  </h2>
                </div>
                <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 border-t border-[var(--color-neutral-200)]">
                  <Field label="หมายเลขคำขอ" value="Deenoo" />
                  <Field label="นามสกุล" value="kadum" />
                  <Field label="ชื่อหน่วยงาน/โรงพยาบาลที่สังกัด" value="โรงพยาบาลรามาธิบดี" />
                  <Field label="ตำแหน่ง" value="แพทย์ประจำบ้าน" />
                  <Field label="เบอร์โทรศัพท์" value="0987654567" />
                  <Field label="อีเมล" value="dfghjklkjhgs@gmail.com" />
                  <div className="md:col-span-2">
                    <Field
                      label="ข้อมูลที่อยู่สำหรับจัดส่ง"
                      value="เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์ 33 แขวงราษฎร์บูรณะ เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140"
                    />
                  </div>
                </div>

                {[
                  { name: "ชาอูหลงผสมดอกหอมหมื่นลี้", qty: 1, price: 150 },
                  { name: "ชาอูหลงผสมดอกหอมหมื่นลี้", qty: 1, price: 100 },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-6 py-4 border-t border-[var(--color-neutral-200)]"
                  >
                    <img src={paracetamol} alt="" className="w-16 h-16 rounded object-cover shrink-0" />
                    <p className="flex-1 min-w-0 text-[16px] text-[var(--color-neutral-900)] truncate">
                      {p.name}
                    </p>
                    <span className="w-16 text-center text-[16px] text-[var(--color-neutral-700)]">
                      x{p.qty}
                    </span>
                    <span className="w-24 text-right text-[16px] font-semibold text-[var(--color-neutral-900)] tabular-nums">
                      {baht(p.price)}
                    </span>
                  </div>
                ))}

                <div className="px-6 py-6 flex flex-col gap-4 border-t border-[var(--color-neutral-200)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[var(--color-neutral-900)]">หมายเลขคำขอ</span>
                    <div className="flex items-center gap-2 relative">
                      <span className="text-[14px] text-[var(--color-neutral-900)]">#{id}</span>
                      <button
                        type="button"
                        onClick={copyNumber}
                        aria-label="คัดลอกหมายเลขคำขอ"
                        className="text-[var(--color-neutral-700)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        {copied ? (
                          <Check size={18} className="text-[var(--color-positive-700)]" />
                        ) : (
                          <Copy size={18} />
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
                  <SummaryRow label="วันที่ส่งคำขอใบเสนอราคา" value="5 พ.ค. 2569 15.42" />
                  <SummaryRow label="ราคาสินค้ารวมที่เสนอ" value={baht(250)} />
                  <SummaryRow label="ส่วนลด 10%" value={`- ${baht(25)}`} negative />
                  <SummaryRow label="ยอดรวม" value={baht(175)} bold primary />
                </div>

                <div className="px-6 py-6 flex flex-col gap-2 border-t border-[var(--color-neutral-200)]">
                  <span className="text-[14px] text-[var(--color-neutral-500)]">หมายเหตุ</span>
                  <p className="text-[16px] text-[var(--color-neutral-900)]">-</p>
                </div>
              </section>

              {/* Card 2: การจัดการ */}
              <section className={CARD}>
                <div className="px-6 py-5">
                  <h2 className="text-[20px] font-medium text-[var(--color-neutral-900)]">
                    การจัดการ
                  </h2>
                </div>

                <ManageProductRow name="ชาอูหลงผสมดอกหอมหมื่นลี้" qty={1} basePrice={150} />
                <ManageProductRow name="ชาอูหลงผสมดอกหอมหมื่นลี้" qty={1} basePrice={100} />

                <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-neutral-200)]">
                  <span className="text-[14px] text-[var(--color-neutral-900)]">
                    รวมภาษีมูลค่าเพิ่ม (VAT 7%)
                  </span>
                  <Switch
                    size="sm"
                    color="success"
                    isSelected={vat}
                    onValueChange={setVat}
                    aria-label="รวมภาษีมูลค่าเพิ่ม"
                  />
                </div>

                <div className="px-6 py-6 flex flex-col gap-4 border-t border-[var(--color-neutral-200)]">
                  <SummaryRow label="ราคาสินค้ารวมที่เสนอ" value={baht(250)} />
                  <SummaryRow label="ส่วนลด 10%" value={`- ${baht(25)}`} negative />
                  <SummaryRow label="ยอดรวม" value={baht(175)} />
                  {vat && <SummaryRow label="รวมภาษีมูลค่าเพิ่ม (VAT 7%)" value={baht(12.25)} />}
                  <SummaryRow label="ราคารวมที่เจ้าหน้าที่เสนอ" value={baht(vat ? 177.25 : 175)} bold primary />
                </div>

                <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[var(--color-neutral-200)]">
                  <FieldInput label="อายุใบเสนอราคา (วัน)" required placeholder="ระยะเวลาที่ใบเสนอราคามีผล" />
                  <FieldInput label="เงื่อนไขการชำระเงิน (วัน)" required placeholder="เช่น ชำระภายใน 7 วัน" />
                  <FieldInput label="ระยะเวลาจัดส่ง (วัน)" placeholder="เช่น 7-14 วันทำการ" />
                </div>

                <div className="px-6 py-6 flex flex-col gap-2 border-t border-[var(--color-neutral-200)]">
                  <span className="text-[14px] text-[var(--color-neutral-700)]">หมายเหตุเจ้าหน้าที่ภายใน</span>
                  <textarea
                    rows={3}
                    placeholder="ข้อความเพิ่มเติม (ถ้ามี)"
                    className="rounded-lg border border-[var(--color-neutral-300)] px-3 py-2 text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary)] resize-none"
                  />
                </div>
              </section>

              {/* Card 3: การตั้งค่า PDF */}
              <section className={CARD}>
                <div className="px-6 py-5 flex items-center justify-between gap-4">
                  <h2 className="text-[20px] font-medium text-[var(--color-neutral-900)]">
                    การตั้งค่า PDF
                  </h2>
                  <button
                    type="button"
                    className="h-10 px-4 rounded-lg border border-[var(--color-neutral-400)] text-[var(--color-neutral-900)] text-[14px] font-medium flex items-center gap-2 hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors shrink-0"
                  >
                    <FileText size={16} />
                    ดาวน์โหลดใบเสนอราคา PDF
                  </button>
                </div>

                <div className="px-6 py-6 flex flex-col gap-4 border-t border-[var(--color-neutral-200)]">
                  {(
                    [
                      { key: "proposer", label: "ผู้เสนอราคา" },
                      { key: "approver", label: "ผู้อนุมัติ" },
                    ] as const
                  ).map((f) => {
                    const sig = sigState[f.key];
                    const signed = sig.kind === "drawn" || sig.kind === "uploaded";
                    return (
                      <div key={f.key} className="flex flex-col gap-2">
                        <span className="text-[14px] text-[var(--color-neutral-700)]">
                          {f.label}
                          <span className="text-[var(--color-critical)]"> *</span>
                        </span>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1 flex items-center h-10 rounded-lg border border-[var(--color-neutral-300)] px-3 focus-within:border-[var(--color-primary)]">
                            <input
                              type="text"
                              value={signers[f.key]}
                              onChange={(e) =>
                                setSigners((s) => ({ ...s, [f.key]: e.target.value }))
                              }
                              placeholder="ชื่อ-นามสกุล"
                              className="flex-1 min-w-0 text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none"
                            />
                            <Tooltip content="เลือกรายชื่อ" placement="top" size="sm" closeDelay={0}>
                              <button
                                type="button"
                                onClick={() => setNameModalFor(f.key)}
                                aria-label="เลือกรายชื่อ"
                                className="shrink-0 text-[var(--color-neutral-500)] hover:text-[var(--color-primary)] transition-colors"
                              >
                                <UserIcon size={18} />
                              </button>
                            </Tooltip>
                          </div>
                          {signed ? (
                            <button
                              type="button"
                              onClick={() => setOwnSigFor(f.key)}
                              className="h-10 px-4 rounded-lg bg-[#d6fc92] text-[#235c04] text-[14px] font-medium flex items-center gap-1.5 hover:brightness-95 transition shrink-0"
                            >
                              <Check size={15} strokeWidth={2.5} />
                              เซ็นแล้ว
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setOwnSigFor(f.key)}
                              className="h-10 px-4 rounded-lg border border-[var(--color-neutral-400)] text-[var(--color-neutral-900)] text-[14px] font-medium hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors shrink-0"
                            >
                              เพิ่มลายเซ็นเอง
                            </button>
                          )}
                        </div>

                        {sig.kind === "book" && (
                          <div className="flex items-center gap-1.5 text-[13px] text-[var(--color-positive-700)]">
                            <CheckCircle2 size={16} />
                            มีลายเซ็นแล้ว
                          </div>
                        )}
                        {signed && (
                          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--color-primary-100)]/50">
                            {sig.kind === "drawn" ? (
                              <img
                                src={sig.dataUrl}
                                alt="ลายเซ็น"
                                className="w-12 h-8 rounded bg-white border border-[var(--color-neutral-200)] object-contain shrink-0"
                              />
                            ) : (
                              <span className="w-8 h-8 rounded bg-[#dcf2fe] shrink-0" />
                            )}
                            <span className="flex-1 min-w-0 text-[14px] text-[var(--color-neutral-600)] truncate">
                              {sig.kind === "uploaded" ? sig.filename : "วาดลายเซ็น"}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setSigState((s) => ({ ...s, [f.key]: { kind: "none" } }))
                              }
                              aria-label="ลบลายเซ็น"
                              className="shrink-0 text-[var(--color-critical)] hover:opacity-80 transition"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="px-6 py-6 flex flex-col gap-2 border-t border-[var(--color-neutral-200)]">
                  <span className="text-[14px] text-[var(--color-neutral-700)]">
                    หมายเหตุ (แสดงในใบเสนอราคา)
                  </span>
                  <textarea
                    rows={3}
                    placeholder="ข้อความเพิ่มเติม (ถ้ามี)"
                    className="rounded-lg border border-[var(--color-neutral-300)] px-3 py-2 text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary)] resize-none"
                  />
                </div>
              </section>
            </div>

            {/* Right column: การดำเนินการ */}
            <aside className={`w-full lg:w-[364px] shrink-0 self-start lg:sticky lg:top-[88px] ${CARD}`}>
              <div className="px-6 py-5 border-b border-[var(--color-neutral-200)]">
                <h3 className="text-[20px] font-medium text-[var(--color-neutral-900)]">
                  การดำเนินการ
                </h3>
              </div>

              <ol className="px-8 py-6 flex flex-col">
                {TIMELINE.map((label, i) => {
                  const stepNo = i + 1;
                  const state: "done" | "current" | "pending" =
                    stepNo < currentStep ? "done" : stepNo === currentStep ? "current" : "pending";
                  const last = i === TIMELINE.length - 1;
                  return (
                    <li
                      key={label}
                      className="step-row-in relative flex gap-3"
                      style={{ animationDelay: `${i * 55}ms` }}
                    >
                      <div className="flex flex-col items-center">
                        <StepDot state={state} n={stepNo} />
                        {!last && (
                          <span
                            className={`w-px flex-1 my-1 min-h-[28px] ${
                              state === "done"
                                ? "bg-[var(--color-primary)]"
                                : "bg-[var(--color-neutral-300)]"
                            }`}
                          />
                        )}
                      </div>
                      <div className={`flex flex-col gap-1 pb-6 ${last ? "pb-0" : ""}`}>
                        <p
                          className={`text-[14px] font-medium ${
                            state === "pending"
                              ? "text-[var(--color-neutral-500)]"
                              : "text-[var(--color-primary)]"
                          }`}
                        >
                          {label}
                        </p>
                        <p className="text-[12px] text-[var(--color-neutral-500)]">วันที่ 24 ส.ค. 2569</p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="px-6 py-6 border-t border-[var(--color-neutral-200)] flex flex-col gap-3">
                <button
                  type="button"
                  className="h-10 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:bg-[var(--color-primary-600)] transition-colors"
                >
                  ดำเนินการต่อ
                </button>
                <p className="text-[12px] text-[var(--color-neutral-500)]">ช่องทางการติดต่อลูกค้า</p>
                <button
                  type="button"
                  className="h-10 rounded-lg border border-[var(--color-neutral-300)] text-[14px] font-medium text-[var(--color-neutral-900)] flex items-center justify-center gap-2 hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors"
                >
                  <Mail size={16} />
                  ติดต่อด้วยอีเมล
                </button>
                <button
                  type="button"
                  className="h-10 rounded-lg border border-[var(--color-neutral-300)] text-[14px] font-medium text-[var(--color-neutral-900)] flex items-center justify-center gap-2 hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors"
                >
                  <Phone size={16} />
                  ติดต่อด้วยการโทร
                </button>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <SelectNameModal
        isOpen={nameModalFor !== null}
        onClose={() => setNameModalFor(null)}
        onSelect={(entry) => {
          if (!nameModalFor) return;
          setSigners((s) => ({ ...s, [nameModalFor]: entry.name }));
          setSigState((s) => ({
            ...s,
            [nameModalFor]: entry.hasSignature ? { kind: "book" } : { kind: "none" },
          }));
        }}
      />
      <OwnSignatureModal
        isOpen={ownSigFor !== null}
        onClose={() => setOwnSigFor(null)}
        onSave={(r: SignatureResult) => {
          if (!ownSigFor) return;
          setSigState((s) => ({
            ...s,
            [ownSigFor]:
              r.kind === "uploaded"
                ? { kind: "uploaded", filename: r.filename }
                : { kind: "drawn", dataUrl: r.dataUrl },
          }));
        }}
      />
    </div>
  );
}
