import { useState } from "react";
import OrderCard, {
  type Order,
  type OrderStatus,
} from "../components/landing/OrderCard";
import TabBar from "../components/landing/TabBar";
import ProfilePageShell from "../components/landing/ProfilePageShell";
import paracetamol from "../assets/products/p02-paracetamol.jpg";
import vitaminC from "../assets/products/p04-vitamin-c.jpg";
import bpMonitor from "../assets/products/p03-bp-monitor.jpg";
import mask from "../assets/products/p05-mask.jpg";

type TabKey = "all" | OrderStatus;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "wait_pay", label: "รอชำระเงิน" },
  { key: "arranging", label: "กำลังจัดเตรียม" },
  { key: "shipping", label: "กำลังจัดส่ง" },
  { key: "delivered", label: "จัดส่งสำเร็จแล้ว" },
  { key: "received", label: "ได้รับสินค้าแล้ว" },
  { key: "cancelled", label: "ยกเลิก" },
];

const ORDERS: Order[] = [
  {
    id: "1",
    shop: "BMS.shop",
    orderNo: "ORD-20260218-03571",
    status: "wait_pay",
    placedAt: "18 ก.พ. 2569 - 15:00 น.",
    arriveBy: "1 เม.ย. - 3 เม.ย.",
    items: [
      {
        image: paracetamol,
        name: "ยาพาราเซตามอล 1000 mg แก้ปวดได้ดีทีเดียวนะkmkmkmkmksma",
        qty: 1,
        price: 334,
      },
    ],
    total: 368,
    address: "200 ถ.ลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900",
    paymentMethod: "QR PromptPay",
  },
  {
    id: "2",
    shop: "BMS.shop",
    orderNo: "ORD-20260218-03572",
    status: "arranging",
    placedAt: "18 ก.พ. 2569 - 15:00 น.",
    arriveBy: "1 เม.ย. - 3 เม.ย.",
    items: [
      {
        image: paracetamol,
        name: "ยาพาราเซตามอล 1000 mg แก้ปวดได้ดีทีเดียวนะkmkmkmkmksma",
        qty: 1,
        price: 334,
      },
    ],
    total: 368,
    address: "200 ถ.ลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900",
    paymentMethod: "QR PromptPay",
  },
  {
    id: "3",
    shop: "BMS.shop",
    orderNo: "ORD-20260218-03573",
    status: "shipping",
    placedAt: "18 ก.พ. 2569 - 15:00 น.",
    arriveBy: "1 เม.ย. - 3 เม.ย.",
    items: [
      {
        image: paracetamol,
        name: "ยาพาราเซตามอล 1000 mg แก้ปวดได้ดีทีเดียวนะkmkmkmkmksma",
        qty: 1,
        price: 334,
      },
    ],
    total: 368,
    address: "200 ถ.ลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900",
    paymentMethod: "QR PromptPay",
    carrier: "J&T Express",
    tracking: "763874o2836THA",
  },
  {
    id: "4",
    shop: "MediPlus",
    orderNo: "ORD-20260410-09234",
    status: "delivered",
    placedAt: "10 เม.ย. 2569 - 08:45 น.",
    arriveBy: "5 เม.ย. - 7 เม.ย.",
    items: [
      {
        image: vitaminC,
        name: "วิตามินซี 500 mg เสริมภูมิคุ้มกันร่างกาย",
        qty: 2,
        price: 150,
      },
    ],
    total: 300,
    address: "45 ซ.สุขุมวิท 101 แขวงบางนา เขตบางนา กรุงเทพฯ 10260",
    paymentMethod: "บัตรเครดิต",
    carrier: "Kerry Express",
    tracking: "849302jfhsdTHA",
  },
  {
    id: "5",
    shop: "HealthMart",
    orderNo: "ORD-20260412-04567",
    status: "received",
    placedAt: "12 เม.ย. 2569 - 12:30 น.",
    arriveBy: "8 เม.ย. - 10 เม.ย.",
    items: [
      {
        image: bpMonitor,
        name: "แคลเซียมเสริมกระดูกแข็งแรง พร้อมวิตามินดี",
        qty: 3,
        price: 220,
      },
    ],
    total: 660,
    address: "123 ถ.พระราม 4 แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110",
    paymentMethod: "โอนผ่านธนาคาร",
    carrier: "Flash Express",
    tracking: "bj3948dkjsTHA",
  },
  {
    id: "6",
    shop: "PharmaDirect",
    orderNo: "ORD-20260413-07789",
    status: "cancelled",
    placedAt: "13 เม.ย. 2569 - 14:10 น.",
    arriveBy: "9 เม.ย. - 11 เม.ย.",
    items: [
      {
        image: mask,
        name: "น้ำมันปลาโอเมก้า 3 บำรุงสมองและหัวใจ",
        qty: 1,
        price: 480,
      },
    ],
    total: 480,
    address: "78 ซ.รัชดาภิเษก 3 แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400",
    paymentMethod: "เงินสด",
  },
];

export default function Delivery() {
  const [active, setActive] = useState<TabKey>("all");

  const counts = TABS.reduce(
    (acc, t) => {
      acc[t.key] =
        t.key === "all"
          ? ORDERS.length
          : ORDERS.filter((o) => o.status === t.key).length;
      return acc;
    },
    {} as Record<TabKey, number>
  );

  const visible =
    active === "all" ? ORDERS : ORDERS.filter((o) => o.status === active);

  return (
    <ProfilePageShell activeKey="orders">
      <div
        className="flex flex-col gap-4 page-section-in"
        style={{ animationDelay: "200ms" }}
      >
        <TabBar
          sticky
          active={active}
          onChange={setActive}
          items={TABS.map((t) => ({ ...t, count: counts[t.key] }))}
        />
        {visible.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </ProfilePageShell>
  );
}
