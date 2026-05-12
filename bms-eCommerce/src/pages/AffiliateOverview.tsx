import { useState } from "react";
import Icon from "../components/landing/Icon";
import { AffiliateHeader, AffiliateSidebar } from "../components/AffiliateChrome";
import DateRangePicker from "../components/DateRangePicker";
import Pagination from "../components/Pagination";
import { ChangeBadge, type BadgeTone } from "./SellerOverview";
import { makeProducts } from "../components/landing/mockData";

/* ---------------------------------------------------------------- mock data */

type SummaryStat = { label: string; value: string; change: string; tone: BadgeTone };

const SUMMARY_STATS: SummaryStat[] = [
  { label: "ยอดการคลิก", value: "20", change: "12.5%", tone: "positive" },
  { label: "คำสั่งซื้อ", value: "0", change: "12.5%", tone: "critical" },
  { label: "ค่าคอมมิชชันโดยประมาณ (฿)", value: "0", change: "0.0%", tone: "neutral" },
  { label: "จำนวนที่ขายได้", value: "0", change: "0.0%", tone: "neutral" },
  { label: "ยอดคำสั่งซื้อ (บาท)", value: "0", change: "0.0%", tone: "neutral" },
  { label: "ลูกค้าใหม่", value: "10", change: "12.5%", tone: "positive" },
];

type SummaryRow = {
  date: string;
  clicks: number;
  orders: number;
  commission: number;
  sold: number;
  orderAmount: number;
  newCustomers: number;
};

const SUMMARY_ROWS: SummaryRow[] = [
  { date: "3 กันยายน 2026", clicks: 7, orders: 2, commission: 15.5, sold: 1, orderAmount: 0, newCustomers: 3 },
  { date: "10 กันยายน 2026", clicks: 5, orders: 1, commission: 3.75, sold: 0, orderAmount: 1, newCustomers: 2 },
  { date: "17 กันยายน 2026", clicks: 12, orders: 0, commission: 0, sold: 2, orderAmount: 0, newCustomers: 4 },
  { date: "24 กันยายน 2026", clicks: 9, orders: 3, commission: 7.25, sold: 1, orderAmount: 2, newCustomers: 6 },
  { date: "1 ตุลาคม 2026", clicks: 11, orders: 0, commission: 0, sold: 0, orderAmount: 3, newCustomers: 5 },
  { date: "8 ตุลาคม 2026", clicks: 8, orders: 2, commission: 12, sold: 1, orderAmount: 0, newCustomers: 1 },
  { date: "15 ตุลาคม 2026", clicks: 6, orders: 1, commission: 1.5, sold: 0, orderAmount: 1, newCustomers: 3 },
];

const PRODUCT_ROWS = [
  { name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใส", sold: 0, orders: 0, commission: 0 },
  { name: "เสื้อเชิ้ตแขนยาวลายทางสีน้ำเงินกับขาว", sold: 5, orders: 10, commission: 299 },
  { name: "กางเกงยีนส์ทรงสลิมสีเข้มพร้อมปะขาด", sold: 3, orders: 0, commission: 499 },
  { name: "แจ็คเก็ตหนังสีดำสไตล์เรโทร", sold: 2, orders: 5, commission: 1200 },
  { name: "รองเท้าผ้าใบสีขาวดีไซน์มินิมอล", sold: 10, orders: 15, commission: 850 },
  { name: "กระเป๋าสะพายข้างหนังแท้สีน้ำตาล", sold: 4, orders: 8, commission: 1750 },
  { name: "หมวกไหมพรมสีเทาอุ่นสบายสำหรับฤดูหนาว", sold: 7, orders: 0, commission: 320 },
  { name: "ชุดเดรสยาวผ้าชีฟองลายดอกไม้โทนส้มอ่อน", sold: 1, orders: 3, commission: 950 },
  { name: "แว่นตากันแดดกรอบดำทรงเหลี่ยมทันสมัย", sold: 8, orders: 12, commission: 650 },
  { name: "นาฬิกาข้อมือสเตนเลสสตีลแบบคลาสสิก", sold: 6, orders: 7, commission: 2200 },
];

const PRODUCT_IMAGES = makeProducts(PRODUCT_ROWS.length).map((p) => p.image);
const TOP_PRODUCTS = PRODUCT_ROWS.map((row, i) => ({ ...row, image: PRODUCT_IMAGES[i] }));

const baht = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ----------------------------------------------------------------- pieces */

function StatTile({ stat }: { stat: SummaryStat }) {
  return (
    <div className="bg-white border border-[var(--color-neutral-300)] rounded-2xl p-4 flex flex-col gap-[18px]">
      <p className="text-[16px] text-[var(--color-neutral-900)] leading-tight">{stat.label}</p>
      <div className="flex items-end justify-between gap-2">
        <span className="text-[24px] font-semibold text-[var(--color-neutral-900)] leading-tight">
          {stat.value}
        </span>
        <ChangeBadge value={stat.change} tone={stat.tone} />
      </div>
    </div>
  );
}

const TH ="px-3 py-2.5 text-[12px] font-medium text-[var(--color-neutral-500)] align-bottom bg-[#EFF9FE]";
const TD = "px-3 py-3.5 text-[14px] text-[var(--color-neutral-900)] align-middle";
const TR_DATA = "border-b border-[var(--color-neutral-200)] last:border-b-0";

function SummaryTableSection() {
  const [page, setPage] = useState(2);
  return (
    <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 pb-3">
        <h2 className="text-[18px] font-bold text-[var(--color-primary-700)]">
          สรุปผลโดยรวมแบบตาราง
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
        >
          <Icon name="download" size={18} />
          ดาวน์โหลดรายงาน
        </button>
      </div>
      <hr className="border-t border-[var(--color-neutral-200)] mb-3" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="text-left">
              <th className={`${TH} rounded-l-lg`}>วันที่</th>
              <th className={`${TH} text-center`}>ยอดการคลิก</th>
              <th className={`${TH} text-center`}>ค่าสั่งซื้อ</th>
              <th className={`${TH} text-center`}>ค่าคอมมิชชันโดยประมาณ (฿)</th>
              <th className={`${TH} text-center`}>จำนวนที่ขายได้</th>
              <th className={`${TH} text-center`}>ยอดค่าสั่งซื้อ (฿)</th>
              <th className={`${TH} text-center rounded-r-lg`}>ลูกค้าใหม่</th>
            </tr>
          </thead>
          <tbody>
            {SUMMARY_ROWS.map((r) => (
              <tr key={r.date} className={TR_DATA}>
                <td className={TD}>{r.date}</td>
                <td className={`${TD} text-center`}>{r.clicks}</td>
                <td className={`${TD} text-center`}>{r.orders}</td>
                <td className={`${TD} text-center`}>{baht(r.commission)}</td>
                <td className={`${TD} text-center`}>{r.sold}</td>
                <td className={`${TD} text-center`}>{r.orderAmount}</td>
                <td className={`${TD} text-center`}>{r.newCustomers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} onPageChange={setPage} className="mt-1" />
    </section>
  );
}

function TopProductsSection() {
  return (
    <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4">
      <h2 className="text-[18px] font-bold text-[var(--color-primary-700)] px-1 pb-3">
        10 สินค้าที่ขายดีสูงสุด
      </h2>
      <hr className="border-t border-[var(--color-neutral-200)] mb-3" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="text-left">
              <th className={`${TH} w-14 text-center rounded-l-lg`}>ลำดับ</th>
              <th className={TH}>สินค้า</th>
              <th className={`${TH} text-center`}>จำนวนที่ขายได้</th>
              <th className={`${TH} text-center`}>ค่าสั่งซื้อ</th>
              <th className={`${TH} text-center`}>ค่าคอมมิชชันโดยประมาณ (฿)</th>
              <th className={`${TH} rounded-r-lg`}>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {TOP_PRODUCTS.map((p, i) => (
              <tr key={p.name} className={TR_DATA}>
                <td className={`${TD} text-center text-[var(--color-neutral-600)]`}>{i + 1}</td>
                <td className={TD}>
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image}
                      alt=""
                      className="w-9 h-9 rounded-md object-cover shrink-0 border border-[var(--color-neutral-200)]"
                    />
                    <span className="truncate max-w-[300px]">{p.name}</span>
                  </div>
                </td>
                <td className={`${TD} text-center`}>{p.sold}</td>
                <td className={`${TD} text-center`}>{p.orders}</td>
                <td className={`${TD} text-center`}>{baht(p.commission)}</td>
                <td className={TD}>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-[14px] text-[var(--color-primary)] hover:underline"
                  >
                    <Icon name="link" size={16} />
                    รับลิงก์
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- page */

export default function AffiliateOverview() {
  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <AffiliateHeader />
      <div className="flex">
        <AffiliateSidebar active="ภาพรวม Affiliate" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 flex flex-col gap-6">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h1 className="text-[20px] font-bold text-[var(--color-neutral-900)]">
                ภาพรวม Affiliate
              </h1>
              <p className="text-[14px] text-[var(--color-neutral-500)] mt-1">
                ข้อมูลอัปเดตล่าสุด: วันนี้ เวลา 00:00 น.
              </p>
            </div>
            <DateRangePicker />
          </div>

          {/* Summary stats */}
          <section
            className="rounded-xl border border-white p-4 flex flex-col gap-6 shadow-[0_2px_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.08),0_0_2.5px_rgba(29,33,45,0.02)]"
            style={{
              background:
                "linear-gradient(117.48deg, #b5e1fe 9.83%, #f7fcfe 49.82%, #94ddff 105.71%)",
            }}
          >
            <h2 className="text-[20px] font-semibold text-[#025094] leading-tight">
              สรุปผลโดยรวม
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SUMMARY_STATS.map((s) => (
                <StatTile key={s.label} stat={s} />
              ))}
            </div>
          </section>

          <SummaryTableSection />
          <TopProductsSection />
        </main>
      </div>
    </div>
  );
}
