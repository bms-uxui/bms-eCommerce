import { useEffect, useState } from "react";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Switch,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { X } from "lucide-react";

const PROVINCES = ["กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ", "เชียงใหม่"];
const DISTRICTS = ["ราษฎร์บูรณะ", "บางกอกน้อย", "ดินแดง", "ห้วยขวาง", "บางพลัด"];
const SUBDISTRICTS = ["ราษฎร์บูรณะ", "บางปะกอก", "ศิริราช", "ห้วยขวาง"];
const POSTCODES = ["10140", "10160", "10170", "10310", "11000"];

const selectCN = {
  trigger: "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] shadow-none rounded-lg",
  value: "text-[14px] text-[var(--color-neutral-900)] data-[has-value=false]:text-[var(--color-neutral-500)]",
};
const inputCN = {
  inputWrapper: "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] shadow-none",
  input: "text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)]",
};

export default function AddWarehouseAddressModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}) {
  const [line, setLine] = useState("");
  const [detail, setDetail] = useState("");
  const [isDefault, setIsDefault] = useState(true);

  useEffect(() => {
    if (isOpen) { setLine(""); setDetail(""); setIsDefault(true); }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" size="md" hideCloseButton scrollBehavior="inside" classNames={{ base: "rounded-2xl" }}>
      <ModalContent>
        <ModalHeader className="flex items-center justify-between gap-4 border-b border-[var(--color-neutral-300)] p-4">
          <h2 className="text-[18px] font-semibold leading-4 text-[var(--color-neutral-900)]">เพิ่มที่อยู่คลังสินค้า</h2>
          <button type="button" aria-label="ปิด" onClick={onClose} className="w-6 h-6 rounded-full bg-[var(--color-neutral-200)] flex items-center justify-center text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-300)] transition"><X size={12} strokeWidth={2.5} /></button>
        </ModalHeader>

        <ModalBody className="p-5 flex flex-col gap-4">
          <span className="text-[14px] text-[var(--color-neutral-700)]">ที่อยู่การจัดส่ง<span className="text-[var(--color-critical)]"> *</span></span>
          <div className="grid grid-cols-2 gap-3">
            <Select aria-label="จังหวัด" placeholder="จังหวัด" radius="sm" classNames={selectCN}>{PROVINCES.map((p) => <SelectItem key={p}>{p}</SelectItem>)}</Select>
            <Select aria-label="เขต/อำเภอ" placeholder="เขต/อำเภอ" radius="sm" classNames={selectCN}>{DISTRICTS.map((d) => <SelectItem key={d}>{d}</SelectItem>)}</Select>
            <Select aria-label="แขวง/ตำบล" placeholder="แขวง/ตำบล" radius="sm" classNames={selectCN}>{SUBDISTRICTS.map((s) => <SelectItem key={s}>{s}</SelectItem>)}</Select>
            <Select aria-label="รหัสไปรษณีย์" placeholder="รหัสไปรษณีย์" radius="sm" classNames={selectCN}>{POSTCODES.map((p) => <SelectItem key={p}>{p}</SelectItem>)}</Select>
          </div>
          <Input value={line} onValueChange={setLine} placeholder="บ้านเลขที่, หมู่, หอพัก, ซอย, ถนน" radius="sm" classNames={inputCN} />
          <div className="flex flex-col gap-1.5">
            <span className="text-[14px] text-[var(--color-neutral-700)]">รายละเอียดเพิ่มเติม</span>
            <Input value={detail} onValueChange={setDetail} placeholder="เช่น ตึก ชั้น ห้อง จุดสังเกต" radius="sm" classNames={inputCN} />
          </div>
          <div className="flex items-center justify-between gap-4 pt-1">
            <span className="text-[14px] text-[var(--color-neutral-900)]">ตั้งเป็นที่อยู่หลัก</span>
            <Switch size="sm" color="success" isSelected={isDefault} onValueChange={setIsDefault} aria-label="ตั้งเป็นที่อยู่หลัก" />
          </div>
        </ModalBody>

        <ModalFooter className="border-t border-[var(--color-neutral-300)] p-4">
          <Button radius="sm" onPress={() => { onSubmit?.(); onClose(); }} className="w-full h-10 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 transition">บันทึกที่อยู่คลังสินค้า</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
