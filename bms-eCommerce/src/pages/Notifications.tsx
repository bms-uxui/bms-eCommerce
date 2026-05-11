import { useState } from "react";
import { Package, Megaphone, Tag, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ProfilePageShell from "../components/landing/ProfilePageShell";

type NotiCategory = "order" | "promo" | "brightify";
type TabKey = "all" | NotiCategory;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "order", label: "อัปเดตการสั่งซื้อสินค้า" },
  { key: "promo", label: "โปรโมชัน" },
  { key: "brightify", label: "อัปเดตจาก Brightify" },
];

type Notification = {
  id: string;
  category: NotiCategory;
  title: string;
  body: string;
  date: string;
  time: string;
  read: boolean;
};

const CATEGORY_META: Record<
  NotiCategory,
  { icon: LucideIcon; bg: string }
> = {
  order: { icon: Package, bg: "#21bdff" },
  promo: { icon: Tag, bg: "#21bdff" },
  brightify: { icon: Megaphone, bg: "#21bdff" },
};

const NOTIFICATIONS: Notification[] = [
  { id: "1", category: "promo", title: "โปรโมชันค่าจัดส่งฟรี", body: "ซื้อวันนี้ได้ส่วนลดฟรีค่าจัดส่ง ในวันสงกรานต์ 2569 นี้", date: "05/04/2569", time: "12:00 น.", read: false },
  { id: "2", category: "order", title: "คำสั่งซื้อ #BMS-20260218-03571 จัดส่งแล้ว", body: "พัสดุของคุณถูกส่งออกจากคลังแล้ว ติดตามสถานะได้ที่หน้าการสั่งซื้อ", date: "04/04/2569", time: "09:30 น.", read: false },
  { id: "3", category: "brightify", title: "อัปเดตเงื่อนไขการให้บริการ", body: "Brightify ได้ปรับปรุงนโยบายความเป็นส่วนตัว มีผลตั้งแต่ 1 พ.ค. 2569", date: "03/04/2569", time: "18:45 น.", read: false },
  { id: "4", category: "promo", title: "โค้ดส่วนลด 4.4 รับเลย!", body: "รับโค้ดส่วนลดสูงสุด 12% เฉพาะวันที่ 4 เม.ย. นี้เท่านั้น", date: "02/04/2569", time: "08:00 น.", read: true },
  { id: "5", category: "order", title: "ชำระเงินสำเร็จ #BMS-20260410-09234", body: "เราได้รับการชำระเงินของคุณเรียบร้อยแล้ว ขอบคุณที่ใช้บริการ", date: "01/04/2569", time: "20:12 น.", read: true },
  { id: "6", category: "brightify", title: "ฟีเจอร์ใหม่: ขอใบเสนอราคาออนไลน์", body: "ตอนนี้คุณสามารถขอใบเสนอราคาสำหรับสินค้าทางการแพทย์ได้แล้ว", date: "28/03/2569", time: "14:33 น.", read: true },
  { id: "7", category: "order", title: "คำสั่งซื้อ #BMS-20260413-07789 ถูกยกเลิก", body: "คำสั่งซื้อของคุณถูกยกเลิก หากมีการชำระเงินแล้วเราจะคืนเงินภายใน 3-5 วันทำการ", date: "25/03/2569", time: "11:05 น.", read: true },
  { id: "8", category: "promo", title: "BMS Member: รับ Point เพิ่ม 2 เท่า", body: "ช้อปครบทุก 100 บาท รับ Point เพิ่มเป็น 2 เท่า ตลอดเดือนเมษายน", date: "22/03/2569", time: "16:18 น.", read: true },
  { id: "9", category: "brightify", title: "ปิดปรับปรุงระบบชั่วคราว", body: "ระบบจะปิดปรับปรุงในวันที่ 30 มี.ค. เวลา 02:00–04:00 น.", date: "20/03/2569", time: "10:47 น.", read: true },
  { id: "10", category: "order", title: "ใบเสนอราคา #BMS-0987654-87 ได้รับการตอบกลับ", body: "ร้านค้าได้ส่งใบเสนอราคาให้คุณแล้ว กรุณาตรวจสอบและตอบรับ", date: "15/03/2569", time: "19:05 น.", read: true },
  { id: "11", category: "promo", title: "Flash Sale เริ่มแล้ว!", body: "ลดสูงสุด 50% เฉพาะเวลาจำกัด รีบช้อปก่อนสินค้าหมด", date: "10/03/2569", time: "08:55 น.", read: true },
  { id: "12", category: "brightify", title: "ยินดีต้อนรับสู่ Brightify", body: "ขอบคุณที่สมัครสมาชิก เริ่มต้นช้อปและสะสม Point ได้เลยวันนี้", date: "02/03/2569", time: "12:00 น.", read: true },
];

function NotiIcon({ category }: { category: NotiCategory }) {
  const meta = CATEGORY_META[category] ?? { icon: Star, bg: "#21bdff" };
  const Ic = meta.icon;
  return (
    <div
      className="w-16 h-16 rounded-lg shrink-0 flex items-center justify-center text-white"
      style={{ backgroundColor: meta.bg }}
    >
      <Ic size={28} />
    </div>
  );
}

function NotiRow({ noti }: { noti: Notification }) {
  return (
    <div
      className={`px-4 sm:px-6 ${noti.read ? "" : "bg-[#f7fcfe]"}`}
    >
      <div className="flex gap-4 items-center py-6 border-b border-[var(--color-neutral-200)]">
        <NotiIcon category={noti.category} />
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <p className="text-[16px] font-semibold text-black truncate">
            {noti.title}
          </p>
          <p className="text-[12px] text-[var(--color-neutral-500)] line-clamp-2">
            {noti.body}
          </p>
          <div className="flex gap-2 text-[12px] text-[var(--color-neutral-500)]">
            <span>{noti.date}</span>
            <span>{noti.time}</span>
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 px-4 py-1 rounded border border-[var(--color-neutral-300)] text-[12px] font-medium text-[var(--color-neutral-900)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition"
        >
          ดูรายละเอียด
        </button>
      </div>
    </div>
  );
}

export default function Notifications() {
  const [active, setActive] = useState<TabKey>("all");
  const [items, setItems] = useState<Notification[]>(NOTIFICATIONS);

  const visible =
    active === "all" ? items : items.filter((n) => n.category === active);
  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <ProfilePageShell activeKey="notifications">
      <div
        className="page-section-in bg-white rounded-2xl border border-[var(--color-neutral-300)] flex flex-col overflow-hidden"
        style={{ animationDelay: "200ms" }}
      >
        {/* Tab strip + mark-all */}
        <div className="flex items-center justify-between gap-4 pl-2 pr-4 py-2 border-b border-[var(--color-neutral-300)]">
          <div className="bg-[var(--color-neutral-200)] rounded-lg p-1 flex h-10 overflow-x-auto scrollbar-none">
            {TABS.map((tab) => {
              const isActive = active === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActive(tab.key)}
                  className={[
                    "shrink-0 flex items-center justify-center gap-2 h-8 px-4 py-1 rounded text-[14px] font-medium tracking-[-0.006em] transition",
                    isActive
                      ? "bg-[var(--color-primary)] text-white shadow-[0_0_1px_0_rgba(29,33,45,0.2),0_0_2px_0_rgba(29,33,45,0.08),0_2px_4px_0_rgba(29,33,45,0.08)]"
                      : "text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)]",
                  ].join(" ")}
                >
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.key === "all" && unreadCount > 0 && (
                    <span className="min-w-5 h-5 px-1 rounded-full bg-[var(--color-critical)] text-white text-[12px] flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={markAllRead}
            className="shrink-0 text-[16px] font-semibold text-[var(--color-primary)] hover:underline"
          >
            อ่านทั้งหมด
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col">
          {visible.length === 0 ? (
            <div className="py-16 text-center text-[14px] text-[var(--color-neutral-500)]">
              ไม่มีการแจ้งเตือน
            </div>
          ) : (
            visible.map((n) => <NotiRow key={n.id} noti={n} />)
          )}
        </div>
      </div>
    </ProfilePageShell>
  );
}
