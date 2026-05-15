import {
  Leaf,
  Pill,
  Tv,
  Shirt,
  Pencil,
  Dumbbell,
  Baby,
  BookOpen,
  Sparkles,
  UtensilsCrossed,
  Stethoscope,
  HeartPulse,
  Accessibility,
  SprayCan,
  Cat,
  Activity,
  Smile,
  Scissors,
  Plug,
  Briefcase,
  Bike,
  Puzzle,
  Book,
  Sparkle,
  Soup,
  Cross,
  Bandage,
  Bath,
  Flower2,
  Carrot,
  Apple,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useRef } from "react";
import SectionHeader from "./SectionHeader";

const categories = [
  { icon: Leaf, label: "สมุนไพร" },
  { icon: Pill, label: "อาหารเสริม" },
  { icon: Tv, label: "เครื่องใช้ไฟฟ้า" },
  { icon: Shirt, label: "เสื้อผ้าแฟชั่น" },
  { icon: Pencil, label: "เครื่องเขียน" },
  { icon: Dumbbell, label: "อุปกรณ์กีฬา" },
  { icon: Baby, label: "ของเล่นเด็ก" },
  { icon: BookOpen, label: "หนังสือและสื่อ" },
  { icon: Sparkles, label: "เครื่องสำอาง" },
  { icon: UtensilsCrossed, label: "อาหารและเครื่องดื่ม" },
  { icon: Stethoscope, label: "อุปกรณ์การแพทย์" },
  { icon: HeartPulse, label: "ดูแลสุขภาพ" },
  { icon: Accessibility, label: "ผู้สูงอายุ" },
  { icon: SprayCan, label: "ทำความสะอาด" },
  { icon: Cat, label: "สัตว์เลี้ยง" },
  { icon: Activity, label: "สุขภาพอื่นๆ" },
  { icon: Smile, label: "ดูแลช่องปาก" },
  { icon: Scissors, label: "ดูแลเส้นผม" },
  { icon: Plug, label: "ไฟฟ้าขนาดเล็ก" },
  { icon: Shirt, label: "เสื้อผ้าผู้ชาย" },
  { icon: Briefcase, label: "อุปกรณ์สำนักงาน" },
  { icon: Bike, label: "ออกกำลังกาย" },
  { icon: Puzzle, label: "เสริมพัฒนาการ" },
  { icon: Book, label: "หนังสือเด็ก" },
  { icon: Sparkle, label: "บำรุงผิวหน้า" },
  { icon: Soup, label: "อาหารสำเร็จรูป" },
  { icon: Cross, label: "เวชภัณฑ์" },
  { icon: Bandage, label: "ปฐมพยาบาล" },
  { icon: Bath, label: "ผลิตภัณฑ์เด็ก" },
  { icon: Flower2, label: "ความงาม" },
  { icon: Carrot, label: "ออร์แกนิก" },
  { icon: Apple, label: "วีแกน" },
];

export default function CategoryGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mobilePage, setMobilePage] = useState(0);
  const totalDots = 2;

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const progress = el.scrollLeft / (el.scrollWidth - el.clientWidth);
    setMobilePage(progress >= 0.5 ? 1 : 0);
  };

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <section className="relative bg-white rounded-xl lg:rounded-2xl border border-[var(--color-neutral-300)] p-3 sm:p-4 lg:p-6">
      <SectionHeader title="หมวดหมู่สินค้า" />

      {/* Arrow buttons — desktop only */}
      <button
        type="button"
        aria-label="หมวดหมู่ก่อนหน้า"
        onClick={() => scrollBy(-1)}
        className="hidden lg:flex absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[var(--color-neutral-300)] shadow-md items-center justify-center text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary-400)] active:scale-95 transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="หมวดหมู่ถัดไป"
        onClick={() => scrollBy(1)}
        className="hidden lg:flex absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[var(--color-neutral-300)] shadow-md items-center justify-center text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary-400)] active:scale-95 transition-all"
      >
        <ChevronRight size={20} />
      </button>

      <div className="border-t border-[var(--color-neutral-300)] pt-4">
        {/* Single scroll row — all breakpoints */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scrollbar-none gap-2 -mx-3 sm:-mx-4 lg:mx-0 px-3 sm:px-4 lg:px-0 pb-2"
        >
          {categories.map((cat) => (
            <button
              key={cat.label}
              className="group flex-none flex flex-col items-center gap-2 p-2 lg:p-3 rounded-xl border border-transparent hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 active:scale-[0.98] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 focus-visible:ring-offset-1"
            >
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center bg-[var(--color-primary-100)] transition-colors duration-200 group-hover:bg-[var(--color-primary)]/20">
                <cat.icon size={22} className="lg:hidden text-[var(--color-primary)]" />
                <cat.icon size={28} className="hidden lg:block text-[var(--color-primary)]" />
              </div>
              <span className="text-[10px] lg:text-xs text-center text-[var(--color-neutral-800)] group-hover:text-[var(--color-primary)] line-clamp-2 leading-tight w-[52px] lg:w-[68px] transition-colors duration-200">
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {Array.from({ length: totalDots }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`ไปยังหน้า ${i + 1}`}
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                const maxScroll = el.scrollWidth - el.clientWidth;
                el.scrollTo({ left: (i / (totalDots - 1)) * maxScroll, behavior: "smooth" });
              }}
              className={[
                "h-1.5 rounded-full transition-all",
                i === mobilePage
                  ? "w-6 bg-[var(--color-primary)]"
                  : "w-1.5 bg-[var(--color-neutral-300)] hover:bg-[var(--color-neutral-500)]",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
