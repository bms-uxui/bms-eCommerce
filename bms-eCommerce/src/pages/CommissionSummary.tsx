import { useState } from "react";
import Icon from "../components/landing/Icon";
import Pagination from "../components/Pagination";
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
  { name: "Facebook", logo: facebookLogo, value: "790", change: "12.5%", tone: "critical" },
  { name: "Instagram", logo: instagramLogo, value: "1,250", change: "12.5%", tone: "critical" },
  { name: "Youtube", logo: youtubeLogo, value: "2,456", change: "12.5%", tone: "positive" },
  { name: "Tiktok", logo: tiktokLogo, value: "1,250", change: "12.5%", tone: "critical" },
  { name: "X", logo: xLogo, value: "5,908", change: "0.0%", tone: "neutral" },
  { name: "อื่นๆ", value: "580", change: "12.5%", tone: "positive" },
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

const TH = "px-3 py-2.5 text-[12px] font-medium text-[var(--color-neutral-500)] align-bottom bg-[#EFF9FE]";
const TD = "px-3 py-3 text-[13px] text-[var(--color-neutral-900)] align-top";

function PlatformTile({ stat }: { stat: PlatformStat }) {
  return (
    <div className="bg-white rounded-xl p-4 flex gap-4 items-start shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)]">
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        <p className="text-[12px] text-[var(--color-neutral-500)] leading-snug">
          ค่าคอมมิชชันจาก {stat.name}
        </p>
        <div className="flex items-end gap-2">
          <span className="text-[24px] font-bold text-black leading-none">{stat.value}</span>
          <span className="text-[16px] text-[var(--color-neutral-900)] leading-none">บาท</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ChangeBadge value={stat.change} tone={stat.tone} />
          <span className="text-[12px] text-[var(--color-neutral-500)]">เปลี่ยนแปลงจากวันก่อน</span>
        </div>
      </div>
      {stat.logo ? (
        <img src={stat.logo} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
      ) : (
        <span className="w-9 h-9 rounded-lg bg-[var(--color-neutral-200)] flex items-center justify-center shrink-0">
          <Icon name="world" size={18} className="text-[var(--color-neutral-700)]" />
        </span>
      )}
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
          <div className="flex flex-col gap-4">
            {/* Big total card */}
            <div
              className="relative rounded-xl h-[189px] overflow-hidden shadow-[0_16px_32px_rgba(29,33,45,0.1),0_1px_4px_rgba(29,33,45,0.15),0_0_1px_rgba(29,33,45,0.2)]"
              style={{
                background: "linear-gradient(160deg, #5cc6ff 0%, #0a8df7 42%, #025094 100%)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(115deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 22%), linear-gradient(245deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 22%)",
                }}
              />
              <div className="relative h-full flex flex-col items-center justify-center gap-5 text-white text-center px-4">
                <p className="text-[16px]">รายได้ทั้งหมดของคุณ</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-[40px] leading-none">฿</span>
                  <span className="text-[40px] font-bold leading-none [text-shadow:0_4px_8px_rgba(29,33,45,0.2)]">
                    10,586
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ChangeBadge value="12.5%" tone="positive" size="lg" />
                  <span className="text-[16px]">เปลี่ยนแปลงจากวันก่อน</span>
                </div>
              </div>
            </div>

            {/* Platform tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLATFORMS.map((p) => (
                <PlatformTile key={p.name} stat={p} />
              ))}
            </div>
          </div>

          {/* History table */}
          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[18px] font-bold text-[var(--color-primary-700)]">
                ประวัติการได้รับค่าคอมมิชชัน
              </h2>
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
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="text-left">
                    <th className={`${TH} rounded-l-lg`}>เลขที่รายการ</th>
                    <th className={TH}>แพลตฟอร์ม</th>
                    <th className={TH}>ข้อมูลร้านค้า</th>
                    <th className={TH}>ข้อมูลสินค้า</th>
                    <th className={`${TH} text-center`}>มูลค่าค่าสั่งซื้อ (฿)</th>
                    <th className={`${TH} text-center rounded-r-lg`}>ค่าคอมมิชชัน (฿)</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.id} className="border-b border-[var(--color-neutral-200)] last:border-b-0">
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
                      <td className={`${TD} text-center whitespace-nowrap`}>
                        {r.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className={`${TD} text-center whitespace-nowrap text-[var(--color-positive-700)] font-medium`}>
                        +{r.commission.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
