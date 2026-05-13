import { useState } from "react";
import Icon from "../components/landing/Icon";
import FlipNumber from "../components/landing/FlipNumber";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";

export type BadgeTone = "positive" | "critical" | "neutral";

export function ChangeBadge({
  value,
  tone = "positive",
  size = "sm",
}: {
  value: string;
  tone?: BadgeTone;
  size?: "sm" | "lg";
}) {
  const palette: Record<BadgeTone, string> = {
    positive: "bg-[#d6fc92] text-[#317a06]",
    critical: "bg-[#feeaed] text-[#dd214f]",
    neutral: "bg-[#e9f0f4] text-[#5d6c87]",
  };
  const isLg = size === "lg";
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap",
        isLg ? "px-2 py-1 text-[18px]" : "px-2 py-0.5 text-[12px]",
        palette[tone],
      ].join(" ")}
    >
      <Icon name={tone === "positive" ? "arrow-up" : "arrow-down"} size={isLg ? 18 : 16} />
      {value}
    </span>
  );
}

function RevenueCard({
  title,
  value,
  unit,
  change,
  changeTone,
  period,
  gradient,
}: {
  title: string;
  value: string;
  unit: string;
  change: string;
  changeTone: BadgeTone;
  period: string;
  gradient: string;
}) {
  return (
    <div
      className="flex-1 min-w-0 rounded-xl p-6 overflow-hidden shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] flex flex-col gap-6 justify-between min-h-[189px]"
      style={{ backgroundImage: gradient }}
    >
      <p className="text-[18px] text-white leading-6">{title}</p>
      <div className="flex items-baseline gap-3 text-white">
        <FlipNumber value={value} className="text-[32px] font-bold leading-none [text-shadow:0_16px_32px_rgba(29,33,45,0.1),0_1px_4px_rgba(29,33,45,0.15),0_0_1px_rgba(29,33,45,0.2)]" />
        <span className="text-[32px] leading-6">{unit}</span>
      </div>
      <div className="flex items-center gap-3">
        <ChangeBadge value={change} tone={changeTone} size="lg" />
        <span className="text-[18px] text-white whitespace-nowrap">{period}</span>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  unit,
  change,
  changeTone,
  period,
}: {
  title: string;
  value: string;
  unit: string;
  change: string;
  changeTone: BadgeTone;
  period: string;
}) {
  return (
    <div className="bg-white rounded-xl px-4 py-3.5 flex flex-col gap-3 justify-between shadow-[0_2px_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.08),0_0_0.5px_rgba(29,33,45,0.2)]">
      <p className="text-[12px] text-[var(--color-neutral-500)]">{title}</p>
      <div className="flex items-end gap-3">
        <FlipNumber value={value} className="text-[24px] font-bold text-black leading-none" />
        <span className="text-[16px] text-[var(--color-neutral-900)] leading-6">{unit}</span>
      </div>
      <div className="flex items-center gap-1">
        <ChangeBadge value={change} tone={changeTone} />
        <span className="text-[12px] text-[var(--color-neutral-500)]">{period}</span>
      </div>
    </div>
  );
}

const WEEK_DAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

type CalMode = "day" | "month" | "year";

function CalCell({
  label,
  selected,
  current,
  onClick,
}: {
  label: string | number;
  selected: boolean;
  current: boolean;
  onClick: () => void;
}) {
  return (
    <div className="h-12 flex items-center justify-center p-1.5">
      <button
        type="button"
        onClick={onClick}
        className={[
          "flex-1 h-9 rounded-full flex items-center justify-center text-[14px] tracking-[-0.006em] transition-colors",
          selected
            ? "bg-[var(--color-primary)] text-white font-bold"
            : current
            ? "border border-[var(--color-primary)] text-[var(--color-primary)] font-bold"
            : "text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
        ].join(" ")}
      >
        {label}
      </button>
    </div>
  );
}

function MiniCalendar() {
  const today = new Date();
  const [mode, setMode] = useState<CalMode>("day");
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(7); // August
  const [selected, setSelected] = useState(new Date(2026, 7, 24));
  const [yearPage, setYearPage] = useState(() => Math.floor(2026 / 12) * 12);

  const firstDow = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const dayCells: (number | null)[] = [
    ...Array<number | null>(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (dayCells.length % 7 !== 0) dayCells.push(null);

  const yearCells = Array.from({ length: 12 }, (_, i) => yearPage + i);

  const sameYM = (d: Date) => d.getFullYear() === viewYear && d.getMonth() === viewMonth;
  const clampDay = (y: number, m: number, d: number) =>
    Math.min(d, new Date(y, m + 1, 0).getDate());

  const headerLabel =
    mode === "day"
      ? sameYM(selected)
        ? `${selected.getDate()}  ${THAI_MONTHS[viewMonth]} ${viewYear}`
        : `${THAI_MONTHS[viewMonth]} ${viewYear}`
      : mode === "month"
      ? `${THAI_MONTHS[selected.getMonth()]} ${viewYear}`
      : `${yearCells[0]} - ${yearCells[yearCells.length - 1]}`;

  const goPrev = () => {
    if (mode === "day") {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear(viewYear - 1);
      } else setViewMonth(viewMonth - 1);
    } else if (mode === "month") {
      setViewYear(viewYear - 1);
    } else {
      setYearPage(yearPage - 12);
    }
  };
  const goNext = () => {
    if (mode === "day") {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear(viewYear + 1);
      } else setViewMonth(viewMonth + 1);
    } else if (mode === "month") {
      setViewYear(viewYear + 1);
    } else {
      setYearPage(yearPage + 12);
    }
  };

  const tabs: { id: CalMode; label: string }[] = [
    { id: "day", label: "วันที่" },
    { id: "month", label: "เดือน" },
    { id: "year", label: "ปี" },
  ];

  return (
    <div className="bg-white rounded-xl border border-[var(--color-neutral-300)] overflow-hidden flex flex-col h-full">
      {/* Tabs */}
      <div className="flex gap-2 p-4 border-b border-[var(--color-neutral-200)]">
        {tabs.map((t) => {
          const active = mode === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setMode(t.id);
                if (t.id === "year") setYearPage(Math.floor(viewYear / 12) * 12);
              }}
              className={[
                "flex-1 py-2 px-4 rounded-lg text-[14px] text-center tracking-[-0.006em] transition-colors",
                active
                  ? "bg-[var(--color-primary-100)] font-bold text-[var(--color-primary-700)]"
                  : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col items-start">
        {/* Header */}
        <div
          className={[
            "h-12 w-full flex items-center pl-3 pr-2 py-1",
            mode === "day" ? "justify-between" : "justify-center",
          ].join(" ")}
        >
          <p className="text-[24px] font-medium text-[var(--color-neutral-900)] leading-8 tracking-[-0.019em] whitespace-nowrap">
            {headerLabel}
          </p>
          {mode === "day" && (
            <div className="flex items-center">
              <button
                type="button"
                onClick={goPrev}
                aria-label="ก่อนหน้า"
                className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
              >
                <Icon name="chevron-left" size={20} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="ถัดไป"
                className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"
              >
                <Icon name="chevron-right" size={20} />
              </button>
            </div>
          )}
        </div>

        {mode === "day" && (
          <>
            <div className="grid grid-cols-7 w-full">
              {WEEK_DAYS.map((d) => (
                <div
                  key={d}
                  className="h-12 flex items-center justify-center text-[14px] text-[var(--color-neutral-500)]"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 w-full">
              {dayCells.map((d, i) =>
                d === null ? (
                  <div key={i} className="h-12" />
                ) : (
                  <CalCell
                    key={i}
                    label={d}
                    selected={sameYM(selected) && selected.getDate() === d}
                    current={sameYM(today) && today.getDate() === d}
                    onClick={() => setSelected(new Date(viewYear, viewMonth, d))}
                  />
                )
              )}
            </div>
          </>
        )}

        {mode === "month" && (
          <div className="grid grid-cols-2 gap-x-4 w-full">
            {THAI_MONTHS.map((m, i) => (
              <CalCell
                key={m}
                label={m}
                selected={selected.getFullYear() === viewYear && selected.getMonth() === i}
                current={today.getFullYear() === viewYear && today.getMonth() === i}
                onClick={() => {
                  setViewMonth(i);
                  setSelected(new Date(viewYear, i, clampDay(viewYear, i, selected.getDate())));
                  setMode("day");
                }}
              />
            ))}
          </div>
        )}

        {mode === "year" && (
          <div className="grid grid-cols-3 gap-x-4 w-full">
            {yearCells.map((y) => (
              <CalCell
                key={y}
                label={y}
                selected={selected.getFullYear() === y}
                current={today.getFullYear() === y}
                onClick={() => {
                  setViewYear(y);
                  setMode("month");
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const TOP_PRODUCTS = [
  { name: "ข้าวผัดกระเพรา", cat: "เครื่องดื่ม", sales: 1842, revenue: 110520 },
  { name: "ชานมไข่มุก", cat: "เครื่องดื่ม", sales: 1654, revenue: 82700 },
  { name: "ส้มตำไทย", cat: "อาหารจานเดียว", sales: 1523, revenue: 91380 },
  { name: "กาแฟลาเต้", cat: "เครื่องดื่ม", sales: 1389, revenue: 97230 },
  { name: "ข้าวมันไก่", cat: "อาหารจานเดียว", sales: 1245, revenue: 74700 },
  { name: "พิซซ่าชีส", cat: "ฟาสต์ฟู้ด", sales: 1102, revenue: 154280 },
  { name: "ไก่ทอดเกาหลี", cat: "ฟาสต์ฟู้ด", sales: 987, revenue: 138180 },
  { name: "น้ำส้มคั้นสด", cat: "เครื่องดื่ม", sales: 876, revenue: 43800 },
  { name: "ผัดไทยกุ้งสด", cat: "อาหารจานเดียว", sales: 812, revenue: 64960 },
  { name: "เค้กช็อกโกแลต", cat: "ขนม", sales: 745, revenue: 111750 },
];

const TOP_CUSTOMERS = [
  { name: "rewase fhegeno", email: "rewase@gmail.com", sales: 1842, revenue: 110520 },
  { name: "beefee rewasa", email: "beefee@gmail.com", sales: 1654, revenue: 82700 },
  { name: "freedee kadee", email: "freedee@gmail.com", sales: 1523, revenue: 91380 },
  { name: "kaphar fama", email: "kaphar@gmail.com", sales: 1389, revenue: 97230 },
  { name: "ghuotry ghoest", email: "ghuotry@gmail.com", sales: 1245, revenue: 74700 },
  { name: "marena sati", email: "marena@gmail.com", sales: 1102, revenue: 154280 },
  { name: "loiut retiouy", email: "loiut@gmail.com", sales: 987, revenue: 138180 },
  { name: "saou kadu", email: "saou@gmail.com", sales: 876, revenue: 43800 },
  { name: "gutu malee", email: "gutu@gmail.com", sales: 812, revenue: 64960 },
  { name: "Deenee sadee", email: "Deenee@gmail.com", sales: 745, revenue: 111750 },
];

function RankBadge({ n }: { n: number }) {
  const isTopThree = n <= 3;
  return (
    <span
      className={[
        "inline-flex items-center justify-center w-7 h-7 rounded-full text-[14px] font-semibold",
        isTopThree
          ? "bg-[var(--color-primary)] text-white"
          : "bg-[var(--color-neutral-200)] text-[var(--color-neutral-900)]",
      ].join(" ")}
    >
      {n}
    </span>
  );
}

function SalesBar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(4, Math.round((value / max) * 100));
  return (
    <div className="flex flex-col items-end gap-1">
      <span className="text-[13px] font-medium text-[var(--color-neutral-900)] tabular-nums">
        {value.toLocaleString()}
      </span>
      <span className="block w-24 h-1.5 rounded-full bg-[var(--color-neutral-200)] overflow-hidden">
        <span
          className="block h-full bg-[var(--color-primary)] rounded-full"
          style={{ width: `${pct}%` }}
        />
      </span>
    </div>
  );
}

function TableSection({
  title,
  subtitle,
  nameHeader,
  rows,
}: {
  title: string;
  subtitle: string;
  nameHeader: string;
  rows: { label1: string; label2: string; sales: number; revenue: number }[];
}) {
  const maxSales = Math.max(...rows.map((r) => r.sales));
  return (
    <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 flex flex-col">
      <div className="px-2 pt-2 pb-3">
        <h2 className="text-[24px] font-bold text-[var(--color-neutral-900)] leading-tight">
          {title}
        </h2>
        <p className="text-[14px] text-[var(--color-neutral-600)] mt-1">{subtitle}</p>
      </div>
      <div className="grid grid-cols-[40px_1fr_120px_120px] gap-3 px-2 py-2 text-[12px] font-medium text-[var(--color-neutral-500)] border-b border-[var(--color-neutral-300)]">
        <span className="text-center">#</span>
        <span>{nameHeader}</span>
        <span className="text-right">ยอดขาย(ชิ้น)</span>
        <span className="text-right">รายได้ (฿)</span>
      </div>
      <ul className="flex flex-col">
        {rows.map((r, i) => (
          <li
            key={i}
            className="grid grid-cols-[40px_1fr_120px_120px] gap-3 px-2 py-3 items-center border-b border-[var(--color-neutral-200)] last:border-b-0"
          >
            <span className="flex justify-center">
              <RankBadge n={i + 1} />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] text-[var(--color-neutral-900)] truncate">
                {r.label1}
              </p>
              <p className="text-[12px] text-[var(--color-neutral-500)] truncate">
                {r.label2}
              </p>
            </div>
            <div className="flex justify-end">
              <SalesBar value={r.sales} max={maxSales} />
            </div>
            <span className="text-[14px] font-medium text-[var(--color-neutral-900)] text-right tabular-nums">
              {r.revenue.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function SellerOverview() {
  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <SellerHeader />
      <div className="flex">
        <SellerSidebar active="ภาพรวมร้านค้า" />
        <main className="flex-1 min-w-0 px-8 py-6">
          <h1 className="text-[20px] font-bold text-[var(--color-neutral-900)] mb-6">
            ภาพรวมร้านค้า
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_368px] gap-4 mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <RevenueCard
                  title="รายได้วันนี้ "
                  value="3,586"
                  unit="บาท"
                  change="12.5%"
                  changeTone="positive"
                  period="เปลี่ยนแปลงจากวันก่อน"
                  gradient="linear-gradient(108deg, #abe6ff 0%, #21bdff 14%, #0485f7 48%, #036ac6 88%)"
                />
                <RevenueCard
                  title="รายได้เดือนสิงหาคม 2026"
                  value="23,566"
                  unit="บาท"
                  change="8.5%"
                  changeTone="critical"
                  period="เปลี่ยนแปลงจากเดือนก่อน"
                  gradient="linear-gradient(-87deg, #21bdff 0%, #0485f7 40%, #036ac6 100%)"
                />
              </div>
              <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1 min-h-0">
                <StatCard
                  title="จำนวนคำสั่งซื้อ"
                  value="790"
                  unit="รายการ"
                  change="12.5%"
                  changeTone="critical"
                  period="เปลี่ยนแปลงจากวันก่อน"
                />
                <StatCard
                  title="ยอดผู้เข้าชมสินค้า"
                  value="1,250"
                  unit="คน"
                  change="12.5%"
                  changeTone="critical"
                  period="เปลี่ยนแปลงจากวันก่อน"
                />
                <StatCard
                  title="ยอดการจัดส่งสำเร็จ"
                  value="0"
                  unit="รายการ"
                  change="0.0%"
                  changeTone="neutral"
                  period="เปลี่ยนแปลงจากวันก่อน"
                />
                <StatCard
                  title="จำนวนการขอใบเสนอราคา"
                  value="580"
                  unit="รายการ"
                  change="12.5%"
                  changeTone="positive"
                  period="เปลี่ยนแปลงจากวันก่อน"
                />
              </div>
            </div>
            <MiniCalendar />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <TableSection
              title="Top Product"
              subtitle="10 อันดับสินค้าขายดี"
              nameHeader="สินค้า"
              rows={TOP_PRODUCTS.map((p) => ({
                label1: p.name,
                label2: p.cat,
                sales: p.sales,
                revenue: p.revenue,
              }))}
            />
            <TableSection
              title="Top Customers"
              subtitle="ยอดขายลูกค้าประจำ"
              nameHeader="ลูกค้า"
              rows={TOP_CUSTOMERS.map((c) => ({
                label1: c.name,
                label2: c.email,
                sales: c.sales,
                revenue: c.revenue,
              }))}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
