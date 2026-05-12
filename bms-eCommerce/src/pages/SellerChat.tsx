import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import ChatWorkspace, { type ChatConversation, type ChatProductRef } from "../components/landing/ChatWorkspace";
import ginseng from "../assets/products/p08-ginseng.jpg";
import bpMonitor from "../assets/products/p03-bp-monitor.jpg";
import vitaminC from "../assets/products/p04-vitamin-c.jpg";
import shopAvatar from "../assets/store-avatar.png";

const av = (n: number) => `https://i.pravatar.cc/120?img=${n}`;

const PROD_GINSENG: ChatProductRef = { img: ginseng, name: "ชาอูหลงผสมดอกหอมหมื่นลี้", price: 150, oldPrice: 790, rating: 4.7, sold: "14.5k" };
const PROD_BP: ChatProductRef = { img: bpMonitor, name: "เครื่องวัดความดัน BP-200", price: 1290, oldPrice: 1690, rating: 4.8, sold: "2.1k" };
const PROD_VITC: ChatProductRef = { img: vitaminC, name: "วิตามินซี 1000mg (60 เม็ด)", price: 290, oldPrice: 390, rating: 4.9, sold: "8.7k" };

const CONVERSATIONS: ChatConversation[] = [
  {
    id: "c1", name: "Napat W.", avatar: av(45), online: true, lastActive: "กำลังออนไลน์อยู่",
    msgs: [
      { id: "m1", kind: "text", from: "them", text: "สวัสดีค่ะ ชาอูหลงตัวนี้มีส่วนผสมอะไรบ้างคะ?", time: "13:20 น." },
      { id: "m2", kind: "text", from: "me", text: "สวัสดีครับคุณลูกค้า เป็นชาอูหลงผสมดอกหอมหมื่นลี้ หอมธรรมชาติ ไม่ใส่สารกันบูดครับ", time: "13:22 น." },
      { id: "m3", kind: "product", from: "me", product: PROD_GINSENG, time: "13:23 น." },
      { id: "m4", kind: "text", from: "them", text: "ตอนนี้ลด 81% เลยเหรอคะ ของแท้ไหมคะ", time: "13:24 น." },
      { id: "m5", kind: "text", from: "me", text: "ของแท้ 100% ครับ มีใบรับรอง อย. ส่งฟรีเมื่อซื้อครบ 500 บาทครับ", time: "13:25 น." },
      { id: "m6", kind: "sticker", from: "them", emoji: "😄", time: "13:26 น." },
      { id: "m7", kind: "text", from: "them", text: "งั้นขอ 2 กล่องค่ะ เดี๋ยวกดสั่งเลย ขอบคุณนะคะ", time: "13:27 น." },
    ],
  },
  {
    id: "c2", name: "ร้านสมุนไพรบ้านสวน", avatar: shopAvatar, online: true, lastActive: "กำลังออนไลน์อยู่",
    msgs: [
      { id: "m1", kind: "text", from: "them", text: "สนใจสั่งซื้อจำนวนมาก มีราคาส่งไหมครับ", time: "10:05 น." },
      { id: "m2", kind: "text", from: "me", text: "มีครับ สั่งตั้งแต่ 50 ชิ้นขึ้นไปลดเพิ่ม 10% เดี๋ยวส่งใบเสนอราคาให้นะครับ", time: "10:12 น." },
      { id: "m3", kind: "text", from: "them", text: "ขอบคุณครับ รออยู่นะครับ", time: "10:15 น." },
    ],
  },
  {
    id: "c3", name: "Ploy K.", avatar: av(31), online: false, lastActive: "ออนไลน์ล่าสุด 2 ชั่วโมงที่แล้ว",
    msgs: [
      { id: "m1", kind: "text", from: "them", text: "ของยังไม่ถึงเลยค่ะ สั่งไปตั้งแต่วันจันทร์", time: "09:30 น." },
      { id: "m2", kind: "text", from: "me", text: "ขออภัยด้วยครับ ขอเลขออเดอร์หน่อยครับ เดี๋ยวเช็คให้", time: "09:34 น." },
      { id: "m3", kind: "text", from: "them", text: "#BR250148 ค่ะ", time: "09:35 น." },
      { id: "m4", kind: "text", from: "me", text: "พัสดุอยู่ระหว่างจัดส่งครับ คาดว่าถึงพรุ่งนี้ ติดตามได้ที่เลข TH... นะครับ", time: "09:40 น." },
    ],
  },
  {
    id: "c4", name: "คุณวิชัย ตันสกุล", avatar: av(13), online: true, lastActive: "กำลังออนไลน์อยู่",
    msgs: [
      { id: "m1", kind: "text", from: "me", text: "สวัสดีครับ ขอบคุณที่อุดหนุนนะครับ มีโปรเครื่องวัดความดันลดราคาอยู่ครับ", time: "14:00 น." },
      { id: "m2", kind: "product", from: "me", product: PROD_BP, time: "14:00 น." },
      { id: "m3", kind: "text", from: "them", text: "ใช้กับผู้สูงอายุได้ไหมครับ จอใหญ่ไหม", time: "14:15 น." },
      { id: "m4", kind: "text", from: "me", text: "ได้ครับ จอ LCD ขนาดใหญ่ ตัวเลขชัด มีเสียงพูดภาษาไทยด้วยครับ", time: "14:18 น." },
    ],
  },
  {
    id: "c5", name: "Beam_88", avatar: av(67), online: false, lastActive: "ออนไลน์ล่าสุดเมื่อวาน",
    msgs: [
      { id: "m1", kind: "text", from: "them", text: "ขอคืนสินค้าได้ไหมคะ กล่องบุบ", time: "เมื่อวาน" },
      { id: "m2", kind: "text", from: "me", text: "ได้ครับ รบกวนถ่ายรูปสินค้าและกล่องส่งมาให้หน่อยนะครับ จะดำเนินการคืนเงินให้", time: "เมื่อวาน" },
    ],
  },
  {
    id: "c6", name: "สุกัญญา ร้านยารวมมิตร", avatar: shopAvatar, online: true, lastActive: "กำลังออนไลน์อยู่",
    msgs: [
      { id: "m1", kind: "text", from: "them", text: "วิตามินซีล็อตใหม่ผลิตเมื่อไหร่คะ", time: "11:20 น." },
      { id: "m2", kind: "product", from: "me", product: PROD_VITC, time: "11:22 น." },
      { id: "m3", kind: "text", from: "me", text: "ล็อตล่าสุดผลิต เม.ย. 2026 หมดอายุ เม.ย. 2028 ครับ", time: "11:22 น." },
      { id: "m4", kind: "sticker", from: "them", emoji: "👍", time: "11:25 น." },
    ],
  },
  {
    id: "c7", name: "Tar.อาหารเสริม", avatar: av(8), online: false, lastActive: "ออนไลน์ล่าสุด 3 วันที่แล้ว",
    msgs: [
      { id: "m1", kind: "text", from: "them", text: "รับตัวแทนจำหน่ายไหมครับ", time: "3 วันก่อน" },
      { id: "m2", kind: "text", from: "me", text: "รับครับ เดี๋ยวส่งรายละเอียดเงื่อนไขตัวแทนให้นะครับ", time: "3 วันก่อน" },
    ],
  },
  {
    id: "c8", name: "มินตรา (ลูกค้าประจำ)", avatar: av(47), online: true, lastActive: "กำลังออนไลน์อยู่",
    msgs: [
      { id: "m1", kind: "text", from: "them", text: "พี่คะ มีโค้ดส่วนลดไหมคะ ลูกค้าประจำขอหน่อยน้า", time: "16:40 น." },
      { id: "m2", kind: "text", from: "me", text: "มีครับ ใช้โค้ด BMSVIP ลด 50 บาท เมื่อซื้อครบ 300 บาทครับ", time: "16:42 น." },
      { id: "m3", kind: "text", from: "them", text: "ขอบคุณมากเลยค่า รักร้านนี้ที่สุด 💕", time: "16:43 น." },
    ],
  },
  {
    id: "c9", name: "ธนกร โลจิสติกส์", avatar: av(60), online: false, lastActive: "ออนไลน์ล่าสุด 5 ชั่วโมงที่แล้ว",
    msgs: [
      { id: "m1", kind: "text", from: "them", text: "พรุ่งนี้เข้ารับพัสดุกี่โมงครับ", time: "08:10 น." },
      { id: "m2", kind: "text", from: "me", text: "ประมาณ 14:00 น. ครับ มีของประมาณ 12 กล่อง", time: "08:15 น." },
    ],
  },
];

export default function SellerChat() {
  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader />
      <div className="flex">
        <SellerSidebar active="แชท" />
        <ChatWorkspace title="แชท" conversations={CONVERSATIONS} />
      </div>
    </div>
  );
}
