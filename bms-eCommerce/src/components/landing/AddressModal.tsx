import { useEffect, useState } from "react";
import {
  Input,
  Button,
  Switch,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
} from "@heroui/react";
import { X } from "lucide-react";

export type AddressData = {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
};

const inputClassNames = {
  inputWrapper:
    "h-11 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:bg-white data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-[var(--color-primary)]/20 shadow-none",
  input:
    "text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)]",
};

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-[var(--color-neutral-900)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function maskThaiPhoneInput(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

export function AddressModal({
  isOpen,
  onClose,
  onSubmit,
  initial,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddressData) => void;
  initial?: AddressData;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initial?.name ?? "");
      setPhone(initial?.phone ?? "");
      setAddress(initial?.address ?? "");
      setIsDefault(initial?.isDefault ?? false);
    }
  }, [isOpen, initial]);

  const valid =
    name.trim().length > 0 &&
    phone.replace(/\D/g, "").length === 10 &&
    address.trim().length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="md"
      hideCloseButton
      classNames={{ base: "rounded-2xl" }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between border-b border-[var(--color-neutral-300)]">
          <h2 className="text-[18px] font-bold text-[var(--color-neutral-900)]">
            {initial ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
          </h2>
          <button
            type="button"
            aria-label="ปิด"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-200)] transition"
          >
            <X size={18} />
          </button>
        </ModalHeader>
        <ModalBody className="py-5 flex flex-col gap-5">
          <FieldLabel label="ชื่อ-นามสกุล">
            <Input
              value={name}
              onValueChange={setName}
              placeholder="กรุณาระบุ"
              radius="sm"
              classNames={inputClassNames}
            />
          </FieldLabel>

          <FieldLabel label="เบอร์โทรศัพท์">
            <Input
              value={phone}
              onValueChange={(v) => setPhone(maskThaiPhoneInput(v))}
              placeholder="0XX-XXX-XXXX"
              inputMode="numeric"
              radius="sm"
              classNames={inputClassNames}
            />
          </FieldLabel>

          <FieldLabel label="ที่อยู่">
            <Textarea
              value={address}
              onValueChange={setAddress}
              placeholder="เลขที่ ถนน ซอย แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
              radius="sm"
              minRows={3}
              classNames={{
                inputWrapper:
                  "bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-[var(--color-primary)]/20 shadow-none",
                input:
                  "text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)]",
              }}
            />
          </FieldLabel>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[14px] text-[var(--color-neutral-900)]">
              ตั้งเป็นที่อยู่หลัก
            </span>
            <Switch
              size="sm"
              isSelected={isDefault}
              onValueChange={setIsDefault}
              color="success"
            />
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-[var(--color-neutral-300)]">
          <Button
            radius="md"
            isDisabled={!valid}
            onPress={() => {
              onSubmit({
                id: initial?.id ?? `addr-${Date.now()}`,
                name: name.trim(),
                phone,
                address: address.trim(),
                isDefault,
              });
              onClose();
            }}
            className="w-full h-11 bg-[var(--color-primary)] text-white text-[15px] font-medium hover:brightness-110 disabled:opacity-50 transition"
          >
            {initial ? "บันทึกการแก้ไข" : "บันทึกที่อยู่"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
