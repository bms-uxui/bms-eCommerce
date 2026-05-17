import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import {
  CARD_SHADOW,
  SectionHint,
  PeriodSelector,
  BarChart,
  StatMini,
  PaginationFooter,
  formatCustomRange,
  formatDateRange,
  type PeriodKey,
  type BarPoint,
  type BarSeriesConfig,
} from "./SellerRevenueAnalysis";
import {
  THAI_MONTH_SHORT,
  TODAY,
  startOfDay,
  addDays,
  weekRange,
  type DateRange,
} from "../components/CustomRangeCalendar";

/* ---------- Bar chart series (product views vs. orders) ---------- */

const PRODUCT_SERIES: BarSeriesConfig = {
  leftTicks: [1000, 800, 500, 200, 100, 50, 0],
  rightTicks: [500, 200, 100, 80, 50, 20, 0],
  leftGradient: "bg-gradient-to-b from-[#0485f7] via-[#21bdff] to-[#cdedff]",
  rightGradient: "bg-gradient-to-b from-[#f1aa09] via-[#f7c948] to-[#fef3c7]",
  leftLegendColor: "#0485f7",
  rightLegendColor: "#f1aa09",
  leftLegendLabel: "การกดดูสินค้า (ครั้ง)",
  rightLegendLabel: "จำนวนคำสั่งซื้อ (รายการ)",
  leftTipColor: "#21bdff",
  rightTipColor: "#f1aa09",
  leftTipLabel: "การกดดูสินค้า",
  leftTipUnit: "ครั้ง",
  rightTipLabel: "จำนวนคำสั่งซื้อ",
  rightTipUnit: "รายการ",
};

const HOURLY_VIEWS = [
  720, 410, 180, 90, 60, 70, 320, 540,
  930, 430, 410, 880, 600, 760, 940, 410,
  124, 137, 430, 360, 280, 320, 470, 480,
];
const HOURLY_ORDERS = [
  300, 130, 60, 40, 30, 50, 160, 260,
  470, 210, 300, 470, 230, 360, 470, 220,
  45, 66, 210, 180, 130, 160, 240, 290,
];
const HOURLY_DATA: BarPoint[] = Array.from({ length: 24 }, (_, h) => ({
  label: `${String(h).padStart(2, "0")}:00`,
  sales: HOURLY_VIEWS[h],
  orders: HOURLY_ORDERS[h],
}));

const WEEKLY_VIEWS = [420, 280, 350, 510, 680, 840, 760];
const WEEKLY_ORDERS = [180, 140, 220, 280, 360, 470, 410];

const MONTHLY_VIEWS = [
  220, 180, 300, 410, 480, 360, 270, 330, 450, 520,
  610, 580, 470, 390, 440, 510, 630, 720, 680, 550,
  490, 570, 640, 710, 780, 840, 760, 690, 730, 810, 880,
];
const MONTHLY_ORDERS = [
  120, 80, 160, 210, 240, 190, 130, 170, 230, 280,
  330, 290, 240, 190, 220, 270, 350, 400, 380, 290,
  240, 290, 340, 410, 460, 470, 420, 360, 390, 430, 480,
];

const YEARLY_VIEWS = [320, 410, 380, 460, 520, 580, 610, 640, 590, 720, 780, 920];
const YEARLY_ORDERS = [120, 200, 260, 320, 380, 420, 460, 480, 440, 470, 490, 500];

function buildProductChartData(period: PeriodKey, base: Date, range: DateRange): BarPoint[] {
  if (period === "custom") {
    const days =
      Math.round(
        (startOfDay(range.end).getTime() - startOfDay(range.start).getTime()) / 86400000
      ) + 1;
    const n = Math.max(1, days);
    return Array.from({ length: n }, (_, i) => {
      const d = new Date(range.start);
      d.setDate(d.getDate() + i);
      return {
        label: `${d.getDate()} ${THAI_MONTH_SHORT[d.getMonth()]}`,
        sales: MONTHLY_VIEWS[i % MONTHLY_VIEWS.length],
        orders: MONTHLY_ORDERS[i % MONTHLY_ORDERS.length],
      };
    });
  }
  if (period === "week") {
    const { start } = weekRange(base);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return {
        label: `${d.getDate()} ${THAI_MONTH_SHORT[d.getMonth()]}`,
        sales: WEEKLY_VIEWS[i],
        orders: WEEKLY_ORDERS[i],
      };
    });
  }
  if (period === "month") {
    const dim = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    return Array.from({ length: dim }, (_, i) => ({
      label: `${i + 1}`,
      sales: MONTHLY_VIEWS[i % MONTHLY_VIEWS.length],
      orders: MONTHLY_ORDERS[i % MONTHLY_ORDERS.length],
    }));
  }
  if (period === "year") {
    return Array.from({ length: 12 }, (_, i) => ({
      label: THAI_MONTH_SHORT[i],
      sales: YEARLY_VIEWS[i],
      orders: YEARLY_ORDERS[i],
    }));
  }
  return HOURLY_DATA;
}

/* ---------- Top-5 ranking card ---------- */

type RankRow = {
  name: string;
  sub?: string;
  units: number;
  revenue: number;
};

function rankBadge(rank: number): { bg: string; color: string } {
  if (rank === 1) return { bg: "#f1aa09", color: "#ffffff" };
  if (rank === 2) return { bg: "#798aa3", color: "#ffffff" };
  if (rank === 3) return { bg: "#c9662c", color: "#ffffff" };
  return { bg: "var(--color-neutral-200)", color: "#798aa3" };
}

function Top5Card({
  title,
  nameHeader,
  rows,
}: {
  title: string;
  nameHeader: string;
  rows: RankRow[];
}) {
  const maxUnits = Math.max(...rows.map((r) => r.units));
  return (
    <section className={`bg-white rounded-xl ${CARD_SHADOW} flex flex-col pb-4`}>
      <div className="h-[57px] flex items-center px-4">
        <h2 className="text-[24px] font-bold text-[var(--color-neutral-900)]">{title}</h2>
      </div>
      {/* Column header */}
      <div className="h-[35px] flex items-center px-2 text-[12px] text-[var(--color-neutral-500)]">
        <span className="w-10 text-center">#</span>
        <span className="flex-1 min-w-0">{nameHeader}</span>
        <span className="w-24 text-right">ยอดขาย(ชิ้น)</span>
        <span className="w-28 text-right">รายได้ (฿)</span>
      </div>
      {/* Rows */}
      {rows.map((r, i) => {
        const rank = i + 1;
        const badge = rankBadge(rank);
        const fillPct = Math.round((r.units / maxUnits) * 100);
        return (
          <div
            key={r.name}
            className="flex items-center gap-1 px-4 py-3 border-b border-[var(--color-neutral-200)] last:border-b-0"
          >
            <div
              className="size-7 shrink-0 rounded-full flex items-center justify-center text-[12px] font-bold"
              style={{ backgroundColor: badge.bg, color: badge.color }}
            >
              {rank}
            </div>
            <div className="w-[304px] min-w-0 flex flex-col justify-center pl-1">
              <p className="truncate text-[14px] font-bold text-[var(--color-neutral-900)]">
                {r.name}
              </p>
              {r.sub && (
                <p className="text-[12px] text-[var(--color-neutral-500)]">{r.sub}</p>
              )}
            </div>
            <div className="w-24 shrink-0 flex flex-col items-end gap-1">
              <span className="text-[13px] text-[var(--color-neutral-900)] tabular-nums">
                {r.units.toLocaleString()}
              </span>
              <div className="w-24 h-1.5 rounded-full bg-[var(--color-neutral-200)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)]"
                  style={{ width: `${fillPct}%` }}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0 flex items-center justify-end">
              <span className="text-[13px] text-[var(--color-neutral-900)] text-right tabular-nums">
                {r.revenue.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}

const TOP_PRODUCTS: RankRow[] = [
  { name: "ข้าวผัดกระเพรา", sub: "เครื่องดื่ม", units: 1842, revenue: 110520 },
  { name: "ชานมไข่มุก", sub: "เครื่องดื่ม", units: 1654, revenue: 82700 },
  { name: "ส้มตำไทย", sub: "อาหารจานเดียว", units: 1523, revenue: 91380 },
  { name: "กาแฟลาเต้", sub: "เครื่องดื่ม", units: 1389, revenue: 97230 },
  { name: "ข้าวมันไก่", sub: "อาหารจานเดียว", units: 1245, revenue: 74700 },
];

const TOP_CATEGORIES: RankRow[] = [
  { name: "เครื่องใช้ไฟฟ้า", units: 1842, revenue: 110520 },
  { name: "เสื้อผ้า", units: 1654, revenue: 82700 },
  { name: "อุปกรณ์คอมพิวเตอร์", units: 1523, revenue: 91380 },
  { name: "เครื่องนุ่งห่ม", units: 1389, revenue: 97230 },
  { name: "ปืนฉีดน้ำ", units: 1245, revenue: 74700 },
];

/* ---------- Report table ---------- */

type ProductRow = {
  name: string;
  category: string;
  stock: number;
  sold: number;
  total: number;
};

const PRODUCT_ROWS: ProductRow[] = [
  { name: "เสื้อฮูด", category: "เสื้อผ้า", stock: 100, sold: 89, total: 12567.0 },
  { name: "เครื่องปิ้งขนมปัง", category: "เครื่องใช้ไฟฟ้า", stock: 30, sold: 15, total: 4500.0 },
  { name: "พัดลมตั้งโต๊ะ", category: "เครื่องใช้ไฟฟ้า", stock: 75, sold: 40, total: 12300.0 },
  { name: "หม้อหุงข้าว", category: "เครื่องใช้ไฟฟ้า", stock: 60, sold: 22, total: 7800.0 },
  { name: "เครื่องปั่นน้ำผลไม้", category: "เครื่องใช้ไฟฟ้า", stock: 45, sold: 18, total: 6400.0 },
  { name: "หมอนข้าง", category: "เครื่องนุ่งห่ม", stock: 20, sold: 12, total: 14000.0 },
  { name: "เครื่องดูดฝุ่น", category: "เครื่องใช้ไฟฟ้า", stock: 35, sold: 10, total: 8750.0 },
  { name: "หน้าจอคอม", category: "อุปกรณ์คอมพิวเตอร์", stock: 25, sold: 8, total: 6250.0 },
  { name: "เครื่องฟอกอากาศ", category: "เครื่องใช้ไฟฟ้า", stock: 40, sold: 14, total: 9200.0 },
  { name: "เครื่องชงกาแฟ", category: "เครื่องใช้ไฟฟ้า", stock: 15, sold: 7, total: 5600.0 },
  { name: "เครื่องอบผ้า", category: "เครื่องใช้ไฟฟ้า", stock: 10, sold: 5, total: 11000.0 },
  { name: "เครื่องตัดหญ้าไฟฟ้า", category: "เครื่องใช้ไฟฟ้า", stock: 8, sold: 3, total: 4800.0 },
];

const money = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2 });

/* ---------- Page ---------- */

export default function SellerProductAnalysis() {
  const [period, setPeriod] = useState<PeriodKey>("day");
  const [page, setPage] = useState(1);
  const [baseDate, setBaseDate] = useState(() => new Date(2026, 7, 24));
  const [customRange, setCustomRange] = useState<DateRange>(() => ({
    start: addDays(TODAY, -13),
    end: TODAY,
  }));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dateLabel =
    period === "custom"
      ? formatCustomRange(customRange)
      : formatDateRange(period, baseDate);
  const chartData = useMemo(
    () => buildProductChartData(period, baseDate, customRange),
    [period, baseDate, customRange]
  );

  const shift = (delta: number) => {
    if (period === "custom") {
      const span =
        Math.round(
          (startOfDay(customRange.end).getTime() -
            startOfDay(customRange.start).getTime()) / 86400000
        ) + 1;
      setCustomRange({
        start: addDays(customRange.start, span * delta),
        end: addDays(customRange.end, span * delta),
      });
      return;
    }
    const next = new Date(baseDate);
    if (period === "day") next.setDate(next.getDate() + delta);
    else if (period === "week") next.setDate(next.getDate() + 7 * delta);
    else if (period === "month") next.setMonth(next.getMonth() + delta);
    else next.setFullYear(next.getFullYear() + delta);
    setBaseDate(next);
  };

  const pageNumbers = useMemo<(number | "…")[]>(() => [1, 2, 3, 4, 5, 6, 7], []);

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader onMenuClick={() => setMobileMenuOpen(true)} />
      <div className="flex">
        <SellerSidebar
          active="การวิเคราะห์สินค้า"
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-6">
          {/* === Section 1 : Product analysis (chart) === */}
          <section className={`bg-white rounded-2xl ${CARD_SHADOW} p-6 flex flex-col gap-5`}>
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <h1 className="text-[20px] font-semibold text-[var(--color-primary-700)] leading-7">
                การวิเคราะห์สินค้า
              </h1>
              <SectionHint text="การวิเคราะห์สินค้าเป็นการสรุปการกดดูสินค้าและจำนวนคำสั่งซื้อ และนำเสนอในรูปแบบกราฟแท่งและมีรายงานให้ดาวน์โหลดได้" />
            </div>

            <PeriodSelector
              period={period}
              onChange={setPeriod}
              label={dateLabel}
              onPrev={() => shift(-1)}
              onNext={() => shift(1)}
              baseDate={baseDate}
              setBaseDate={setBaseDate}
              customRange={customRange}
              setCustomRange={setCustomRange}
            />

            <BarChart
              data={chartData}
              dateLabel={dateLabel}
              period={period}
              series={PRODUCT_SERIES}
            />
          </section>

          {/* === Section 1b : 4 stat cards === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatMini title="อัตราการสั่งซื้อต่อวัน" value="24.9 %" change="12.5%" tone="positive" />
            <StatMini title="อัตราการสั่งซื้อต่อสัปดาห์" value="19.1 %" change="8.2%" tone="positive" />
            <StatMini title="อัตราการสั่งซื้อต่อเดือน" value="11.3 %" change="12.5%" tone="positive" />
            <StatMini title="อัตราการสั่งซื้อต่อปี" value="3.4 %" change="12.5%" tone="positive" />
          </div>

          {/* === Section 2 : Top-5 rankings === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Top5Card title="5 อันดับสินค้าขายดี" nameHeader="สินค้า" rows={TOP_PRODUCTS} />
            <Top5Card
              title="5 อันดับหมวดหมู่สินค้าขายดี"
              nameHeader="หมวดหมู่สินค้า"
              rows={TOP_CATEGORIES}
            />
          </div>

          {/* === Section 3 : Product report === */}
          <section className={`bg-white rounded-2xl ${CARD_SHADOW} flex flex-col`}>
            <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-[var(--color-neutral-200)]">
              <h2 className="text-[20px] font-semibold text-[var(--color-primary-700)]">
                รายงานสินค้าที่ทำการขาย
              </h2>
              <button
                type="button"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
              >
                <Download size={16} />
                ดาวน์โหลดรายงาน
              </button>
            </div>

            <div className="flex flex-col gap-0 p-4">
              {/* Header row */}
              <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-4 items-center bg-[#eff9fe] rounded-[4px] px-2 py-1.5 text-[12px] text-[#1d212d] mb-2">
                <span className="min-w-0">สินค้า</span>
                <span className="min-w-0">หมวดหมู่</span>
                <span className="min-w-0">สต๊อกทั้งหมด (ชิ้น)</span>
                <span className="min-w-0">จำนวนที่ขายได้ (ชิ้น)</span>
                <span className="min-w-0">ยอดขายทั้งหมด (฿)</span>
              </div>

              {/* Data rows */}
              {PRODUCT_ROWS.map((r) => (
                <div
                  key={r.name}
                  className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-4 items-center px-2 py-3 border-b border-[var(--color-neutral-200)] last:border-b-0 text-[14px] text-[#1d212d]"
                >
                  <p className="min-w-0 truncate">{r.name}</p>
                  <p className="min-w-0 truncate">{r.category}</p>
                  <p className="min-w-0 tabular-nums">{r.stock}</p>
                  <p className="min-w-0 tabular-nums">{r.sold}</p>
                  <p className="min-w-0 tabular-nums">{money(r.total)}</p>
                </div>
              ))}
            </div>

            <PaginationFooter
              total={100}
              page={page}
              pages={pageNumbers}
              onPage={setPage}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
