import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import {
  CARD_SHADOW,
  SectionHint,
  PeriodSelector,
  BarChart,
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

/* ---------- Bar chart series (promotion / discount-code / flash-sale) ---------- */

const MARKETING_SERIES: BarSeriesConfig = {
  leftTicks: [1000, 800, 500, 200, 100, 50, 0],
  rightTicks: [1000, 800, 500, 200, 100, 50, 0],
  singleAxis: true,
  leftGradient: "bg-gradient-to-b from-[#21bdff] to-[#eff9fe]",
  rightGradient: "bg-gradient-to-b from-[#449c0a] to-[#eefed0]",
  thirdGradient: "bg-gradient-to-b from-[#f64669] to-[#fef4f5]",
  leftLegendColor: "#0485f7",
  rightLegendColor: "#449c0a",
  thirdLegendColor: "#f64669",
  leftLegendLabel: "ยอดขายโปรโมชั่น (บาท)",
  rightLegendLabel: "ยอดขายโค้ดส่วนลด (บาท)",
  thirdLegendLabel: "ยอดขาย Flash Sale (บาท)",
  leftTipColor: "#21bdff",
  rightTipColor: "#7ed957",
  thirdTipColor: "#fa7e96",
  leftTipLabel: "ยอดขายโปรโมชั่น",
  leftTipUnit: "บาท",
  rightTipLabel: "ยอดขายโค้ดส่วนลด",
  rightTipUnit: "บาท",
  thirdTipLabel: "ยอดขาย Flash Sale",
  thirdTipUnit: "บาท",
};

const HOURLY_PROMO = [
  720, 410, 180, 90, 60, 70, 320, 540,
  930, 430, 410, 880, 600, 760, 940, 410,
  124, 137, 430, 360, 280, 320, 470, 480,
];
const HOURLY_CODE = [
  300, 130, 60, 40, 30, 50, 160, 260,
  470, 210, 300, 470, 230, 360, 470, 220,
  45, 66, 210, 180, 130, 160, 240, 290,
];
const HOURLY_FLASH = [
  560, 180, 90, 50, 40, 60, 220, 380,
  610, 280, 360, 590, 320, 470, 600, 300,
  80, 110, 320, 260, 190, 240, 360, 410,
];
const HOURLY_DATA: BarPoint[] = Array.from({ length: 24 }, (_, h) => ({
  label: `${String(h).padStart(2, "0")}:00`,
  sales: HOURLY_PROMO[h],
  orders: HOURLY_CODE[h],
  extra: HOURLY_FLASH[h],
}));

const WEEKLY_PROMO = [420, 280, 350, 510, 680, 840, 760];
const WEEKLY_CODE = [180, 140, 220, 280, 360, 470, 410];
const WEEKLY_FLASH = [300, 220, 290, 380, 480, 620, 540];

const MONTHLY_PROMO = [
  220, 180, 300, 410, 480, 360, 270, 330, 450, 520,
  610, 580, 470, 390, 440, 510, 630, 720, 680, 550,
  490, 570, 640, 710, 780, 840, 760, 690, 730, 810, 880,
];
const MONTHLY_CODE = [
  120, 80, 160, 210, 240, 190, 130, 170, 230, 280,
  330, 290, 240, 190, 220, 270, 350, 400, 380, 290,
  240, 290, 340, 410, 460, 470, 420, 360, 390, 430, 480,
];
const MONTHLY_FLASH = [
  180, 130, 220, 300, 360, 280, 210, 260, 340, 400,
  470, 420, 350, 290, 330, 380, 480, 560, 520, 410,
  360, 420, 480, 560, 620, 640, 580, 500, 540, 600, 660,
];

const YEARLY_PROMO = [320, 410, 380, 460, 520, 580, 610, 640, 590, 720, 780, 920];
const YEARLY_CODE = [120, 200, 260, 320, 380, 420, 460, 480, 440, 470, 490, 500];
const YEARLY_FLASH = [240, 300, 280, 360, 420, 480, 520, 540, 500, 600, 650, 760];

function buildMarketingChartData(period: PeriodKey, base: Date, range: DateRange): BarPoint[] {
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
        sales: MONTHLY_PROMO[i % MONTHLY_PROMO.length],
        orders: MONTHLY_CODE[i % MONTHLY_CODE.length],
        extra: MONTHLY_FLASH[i % MONTHLY_FLASH.length],
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
        sales: WEEKLY_PROMO[i],
        orders: WEEKLY_CODE[i],
        extra: WEEKLY_FLASH[i],
      };
    });
  }
  if (period === "month") {
    const dim = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    return Array.from({ length: dim }, (_, i) => ({
      label: `${i + 1}`,
      sales: MONTHLY_PROMO[i % MONTHLY_PROMO.length],
      orders: MONTHLY_CODE[i % MONTHLY_CODE.length],
      extra: MONTHLY_FLASH[i % MONTHLY_FLASH.length],
    }));
  }
  if (period === "year") {
    return Array.from({ length: 12 }, (_, i) => ({
      label: THAI_MONTH_SHORT[i],
      sales: YEARLY_PROMO[i],
      orders: YEARLY_CODE[i],
      extra: YEARLY_FLASH[i],
    }));
  }
  return HOURLY_DATA;
}

/* ---------- Report table ---------- */

type MarketingType = "โปรโมชั่น" | "โค้ดส่วนลด" | "Flash Sale";

type MarketingRow = {
  name: string;
  type: MarketingType;
  product: string;
  sold: number;
  total: number;
};

const MARKETING_ROWS: MarketingRow[] = [
  { name: "ส่วนลดพิเศษ", type: "โปรโมชั่น", product: "เครื่องประดับ", sold: 45, total: 3290.5 },
  { name: "ลดรับซัมเมอร์", type: "โปรโมชั่น", product: "รองเท้าแตะ", sold: 130, total: 7800.0 },
  { name: "โปรลดราคา", type: "โปรโมชั่น", product: "กางเกง", sold: 60, total: 5400.0 },
  { name: "ลดล้างสต๊อก", type: "โปรโมชั่น", product: "พัดลม", sold: 20, total: 1200.0 },
  { name: "โปรโมชั่นเดือนนี้", type: "โค้ดส่วนลด", product: "ลิปสติก", sold: 75, total: 4500.0 },
  { name: "ลดสูงสุด 50%", type: "โค้ดส่วนลด", product: "เสื้อกีฬา", sold: 90, total: 6300.0 },
  { name: "โปรแรง", type: "โค้ดส่วนลด", product: "ปากกา", sold: 150, total: 2250.0 },
  { name: "รับส่วนลดเพิ่ม", type: "โค้ดส่วนลด", product: "ผ้าเช็ดตัว", sold: 40, total: 1600.0 },
  { name: "Flash Sale 2.2", type: "Flash Sale", product: "กาแฟ", sold: 110, total: 8250.0 },
  { name: "Flash Sale แห่งปี", type: "Flash Sale", product: "แจ็คเก็ต", sold: 55, total: 7150.0 },
  { name: "Flash Sale 3.3", type: "Flash Sale", product: "รองเท้าผ้าใบ", sold: 85, total: 10200.0 },
  { name: "Flash Sale 4.4", type: "Flash Sale", product: "หูฟัง", sold: 65, total: 9100.0 },
];

const FILTER_TABS: { key: string; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "โปรโมชั่น", label: "โปรโมชั่น" },
  { key: "โค้ดส่วนลด", label: "โค้ดส่วนลด" },
  { key: "Flash Sale", label: "Flash Sale" },
];

const money = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2 });

/* ---------- Page ---------- */

export default function SellerMarketingAnalysis() {
  const [period, setPeriod] = useState<PeriodKey>("day");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
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
    () => buildMarketingChartData(period, baseDate, customRange),
    [period, baseDate, customRange]
  );

  const rows = useMemo(
    () => (filter === "all" ? MARKETING_ROWS : MARKETING_ROWS.filter((r) => r.type === filter)),
    [filter]
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
          active="การวิเคราะห์การตลาด"
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-6">
          {/* === Section 1 : Marketing analysis (chart) === */}
          <section className={`bg-white rounded-2xl ${CARD_SHADOW} p-6 flex flex-col gap-5`}>
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <h1 className="text-[20px] font-semibold text-[var(--color-primary-700)] leading-7">
                การวิเคราะห์การตลาด
              </h1>
              <SectionHint text="การวิเคราะห์การตลาด โปรโมชั่น, โค้ดส่วนลด, Flash Sale และนำเสนอในรูปแบบกราฟแท่งและมีรายงานให้ดาวน์โหลดได้" />
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
              series={MARKETING_SERIES}
            />
          </section>

          {/* === Section 2 : Marketing report === */}
          <section className={`bg-white rounded-2xl ${CARD_SHADOW} flex flex-col`}>
            <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-[var(--color-neutral-200)] flex-wrap">
              <h2 className="text-[20px] font-semibold text-[var(--color-primary-700)]">
                รายงานการสั่งซื้อสินค้าจากการตลาด
              </h2>
              <div className="flex items-center gap-3">
                <div className="bg-[#e9f0f4] rounded-[8px] p-[4px] flex items-center h-10">
                  {FILTER_TABS.map((t) => {
                    const isActive = t.key === filter;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => {
                          setFilter(t.key);
                          setPage(1);
                        }}
                        className={[
                          "h-8 px-4 rounded-[4px] text-[14px] font-medium transition-all whitespace-nowrap",
                          isActive
                            ? "bg-white text-[var(--color-primary)] shadow-[0_0_1px_rgba(29,33,45,0.2),0_0_2px_rgba(29,33,45,0.08),0_2px_4px_rgba(29,33,45,0.08)]"
                            : "text-[#5d6c87] hover:text-[var(--color-primary)]",
                        ].join(" ")}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
                >
                  <Download size={16} />
                  ดาวน์โหลดรายงาน
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-0 p-4">
              {/* Header row */}
              <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-4 items-center bg-[#eff9fe] rounded-[4px] px-2 py-1.5 text-[12px] text-[#1d212d] mb-2">
                <span className="min-w-0">ชื่อการตลาด</span>
                <span className="min-w-0">ประเภทการตลาด</span>
                <span className="min-w-0">สินค้า</span>
                <span className="min-w-0">จำนวนที่ขายได้ (ชิ้น)</span>
                <span className="min-w-0">ยอดขายทั้งหมด (฿)</span>
              </div>

              {/* Data rows */}
              {rows.map((r) => (
                <div
                  key={r.name}
                  className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-4 items-center px-2 py-3 border-b border-[var(--color-neutral-200)] last:border-b-0 text-[14px] text-[#1d212d]"
                >
                  <p className="min-w-0 truncate">{r.name}</p>
                  <p className="min-w-0 truncate">{r.type}</p>
                  <p className="min-w-0 truncate">{r.product}</p>
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
