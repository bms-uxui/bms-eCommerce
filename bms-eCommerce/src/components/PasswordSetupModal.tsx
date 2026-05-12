import { useEffect, useRef, useState } from "react";

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-[440px] max-h-[90vh] overflow-y-auto flex flex-col">
        {children}
      </div>
    </div>
  );
}

function Stepper({ current }: { current: 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      {([1, 2] as const).map((n, i) => (
        <div key={n} className="flex items-center gap-2">
          {i > 0 && (
            <span
              className={`block w-10 h-px ${current >= n ? "bg-[var(--color-primary)]" : "bg-[var(--color-neutral-300)]"}`}
            />
          )}
          <span
            className={[
              "w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-medium",
              current >= n
                ? "bg-[var(--color-primary)] text-white"
                : "border border-[var(--color-primary)] text-[var(--color-primary)]",
            ].join(" ")}
          >
            {n}
          </span>
        </div>
      ))}
    </div>
  );
}

function CodeBoxes({
  length = 6,
  value,
  onChange,
}: {
  length?: number;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const setAt = (i: number, ch: string) => {
    const next = [...value];
    next[i] = ch;
    onChange(next);
  };
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => {
            const ch = e.target.value.replace(/\D/g, "").slice(-1);
            setAt(i, ch);
            if (ch && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0) {
              refs.current[i - 1]?.focus();
              setAt(i - 1, "");
            }
          }}
          className="w-12 h-12 rounded-lg border border-[var(--color-neutral-300)] bg-white text-center text-[18px] text-[var(--color-neutral-900)] outline-none focus:border-[var(--color-primary)]"
        />
      ))}
    </div>
  );
}

const FOOTER_PRIMARY =
  "h-11 rounded-lg bg-[var(--color-primary)] text-white text-[15px] font-medium hover:brightness-110 disabled:opacity-50 transition";
const FOOTER_GHOST =
  "h-11 rounded-lg border border-[var(--color-neutral-400)] bg-white text-[var(--color-neutral-900)] text-[15px] font-medium hover:bg-[var(--color-neutral-100,#f5f8fa)] transition";

export type PasswordSetupModalProps = {
  /** Phone the OTP is "sent" to (display only). */
  phone?: string;
  onClose: () => void;
  onComplete?: () => void;
};

/** Two-step modal flow: OTP verification → create/confirm PIN. */
export default function PasswordSetupModal({
  phone = "(+66) 93 695 5932",
  onClose,
  onComplete,
}: PasswordSetupModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [pin, setPin] = useState<string[]>(Array(6).fill(""));
  const [pinConfirm, setPinConfirm] = useState<string[]>(Array(6).fill(""));
  const [seconds, setSeconds] = useState(59);

  useEffect(() => {
    if (step !== 1 || seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, seconds]);

  const otpComplete = otp.every((d) => d !== "");
  const pinStr = pin.join("");
  const pinConfirmStr = pinConfirm.join("");
  const pinComplete = pinStr.length === 6 && pinStr === pinConfirmStr;

  return (
    <ModalShell onClose={onClose}>
      {step === 1 ? (
        <>
          <div className="px-6 pt-6 pb-4 border-b border-[var(--color-neutral-200)]">
            <h2 className="text-[18px] font-bold text-[var(--color-neutral-900)] text-center">
              ยืนยันรหัส OTP บัญชีของคุณ
            </h2>
          </div>
          <div className="px-6 py-5 flex flex-col gap-4">
            <Stepper current={1} />
            <p className="text-[14px] text-[var(--color-neutral-500)] text-center">
              รหัส OTP จะถูกส่งไปยัง SMS ที่หมายเลข
            </p>
            <p className="text-[16px] font-semibold text-[var(--color-neutral-900)] text-center">{phone}</p>
            <CodeBoxes value={otp} onChange={setOtp} />
            <div className="flex items-center justify-center gap-2 text-[13px]">
              <span className="text-[var(--color-critical)] tabular-nums">
                {`00.${seconds.toString().padStart(2, "0")}`}
              </span>
              <button
                type="button"
                disabled={seconds > 0}
                onClick={() => {
                  setSeconds(59);
                  setOtp(Array(6).fill(""));
                }}
                className="text-[var(--color-primary)] hover:underline disabled:text-[var(--color-neutral-400)] disabled:no-underline"
              >
                ส่งอีกครั้ง
              </button>
            </div>
          </div>
          <div className="px-6 pb-6 flex flex-col gap-3">
            <button
              type="button"
              disabled={!otpComplete}
              onClick={() => setStep(2)}
              className={FOOTER_PRIMARY}
            >
              ยืนยัน
            </button>
            <button type="button" onClick={onClose} className={FOOTER_GHOST}>
              ยกเลิก
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="px-6 pt-6 pb-4 border-b border-[var(--color-neutral-200)]">
            <h2 className="text-[18px] font-bold text-[var(--color-neutral-900)] text-center">
              สร้าง PIN ของคุณ
            </h2>
          </div>
          <div className="px-6 py-5 flex flex-col gap-5">
            <Stepper current={2} />
            <div className="flex flex-col gap-2">
              <span className="text-[14px] text-[var(--color-neutral-700)]">ตั้งรหัส PIN</span>
              <CodeBoxes value={pin} onChange={setPin} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[14px] text-[var(--color-neutral-700)]">ยืนยันรหัส PIN</span>
              <CodeBoxes value={pinConfirm} onChange={setPinConfirm} />
            </div>
            {pinConfirmStr.length === 6 && !pinComplete && (
              <p className="text-[12px] text-[var(--color-critical)] text-center">รหัส PIN ไม่ตรงกัน</p>
            )}
          </div>
          <div className="px-6 pb-6 flex flex-col gap-3">
            <button
              type="button"
              disabled={!pinComplete}
              onClick={() => {
                onComplete?.();
                onClose();
              }}
              className={FOOTER_PRIMARY}
            >
              บันทึก
            </button>
            <button type="button" onClick={onClose} className={FOOTER_GHOST}>
              ยกเลิก
            </button>
          </div>
        </>
      )}
    </ModalShell>
  );
}
