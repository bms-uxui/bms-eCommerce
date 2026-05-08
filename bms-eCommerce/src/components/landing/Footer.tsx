import { Facebook, Instagram, Music, Youtube } from "lucide-react";
import visa from "../../assets/payments/visa.png";
import mastercard from "../../assets/payments/mastercard.png";
import amex from "../../assets/payments/amex.png";
import cod from "../../assets/payments/cod.png";
import krungthai from "../../assets/payments/krungthai.png";
import kasikorn from "../../assets/payments/kasikorn.png";
import scb from "../../assets/payments/scb.png";
import krungsri from "../../assets/payments/krungsri.png";
import gsb from "../../assets/payments/gsb.png";
import bbl from "../../assets/payments/bbl.png";
import kerry from "../../assets/shipping/kerry.png";
import flash from "../../assets/shipping/flash.png";
import thaipost from "../../assets/shipping/thaipost.png";
import jt from "../../assets/shipping/jt.png";

const links = {
  about: {
    title: "เกี่ยวกับเรา",
    items: [
      "บริษัท BMS GROUP",
      "นโยบายความเป็นส่วนตัว",
      "เงื่อนไขการใช้งาน",
      "นโยบายคืนสินค้า",
    ],
  },
  help: {
    title: "ช่วยเหลือ",
    items: [
      "ศูนย์ช่วยเหลือ",
      "วิธีสั่งซื้อสินค้า",
      "การจัดส่ง",
      "คืนสินค้า & เงิน",
      "ติดต่อเรา",
    ],
  },
};

const socials = [
  { icon: Facebook, label: "Brightify Thailand" },
  { icon: Instagram, label: "brightify_th" },
  { icon: Music, label: "Brightify.Thailand" },
  { icon: Youtube, label: "Brightify Thailand" },
];

const payments: { src: string; alt: string }[] = [
  { src: visa, alt: "Visa" },
  { src: mastercard, alt: "Mastercard" },
  { src: amex, alt: "American Express" },
  { src: cod, alt: "COD" },
  { src: krungthai, alt: "Krungthai Bank" },
  { src: kasikorn, alt: "Kasikorn Bank" },
  { src: scb, alt: "SCB" },
  { src: krungsri, alt: "Krungsri" },
  { src: gsb, alt: "Government Savings Bank" },
  { src: bbl, alt: "Bangkok Bank" },
];

const shippingLogos: { src: string; alt: string }[] = [
  { src: kerry, alt: "Kerry Express" },
  { src: flash, alt: "Flash Express" },
  { src: thaipost, alt: "Thailand Post" },
  { src: jt, alt: "J&T Express" },
];

export default function Footer() {
  return (
    <footer className="relative mt-12 text-white">
      {/* Curved top arch — same gradient as the body */}
      <svg
        className="block w-full h-[80px]"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="footerArchGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-primary)" />
          </linearGradient>
        </defs>
        <path
          d="M0,80 Q720,0 1440,80 L1440,80 L0,80 Z"
          fill="url(#footerArchGrad)"
        />
      </svg>
      <div className="bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-700)] pt-6 md:pt-10 -mt-px">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[120px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[375px_1fr_1fr_1fr] gap-6 md:gap-10 pb-6">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-white text-[var(--color-primary)] flex items-center justify-center font-extrabold">
                B
              </div>
              <div className="leading-tight">
                <p className="text-[20px] font-extrabold text-white leading-none">
                  BRIGHTIFY
                </p>
                <p className="text-[12px] text-white leading-none mt-1">
                  E-Commerce by BMS
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              บริษัท บางกอก เมดิคอล ซอฟต์แวร์ จำกัด
            </p>
            <p className="text-sm leading-relaxed">
              <span className="underline">ที่อยู่</span> : เลขที่ 2 ชั้นที่ 2 ซอย สุขสวัสดิ์ 33
              แขวงราษฎร์บูรณะ เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140
            </p>
            <p className="text-sm">เบอร์โทร : 02-427-9991</p>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">{links.about.title}</h4>
            <ul className="space-y-3">
              {links.about.items.map((it) => (
                <li key={it} className="text-sm hover:underline cursor-pointer">
                  {it}
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">{links.help.title}</h4>
            <ul className="space-y-3">
              {links.help.items.map((it) => (
                <li key={it} className="text-sm hover:underline cursor-pointer">
                  {it}
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">ติดตามเรา</h4>
            <ul className="space-y-3">
              {socials.map((s) => (
                <li key={s.label} className="flex items-center gap-2 text-sm hover:underline cursor-pointer">
                  <s.icon size={20} />
                  {s.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payments / Shipping */}
        <div className="border-t-[0.5px] border-white py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
          <div>
            <p className="text-sm font-medium mb-2">ช่องทางการชำระเงิน</p>
            <div className="flex gap-1 flex-wrap">
              {payments.map((p) => (
                <span
                  key={p.alt}
                  className="bg-white rounded-[5px] h-6 w-[52px] flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={p.src}
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain p-0.5"
                  />
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">ช่องทางการจัดส่ง</p>
            <div className="flex gap-1 flex-wrap">
              {shippingLogos.map((p) => (
                <span
                  key={p.alt}
                  className="bg-white rounded-[5px] h-6 w-[61px] flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={p.src}
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain p-0.5"
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t-[0.5px] border-white py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-center sm:text-left">
          <p>© 2026 BMS GROUP Co., Ltd. All rights reserved.</p>
          <p>Unified Commerce Platform v1.0</p>
        </div>
      </div>
      </div>
    </footer>
  );
}
