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
import { Plus, ShieldCheck, X } from "lucide-react";
import { inputClassNamesLg as inputClassNames } from "../inputStyles";
import visaLogo from "../../assets/payments/visa.png";
import mcLogo from "../../assets/payments/mastercard.png";
import kasikornLogo from "../../assets/payments/kasikorn.png";
import krungthaiLogo from "../../assets/payments/krungthai.png";

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

type SelectRow = {
  id: string;
  logo: string;
  name: string;
  detail: string;
  isDefault?: boolean;
};

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

function SelectListModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  subtitle,
  addLabel,
  onAdd,
  rows,
  logoVariant,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  title: string;
  subtitle: string;
  addLabel: string;
  onAdd: () => void;
  rows: SelectRow[];
  logoVariant: "card" | "bank";
}) {
  const defaultId = rows.find((r) => r.isDefault)?.id ?? rows[0]?.id ?? "";
  const [selected, setSelected] = useState(defaultId);

  useEffect(() => {
    if (isOpen) setSelected(defaultId);
  }, [isOpen, defaultId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="2xl"
      hideCloseButton
      classNames={{ base: "rounded-3xl" }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between gap-4 border-b border-[var(--color-neutral-300)] px-6 pt-6 pb-4">
          <div className="flex flex-col gap-2 min-w-0">
            <p className="text-[20px] font-semibold leading-4 text-[var(--color-primary-600)]">
              {title}
            </p>
            <p className="text-[14px] leading-4 text-[var(--color-neutral-500)]">
              {subtitle}
            </p>
          </div>
          <Button
            onPress={onAdd}
            radius="sm"
            className="shrink-0 w-[150px] h-10 px-4 py-2 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 transition gap-2"
            startContent={<Plus size={20} strokeWidth={2.5} />}
          >
            {addLabel}
          </Button>
        </ModalHeader>
        <ModalBody className="px-6 py-6 max-h-[400px] overflow-y-auto">
          <div className="flex flex-col gap-6">
            {rows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setSelected(row.id)}
                className="flex items-center gap-4 pb-6 border-b border-[var(--color-neutral-200)] last:border-b-0 last:pb-0 text-left"
              >
                <RadioDot selected={selected === row.id} />
                <div className="flex items-center gap-2 w-[240px] shrink-0">
                  {logoVariant === "card" ? (
                    <span className="w-10 h-10 rounded-lg border border-[var(--color-neutral-300)] bg-white flex items-center justify-center">
                      <img src={row.logo} alt="" className="max-w-[34px] max-h-[20px] object-contain" />
                    </span>
                  ) : (
                    <img src={row.logo} alt="" className="w-10 h-10 rounded-lg object-contain shrink-0 bg-white" />
                  )}
                  <span className="text-[16px] font-semibold text-black whitespace-nowrap">
                    {row.name}
                  </span>
                  {row.isDefault && (
                    <span className="px-3 py-1 rounded text-[10px] text-white bg-[#0088ff]">
                      ค่าเริ่มต้น
                    </span>
                  )}
                </div>
                <span className="flex-1 text-[16px] text-black text-center tabular-nums">
                  {row.detail}
                </span>
                <span
                  role="button"
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-1 rounded border border-[var(--color-critical)] text-[12px] font-medium text-[var(--color-critical)] text-center whitespace-nowrap cursor-pointer hover:bg-[var(--color-critical)]/5 transition"
                >
                  ลบข้อมูล
                </span>
              </button>
            ))}
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-[var(--color-neutral-300)] px-6 pt-6 pb-4 gap-4">
          <Button
            onPress={onClose}
            radius="sm"
            variant="bordered"
            className="w-[150px] h-10 border border-[var(--color-neutral-400)] text-[var(--color-neutral-900)] text-[16px] font-medium bg-white"
          >
            ยกเลิก
          </Button>
          <Button
            onPress={() => {
              onConfirm(selected);
              onClose();
            }}
            radius="sm"
            className="w-[150px] h-10 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 transition"
          >
            ยืนยัน
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const SAMPLE_CARDS: SelectRow[] = [
  { id: "visa-1053", logo: visaLogo, name: "Credit Card", detail: "**** **** **** 1053", isDefault: true },
  { id: "mc-4522", logo: mcLogo, name: "Master Card", detail: "**** **** **** 4522" },
];

const SAMPLE_BANKS: SelectRow[] = [
  { id: "kbank-08", logo: kasikornLogo, name: "ธนาคารกสิกรไทย", detail: "96* **** *08", isDefault: true },
  { id: "ktb-22", logo: krungthaiLogo, name: "ธนาคารกรุงไทย", detail: "12* **** *22" },
];

export function SelectCardModal({
  isOpen,
  onClose,
  onConfirm,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <SelectListModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      onAdd={onAdd}
      title="บัตรเครดิต / บัตรเดบิต ของฉัน"
      subtitle="บัตรจะแสดงให้เลือกตอนที่คุณจำดำเนินการ ชำระเงินหรือผ่อนสินค้า เท่านั้น"
      addLabel="เพิ่มบัตรใหม่"
      rows={SAMPLE_CARDS}
      logoVariant="card"
    />
  );
}

export function SelectBankModal({
  isOpen,
  onClose,
  onConfirm,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <SelectListModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      onAdd={onAdd}
      title="บัญชีธนาคารของฉัน"
      subtitle="บัญชีธนาคารจะแสดงให้เลือกตอนที่คุณจำดำเนินการ ชำระเงินสินค้า เท่านั้น"
      addLabel="เพิ่มบัญชีใหม่"
      rows={SAMPLE_BANKS}
      logoVariant="bank"
    />
  );
}

