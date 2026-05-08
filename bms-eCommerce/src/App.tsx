import Header from "./components/landing/Header";
import Footer from "./components/landing/Footer";
import HeroBanner from "./components/landing/HeroBanner";
import CategoryGrid from "./components/landing/CategoryGrid";
import FlashSaleSection from "./components/landing/FlashSaleSection";
import PromoBanners from "./components/landing/PromoBanners";
import ProductGridSection from "./components/landing/ProductGridSection";
import ProductCarousel from "./components/landing/ProductCarousel";
import SectionHeader from "./components/landing/SectionHeader";
import { makeProducts } from "./components/landing/mockData";

function App() {
  const flashProducts = makeProducts(8);
  const medicalProducts = makeProducts(9);
  const recommended = makeProducts(30);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />

      <main className="max-w-[1240px] mx-auto px-3 sm:px-4 lg:px-5 pb-12 space-y-3 mt-4">
        <div className="page-section-in" style={{ animationDelay: "80ms" }}>
          <HeroBanner />
        </div>
        <div className="page-section-in" style={{ animationDelay: "160ms" }}>
          <CategoryGrid />
        </div>
        <div className="page-section-in" style={{ animationDelay: "240ms" }}>
          <FlashSaleSection products={flashProducts} />
        </div>

        <section
          className="page-section-in bg-white rounded-xl lg:rounded-2xl border border-[var(--color-neutral-300)] p-3 sm:p-4 lg:p-6"
          style={{ animationDelay: "320ms" }}
        >
          <SectionHeader title="สินค้าทางการแพทย์" />
          <ProductCarousel products={medicalProducts} variant="quote" />
        </section>

        <div className="page-section-in" style={{ animationDelay: "400ms" }}>
          <PromoBanners />
        </div>

        <div className="page-section-in" style={{ animationDelay: "480ms" }}>
          <ProductGridSection title="สินค้าแนะนำ" products={recommended} showLoadMore />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
