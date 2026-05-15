import { useState } from "react";
import { Link } from "react-router";
import Icon from "../components/landing/Icon";
import Pagination from "../components/Pagination";
import StatusBadge, { type StatusTone } from "../components/StatusBadge";
import { AffiliateHeader, AffiliateSidebar } from "../components/AffiliateChrome";
import DateRangePicker from "../components/DateRangePicker";
import { makeProducts } from "../components/landing/mockData";

type Status = { label: string; tone: StatusTone };
const STATUSES: Status[] = [
  { label: "ได้รับสินค้าแล้ว", tone: "success" },
  { label: "ได้รับสินค้าแล้ว", tone: "success" },
  { label: "ได้รับสินค้าแล้ว", tone: "success" },
  { label: "ยกเลิกออเดอร์", tone: "danger" },
  { label: "กำลังจัดส่ง", tone: "info" },
  { label: "ได้รับสินค้าแล้ว", tone: "success" },
];
const SHOPS = ["ร้านเสื้อชิคเด็นิม By ชนิกา", "ร้านแฟชั่นพาราไดซ์ By อลิสา", "ร้านสไตล์มินิมอล By พิชญา", "ร้านของดีราคาถูก By ธนากร", "ร้านนาฬิกาแบรนด์ By ณัฐพล", "ร้านกระเป๋าหนังแท้ By ศศิธร"];
const RATES = [2, 3, 1.5, 2.5, 1.8, 3];

const ROWS = makeProducts(SHOPS.length).map((p, i) => {
  const value = 578 + i * 113.5;
  const rate = RATES[i];
  const status = STATUSES[i];
  return {
    id: p.id,
    orderNo: `BMS6${(4526731894 + i * 137).toString()}`,
    orderDate: `10/08/2026`,
    status,
    shop: SHOPS[i],
    shopId: `BMS${(4526731894 + i * 211).toString()}`,
    product: p.name,
    image: p.image,
    rate,
    value,
    commission: status.tone === "danger" ? 0 : Number((value * (rate / 100) + 5).toFixed(2)),
  };
});

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 min-w-0">
      <span className="text-[13px] text-[var(--color-neutral-700)]">{label}</span>
      {children}
    </label>
  );
}

function TextInput({ placeholder }: { placeholder: string }) {
  return (
    <input
      placeholder={placeholder}
      className="h-10 px-3 rounded-lg border border-[var(--color-neutral-300)] bg-white text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] outline-none focus:border-[var(--color-primary)]"
    />
  );
}

function FakeSelect({ placeholder }: { placeholder: string }) {
  return (
    <button
      type="button"
      className="h-10 px-3 rounded-lg border border-[var(--color-neutral-300)] bg-white text-[14px] text-[var(--color-neutral-500)] flex items-center justify-between gap-2 hover:border-[var(--color-primary-400)] transition-colors"
    >
      <span>{placeholder}</span>
      <Icon name="chevron-down" size={16} className="text-[var(--color-neutral-600)]" />
    </button>
  );
}

const TH = "px-3 py-2.5 text-[12px] font-medium text-[var(--color-neutral-500)] align-bottom bg-[#EFF9FE]";
const TD = "px-3 py-3 text-[13px] text-[var(--color-neutral-900)] align-top";

export default function OrderReport() {
  const [page, setPage] = useState(2);

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <AffiliateHeader />
      <div className="flex">
        <AffiliateSidebar active="รายงานคำสั่งซื้อ" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 flex flex-col gap-5">
          <nav className="flex items-center gap-1.5 text-[13px] text-[var(--color-neutral-500)]">
            <span>รายงาน</span>
            <span>/</span>
            <span className="text-[var(--color-neutral-900)]">รายงานคำสั่งซื้อ</span>
          </nav>

          {/* Filters */}
          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-[20px] font-bold text-[var(--color-primary-700)]">รายงานคำสั่งซื้อ</h1>
              <p className="text-[13px] text-[var(--color-neutral-500)]">
                ข้อมูลจะอัปเดตทุกวันเวลา 00:00 AM
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
              <FilterField label="วันที่คำสั่งซื้อ">
                <DateRangePicker className="!flex w-full" />
              </FilterField>
              <FilterField label="สถานะการคำสั่งซื้อ">
                <FakeSelect placeholder="เลือกสถานะ" />
              </FilterField>
              <FilterField label="รหัสคำสั่งซื้อ">
                <TextInput placeholder="กรุณากรอกข้อมูล" />
              </FilterField>
              <FilterField label="ชื่อร้านค้า">
                <TextInput placeholder="กรุณากรอกข้อมูล" />
              </FilterField>
              <FilterField label="ชื่อสินค้า">
                <TextInput placeholder="กรุณากรอกข้อมูล" />
              </FilterField>
              <FilterField label="ประเภทสินค้า">
                <FakeSelect placeholder="เลือกประเภทสินค้า" />
              </FilterField>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                className="h-10 px-8 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
              >
                ค้นหา
              </button>
              <button
                type="button"
                className="h-10 px-8 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[14px] font-medium hover:bg-[var(--color-primary-100)] transition"
              >
                รีเซ็ต
              </button>
            </div>
          </section>

          {/* Table */}
          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[18px] font-bold text-[var(--color-primary-700)]">แสดงผลแบบตาราง</h2>
              <button
                type="button"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
              >
                <Icon name="download" size={18} />
                ดาวน์โหลดรายงาน
              </button>
            </div>

            <hr className="border-t border-[var(--color-neutral-200)]" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse">
                <thead>
                  <tr className="text-left">
                    <th className={`${TH} rounded-l-lg`}>หมายเลขคำสั่งซื้อ</th>
                    <th className={TH}>สถานะการสั่งซื้อ</th>
                    <th className={TH}>ข้อมูลร้านค้า</th>
                    <th className={TH}>ข้อมูลสินค้า</th>
                    <th className={TH}>รายละเอียดคอมมิชชัน</th>
                    <th className={`${TH} text-center`}>มูลค่าค่าสั่งซื้อ (฿)</th>
                    <th className={`${TH} text-center rounded-r-lg`}>ค่าคอมมิชชัน (฿)</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.id} className="border-b border-[var(--color-neutral-200)] last:border-b-0">
                      <td className={TD}>
                        <div className="font-medium text-[var(--color-neutral-900)]">{r.orderNo}</div>
                        <div className="text-[12px] text-[var(--color-neutral-500)] mt-0.5">
                          วันที่สั่ง: {r.orderDate}
                        </div>
                      </td>
                      <td className={TD}>
                        <StatusBadge tone={r.status.tone}>{r.status.label}</StatusBadge>
                      </td>
                      <td className={TD}>
                        <div className="flex items-start gap-2 min-w-0">
                          <img src={r.image} alt="" className="w-9 h-9 rounded-md object-cover shrink-0 border border-[var(--color-neutral-200)]" />
                          <div className="min-w-0">
                            <div className="truncate max-w-[200px]">{r.shop}</div>
                            <div className="text-[12px] text-[var(--color-neutral-500)]">ID: {r.shopId}</div>
                          </div>
                        </div>
                      </td>
                      <td className={TD}>
                        <div className="flex items-start gap-2 min-w-0">
                          <img src={r.image} alt="" className="w-9 h-9 rounded-md object-cover shrink-0 border border-[var(--color-neutral-200)]" />
                          <div className="min-w-0">
                            <div className="truncate max-w-[200px]">{r.product}</div>
                            <div className="text-[12px] text-[var(--color-neutral-500)]">อัตราคอมมิชชัน {r.rate}%</div>
                          </div>
                        </div>
                      </td>
                      <td className={TD}>คอมมิชชันรับจากการซื้อ {r.rate}%</td>
                      <td className={`${TD} text-center whitespace-nowrap`}>
                        {r.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className={`${TD} text-center whitespace-nowrap`}>
                        {r.commission.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination page={page} onPageChange={setPage} />
          </section>
        </main>
      </div>
    </div>
  );
}
