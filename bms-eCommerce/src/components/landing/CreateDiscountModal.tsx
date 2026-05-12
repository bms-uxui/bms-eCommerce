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
import { X } from "lucide-react";
import DatePickerField from "./DatePickerField";

type DiscType = "percent" | "amount" | "fixed";
const DISC_TYPES: { key: DiscType; label: string; valueLabel: string; valuePh: string }[] = [
  { key: "percent", label: "ลดเปอร์เซ็นต์ (%)", valueLabel: "ลดกี่เปอร์เซ็นต์ (%)", valuePh: "เช่น 10" },
  { key: "amount", label: "ลดราคาสินค้า (B)", valueLabel: "จำนวนลด (B)", valuePh: "เช่น 100" },
  { key: "fixed", label: "ขายราคาคงที่ (B)", valueLabel: "ราคาขาย (B)", valuePh: "เช่น 99" },
];

const selectCN = {
  trigger: "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] shadow-none rounded-lg",
  value: "text-[14px] text-[var(--color-neutral-900)] data-[has-value=false]:text-[var(--color-neutral-500)]",
};
const inputCN = {
  inputWrapper: "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] shadow-none",
  input: "text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)]",
};
function Lab({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return <span className="text-[14px] text-[var(--color-neutral-700)]">{children}{required && <span className="text-[var(--color-critical)]"> *</span>}</span>;
}

export default function CreateDiscountModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<DiscType>("percent");
  const cfg = DISC_TYPES.find((t) => t.key === type)!;

  useEffect(() => { if (isOpen) { setCode(""); setType("percent"); } }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" size="lg" hideCloseButton scrollBehavior="inside" classNames={{ base: "rounded-2xl" }}>
      <ModalContent>
        <ModalHeader className="flex items-center justify-between gap-4 border-b border-[var(--color-neutral-300)] p-4">
          <h2 className="text-[18px] font-semibold leading-4 text-[var(--color-neutral-900)]">สร้างโค้ดส่วนลด</h2>
          <button type="button" aria-label="ปิด" onClick={onClose} className="w-6 h-6 rounded-full bg-[var(--color-neutral-200)] flex items-center justify-center text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-300)] transition"><X size={12} strokeWidth={2.5} /></button>
        </ModalHeader>

        <ModalBody className="p-5 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Lab required>โค้ดส่วนลด</Lab>
            <Input value={code} onValueChange={(v) => setCode(v.toUpperCase())} placeholder="เช่น BMSECM20" radius="sm" classNames={inputCN} />
          </div>

          <div>
            <p className="text-[16px] font-medium text-[var(--color-neutral-900)] mb-3">ส่วนลด</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Lab required>ประเภทส่วนลด</Lab>
                <Select aria-label="ประเภทส่วนลด" selectedKeys={[type]} onSelectionChange={(k) => setType(Array.from(k)[0] as DiscType)} radius="sm" classNames={selectCN}>
                  {DISC_TYPES.map((t) => <SelectItem key={t.key}>{t.label}</SelectItem>)}
                </Select>
              </div>
              <div className="flex flex-col gap-1.5"><Lab required>{cfg.valueLabel}</Lab><Input placeholder={cfg.valuePh} radius="sm" classNames={inputCN} /></div>
              {type === "percent" && <div className="flex flex-col gap-1.5"><Lab>ส่วนลดสูงสุด (B)</Lab><Input placeholder="เช่น 300" radius="sm" classNames={inputCN} /></div>}
            </div>
          </div>

          <div>
            <p className="text-[16px] font-medium text-[var(--color-neutral-900)] mb-3">เงื่อนไข</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Lab>ประเภทเงื่อนไข</Lab>
                <Select aria-label="ประเภทเงื่อนไข" defaultSelectedKeys={["min"]} radius="sm" classNames={selectCN}>
                  <SelectItem key="min">ซื้อขั้นต่ำ (B)</SelectItem>
                  <SelectItem key="first">สั่งซื้อครั้งแรก</SelectItem>
                  <SelectItem key="freeship">ส่งฟรี</SelectItem>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5"><Lab>ยอดซื้อขั้นต่ำ (B)</Lab><Input placeholder="เช่น 1,000" radius="sm" classNames={inputCN} /></div>
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
  );
}
