import { StrictMode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Theme as RadixTheme } from "@radix-ui/themes";
import App from "./App.tsx";
import Login from "./pages/Login.tsx";
import SellerLogin from "./pages/SellerLogin.tsx";
import SellerRegister from "./pages/SellerRegister.tsx";
import SellerOverview from "./pages/SellerOverview.tsx";
import SellerOrders from "./pages/SellerOrders.tsx";
import SellerOrderDetail from "./pages/SellerOrderDetail.tsx";
import SellerProducts from "./pages/SellerProducts.tsx";
import SellerProductsManage from "./pages/SellerProductsManage.tsx";
import SellerProductForm from "./pages/SellerProductForm.tsx";
import SellerRefunds from "./pages/SellerRefunds.tsx";
import SellerRefundDetail from "./pages/SellerRefundDetail.tsx";
import SellerPromotions from "./pages/SellerPromotions.tsx";
import SellerDiscounts from "./pages/SellerDiscounts.tsx";
import SellerFlashSale from "./pages/SellerFlashSale.tsx";
import SellerFlashSaleDetail from "./pages/SellerFlashSaleDetail.tsx";
import SellerLogistics from "./pages/SellerLogistics.tsx";
import SellerReviews from "./pages/SellerReviews.tsx";
import SellerReviewDetail from "./pages/SellerReviewDetail.tsx";
import SellerChat from "./pages/SellerChat.tsx";
import SellerWallet from "./pages/SellerWallet.tsx";
import SellerStoreSettings from "./pages/SellerStoreSettings.tsx";
import SellerQuotes from "./pages/SellerQuotes.tsx";
import SellerQuoteDetail from "./pages/SellerQuoteDetail.tsx";
import SellerRevenueAnalysis from "./pages/SellerRevenueAnalysis.tsx";
import AffiliateRegister from "./pages/AffiliateRegister.tsx";
import AffiliateOverview from "./pages/AffiliateOverview.tsx";
import BrightifyCommission from "./pages/BrightifyCommission.tsx";
import BrightifyCommissionDetail from "./pages/BrightifyCommissionDetail.tsx";
import ShopCommission from "./pages/ShopCommission.tsx";
import ShopCommissionDetail from "./pages/ShopCommissionDetail.tsx";
import ProductCommission from "./pages/ProductCommission.tsx";
import CustomLink from "./pages/CustomLink.tsx";
import AffiliateCampaign from "./pages/AffiliateCampaign.tsx";
import OrderReport from "./pages/OrderReport.tsx";
import ClickReport from "./pages/ClickReport.tsx";
import CommissionSummary from "./pages/CommissionSummary.tsx";
import WithdrawCommission from "./pages/WithdrawCommission.tsx";
import AffiliateSettings from "./pages/AffiliateSettings.tsx";
import AllProducts from "./pages/AllProducts.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import StoreProfile from "./pages/StoreProfile.tsx";
import UserSettings from "./pages/UserSettings.tsx";
import Cart from "./pages/Cart.tsx";
import Checkout from "./pages/Checkout.tsx";
import Delivery from "./pages/Delivery.tsx";
import Quotation from "./pages/Quotation.tsx";
import QuotationDetail from "./pages/QuotationDetail.tsx";
import BmsMember from "./pages/BmsMember.tsx";
import Notifications from "./pages/Notifications.tsx";
import Coupons from "./pages/Coupons.tsx";
import Favorites from "./pages/Favorites.tsx";
import Playground from "./pages/Playground.tsx";
import ChatFab from "./components/landing/ChatFab.tsx";
import DocsIndex from "./pages/docs/DocsIndex.tsx";
import DocEmbed from "./pages/docs/DocEmbed.tsx";
import "./index.css";
import "@radix-ui/themes/styles.css";

// MUI theme with Google Sans
const muiTheme = createTheme({
  typography: {
    fontFamily: '"Google Sans", "Google Sans Text", "Google Sans Display", "Noto Sans Thai", system-ui, sans-serif',
  },
  palette: {
    primary: { main: "#4285F4" },
    secondary: { main: "#34A853" },
    error: { main: "#EA4335" },
    warning: { main: "#FBBC05" },
  },
});

// All HeroUI component doc URLs
const heroUIDocs: Record<string, { title: string; url: string }> = {
  input:        { title: "Input",       url: "https://www.heroui.com/docs/components/input" },
  button:       { title: "Button",      url: "https://www.heroui.com/docs/components/button" },
  select:       { title: "Select",      url: "https://www.heroui.com/docs/components/select" },
  checkbox:     { title: "Checkbox",    url: "https://www.heroui.com/docs/components/checkbox" },
  switch:       { title: "Switch",      url: "https://www.heroui.com/docs/components/switch" },
  slider:       { title: "Slider",      url: "https://www.heroui.com/docs/components/slider" },
  textarea:     { title: "Textarea",    url: "https://www.heroui.com/docs/components/textarea" },
  card:         { title: "Card",        url: "https://www.heroui.com/docs/components/card" },
  modal:        { title: "Modal",       url: "https://www.heroui.com/docs/components/modal" },
  table:        { title: "Table",       url: "https://www.heroui.com/docs/components/table" },
  tabs:         { title: "Tabs",        url: "https://www.heroui.com/docs/components/tabs" },
  navbar:       { title: "Navbar",      url: "https://www.heroui.com/docs/components/navbar" },
  dropdown:     { title: "Dropdown",    url: "https://www.heroui.com/docs/components/dropdown" },
  avatar:       { title: "Avatar",      url: "https://www.heroui.com/docs/components/avatar" },
  chip:         { title: "Chip",        url: "https://www.heroui.com/docs/components/chip" },
  spinner:      { title: "Spinner",     url: "https://www.heroui.com/docs/components/spinner" },
  "date-picker": { title: "Date Picker", url: "https://www.heroui.com/docs/components/date-picker" },
  tooltip:      { title: "Tooltip",     url: "https://www.heroui.com/docs/components/tooltip" },
};

function DocPage({ component }: { component: string }) {
  const doc = heroUIDocs[component];
  if (!doc) return <div className="p-8">ไม่พบคอมโพเนนต์</div>;
  return <DocEmbed title={`${doc.title} — HeroUI`} url={doc.url} />;
}

const PROFILE_PATHS = ["/settings", "/delivery", "/quotation", "/bms-member", "/notifications", "/coupons", "/favorites"];

function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPath = useRef(pathname);
  useEffect(() => {
    const fromProfile = PROFILE_PATHS.includes(prevPath.current);
    const toProfile = PROFILE_PATHS.includes(pathname);
    prevPath.current = pathname;
    if (fromProfile && toProfile) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <HeroUIProvider>
        <ThemeProvider theme={muiTheme}>
          <RadixTheme accentColor="blue" radius="medium">
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/login" element={<Login />} />
              <Route path="/seller/login" element={<SellerLogin />} />
              <Route path="/seller/register" element={<SellerRegister />} />
              <Route path="/seller/overview" element={<SellerOverview />} />
              <Route path="/seller/orders" element={<SellerOrders />} />
              <Route path="/seller/orders/detail" element={<SellerOrderDetail />} />
              <Route path="/seller/shop" element={<SellerProducts />} />
              <Route path="/seller/products" element={<SellerProductsManage />} />
              <Route path="/seller/products/new" element={<SellerProductForm />} />
              <Route path="/seller/refunds" element={<SellerRefunds />} />
              <Route path="/seller/refunds/:id" element={<SellerRefundDetail />} />
              <Route path="/seller/promotions" element={<SellerPromotions />} />
              <Route path="/seller/discounts" element={<SellerDiscounts />} />
              <Route path="/seller/flashsale" element={<SellerFlashSale />} />
              <Route path="/seller/flashsale/:id" element={<SellerFlashSaleDetail />} />
              <Route path="/seller/logistics" element={<SellerLogistics />} />
              <Route path="/seller/reviews" element={<SellerReviews />} />
              <Route path="/seller/reviews/:id" element={<SellerReviewDetail />} />
              <Route path="/seller/chat" element={<SellerChat />} />
              <Route path="/seller/wallet" element={<SellerWallet />} />
              <Route path="/seller/settings" element={<SellerStoreSettings />} />
              <Route path="/seller/quotes" element={<SellerQuotes />} />
              <Route path="/seller/quotes/:id" element={<SellerQuoteDetail />} />
              <Route path="/seller/analytics/revenue" element={<SellerRevenueAnalysis />} />
              <Route path="/affiliate/register" element={<AffiliateRegister />} />
              <Route path="/affiliate/overview" element={<AffiliateOverview />} />
              <Route path="/affiliate/commission/brightify" element={<BrightifyCommission />} />
              <Route path="/affiliate/commission/brightify/:id" element={<BrightifyCommissionDetail />} />
              <Route path="/affiliate/commission/shop" element={<ShopCommission />} />
              <Route path="/affiliate/commission/shop/:id" element={<ShopCommissionDetail />} />
              <Route path="/affiliate/commission/product" element={<ProductCommission />} />
              <Route path="/affiliate/commission/custom-link" element={<CustomLink />} />
              <Route path="/affiliate/campaign" element={<AffiliateCampaign />} />
              <Route path="/affiliate/reports/orders" element={<OrderReport />} />
              <Route path="/affiliate/reports/clicks" element={<ClickReport />} />
              <Route path="/affiliate/commission-income/summary" element={<CommissionSummary />} />
              <Route path="/affiliate/commission-income/withdraw" element={<WithdrawCommission />} />
              <Route path="/affiliate/settings" element={<AffiliateSettings />} />
              <Route path="/products" element={<AllProducts />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/store/:id" element={<StoreProfile />} />
              <Route path="/settings" element={<UserSettings />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/quotation" element={<Quotation />} />
              <Route path="/quotation/:id" element={<QuotationDetail />} />
              <Route path="/bms-member" element={<BmsMember />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/coupons" element={<Coupons />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/docs" element={<DocsIndex />} />
              {Object.keys(heroUIDocs).map((key) => (
                <Route
                  key={key}
                  path={`/docs/${key}`}
                  element={<DocPage component={key} />}
                />
              ))}
            </Routes>
            <ChatFab />
          </RadixTheme>
        </ThemeProvider>
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>
);
