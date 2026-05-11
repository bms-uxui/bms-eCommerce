import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Input, Button, Select, SelectItem } from "@heroui/react";
import {
  User as UserIcon,
  Package,
  ClipboardList,
  Crown,
  Bell,
  Tag,
  Heart,
  Settings as SettingsIcon,
  LogOut,
  Pencil,
  Plus,
  CreditCard,
  Landmark,
  Trash2,
} from "lucide-react";
import {
  AddCardModal,
  AddBankModal,
  type CardData,
  type BankData,
} from "../components/landing/PaymentModals";
import {
  AddressModal,
  type AddressData,
} from "../components/landing/AddressModal";
import visaLogo from "../assets/payments/visa.png";
import mcLogo from "../assets/payments/mastercard.png";
import amexLogo from "../assets/payments/amex.png";
import kasikornLogo from "../assets/payments/kasikorn.png";
import krungthaiLogo from "../assets/payments/krungthai.png";
import scbLogo from "../assets/payments/scb.png";
import krungsriLogo from "../assets/payments/krungsri.png";
import gsbLogo from "../assets/payments/gsb.png";
import bblLogo from "../assets/payments/bbl.png";
import TabBar from "../components/landing/TabBar";
import ProfilePageShell, {
  type SidebarKey,
} from "../components/landing/ProfilePageShell";
import avatar from "../assets/avatar.jpg";

const SIDEBAR_ITEMS = [
  { icon: UserIcon, label: "บัญชีของฉัน", key: "account" },
  { icon: Package, label: "การสั่งซื้อ", key: "orders" },
  { icon: ClipboardList, label: "ใบเสนอราคา", key: "quotes" },
  { icon: Crown, label: "BMS Member", key: "member" },
  { icon: Bell, label: "การแจ้งเตือน", key: "notifications" },
  { icon: Tag, label: "โค้ดส่วนลด", key: "coupons" },
  { icon: Heart, label: "สิ่งที่ถูกใจ", key: "wishlist" },
  { icon: CreditCard, label: "วิธีการชำระเงิน", key: "payment" },
  { icon: SettingsIcon, label: "การตั้งค่า", key: "settings" },
] as const;

type Key = (typeof SIDEBAR_ITEMS)[number]["key"];

const TABS = ["ข้อมูลของฉัน", "บัญชีธนาคารและบัตร", "ข้อมูลที่อยู่"] as const;
type Tab = (typeof TABS)[number];

function ProfileForm() {
  const [tab, setTab] = useState<Tab>(TABS[0]);
  const [first, setFirst] = useState("Okinowa");
  const [last, setLast] = useState("Kawasaki");
  const [email, setEmail] = useState("okinowa@example.com");
  const [phone, setPhone] = useState("093-695-5932");
  const [dob, setDob] = useState("1995-06-15");
  const [gender, setGender] = useState<string>("male");
  const [nationality, setNationality] = useState<string>("th");
  const [avatarSrc, setAvatarSrc] = useState<string>(
    () => localStorage.getItem("profile.avatar") ?? avatar
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_BYTES = 5 * 1024 * 1024;
  const ACCEPT = ["image/png", "image/jpeg", "image/webp", "image/gif"];

  const pickFile = () => fileInputRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ACCEPT.includes(file.type)) {
      setUploadError("รองรับไฟล์ PNG, JPEG, WEBP, GIF เท่านั้น");
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setAvatarSrc(url);
      try {
        localStorage.setItem("profile.avatar", url);
      } catch {
        // localStorage full — keep in-memory only
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="flex-1 min-w-0 lg:min-h-[1200px] bg-white rounded-2xl border border-[var(--color-neutral-300)]">
      <TabBar
        sticky
        active={tab}
        onChange={setTab}
        items={TABS.map((t) => ({ key: t, label: t }))}
        className="rounded-t-2xl"
      />
      <div className="p-4 sm:p-6">

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT.join(",")}
        onChange={onFile}
        className="hidden"
        aria-label="เลือกรูปโปรไฟล์"
      />

      {tab === "ข้อมูลของฉัน" && (
        <form
          className="mt-8 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Avatar column */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={avatarSrc}
              alt="รูปโปรไฟล์"
              className="w-[150px] h-[150px] rounded-full object-cover ring-1 ring-[var(--color-neutral-300)]"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={pickFile}
                className="h-9 px-4 rounded-md border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition"
              >
                อัปโหลดรูป
              </button>
              <button
                type="button"
                onClick={() => {
                  setAvatarSrc(avatar);
                  localStorage.removeItem("profile.avatar");
                  setUploadError(null);
                }}
                disabled={avatarSrc === avatar}
                className="h-9 px-4 rounded-md border border-[var(--color-critical)] text-[var(--color-critical)] text-[13px] font-medium hover:bg-[var(--color-critical)]/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ลบรูป
              </button>
            </div>
            {uploadError && (
              <p className="text-[12px] text-[var(--color-critical)] text-center">
                {uploadError}
              </p>
            )}
            <div className="text-center text-[12px] text-[var(--color-neutral-500)] leading-relaxed">
              <p>ขนาดไฟล์: สูงสุด 1 MB</p>
              <p>ไฟล์ที่รองรับ: JPEG, .PNG</p>
            </div>
          </div>

          {/* Fields column */}
          <div className="flex flex-col gap-5">
            <Field label="ชื่อบัญชีผู้ใช้งาน">
              <Input
                value={`${first} ${last}`.trim()}
                onValueChange={() => {}}
                radius="sm"
                classNames={inputClassNames}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <Field label="ชื่อ">
                <Input
                  value={first}
                  onValueChange={setFirst}
                  radius="sm"
                  classNames={inputClassNames}
                />
              </Field>
              <Field label="นามสกุล">
                <Input
                  value={last}
                  onValueChange={setLast}
                  radius="sm"
                  classNames={inputClassNames}
                />
              </Field>
            </div>

            <Field label="เบอร์โทรศัพท์">
              <div className="flex items-center gap-2">
                <Input
                  value={phone}
                  onValueChange={(v) => {
                    const d = v.replace(/\D/g, "").slice(0, 10);
                    if (d.length <= 3) setPhone(d);
                    else if (d.length <= 6)
                      setPhone(`${d.slice(0, 3)}-${d.slice(3)}`);
                    else
                      setPhone(`${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`);
                  }}
                  inputMode="numeric"
                  radius="sm"
                  classNames={inputClassNames}
                />
                <button
                  type="button"
                  className="shrink-0 h-10 px-4 rounded-md border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition"
                >
                  เปลี่ยน
                </button>
              </div>
            </Field>

            <Field label="อีเมล">
              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  value={email}
                  onValueChange={setEmail}
                  placeholder="กรุณาระบุอีเมล"
                  radius="sm"
                  classNames={inputClassNames}
                />
                <button
                  type="button"
                  className="shrink-0 h-10 px-4 rounded-md border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition"
                >
                  เปลี่ยน
                </button>
              </div>
            </Field>

            <div className="pt-2">
              <Button
                type="submit"
                radius="md"
                className="h-10 px-8 bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
              >
                บันทึก
              </Button>
            </div>
          </div>
        </form>
      )}

      {tab === "บัญชีธนาคารและบัตร" && <BankCardsTab />}
      {tab === "ข้อมูลที่อยู่" && <AddressTab />}
      </div>
    </section>
  );
}

function AddSectionButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="h-9 px-4 rounded-md bg-[var(--color-primary)] text-white text-[13px] font-medium flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition"
    >
      <Plus size={16} />
      {children}
    </button>
  );
}

function EmptyCard({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--color-neutral-300)] bg-[var(--color-neutral-100)] py-8 px-4 text-center">
      <p className="text-[13px] text-[var(--color-neutral-500)]">{message}</p>
    </div>
  );
}

function formatPhoneIntl(p: string) {
  const d = p.replace(/\D/g, "");
  if (d.length !== 10) return p;
  return `(+66)${d.slice(1, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

function AddressTab() {
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AddressData | undefined>();

  const upsert = (data: AddressData) => {
    setAddresses((prev) => {
      const without = prev.filter((a) => a.id !== data.id);
      const list = data.isDefault
        ? without.map((a) => ({ ...a, isDefault: false }))
        : without;
      return [...list, data];
    });
  };

  const remove = (id: string) =>
    setAddresses((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[20px] font-bold text-[var(--color-primary-700)]">
          ที่อยู่ของฉัน
        </h2>
        <button
          type="button"
          onClick={() => {
            setEditing(undefined);
            setOpen(true);
          }}
          className="h-9 px-4 rounded-md bg-[var(--color-primary)] text-white text-[13px] font-medium flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition"
        >
          <Plus size={16} />
          เพิ่มที่อยู่ใหม่
        </button>
      </div>
      <hr className="mt-3 border-t border-[var(--color-neutral-300)]" />

      <div className="mt-4 flex flex-col">
        {addresses.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[15px] font-medium text-[var(--color-neutral-900)]">
              ยังไม่มีที่อยู่ที่บันทึก
            </p>
            <p className="mt-1 text-[13px] text-[var(--color-neutral-500)]">
              กรุณาเพิ่มที่อยู่สำหรับจัดส่งสินค้า
            </p>
          </div>
        ) : (
          addresses.map((a) => (
            <article
              key={a.id}
              className="flex items-start justify-between gap-6 py-4 border-b border-[var(--color-neutral-300)] last:border-b-0"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-[15px] font-bold text-[var(--color-neutral-900)]">
                    {a.name}
                  </span>
                  <span className="text-[13px] text-[var(--color-neutral-700)]">
                    {formatPhoneIntl(a.phone)}
                  </span>
                </div>
                <p className="mt-1 text-[14px] text-[var(--color-neutral-700)] leading-relaxed">
                  {a.address}
                </p>
                {a.isDefault && (
                  <span className="inline-flex items-center mt-2 text-[12px] font-semibold text-white bg-[var(--color-primary)] rounded px-2.5 py-1">
                    ที่อยู่หลัก
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(a);
                    setOpen(true);
                  }}
                  className="h-8 px-3 rounded-md border border-[var(--color-primary)] text-[var(--color-primary)] text-[12px] font-medium hover:bg-[var(--color-primary-100)] active:scale-95 transition"
                >
                  แก้ไข
                </button>
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  className="h-8 px-3 rounded-md border border-[var(--color-critical)] text-[var(--color-critical)] text-[12px] font-medium hover:bg-[var(--color-critical)]/10 active:scale-95 transition"
                >
                  ลบข้อมูล
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <AddressModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={upsert}
        initial={editing}
      />
    </div>
  );
}

function BankCardsTab() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [banks, setBanks] = useState<BankData[]>([]);
  const [cardOpen, setCardOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);

  const addCard = (data: CardData) => {
    setCards((prev) => {
      const next = data.isDefault
        ? prev.map((c) => ({ ...c, isDefault: false }))
        : [...prev];
      return [...next, data];
    });
  };
  const addBank = (data: BankData) => {
    setBanks((prev) => {
      const next = data.isDefault
        ? prev.map((b) => ({ ...b, isDefault: false }))
        : [...prev];
      return [...next, data];
    });
  };

  return (
    <div className="mt-8 flex flex-col gap-10">
      {/* Cards */}
      <section>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[18px] font-bold text-[var(--color-primary-700)]">
              บัตรเครดิต / บัตรเดบิต ของฉัน
            </h3>
            <p className="text-[13px] text-[var(--color-neutral-600)] mt-1">
              บัตรจะแสดงให้เลือกตอนที่คุณจำดำเนินการ ชำระเงินหรือผ่อนสินค้า เท่านั้น
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCardOpen(true)}
            className="h-9 px-4 rounded-md bg-[var(--color-primary)] text-white text-[13px] font-medium flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition shrink-0"
          >
            <Plus size={16} />
            เพิ่มบัตรใหม่
          </button>
        </div>
        <hr className="mt-3 border-t border-[var(--color-neutral-300)]" />
        <div className="mt-6 flex flex-col gap-2">
          {cards.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[15px] font-medium text-[var(--color-neutral-900)]">
                ไม่มีข้อมูลบัตรเครดิต / บัตรเดบิต
              </p>
              <p className="mt-1 text-[13px] text-[var(--color-neutral-500)]">
                กรุณาเชื่อมต่อข้อมูลบัตรของคุณ
              </p>
            </div>
          ) : (
            cards.map((c, i) => {
              const brand = detectCardBrand(c.number);
              return (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-8 rounded flex items-center justify-center shrink-0">
                      <img
                        src={brand.logo}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span className="text-[15px] font-medium text-[var(--color-neutral-900)]">
                      {brand.label}
                    </span>
                    {c.isDefault && <DefaultPill />}
                  </div>
                  <p className="text-[14px] text-[var(--color-neutral-700)] tabular-nums tracking-wider justify-self-center whitespace-nowrap">
                    {maskCard(c.number)}
                  </p>
                  <div className="justify-self-end">
                    <DeleteButton
                      onClick={() => setCards((prev) => prev.filter((_, idx) => idx !== i))}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Banks */}
      <section>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[18px] font-bold text-[var(--color-primary-700)]">
              บัญชีธนาคารของฉัน
            </h3>
            <p className="text-[13px] text-[var(--color-neutral-600)] mt-1">
              บัญชีธนาคารจะแสดงให้เลือกตอนที่คุณจำดำเนินการ ชำระเงินสินค้า เท่านั้น
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBankOpen(true)}
            className="h-9 px-4 rounded-md bg-[var(--color-primary)] text-white text-[13px] font-medium flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition shrink-0"
          >
            <Plus size={16} />
            เพิ่มบัญชีใหม่
          </button>
        </div>
        <hr className="mt-3 border-t border-[var(--color-neutral-300)]" />
        <div className="mt-6 flex flex-col gap-2">
          {banks.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[15px] font-medium text-[var(--color-neutral-900)]">
                ไม่มีข้อมูลบัญชีธนาคาร
              </p>
              <p className="mt-1 text-[13px] text-[var(--color-neutral-500)]">
                กรุณาเชื่อมต่อข้อมูลบัญชีธนาคารของคุณ
              </p>
            </div>
          ) : (
            banks.map((b, i) => {
              const info = BANK_INFO[b.bank] ?? {
                logo: kasikornLogo,
                label: b.bank.toUpperCase(),
              };
              return (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-white">
                      <img
                        src={info.logo}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[15px] font-medium text-[var(--color-neutral-900)] truncate">
                      {info.label}
                    </span>
                    {b.isDefault && <DefaultPill />}
                  </div>
                  <p className="text-[14px] text-[var(--color-neutral-700)] tabular-nums justify-self-center whitespace-nowrap">
                    {maskAccount(b.accountNumber)}
                  </p>
                  <div className="justify-self-end">
                    <DeleteButton
                      onClick={() => setBanks((prev) => prev.filter((_, idx) => idx !== i))}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <AddCardModal isOpen={cardOpen} onClose={() => setCardOpen(false)} onSubmit={addCard} />
      <AddBankModal isOpen={bankOpen} onClose={() => setBankOpen(false)} onSubmit={addBank} />
    </div>
  );
}

const inputClassNames = {
  inputWrapper:
    "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:bg-white data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-[var(--color-primary)]/20 shadow-none",
  input:
    "text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)]",
};

function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={["flex flex-col gap-1.5", full && "sm:col-span-2"].filter(Boolean).join(" ")}>
      <span className="text-[13px] text-[var(--color-neutral-700)]">{label}</span>
      {children}
    </label>
  );
}

function maskCard(num: string) {
  const digits = num.replace(/\D/g, "");
  if (digits.length <= 4) return digits;
  return "**** **** **** " + digits.slice(-4);
}

function maskAccount(num: string) {
  const d = num.replace(/\D/g, "");
  if (d.length < 4) return d;
  // Show first 2 digits, **** in middle, last 2 digits — e.g. "96* **** *08"
  return `${d.slice(0, 2)}* **** *${d.slice(-2)}`;
}

function detectCardBrand(num: string): { logo: string; label: string } {
  const d = num.replace(/\D/g, "");
  if (d.startsWith("4")) return { logo: visaLogo, label: "Credit Card" };
  if (/^(5[1-5]|2[2-7])/.test(d)) return { logo: mcLogo, label: "Master Card" };
  if (/^(34|37)/.test(d)) return { logo: amexLogo, label: "Amex" };
  return { logo: visaLogo, label: "Credit Card" };
}

const BANK_INFO: Record<string, { logo: string; label: string }> = {
  kbank: { logo: kasikornLogo, label: "ธนาคารกสิกรไทย" },
  scb: { logo: scbLogo, label: "ธนาคารไทยพาณิชย์" },
  ktb: { logo: krungthaiLogo, label: "ธนาคารกรุงไทย" },
  bbl: { logo: bblLogo, label: "ธนาคารกรุงเทพ" },
  bay: { logo: krungsriLogo, label: "ธนาคารกรุงศรีอยุธยา" },
  gsb: { logo: gsbLogo, label: "ธนาคารออมสิน" },
  ttb: { logo: gsbLogo, label: "ธนาคารทหารไทยธนชาต" },
};

function DefaultPill() {
  return (
    <span className="inline-flex items-center text-[11px] font-semibold text-white bg-[var(--color-primary)] rounded px-2 py-0.5">
      ค่าเริ่มต้น
    </span>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-8 px-3 rounded-md border border-[var(--color-critical)] text-[var(--color-critical)] text-[12px] font-medium hover:bg-[var(--color-critical)]/10 active:scale-95 transition"
    >
      ลบข้อมูล
    </button>
  );
}

function PaymentMethodsPanel() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [banks, setBanks] = useState<BankData[]>([]);
  const [cardOpen, setCardOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);

  const addCard = (data: CardData) => {
    setCards((prev) => {
      const next = data.isDefault
        ? prev.map((c) => ({ ...c, isDefault: false }))
        : [...prev];
      return [...next, data];
    });
  };

  const addBank = (data: BankData) => {
    setBanks((prev) => {
      const next = data.isDefault
        ? prev.map((b) => ({ ...b, isDefault: false }))
        : [...prev];
      return [...next, data];
    });
  };

  return (
    <section className="lg:min-h-[1200px] bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-6 flex flex-col gap-8">
      <h1 className="text-[20px] font-bold text-[var(--color-neutral-900)]">
        วิธีการชำระเงิน
      </h1>

      {/* Cards */}
      <section>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--color-neutral-900)]">
              บัตรเครดิต / เดบิต
            </h3>
            <p className="text-[13px] text-[var(--color-neutral-600)] mt-1">
              ใช้สำหรับการชำระเงินผ่านบัตรเครดิตหรือเดบิต
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCardOpen(true)}
            className="h-9 px-4 rounded-md bg-[var(--color-primary)] text-white text-[13px] font-medium flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition"
          >
            <Plus size={16} />
            เพิ่มบัตรใหม่
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {cards.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--color-neutral-300)] bg-[var(--color-neutral-100)] py-8 px-4 text-center">
              <p className="text-[13px] text-[var(--color-neutral-500)]">
                ยังไม่มีบัตรที่บันทึก
              </p>
            </div>
          ) : (
            cards.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-[var(--color-neutral-300)] p-3"
              >
                <div className="w-10 h-10 rounded-md bg-[var(--color-primary-100)] text-[var(--color-primary)] flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[var(--color-neutral-900)] tabular-nums">
                    {maskCard(c.number)}
                  </p>
                  <p className="text-[12px] text-[var(--color-neutral-600)]">
                    {c.holder} · หมดอายุ {c.expiry}
                  </p>
                </div>
                {c.isDefault && (
                  <span className="text-[11px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary-100)] rounded px-2 py-0.5">
                    ค่าเริ่มต้น
                  </span>
                )}
                <button
                  type="button"
                  aria-label="ลบบัตร"
                  onClick={() => setCards((prev) => prev.filter((_, idx) => idx !== i))}
                  className="w-8 h-8 rounded-md text-[var(--color-neutral-500)] hover:text-[var(--color-critical)] hover:bg-[var(--color-critical)]/10 flex items-center justify-center transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Bank accounts */}
      <section>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--color-neutral-900)]">
              บัญชีธนาคาร
            </h3>
            <p className="text-[13px] text-[var(--color-neutral-600)] mt-1">
              ใช้สำหรับโอนเงินผ่านพร้อมเพย์หรือธนาคาร
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBankOpen(true)}
            className="h-9 px-4 rounded-md bg-[var(--color-primary)] text-white text-[13px] font-medium flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition"
          >
            <Plus size={16} />
            เพิ่มบัญชีใหม่
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {banks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--color-neutral-300)] bg-[var(--color-neutral-100)] py-8 px-4 text-center">
              <p className="text-[13px] text-[var(--color-neutral-500)]">
                ยังไม่มีบัญชีธนาคารที่บันทึก
              </p>
            </div>
          ) : (
            banks.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-[var(--color-neutral-300)] p-3"
              >
                <div className="w-10 h-10 rounded-md bg-[var(--color-primary-100)] text-[var(--color-primary)] flex items-center justify-center">
                  <Landmark size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[var(--color-neutral-900)]">
                    {b.holder}
                  </p>
                  <p className="text-[12px] text-[var(--color-neutral-600)] tabular-nums">
                    {maskAccount(b.accountNumber)} · {b.bank.toUpperCase()}
                  </p>
                </div>
                {b.isDefault && (
                  <span className="text-[11px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary-100)] rounded px-2 py-0.5">
                    ค่าเริ่มต้น
                  </span>
                )}
                <button
                  type="button"
                  aria-label="ลบบัญชี"
                  onClick={() => setBanks((prev) => prev.filter((_, idx) => idx !== i))}
                  className="w-8 h-8 rounded-md text-[var(--color-neutral-500)] hover:text-[var(--color-critical)] hover:bg-[var(--color-critical)]/10 flex items-center justify-center transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <AddCardModal isOpen={cardOpen} onClose={() => setCardOpen(false)} onSubmit={addCard} />
      <AddBankModal isOpen={bankOpen} onClose={() => setBankOpen(false)} onSubmit={addBank} />
    </section>
  );
}

export default function UserSettings() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Key>("account");

  return (
    <ProfilePageShell
      activeKey={active as SidebarKey}
      avatarSrc={avatar}
      onItemClick={(item) => {
        if (item.key === "orders") {
          navigate("/delivery");
          return;
        }
        if (item.key === "quotes") {
          navigate("/quotation");
          return;
        }
        setActive(item.key as Key);
      }}
    >
      <div className="page-section-in" style={{ animationDelay: "200ms" }}>
        {active === "payment" ? <PaymentMethodsPanel /> : <ProfileForm />}
      </div>
    </ProfilePageShell>
  );
}
