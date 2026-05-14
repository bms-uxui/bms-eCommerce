import { useEffect, useState } from "react";
import {
  Input,
  Button,
  Switch,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { X } from "lucide-react";
import { inputClassNames } from "../inputStyles";

export type AddressData = {
  id: string;
  name: string;
  phone: string;
  detail: string;
  isDefault?: boolean;
};

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      aria-label="ปิด"
      onClick={onClose}
      className="w-7 h-7 rounded-full bg-[rgba(120,120,128,0.12)] flex items-center justify-center text-[var(--color-neutral-900)] hover:bg-[rgba(120,120,128,0.2)] transition shrink-0"
    >
      <X size={14} strokeWidth={2.5} />
    </button>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  if (selected) {
    return (
      <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-white" />
      </span>
    );
  }
  return (
    <span className="w-5 h-5 rounded-full border border-[var(--color-neutral-500)] bg-white" />
  );
}

const SAMPLE_ADDRESSES: AddressData[] = [
  {
    id: "addr-1",
    name: "นายดิอนันท์ สุทัศน์",
    phone: "(+66)93 695 5934",
    detail:
      "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140",
    isDefault: true,
  },
  {
    id: "addr-2",
    name: "นายดิอนันท์ สุทัศน์",
    phone: "(+66)93 695 5934",
    detail:
      "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140",
  },
  {
    id: "addr-3",
    name: "นายดิอนันท์ สุทัศน์",
    phone: "(+66)93 695 5934",
    detail:
      "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140",
  },
];

export function SelectAddressModal({
  isOpen,
  onClose,
  onSelect,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: AddressData) => void;
  onAdd: () => void;
}) {
  const defaultId =
    SAMPLE_ADDRESSES.find((a) => a.isDefault)?.id ?? SAMPLE_ADDRESSES[0].id;
  const [selected, setSelected] = useState(defaultId);
  const [setAsDefault, setSetAsDefault] = useState(true);

  useEffect(() => {
    if (isOpen) setSelected(defaultId);
  }, [isOpen, defaultId]);

  const handleSelect = (id: string) => {
    setSelected(id);
    const target = SAMPLE_ADDRESSES.find((a) => a.id === id);
    if (target) onSelect(target);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="lg"
      hideCloseButton
      classNames={{ base: "rounded-3xl" }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-6 border-b border-[var(--color-neutral-300)] h-[60px] px-4 py-0">
          <h2 className="flex-1 text-[20px] font-bold leading-[16.8px] text-[var(--color-neutral-900)]">
            ที่อยู่ของฉัน
          </h2>
          <CloseButton onClose={onClose} />
        </ModalHeader>
        <ModalBody className="px-0 py-4 max-h-[449px] overflow-y-auto gap-4">
          {SAMPLE_ADDRESSES.map((addr) => (
            <button
              key={addr.id}
              type="button"
              onClick={() => handleSelect(addr.id)}
              className="w-full pl-6 text-left"
            >
              <div className="flex items-center gap-6 pb-4 pr-4 border-b border-[var(--color-neutral-200)]">
                <RadioDot selected={selected === addr.id} />
                <div className="flex-1 min-w-0 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-[16px] font-semibold text-black">
                      {addr.name}
                    </span>
                    <span className="text-[16px] text-black">{addr.phone}</span>
                  </div>
                  <p className="text-[14px] text-black">{addr.detail}</p>
                  {addr.isDefault && (
                    <span className="inline-flex w-fit items-center px-3 py-1 rounded text-[10px] text-white bg-[#0088ff]">
                      ที่อยู่หลัก
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <span className="px-4 py-1 rounded border border-[var(--color-primary)] text-[12px] font-medium text-[var(--color-primary)] text-center whitespace-nowrap">
                    แก้ไข
                  </span>
                  <span className="px-4 py-1 rounded border border-[var(--color-critical)] text-[12px] font-medium text-[var(--color-critical)] text-center whitespace-nowrap">
                    ลบข้อมูล
                  </span>
                </div>
              </div>
            </button>
          ))}
        </ModalBody>
        <ModalFooter className="border-t border-[var(--color-neutral-300)] flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between w-full px-px">
            <span className="text-[14px] font-medium text-black">
              ตั้งเป็นที่อยู่หลัก
            </span>
            <Switch
              size="sm"
              isSelected={setAsDefault}
              onValueChange={setSetAsDefault}
              color="success"
            />
          </div>
          <Button
            onPress={onAdd}
            radius="sm"
            className="w-full h-10 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 transition"
          >
            เพิ่มที่อยู่ใหม่
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}


const selectClassNames = {
  trigger:
    "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] shadow-none",
  value:
    "text-[16px] text-[var(--color-neutral-900)] data-[has-value=false]:text-[var(--color-neutral-500)]",
};

function FieldLabel({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 flex-1 min-w-0">
      <span className="flex items-center gap-1 text-[14px] font-medium text-black">
        {label}
        {required && <span className="text-[#ff3b30]">*</span>}
      </span>
      {children}
    </label>
  );
}

const PROVINCES = ["กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ"];
const DISTRICTS = ["ราษฎร์บูรณะ", "บางขุนเทียน", "ทุ่งครุ", "บางบอน"];
const SUBDISTRICTS = ["ราษฎร์บูรณะ", "บางปะกอก"];
const POSTCODES = ["10140", "10150", "10160"];

export function AddAddressModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    province: string;
    district: string;
    subdistrict: string;
    postcode: string;
    line: string;
    isDefault: boolean;
  }) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [subdistrict, setSubdistrict] = useState("");
  const [postcode, setPostcode] = useState("");
  const [line, setLine] = useState("");
  const [isDefault, setIsDefault] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setFirstName("");
      setLastName("");
      setPhone("");
      setProvince("");
      setDistrict("");
      setSubdistrict("");
      setPostcode("");
      setLine("");
      setIsDefault(true);
    }
  }, [isOpen]);

  const valid =
    firstName.trim() &&
    lastName.trim() &&
    phone.trim() &&
    province &&
    district &&
    subdistrict &&
    postcode &&
    line.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="lg"
      hideCloseButton
      classNames={{ base: "rounded-3xl" }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-6 border-b border-[var(--color-neutral-300)] h-[60px] px-4 py-0">
          <h2 className="flex-1 text-[20px] font-bold leading-[16.8px] text-[var(--color-neutral-900)]">
            เพิ่มที่อยู่ใหม่
          </h2>
          <CloseButton onClose={onClose} />
        </ModalHeader>
        <ModalBody className="px-4 py-6 flex flex-col gap-4">
          <div className="flex gap-4">
            <FieldLabel label="ชื่อ" required>
              <Input
                value={firstName}
                onValueChange={setFirstName}
                placeholder="ระบุชื่อผู้รับ"
                radius="sm"
                classNames={inputClassNames}
              />
            </FieldLabel>
            <FieldLabel label="นามสกุล" required>
              <Input
                value={lastName}
                onValueChange={setLastName}
                placeholder="ระบุนามสกุล"
                radius="sm"
                classNames={inputClassNames}
              />
            </FieldLabel>
          </div>
          <FieldLabel label="เบอร์โทรศัพท์" required>
            <Input
              value={phone}
              onValueChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 10))}
              placeholder="ระบุหมายเลขโทรศัพท์"
              inputMode="tel"
              radius="sm"
              classNames={inputClassNames}
            />
          </FieldLabel>
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1 text-[14px] font-medium text-black">
              ที่อยู่การจัดส่ง<span className="text-[#ff3b30]">*</span>
            </span>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <Select
                  aria-label="จังหวัด"
                  placeholder="จังหวัด"
                  selectedKeys={province ? [province] : []}
                  onSelectionChange={(k) =>
                    setProvince(Array.from(k)[0] as string)
                  }
                  radius="sm"
                  classNames={selectClassNames}
                  className="flex-1"
                >
                  {PROVINCES.map((p) => (
                    <SelectItem key={p}>{p}</SelectItem>
                  ))}
                </Select>
                <Select
                  aria-label="เขต/อำเภอ"
                  placeholder="เขต/อำเภอ"
                  selectedKeys={district ? [district] : []}
                  onSelectionChange={(k) =>
                    setDistrict(Array.from(k)[0] as string)
                  }
                  radius="sm"
                  classNames={selectClassNames}
                  className="flex-1"
                >
                  {DISTRICTS.map((d) => (
                    <SelectItem key={d}>{d}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex gap-4">
                <Select
                  aria-label="แขวง/ตำบล"
                  placeholder="แขวง/ตำบล"
                  selectedKeys={subdistrict ? [subdistrict] : []}
                  onSelectionChange={(k) =>
                    setSubdistrict(Array.from(k)[0] as string)
                  }
                  radius="sm"
                  classNames={selectClassNames}
                  className="flex-1"
                >
                  {SUBDISTRICTS.map((s) => (
                    <SelectItem key={s}>{s}</SelectItem>
                  ))}
                </Select>
                <Select
                  aria-label="รหัสไปรษณีย์"
                  placeholder="รหัสไปรษณีย์"
                  selectedKeys={postcode ? [postcode] : []}
                  onSelectionChange={(k) =>
                    setPostcode(Array.from(k)[0] as string)
                  }
                  radius="sm"
                  classNames={selectClassNames}
                  className="flex-1"
                >
                  {POSTCODES.map((p) => (
                    <SelectItem key={p}>{p}</SelectItem>
                  ))}
                </Select>
              </div>
              <Input
                value={line}
                onValueChange={setLine}
                placeholder="บ้านเลขที่, หมู่, หอพัก, ซอย, ถนน"
                radius="sm"
                classNames={inputClassNames}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-[var(--color-neutral-300)] flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between w-full px-px">
            <span className="text-[14px] font-medium text-black">
              ตั้งเป็นที่อยู่หลัก
            </span>
            <Switch
              size="sm"
              isSelected={isDefault}
              onValueChange={setIsDefault}
              color="success"
            />
          </div>
          <Button
            radius="sm"
            isDisabled={!valid}
            onPress={() => {
              onSubmit({
                firstName,
                lastName,
                phone,
                province,
                district,
                subdistrict,
                postcode,
                line,
                isDefault,
              });
              onClose();
            }}
            className="w-full h-10 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 disabled:opacity-50 transition"
          >
            บันทึกที่อยู่ใหม่
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
