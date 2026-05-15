import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Reorder, useDragControls } from "framer-motion";
import { Switch, Select, SelectItem } from "@heroui/react";
import {
  ChevronLeft,
  ImagePlus,
  Info,
  Minus,
  Plus,
  Trash2,
  Upload,
  GripVertical,
} from "lucide-react";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";

const CARD =
  "bg-white rounded-xl shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)]";

const STEPS = [
  { n: 1, label: "รูปภาพสินค้า", anchor: "sec-images" },
  { n: 2, label: "ข้อมูลสินค้า", anchor: "sec-info" },
  { n: 3, label: "ข้อมูลการขาย", anchor: "sec-sales" },
  { n: 4, label: "ตั้งค่าสินค้า", anchor: "sec-settings" },
];

let _id = 0;
const uid = () => `v${++_id}`;

type OptionGroup = { id: string; name: string; options: { id: string; label: string }[] };

const inputCls =
  "h-10 rounded-lg border border-[var(--color-neutral-300)] px-3 text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary)] w-full";
const selectClassNames = {
  trigger:
    "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] shadow-none rounded-lg",
  value:
    "text-[14px] text-[var(--color-neutral-900)] data-[has-value=false]:text-[var(--color-neutral-500)]",
};

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="text-[14px] text-[var(--color-neutral-700)]">
      {children}
      {required && <span className="text-[var(--color-critical)]"> *</span>}
    </span>
  );
}

function NumberStepper({ initial = 0 }: { initial?: number }) {
  const [v, setV] = useState(initial);
  return (
    <div className="flex items-center h-10 rounded-lg border border-[var(--color-neutral-300)] overflow-hidden">
      <input
        type="text"
        value={v}
        onChange={(e) => setV(Number(e.target.value.replace(/\D/g, "")) || 0)}
        className="flex-1 min-w-0 h-full px-3 text-[14px] text-[var(--color-neutral-900)] focus:outline-none tabular-nums"
      />
      <button type="button" onClick={() => setV((n) => Math.max(0, n - 1))} className="w-9 h-full border-l border-[var(--color-neutral-300)] flex items-center justify-center text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]" aria-label="ลด"><Minus size={14} /></button>
      <button type="button" onClick={() => setV((n) => n + 1)} className="w-9 h-full border-l border-[var(--color-neutral-300)] flex items-center justify-center text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]" aria-label="เพิ่ม"><Plus size={14} /></button>
    </div>
  );
}

function ImageSlot({ label }: { label: string }) {
  const [name, setName] = useState<string | null>(null);
  return (
    <label className="flex-1 min-w-0 aspect-square rounded-lg border-2 border-dashed border-[var(--color-neutral-300)] flex flex-col items-center justify-center gap-1.5 text-[var(--color-neutral-500)] cursor-pointer hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-100)]/30 transition px-2 text-center">
      <ImagePlus size={24} />
      <span className="text-[12px] truncate max-w-full">{name ?? label}</span>
      <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setName(f.name); }} />
    </label>
  );
}

function VariantImageSlot() {
  const [url, setUrl] = useState<string | null>(null);
  if (url) {
    return (
      <div className="relative w-10 h-10 group">
        <img src={url} alt="" className="w-10 h-10 rounded object-cover border border-[var(--color-neutral-200)]" />
        <button
          type="button"
          onClick={() => setUrl((u) => { if (u) URL.revokeObjectURL(u); return null; })}
          aria-label="ลบรูปภาพ"
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[var(--color-critical)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
          <Trash2 size={9} />
        </button>
        <label className="absolute inset-0 cursor-pointer">
          <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setUrl((u) => { if (u) URL.revokeObjectURL(u); return URL.createObjectURL(f); }); } e.target.value = ""; }} />
        </label>
      </div>
    );
  }
  return (
    <label className="w-10 h-10 rounded border border-dashed border-[var(--color-neutral-300)] flex items-center justify-center text-[var(--color-neutral-500)] cursor-pointer hover:border-[var(--color-primary)]">
      <Upload size={14} />
      <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setUrl(URL.createObjectURL(f)); e.target.value = ""; }} />
    </label>
  );
}

function VariantTable({ groups }: { groups: OptionGroup[] }) {
  // Cartesian product of the non-empty option labels of each group.
  const combos = useMemo(() => {
    const lists = groups.map((g) => g.options.map((o) => o.label.trim()).filter(Boolean));
    if (lists.length === 0 || lists.some((l) => l.length === 0)) return [] as string[][];
    return lists.reduce<string[][]>((acc, list) => acc.flatMap((c) => list.map((v) => [...c, v])), [[]]);
  }, [groups]);

  const n = Math.max(groups.length, 1);
  const gridStyle = { gridTemplateColumns: `64px ${"minmax(120px,1.2fr) ".repeat(n)}1.1fr 1fr 1fr 40px` };

  return (
    <div className="mt-2">
      <p className="text-[14px] font-medium text-[var(--color-neutral-900)] mb-2">รายการตัวเลือกสินค้า</p>
      <div className="rounded-lg border border-[var(--color-neutral-200)] overflow-x-auto">
        <div style={gridStyle} className="grid bg-[var(--color-primary-100)]/60 text-[12px] font-medium text-[var(--color-neutral-600)] min-w-max">
          <div className="px-2 py-2">รูปภาพ</div>
          {Array.from({ length: n }).map((_, i) => (
            <div key={i} className="px-2 py-2">ชื่อตัวเลือกสินค้า/{i + 1}</div>
          ))}
          <div className="px-2 py-2">ราคาสินค้า (฿) *</div>
          <div className="px-2 py-2">สต็อกสินค้า *</div>
          <div className="px-2 py-2">น้ำหนักสินค้า *</div>
          <div />
        </div>
        {(combos.length ? combos : [[] as string[]]).map((combo, ri) => (
          <div key={ri} style={gridStyle} className="grid items-center border-t border-[var(--color-neutral-200)] min-w-max">
            <div className="px-2 py-2"><VariantImageSlot /></div>
            {Array.from({ length: n }).map((_, i) => (
              <div key={i} className="px-2 py-2"><input type="text" defaultValue={combo[i] ?? ""} className={inputCls} /></div>
            ))}
            <div className="px-2 py-2"><input type="text" placeholder="0" className={inputCls} /></div>
            <div className="px-2 py-2"><input type="text" placeholder="0" className={inputCls} /></div>
            <div className="px-2 py-2"><input type="text" placeholder="0" className={inputCls} /></div>
            <div className="px-2 py-2 flex justify-center"><button type="button" className="text-[var(--color-neutral-500)] hover:text-[var(--color-critical)]" aria-label="ลบ"><Trash2 size={16} /></button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DragHandle({ controls, className = "" }: { controls: ReturnType<typeof useDragControls>; className?: string }) {
  return (
    <span
      onPointerDown={(e) => controls.start(e)}
      style={{ touchAction: "none" }}
      className={`shrink-0 cursor-grab active:cursor-grabbing text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-600)] ${className}`}
      aria-label="ลากเพื่อจัดเรียง"
    >
      <GripVertical size={16} />
    </span>
  );
}

type Option = { id: string; label: string };

function OptionRow({ value, onChange, onRemove }: { value: Option; onChange: (label: string) => void; onRemove: () => void }) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={value}
      dragListener={false}
      dragControls={controls}
      as="div"
      className="flex items-center gap-2"
      whileDrag={{ scale: 1.02, zIndex: 10 }}
    >
      <DragHandle controls={controls} />
      <input type="text" value={value.label} onChange={(e) => onChange(e.target.value)} placeholder="เช่น สีฟ้า ไซส์ S" className={inputCls} />
      <button type="button" onClick={onRemove} className="text-[var(--color-neutral-500)] hover:text-[var(--color-critical)] shrink-0" aria-label="ลบ"><Trash2 size={16} /></button>
    </Reorder.Item>
  );
}

function GroupRow({
  value,
  onChangeName,
  onRemove,
  onReorderOptions,
  onAddOption,
  onChangeOption,
  onRemoveOption,
}: {
  value: OptionGroup;
  onChangeName: (name: string) => void;
  onRemove: () => void;
  onReorderOptions: (options: Option[]) => void;
  onAddOption: () => void;
  onChangeOption: (oid: string, label: string) => void;
  onRemoveOption: (oid: string) => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={value}
      dragListener={false}
      dragControls={controls}
      as="div"
      className="rounded-lg bg-[var(--color-primary-100)]/50 p-4 flex flex-col gap-3"
      whileDrag={{ scale: 1.01, boxShadow: "0 12px 28px rgba(29,33,45,0.18)", zIndex: 10 }}
    >
      <div className="flex items-start gap-2">
        <DragHandle controls={controls} className="mt-2.5" />
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <Label required>ชื่อตัวเลือกสินค้า</Label>
          <div className="flex items-center gap-2">
            <input type="text" value={value.name} onChange={(e) => onChangeName(e.target.value)} placeholder="เช่น สี, ขนาด ฯลฯ" className={inputCls} />
            <button type="button" onClick={onRemove} className="text-[var(--color-neutral-500)] hover:text-[var(--color-critical)] shrink-0" aria-label="ลบ"><Trash2 size={16} /></button>
          </div>
        </div>
      </div>
      <div className="pl-6 flex flex-col gap-2">
        <Label required>ตัวเลือก</Label>
        <Reorder.Group axis="y" values={value.options} onReorder={onReorderOptions} as="div" className="flex flex-col gap-2">
          {value.options.map((o) => (
            <OptionRow key={o.id} value={o} onChange={(label) => onChangeOption(o.id, label)} onRemove={() => onRemoveOption(o.id)} />
          ))}
        </Reorder.Group>
        <button type="button" onClick={onAddOption} className="self-start flex items-center gap-1.5 text-[13px] text-[var(--color-neutral-600)] hover:text-[var(--color-primary)]"><Plus size={14} />เพิ่มตัวเลือก</button>
      </div>
    </Reorder.Item>
  );
}

function SalesSection() {
  const [hasVariants, setHasVariants] = useState(false);
  const [groups, setGroups] = useState<OptionGroup[]>([]);

  const addGroup = () =>
    setGroups((g) => [...g, { id: uid(), name: "", options: [{ id: uid(), label: "" }] }]);
  const removeGroup = (id: string) => setGroups((g) => g.filter((x) => x.id !== id));
  const updateGroupName = (id: string, name: string) => setGroups((g) => g.map((x) => (x.id === id ? { ...x, name } : x)));
  const setGroupOptions = (id: string, options: Option[]) => setGroups((g) => g.map((x) => (x.id === id ? { ...x, options } : x)));
  const addOption = (gid: string) => setGroups((g) => g.map((x) => (x.id === gid ? { ...x, options: [...x.options, { id: uid(), label: "" }] } : x)));
  const removeOption = (gid: string, oid: string) => setGroups((g) => g.map((x) => (x.id === gid ? { ...x, options: x.options.filter((o) => o.id !== oid) } : x)));
  const updateOption = (gid: string, oid: string, label: string) => setGroups((g) => g.map((x) => (x.id === gid ? { ...x, options: x.options.map((o) => (o.id === oid ? { ...o, label } : o)) } : x)));

  const toggle = (on: boolean) => {
    setHasVariants(on);
    setGroups(on ? [{ id: uid(), name: "", options: [{ id: uid(), label: "" }] }] : []);
  };

  return (
    <section id="sec-sales" className={`${CARD} p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">ข้อมูลการขาย</h2>
          <p className="flex items-center gap-1.5 text-[12px] text-[var(--color-neutral-500)] mt-1"><Info size={14} />ตัวเลือกสินค้าสำหรับสินค้าที่มี ขนาด สี ไซส์ หลายตัวเลือก</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[14px] text-[var(--color-neutral-700)]">มีตัวเลือกสินค้า</span>
          <Switch size="sm" color="success" isSelected={hasVariants} onValueChange={toggle} aria-label="มีตัวเลือกสินค้า" />
        </div>
      </div>

      {!hasVariants ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="flex flex-col gap-2"><Label required>ราคาสินค้า</Label><NumberStepper /></div>
          <div className="flex flex-col gap-2"><Label required>สต็อกสินค้า</Label><NumberStepper /></div>
          <div className="flex flex-col gap-2"><Label required>น้ำหนักสินค้า</Label><NumberStepper /></div>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          <Reorder.Group axis="y" values={groups} onReorder={setGroups} as="div" className="flex flex-col gap-3">
            {groups.map((g) => (
              <GroupRow
                key={g.id}
                value={g}
                onChangeName={(name) => updateGroupName(g.id, name)}
                onRemove={() => removeGroup(g.id)}
                onReorderOptions={(options) => setGroupOptions(g.id, options)}
                onAddOption={() => addOption(g.id)}
                onChangeOption={(oid, label) => updateOption(g.id, oid, label)}
                onRemoveOption={(oid) => removeOption(g.id, oid)}
              />
            ))}
          </Reorder.Group>
          <button type="button" onClick={addGroup} className="self-start flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-primary)] hover:underline"><Plus size={16} />เพิ่มตัวเลือกสินค้า</button>
          <VariantTable groups={groups} />
        </div>
      )}
    </section>
  );
}

export default function SellerProductForm() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader onMenuClick={() => setMobileMenuOpen(true)} />
      <div className="flex">
        <SellerSidebar active="การจัดการสินค้า" mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
          {/* Top bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => navigate("/seller/products")} aria-label="กลับ" className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors"><ChevronLeft size={20} /></button>
              <h1 className="text-[20px] font-semibold text-[var(--color-neutral-900)]">เพิ่มสินค้า</h1>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => navigate("/seller/products")} className="h-10 px-5 rounded-lg border border-[var(--color-neutral-400)] text-[var(--color-neutral-900)] text-[14px] font-medium hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors">ยกเลิก</button>
              <button type="button" onClick={() => navigate("/seller/products")} className="h-10 px-5 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:bg-[var(--color-primary-600)] transition-colors">บันทึก</button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Stepper */}
            <aside className={`hidden lg:block w-[220px] shrink-0 self-start sticky top-[88px] ${CARD} p-5`}>
              <ol className="flex flex-col">
                {STEPS.map((s, i) => (
                  <li key={s.n} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <a href={`#${s.anchor}`} className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-[12px] font-medium flex items-center justify-center shrink-0">{s.n}</a>
                      {i < STEPS.length - 1 && <span className="w-px flex-1 min-h-[24px] my-1 bg-[var(--color-primary)]/30" />}
                    </div>
                    <a href={`#${s.anchor}`} className="text-[14px] font-medium text-[var(--color-neutral-900)] pb-6 hover:text-[var(--color-primary)]">{s.label}</a>
                  </li>
                ))}
              </ol>
            </aside>

            {/* Form */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              {/* Images */}
              <section id="sec-images" className={`${CARD} p-6`}>
                <h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">รูปภาพสินค้า</h2>
                <p className="flex items-center gap-1.5 text-[12px] text-[var(--color-neutral-500)] mt-1"><Info size={14} />อัปโหลดได้สูงสุด 5 รูป รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                  <ImageSlot label="รูปสินค้า (รูปแรก)" />
                  <ImageSlot label="รูปที่ 2" />
                  <ImageSlot label="รูปที่ 3" />
                  <ImageSlot label="รูปที่ 4" />
                  <ImageSlot label="รูปที่ 5" />
                </div>
              </section>

              {/* Product info */}
              <section id="sec-info" className={`${CARD} p-6`}>
                <h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">ข้อมูลสินค้า</h2>
                <p className="flex items-center gap-1.5 text-[12px] text-[var(--color-neutral-500)] mt-1"><Info size={14} />อัปโหลดได้สูงสุด 5 รูป รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex flex-col gap-2"><Label required>ชื่อสินค้า</Label><input type="text" placeholder="ชื่อสินค้า" className={inputCls} /></div>
                  <div className="flex flex-col gap-2"><Label required>หมวดหมู่สินค้า</Label>
                    <Select aria-label="หมวดหมู่สินค้า" placeholder="เลือกหมวดหมู่สินค้า" radius="sm" classNames={selectClassNames}>
                      <SelectItem key="toothpaste">ยาสีฟัน</SelectItem>
                      <SelectItem key="medical">เครื่องมือการแพทย์</SelectItem>
                      <SelectItem key="milk">น้ำนมสด</SelectItem>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2"><Label required>หน่วย</Label>
                    <Select aria-label="หน่วย" defaultSelectedKeys={["g"]} radius="sm" classNames={selectClassNames}>
                      <SelectItem key="g">กรัม (g)</SelectItem>
                      <SelectItem key="kg">กิโลกรัม (kg)</SelectItem>
                      <SelectItem key="pcs">ชิ้น</SelectItem>
                      <SelectItem key="box">กล่อง</SelectItem>
                      <SelectItem key="pack">ซอง</SelectItem>
                      <SelectItem key="bottle">ขวด</SelectItem>
                      <SelectItem key="crate">ลัง</SelectItem>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2"><Label>รหัสสินค้า (SKU)</Label><input type="text" placeholder="เช่น BMS-001" className={inputCls} /></div>
                  <div className="flex flex-col gap-2"><Label>ลักษณะสินค้า</Label><input type="text" placeholder="เช่น เป็นของเหลว, แก้ว, ..." className={inputCls} /></div>
                  <div className="flex flex-col gap-2"><Label>สถานะสินค้า</Label>
                    <Select aria-label="สถานะสินค้า" defaultSelectedKeys={["active"]} radius="sm" classNames={selectClassNames}>
                      <SelectItem key="active">เปิดขาย</SelectItem>
                      <SelectItem key="inactive">ปิดขาย</SelectItem>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <Label>รายละเอียดสินค้า</Label>
                  <textarea rows={3} placeholder="อธิบายรายละเอียดสินค้า คุณประโยชน์ต่างๆ" className="rounded-lg border border-[var(--color-neutral-300)] px-3 py-2 text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary)] resize-none" />
                </div>
              </section>

              {/* Sales info */}
              <SalesSection />

              {/* Product settings */}
              <section id="sec-settings" className={`${CARD} p-6`}>
                <h2 className="text-[18px] font-medium text-[var(--color-neutral-900)]">ตั้งค่าสินค้า</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="rounded-xl p-4" style={{ backgroundImage: "linear-gradient(110deg, #efe2fb 0%, #f9f5fd 50%, #f1e6fc 100%)" }}>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[14px] font-medium text-[var(--color-neutral-900)]">ใบเสนอราคา</p>
                      <Switch size="sm" color="secondary" aria-label="ใบเสนอราคา" />
                    </div>
                    <p className="flex items-center gap-1.5 text-[12px] text-[var(--color-neutral-600)] mt-2"><Info size={14} className="text-[var(--color-neutral-500)]" />เปิดขายสินค้าแบบขอใบเสนอราคา</p>
                  </div>
                  <div className="rounded-xl p-4" style={{ backgroundImage: "linear-gradient(110deg, #e3effc 0%, #f5fafe 50%, #e0ecfb 100%)" }}>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[14px] font-medium text-[var(--color-neutral-900)]">สินค้าแนะนำ</p>
                      <Switch size="sm" color="primary" aria-label="สินค้าแนะนำ" />
                    </div>
                    <p className="flex items-center gap-1.5 text-[12px] text-[var(--color-neutral-600)] mt-2"><Info size={14} className="text-[var(--color-neutral-500)]" />เปิดการมองเห็นให้มากขึ้น และเป็นสินค้าเป็นที่นิยม</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
