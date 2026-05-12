import { useState } from "react";
import Icon from "../components/landing/Icon";
import { AffiliateHeader, AffiliateSidebar } from "../components/AffiliateChrome";
import DateRangePicker from "../components/DateRangePicker";
import { ChangeBadge, type BadgeTone } from "./SellerOverview";
import { makeProducts } from "../components/landing/mockData";
import facebookLogo from "../assets/social/facebook.png";
import instagramLogo from "../assets/social/instagram.png";
import youtubeLogo from "../assets/social/youtube.png";
import tiktokLogo from "../assets/social/tiktok.png";
import xLogo from "../assets/social/x.png";

type PlatformStat = {
  name: string;
  logo?: string;
  value: string;
  change: string;
  tone: BadgeTone;
};

const PLATFORMS: PlatformStat[] = [
  { name: "Facebook", logo: facebookLogo, value: "1,250", change: "12.5%", tone: "positive" },
  { name: "Instagram", logo: instagramLogo, value: "2,456", change: "8.0%", tone: "positive" },
  { name: "Youtube", logo: youtubeLogo, value: "790", change: "12.5%", tone: "critical" },
  { name: "TikTok", logo: tiktokLogo, value: "5,908", change: "0.0%", tone: "neutral" },
  { name: "X", logo: xLogo, value: "1,250", change: "12.5%", tone: "positive" },
  { name: "ช่องทางอื่นๆ", value: "580", change: "0.0%", tone: "neutral" },
];

const ROW_PLATFORMS = ["Facebook", "Instagram", "Facebook", "Youtube", "Facebook", "TikTok"];
const SHOPS = ["ร้านเสื้อชิคเด็นิม By ชนิกา", "ร้านแฟชั่นพาราไดซ์ By อลิสา", "ร้านสไตล์มินิมอล By พิชญา", "ร้านของดีราคาถูก By ธนากร", "ร้านนาฬิกาแบรนด์ By ณัฐพล", "ร้านกระเป๋าหนังแท้ By ศศิธร"];
const RATES = [2, 3, 1.5, 2.5, 1.8, 3];

const ROWS = makeProducts(SHOPS.length).map((p, i) => {
  const value = 578 + i * 113.5;
  const rate = RATES[i];
  return {
    id: p.id,
    no: `BMS6${(4526731894 + i * 137).toString()}`,
    date: "10/08/2026",
    platform: ROW_PLATFORMS[i],
    shop: SHOPS[i],
    shopId: `BMS${(4526731894 + i * 211).toString()}`,
    product: p.name,
    image: p.image,
    rate,
    value,
    commission: Number((value * (rate / 100) + 5).toFixed(2)),
  };
});

const TH = "px-3 py-3 text-[12px] font-medium text-[var(--color-neutral-500)] align-bottom whitespace-nowrap";
const TD = "px-3 py-3 text-[13px] text-[var(--color-neutral-900)] align-top";

function PlatformTile({ stat }: { stat: PlatformStat }) {
  return (
    <div className="bg-white border border-[var(--color-neutral-300)] rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {stat.logo ? (
          <img src={stat.logo} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
        ) : (
          <span className="w-7 h-7 rounded-full bg-[var(--color-neutral-200)] flex items-center justify-center shrink-0">
            <Icon name="world" size={14} className="text-[var(--color-neutral-700)]" />
          </span>
        )}
        <span className="text-[14px] text-[var(--color-neutral-900)] truncate">{stat.name}</span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-[24px] font-semibold text-[var(--color-neutral-900)] leading-tight">
          {stat.value}
          <span className="text-[14px] font-normal text-[var(--color-neutral-600)]"> บาท</span>
        </span>
        <ChangeBadge value={stat.change} tone={stat.tone} />
      </div>
    </div>
  );
}

export default function CommissionSummary() {
  const [page, setPage] = useState(2);

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <AffiliateHeader />
      <div className="flex">
        <AffiliateSidebar active="สรุปค่าคอมมิชชัน" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 flex flex-col gap-5">
          <nav className="flex items-center gap-1.5 text-[13px] text-[var(--color-neutral-500)]">
            <span>รายได้คอมมิชชัน</span>
            <span>/</span>
            <span className="text-[var(--color-neutral-900)]">สรุปค่าคอมมิชชัน</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h1 className="text-[20px] font-bold text-[var(--color-neutral-900)]">สรุปค่าคอมมิชชัน</h1>
              <p className="text-[14px] text-[var(--color-neutral-500)] mt-1">
                ข้อมูลอัปเดตล่าสุด: วันนี้ เวลา 00:00 น.
              </p>
            </div>
            <DateRangePicker />
          </div>

          {/* Revenue + platform stats */}
          <section
            className="rounded-2xl border border-white p-4 sm:p-5 flex flex-col gap-4 shadow-[0_2px_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.08),0_0_2.5px_rgba(29,33,45,0.02)]"
            style={{
              background: "linear-gradient(117.48deg, #b5e1fe 9.83%, #f7fcfe 49.82%, #94ddff 105.71%)",
            }}
          >
            {/* Big total card */}
            <div
              className="rounded-xl p-6 text-white flex flex-col gap-4 shadow-[0_2px_4px_rgba(29,33,45,0.08)]"
              style={{
                background: "linear-gradient(108deg, #abe6ff 0%, #21bdff 14%, #0485f7 48%, #036ac6 88%)",
              }}
            >
              <p className="text-[16px]">รายได้คอมมิชชันสะสม</p>
              <div className="flex items-baseline gap-2">
                <span className="text-[18px]">฿</span>
                <span className="text-[36px] font-bold leading-none [text-shadow:0_1px_4px_rgba(0,0,0,0.15)]">
                  10,586
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ChangeBadge value="12.5%" tone="positive" size="lg" />
                <span className="text-[16px] whitespace-nowrap">เปรียบเทียบจากช่วงก่อน</span>
              </div>
            </div>

            {/* Platform tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLATFORMS.map((p) => (
                <PlatformTile key={p.name} stat={p} />
              ))}
            </div>
          </section>

          {/* History table */}
          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[18px] font-bold text-[var(--color-primary-700)]">
                ประวัติการได้รับค่าคอมมิชชัน
              </h2>
              <button
                type="button"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--color-primary-100)] text-[var(--color-primary-700)] text-[14px] font-medium hover:brightness-95 transition"
              >
                <Icon name="download" size={18} />
                ดาวน์โหลดรายงาน
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[var(--color-neutral-200)]">
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="bg-[#f1f6fc] text-left">
                    <th className={TH}>เลขที่รายการ</th>
                    <th className={TH}>แพลตฟอร์ม</th>
                    <th className={TH}>ข้อมูลร้านค้า</th>
                    <th className={TH}>ข้อมูลสินค้า</th>
                    <th className={`${TH} text-right`}>มูลค่าค่าสั่งซื้อ (฿)</th>
                    <th className={`${TH} text-right`}>ค่าคอมมิชชัน (฿)</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.id} className="border-t border-[var(--color-neutral-200)]">
                      <td className={TD}>
                        <div className="font-medium text-[var(--color-neutral-900)]">{r.no}</div>
                        <div className="text-[12px] text-[var(--color-neutral-500)] mt-0.5">{r.date}</div>
                      </td>
                      <td className={TD}>{r.platform}</td>
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
                      <td className={`${TD} text-right whitespace-nowrap`}>
                        {r.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className={`${TD} text-right whitespace-nowrap text-[var(--color-positive-700)] font-medium`}>
                        +{r.commission.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-[14px] text-[var(--color-neutral-600)]">
                <span>10,488 รายการ</span>
                <span className="flex items-center gap-1">
                  แสดง
                  <span className="inline-flex items-center gap-2 h-8 px-2.5 rounded-lg border border-[var(--color-neutral-300)] text-[var(--color-neutral-900)] font-medium">
                    20
                    <Icon name="chevron-down" size={14} className="text-[var(--color-neutral-600)]" />
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="min-w-8 h-8 px-2 rounded-lg text-[var(--color-neutral-700)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] flex items-center justify-center"
                >
                  <Icon name="chevron-left" size={16} />
                </button>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={[
                      "min-w-8 h-8 px-2 rounded-lg text-[14px] flex items-center justify-center transition-colors",
                      n === page
                        ? "bg-[var(--color-primary)] text-white font-medium"
                        : "text-[var(--color-neutral-700)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                    ].join(" ")}
                  >
                    {n}
                  </button>
                ))}
                <span className="px-1 text-[var(--color-neutral-500)]">…</span>
                <button
                  type="button"
                  onClick={() => setPage(12)}
                  className="min-w-8 h-8 px-2 rounded-lg text-[14px] text-[var(--color-neutral-700)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] flex items-center justify-center"
                >
                  12
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="min-w-8 h-8 px-2 rounded-lg text-[var(--color-neutral-700)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)] flex items-center justify-center"
                >
                  <Icon name="chevron-right" size={16} />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
