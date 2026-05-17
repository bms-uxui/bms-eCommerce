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

/* ---------- Bar chart series (new vs. returning customers) ---------- */

const CUSTOMER_SERIES: BarSeriesConfig = {
  leftTicks: [1000, 800, 500, 200, 100, 50, 0],
  rightTicks: [500, 200, 100, 80, 50, 20, 0],
  leftGradient: "bg-gradient-to-b from-[#0485f7] via-[#21bdff] to-[#cdedff]",
  rightGradient: "bg-gradient-to-b from-[#a967f8] via-[#c79bfb] to-[#f3e8ff]",
  leftLegendColor: "#0485f7",
  rightLegendColor: "#a967f8",
  leftLegendLabel: "ลูกค้าใหม่ (คน)",
  rightLegendLabel: "ลูกค้าที่ซื้อซ้ำ (คน)",
  leftTipColor: "#21bdff",
  rightTipColor: "#d0a5fd",
  leftTipLabel: "ลูกค้าใหม่",
  leftTipUnit: "คน",
  rightTipLabel: "ลูกค้าที่ซื้อซ้ำ",
  rightTipUnit: "คน",
};

const HOURLY_NEW = [
  720, 410, 180, 90, 60, 70, 320, 540,
  930, 430, 410, 880, 600, 760, 940, 410,
  124, 137, 430, 360, 280, 320, 470, 480,
];
const HOURLY_REPEAT = [
  300, 130, 60, 40, 30, 50, 160, 260,
  470, 210, 300, 470, 230, 360, 470, 220,
  45, 66, 210, 180, 130, 160, 240, 290,
];
const HOURLY_DATA: BarPoint[] = Array.from({ length: 24 }, (_, h) => ({
  label: `${String(h).padStart(2, "0")}:00`,
  sales: HOURLY_NEW[h],
  orders: HOURLY_REPEAT[h],
}));

const WEEKLY_NEW = [420, 280, 350, 510, 680, 840, 760];
const WEEKLY_REPEAT = [180, 140, 220, 280, 360, 470, 410];

const MONTHLY_NEW = [
  220, 180, 300, 410, 480, 360, 270, 330, 450, 520,
  610, 580, 470, 390, 440, 510, 630, 720, 680, 550,
  490, 570, 640, 710, 780, 840, 760, 690, 730, 810, 880,
];
const MONTHLY_REPEAT = [
  120, 80, 160, 210, 240, 190, 130, 170, 230, 280,
  330, 290, 240, 190, 220, 270, 350, 400, 380, 290,
  240, 290, 340, 410, 460, 470, 420, 360, 390, 430, 480,
];

const YEARLY_NEW = [320, 410, 380, 460, 520, 580, 610, 640, 590, 720, 780, 920];
const YEARLY_REPEAT = [120, 200, 260, 320, 380, 420, 460, 480, 440, 470, 490, 500];

function buildCustomerChartData(period: PeriodKey, base: Date, range: DateRange): BarPoint[] {
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
        sales: MONTHLY_NEW[i % MONTHLY_NEW.length],
        orders: MONTHLY_REPEAT[i % MONTHLY_REPEAT.length],
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
        sales: WEEKLY_NEW[i],
        orders: WEEKLY_REPEAT[i],
      };
    });
  }
  if (period === "month") {
    const dim = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    return Array.from({ length: dim }, (_, i) => ({
      label: `${i + 1}`,
      sales: MONTHLY_NEW[i % MONTHLY_NEW.length],
      orders: MONTHLY_REPEAT[i % MONTHLY_REPEAT.length],
    }));
  }
  if (period === "year") {
    return Array.from({ length: 12 }, (_, i) => ({
      label: THAI_MONTH_SHORT[i],
      sales: YEARLY_NEW[i],
      orders: YEARLY_REPEAT[i],
    }));
  }
  return HOURLY_DATA;
}

/* ---------- Report table ---------- */

type CustomerRow = {
  customer: string;
  orders: number;
  total: number;
  avg: number;
  repeatRate: number;
};

const CUSTOMER_ROWS: CustomerRow[] = [
  { customer: "lena markov", orders: 8, total: 1420.5, avg: 210.0, repeatRate: 4.8 },
  { customer: "omar velasquez", orders: 12, total: 3900.0, avg: 1200.0, repeatRate: 5.1 },
  { customer: "sasha nguyen", orders: 4, total: 980.0, avg: 310.0, repeatRate: 2.9 },
  { customer: "jonathan lee", orders: 15, total: 5600.0, avg: 850.0, repeatRate: 6.0 },
  { customer: "marie dupont", orders: 3, total: 1100.0, avg: 150.0, repeatRate: 3.7 },
  { customer: "kairo tanaka", orders: 7, total: 2750.0, avg: 500.0, repeatRate: 4.1 },
  { customer: "anita shah", orders: 9, total: 3250.0, avg: 580.0, repeatRate: 5.5 },
  { customer: "leo carter", orders: 6, total: 1800.0, avg: 400.0, repeatRate: 3.2 },
  { customer: "ines rodriguez", orders: 10, total: 4100.0, avg: 720.0, repeatRate: 5.8 },
  { customer: "maxwell stone", orders: 11, total: 3600.0, avg: 600.0, repeatRate: 4.9 },
  { customer: "nina petrov", orders: 2, total: 750.0, avg: 130.0, repeatRate: 2.7 },
];

const money = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2 });

/* ---------- Page ---------- */

export default function SellerCustomerAnalysis() {
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
    () => buildCustomerChartData(period, baseDate, customRange),
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
          active="การวิเคราะห์ลูกค้า"
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-6">
          {/* === Section 1 : Customer analysis (chart) === */}
          <section className={`bg-white rounded-2xl ${CARD_SHADOW} p-6 flex flex-col gap-5`}>
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <h1 className="text-[20px] font-semibold text-[var(--color-primary-700)] leading-7">
                การวิเคราะห์ลูกค้า
              </h1>
              <SectionHint text="การวิเคราะห์ลูกค้าเป็นการสรุปจำนวนลูกค้าทั้งหมดและนำเสนอ ในรูปแบบกราฟแท่งและมีรายงานให้ดาวน์โหลดได้" />
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
              series={CUSTOMER_SERIES}
            />
          </section>

          {/* === Section 1b : 4 stat cards === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatMini title="จำนวนลูกค้าทั้งหมด" value="2,567" change="12.5%" tone="positive" />
            <StatMini title="จำนวนลูกค้าที่ซื้อซ้ำ" value="1,234" change="8.2%" tone="positive" />
            <StatMini title="มูลค่าเฉลี่ยต่อออเดอร์" value="฿ 367" change="3.4%" tone="positive" />
            <StatMini title="อัตราการซื้อสินค้าซ้ำ" value="12.4 %" change="1.1%" tone="positive" />
          </div>

          {/* === Section 2 : Customer report === */}
          <section className={`bg-white rounded-2xl ${CARD_SHADOW} flex flex-col`}>
            <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-[var(--color-neutral-200)]">
              <h2 className="text-[20px] font-semibold text-[var(--color-primary-700)]">
                รายงานลูกค้าที่ทำการสั่งซื้อ
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
                <span className="min-w-0">ลูกค้า</span>
                <span className="min-w-0">จำนวนออเดอร์ที่สั่งซื้อ</span>
                <span className="min-w-0">มูลค่าการสั่งซื้อทั้งหมด (฿)</span>
                <span className="min-w-0">มูลค่าเฉลี่ยต่อออเดอร์ (฿)</span>
                <span className="min-w-0">อัตราการซื้อสินค้าซ้ำ (%)</span>
              </div>

              {/* Data rows */}
              {CUSTOMER_ROWS.map((r) => (
                <div
                  key={r.customer}
                  className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-4 items-center px-2 py-3 border-b border-[var(--color-neutral-200)] last:border-b-0 text-[14px] text-[#1d212d]"
                >
                  <p className="min-w-0 truncate">{r.customer}</p>
                  <p className="min-w-0 tabular-nums">{r.orders}</p>
                  <p className="min-w-0 tabular-nums">{money(r.total)}</p>
                  <p className="min-w-0 tabular-nums">{money(r.avg)}</p>
                  <p className="min-w-0 tabular-nums">{r.repeatRate.toFixed(1)} %</p>
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
