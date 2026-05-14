import { Store, BadgeCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

function PromoCard({
  title,
  subtitle,
  cta,
  icon: Icon,
  gradient,
  onClick,
}: {
  title: string;
  subtitle: string;
  cta: string;
  icon: React.ElementType;
  gradient: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-10 text-white min-h-[180px] md:min-h-[256px] flex flex-col justify-center bg-gradient-to-br ${gradient} cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(29,33,45,0.28)] active:scale-[0.99]`}
    >
      {/* sheen sweep on hover */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      <div className="absolute -right-8 md:-right-10 top-1/2 -translate-y-1/2 opacity-30 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:opacity-40">
        <Icon className="w-32 h-32 md:w-[220px] md:h-[220px]" strokeWidth={1} />
      </div>
      <div className="relative max-w-[60%] md:max-w-sm">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 md:mb-3 transition-transform duration-300 group-hover:-translate-y-0.5">{title}</h3>
        <p className="text-white/90 text-sm md:text-base mb-4 md:mb-6 hidden sm:block">{subtitle}</p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          className="bg-white text-[var(--color-primary)] font-semibold px-5 md:px-8 h-9 md:h-10 rounded-lg inline-flex items-center gap-2 group-hover:gap-3 group-hover:shadow-md hover:bg-white active:scale-95 transition-all duration-300 text-sm md:text-base"
        >
          {cta}
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

export default function PromoBanners() {
  const navigate = useNavigate();
  const goToSeller = () => {
    const loggedIn =
      typeof window !== "undefined" && sessionStorage.getItem("sellerLoggedIn") === "1";
    navigate(loggedIn ? "/seller/overview" : "/seller/login");
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <PromoCard
        title="สร้างร้านค้าของคุณ"
        subtitle="เพียงแค่คุณสร้างร้านค้าของคุณเอง ก็สามารถขายสินค้าได้เลย"
        cta="สมัครเลย"
        icon={Store}
        gradient="from-[#0485f7] to-[#024d8f]"
        onClick={goToSeller}
      />
      <PromoCard
        title="สมัคร Affiliate หารายได้"
        subtitle="สร้างตัวตนบนโลกออนไลน์ ก็สามารถหารายได้เสริมได้ เพียงแค่แชร์ลิงค์สินค้า"
        cta="สมัครเลย"
        icon={BadgeCheck}
        gradient="from-[#ff6b6b] to-[#cd0004]"
        onClick={() => navigate("/affiliate/register")}
      />
    </section>
  );
}
