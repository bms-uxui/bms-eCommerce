import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ProfilePageShell from "../components/landing/ProfilePageShell";
import bmsLogo from "../assets/bms-logo-blue.png";
import paracetamol from "../assets/products/p02-paracetamol.jpg";
import vitaminC from "../assets/products/p04-vitamin-c.jpg";
import bpMonitor from "../assets/products/p03-bp-monitor.jpg";
import mask from "../assets/products/p05-mask.jpg";

type PointEntry = {
  id: string;
  image: string;
  name: string;
  dateTime: string;
  amount: string;
  points: number; // positive = earned, negative = redeemed
};

const HISTORY: PointEntry[] = [
  { id: "1", image: paracetamol, name: "ยาพาราเซตามอล 1000 mg แก้ปวดได้ดีทีเดียวนะkmkmkmkmksma", dateTime: "12/01/2569 15.50", amount: "฿334.00", points: 15 },
  { id: "2", image: vitaminC, name: "วิตามินซี 500 mg เสริมภูมิคุ้มกันร่างกาย", dateTime: "10/01/2569 09.12", amount: "฿150.00", points: 15 },
  { id: "3", image: bpMonitor, name: "เครื่องวัดความดันโลหิตอัตโนมัติ รุ่นพกพา", dateTime: "08/01/2569 18.40", amount: "฿1,200.00", points: 120 },
  { id: "4", image: mask, name: "หน้ากากอนามัยทางการแพทย์ 50 ชิ้น", dateTime: "05/01/2569 11.05", amount: "฿89.00", points: 8 },
  { id: "5", image: paracetamol, name: "ใช้ Point แลกส่วนลด", dateTime: "03/01/2569 20.22", amount: "- ฿2.00", points: -200 },
  { id: "6", image: vitaminC, name: "แคลเซียมเสริมกระดูกแข็งแรง พร้อมวิตามินดี", dateTime: "28/12/2568 14.33", amount: "฿660.00", points: 66 },
  { id: "7", image: bpMonitor, name: "น้ำมันปลาโอเมก้า 3 บำรุงสมองและหัวใจ", dateTime: "22/12/2568 16.18", amount: "฿480.00", points: 48 },
  { id: "8", image: mask, name: "เจลล้างมือแอลกอฮอล์ 70% ขนาด 500 ml", dateTime: "15/12/2568 10.47", amount: "฿129.00", points: 12 },
  { id: "9", image: paracetamol, name: "ใช้ Point แลกส่วนลด", dateTime: "10/12/2568 19.05", amount: "- ฿1.00", points: -100 },
  { id: "10", image: vitaminC, name: "วิตามินบีรวม บำรุงระบบประสาท", dateTime: "02/12/2568 08.55", amount: "฿220.00", points: 22 },
];

function MemberCard() {
  return (
    <div
      className="relative w-full max-w-[330px] mx-auto aspect-[330/196] rounded-2xl overflow-hidden text-white border-[0.5px] border-white shadow-[0_0_1px_rgba(29,33,45,0.2),0_1px_4px_rgba(29,33,45,0.15),0_16px_32px_rgba(29,33,45,0.1)]"
      style={{ backgroundColor: "#023563" }}
    >
      {/* Glossy radial shine layers (Ellipse 33 / 34 from Figma) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(140% 120% at 50% -20%, rgba(95,190,255,0.85) 0%, rgba(40,130,210,0.45) 35%, rgba(2,53,99,0) 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 0%, rgba(120,205,255,0.5) 0%, rgba(2,53,99,0) 55%)",
        }}
      />
      {/* Concentric arc lines bleeding off the top-right (Ellipse 35 ×2) */}
      <div className="absolute -top-[160px] left-[195px] w-[279px] h-[279px] rounded-full border border-white/20" />
      <div className="absolute -top-[160px] left-[264px] w-[279px] h-[279px] rounded-full border border-white/15" />

      {/* Points + logo */}
      <div className="absolute left-[17px] top-[14px] flex items-center gap-2">
        <img
          src={bmsLogo}
          alt=""
          className="w-16 h-16 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
        />
        <div className="flex flex-col leading-[22px]">
          <p className="text-[32px] sm:text-[36px] font-bold">237</p>
          <p className="text-[14px]">Point สะสมทั้งหมด</p>
        </div>
      </div>

      {/* Footer bar */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-3">
        <div className="flex flex-col gap-1">
          <p className="text-[10px]">บัตรสมาชิกของ</p>
          <p className="text-[16px] font-medium [text-shadow:0_1px_1px_rgba(5,69,124,0.27)]">
            Okinowa Kawasaki
          </p>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <p className="text-[10px]">Point จะหมดอายุ</p>
          <p className="text-[16px] font-medium [text-shadow:0_1px_1px_rgba(5,69,124,0.27)]">
            12/12/2569
          </p>
        </div>
      </div>
    </div>
  );
}

function HistoryRow({ entry }: { entry: PointEntry }) {
  const earned = entry.points >= 0;
  return (
    <div className="flex items-center gap-4 px-4 sm:px-8 py-2">
      <div className="flex flex-1 min-w-0 items-center gap-3 sm:gap-4">
        <img
          src={entry.image}
          alt=""
          className="w-10 h-10 rounded-lg object-cover shrink-0 bg-[var(--color-neutral-200)]"
        />
        <div className="flex flex-col min-w-0">
          <p className="text-[14px] font-medium text-[var(--color-neutral-900)] truncate">
            {entry.name}
          </p>
          <p className="text-[12px] text-[var(--color-neutral-500)]">
            {entry.dateTime}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0 text-right">
        <p className="text-[14px] text-[var(--color-neutral-900)] tabular-nums">
          {entry.amount}
        </p>
        <p
          className={`text-[14px] font-bold tabular-nums ${
            earned ? "text-[#6ace13]" : "text-[var(--color-critical)]"
          }`}
        >
          {earned ? `+ ${entry.points}` : `- ${Math.abs(entry.points)}`}
        </p>
      </div>
    </div>
  );
}

export default function BmsMember() {
  const [year] = useState("2569");

  return (
    <ProfilePageShell activeKey="member">
      <div
        className="page-section-in bg-white rounded-2xl border border-[var(--color-neutral-300)] flex flex-col"
        style={{ animationDelay: "200ms" }}
      >
        {/* Card + terms */}
        <div className="flex flex-col gap-6 p-4 sm:p-8">
          <MemberCard />

          <div className="flex flex-col gap-4">
            <h3 className="text-[16px] font-semibold text-[#011b31]">
              เงื่อนไขการใช้งาน
            </h3>
            <ol className="list-decimal pl-5 text-[12px] leading-5 flex flex-col gap-2 text-[var(--color-neutral-900)]">
              <li>
                <span className="font-semibold">เงื่อนไขการสะสม Point BMS Member</span>{" "}
                <span className="text-[var(--color-neutral-600)]">
                  เมื่อซื้อสินค้าครบทุก 100 บาท รับ 10 Point โดยต้องสมัครสมาชิกและล็อกอินเข้าสู่ระบบให้เรียบร้อยก่อน
                </span>
              </li>
              <li>
                <span className="font-semibold">การใช้ Point สะสม</span>{" "}
                <span className="text-[var(--color-neutral-600)]">
                  ทุกๆ 100 Point สามารถแลกเป็นส่วนลดได้ 1 บาท เพื่อเป็นส่วนลดในการชำระสินค้า
                </span>
              </li>
            </ol>
            <p className="text-[12px] leading-5">
              <span className="font-semibold text-[var(--color-critical)]">หมายเหตุ</span>{" "}
              <span className="font-semibold text-[var(--color-neutral-900)]">
                สินค้าที่ไม่ร่วมรายการ :
              </span>{" "}
              <span className="text-[var(--color-neutral-600)]">
                Point ไม่สามารถสะสมได้จากการซื้อสินค้าประเภทเครื่องดื่มแอลกอฮอล์, บุหรี่, บัตรเติมเงิน และสินค้าที่ไม่ร่วมรายการตามที่บริษัทกำหนด
              </span>
            </p>
          </div>
        </div>

        {/* Point history */}
        <div className="border-t border-[var(--color-neutral-300)]">
          <div className="flex items-center justify-between px-4 sm:px-8 py-4">
            <h3 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-primary-600)]">
              ประวัติสะสม Point
            </h3>
            <div className="relative">
              <select
                value={year}
                onChange={() => {}}
                className="appearance-none bg-white border border-[var(--color-neutral-300)] rounded-lg h-8 pl-3 pr-8 text-[16px] font-semibold text-black focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="2569">2569</option>
                <option value="2568">2568</option>
                <option value="2567">2567</option>
              </select>
              <ChevronDown
                size={20}
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-neutral-700)]"
              />
            </div>
          </div>
          <div className="border-t border-[var(--color-neutral-300)] flex flex-col gap-3 py-4 max-h-[560px] overflow-y-auto">
            {HISTORY.map((e) => (
              <HistoryRow key={e.id} entry={e} />
            ))}
          </div>
        </div>
      </div>
    </ProfilePageShell>
  );
}
