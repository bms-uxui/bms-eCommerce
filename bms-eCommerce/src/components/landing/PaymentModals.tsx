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
import { ShieldCheck, X } from "lucide-react";
import visaLogo from "../../assets/payments/visa.png";
import mcLogo from "../../assets/payments/mastercard.png";

function SecurityBanner({ subject }: { subject: string }) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl border border-[#cce7ff] p-3"
      style={{
        backgroundImage:
          "linear-gradient(178.46deg, var(--color-primary-100) 66.4%, rgba(33, 189, 255, 0.25) 202.6%)",
      }}
    >
      <ShieldCheck
        size={24}
        className="shrink-0 mt-0.5 text-[var(--color-primary)]"
      />
      <div className="flex flex-col gap-1">
        <p className="text-[16px] font-semibold leading-6 tracking-[-0.011em] text-[var(--color-primary)]">
          {subject}ของคุณถูกเก็บเป็นความลับ
        </p>
        <p className="text-[12px] leading-[18px] tracking-[-0.011em] text-[var(--color-neutral-500)]">
          ข้อมูล{subject}ของคุณจะถูกเก็บเป็นความลับ ตามนโยบายการรักษาความปลอดภัย ด้านข้อมูลส่วนบุคคล โดย Brightify
        </p>
      </div>
    </div>
  );
}

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

function BrandLogos() {
  return (
    <span className="flex items-center gap-2">
      <img src={visaLogo} alt="Visa" className="h-5 w-auto object-contain" />
      <img src={mcLogo} alt="Mastercard" className="h-5 w-auto object-contain" />
    </span>
  );
}

export type CardData = {
  number: string;
  expiry: string;
  cvv: string;
  holder: string;
  isDefault: boolean;
};

export function AddCardModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CardData) => void;
}) {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");
  const [isDefault, setIsDefault] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setNumber("");
      setExpiry("");
      setCvv("");
      setHolder("");
      setIsDefault(true);
    }
  }, [isOpen]);

  const handleNumber = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 16);
    setNumber(d.replace(/(\d{4})(?=\d)/g, "$1-"));
  };
  const handleExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    if (d.length <= 2) setExpiry(d);
    else setExpiry(`${d.slice(0, 2)}/${d.slice(2)}`);
  };

  const valid =
    number.replace(/\D/g, "").length === 16 &&
    expiry.length === 5 &&
    cvv.length >= 3 &&
    holder.trim().length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="md"
      hideCloseButton
      classNames={{
        base: "rounded-2xl",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between border-b border-[var(--color-neutral-300)]">
          <h2 className="text-[18px] font-bold text-[var(--color-neutral-900)]">
            เพิ่มบัตรใหม่
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
          <SecurityBanner subject="ข้อมูลบัตร" />

          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[var(--color-neutral-900)]">
              ข้อมูลบัตร
            </h3>
            <BrandLogos />
          </div>

          <FieldLabel label="หมายเลขบัตร">
            <Input
              value={number}
              onValueChange={handleNumber}
              placeholder="0000-0000-0000-0000"
              inputMode="numeric"
              radius="sm"
              classNames={inputClassNames}
            />
          </FieldLabel>

          <div className="grid grid-cols-2 gap-3">
            <FieldLabel label="วันหมดอายุ (ดด/ปป)">
              <Input
                value={expiry}
                onValueChange={handleExpiry}
                placeholder="00/00"
                inputMode="numeric"
                radius="sm"
                classNames={inputClassNames}
              />
            </FieldLabel>
            <FieldLabel label="CVV">
              <Input
                value={cvv}
                onValueChange={(v) => setCvv(v.replace(/\D/g, "").slice(0, 4))}
                placeholder="000"
                inputMode="numeric"
                type="password"
                radius="sm"
                classNames={inputClassNames}
              />
            </FieldLabel>
          </div>

          <FieldLabel label="ชื่อเจ้าของบัตร">
            <Input
              value={holder}
              onValueChange={setHolder}
              placeholder="กรุณาระบุ"
              radius="sm"
              classNames={inputClassNames}
            />
          </FieldLabel>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[14px] text-[var(--color-neutral-900)]">
              ตั้งเป็นค่าเริ่มต้น
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
              onSubmit({ number, expiry, cvv, holder, isDefault });
              onClose();
            }}
            className="w-full h-11 bg-[var(--color-primary)] text-white text-[15px] font-medium hover:brightness-110 disabled:opacity-50 transition"
          >
            เชื่อมต่อบัตร
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export type BankData = {
  holder: string;
  accountNumber: string;
  bank: string;
  isDefault: boolean;
};

const BANKS = [
  { key: "kbank", label: "ธนาคารกสิกรไทย (KBANK)" },
  { key: "scb", label: "ธนาคารไทยพาณิชย์ (SCB)" },
  { key: "ktb", label: "ธนาคารกรุงไทย (KTB)" },
  { key: "bbl", label: "ธนาคารกรุงเทพ (BBL)" },
  { key: "bay", label: "ธนาคารกรุงศรีอยุธยา (BAY)" },
  { key: "gsb", label: "ธนาคารออมสิน (GSB)" },
  { key: "ttb", label: "ธนาคารทีทีบี (TTB)" },
];

export function AddBankModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BankData) => void;
}) {
  const [holder, setHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bank, setBank] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setHolder("");
      setAccountNumber("");
      setBank("");
      setIsDefault(false);
    }
  }, [isOpen]);

  const valid =
    holder.trim().length > 0 &&
    accountNumber.replace(/\D/g, "").length >= 10 &&
    bank.length > 0;

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
            เพิ่มบัญชีใหม่
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
          <SecurityBanner subject="ข้อมูลบัญชี" />

          <h3 className="text-center text-[14px] font-semibold text-[var(--color-neutral-900)]">
            ข้อมูลบัญชีธนาคาร
          </h3>

          <FieldLabel label="ชื่อ-นามสกุล">
            <Input
              value={holder}
              onValueChange={setHolder}
              placeholder="กรุณาระบุ"
              radius="sm"
              classNames={inputClassNames}
            />
          </FieldLabel>

          <FieldLabel label="เลขบัญชี">
            <Input
              value={accountNumber}
              onValueChange={(v) =>
                setAccountNumber(v.replace(/\D/g, "").slice(0, 15))
              }
              placeholder="กรุณาระบุ"
              inputMode="numeric"
              radius="sm"
              classNames={inputClassNames}
            />
          </FieldLabel>

          <FieldLabel label="ชื่อธนาคาร">
            <Select
              selectedKeys={bank ? [bank] : []}
              onSelectionChange={(k) => setBank(Array.from(k)[0] as string)}
              placeholder="กรุณาเลือกธนาคาร"
              aria-label="ชื่อธนาคาร"
              radius="sm"
              classNames={{
                trigger:
                  "h-11 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] shadow-none",
                value:
                  "text-[14px] text-[var(--color-neutral-900)] data-[has-value=false]:text-[var(--color-neutral-500)]",
              }}
            >
              {BANKS.map((b) => (
                <SelectItem key={b.key}>{b.label}</SelectItem>
              ))}
            </Select>
          </FieldLabel>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[14px] text-[var(--color-neutral-900)]">
              ตั้งเป็นค่าเริ่มต้น
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
              onSubmit({ holder, accountNumber, bank, isDefault });
              onClose();
            }}
            className="w-full h-11 bg-[var(--color-primary)] text-white text-[15px] font-medium hover:brightness-110 disabled:opacity-50 transition"
          >
            เชื่อมต่อบัญชีธนาคาร
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

