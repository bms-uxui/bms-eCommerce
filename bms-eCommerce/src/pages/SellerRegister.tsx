import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Input, Textarea, Select, SelectItem } from "@heroui/react";
import Icon from "../components/landing/Icon";
import LanguageSelect from "../components/LanguageSelect";
import NotificationBell from "../components/NotificationBell";
import HelpSelect from "../components/HelpSelect";
import GuestProfile from "../components/GuestProfile";
import SellerProfile from "../components/SellerProfile";
import BirthdayPicker, { type BirthdayValue } from "../components/BirthdayPicker";
import cidExam from "../assets/cid-exam.png";
import docExam from "../assets/doc-exam.png";

function BrightifyLogo({ size = 36 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center shrink-0 rounded-lg shadow-[0_2px_4px_rgba(4,133,247,0.3)]"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #21bdff 0%, #0485f7 50%, #036ac6 100%)",
      }}
    >
      <span className="font-extrabold text-white leading-none" style={{ fontSize: size * 0.62 }}>
        B
      </span>
    </div>
  );
}

const PRODUCT_CATEGORIES = [
  { key: "fashion", label: "แฟชั่น" },
  { key: "beauty", label: "ความงามและสุขภาพ" },
  { key: "medical", label: "สินค้าทางการแพทย์" },
  { key: "electronics", label: "อุปกรณ์อิเล็กทรอนิกส์" },
  { key: "home", label: "บ้านและสวน" },
  { key: "food", label: "อาหารและเครื่องดื่ม" },
  { key: "other", label: "อื่นๆ" },
];

type BusinessType = "individual" | "legal";
type OperationType = "private" | "hospital" | "government";

type Step1Data = {
  shopName: string;
  shopDesc: string;
  category: string;
  phone: string;
  phoneOtp: string;
  email: string;
  emailOtp: string;
  warehouseAddress: string;
};

type Step2Data = {
  businessType: BusinessType;
  // individual / common
  ownerFirstName: string;
  ownerLastName: string;
  idNumber: string;
  birthday: string;
  idAddress: string;
  idCardFile: File | null;
  // legal extras
  operationType: OperationType | "";
  companyCertFile: File | null;
  companyName: string;
  companyRegNumber: string;
  companyAddress: string;
  // legal — board members (using same fields above; design shows one entry)
};

const ID_CARD_SAMPLE = cidExam;

const COMPANY_CERT_SAMPLE = docExam;

function StepIndicator({ current }: { current: 1 | 2 }) {
  const dot = (n: 1 | 2, active: boolean, filled: boolean) => (
    <div
      className={`flex items-center justify-center w-6 h-6 rounded-full border-2 text-[12px] font-bold ${
        filled
          ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
          : active
          ? "bg-white text-[var(--color-primary)] border-[var(--color-primary)]"
          : "bg-white text-[var(--color-neutral-500)] border-[#a8b9ca]"
      }`}
    >
      {n}
    </div>
  );

  return (
    <aside className="login-card-in bg-white rounded-2xl shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] p-6 flex gap-4 self-start sticky top-[96px]">
      <div className="flex flex-col items-center pt-1">
        {dot(1, current === 1, current === 2)}
        <span
          className={`w-px flex-1 min-h-[40px] transition-colors ${
            current === 2 ? "bg-[var(--color-primary)]" : "bg-[#a8b9ca]"
          }`}
        />
        {dot(2, current === 2, false)}
      </div>
      <div className="flex flex-col gap-[50px] text-[16px]">
        <p
          className={`font-semibold ${
            current === 1
              ? "text-[var(--color-primary-900,#011b31)]"
              : "text-[var(--color-primary)]"
          }`}
        >
          ข้อมูลร้านค้า
        </p>
        <p
          className={`${
            current === 2
              ? "font-semibold text-[var(--color-neutral-900)]"
              : "text-[var(--color-neutral-600,#5d6c87)]"
          }`}
        >
          ข้อมูลธุรกิจ
        </p>
      </div>
    </aside>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-[14px] font-medium text-black flex items-center">
      {children}
      {required && <span className="text-[#f64669] ml-1">*</span>}
    </label>
  );
}

function inputClasses() {
  return {
    inputWrapper:
      "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:bg-white data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-[var(--color-primary)]/20 shadow-none rounded-lg",
    input:
      "text-[16px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)]",
  };
}

function UploadArea({
  file,
  onFile,
  hint,
  acceptPdf = false,
}: {
  file: File | null;
  onFile: (f: File | null) => void;
  hint: string;
  acceptPdf?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOver, setIsOver] = useState(false);

  const handleFile = (f: File | null) => {
    if (!f) return onFile(null);
    if (f.size > 5 * 1024 * 1024) {
      alert("ไฟล์ต้องมีขนาดไม่เกิน 5 MB");
      return;
    }
    onFile(f);
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        handleFile(e.dataTransfer.files?.[0] ?? null);
      }}
      className={`flex-1 min-w-0 rounded-xl border border-dashed px-16 py-8 flex flex-col items-center gap-4 transition-colors ${
        isOver
          ? "border-[var(--color-primary)] bg-[var(--color-primary-50,#f7fcfe)]"
          : "border-[#a8b9ca] bg-white"
      }`}
    >
      <Icon name="upload" size={48} className="text-[var(--color-neutral-900)]" />
      {file ? (
        <p className="text-[14px] text-[var(--color-neutral-900)] text-center break-all">
          {file.name}
        </p>
      ) : (
        <p className="text-[14px] text-center text-[var(--color-neutral-900)] font-semibold leading-[1.5]">
          ลากและวาง
          <br />
          <span className="font-semibold">หรือ </span>
          <span className="text-[var(--color-primary)]">อัปโหลดรูป</span>
          <span> จากไฟล์ในเครื่อง</span>
        </p>
      )}
      <p className="text-[12px] text-[var(--color-neutral-600,#5d6c87)] text-center">
        {hint}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={acceptPdf ? "image/jpeg,image/png,application/pdf" : "image/jpeg,image/png"}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </button>
  );
}

function UploadExample({
  title,
  imgSrc,
  rules,
  imgClassName,
}: {
  title: string;
  imgSrc: string;
  rules: string[];
  imgClassName?: string;
}) {
  const half = Math.ceil(rules.length / 2);
  return (
    <div className="w-[360px] shrink-0 self-stretch bg-[var(--color-primary-50,#f7fcfe)] rounded-xl p-3 flex flex-col items-center justify-between gap-3">
      <p className="text-[14px] text-center text-black w-full">{title}</p>
      <img
        src={imgSrc}
        alt=""
        className={`rounded-[7px] shadow-[0_16px_32px_rgba(29,33,45,0.1),0_1px_4px_rgba(29,33,45,0.15),0_0_1px_rgba(29,33,45,0.2)] ${
          imgClassName ?? "w-[140px] h-[91px] object-cover"
        }`}
      />
      <div className="flex w-full text-[12px] text-[var(--color-neutral-600,#5d6c87)] gap-3">
        <ul className="flex-1 list-disc list-inside leading-5">
          {rules.slice(0, half).map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <ul className="flex-1 list-disc list-inside leading-5">
          {rules.slice(half).map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SellerHeader() {
  const sellerLoggedIn =
    typeof window !== "undefined" && sessionStorage.getItem("sellerLoggedIn") === "1";
  return (
    <header className="relative z-10 bg-white border-b border-[var(--color-neutral-300)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-6 px-6 py-[18px]">
        <div className="flex items-center gap-6 min-w-0">
          <a href="/" className="flex items-center gap-2 shrink-0 h-9">
            <BrightifyLogo size={36} />
            <span className="text-[24px] font-medium text-[var(--color-primary)] leading-none">
              BRIGHTIFY
            </span>
          </a>
          <span className="hidden md:block w-px h-6 bg-[var(--color-neutral-300)]" />
          <p className="hidden md:flex items-center gap-2 text-[20px] font-semibold text-[var(--color-neutral-900)] truncate">
            <Icon name="shop" size={20} />
            สร้างร้านค้า
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelect />
          <HelpSelect />
          <span className="w-px h-[18px] bg-[var(--color-neutral-300)]" />
          <NotificationBell />
          {sellerLoggedIn ? <SellerProfile /> : <GuestProfile compact to="/seller/login" />}
        </div>
      </div>
    </header>
  );
}

function Step1Form({
  data,
  setData,
  onCancel,
  onNext,
}: {
  data: Step1Data;
  setData: (d: Step1Data) => void;
  onCancel: () => void;
  onNext: () => void;
}) {
  const required = data.shopName && data.category && data.phone && data.email && data.warehouseAddress;

  return (
    <section className="login-card-in bg-white rounded-2xl shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] p-8 w-full max-w-[800px] flex flex-col gap-8">
      <h2 className="text-[20px] font-bold text-black">ข้อมูลร้านค้า</h2>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel required>ตั้งชื่อร้านค้า</FieldLabel>
        <Input
          aria-label="ชื่อร้านค้า"
          placeholder="ระบุชื่อร้านค้า"
          value={data.shopName}
          onValueChange={(v) => setData({ ...data, shopName: v })}
          radius="sm"
          classNames={inputClasses()}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>คำอธิบายรายละเอียดร้านค้า</FieldLabel>
        <Input
          aria-label="คำอธิบายร้านค้า"
          placeholder="ระบุรายละเอียดร้านค้า"
          value={data.shopDesc}
          onValueChange={(v) => setData({ ...data, shopDesc: v })}
          radius="sm"
          classNames={inputClasses()}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel required>หมวดหมู่สินค้าที่จะขาย</FieldLabel>
        <Select
          aria-label="หมวดหมู่สินค้า"
          placeholder="เลือกหมวดหมู่สินค้า"
          selectedKeys={data.category ? [data.category] : []}
          onSelectionChange={(keys) => {
            const k = Array.from(keys)[0];
            setData({ ...data, category: typeof k === "string" ? k : "" });
          }}
          radius="sm"
          classNames={{
            trigger:
              "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:bg-white data-[hover=true]:border-[var(--color-primary-400)] data-[open=true]:border-[var(--color-primary)] data-[open=true]:ring-2 data-[open=true]:ring-[var(--color-primary)]/20 shadow-none rounded-lg",
            value: "text-[16px] text-[var(--color-neutral-900)]",
          }}
        >
          {PRODUCT_CATEGORIES.map((c) => (
            <SelectItem key={c.key}>{c.label}</SelectItem>
          ))}
        </Select>
      </div>

      <div className="flex gap-4 w-full">
        <div className="flex-1 flex flex-col gap-2">
          <FieldLabel required>เบอร์โทรศัพท์</FieldLabel>
          <Input
            aria-label="เบอร์โทรศัพท์"
            placeholder="ระบุเบอร์โทรศัพท์"
            value={data.phone}
            onValueChange={(v) => setData({ ...data, phone: v.replace(/\D/g, "").slice(0, 10) })}
            radius="sm"
            inputMode="numeric"
            classNames={inputClasses()}
            endContent={
              <button
                type="button"
                className="text-[16px] text-[var(--color-primary)] font-medium hover:underline whitespace-nowrap"
              >
                ส่งรหัส
              </button>
            }
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <FieldLabel>ยืนยัน OTP</FieldLabel>
          <Input
            aria-label="OTP เบอร์โทรศัพท์"
            placeholder="ระบุรหัส OTP"
            value={data.phoneOtp}
            onValueChange={(v) => setData({ ...data, phoneOtp: v.replace(/\D/g, "").slice(0, 6) })}
            radius="sm"
            inputMode="numeric"
            classNames={inputClasses()}
            endContent={
              <button
                type="button"
                className="text-[16px] text-[var(--color-primary)] font-medium hover:underline whitespace-nowrap"
              >
                ยืนยัน
              </button>
            }
          />
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <div className="flex-1 flex flex-col gap-2">
          <FieldLabel required>อีเมล</FieldLabel>
          <Input
            aria-label="อีเมล"
            placeholder="ระบุอีเมล"
            value={data.email}
            onValueChange={(v) => setData({ ...data, email: v })}
            radius="sm"
            type="email"
            classNames={inputClasses()}
            endContent={
              <button
                type="button"
                className="text-[16px] text-[var(--color-primary)] font-medium hover:underline whitespace-nowrap"
              >
                ส่งรหัส
              </button>
            }
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <FieldLabel>ยืนยัน OTP</FieldLabel>
          <Input
            aria-label="OTP อีเมล"
            placeholder="ระบุรหัส OTP"
            value={data.emailOtp}
            onValueChange={(v) => setData({ ...data, emailOtp: v.replace(/\D/g, "").slice(0, 6) })}
            radius="sm"
            inputMode="numeric"
            classNames={inputClasses()}
            endContent={
              <button
                type="button"
                className="text-[16px] text-[var(--color-primary)] font-medium hover:underline whitespace-nowrap"
              >
                ยืนยัน
              </button>
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel required>ที่อยู่คลังสินค้า</FieldLabel>
        <Input
          aria-label="ที่อยู่คลังสินค้า"
          placeholder="ระบุที่อยู่คลังสินค้า"
          value={data.warehouseAddress}
          onValueChange={(v) => setData({ ...data, warehouseAddress: v })}
          radius="sm"
          classNames={inputClasses()}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button
          radius="sm"
          variant="bordered"
          onPress={onCancel}
          className="h-10 w-[150px] bg-white border border-[#a8b9ca] text-[var(--color-neutral-900)] text-[16px] font-medium hover:bg-[var(--color-neutral-200)] transition"
        >
          ยกเลิก
        </Button>
        <Button
          radius="sm"
          onPress={onNext}
          isDisabled={!required}
          className="h-10 w-[150px] bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 disabled:opacity-60 transition"
        >
          ถัดไป
        </Button>
      </div>
    </section>
  );
}

function RadioCard({
  selected,
  label,
  onSelect,
}: {
  selected: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex-1 min-w-0 flex items-center gap-2 p-4 rounded-xl border transition-colors text-left ${
        selected
          ? "border-[var(--color-primary)]"
          : "border-[#a8b9ca] hover:border-[var(--color-primary-400)]"
      }`}
    >
      <span
        className={`w-4 h-4 rounded-full flex items-center justify-center border ${
          selected
            ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
            : "bg-white border-[#798aa3]"
        }`}
      >
        {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      <span
        className={`text-[16px] leading-6 ${
          selected ? "text-[var(--color-neutral-900)]" : "text-[var(--color-neutral-500)]"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function Step2Form({
  data,
  setData,
  onBack,
  onCancel,
  onSubmit,
}: {
  data: Step2Data;
  setData: (d: Step2Data) => void;
  onBack: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const isLegal = data.businessType === "legal";

  return (
    <section className="login-card-in bg-white rounded-2xl shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] p-8 w-full max-w-[800px] flex flex-col gap-8">
      <h2 className="text-[20px] font-bold text-black">ข้อมูลธุรกิจ</h2>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel required>เลือกประเภทธุรกิจ</FieldLabel>
        <div className="flex gap-4">
          <RadioCard
            selected={data.businessType === "individual"}
            label="บุคคลทั่วไป"
            onSelect={() => setData({ ...data, businessType: "individual" })}
          />
          <RadioCard
            selected={data.businessType === "legal"}
            label="นิติบุคคล"
            onSelect={() => setData({ ...data, businessType: "legal" })}
          />
        </div>
      </div>

      {isLegal && <h3 className="text-[20px] font-bold text-black">ข้อมูลบริษัท</h3>}

      {isLegal && (
        <div className="flex flex-col gap-2 w-full">
          <FieldLabel required>เลือกประเภทการดำเนินงาน</FieldLabel>
          <div className="flex gap-4">
            <RadioCard
              selected={data.operationType === "private"}
              label="บริษัทเอกชน"
              onSelect={() => setData({ ...data, operationType: "private" })}
            />
            <RadioCard
              selected={data.operationType === "hospital"}
              label="โรงพยาบาลและร้านยา"
              onSelect={() => setData({ ...data, operationType: "hospital" })}
            />
            <RadioCard
              selected={data.operationType === "government"}
              label="หน่วยงานภาครัฐ"
              onSelect={() => setData({ ...data, operationType: "government" })}
            />
          </div>
        </div>
      )}

      {isLegal && (
        <div className="flex flex-col gap-2 w-full">
          <FieldLabel>อัปโหลดรูปภาพใบรับรองการจดทะเบียนบริษัท</FieldLabel>
          <div className="flex gap-4 items-stretch">
            <UploadArea
              file={data.companyCertFile}
              onFile={(f) => setData({ ...data, companyCertFile: f })}
              hint="ไฟล์ JPG, JPEG, PNG หรือ PDF และขนาดไม่เกิน 5 MB"
              acceptPdf
            />
            <UploadExample
              title="ตัวอย่างเอกสารใบรับรองการจดทะเบียนบริษัท"
              imgSrc={COMPANY_CERT_SAMPLE}
              imgClassName="w-[162px] h-[91px] object-cover"
              rules={["ห้ามใช้ภาพสแกน", "ห้ามมีแสงสะท้อน", "ห้ามครอบรูปภาพ", "ไม่ฉีกขาดหรือบิดเบี้ยว"]}
            />
          </div>
        </div>
      )}

      {isLegal && (
        <div className="flex gap-4 w-full">
          <div className="flex-1 flex flex-col gap-2">
            <FieldLabel>ชื่อบริษัทที่จดทะเบียน</FieldLabel>
            <Input
              aria-label="ชื่อบริษัท"
              value={data.companyName}
              onValueChange={(v) => setData({ ...data, companyName: v })}
              radius="sm"
              classNames={inputClasses()}
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <FieldLabel>เลขจดทะเบียนบริษัท</FieldLabel>
            <Input
              aria-label="เลขจดทะเบียน"
              value={data.companyRegNumber}
              onValueChange={(v) => setData({ ...data, companyRegNumber: v })}
              radius="sm"
              classNames={inputClasses()}
            />
          </div>
        </div>
      )}

      {isLegal && (
        <div className="flex flex-col gap-2 w-full">
          <FieldLabel>ที่อยู่จดทะเบียนบริษัท</FieldLabel>
          <Input
            aria-label="ที่อยู่บริษัท"
            value={data.companyAddress}
            onValueChange={(v) => setData({ ...data, companyAddress: v })}
            radius="sm"
            classNames={inputClasses()}
          />
        </div>
      )}

      {isLegal && <h3 className="text-[20px] font-bold text-black">ข้อมูลคณะกรรมบริษัท</h3>}

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>อัปโหลดรูปภาพบัตรประชาชน</FieldLabel>
        <div className="flex gap-4 items-stretch">
          <UploadArea
            file={data.idCardFile}
            onFile={(f) => setData({ ...data, idCardFile: f })}
            hint="ไฟล์ JPG, JPEG หรือ PNG และขนาดไม่เกิน 5 MB"
          />
          <UploadExample
            title="ตัวอย่างด้านหน้าของบัตรประชาชน"
            imgSrc={ID_CARD_SAMPLE}
            rules={["ห้ามใช้ภาพสแกน", "ห้ามมีแสงสะท้อน", "ห้ามครอบรูปภาพ", "ไม่ใช้บัตรประชาชนที่หมดอายุ"]}
          />
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <div className="flex-1 flex flex-col gap-2">
          <FieldLabel>{isLegal ? "ชื่อคณะกรรมบริษัท" : "ชื่อเจ้าของธุรกิจ"}</FieldLabel>
          <Input
            aria-label="ชื่อ"
            value={data.ownerFirstName}
            onValueChange={(v) => setData({ ...data, ownerFirstName: v })}
            radius="sm"
            classNames={inputClasses()}
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <FieldLabel>{isLegal ? "นามสกุลคณะกรรมบริษัท" : "นามสกุลเจ้าธุรกิจ"}</FieldLabel>
          <Input
            aria-label="นามสกุล"
            value={data.ownerLastName}
            onValueChange={(v) => setData({ ...data, ownerLastName: v })}
            radius="sm"
            classNames={inputClasses()}
          />
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <div className="flex-1 flex flex-col gap-2">
          <FieldLabel>เลขบัตรประชาชน</FieldLabel>
          <Input
            aria-label="เลขบัตรประชาชน"
            value={data.idNumber}
            onValueChange={(v) => setData({ ...data, idNumber: v.replace(/\D/g, "").slice(0, 13) })}
            radius="sm"
            inputMode="numeric"
            classNames={inputClasses()}
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <FieldLabel>วันเกิด</FieldLabel>
          <BirthdayPicker
            value={(() => {
              if (!data.birthday) return null;
              const [y, m, d] = data.birthday.split("-").map(Number);
              if (!y || !m || !d) return null;
              return { day: d, month: m, year: y + 543 } as BirthdayValue;
            })()}
            onChange={(v) =>
              setData({
                ...data,
                birthday: `${v.year - 543}-${String(v.month).padStart(2, "0")}-${String(v.day).padStart(2, "0")}`,
              })
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>ที่อยู่ตามบัตรประชาชน</FieldLabel>
        <Input
          aria-label="ที่อยู่ตามบัตรประชาชน"
          value={data.idAddress}
          onValueChange={(v) => setData({ ...data, idAddress: v })}
          radius="sm"
          classNames={inputClasses()}
        />
      </div>

      <div className="flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={onBack}
          aria-label="ย้อนกลับ"
          className="w-10 h-10 rounded-lg bg-white border border-[#a8b9ca] flex items-center justify-center text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-200)] transition"
        >
          <Icon name="arrow-left" size={24} />
        </button>
        <div className="flex gap-4">
          <Button
            radius="sm"
            variant="bordered"
            onPress={onCancel}
            className="h-10 w-[150px] bg-white border border-[#a8b9ca] text-[var(--color-neutral-900)] text-[16px] font-medium hover:bg-[var(--color-neutral-200)] transition"
          >
            ยกเลิก
          </Button>
          <Button
            radius="sm"
            onPress={onSubmit}
            className="h-10 w-[150px] bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 transition"
          >
            ส่งแบบฟอร์ม
          </Button>
        </div>
      </div>
    </section>
  );
}

function SuccessView() {
  const navigate = useNavigate();
  return (
    <section className="login-card-in mx-auto w-full max-w-[1200px] bg-white rounded-3xl shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] py-[52px] px-8 flex flex-col items-center gap-[52px]">
      <div className="flex flex-col items-center gap-8">
        <div className="w-[81px] h-[81px] rounded-full bg-[#22a559] flex items-center justify-center shadow-[0_8px_24px_rgba(34,165,89,0.35)]">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-[24px] font-semibold text-[#317a06] leading-[16px]">
          ส่งแบบฟอร์มสำเร็จแล้ว
        </h2>
      </div>
      <p className="text-[18px] font-medium text-[var(--color-neutral-900)] text-center leading-[29px]">
        ขอบคุณสำหรับการสมัครสร้างร้านค้า (Seller) เราจะทำการตรวจสอบข้อมูลที่คุณส่งมา และแจ้งผลให้คุณทราบทางอีเมล
      </p>
      <div className="flex flex-col items-center gap-[18px] w-[412px] max-w-full">
        <Button
          radius="sm"
          onPress={() => navigate("/seller/overview")}
          className="h-10 px-4 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 transition"
        >
          ดูรายละเอียดเพิ่มเติม
        </Button>
        <p className="text-[14px] text-center">
          <span className="text-[var(--color-neutral-600,#5d6c87)]">
            หากคุณไม่ได้รับการตอบกลับภายใน 5 วัน กรุณา{" "}
          </span>
          <a className="text-[var(--color-primary)] hover:underline" href="#">
            ติดต่อเรา
          </a>
        </p>
      </div>
    </section>
  );
}

export default function SellerRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | "success">(1);
  const [step1, setStep1] = useState<Step1Data>({
    shopName: "",
    shopDesc: "",
    category: "",
    phone: "",
    phoneOtp: "",
    email: "",
    emailOtp: "",
    warehouseAddress: "",
  });
  const [step2, setStep2] = useState<Step2Data>({
    businessType: "individual",
    ownerFirstName: "",
    ownerLastName: "",
    idNumber: "",
    birthday: "",
    idAddress: "",
    idCardFile: null,
    operationType: "",
    companyCertFile: null,
    companyName: "",
    companyRegNumber: "",
    companyAddress: "",
  });

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(124.45deg, #b4e1ff 0%, #e9f8ff 24.89%, var(--color-primary-50, #f7fcfe) 52.19%, #e9f8ff 74.91%, #55c9ff 109.08%)",
      }}
    >
      <div
        aria-hidden
        className="login-bg-in pointer-events-none select-none absolute top-[104px] left-1/2 -translate-x-1/2 w-[913px] text-center font-extrabold tracking-tight text-white/60"
        style={{ fontSize: 280, lineHeight: "260px", textShadow: "0 2px 24px rgba(255,255,255,0.6)" }}
      >
        Seller
      </div>

      <SellerHeader />

      {step === "success" ? (
        <main className="relative z-10 min-h-[calc(100vh-72px)] flex items-center justify-center px-4 sm:px-6 py-8">
          <SuccessView />
        </main>
      ) : (
        <main className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            <StepIndicator current={step} />
            {step === 1 ? (
              <Step1Form
                data={step1}
                setData={setStep1}
                onCancel={() => navigate(-1)}
                onNext={() => setStep(2)}
              />
            ) : (
              <Step2Form
                data={step2}
                setData={setStep2}
                onBack={() => setStep(1)}
                onCancel={() => navigate(-1)}
                onSubmit={() => setStep("success")}
              />
            )}
          </div>
        </main>
      )}
    </div>
  );
}
