import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import slide1 from "../../assets/banners/slide-1.png";
import slide2 from "../../assets/banners/slide-2.png";
import slide3 from "../../assets/banners/slide-3.png";
import sideImage from "../../assets/banners/side.png";
import sub1 from "../../assets/banners/sub-1.png";
import sub2 from "../../assets/banners/sub-2.png";
import sub3 from "../../assets/banners/sub-3.png";
import sub4 from "../../assets/banners/sub-4.png";

type Slide = {
  id: string;
  alt: string;
  image: string;
};

const slides: Slide[] = [
  { id: "1", alt: "Smart Hospital Kiosk", image: slide1 },
  { id: "2", alt: "Anytime CGM", image: slide2 },
  { id: "3", alt: "BMS Promotion", image: slide3 },
];

const sideBannerImage = sideImage;
const sideBannerAlt = "BMS-NPRS รถเข็นสำหรับพยาบาล";

const subBanners = [
  { id: "1", alt: "Honey Lemon — ราคา 139 บาท", image: sub1 },
  { id: "2", alt: "ส่วนลดสมาชิก", image: sub2 },
  { id: "3", alt: "Aroma Workshop — META HERB", image: sub3 },
  { id: "4", alt: "Rose Essence — ราคา 85 บาท", image: sub4 },
];

function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  const go = (delta: number) =>
    setIndex((i) => (i + delta + slides.length) % slides.length);

  return (
    <div
      className="relative rounded-2xl md:rounded-[24px] overflow-hidden aspect-[3/1] md:h-[250px] md:aspect-auto group cursor-pointer shadow-[0_2px_8px_rgba(157,183,206,0.3)] bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <img
          key={slide.id}
          src={slide.image}
          alt={slide.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={i !== index}
        />
      ))}

      {/* Arrows */}
      <button
        aria-label="เลื่อนซ้าย"
        onClick={(e) => {
          e.stopPropagation();
          go(-1);
        }}
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/40 hover:bg-white/70 flex items-center justify-center text-[var(--color-neutral-900)] backdrop-blur-sm active:scale-90 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        aria-label="เลื่อนขวา"
        onClick={(e) => {
          e.stopPropagation();
          go(1);
        }}
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/40 hover:bg-white/70 flex items-center justify-center text-[var(--color-neutral-900)] backdrop-blur-sm active:scale-90 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot pill — matches Figma slide dots (52×14, bottom-16) */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/50 backdrop-blur-sm rounded-full px-2.5 py-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`สไลด์ที่ ${i + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              setIndex(i);
            }}
            className={`h-1.5 rounded-full transition-all ${
              i === index
                ? "w-5 bg-[var(--color-neutral-900)]"
                : "w-1.5 bg-[var(--color-neutral-900)]/40 hover:bg-[var(--color-neutral-900)]/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function StaticBanner() {
  return (
    <div className="relative rounded-2xl md:rounded-[24px] overflow-hidden aspect-[434/250] md:h-[250px] md:aspect-auto bg-white cursor-pointer hover:shadow-md transition-shadow shadow-[0_2px_8px_rgba(157,183,206,0.3)]">
      <img
        src={sideBannerImage}
        alt={sideBannerAlt}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

function SubBanner({ banner }: { banner: (typeof subBanners)[number] }) {
  return (
    <div className="relative aspect-[291/100] rounded-xl overflow-hidden cursor-pointer group bg-white shadow-[0_2px_8px_rgba(157,183,206,0.2)] hover:shadow-md transition-all active:scale-[0.98]">
      <img
        src={banner.image}
        alt={banner.alt}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
  );
}

export default function HeroBanner() {
  return (
    <section className="flex flex-col gap-3 mt-3">
      {/* Row 1 — slider 750 + static 434 (matches Figma 750:434 ≈ 63/37) */}
      <div className="grid grid-cols-1 md:grid-cols-[750fr_434fr] gap-3">
        <HeroSlider slides={slides} />
        <StaticBanner />
      </div>

      {/* Row 2 — 4 sub banners */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {subBanners.map((b) => (
          <SubBanner key={b.id} banner={b} />
        ))}
      </div>
    </section>
  );
}
