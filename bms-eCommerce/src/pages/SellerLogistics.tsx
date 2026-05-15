import { useState } from "react";
import { Switch } from "@heroui/react";
import { Info, Minus, Pencil, Plus } from "lucide-react";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import AddWarehouseAddressModal from "../components/landing/AddWarehouseAddressModal";
import thaipost from "../assets/shipping/thaipost.png";
import jt from "../assets/shipping/jt.png";
import kerry from "../assets/shipping/kerry.png";
import flash from "../assets/shipping/flash.png";

const CARD = "bg-white rounded-xl shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] flex flex-col";

type Carrier = { id: string; name: string; logo: string | null; on: boolean };
const CARRIERS: Carrier[] = [
  { id: "thaipost", name: "ไปรษณีย์ไทย", logo: thaipost, on: false },
  { id: "jt", name: "J&T Express", logo: jt, on: true },
  { id: "kerry", name: "Kerry Express", logo: kerry, on: true },
  { id: "flash", name: "Flash Express", logo: flash, on: true },
  { id: "dhl", name: "DHL Express", logo: null, on: true },
];

const ADDRESSES = [
  { id: "a1", text: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์ 33 แขวงราษฎร์บูรณะ เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140", detail: "", primary: true },
  { id: "a2", text: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์ 33 แขวงราษฎร์บูรณะ เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140", detail: "แถวๆ ตลาดนัดลำตะคลอง หน้าธนาคารกรุงไทย", primary: false },
];

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center h-10 rounded-lg border border-[var(--color-neutral-300)] overflow-hidden">
      <input type="text" value={value} onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")) || 0)} className="flex-1 min-w-0 h-full px-3 text-[14px] text-[var(--color-neutral-900)] focus:outline-none tabular-nums" />
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className="w-9 h-full border-l border-[var(--color-neutral-300)] flex items-center justify-center text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]" aria-label="ลด"><Minus size={14} /></button>
      <button type="button" onClick={() => onChange(value + 1)} className="w-9 h-full border-l border-[var(--color-neutral-300)] flex items-center justify-center text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]" aria-label="เพิ่ม"><Plus size={14} /></button>
    </div>
  );
}

function CarrierTile({ name, logo, on, onToggle }: { name: string; logo: string | null; on: boolean; onToggle: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-neutral-200)]">
      {logo ? (
        <img src={logo} alt="" className="w-9 h-9 object-contain shrink-0" />
      ) : (
        <span className="w-9 h-9 shrink-0 rounded bg-[#ffcc00] flex items-center justify-center text-[10px] font-extrabold text-[#d40511]">DHL</span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-[var(--color-neutral-900)] truncate">{name}</p>
        <p className="text-[12px] text-[var(--color-neutral-500)]">มีบริการเก็บปลายทาง (COD)</p>
      </div>
      <Switch size="sm" color="success" isSelected={on} onValueChange={onToggle} aria-label={`เปิด/ปิด ${name}`} />
    </div>
  );
}

export default function SellerLogistics() {
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [freeShip, setFreeShip] = useState(0);
  const [defaultFee, setDefaultFee] = useState(0);
  const [carrierOn, setCarrierOn] = useState<Record<string, boolean>>(() => Object.fromEntries(CARRIERS.map((c) => [c.id, c.on])));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader onMenuClick={() => setMobileMenuOpen(true)} />
      <div className="flex">
        <SellerSidebar active="โลจิสติกส์" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
          <h1 className="text-[20px] font-semibold text-[var(--color-primary-700)]">โลจิสติกส์</h1>

          {/* Warehouse addresses */}
          <section className={`${CARD} p-6`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">ที่อยู่คลังสินค้า</h2>
                <p className="flex items-start gap-1.5 text-[12px] text-[var(--color-neutral-500)] mt-1"><Info size={14} className="shrink-0 mt-0.5" />ใช้แสดงตำแหน่งหรือที่ตั้งหลักของร้านค้า ข้อมูลนี้อาจปรากฏในหน้าโปรไฟล์ร้าน และใช้สำหรับอ้างอิงทางธุรกิจ โปรดระบุข้อมูลให้ถูกต้องและครบถ้วน</p>
              </div>
              <button type="button" onClick={() => setAddOpen(true)} className="h-10 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium flex items-center gap-2 hover:bg-[var(--color-primary-600)] transition-colors shrink-0"><Plus size={16} />เพิ่มที่อยู่คลังสินค้า</button>
            </div>
            <div className="mt-4 rounded-lg border border-[var(--color-neutral-200)] overflow-hidden">
              <div className="grid grid-cols-[1fr_auto] bg-[var(--color-primary-100)] text-[12px] font-medium text-[var(--color-neutral-600)] px-4 py-2">
                <span>ที่อยู่</span><span>การดำเนินการ</span>
              </div>
              {ADDRESSES.map((a) => (
                <div key={a.id} className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-4 border-t border-[var(--color-neutral-200)]">
                  <div className="min-w-0">
                    <p className="text-[14px] text-[var(--color-neutral-900)]">{a.text}</p>
                    {a.detail && <p className="text-[14px] text-[var(--color-neutral-700)] mt-0.5">{a.detail}</p>}
                    {a.primary && <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-medium text-white bg-[#0088ff] mt-1.5">ที่อยู่หลัก</span>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button type="button" className="h-8 px-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition-colors">แก้ไขที่อยู่</button>
                    <button type="button" className="h-8 px-3 rounded-lg border border-[var(--color-critical)] text-[var(--color-critical)] text-[13px] font-medium hover:bg-[var(--color-critical)]/5 transition-colors">ลบที่อยู่</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Shipping settings + carriers */}
          <section className={`${CARD} p-6`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">ตั้งค่าการจัดส่ง</h2>
                <p className="flex items-center gap-1.5 text-[12px] text-[var(--color-neutral-500)] mt-1"><Info size={14} className="shrink-0" />กำหนดยอดส่งฟรีและขนส่งที่ร้านใช้บริการ</p>
              </div>
              {editing ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button type="button" onClick={() => setEditing(false)} className="h-10 px-4 rounded-lg border border-[var(--color-critical)] text-[var(--color-critical)] text-[14px] font-medium hover:bg-[var(--color-critical)]/5 transition-colors">ยกเลิก</button>
                  <button type="button" onClick={() => setEditing(false)} className="h-10 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:bg-[var(--color-primary-600)] transition-colors">บันทึกข้อมูล</button>
                </div>
              ) : (
                <button type="button" onClick={() => setEditing(true)} className="h-10 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium flex items-center gap-2 hover:bg-[var(--color-primary-600)] transition-colors shrink-0"><Pencil size={16} />แก้ไขข้อมูล</button>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-[var(--color-neutral-200)]">
              <div className="flex flex-col gap-2">
                <span className="text-[14px] text-[var(--color-neutral-700)]">ยอดสั่งซื้อขั้นต่ำที่ส่งฟรี (บาท)</span>
                {editing ? (
                  <>
                    <Stepper value={freeShip} onChange={setFreeShip} />
                    <p className="flex items-center gap-1.5 text-[12px] text-[var(--color-neutral-500)]"><Info size={13} className="shrink-0" />ตั้งค่าเป็น 0 เพื่อปิดส่งฟรี (เช่น 500 = ฟรีเมื่อซื้อครบ 500 บาท)</p>
                  </>
                ) : (
                  <span className="text-[18px] font-semibold text-[var(--color-primary)] tabular-nums">฿{freeShip.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[14px] text-[var(--color-neutral-700)]">ค่าจัดส่งเริ่มต้น (บาท)</span>
                {editing ? (
                  <>
                    <Stepper value={defaultFee} onChange={setDefaultFee} />
                    <p className="flex items-center gap-1.5 text-[12px] text-[var(--color-neutral-500)]"><Info size={13} className="shrink-0" />ใช้เมื่อไม่มี shipping rate ที่ตรงกับน้ำหนักสินค้า</p>
                  </>
                ) : (
                  <span className="text-[18px] font-semibold text-[var(--color-primary)] tabular-nums">฿{defaultFee.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</span>
                )}
              </div>
            </div>

            <h3 className="text-[16px] font-medium text-[var(--color-neutral-900)] mt-6 mb-3">ขนส่งที่ร้านใช้บริการ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {CARRIERS.map((c) => (
                <CarrierTile key={c.id} name={c.name} logo={c.logo} on={!!carrierOn[c.id]} onToggle={(v) => setCarrierOn((s) => ({ ...s, [c.id]: v }))} />
              ))}
            </div>
          </section>
        </main>
      </div>
      <AddWarehouseAddressModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
