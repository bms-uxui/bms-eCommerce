import { useEffect, useState, type ReactNode } from "react";
import { Modal, ModalContent } from "@heroui/react";
import { Check, X } from "lucide-react";
import kasikorn from "../../assets/payments/kasikorn.png";

export type WithdrawStep = "form" | "processing" | "success" | "failed";

const BANK = { logo: kasikorn, name: "ธนาคารกสิกรไทย", short: "Kasikorn Bank", masked: "96* **** *08" };
const REF = "56728904359487326";
const QUICK = [5000, 10000, 100000, 200000];

function fmt(n: number) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function SummaryList({ amount, fee, dest, destFailed }: { amount: number; fee: number; dest: string; destFailed?: boolean }) {
  const rows: { label: string; value: ReactNode }[] = [
    { label: "จำนวนเงินที่ถอน", value: `฿ ${fmt(amount)}` },
    { label: "ค่าบริการ", value: `฿ ${fmt(fee)}` },
    { label: "จำนวนเงินที่จะได้รับ", value: `฿ ${fmt(Math.max(0, amount - fee))}` },
    { label: "โอนไปยัง", value: <span className={destFailed ? "text-[var(--color-critical)]" : "text-[var(--color-neutral-900)]"}>{dest}{!destFailed && <><br /><span className="text-[12px] text-[var(--color-neutral-500)]">{BANK.masked}</span></>}</span> },
    { label: "หมายเลขอ้างอิง", value: REF },
    { label: "วันเวลาทำการ", value: "27/05/2026 - 12.15" },
  ];
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[15px] font-semibold text-[var(--color-neutral-900)]">รายการ</p>
      {rows.map((r) => (
        <div key={r.label} className="flex items-start justify-between gap-4 text-[14px]">
          <span className="text-[var(--color-neutral-600)] shrink-0">{r.label}</span>
          <span className="text-right text-[var(--color-neutral-900)]">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function WithdrawModal({
  isOpen,
  onClose,
  balance = 0,
  initialStep = "form",
}: {
  isOpen: boolean;
  onClose: () => void;
  balance?: number;
  initialStep?: WithdrawStep;
}) {
  const [step, setStep] = useState<WithdrawStep>(initialStep);
  const [amount, setAmount] = useState("");
  const fee = 0;
  const numAmount = Number(amount.replace(/,/g, "")) || 0;

  useEffect(() => {
    if (isOpen) { setStep(initialStep); setAmount(""); }
  }, [isOpen, initialStep]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" size="md" hideCloseButton scrollBehavior="inside" classNames={{ base: "rounded-2xl" }}>
      <ModalContent>
        {step === "form" && (
          <div className="flex flex-col">
            <div className="p-5 border-b border-[var(--color-neutral-300)]">
              <h2 className="text-[20px] font-bold text-[var(--color-primary)]">การถอนเงิน</h2>
              <p className="text-[14px] text-[var(--color-neutral-500)] mt-0.5">คุณจะได้รับเงินภายใน 5 วันทำการ</p>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={BANK.logo} alt="" className="w-9 h-9 rounded-lg object-contain shrink-0" />
                  <p className="text-[15px] font-semibold text-[var(--color-neutral-900)] truncate">{BANK.name}</p>
                </div>
                <span className="text-[14px] text-[var(--color-neutral-700)] tabular-nums">{BANK.masked}</span>
                <button type="button" className="h-8 px-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition-colors shrink-0">เปลี่ยน</button>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[14px] text-[var(--color-neutral-700)]">จำนวนเงิน</span>
                <div className="h-11 flex items-center gap-2 rounded-lg border border-[var(--color-neutral-300)] px-3 focus-within:border-[var(--color-primary)]">
                  <span className="text-[15px] text-[var(--color-neutral-500)]">฿</span>
                  <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ""))} placeholder="กรอกจำนวนเงิน" className="flex-1 min-w-0 text-[15px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none" />
                  {amount && <button type="button" onClick={() => setAmount("")} aria-label="ล้าง" className="text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-700)]"><X size={16} /></button>}
                </div>
                <span className="text-[13px] text-[var(--color-neutral-500)]">ยอดคงเหลือ ฿ {fmt(balance)}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setAmount(String(balance))} className="h-8 px-3 rounded-lg border border-[var(--color-neutral-300)] text-[13px] text-[var(--color-neutral-700)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">ถอนทั้งหมด</button>
                {QUICK.map((q) => (
                  <button key={q} type="button" onClick={() => setAmount(String(q))} className="h-8 px-3 rounded-lg border border-[var(--color-neutral-300)] text-[13px] text-[var(--color-neutral-700)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">฿ {q.toLocaleString("th-TH")}</button>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <p className="text-[15px] font-semibold text-[var(--color-neutral-900)]">รายการ</p>
                <div className="flex items-center justify-between text-[14px]"><span className="text-[var(--color-neutral-600)]">ค่าบริการ</span><span className="text-[var(--color-neutral-900)]">฿ {fmt(fee)}</span></div>
                <div className="flex items-center justify-between text-[14px]"><span className="text-[var(--color-neutral-600)]">จำนวนเงินที่จะได้รับ</span><span className="font-semibold text-[var(--color-primary)]">฿ {fmt(Math.max(0, numAmount - fee))}</span></div>
              </div>
            </div>
            <div className="p-4 border-t border-[var(--color-neutral-300)] flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 h-11 rounded-lg border border-[var(--color-neutral-300)] text-[15px] font-medium text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors">ยกเลิก</button>
              <button type="button" onClick={() => setStep("processing")} className="flex-1 h-11 rounded-lg bg-[var(--color-primary)] text-white text-[15px] font-medium hover:bg-[var(--color-primary-600)] transition-colors">ส่ง</button>
            </div>
          </div>
        )}

        {step !== "form" && (
          <div className="flex flex-col">
            <div className="p-6 flex flex-col items-center text-center bg-gradient-to-b from-[var(--color-primary-100)]/60 to-white">
              <span className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${step === "failed" ? "bg-[var(--color-critical)]" : "bg-[#22c55e]"}`}>
                {step === "failed" ? <X size={26} strokeWidth={3} /> : <Check size={26} strokeWidth={3} />}
              </span>
              <h2 className="text-[20px] font-bold text-[var(--color-neutral-900)] mt-3">
                {step === "processing" ? "กำลังดำเนินการถอน" : step === "success" ? "ถอนเงินสำเร็จ" : "ถอนเงินไม่สำเร็จ"}
              </h2>
              <p className="text-[14px] text-[var(--color-primary)] mt-0.5">
                {step === "processing" ? "คุณจะได้รับเงินภายใน 5 วันทำการ" : `วันเวลาที่ดำเนินการสำเร็จ 27/05/2026 - 12.20`}
              </p>
            </div>
            <div className="px-6 py-5 border-t border-[var(--color-neutral-200)]">
              <SummaryList amount={numAmount} fee={fee} dest={step === "failed" ? "บัญชีปลายทางมีปัญหา" : BANK.short} destFailed={step === "failed"} />
            </div>
            <div className="p-4">
              <button type="button" onClick={onClose} className="w-full h-11 rounded-lg bg-[var(--color-primary)] text-white text-[15px] font-medium hover:bg-[var(--color-primary-600)] transition-colors">ปิดหน้านี้</button>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
