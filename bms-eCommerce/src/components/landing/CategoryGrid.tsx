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
import { useState } from "react";
import SectionHeader from "./SectionHeader";

const categories = [
  { icon: Leaf, label: "สมุนไพร", color: "#22c55e" },
  { icon: Pill, label: "อาหารเสริม", color: "#0485f7" },
  { icon: Tv, label: "เครื่องใช้ไฟฟ้า", color: "#6366f1" },
  { icon: Shirt, label: "เสื้อผ้าแฟชั่น", color: "#ec4899" },
  { icon: Pencil, label: "เครื่องเขียน", color: "#f59e0b" },
  { icon: Dumbbell, label: "อุปกรณ์กีฬา", color: "#ef4444" },
  { icon: Baby, label: "ของเล่นเด็ก", color: "#fb923c" },
  { icon: BookOpen, label: "หนังสือและสื่อ", color: "#8b5cf6" },
  { icon: Sparkles, label: "เครื่องสำอาง", color: "#f43f5e" },
  { icon: UtensilsCrossed, label: "อาหารและเครื่องดื่ม", color: "#10b981" },
  { icon: Stethoscope, label: "อุปกรณ์การแพทย์", color: "#0ea5e9" },
  { icon: HeartPulse, label: "ดูแลสุขภาพ", color: "#dc2626" },
  { icon: Accessibility, label: "ผู้สูงอายุ", color: "#14b8a6" },
  { icon: SprayCan, label: "ทำความสะอาด", color: "#3b82f6" },
  { icon: Cat, label: "สัตว์เลี้ยง", color: "#a855f7" },
  { icon: Activity, label: "สุขภาพอื่นๆ", color: "#84cc16" },
  { icon: Smile, label: "ดูแลช่องปาก", color: "#06b6d4" },
  { icon: Scissors, label: "ดูแลเส้นผม", color: "#f97316" },
  { icon: Plug, label: "ไฟฟ้าขนาดเล็ก", color: "#6b7280" },
  { icon: Shirt, label: "เสื้อผ้าผู้ชาย", color: "#1e40af" },
  { icon: Briefcase, label: "อุปกรณ์สำนักงาน", color: "#7c3aed" },
  { icon: Bike, label: "ออกกำลังกาย", color: "#16a34a" },
  { icon: Puzzle, label: "เสริมพัฒนาการ", color: "#fbbf24" },
  { icon: Book, label: "หนังสือเด็ก", color: "#db2777" },
  { icon: Sparkle, label: "บำรุงผิวหน้า", color: "#e11d48" },
  { icon: Soup, label: "อาหารสำเร็จรูป", color: "#ea580c" },
  { icon: Cross, label: "เวชภัณฑ์", color: "#dc2626" },
  { icon: Bandage, label: "ปฐมพยาบาล", color: "#0891b2" },
  { icon: Bath, label: "ผลิตภัณฑ์เด็ก", color: "#a78bfa" },
  { icon: Flower2, label: "ความงาม", color: "#f472b6" },
  { icon: Carrot, label: "ออร์แกนิก", color: "#65a30d" },
  { icon: Apple, label: "วีแกน", color: "#15803d" },
];

const PAGE_SIZE = 20; // 10 cols × 2 rows on lg

export default function CategoryGrid() {
  const totalPages = Math.ceil(categories.length / PAGE_SIZE);
  const [page, setPage] = useState(0);
  const visible = categories.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const go = (delta: number) =>
    setPage((p) => (p + delta + totalPages) % totalPages);

  return (
    <section className="relative bg-white rounded-xl lg:rounded-2xl border border-[var(--color-neutral-300)] p-3 sm:p-4 lg:p-6">
      <SectionHeader title="หมวดหมู่สินค้า" />

      {/* Pagination arrows — desktop only */}
      <button
        type="button"
        aria-label="หมวดหมู่ก่อนหน้า"
        onClick={() => go(-1)}
        className="hidden lg:flex absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[var(--color-neutral-300)] shadow-md items-center justify-center text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary-400)] active:scale-95 transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="หมวดหมู่ถัดไป"
        onClick={() => go(1)}
        className="hidden lg:flex absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[var(--color-neutral-300)] shadow-md items-center justify-center text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary-400)] active:scale-95 transition-all"
      >
        <ChevronRight size={20} />
      </button>

      <div className="border-t border-[var(--color-neutral-300)] pt-4">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {visible.map((cat) => (
            <button
              key={cat.label}
              className={[
                "group flex flex-col items-center gap-2 p-2 sm:p-3 rounded-xl bg-transparent",
                "border border-transparent",
                "transition-colors duration-150 ease-out",
                "hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5",
                "active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 focus-visible:ring-offset-1",
              ].join(" ")}
            >
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center transition-colors duration-200 group-hover:bg-[var(--color-primary)]/10"
                style={{ backgroundColor: `${cat.color}15` }}
              >
                <cat.icon size={24} className="sm:hidden transition-colors duration-200 group-hover:text-[var(--color-primary)]" style={{ color: cat.color }} />
                <cat.icon size={28} className="hidden sm:block transition-colors duration-200 group-hover:text-[var(--color-primary)]" style={{ color: cat.color }} />
              </div>
              <span className="text-[11px] sm:text-xs text-center text-[var(--color-neutral-800)] group-hover:text-[var(--color-primary)] group-hover:font-semibold line-clamp-2 leading-tight h-8 transition-colors duration-200">
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`ไปยังหน้า ${i + 1}`}
              onClick={() => setPage(i)}
              className={[
                "h-1.5 rounded-full transition-all",
                i === page
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
