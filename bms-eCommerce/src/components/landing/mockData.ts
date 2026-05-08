import type { Product } from "./ProductCard";
import p01 from "../../assets/products/p01-skirt.jpg";
import p02 from "../../assets/products/p02-paracetamol.jpg";
import p03 from "../../assets/products/p03-bp-monitor.jpg";
import p04 from "../../assets/products/p04-vitamin-c.jpg";
import p05 from "../../assets/products/p05-mask.jpg";
import p06 from "../../assets/products/p06-sanitizer.jpg";
import p07 from "../../assets/products/p07-thermometer.jpg";
import p08 from "../../assets/products/p08-ginseng.jpg";
import p09 from "../../assets/products/p09-first-aid.jpg";
import p10 from "../../assets/products/p10-nebulizer.jpg";
import p11 from "../../assets/products/p11-floss.jpg";
import p12 from "../../assets/products/p12-face-cream.jpg";

const productCatalog: { name: string; image: string }[] = [
  { name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใส", image: p01 },
  { name: "ยาพาราเซตามอล 1000 mg.", image: p02 },
  { name: "เครื่องวัดความดันโลหิตอัตโนมัติ", image: p03 },
  { name: "วิตามินซีเสริมภูมิคุ้มกัน 1000mg", image: p04 },
  { name: "หน้ากากอนามัยทางการแพทย์ N95", image: p05 },
  { name: "เจลล้างมือแอลกอฮอล์ 75% ขนาด 500ml", image: p06 },
  { name: "เครื่องวัดอุณหภูมิแบบดิจิทัล อินฟราเรด", image: p07 },
  { name: "ผลิตภัณฑ์เสริมอาหารโสมสกัด", image: p08 },
  { name: "อุปกรณ์ปฐมพยาบาลเบื้องต้น 30 ชิ้น", image: p09 },
  { name: "เครื่องพ่นละอองยา Nebulizer แบบพกพา", image: p10 },
  { name: "ไหมขัดฟันแบบลวดสเตนเลส", image: p11 },
  { name: "ครีมบำรุงผิวหน้าออร์แกนิก", image: p12 },
];

export function makeProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) => {
    const item = productCatalog[i % productCatalog.length];
    return {
      id: i,
      name: item.name,
      price: Math.floor(Math.random() * 800 + 100),
      originalPrice: Math.floor(Math.random() * 500 + 800),
      discount: [10, 15, 20, 25, 30, 40, 50][i % 7],
      image: item.image,
      rating: Number((4 + Math.random()).toFixed(1)),
      sold: ["1.2k", "5.6k", "12.3k", "17.5k", "23.4k", "44.1k"][i % 6],
      freeShipping: i % 2 === 0,
      shopDiscount: i % 3 === 0,
      cod: i % 4 !== 0,
    };
  });
}
