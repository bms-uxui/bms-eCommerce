import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  X,
  Package,
  MessageCircle,
  ZoomIn,
} from "lucide-react";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import CopyButton from "../components/landing/CopyButton";
import paracetamol from "../assets/products/p02-paracetamol.jpg";

const CARD =
  "bg-white rounded-xl shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] flex flex-col";

type RefundType = "refund_only" | "refund_return";
const TYPE_LABEL: Record<RefundType, string> = {
  refund_only: "คืนเงินเท่านั้น",
  refund_return: "คืนเงินและคืนสินค้า",
};

function baht(n: number) {
  return `฿ ${n.toLocaleString("th-TH", { minimumFractionDigits: 2 })}`;
}

function Field({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] text-[var(--color-neutral-500)]">{label}</span>
      <span className="text-[14px] text-[var(--color-neutral-900)] flex items-center gap-2">
        {value}
        {copyable && <CopyButton value={value} />}
      </span>
    </div>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-semibold" : ""}`}>
      <span className="text-[14px] text-[var(--color-neutral-900)]">{label}</span>
      <span className={`text-[14px] tabular-nums ${bold ? "text-[var(--color-primary)]" : "text-[var(--color-neutral-900)]"}`}>{value}</span>
    </div>
  );
}

function StepDot({ state, n }: { state: "done" | "current" | "pending"; n: number }) {
  return (
    <span className={[
      "w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0 transition-colors",
      state === "done" ? "bg-[var(--color-primary)] text-white" : state === "current" ? "bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/20" : "bg-white text-[var(--color-neutral-500)] border border-[var(--color-neutral-300)]",
    ].join(" ")}>{n}</span>
  );
}

export default function SellerRefundDetail() {
  const navigate = useNavigate();
  const { id = "BMS-4567890-23" } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type: RefundType = searchParams.get("type") === "refund_return" ? "refund_return" : "refund_only";

  const [decision, setDecision] = useState<null | "approve" | "reject">(null);
  const [returnConfirmed, setReturnConfirmed] = useState(false);
  const [pending, setPending] = useState<null | "approve" | "reject" | "confirm">(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const media = [paracetamol, paracetamol];

  // Status badge for the top bar
  const badge = (() => {
    if (decision === "reject") return { label: "ปฏิเสธคำขอ", bg: "#feeaed", text: "#a3072b" };
    if (decision === "approve") {
      if (type === "refund_only") return { label: "อนุมัติคำขอ", bg: "#d6fc92", text: "#235c04" };
      return returnConfirmed ? { label: "คืนเงินแล้ว", bg: "#d6fc92", text: "#235c04" } : { label: "กำลังส่งคืนสินค้า", bg: "#cce7ff", text: "#025094" };
    }
    return { label: "รอการตรวจสอบ", bg: "#fdefb0", text: "#863a00" };
  })();

  // Timeline
  const timeline: string[] =
    decision === "reject"
      ? ["ส่งคำขอ", "รอการตรวจสอบ", "ปฏิเสธคำขอ"]
      : type === "refund_return"
        ? ["ส่งคำขอ", "รอการตรวจสอบ", "อนุมัติคำขอ", "ลูกค้าส่งคืนสินค้า", "การคืนเงิน"]
        : ["ส่งคำขอ", "รอการตรวจสอบ", "อนุมัติคำขอ", "การคืนเงิน"];
  const currentIdx = (() => {
    if (decision === "reject") return 2;
    if (decision === null) return 1;
    // approved
    if (type === "refund_only") return timeline.length - 1;
    return returnConfirmed ? timeline.length - 1 : 2;
  })();

  // Review card phase
  const terminal =
    decision === "reject" ||
    (decision === "approve" && (type === "refund_only" || returnConfirmed));
  const showReturnConfirm = decision === "approve" && type === "refund_return" && !returnConfirmed;

  const proceed = () => {
    if (decision === null) {
      if (pending === "approve" || pending === "reject") {
        setDecision(pending);
        setPending(null);
      }
      return;
    }
    if (showReturnConfirm && pending === "confirm") {
      setReturnConfirmed(true);
      setPending(null);
    }
  };

  const OptionButton = ({
    active,
    onClick,
    icon,
    label,
    tone,
  }: {
    active: boolean;
    onClick?: () => void;
    icon: React.ReactNode;
    label: string;
    tone: "green" | "red" | "purple";
  }) => {
    const sel = {
      green: "bg-[#d6fc92] border-[#a8d860]",
      red: "bg-[#feeaed] border-[#f4a8b6]",
      purple: "bg-[#f5ebfe] border-[#cdaef0]",
    }[tone];
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        className={[
          "w-full h-11 rounded-lg border flex items-center gap-2 px-3 text-[14px] font-medium text-[var(--color-neutral-900)] transition-colors",
          active ? sel : "bg-white border-[var(--color-neutral-300)] hover:bg-[var(--color-neutral-100,#f5f8fa)]",
        ].join(" ")}
      >
        {icon}
        {label}
      </button>
    );
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader onMenuClick={() => setMobileMenuOpen(true)} />
      <div className="flex">
        <SellerSidebar active="คำขอคืนเงิน/คืนสินค้า" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
          {/* Top bar */}
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate("/seller/refunds")} aria-label="กลับ" className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors"><ChevronLeft size={20} /></button>
            <span className="text-[20px] font-semibold text-[var(--color-neutral-900)]">{id}</span>
            <span className="px-3 py-1 rounded text-[12px] font-medium" style={{ backgroundColor: badge.bg, color: badge.text }}>{badge.label}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left column */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              {/* รายละเอียดคำขอ */}
              <section className={CARD}>
                <div className="px-6 py-5"><h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">รายละเอียดคำขอ</h2></div>
                <div className="flex items-center gap-4 px-6 py-4 border-t border-[var(--color-neutral-200)]">
                  <img src={paracetamol} alt="" className="w-16 h-16 rounded object-cover shrink-0" />
                  <p className="flex-1 min-w-0 text-[16px] text-[var(--color-neutral-900)] truncate">ชาอูหลงผสมดอกหอมหมื่นลี้</p>
                  <span className="w-16 text-center text-[16px] text-[var(--color-neutral-700)]">x1</span>
                  <span className="w-24 text-right text-[16px] font-semibold text-[var(--color-neutral-900)] tabular-nums">{baht(150)}</span>
                </div>
                <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6 border-t border-[var(--color-neutral-200)]">
                  <Field label="หมายเลขคำขอ" value={id} />
                  <Field label="เลขคำสั่งซื้อ" value="#BMS-0987654-87" copyable />
                  <Field label="วันที่" value="24 ส.ค. 2569" />
                  <Field label="ชื่อ-นามสกุล" value="Deenoo kadum" />
                  <Field label="อีเมล" value="dfghjklkjhgs@gmail.com" />
                  <Field label="เบอร์โทรศัพท์" value="0987654567" />
                  <Field label="ประเภทคำขอ" value={TYPE_LABEL[type]} />
                  <Field label="เหตุผล" value="พัสดุหรือสินค้าเสียหาย" />
                  <Field label="วิธีการคืนเงิน" value="ธนาคารกรุงไทย" />
                </div>
                <div className="px-6 py-6 flex flex-col gap-4 border-t border-[var(--color-neutral-200)]">
                  <SummaryRow label="การคืนเงินค่าสินค้า" value={baht(150)} />
                  <SummaryRow label="การคืนเงินค่าจัดส่ง" value={baht(0)} />
                  <SummaryRow label="ยอดรวมการคืนเงิน" value={baht(150)} bold />
                </div>
              </section>

              {/* ข้อมูลเพิ่มเติม */}
              <section className={CARD}>
                <div className="px-6 py-5"><h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">ข้อมูลเพิ่มเติม</h2></div>
                <div className="px-6 py-6 border-t border-[var(--color-neutral-200)] flex flex-col gap-4">
                  <div>
                    <p className="text-[13px] text-[var(--color-neutral-500)] mb-2">รูปภาพและวิดีโอ</p>
                    <div className="flex gap-3 flex-wrap">
                      {media.map((src, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setLightbox(src)}
                          className="relative w-20 h-20 rounded overflow-hidden group cursor-zoom-in"
                          aria-label="ขยายรูปภาพ"
                        >
                          <img src={src} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                            <ZoomIn size={20} />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[13px] text-[var(--color-neutral-500)] mb-2">ข้อความเพิ่มเติม</p>
                    <div className="rounded-lg border border-[var(--color-neutral-300)] px-3 py-2 text-[14px] text-[var(--color-neutral-700)] min-h-[64px]">
                      สินค้าที่ได้รับมีรอยแตกร้าวและบรรจุภัณฑ์เสียหาย ขอคืนเงินทั้งจำนวน
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right column */}
            <aside className="w-full lg:w-[340px] shrink-0 self-start lg:sticky lg:top-[88px] flex flex-col gap-6">
              {/* พิจารณาคำขอ */}
              <section className={CARD}>
                <div className="px-6 py-5 border-b border-[var(--color-neutral-200)]"><h3 className="text-[18px] font-medium text-[var(--color-neutral-900)]">พิจารณาคำขอ</h3></div>
                <div className="px-6 py-5 flex flex-col gap-3">
                  {decision === null && (
                    <>
                      <OptionButton active={pending === "approve"} onClick={() => setPending("approve")} tone="green" label="อนุมัติคำขอ" icon={<CheckCircle2 size={18} className="text-[#235c04]" />} />
                      <OptionButton active={pending === "reject"} onClick={() => setPending("reject")} tone="red" label="ปฏิเสธคำขอ" icon={<XCircle size={18} className="text-[#a3072b]" />} />
                    </>
                  )}
                  {decision === "reject" && (
                    <OptionButton active onClick={undefined} tone="red" label="ปฏิเสธคำขอ" icon={<XCircle size={18} className="text-[#a3072b]" />} />
                  )}
                  {decision === "approve" && type === "refund_only" && (
                    <OptionButton active onClick={undefined} tone="green" label="อนุมัติคำขอ" icon={<CheckCircle2 size={18} className="text-[#235c04]" />} />
                  )}
                  {decision === "approve" && type === "refund_return" && (
                    <>
                      <OptionButton active onClick={undefined} tone="green" label="อนุมัติคำขอ" icon={<CheckCircle2 size={18} className="text-[#235c04]" />} />
                      <OptionButton active={returnConfirmed || pending === "confirm"} onClick={returnConfirmed ? undefined : () => setPending("confirm")} tone="purple" label="ยืนยันการรับคืนสินค้า" icon={<Package size={18} className="text-[#5824d4]" />} />
                    </>
                  )}
                </div>
                <div className="px-6 py-5 border-t border-[var(--color-neutral-200)] flex flex-col gap-3">
                  <button type="button" className="h-10 rounded-lg border border-[var(--color-neutral-300)] text-[14px] font-medium text-[var(--color-neutral-900)] flex items-center justify-center gap-2 hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors">
                    <MessageCircle size={16} />แชทลูกค้า
                  </button>
                  {!terminal && (
                    <button
                      type="button"
                      onClick={proceed}
                      disabled={pending === null}
                      className="h-10 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:bg-[var(--color-primary-600)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-primary)]"
                    >
                      ดำเนินการต่อ
                    </button>
                  )}
                </div>
              </section>

              {/* Timeline */}
              <section className={CARD}>
                <ol className="px-6 py-6 flex flex-col">
                  {timeline.map((label, i) => {
                    const state: "done" | "current" | "pending" = i < currentIdx ? "done" : i === currentIdx ? "current" : "pending";
                    const last = i === timeline.length - 1;
                    return (
                      <li key={label} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <StepDot state={state} n={i + 1} />
                          {!last && <span className={`w-px flex-1 my-1 min-h-[24px] transition-colors ${state === "done" ? "bg-[var(--color-primary)]" : "bg-[var(--color-neutral-300)]"}`} />}
                        </div>
                        <div className={`flex flex-col gap-0.5 pb-6 ${last ? "pb-0" : ""}`}>
                          <p className={`text-[14px] font-medium ${state === "pending" ? "text-[var(--color-neutral-500)]" : "text-[var(--color-primary)]"}`}>{label}</p>
                          <p className="text-[12px] text-[var(--color-neutral-500)]">วันที่ 24 ส.ค. 2569</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            </aside>
          </div>
        </main>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6 drawer-overlay-in"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-label="ดูรูปภาพ"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="ปิด"
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
          <img
            src={lightbox}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[85vh] rounded-lg object-contain shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
          />
        </div>
      )}
    </div>
  );
}
