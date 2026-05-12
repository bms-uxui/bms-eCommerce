import { useState } from "react";
import Icon from "../components/landing/Icon";
import { AffiliateHeader, AffiliateSidebar } from "../components/AffiliateChrome";
import avatar from "../assets/avatar.jpg";
import facebookLogo from "../assets/social/facebook.png";
import instagramLogo from "../assets/social/instagram.png";
import youtubeLogo from "../assets/social/youtube.png";
import tiktokLogo from "../assets/social/tiktok.png";
import xLogo from "../assets/social/x.png";
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

function AccountInfoTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <img src={avatar} alt="" className="w-[140px] h-[140px] rounded-full object-cover" />
        <div className="flex gap-2">
          <button
            type="button"
            className="h-9 px-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition"
          >
            อัปโหลดรูป
          </button>
          <button
            type="button"
            className="h-9 px-3 rounded-lg border border-[var(--color-critical)] text-[var(--color-critical)] text-[13px] font-medium hover:bg-[#feeaed] transition"
          >
            ลบรูป
          </button>
        </div>
        <div className="text-[12px] text-[var(--color-neutral-500)] text-center leading-relaxed">
          <div>ขนาดไฟล์: สูงสุด 1 MB</div>
          <div>ไฟล์ที่รองรับ: .JPEG, .PNG</div>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-5 max-w-[760px]">
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
          <div className="flex gap-2">
            <input defaultValue="09*****904" readOnly className={inputCls} />
            <ChangeBtn />
          </div>
        </Field>
        <Field label="อีเมล์">
          <div className="flex gap-2">
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
        <div>
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

const PLATFORMS = [
  { name: "Facebook", logo: facebookLogo },
  { name: "Tiktok", logo: tiktokLogo },
  { name: "Instagram", logo: instagramLogo },
  { name: "X", logo: xLogo },
  { name: "Youtube", logo: youtubeLogo },
  { name: "Other", logo: undefined },
];

function MediaInfoTab() {
  return (
    <div className="flex flex-col gap-5 max-w-[820px]">
      <p className="text-[14px] text-[var(--color-neutral-700)] leading-relaxed">
        <span className="text-[var(--color-critical)]">* เลือกแพลตฟอร์มที่ใช้โปรโมต :</span>{" "}
        เริ่มต้น <span className="font-medium">อย่างน้อย 1 แพลตฟอร์ม</span> ที่คุณใช้ในการโปรโมตสินค้าเพื่อยืนยันความน่าเชื่อถือและเพิ่มโอกาสในการอนุมัติการสมัครเข้าร่วมมากขึ้น
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PLATFORMS.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-3 rounded-xl border border-[var(--color-neutral-300)] px-3 py-2.5"
          >
            {p.logo ? (
              <img src={p.logo} alt="" className="w-8 h-8 rounded-md object-cover shrink-0" />
            ) : (
              <span className="w-8 h-8 rounded-md bg-[var(--color-neutral-200)] flex items-center justify-center shrink-0">
                <Icon name="world" size={16} className="text-[var(--color-neutral-700)]" />
              </span>
            )}
            <span className="flex-1 text-[14px] text-[var(--color-neutral-900)]">{p.name}</span>
            <button
              type="button"
              aria-label={`เพิ่ม ${p.name}`}
              className="w-8 h-8 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-primary-100)] transition"
            >
              <Icon name="plus" size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[14px] text-[var(--color-neutral-900)]">บัญชีที่เชื่อมแล้ว :</p>
        {[
          { logo: facebookLogo, name: "FB Account name" },
          { logo: tiktokLogo, name: "Tiktok Account name" },
        ].map((a) => (
          <div
            key={a.name}
            className="flex items-center gap-3 rounded-xl border border-[var(--color-neutral-200)] px-3 py-2.5"
          >
            <img src={a.logo} alt="" className="w-8 h-8 rounded-md object-cover shrink-0" />
            <span className="flex-1 text-[14px] text-[var(--color-neutral-900)]">{a.name}</span>
            <button
              type="button"
              aria-label="ลบ"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-neutral-500)] hover:text-[var(--color-critical)] hover:bg-[#feeaed] transition"
            >
              <Icon name="trash-can" size={16} />
            </button>
          </div>
        ))}
      </div>

      <div>
        <button
          type="button"
          className="h-10 px-8 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
        >
          แก้ไข
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------- Tab 3: bank & payment */

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`w-11 h-6 rounded-full p-0.5 flex transition-colors ${
        on ? "bg-[var(--color-positive-700,#317a06)] justify-end" : "bg-[var(--color-neutral-300)] justify-start"
      }`}
    >
      <span className="w-5 h-5 rounded-full bg-white shadow" />
    </button>
  );
}

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
    <div className="flex items-center gap-3 rounded-xl border border-[var(--color-neutral-200)] px-3 py-2.5">
      <img src={logo} alt="" className="w-9 h-9 rounded-md object-contain shrink-0 border border-[var(--color-neutral-200)] bg-white p-1" />
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-[14px] text-[var(--color-neutral-900)] truncate">{name}</span>
        {primary && (
          <span className="text-[11px] font-medium text-[var(--color-primary)] bg-[var(--color-primary-100)] px-2 py-0.5 rounded-full">
            ค่าเริ่มต้น
          </span>
        )}
      </div>
      <span className="text-[14px] text-[var(--color-neutral-700)] shrink-0">{masked}</span>
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
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-medium text-[var(--color-neutral-900)]">{title}</h3>
          <p className="text-[13px] text-[var(--color-neutral-500)] mt-0.5">{desc}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function BankTab() {
  const [autoOn, setAutoOn] = useState(true);
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
      className="h-8 px-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition shrink-0"
    >
      เปลี่ยน
    </button>
  );

  return (
    <div className="flex flex-col gap-4 max-w-[820px]">
      <SectionCard
        title="บัญชีรับเงินถอน"
        desc="บัญชีธนาคารที่จะใช้สำหรับการรับเงินจากการถอนคอมมิชชัน"
        action={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[13px] font-medium hover:brightness-110 transition shrink-0"
          >
            <Icon name="plus" size={16} />
            เพิ่มบัญชีใหม่
          </button>
        }
      >
        <BankRow logo={kasikornLogo} name="ธนาคารกสิกรไทย" masked="96* **** *08" primary trailing={delBtn} />
        <BankRow logo={krungthaiLogo} name="ธนาคารกรุงไทย" masked="12* **** *22" trailing={delBtn} />
      </SectionCard>

      <SectionCard
        title="การถอนเงินอัตโนมัติ"
        desc="การถอนเงินให้อัตโนมัติเมื่อยอดสะสมถึงเงื่อนไขที่ตั้งไว้"
        action={<Toggle on={autoOn} onToggle={() => setAutoOn((v) => !v)} />}
      >
        {autoOn && (
          <BankRow logo={kasikornLogo} name="ธนาคารกสิกรไทย" masked="96* **** *08" trailing={changeBtn} />
        )}
      </SectionCard>

      <SectionCard title="การจัดการรหัสผ่าน" desc="กรุณาเปลี่ยนรหัสผ่านอย่างน้อยทุก 3 เดือน">
        <div className="flex items-center gap-3 rounded-xl border border-[var(--color-neutral-200)] px-3 py-2.5">
          <span className="flex-1 text-[16px] tracking-widest text-[var(--color-neutral-700)]">******</span>
          {changeBtn}
        </div>
      </SectionCard>
    </div>
  );
}

/* ----------------------------------------------------------------- page */

export default function AffiliateSettings() {
  const [tab, setTab] = useState<Tab>("ข้อมูลบัญชี");

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <AffiliateHeader />
      <div className="flex">
        <AffiliateSidebar active="การตั้งค่า" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 flex flex-col gap-5">
          <h1 className="text-[20px] font-bold text-[var(--color-primary-700)]">การตั้งค่า</h1>

          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-6 flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-[var(--color-neutral-200)] -mx-1 px-1 pb-3">
              {TABS.map((t) => {
                const active = t === tab;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={[
                      "h-9 px-4 rounded-lg text-[14px] transition-colors",
                      active
                        ? "bg-[var(--color-primary)] text-white font-medium"
                        : "text-[var(--color-neutral-700)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                    ].join(" ")}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            {tab === "ข้อมูลบัญชี" && <AccountInfoTab />}
            {tab === "ข้อมูลสื่อ" && <MediaInfoTab />}
            {tab === "บัญชีธนาคารและการชำระเงิน" && <BankTab />}
          </section>
        </main>
      </div>
    </div>
  );
}
