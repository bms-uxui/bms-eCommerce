import { useEffect, useRef, useState, type ReactNode } from "react";
import { Input, Select, SelectItem, Switch, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, RangeCalendar, type RangeValue } from "@heroui/react";
import { parseDate, type DateValue } from "@internationalized/date";
import { Info, Pencil, Trash2, Plus, X } from "lucide-react";
import { inputClassNames } from "../components/inputStyles";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import storeAvatarDefault from "../assets/store-avatar.png";
import kasikorn from "../assets/payments/kasikorn.png";
import krungthai from "../assets/payments/krungthai.png";

const CARD = "bg-white rounded-xl shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)]";
const inputCls = "h-11 w-full rounded-lg border border-[var(--color-neutral-300)] px-3 text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary)]";
const selectCN = { trigger: "h-11 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] shadow-none rounded-lg", value: "text-[14px] text-[var(--color-neutral-900)]" };

type TabKey = "store" | "bank" | "holiday" | "notify" | "close";
const TABS: { key: TabKey; label: string }[] = [
  { key: "store", label: "จัดการข้อมูลร้านค้า" },
  { key: "bank", label: "ตั้งค่าบัญชีธนาคาร" },
  { key: "holiday", label: "ตั้งค่าโหมดวันหยุด" },
  { key: "notify", label: "ตั้งค่าการแจ้งเตือน" },
  { key: "close", label: "ปิดบัญชีร้านค้า" },
];

const CATEGORIES = ["เครื่องมือการแพทย์", "เวชภัณฑ์และยา", "อาหารเสริม", "เครื่องสำอาง", "อุปกรณ์ทั่วไป"];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[14px] text-[var(--color-neutral-700)]">{label}</span>
      {children}
    </div>
  );
}

function ReadField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[13px] text-[var(--color-neutral-500)]">{label}</span>
      <span className="text-[14px] text-[var(--color-neutral-900)]">{value || "-"}</span>
    </div>
  );
}

function BankLogo({ src }: { src: string }) {
  return <img src={src} alt="" className="w-9 h-9 rounded-lg object-contain shrink-0" />;
}

function HolidayModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [range, setRange] = useState<RangeValue<DateValue> | null>({ start: parseDate("2026-08-10"), end: parseDate("2026-08-24") });
  useEffect(() => { if (isOpen) setRange({ start: parseDate("2026-08-10"), end: parseDate("2026-08-24") }); }, [isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" size="md" hideCloseButton scrollBehavior="inside" classNames={{ base: "rounded-2xl" }}>
      <ModalContent>
        <ModalHeader className="flex-col items-start gap-0.5 border-b border-[var(--color-neutral-300)] p-5">
          <h2 className="text-[20px] font-bold text-[var(--color-primary)]">เพิ่มวันหยุด</h2>
          <p className="text-[14px] text-[var(--color-neutral-500)]">เปิดใช้งานโหมดวันหยุด เพื่อปิดการขายสินค้าชั่วคราว</p>
        </ModalHeader>
        <ModalBody className="p-5 flex items-center justify-center">
          <RangeCalendar aria-label="ช่วงวันหยุด" value={range} onChange={setRange} visibleMonths={1} />
        </ModalBody>
        <ModalFooter className="border-t border-[var(--color-neutral-300)] p-4 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 h-11 rounded-lg border border-[var(--color-neutral-300)] text-[15px] font-medium text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors">ยกเลิก</button>
          <button type="button" onClick={onClose} className="flex-1 h-11 rounded-lg bg-[var(--color-primary)] text-white text-[15px] font-medium hover:bg-[var(--color-primary-600)] transition-colors">บันทึก</button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function SellerStoreSettings() {
  const [tab, setTab] = useState<TabKey>("store");
  const [logoSrc, setLogoSrc] = useState(storeAvatarDefault);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const pickLogo = () => logoInputRef.current?.click();
  const [autoWithdraw, setAutoWithdraw] = useState(true);
  const [holidayOpen, setHolidayOpen] = useState(false);
  const [holidays, setHolidays] = useState([
    { id: "h1", range: "10 ส.ค. 2026 - 24 ส.ค. 2026", on: false },
    { id: "h2", range: "1 ก.ค. 2026 - 2 ก.ค. 2026", on: false },
  ]);
  const [notify, setNotify] = useState({ orders: true, promo: true, message: true, product: true });

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader />
      <div className="flex">
        <SellerSidebar active="การตั้งค่าร้านค้า" />
        <main className="flex-1 min-w-0 px-8 py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
          <h1 className="text-[20px] font-semibold text-[var(--color-primary-700)]">การตั้งค่า</h1>

          <div className={`${CARD} p-1.5 flex gap-1 w-fit`}>
            {TABS.map((t) => (
              <button key={t.key} type="button" onClick={() => setTab(t.key)} className={["h-9 px-4 rounded-lg text-[14px] font-medium transition-colors whitespace-nowrap", t.key === tab ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"].join(" ")}>{t.label}</button>
            ))}
          </div>

          {tab === "store" && (
            <div className="flex flex-col gap-4">
              {/* Login info */}
              <section className={`${CARD} p-6`}>
                <h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">ข้อมูลการเข้าสู่ระบบ</h2>
                <p className="text-[13px] text-[var(--color-neutral-500)] mt-4 mb-1.5">บัญชี</p>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-[#1877f2] text-white text-[14px] font-bold flex items-center justify-center">f</span>
                    <span className="text-[14px] text-[var(--color-neutral-900)]">Paiboo***Khdsm</span>
                  </div>
                  <button type="button" className="h-8 px-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition-colors">ยกเลิกการเชื่อมต่อ</button>
                </div>
              </section>

              {/* Store info */}
              <section className={`${CARD} p-6 flex flex-col gap-6`}>
                <h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">ข้อมูลร้านค้า</h2>
                <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
                  {/* Logo column */}
                  <div className="flex flex-col items-center gap-4">
                    <input ref={logoInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const url = URL.createObjectURL(f); setLogoSrc(url); } e.target.value = ""; }} />
                    <img src={logoSrc} alt="โลโก้ร้านค้า" className="w-[150px] h-[150px] rounded-full object-cover ring-1 ring-[var(--color-neutral-300)]" />
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={pickLogo} className="h-9 px-4 rounded-md border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition">
                        อัปโหลดรูป
                      </button>
                      <button type="button" onClick={() => setLogoSrc(storeAvatarDefault)} disabled={logoSrc === storeAvatarDefault} className="h-9 px-4 rounded-md border border-[var(--color-critical)] text-[var(--color-critical)] text-[13px] font-medium hover:bg-[var(--color-critical)]/10 disabled:opacity-50 disabled:cursor-not-allowed transition">
                        ลบรูป
                      </button>
                    </div>
                    <div className="text-center text-[12px] text-[var(--color-neutral-500)] leading-relaxed">
                      <p>ขนาดไฟล์: สูงสุด 1 MB</p>
                      <p>ไฟล์ที่รองรับ: JPEG, .PNG</p>
                    </div>
                  </div>
                  {/* Fields column */}
                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                      <Field label="ชื่อร้านค้า">
                        <Input radius="sm" defaultValue="นโลมหาบารี" classNames={inputClassNames} />
                      </Field>
                      <Field label="หมวดหมู่สินค้า">
                        <Select aria-label="หมวดหมู่สินค้า" defaultSelectedKeys={["เครื่องมือการแพทย์"]} radius="sm" classNames={selectCN}>{CATEGORIES.map((c) => <SelectItem key={c}>{c}</SelectItem>)}</Select>
                      </Field>
                    </div>
                    <Field label="คำอธิบายรายละเอียดร้านค้า">
                      <Input radius="sm" placeholder="ระบุรายละเอียดร้านค้า" classNames={inputClassNames} />
                    </Field>
                    <Field label="เบอร์โทรศัพท์">
                      <div className="flex items-center gap-2">
                        <Input radius="sm" defaultValue="09*****904" classNames={inputClassNames} />
                        <button type="button" className="h-10 px-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition-colors shrink-0">เปลี่ยน</button>
                      </div>
                    </Field>
                    <Field label="อีเมล">
                      <div className="flex items-center gap-2">
                        <Input radius="sm" placeholder="กรุณาระบุอีเมล" classNames={inputClassNames} />
                        <button type="button" className="h-10 px-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition-colors shrink-0">เปลี่ยน</button>
                      </div>
                    </Field>
                    <Field label="ที่อยู่คลังสินค้า">
                      <Input radius="sm" defaultValue="เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์ 33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140" classNames={inputClassNames} />
                    </Field>
                    <button type="button" className="h-10 px-6 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:bg-[var(--color-primary-600)] transition-colors w-fit">บันทึก</button>
                  </div>
                </div>
              </section>

              {/* Business / company / committee (read only) */}
              <section className={`${CARD} p-6 flex flex-col gap-5`}>
                <div>
                  <h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">ข้อมูลธุรกิจ</h2>
                  <div className="mt-3"><ReadField label="ประเภทธุรกิจ" value="นิติบุคคล" /></div>
                </div>
                <div>
                  <h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">ข้อมูลบริษัท</h2>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReadField label="ประเภทการดำเนินงาน" value="โรงพยาบาลและร้านยา" />
                    <span />
                    <ReadField label="บริษัทที่จดทะเบียน" />
                    <ReadField label="เลขจดทะเบียนบริษัท" />
                    <ReadField label="ที่อยู่จดทะเบียนบริษัท" />
                  </div>
                </div>
                <div>
                  <h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">ข้อมูลคณะกรรมการบริษัท</h2>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReadField label="ชื่อ" />
                    <ReadField label="นามสกุล" />
                    <ReadField label="เลขบัตรประชาชน" />
                    <ReadField label="วันเกิด" />
                    <ReadField label="ที่อยู่ตามบัตรประชาชน" />
                  </div>
                </div>
              </section>
            </div>
          )}

          {tab === "bank" && (
            <div className="flex flex-col gap-4">
              <section className={`${CARD} p-6`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">บัญชีการถอนเงิน</h2>
                    <p className="text-[13px] text-[var(--color-neutral-500)] mt-1">บัญชีธนาคารจะแสดงให้เลือกตอนที่คุณจะดำเนินการถอนเงิน</p>
                  </div>
                  <button type="button" className="h-10 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium flex items-center gap-2 hover:bg-[var(--color-primary-600)] transition-colors shrink-0"><Plus size={16} />เพิ่มบัญชีใหม่</button>
                </div>
                <div className="mt-4 flex flex-col">
                  {[
                    { logo: kasikorn, name: "ธนาคารกสิกรไทย", masked: "96* **** *08", primary: true },
                    { logo: krungthai, name: "ธนาคารกรุงไทย", masked: "12* **** *22", primary: false },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-3 py-4 border-t border-[var(--color-neutral-200)] first:border-t-0">
                      <BankLogo src={b.logo} />
                      <span className="text-[14px] font-medium text-[var(--color-neutral-900)]">{b.name}</span>
                      {b.primary && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium text-white bg-[var(--color-primary)]">ค่าเริ่มต้น</span>}
                      <span className="flex-1" />
                      <span className="text-[14px] text-[var(--color-neutral-700)] tabular-nums">{b.masked}</span>
                      <button type="button" className="h-8 px-3 rounded-lg border border-[var(--color-critical)] text-[var(--color-critical)] text-[13px] font-medium hover:bg-[var(--color-critical)]/5 transition-colors shrink-0">ลบข้อมูล</button>
                    </div>
                  ))}
                </div>
              </section>

              <section className={`${CARD} p-6`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">การถอนเงินอัตโนมัติ</h2>
                    <p className="text-[13px] text-[var(--color-neutral-500)] mt-1">การถอนเงินอัตโนมัติจะดำเนินการก็ต่อเมื่อคุณทำการเชื่อมต่อบัญชีธนาคารก่อนเท่านั้น</p>
                  </div>
                  <Switch size="sm" color="success" isSelected={autoWithdraw} onValueChange={setAutoWithdraw} aria-label="เปิด/ปิดการถอนเงินอัตโนมัติ" />
                </div>
                {autoWithdraw && (
                  <div className="mt-4 flex items-center gap-3 pt-4 border-t border-[var(--color-neutral-200)]">
                    <BankLogo src={kasikorn} />
                    <span className="text-[14px] font-medium text-[var(--color-neutral-900)]">ธนาคารกสิกรไทย</span>
                    <span className="flex-1" />
                    <span className="text-[14px] text-[var(--color-neutral-700)] tabular-nums">96* **** *08</span>
                    <button type="button" className="h-8 px-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition-colors shrink-0">เปลี่ยน</button>
                  </div>
                )}
              </section>

              <section className={`${CARD} p-6`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">การจัดการรหัสผ่าน</h2>
                    <p className="text-[13px] text-[var(--color-neutral-500)] mt-1">การถอนเงินเพื่อความปลอดภัยสูงสุด กรุณาตั้งรหัสผ่าน</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4 pt-4 border-t border-[var(--color-neutral-200)]">
                  <span className="text-[18px] tracking-widest text-[var(--color-neutral-700)]">••••••</span>
                  <button type="button" className="h-8 px-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition-colors">เปลี่ยน</button>
                </div>
              </section>
            </div>
          )}

          {tab === "holiday" && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start">
              <section className={`${CARD} p-6`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">โหมดวันหยุด</h2>
                    <p className="text-[13px] text-[var(--color-neutral-500)] mt-1">เปิดใช้งานโหมดวันหยุด เพื่อปิดการขายสินค้าชั่วคราว</p>
                  </div>
                  <button type="button" onClick={() => setHolidayOpen(true)} className="h-10 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium flex items-center gap-2 hover:bg-[var(--color-primary-600)] transition-colors shrink-0"><Plus size={16} />เพิ่มวันหยุด</button>
                </div>
                <div className="mt-4 rounded-lg border border-[var(--color-neutral-200)] overflow-hidden">
                  <div className="grid grid-cols-[1fr_auto] bg-[var(--color-primary-100)] text-[12px] font-medium text-[var(--color-neutral-600)] px-4 py-2"><span>ช่วงเวลา</span><span>การดำเนินการ</span></div>
                  {holidays.map((h) => (
                    <div key={h.id} className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-4 border-t border-[var(--color-neutral-200)]">
                      <span className="text-[14px] text-[var(--color-neutral-900)]">{h.range}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <Switch size="sm" color="success" isSelected={h.on} onValueChange={(on) => setHolidays((hs) => hs.map((x) => x.id === h.id ? { ...x, on } : x))} aria-label="เปิด/ปิดวันหยุด" />
                        <button type="button" aria-label="แก้ไข" onClick={() => setHolidayOpen(true)} className="w-7 h-7 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors"><Pencil size={15} /></button>
                        <button type="button" aria-label="ลบ" onClick={() => setHolidays((hs) => hs.filter((x) => x.id !== h.id))} className="w-7 h-7 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-critical)]/10 hover:text-[var(--color-critical)] transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="flex items-start gap-1.5 text-[12px] text-[var(--color-neutral-500)] mt-4"><Info size={14} className="shrink-0 mt-0.5" />ความสำคัญของโหมดวันหยุด หากผู้ขายต้องการปิดร้านค้าบน BMS ชั่วคราว เนื่องจากสาเหตุที่มาจากความไม่พร้อมของผู้ขายหรือวันหยุดเทศกาลต่าง ๆ ผู้ขายสามารถเปิดใช้ "โหมดวันหยุด" ซึ่งทำให้ผู้ซื้อชั่วไม่สามารถสั่งซื้อสินค้าเพื่อป้องกันคำสั่งซื้อที่อาจเกิดขึ้น และไม่ให้ส่งผลกระทบต่อตัวชี้วัด ด้านประสิทธิภาพการดำเนินงานของร้านค้า</p>
              </section>
              <section className={`${CARD} p-3`}>
                <RangeCalendar aria-label="ช่วงวันหยุด" defaultValue={{ start: parseDate("2026-08-10"), end: parseDate("2026-08-24") }} visibleMonths={1} />
              </section>
            </div>
          )}

          {tab === "notify" && (
            <section className={`${CARD} p-1`}>
              {([
                ["orders", "การแจ้งเตือนการสั่งซื้อสินค้า"],
                ["promo", "การแจ้งเตือนโปรโมชัน"],
                ["message", "การแจ้งเตือนข้อความ"],
                ["product", "การแจ้งเตือนสถานะสินค้า"],
              ] as const).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[var(--color-neutral-200)] last:border-b-0">
                  <span className="text-[15px] text-[var(--color-neutral-900)]">{label}</span>
                  <Switch size="sm" color="success" isSelected={notify[key]} onValueChange={(v) => setNotify((n) => ({ ...n, [key]: v }))} aria-label={label} />
                </div>
              ))}
            </section>
          )}

          {tab === "close" && (
            <section className={`${CARD} p-6 flex flex-col gap-5`}>
              <div>
                <h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">ปิดบัญชีร้านค้า</h2>
                <p className="text-[13px] text-[var(--color-neutral-500)] mt-1">การปิดบัญชีร้านค้าเป็นการปิดร้านค้าแบบถาวร</p>
              </div>
              <ul className="rounded-xl bg-[var(--color-primary-100)]/60 p-5 flex flex-col gap-2 text-[14px] text-[var(--color-neutral-800)] list-disc pl-9">
                <li>ผู้ขายที่ตกลงตามนโยบายการปิดร้านจะไม่สามารถถอนคำร้องขอปิดร้าน เพื่อจะทำธุรกิจต่อไปได้</li>
                <li>หลังจากปิดบัญชีร้านค้าแล้ว แพลตฟอร์มจะตัดการเชื่อมต่อบัญชีอย่างเป็นทางการและบัญชีการตลาดของคุณโดยอัตโนมัติ</li>
                <li>หลังจากปิดบัญชีร้านค้าแล้ว แคมเปญโฆษณาของร้านค้าจะหยุดลงทันที และบริการที่เกี่ยวข้องจะหยุดการทำงานทันที</li>
              </ul>
              <button type="button" className="h-10 px-6 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:bg-[var(--color-primary-600)] transition-colors w-fit">ปิดร้านค้า</button>
            </section>
          )}
        </main>
      </div>
      <HolidayModal isOpen={holidayOpen} onClose={() => setHolidayOpen(false)} />
    </div>
  );
}
