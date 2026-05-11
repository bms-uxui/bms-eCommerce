import { useEffect, useState } from "react";
import {
  Input,
  Textarea,
  Button,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import AddProductModal, { type CatalogProduct } from "./AddProductModal";

export type QuoteProduct = {
  id: string;
  image: string;
  name: string;
  unitPrice: number;
  qty: number;
  minOrderQty?: number;
};

const baht = (n: number) =>
  `฿ ${n.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const inputClassNames = {
  inputWrapper:
    "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] shadow-none",
  input:
    "text-[16px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)]",
};

const selectClassNames = {
  trigger:
    "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] shadow-none",
  value:
    "text-[16px] text-[var(--color-neutral-900)] data-[has-value=false]:text-[var(--color-neutral-500)]",
};

function FieldLabel({
  label,
  required,
  optional,
  children,
}: {
  label: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[14px] font-medium text-black">
        {label}
        {required && <span className="text-[#f64669]"> *</span>}
        {optional && (
          <span className="text-[var(--color-neutral-500)]"> (ไม่บังคับ)</span>
        )}
      </span>
      {children}
    </label>
  );
}

const PROVINCES = ["กรุงเทพมหานคร", "เชียงใหม่", "ภูเก็ต", "ขอนแก่น"];
const DISTRICTS = ["จตุจักร", "บางรัก", "ปทุมวัน", "ลาดพร้าว"];
const SUBDISTRICTS = ["จอมพล", "ลาดยาว", "เสนานิคม"];
const POSTCODES = ["10900", "10110", "10330", "10400"];

function ProductRow({
  item,
  onQtyChange,
  onRemove,
}: {
  item: QuoteProduct;
  onQtyChange: (n: number) => void;
  onRemove: () => void;
}) {
  const min = item.minOrderQty ?? 1;
  return (
    <div className="bg-white border border-[var(--color-neutral-200)] rounded-lg flex items-center gap-3 pl-2 pr-3 py-2">
      <img
        src={item.image}
        alt=""
        className="w-16 h-16 rounded shrink-0 object-cover"
      />
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
        <p className="text-[12px] font-medium text-black truncate">
          {item.name}
        </p>
        <p className="text-[14px] font-semibold text-[var(--color-primary)]">
          {baht(item.unitPrice)} x{item.qty} = {baht(item.unitPrice * item.qty)}
        </p>
        <p className="text-[12px] text-[var(--color-neutral-900)]">
          จำนวน {item.minOrderQty ?? 1} ชิ้น
        </p>
      </div>
      <div className="bg-[var(--color-neutral-200)] rounded-lg flex items-center gap-4 pl-4 pr-1 py-1 shrink-0">
        <span className="text-[14px] text-black tabular-nums w-4 text-center">
          {item.qty}
        </span>
        <div className="h-8 flex">
          <button
            type="button"
            onClick={() => onQtyChange(Math.max(min, item.qty - 1))}
            className="w-[46px] h-8 bg-white rounded-l border-r border-[var(--color-neutral-200)] flex items-center justify-center text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)] transition"
            aria-label="ลด"
          >
            <Minus size={14} />
          </button>
          <button
            type="button"
            onClick={() => onQtyChange(item.qty + 1)}
            className="w-[46px] h-8 bg-white rounded-r flex items-center justify-center text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)] transition"
            aria-label="เพิ่ม"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label="ลบสินค้า"
        className="shrink-0 text-[var(--color-neutral-700)] hover:text-[var(--color-critical)] transition"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}

export default function QuoteRequestModal({
  isOpen,
  onClose,
  initialProducts,
  catalog = [],
  discountPercent = 10,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialProducts: QuoteProduct[];
  catalog?: CatalogProduct[];
  discountPercent?: number;
  onSubmit?: (data: {
    products: QuoteProduct[];
    customer: {
      firstName: string;
      lastName: string;
      position: string;
      email: string;
      phone: string;
      organization: string;
    };
    address: {
      province: string;
      district: string;
      subdistrict: string;
      postcode: string;
      line: string;
    };
    note: string;
  }) => void;
}) {
  const [products, setProducts] = useState<QuoteProduct[]>(initialProducts);
  const [addOpen, setAddOpen] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [subdistrict, setSubdistrict] = useState("");
  const [postcode, setPostcode] = useState("");
  const [line, setLine] = useState("");

  const [note, setNote] = useState("");

  useEffect(() => {
    if (isOpen) setProducts(initialProducts);
  }, [isOpen, initialProducts]);

  const subtotal = products.reduce((s, p) => s + p.unitPrice * p.qty, 0);
  const discount = (subtotal * discountPercent) / 100;
  const total = subtotal - discount;

  const valid =
    products.length > 0 &&
    firstName.trim() &&
    lastName.trim() &&
    position.trim() &&
    email.trim() &&
    phone.trim() &&
    organization.trim();

  const updateQty = (id: string, qty: number) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));

  const removeProduct = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

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
        <ModalHeader className="flex items-center justify-between gap-4 border-b border-[var(--color-neutral-300)] p-6">
          <h2 className="text-[20px] font-semibold leading-4 text-[var(--color-neutral-900)]">
            ขอใบเสนอราคา
          </h2>
          <button
            type="button"
            aria-label="ปิด"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[var(--color-neutral-200)] flex items-center justify-center text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-300)] transition"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </ModalHeader>

        <ModalBody className="p-6 max-h-[600px] overflow-y-auto flex flex-col gap-6">
          {/* Products */}
          <section className="border-b border-[var(--color-neutral-200)] pb-6 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <h3 className="flex-1 text-[18px] font-medium text-black">
                ข้อมูลสินค้า
              </h3>
              <Button
                onPress={() => setAddOpen(true)}
                radius="sm"
                startContent={<Plus size={20} />}
                className="h-10 px-4 py-2 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 transition"
              >
                เพิ่มสินค้า
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              {products.map((p) => (
                <ProductRow
                  key={p.id}
                  item={p}
                  onQtyChange={(q) => updateQty(p.id, q)}
                  onRemove={() => removeProduct(p.id)}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4 text-[16px]">
              <div className="flex items-center gap-2.5">
                <span className="flex-1 text-black">ราคาสินค้ารวมที่เสนอ</span>
                <span className="font-medium text-[var(--color-neutral-900)] text-right">
                  {baht(subtotal)}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex-1 text-[var(--color-neutral-900)]">
                  ส่วนลด {discountPercent} %
                </span>
                <span className="text-[var(--color-critical)] text-right">
                  - {baht(discount)}
                </span>
              </div>
              <div className="flex items-center gap-2.5 font-semibold">
                <span className="flex-1 text-black">ยอดรวม</span>
                <span className="text-[var(--color-primary)] text-right">
                  {baht(total)}
                </span>
              </div>
            </div>
          </section>

          {/* Customer info */}
          <section className="border-b border-[var(--color-neutral-200)] pb-6 flex flex-col gap-6">
            <p className="text-[18px] font-medium text-black">
              ข้อมูลลูกค้าผู้ติดต่อ{" "}
              <span className="text-[var(--color-neutral-500)]">
                (Defaultจากข้อมูลที่มี หรือข้อมูลที่เคยกรอก)
              </span>
            </p>
            <div className="grid grid-cols-2 gap-4">
              <FieldLabel label="ชื่อ" required>
                <Input
                  value={firstName}
                  onValueChange={setFirstName}
                  placeholder="ระบุชื่อ"
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
              <FieldLabel label="ชื่อหน่วยงาน/โรงพยาบาลที่สังกัด" required>
                <Input
                  value={organization}
                  onValueChange={setOrganization}
                  placeholder="ระบุข้อมูล"
                  radius="sm"
                  classNames={inputClassNames}
                />
              </FieldLabel>
              <FieldLabel label="ตำแหน่ง" required>
                <Input
                  value={position}
                  onValueChange={setPosition}
                  placeholder="ระบุตำแหน่ง"
                  radius="sm"
                  classNames={inputClassNames}
                />
              </FieldLabel>
              <FieldLabel label="เบอร์โทรศัพท์" required>
                <Input
                  value={phone}
                  onValueChange={(v) =>
                    setPhone(v.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="ระบุเบอร์โทรศัพท์"
                  inputMode="tel"
                  radius="sm"
                  classNames={inputClassNames}
                />
              </FieldLabel>
              <FieldLabel label="อีเมล" required>
                <Input
                  value={email}
                  onValueChange={setEmail}
                  placeholder="ระบุอีเมล"
                  type="email"
                  radius="sm"
                  classNames={inputClassNames}
                />
              </FieldLabel>
            </div>
          </section>

          {/* Address */}
          <section className="border-b border-[var(--color-neutral-200)] pb-6 flex flex-col gap-6">
            <p className="text-[18px] font-medium text-black">
              ข้อมูลที่อยู่สำหรับจัดส่ง{" "}
              <span className="text-[var(--color-neutral-500)]">(ไม่บังคับ)</span>
            </p>
            <div className="grid grid-cols-2 gap-4">
              <FieldLabel label="จังหวัด">
                <Select
                  aria-label="จังหวัด"
                  placeholder="กรุณาเลือก"
                  selectedKeys={province ? [province] : []}
                  onSelectionChange={(k) =>
                    setProvince(Array.from(k)[0] as string)
                  }
                  radius="sm"
                  classNames={selectClassNames}
                >
                  {PROVINCES.map((p) => (
                    <SelectItem key={p}>{p}</SelectItem>
                  ))}
                </Select>
              </FieldLabel>
              <FieldLabel label="เขต/อำเภอ">
                <Select
                  aria-label="เขต/อำเภอ"
                  placeholder="กรุณาเลือก"
                  selectedKeys={district ? [district] : []}
                  onSelectionChange={(k) =>
                    setDistrict(Array.from(k)[0] as string)
                  }
                  radius="sm"
                  classNames={selectClassNames}
                >
                  {DISTRICTS.map((d) => (
                    <SelectItem key={d}>{d}</SelectItem>
                  ))}
                </Select>
              </FieldLabel>
              <FieldLabel label="แขวง/ตำบล">
                <Select
                  aria-label="แขวง/ตำบล"
                  placeholder="กรุณาเลือก"
                  selectedKeys={subdistrict ? [subdistrict] : []}
                  onSelectionChange={(k) =>
                    setSubdistrict(Array.from(k)[0] as string)
                  }
                  radius="sm"
                  classNames={selectClassNames}
                >
                  {SUBDISTRICTS.map((s) => (
                    <SelectItem key={s}>{s}</SelectItem>
                  ))}
                </Select>
              </FieldLabel>
              <FieldLabel label="รหัสไปรษณีย์">
                <Select
                  aria-label="รหัสไปรษณีย์"
                  placeholder="กรุณาเลือก"
                  selectedKeys={postcode ? [postcode] : []}
                  onSelectionChange={(k) =>
                    setPostcode(Array.from(k)[0] as string)
                  }
                  radius="sm"
                  classNames={selectClassNames}
                >
                  {POSTCODES.map((p) => (
                    <SelectItem key={p}>{p}</SelectItem>
                  ))}
                </Select>
              </FieldLabel>
              <div className="col-span-2">
                <FieldLabel label="บ้านเลขที่, หมู่, หอพัก, ซอย, ถนน">
                  <Input
                    value={line}
                    onValueChange={setLine}
                    placeholder="ระบุข้อมูล"
                    radius="sm"
                    classNames={inputClassNames}
                  />
                </FieldLabel>
              </div>
            </div>
          </section>

          {/* Note */}
          <section className="pb-6">
            <Textarea
              value={note}
              onValueChange={setNote}
              placeholder="ข้อความเพิ่มเติม (ถ้ามี)"
              radius="sm"
              minRows={3}
              classNames={{
                inputWrapper:
                  "bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] shadow-none",
                input:
                  "text-[16px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)]",
              }}
            />
          </section>
        </ModalBody>

        <ModalFooter className="border-t border-[var(--color-neutral-300)] flex gap-4 justify-end p-6">
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
              if (!valid) return;
              onSubmit?.({
                products,
                customer: {
                  firstName,
                  lastName,
                  position,
                  email,
                  phone,
                  organization,
                },
                address: {
                  province,
                  district,
                  subdistrict,
                  postcode,
                  line,
                },
                note,
              });
              onClose();
            }}
            radius="sm"
            isDisabled={!valid}
            className="w-[150px] h-10 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 disabled:opacity-50 transition"
          >
            ส่ง
          </Button>
        </ModalFooter>
      </ModalContent>

      <AddProductModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        catalog={catalog}
        excludeIds={products.map((p) => p.id)}
        onConfirm={(added) =>
          setProducts((prev) => [...prev, ...added])
        }
      />
    </Modal>
  );
}
