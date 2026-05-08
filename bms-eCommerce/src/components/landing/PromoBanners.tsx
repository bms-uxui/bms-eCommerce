import { Store, BadgeCheck, ArrowRight } from "lucide-react";

function PromoCard({
  title,
  subtitle,
  cta,
  icon: Icon,
  gradient,
}: {
  title: string;
  subtitle: string;
  cta: string;
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-10 text-white min-h-[180px] md:min-h-[256px] flex flex-col justify-center bg-gradient-to-br ${gradient}`}
    >
      <div className="absolute -right-8 md:-right-10 top-1/2 -translate-y-1/2 opacity-30">
        <Icon className="w-32 h-32 md:w-[220px] md:h-[220px]" strokeWidth={1} />
      </div>
      <div className="relative max-w-[60%] md:max-w-sm">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 md:mb-3">{title}</h3>
        <p className="text-white/90 text-sm md:text-base mb-4 md:mb-6 hidden sm:block">{subtitle}</p>
        <button className="bg-white text-[var(--color-primary)] font-semibold px-5 md:px-8 h-9 md:h-10 rounded-lg flex items-center gap-2 hover:bg-white/90 active:scale-95 transition-all text-sm md:text-base">
          {cta}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default function PromoBanners() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <PromoCard
        title="สร้างร้านค้าของคุณ"
        subtitle="เพียงแค่คุณสร้างร้านค้าของคุณเอง ก็สามารถขายสินค้าได้เลย"
        cta="สมัครเลย"
        icon={Store}
        gradient="from-[#0485f7] to-[#024d8f]"
      />
      <PromoCard
        title="สมัคร Affiliate หารายได้"
        subtitle="สร้างตัวตนบนโลกออนไลน์ ก็สามารถหารายได้เสริมได้ เพียงแค่แชร์ลิงค์สินค้า"
        cta="สมัครเลย"
        icon={BadgeCheck}
        gradient="from-[#ff6b6b] to-[#cd0004]"
      />
    </section>
  );
}
