import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { Switch } from "@heroui/react";
import Icon from "../components/landing/Icon";
import { AffiliateHeader, AffiliateSidebar } from "../components/AffiliateChrome";
import TabBar from "../components/landing/TabBar";
import { AddBankModal } from "../components/landing/PaymentModals";
import PasswordSetupModal from "../components/PasswordSetupModal";
import SocialPlatformPicker, {
  SOCIAL_PLATFORMS,
  type ConnectedSocialAccount,
} from "../components/SocialPlatformPicker";
import avatar from "../assets/avatar.jpg";
import facebookLogo from "../assets/social/facebook.png";
import kasikornLogo from "../assets/payments/kasikorn.png";
import krungthaiLogo from "../assets/payments/krungthai.png";

const TABS = ["ข้อมูลบัญชี", "ข้อมูลสื่อ", "บัญชีธนาคารและการชำระเงิน"] as const;
type Tab = (typeof TABS)[number];

const inputCls =
  "h-11 px-3 rounded-lg border border-[var(--color-neutral-300)] bg-white text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] outline-none focus:border-[var(--color-primary)] w-full";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 min-w-0">
      <span className="text-[14px] text-[var(--color-neutral-900)]">{label}</span>
      {children}
    </label>
  );
}

function ChangeBtn() {
  return (
    <button
      type="button"
      className="h-11 px-4 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[14px] font-medium hover:bg-[var(--color-primary-100)] transition shrink-0"
    >
      เปลี่ยน
    </button>
  );
}

/* ----------------------------------------------- Tab 1: account info */

const AVATAR_ACCEPT = ["image/png", "image/jpeg"];
const AVATAR_MAX_BYTES = 1 * 1024 * 1024;

function AccountInfoTab() {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(avatar);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    if (!AVATAR_ACCEPT.includes(file.type)) {
      setUploadError("รองรับไฟล์ .JPEG, .PNG เท่านั้น");
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setUploadError("ขนาดไฟล์ต้องไม่เกิน 1 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarSrc(reader.result as string);
    reader.onerror = () => setUploadError("อ่านไฟล์ไม่สำเร็จ กรุณาลองใหม่");
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatarSrc(null);
    setUploadError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt="รูปโปรไฟล์"
            className="w-[140px] h-[140px] rounded-full object-cover border border-[var(--color-neutral-200)]"
          />
        ) : (
          <div className="w-[140px] h-[140px] rounded-full bg-[var(--color-neutral-200)] flex items-center justify-center text-[var(--color-neutral-500)]">
            <Icon name="user" size={56} />
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpeg,.jpg,.png,image/png,image/jpeg"
          onChange={onFile}
          className="hidden"
          aria-label="เลือกรูปโปรไฟล์"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 px-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition"
          >
            อัปโหลดรูป
          </button>
          <button
            type="button"
            onClick={removeAvatar}
            disabled={!avatarSrc}
            className="h-9 px-3 rounded-lg border border-[var(--color-critical)] text-[var(--color-critical)] text-[13px] font-medium hover:bg-[#feeaed] disabled:opacity-40 disabled:hover:bg-transparent transition"
          >
            ลบรูป
          </button>
        </div>
        {uploadError && (
          <p className="text-[12px] text-[var(--color-critical)] text-center">{uploadError}</p>
        )}
        <div className="text-[12px] text-[var(--color-neutral-500)] text-center leading-relaxed">
          <div>ขนาดไฟล์: สูงสุด 1 MB</div>
          <div>ไฟล์ที่รองรับ: .JPEG, .PNG</div>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-5 w-full">
        <Field label="ชื่อบัญชีผู้ใช้งาน">
          <input defaultValue="PaiBoon katdgfywgujwdw" className={inputCls} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="ชื่อ">
            <input defaultValue="paibomdm" className={inputCls} />
          </Field>
          <Field label="นามสกุล">
            <input defaultValue="kaewvndkvmml" className={inputCls} />
          </Field>
        </div>
        <div>
          <p className="text-[14px] text-[var(--color-primary-700)]">ประเภทบัญชี</p>
          <p className="text-[14px] text-[var(--color-neutral-900)] mt-1">รายบุคคล</p>
        </div>
        <Field label="เบอร์โทรศัพท์">
          <div className="flex gap-2 min-w-0">
            <input defaultValue="09*****904" readOnly className={inputCls} />
            <ChangeBtn />
          </div>
        </Field>
        <Field label="อีเมล์">
          <div className="flex gap-2 min-w-0">
            <input placeholder="กรุณาระบุอีเมล์" className={inputCls} />
            <ChangeBtn />
          </div>
        </Field>
        <div className="flex flex-col gap-2">
          <span className="text-[14px] text-[var(--color-neutral-900)]">บัญชี</span>
          <div className="flex items-center gap-3">
            <img src={facebookLogo} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
            <span className="flex-1 text-[14px] text-[var(--color-neutral-900)]">Paiboo***Khdsm</span>
            <button
              type="button"
              className="h-9 px-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition"
            >
              ยกเลิกการเชื่อมต่อ
            </button>
          </div>
        </div>
        <div className="mt-3">
          <button
            type="button"
            className="h-10 px-8 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------- Tab 2: media info */

const findPlatform = (key: string) =>
  SOCIAL_PLATFORMS.find((p) => p.key === key) ?? SOCIAL_PLATFORMS[0];

const INITIAL_CONNECTED: ConnectedSocialAccount[] = [
  { id: "1", platform: findPlatform("facebook"), name: "FB Account name" },
  { id: "2", platform: findPlatform("tiktok"), name: "Tiktok Account name" },
];

function MediaInfoTab() {
  const [connected, setConnected] = useState<ConnectedSocialAccount[]>(INITIAL_CONNECTED);
  const [editing, setEditing] = useState(false);
  const [snapshot, setSnapshot] = useState<ConnectedSocialAccount[]>(INITIAL_CONNECTED);

  const startEdit = () => {
    setSnapshot(connected);
    setEditing(true);
  };
  const save = () => {
    setSnapshot(connected);
    setEditing(false);
  };
  const cancel = () => {
    setConnected(snapshot);
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <SocialPlatformPicker
        readOnly={!editing}
        connected={connected}
        onAddPlatform={(platform) =>
          setConnected((prev) => [
            ...prev,
            { id: `${platform.key}-${Date.now()}`, platform, name: `${platform.label} Account name` },
          ])
        }
        onRemove={(id) => setConnected((prev) => prev.filter((a) => a.id !== id))}
      />

      <div className="flex gap-3">
        {editing ? (
          <>
            <button
              type="button"
              onClick={save}
              className="h-10 px-8 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
            >
              บันทึก
            </button>
            <button
              type="button"
              onClick={cancel}
              className="h-10 px-8 rounded-lg border border-[var(--color-neutral-400)] bg-white text-[var(--color-neutral-900)] text-[14px] font-medium hover:bg-[var(--color-neutral-100,#f5f8fa)] transition"
            >
              ยกเลิก
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="h-10 px-8 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
          >
            แก้ไข
          </button>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------- Tab 3: bank & payment */

function BankRow({
  logo,
  name,
  masked,
  primary,
  trailing,
}: {
  logo: string;
  name: string;
  masked: string;
  primary?: boolean;
  trailing: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl px-3 py-2.5">
      <img src={logo} alt="" className="w-9 h-9 rounded-md object-cover shrink-0 border border-[var(--color-neutral-200)]" />
      <div className="w-full sm:w-[240px] sm:shrink-0 flex items-center gap-2 min-w-0">
        <span className="text-[14px] text-[var(--color-neutral-900)] truncate">{name}</span>
        {primary && (
          <span className="text-[10px] text-white bg-[#0088ff] px-3 py-1 rounded shrink-0">
            ค่าเริ่มต้น
          </span>
        )}
      </div>
      <span className="flex-1 text-center text-[14px] text-[var(--color-neutral-700)]">{masked}</span>
      {trailing}
    </div>
  );
}

function SectionCard({
  title,
  desc,
  action,
  children,
}: {
  title: string;
  desc: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--color-neutral-300)] p-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[15px] font-medium text-[var(--color-neutral-900)]">{title}</h3>
          <p className="text-[13px] text-[var(--color-neutral-500)] mt-0.5">{desc}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

const BANK_ACCOUNTS = [
  { id: "k", logo: kasikornLogo, name: "ธนาคารกสิกรไทย", masked: "96* **** *08", primary: true },
  { id: "kt", logo: krungthaiLogo, name: "ธนาคารกรุงไทย", masked: "12* **** *22", primary: false },
];

function ModalShell({
  children,
  onClose,
  maxWidth = "max-w-[500px]",
}: {
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) {
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
      <div className={`bg-white rounded-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto flex flex-col`}>
        {children}
      </div>
    </div>
  );
}

function MyBankAccountsModal({ onClose, onAddNew }: { onClose: () => void; onAddNew: () => void }) {
  const [selected, setSelected] = useState(BANK_ACCOUNTS[0].id);
  return (
    <ModalShell onClose={onClose} maxWidth="max-w-[650px]">
      <div className="px-6 pt-6 pb-4 border-b border-[var(--color-neutral-200)] flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-bold text-[var(--color-primary-700)]">บัญชีธนาคารของฉัน</h2>
          <p className="text-[13px] text-[var(--color-neutral-600)] mt-1">
            บัญชีธนาคารจะแสดงให้เลือกตอนที่คุณจำดำเนินการ ชำระเงินสินค้า เท่านั้น
          </p>
        </div>
        <button
          type="button"
          onClick={onAddNew}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[13px] font-medium hover:brightness-110 transition shrink-0"
        >
          <Icon name="plus" size={16} />
          เพิ่มบัญชีใหม่
        </button>
      </div>
      <div className="px-6 py-4 flex flex-col">
        {BANK_ACCOUNTS.map((a) => (
          <label
            key={a.id}
            className="flex flex-wrap items-center gap-3 py-3 border-b border-[var(--color-neutral-200)] last:border-b-0 cursor-pointer"
          >
            <input
              type="radio"
              name="bankacc"
              checked={selected === a.id}
              onChange={() => setSelected(a.id)}
              className="accent-[var(--color-primary)]"
            />
            <img src={a.logo} alt="" className="w-9 h-9 rounded-md object-cover shrink-0 border border-[var(--color-neutral-200)]" />
            <div className="w-full sm:w-[240px] sm:shrink-0 flex items-center gap-2 min-w-0">
              <span className="text-[14px] text-[var(--color-neutral-900)] truncate">{a.name}</span>
              {a.primary && (
                <span className="text-[10px] text-white bg-[#0088ff] px-3 py-1 rounded shrink-0">
                  ค่าเริ่มต้น
                </span>
              )}
            </div>
            <span className="flex-1 text-center text-[14px] text-[var(--color-neutral-700)]">{a.masked}</span>
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="h-8 px-3 rounded-lg border border-[var(--color-critical)] text-[var(--color-critical)] text-[13px] font-medium hover:bg-[#feeaed] transition shrink-0"
            >
              ลบข้อมูล
            </button>
          </label>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-[var(--color-neutral-200)] flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="h-10 px-6 rounded-lg border border-[var(--color-neutral-400)] text-[var(--color-neutral-900)] text-[14px] font-medium bg-white hover:bg-[var(--color-neutral-100,#f5f8fa)] transition"
        >
          ยกเลิก
        </button>
        <button
          type="button"
          onClick={onClose}
          className="h-10 px-6 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
        >
          ยืนยัน
        </button>
      </div>
    </ModalShell>
  );
}

function BankTab() {
  const [autoOn, setAutoOn] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  const delBtn = (
    <button
      type="button"
      className="h-8 px-3 rounded-lg border border-[var(--color-critical)] text-[var(--color-critical)] text-[13px] font-medium hover:bg-[#feeaed] transition shrink-0"
    >
      ลบบัญชี
    </button>
  );
  const changeBtn = (
    <button
      type="button"
      onClick={() => setPickerOpen(true)}
      className="h-8 px-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition shrink-0"
    >
      เปลี่ยน
    </button>
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionCard
        title="บัญชีรับเงินถอน"
        desc="บัญชีธนาคารที่จะใช้สำหรับการรับเงินจากการถอนคอมมิชชัน"
        action={
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[13px] font-medium hover:brightness-110 transition shrink-0"
          >
            <Icon name="plus" size={16} />
            เพิ่มบัญชีใหม่
          </button>
        }
      >
        {BANK_ACCOUNTS.map((a) => (
          <BankRow key={a.id} logo={a.logo} name={a.name} masked={a.masked} primary={a.primary} trailing={delBtn} />
        ))}
      </SectionCard>

      <SectionCard
        title="การถอนเงินอัตโนมัติ"
        desc="การถอนเงินอัตโนมัติจะดำเนินการก็ต่อเมื่อคุณทำการเชื่อมต่อบัญชีธนาคารก่อนเท่านั้น"
        action={
          <Switch
            size="sm"
            color="success"
            isSelected={autoOn}
            onValueChange={setAutoOn}
            aria-label="การถอนเงินอัตโนมัติ"
          />
        }
      >
        {autoOn ? (
          <BankRow logo={kasikornLogo} name="ธนาคารกสิกรไทย" masked="96* **** *08" trailing={changeBtn} />
        ) : (
          <div className="flex flex-col items-center gap-4 pt-3 text-center">
            <p className="text-[16px] text-[var(--color-neutral-900)]">ยังไม่มีบัญชีหลักสำหรับการทำรายการ</p>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="h-10 px-5 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
            >
              เพิ่มบัญชีธนาคาร
            </button>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="การจัดการรหัสผ่าน"
        desc={
          hasPassword
            ? "กรุณาเปลี่ยนรหัสผ่านอย่างน้อยทุก 3 เดือน"
            : "การถอนเงินเพื่อความปลอดภัยสูงสุด กรุณาตั้งรหัสผ่าน"
        }
      >
        {hasPassword ? (
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <span className="flex-1 text-[16px] tracking-widest text-[var(--color-neutral-700)]">******</span>
            <button
              type="button"
              onClick={() => setPwOpen(true)}
              className="h-8 px-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition shrink-0"
            >
              เปลี่ยน
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 pt-3 text-center">
            <p className="text-[16px] text-[var(--color-neutral-900)]">กรุณาตั้งรหัสผ่านสำหรับการทำรายการ</p>
            <button
              type="button"
              onClick={() => setPwOpen(true)}
              className="h-10 px-5 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
            >
              ตั้งรหัสผ่าน
            </button>
          </div>
        )}
      </SectionCard>

      {pickerOpen && (
        <MyBankAccountsModal
          onClose={() => setPickerOpen(false)}
          onAddNew={() => {
            setPickerOpen(false);
            setAddOpen(true);
          }}
        />
      )}
      <AddBankModal isOpen={addOpen} onClose={() => setAddOpen(false)} onSubmit={() => {}} />
      {pwOpen && (
        <PasswordSetupModal
          onClose={() => setPwOpen(false)}
          onComplete={() => setHasPassword(true)}
        />
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- page */

export default function AffiliateSettings() {
  const { state } = useLocation();
  const initialTab = (state as { tab?: Tab } | null)?.tab ?? "ข้อมูลบัญชี";
  const [tab, setTab] = useState<Tab>(TABS.includes(initialTab) ? initialTab : "ข้อมูลบัญชี");

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <AffiliateHeader />
      <div className="flex">
        <AffiliateSidebar active="การตั้งค่า" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 flex flex-col gap-5">
          <h1 className="text-[20px] font-bold text-[var(--color-primary-700)]">การตั้งค่า</h1>

          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)]">
            <TabBar
              active={tab}
              onChange={setTab}
              items={TABS.map((t) => ({ key: t, label: t }))}
              className="rounded-t-2xl"
            />
            <div className="p-4 sm:p-6">
              {tab === "ข้อมูลบัญชี" && <AccountInfoTab />}
              {tab === "ข้อมูลสื่อ" && <MediaInfoTab />}
              {tab === "บัญชีธนาคารและการชำระเงิน" && <BankTab />}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
