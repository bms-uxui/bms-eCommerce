import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Input, Button } from "@heroui/react";
import Icon from "../components/landing/Icon";
import loginBg from "../assets/banners/login-bg.png";

function BrightifyLogo({ size = 36 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center shrink-0 rounded-lg shadow-[0_2px_4px_rgba(4,133,247,0.3)]"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #21bdff 0%, #0485f7 50%, #036ac6 100%)",
      }}
    >
      <span className="font-extrabold text-white leading-none" style={{ fontSize: size * 0.62 }}>
        B
      </span>
    </div>
  );
}

function FacebookIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2" aria-hidden>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.024 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.097 24 18.1 24 12.073z" />
    </svg>
  );
}

function GoogleIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(-10);
  if (digits.length < 4) return `(+66) ${digits}`;
  return `(+66) ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
}

// Thai mobile mask: 0XX-XXX-XXXX
function maskThaiPhone(digits: string) {
  const d = digits.slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

function OtpStep({
  phone,
  onCancel,
  onConfirm,
}: {
  phone: string;
  onCancel: () => void;
  onConfirm: (code: string) => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [seconds, setSeconds] = useState(59);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const setAt = (i: number, v: string) => {
    const next = [...digits];
    next[i] = v;
    setDigits(next);
  };

  const handleChange = (i: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, "");
    if (!cleaned) {
      setAt(i, "");
      return;
    }
    if (cleaned.length === 1) {
      setAt(i, cleaned);
      inputs.current[i + 1]?.focus();
      return;
    }
    // paste handling
    const next = [...digits];
    for (let j = 0; j < cleaned.length && i + j < 6; j++) {
      next[i + j] = cleaned[j];
    }
    setDigits(next);
    const nextFocus = Math.min(i + cleaned.length, 5);
    inputs.current[nextFocus]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
      setAt(i - 1, "");
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < 5) {
      inputs.current[i + 1]?.focus();
    }
  };

  const code = digits.join("");
  const filled = code.length === 6;

  useEffect(() => {
    if (filled) {
      const t = setTimeout(() => onConfirm(code), 200);
      return () => clearTimeout(t);
    }
  }, [filled, code, onConfirm]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="px-10 pb-10 flex flex-col items-center">
      <div className="login-item-in w-full flex flex-col items-center gap-6 pt-6" style={{ animationDelay: "60ms" }}>
        <h1 className="text-[20px] font-bold text-[var(--color-neutral-900)] text-center">
          ยืนยันรหัส OTP
        </h1>
        <span className="block w-full h-px bg-[var(--color-neutral-300)]" />
      </div>

      <div className="login-item-in mt-8 flex flex-col items-center gap-3 text-center" style={{ animationDelay: "140ms" }}>
        <p className="text-[14px] text-[var(--color-neutral-500)]">
          รหัส OTP จะถูกส่งไปยัง SMS ที่หมายเลข
        </p>
        <p className="text-[16px] font-semibold text-[#0a0a0a]">
          {formatPhone(phone)}
        </p>
      </div>

      <form
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()}
        className="login-item-in mt-10 w-full flex items-center justify-between"
        style={{ animationDelay: "220ms" }}
      >
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            name={i === 0 ? "otp" : `otp-${i}`}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            data-1p-ignore
            data-lpignore="true"
            data-form-type="other"
            maxLength={6}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKey(i, e)}
            onFocus={(e) => e.currentTarget.select()}
            aria-label={`หลักที่ ${i + 1}`}
            className="w-10 h-10 rounded-lg bg-white border border-[var(--color-neutral-300)] text-center text-[16px] font-medium text-[var(--color-neutral-900)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
          />
        ))}
      </form>

      <div className="login-item-in mt-6 flex items-center gap-2 text-[14px]" style={{ animationDelay: "300ms" }}>
        <span className="text-[var(--color-critical)] tabular-nums">
          {mm}.{ss}
        </span>
        <button
          type="button"
          disabled={seconds > 0}
          onClick={() => setSeconds(59)}
          className="text-[var(--color-primary)] hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
        >
          ส่งอีกครั้ง
        </button>
      </div>

      <div className="login-item-in mt-10 w-full flex flex-col gap-4" style={{ animationDelay: "380ms" }}>
        <Button
          radius="sm"
          isDisabled={!filled}
          onPress={() => onConfirm(code)}
          className="h-10 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 active:scale-[0.98] disabled:opacity-60 transition"
        >
          ยืนยัน
        </Button>
        <Button
          radius="sm"
          variant="bordered"
          onPress={onCancel}
          className="h-10 bg-white border border-[#a8b9ca] text-[var(--color-neutral-900)] text-[16px] font-medium hover:bg-[var(--color-neutral-200)] active:scale-[0.98] transition"
        >
          ยกเลิก
        </Button>
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const phoneValid = /^0\d{9}$/.test(phone);

  return (
    <div className="min-h-screen relative bg-[var(--color-primary)]">
      {/* Background hero image */}
      <img
        src={loginBg}
        alt=""
        aria-hidden
        className="login-bg-in absolute inset-0 w-full h-full object-cover object-top pointer-events-none select-none"
      />

      {/* Top bar */}
      <header className="login-header-in relative z-10 bg-white border-b border-[var(--color-neutral-300)] h-[72px]">
        <div className="max-w-[1200px] h-full mx-auto flex items-center gap-6 px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <BrightifyLogo size={36} />
            <span className="text-[24px] font-medium text-[var(--color-primary)] leading-none">
              BRIGHTIFY
            </span>
          </a>
          <span className="hidden md:block w-px h-6 bg-[var(--color-neutral-300)]" />
          <p className="hidden md:block flex-1 text-[20px] font-semibold text-[var(--color-neutral-900)] truncate">
            เข้าสู่ระบบ/สมัครสมาชิก BMS Member
          </p>
          <div className="flex items-center gap-4 ml-auto">
            <button className="flex items-center gap-1 text-[14px] font-medium text-[var(--color-neutral-900)] hover:text-[var(--color-primary)] transition-colors">
              <Icon name="world" size={16} />
              <span>ภาษาไทย</span>
              <Icon name="chevron-down" size={16} />
            </button>
            <span className="w-px h-[18px] bg-[var(--color-neutral-300)]" />
            <button className="flex items-center gap-1 text-[14px] font-medium text-[var(--color-neutral-900)] hover:text-[var(--color-primary)] transition-colors">
              <Icon name="question-circle" size={16} />
              <span>ช่วยเหลือ</span>
              <Icon name="chevron-down" size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Login card — mirrors Figma absolute placement (centred at left-1/2 + 363px, 258px from page top) */}
      <main className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 flex justify-center lg:block">
        <section
          className="login-card-in w-full max-w-[434px] bg-white rounded-3xl pb-6 shadow-[0_8px_32px_rgba(2,77,143,0.18)] mt-10 lg:mt-0 lg:absolute lg:top-[186px] lg:left-1/2 lg:-translate-x-1/2 lg:ml-[363px]"
          aria-labelledby="login-title"
        >
          {step === "otp" ? (
            <OtpStep
              phone={phone}
              onCancel={() => setStep("phone")}
              onConfirm={() => {
                sessionStorage.setItem("loggedIn", "1");
                navigate("/");
              }}
            />
          ) : (
          <div className="px-10 pt-10 flex flex-col items-center gap-8">
            <div className="login-item-in w-full flex flex-col items-center gap-6" style={{ animationDelay: "380ms" }}>
              <h1
                id="login-title"
                className="text-[20px] font-bold text-[var(--color-neutral-900)] text-center leading-tight"
              >
                เข้าสู่ระบบ/สมัครสมาชิก BMS Member
              </h1>
              <span className="block w-full h-px bg-[var(--color-neutral-300)]" />
            </div>

            <form
              className="login-item-in w-full flex flex-col gap-8"
              style={{ animationDelay: "460ms" }}
              onSubmit={(e) => {
                e.preventDefault();
                setPhoneTouched(true);
                if (phoneValid) setStep("otp");
              }}
            >
              <Input
                aria-label="เบอร์โทรศัพท์มือถือ"
                placeholder="เบอร์โทรศัพท์มือถือ"
                value={maskThaiPhone(phone)}
                onValueChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 10))}
                radius="sm"
                inputMode="numeric"
                maxLength={12}
                isInvalid={phoneTouched && !phoneValid}
                errorMessage={
                  phoneTouched && !phoneValid
                    ? "กรุณากรอกเบอร์โทรศัพท์มือถือ 10 หลัก ขึ้นต้นด้วย 0"
                    : undefined
                }
                onBlur={() => setPhoneTouched(true)}
                classNames={{
                  inputWrapper:
                    "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:bg-white data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-[var(--color-primary)]/20 group-data-[invalid=true]:border-[var(--color-critical)] shadow-none",
                  input:
                    "text-[16px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] tracking-wide",
                }}
              />

              <Button
                type="submit"
                radius="sm"
                isDisabled={!phoneValid}
                className="h-10 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 active:scale-[0.98] disabled:opacity-60 transition"
              >
                เข้าสู่ระบบ
              </Button>
            </form>

            <div className="login-item-in w-full flex items-center gap-2" style={{ animationDelay: "540ms" }}>
              <span className="flex-1 h-px bg-[var(--color-neutral-300)]" />
              <span className="text-[12px] text-[var(--color-neutral-500)]">หรือ</span>
              <span className="flex-1 h-px bg-[var(--color-neutral-300)]" />
            </div>

            <div className="login-item-in w-full flex gap-3" style={{ animationDelay: "600ms" }}>
              <button
                type="button"
                className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg bg-white border border-[var(--color-neutral-300)] text-[16px] font-medium text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-200)] active:scale-[0.98] transition"
              >
                <FacebookIcon size={20} />
                Facebook
              </button>
              <button
                type="button"
                className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg bg-white border border-[var(--color-neutral-300)] text-[16px] font-medium text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-200)] active:scale-[0.98] transition"
              >
                <GoogleIcon size={20} />
                Google
              </button>
            </div>

            <p className="login-item-in text-[12px] leading-6 text-[var(--color-neutral-900)] text-center" style={{ animationDelay: "680ms" }}>
              การเปิดบัญชี Brightify ท่านรับทราบและตกลงตาม
              <br />
              <a className="text-[var(--color-primary)] underline" href="#">
                เงื่อนไขการให้บริการ
              </a>{" "}
              และ{" "}
              <a className="text-[var(--color-primary)] underline" href="#">
                นโยบายความคุ้มครองข้อมูลส่วนบุคคล
              </a>
            </p>
          </div>
          )}
        </section>
      </main>
    </div>
  );
}
