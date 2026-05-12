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
import { Plus, Trash2, X } from "lucide-react";
import AddProductModal from "./AddProductModal";
import DatePickerField from "./DatePickerField";
import { MARKETING_CATALOG } from "./CreatePromotionModal";
import type { QuoteProduct } from "./QuoteRequestModal";

const inputCN = {
  inputWrapper: "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] shadow-none",
  input: "text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)]",
};
const selectCN = {
  trigger: "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] shadow-none rounded-lg",
  value: "text-[14px] text-[var(--color-neutral-900)] data-[has-value=false]:text-[var(--color-neutral-500)]",
};
function Lab({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return <span className="text-[14px] text-[var(--color-neutral-700)]">{children}{required && <span className="text-[var(--color-critical)]"> *</span>}</span>;
}

export default function AddFlashSaleProductModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [products, setProducts] = useState<QuoteProduct[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  useEffect(() => { if (isOpen) setProducts([]); }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} placement="center" size="lg" hideCloseButton scrollBehavior="inside" classNames={{ base: "rounded-2xl" }}>
        <ModalContent>
          <ModalHeader className="flex items-center justify-between gap-4 border-b border-[var(--color-neutral-300)] p-4">
            <h2 className="text-[18px] font-semibold leading-4 text-[var(--color-neutral-900)]">เพิ่มสินค้า Flash Sale</h2>
            <button type="button" aria-label="ปิด" onClick={onClose} className="w-6 h-6 rounded-full bg-[var(--color-neutral-200)] flex items-center justify-center text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-300)] transition"><X size={12} strokeWidth={2.5} /></button>
          </ModalHeader>

          <ModalBody className="p-5 flex flex-col gap-5">
            <div>
              <p className="text-[16px] font-medium text-[var(--color-neutral-900)] mb-3">สินค้า</p>
              {products.length === 0 ? (
                <button type="button" onClick={() => setAddOpen(true)} className="w-full rounded-lg border-2 border-dashed border-[var(--color-neutral-300)] bg-[var(--color-primary-100)]/30 py-8 flex flex-col items-center justify-center gap-1.5 text-[var(--color-primary)] hover:border-[var(--color-primary)] transition"><Plus size={20} /><span className="text-[14px] font-medium">เพิ่มสินค้า</span></button>
              ) : (
                <div className="flex flex-col gap-2">
                  {products.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 rounded-lg border border-[var(--color-neutral-200)] p-3">
                      <img src={p.image} alt="" className="w-12 h-12 rounded object-cover shrink-0" />
                      <div className="flex-1 min-w-0"><p className="text-[14px] text-[var(--color-neutral-900)] truncate">{p.name}</p><p className="text-[12px] text-[var(--color-neutral-500)]">฿ {p.unitPrice.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</p></div>
                      <button type="button" onClick={() => setProducts((x) => x.filter((q) => q.id !== p.id))} className="text-[var(--color-neutral-500)] hover:text-[var(--color-critical)] shrink-0" aria-label="ลบ"><Trash2 size={16} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setAddOpen(true)} className="self-start flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-primary)] hover:underline"><Plus size={16} />เพิ่มสินค้า</button>
                </div>
              )}
            </div>

            <div>
              <p className="text-[16px] font-medium text-[var(--color-neutral-900)] mb-3">ส่วนลด</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5"><Lab required>ส่วนลด (%)</Lab><Input placeholder="เช่น 10" radius="sm" classNames={inputCN} /></div>
                <div className="flex flex-col gap-1.5"><Lab>จำกัดจำนวน</Lab><Input placeholder="เว้นว่างเพื่อใช้จำนวนสต๊อกที่มีอยู่" radius="sm" classNames={inputCN} /></div>
              </div>
            </div>

            <div>
              <p className="text-[16px] font-medium text-[var(--color-neutral-900)] mb-3">ระยะเวลา</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <DatePickerField label="เวลาเริ่ม" required />
                <DatePickerField label="เวลาสิ้นสุด" required />
                <div className="flex flex-col gap-1.5">
                  <Lab required>สถานะ</Lab>
                  <Select aria-label="สถานะ" defaultSelectedKeys={["active"]} radius="sm" classNames={selectCN}>
                    <SelectItem key="active">เปิดใช้งาน</SelectItem>
                    <SelectItem key="draft">ฉบับร่าง</SelectItem>
                    <SelectItem key="disabled">ปิดใช้งาน</SelectItem>
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

      <AddProductModal isOpen={addOpen} onClose={() => setAddOpen(false)} catalog={MARKETING_CATALOG} excludeIds={products.map((p) => p.id)} onConfirm={(picked) => setProducts((p) => [...p, ...picked])} />
    </>
  );
}
