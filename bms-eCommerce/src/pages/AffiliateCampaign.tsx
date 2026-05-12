import Icon from "../components/landing/Icon";
import { AffiliateHeader, AffiliateSidebar } from "../components/AffiliateChrome";
import DateRangePicker from "../components/DateRangePicker";
import { makeProducts } from "../components/landing/mockData";

const NAMES = [
  "แคมเปญเปิดเทอมรับน้องใหม่ 2026",
  "Back to School ลดสูงสุด 50%",
  "แคมเปญชุดนักเรียนคุณภาพ",
  "โปรโมตอุปกรณ์การเรียนยอดนิยม",
  "แคมเปญสุขภาพดีรับเปิดเทอม",
  "ลดทั้งร้านต้อนรับเดือนพฤษภาคม",
  "แคมเปญสินค้าแฟชั่นวัยรุ่น",
  "โปรโมตเครื่องสำอางขายดี",
  "แคมเปญของใช้ในบ้านราคาพิเศษ",
  "แคมเปญรองเท้าและกระเป๋านักเรียน",
  "Mid Year Sale 2026",
  "แคมเปญสินค้าอิเล็กทรอนิกส์",
];
const RATES = [3.0, 5.0, 2.5, 4.0, 1.8, 6.0, 3.5, 2.2, 4.5, 3.0, 5.5, 2.0];

const CAMPAIGNS = makeProducts(NAMES.length).map((p, i) => ({
  id: p.id,
  image: p.image,
  name: NAMES[i],
  rate: RATES[i],
  start: `0${(i % 9) + 1}/04/2026`,
  end: `${15 + (i % 15)}/05/2026`,
}));

function CampaignCard({ campaign }: { campaign: (typeof CAMPAIGNS)[number] }) {
  return (
    <div className="flex flex-col bg-white border border-[var(--color-neutral-300)] rounded-xl overflow-hidden hover:shadow-md hover:border-[var(--color-primary-400)] transition-all">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-neutral-200)]">
        <img src={campaign.image} alt={campaign.name} className="absolute inset-0 w-full h-full object-cover" />
        <span className="absolute top-2 left-2 bg-[var(--color-primary)] text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
          กำลังดำเนินการ
        </span>
      </div>
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        <p className="text-[13px] font-medium text-[var(--color-neutral-900)] leading-snug line-clamp-2 min-h-[34px]">
          {campaign.name}
        </p>
        <div className="text-[12px] text-[var(--color-neutral-600)] leading-relaxed">
          <div>เริ่ม: {campaign.start}</div>
          <div>สิ้นสุด: {campaign.end}</div>
        </div>
        <p className="text-[12px] text-[var(--color-positive-700)] font-medium">
          คอมมิชชัน สูงสุด {campaign.rate.toFixed(1)}%
        </p>
        <button
          type="button"
          className="mt-1 h-8 rounded-lg bg-[var(--color-primary)] text-white text-[13px] font-medium inline-flex items-center justify-center gap-1 hover:brightness-110 transition"
        >
          <Icon name="link" size={14} />
          เข้าร่วมแคมเปญ
        </button>
      </div>
    </div>
  );
}

export default function AffiliateCampaign() {
  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <AffiliateHeader />
      <div className="flex">
        <AffiliateSidebar active="แคมเปญ Affiliate" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h1 className="text-[20px] font-bold text-[var(--color-neutral-900)]">แคมเปญ Affiliate</h1>
              <p className="text-[14px] text-[var(--color-neutral-500)] mt-1">
                แนะนำแคมเปญที่กำลังเป็นที่นิยม เพื่อเพิ่มยอดขายของคุณ
              </p>
            </div>
            <DateRangePicker />
          </div>

          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
              {CAMPAIGNS.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
