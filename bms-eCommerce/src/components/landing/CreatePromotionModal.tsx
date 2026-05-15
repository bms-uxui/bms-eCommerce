import { useEffect, useState } from "react";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { ImagePlus, Minus, Plus, Trash2, X } from "lucide-react";
import paracetamol from "../../assets/products/p02-paracetamol.jpg";
import { inputClassNames as inputCls } from "../inputStyles";
import AddProductModal, { type CatalogProduct } from "./AddProductModal";
import DatePickerField from "./DatePickerField";
import type { QuoteProduct } from "./QuoteRequestModal";

export const MARKETING_CATALOG: CatalogProduct[] = [
  { id: "mc1", image: paracetamol, name: "ชาอูหลงผสมดอกหอมหมื่นลี้", unitPrice: 150, stock: 100, minOrderQty: 1 },
  { id: "mc2", image: paracetamol, name: "ชาอูหลงผสมดอกหอมหมื่นลี้", unitPrice: 100, stock: 100, minOrderQty: 1 },
  { id: "mc3", image: paracetamol, name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้า", unitPrice: 190, stock: 50, minOrderQty: 1 },
  { id: "mc4", image: paracetamol, name: "เครื่องมือการแพทย์รุ่นใหม่", unitPrice: 340, stock: 100, minOrderQty: 1 },
];

const baht = (n: number) => `฿ ${n.toLocaleString("th-TH", { minimumFractionDigits: 2 })}`;

type DiscType = "percent" | "amount" | "fixed";
const DISC_TYPES: { key: DiscType; label: string; valueLabel: string }[] = [
  { key: "percent", label: "ลดเปอร์เซ็นต์ (%)", valueLabel: "ลดกี่เปอร์เซ็นต์ (%)" },
  { key: "amount", label: "ลดราคาสินค้า (฿)", valueLabel: "จำนวนลด (฿)" },
  { key: "fixed", label: "ขายราคาคงที่ (฿)", valueLabel: "ราคาขาย (฿)" },
];

const selectCN = {
  trigger: "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] shadow-none rounded-lg",
  value: "text-[14px] text-[var(--color-neutral-900)] data-[has-value=false]:text-[var(--color-neutral-500)]",
};

function Lab({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="text-[14px] font-medium text-[var(--color-neutral-900)]">
      {children}{required && <span className="text-[var(--color-critical)]"> *</span>}
    </span>
  );
}

function QtyStepper({ value, onChange, max }: { value: number; onChange: (v: number) => void; max?: number }) {
  return (
    <div className="flex items-center h-9 rounded-lg border border-[var(--color-neutral-300)] overflow-hidden shrink-0">
      <span className="w-12 text-center text-[14px] text-[var(--color-neutral-900)] tabular-nums">{value}</span>
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} className="w-8 h-full border-l border-[var(--color-neutral-300)] flex items-center justify-center text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]" aria-label="ลด"><Minus size={14} /></button>
      <button type="button" onClick={() => onChange(max ? Math.min(max, value + 1) : value + 1)} className="w-8 h-full border-l border-[var(--color-neutral-300)] flex items-center justify-center text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]" aria-label="เพิ่ม"><Plus size={14} /></button>
    </div>
  );
}

export default function CreatePromotionModal({ isOpen, onClose, title = "สร้างโปรโมชั่น" }: { isOpen: boolean; onClose: () => void; title?: string }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [products, setProducts] = useState<QuoteProduct[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [img, setImg] = useState<string | null>(null);

  // การลดราคา
  const [discType, setDiscType] = useState<DiscType>("percent");
  const [discValue, setDiscValue] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");

  // ระยะเวลา
  const [noExpiry, setNoExpiry] = useState(false);
  const [status, setStatus] = useState("active");

  useEffect(() => {
    if (isOpen) {
      setName(""); setDesc(""); setImg(null);
      setDiscType("percent"); setDiscValue(""); setMaxDiscount("");
      setNoExpiry(false); setStatus("active");
      setProducts(MARKETING_CATALOG.slice(0, 2).map((c) => ({ id: c.id, image: c.image, name: c.name, unitPrice: c.unitPrice, qty: 1, minOrderQty: c.minOrderQty })));
    }
  }, [isOpen]);

  const setQty = (id: string, qty: number) => setProducts((p) => p.map((x) => (x.id === id ? { ...x, qty } : x)));
  const remove = (id: string) => setProducts((p) => p.filter((x) => x.id !== id));

  const totalPrice = products.reduce((s, p) => s + p.unitPrice * p.qty, 0);
  const discNum = parseFloat(discValue) || 0;
  const discountAmount = discType === "percent"
    ? Math.min(totalPrice * discNum / 100, parseFloat(maxDiscount) || Infinity)
    : discType === "amount" ? discNum : 0;
  const promoPrice = discType === "fixed" ? discNum : Math.max(0, totalPrice - discountAmount);

  const cfg = DISC_TYPES.find((t) => t.key === discType)!;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} placement="center" size="lg" hideCloseButton scrollBehavior="inside" classNames={{ base: "rounded-2xl" }}>
        <ModalContent>
          <ModalHeader className="flex items-center justify-between gap-4 border-b border-[var(--color-neutral-300)] p-4">
            <h2 className="text-[18px] font-semibold leading-4 text-[var(--color-neutral-900)]">{title}</h2>
            <button type="button" aria-label="ปิด" onClick={onClose} className="w-6 h-6 rounded-full bg-[var(--color-neutral-200)] flex items-center justify-center text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-300)] transition"><X size={12} strokeWidth={2.5} /></button>
          </ModalHeader>

          <ModalBody className="p-5 flex flex-col gap-0">

            {/* ── ข้อมูลโปรโมชั่น ── */}
            <div className="pb-5 border-b border-[var(--color-neutral-200)]">
              <p className="text-[18px] font-medium text-[var(--color-neutral-900)] mb-4">ข้อมูลโปรโมชั่น</p>
              <div className="flex justify-center mb-4">
                <label className="w-[150px] h-[150px] rounded-xl border border-dashed border-[var(--color-neutral-400)] bg-[var(--color-primary-50,#f7fcfe)] flex flex-col items-center justify-center gap-3 text-[var(--color-neutral-500)] cursor-pointer hover:border-[var(--color-primary)] transition overflow-hidden">
                  {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : (<><ImagePlus size={24} /><span className="text-[14px] font-semibold text-[var(--color-neutral-900)]">เพิ่มรูปภาพ</span></>)}
                  <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setImg(URL.createObjectURL(f)); }} />
                </label>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5"><Lab required>ชื่อโปรโมชั่น</Lab><Input value={name} onValueChange={setName} placeholder="" radius="sm" classNames={inputCls} /></div>
                <div className="flex flex-col gap-1.5"><Lab>รายละเอียด</Lab><Input value={desc} onValueChange={setDesc} placeholder="" radius="sm" classNames={inputCls} /></div>
              </div>
            </div>

            {/* ── สินค้าในโปรโมชั่น ── */}
            <div className="py-5 border-b border-[var(--color-neutral-200)]">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[18px] font-medium text-[var(--color-neutral-900)]">สินค้าในโปรโมชั่น</p>
                <button type="button" onClick={() => setAddOpen(true)} className="h-10 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium flex items-center gap-2 hover:bg-[var(--color-primary-600)] transition-colors"><Plus size={16} />เพิ่มสินค้า</button>
              </div>
              <div className="flex flex-col gap-3">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-lg border border-[var(--color-neutral-200)] pl-2 pr-3 py-2">
                    <img src={p.image} alt="" className="w-16 h-16 rounded object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-[var(--color-neutral-900)] truncate">{p.name}</p>
                      <p className="text-[14px] text-[var(--color-primary)] font-semibold mt-0.5">{baht(p.unitPrice)} x{p.qty} = {baht(p.unitPrice * p.qty)}</p>
                      <p className="text-[12px] text-[var(--color-neutral-500)] mt-0.5">จำนวน 100 ชิ้น</p>
                    </div>
                    <QtyStepper value={p.qty} onChange={(v) => setQty(p.id, v)} />
                    <button type="button" onClick={() => remove(p.id)} className="text-[var(--color-neutral-500)] hover:text-[var(--color-critical)] shrink-0" aria-label="ลบ"><Trash2 size={18} /></button>
                  </div>
                ))}
                {products.length === 0 && <p className="text-center text-[14px] text-[var(--color-neutral-500)] py-6">ยังไม่มีสินค้า</p>}
              </div>
            </div>

            {/* ── การลดราคา ── */}
            <div className="py-5 border-b border-[var(--color-neutral-200)]">
              <p className="text-[18px] font-medium text-[var(--color-neutral-900)] mb-4">การลดราคา</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1.5">
                  <Lab required>ประเภทส่วนลด</Lab>
                  <Select
                    aria-label="ประเภทส่วนลด"
                    selectedKeys={[discType]}
                    onSelectionChange={(k) => setDiscType(Array.from(k)[0] as DiscType)}
                    radius="sm"
                    classNames={selectCN}
                  >
                    {DISC_TYPES.map((t) => <SelectItem key={t.key}>{t.label}</SelectItem>)}
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Lab required>{cfg.valueLabel}</Lab>
                  <Input value={discValue} onValueChange={setDiscValue} placeholder="0" radius="sm" classNames={inputCls} />
                </div>
                {discType === "percent" && (
                  <div className="flex flex-col gap-1.5">
                    <Lab>ส่วนลดสูงสุด (฿)</Lab>
                    <Input value={maxDiscount} onValueChange={setMaxDiscount} placeholder="0.00" radius="sm" classNames={inputCls} />
                  </div>
                )}
              </div>

              {/* Summary box */}
              <div className="rounded-xl bg-[var(--color-primary-50,#f7fcfe)] py-4 flex flex-col gap-4">
                <div className="flex items-center px-4">
                  <span className="flex-1 text-[16px] text-[var(--color-neutral-900)]">ราคารวม</span>
                  <span className="text-[16px] font-medium text-[var(--color-neutral-900)]">{baht(totalPrice)}</span>
                </div>
                <div className="flex items-center px-4">
                  <span className="flex-1 text-[16px] text-[var(--color-neutral-900)]">
                    {discType === "percent" ? `ส่วนลด ${discNum} %` : discType === "amount" ? "ส่วนลด" : "ราคาคงที่"}
                  </span>
                  <span className="text-[16px] text-[var(--color-critical)]">- {baht(discountAmount)}</span>
                </div>
                <div className="flex items-center px-4">
                  <span className="flex-1 text-[16px] font-medium text-[var(--color-neutral-900)]">ราคาโปรโมชั่น</span>
                  <span className="text-[16px] font-medium text-[var(--color-primary)]">{baht(promoPrice)}</span>
                </div>
              </div>
            </div>

            {/* ── ระยะเวลา ── */}
            <div className="pt-5 pb-2">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[18px] font-medium text-[var(--color-neutral-900)]">ระยะเวลา</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noExpiry}
                    onChange={(e) => setNoExpiry(e.target.checked)}
                    className="w-4 h-4 rounded border-[var(--color-neutral-500)] accent-[var(--color-primary)]"
                  />
                  <span className="text-[14px] text-[var(--color-neutral-900)]">ไม่มีวันหมดอายุ</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DatePickerField label="เวลาเริ่ม" required />
                {!noExpiry && <DatePickerField label="เวลาสิ้นสุด" required />}
                <div className="flex flex-col gap-1.5">
                  <Lab required>สถานะ</Lab>
                  <Select
                    aria-label="สถานะ"
                    selectedKeys={[status]}
                    onSelectionChange={(k) => setStatus(Array.from(k)[0] as string)}
                    radius="sm"
                    classNames={selectCN}
                  >
                    <SelectItem key="active">เปิดใช้งาน</SelectItem>
                    <SelectItem key="inactive">ปิดใช้งาน</SelectItem>
                  </Select>
                </div>
              </div>
            </div>

          </ModalBody>

          <ModalFooter className="border-t border-[var(--color-neutral-300)] p-4 gap-3">
            <Button radius="sm" variant="bordered" onPress={onClose} className="h-10 px-6 border-[var(--color-neutral-400)] text-[var(--color-neutral-900)] text-[14px] font-medium">ยกเลิก</Button>
            <Button radius="sm" onPress={onClose} className="h-10 px-6 bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition">บันทึก</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AddProductModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        catalog={MARKETING_CATALOG}
        excludeIds={products.map((p) => p.id)}
        onConfirm={(picked) => setProducts((p) => [...p, ...picked])}
      />
    </>
  );
}
