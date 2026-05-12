# Brightify (BMS E-Commerce) — Developer Wiki

A UI prototype built from Figma — React 19 + TypeScript + Vite + `react-router` v7 + HeroUI + Tailwind v4. Mock data only, no backend. UI text is Thai. App code lives in [`bms-eCommerce/`](./bms-eCommerce/).

> See **[`CLAUDE.md`](./CLAUDE.md)** for coding conventions (also auto-loaded by Claude Code), and **[`README.md`](./README.md)** for the Thai dev-process write-up. Visual sitemap: [`bms-eCommerce/sitemap.svg`](./bms-eCommerce/sitemap.svg).

---

## Run it

```bash
cd bms-eCommerce
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build (the quality gate)
npm run preview
npm run lint
```

---

## Route map

All routes are declared in `bms-eCommerce/src/main.tsx`.

### Customer storefront
| Path | Page file | Notes |
|---|---|---|
| `/` | `App.tsx` | Landing: hero / flash sale / categories / recommended |
| `/login` | `pages/Login.tsx` | |
| `/products` · `/products/:id` | `AllProducts.tsx` · `ProductDetail.tsx` | medical products show "เสนอราคา" → `QuoteRequestModal` |
| `/store/:id` | `StoreProfile.tsx` | public store page |
| `/cart` · `/checkout` | `Cart.tsx` · `Checkout.tsx` | Checkout: address + card/bank modals, sticky total bar |
| `/settings` | `UserSettings.tsx` | บัญชีของฉัน + sub-panels (payment / notification settings) — uses `ProfilePageShell` |
| `/delivery` | `Delivery.tsx` | orders, status tabs + `OrderCard` |
| `/quotation` · `/quotation/:id` | `Quotation.tsx` · `QuotationDetail.tsx` | paginated table + 7-step stepper (state via `?status=`) |
| `/bms-member` | `BmsMember.tsx` | membership card + point history |
| `/notifications` · `/coupons` · `/favorites` | resp. pages | category tabs |
| `/affiliate/register` | `AffiliateRegister.tsx` | individual/juristic form + add-social modal + success state |

### Seller area (wrapped in `SellerChrome` — `SellerHeader` + `SellerSidebar`)
| Path | Page file | Notes |
|---|---|---|
| `/seller/login` · `/seller/register` | `SellerLogin.tsx` · `SellerRegister.tsx` | |
| `/seller/overview` | `SellerOverview.tsx` | dashboard (KPIs, calendar, top product/customers) |
| `/seller/orders` · `/seller/orders/detail` | `SellerOrders.tsx` · `SellerOrderDetail.tsx` | |
| `/seller/shop` | `SellerProducts.tsx` | "หน้าร้านค้า" — storefront-style preview |
| `/seller/products` · `/seller/products/new` | `SellerProductsManage.tsx` · `SellerProductForm.tsx` | manage list + add-product form (4-step, variant matrix w/ framer-motion `Reorder`) |
| `/seller/refunds` · `/seller/refunds/:id` | `SellerRefunds.tsx` · `SellerRefundDetail.tsx` | คำขอคืนเงิน/คืนสินค้า + review state machine + timelines (`?type=refund_return`) |
| `/seller/promotions` | `SellerPromotions.tsx` | + `CreatePromotionModal` |
| `/seller/discounts` | `SellerDiscounts.tsx` | + `CreateDiscountModal` |
| `/seller/flashsale` · `/seller/flashsale/:id` | `SellerFlashSale.tsx` · `SellerFlashSaleDetail.tsx` | event banner cards (horizontal scroll) + `FlashSaleTermsModal` + `AddFlashSaleProductModal` |
| `/seller/logistics` | `SellerLogistics.tsx` | warehouse addresses + shipping settings + carrier toggles + `AddWarehouseAddressModal` |
| `/seller/quotes` · `/seller/quotes/:id` | `SellerQuotes.tsx` · `SellerQuoteDetail.tsx` | quote list (dock action bar + drawer) + detail (manage/PDF/timeline) |

Seller sidebar leaves still without a `to` (pages not built yet): the remaining "การวิเคราะห์" children, รีวิว & คะแนนร้านค้า, แชท, กระเป๋าเงิน, การตั้งค่าร้านค้า.

### Dev/sandbox
`/playground` (`Playground.tsx`), `/docs` · `/docs/:component` (HeroUI component docs embed).

---

## Component catalog (`src/components/landing/` unless noted)

| Component | Purpose |
|---|---|
| `Header`, `Footer` | customer-site chrome |
| `ProfilePageShell` | Header + profile banner + sidebar (sticky desktop / pill mobile) + Footer — used by all customer profile pages |
| `SellerChrome` (`components/`) | exports `SellerHeader` (`active`: manage\|storefront) and `SellerSidebar` (`active` = Thai leaf label) |
| `TabBar` | generic segmented control (count badge, `sticky`) |
| `OrderCard` | order card with status variants + per-status actions |
| `ProductCard` | `variant: default\|quote`, `flashSale` prop |
| `QuoteRequestModal` + `AddProductModal` | quote request flow; `AddProductModal` (`catalog`→`onConfirm(QuoteProduct[])`) is reused for any "+ เพิ่มสินค้า" picker |
| `AddressModals` (`SelectAddressModal`, `AddAddressModal`), `PaymentModals` | checkout/settings |
| `AddWarehouseAddressModal` | logistics warehouse address |
| `CreatePromotionModal`, `CreateDiscountModal`, `AddFlashSaleProductModal`, `FlashSaleTermsModal` | marketing |
| `SelectNameModal`, `OwnSignatureModal`, `SignaturePad` | quote-PDF signers; `SignaturePad` = drawable canvas + image upload |
| `AddSocialLinkModal` | affiliate registration |
| `CopyButton` | copy-to-clipboard + "คัดลอกแล้ว" tooltip + check swap |
| `DatePickerField` | HeroUI `DatePicker` wrapper (label + required + today highlight) — **use this for every date field, not `<input type="date">`** |
| `BirthdayPicker` (`components/`) | wheel-style BE-year picker (birthdays only) |
| `Icon` | Lineicons webfont (`lni lni-<name>`); some names don't render — prefer **lucide-react** for new icons |
| various landing sections | `HeroBanner`, `PromoBanners`, `CategoryGrid`, `FlashSaleSection`, `ProductCarousel`, `CartItemRow`, etc. |
| mock data | `mockData.ts`; `MARKETING_CATALOG` exported from `CreatePromotionModal.tsx` |

Animation keyframes live in `src/index.css` (`animate-dropdown`, `page-section-in`, `dock-bar-in`, `drawer-overlay-in`, `drawer-panel-in`, `step-row-in`, `drop-bounce`).

---

## How-to recipes

### Add a new page
1. Create `src/pages/MyPage.tsx`.
2. Add `<Route path="/my/path" element={<MyPage />} />` in `src/main.tsx`.
3. If it's reachable from a menu/sidebar, wire the link.
4. `npx tsc -b` && `npm run build`.

### Add a seller list page (table + tabs + pagination)
Copy the shell from `SellerOrders.tsx` / `SellerProductsManage.tsx`:
- `<div className="min-h-screen bg-[#f5f8fa]"><SellerHeader /><div className="flex"><SellerSidebar active="<Thai label>" /><main className="flex-1 min-w-0 px-8 py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">…`
- title (`text-[20px] font-semibold text-[var(--color-primary-700)]`) + optional search-input group + optional primary "+ …" button
- tab bar: `flex bg-white border rounded-lg p-1 w-fit`, count badge `bg-[var(--color-critical)]`
- white card `rounded-xl shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)]` → grid header (`bg-[var(--color-primary-100)] text-[12px] font-medium uppercase text-[var(--color-neutral-600)]`) → scrollable rows → `h-14` pagination footer
- give it a `to` on the matching `SellerSidebar` leaf in `SellerChrome.tsx`

### Add a modal
HeroUI `Modal isOpen onClose placement="center" size="md|lg" hideCloseButton scrollBehavior="inside" classNames={{base:"rounded-2xl"}}` + `ModalHeader` (flex justify-between, border-b, p-4, title `text-[18px] font-semibold`, custom close = `w-6 h-6 rounded-full bg-[var(--color-neutral-200)]` + lucide `X size={12} strokeWidth={2.5}`) + `ModalFooter` (border-t p-4, bordered "ยกเลิก" + primary "บันทึก"). Reset internal state in `useEffect([isOpen])`.

### Status badge + toggle pattern
`inline-flex px-3 py-1 rounded text-[12px] font-medium whitespace-nowrap` with `style={{ backgroundColor, color }}`. Palette: positive `#d6fc92`/`#235c04`; warning `#fdefb0`/`#863a00`; info `#cce7ff`/`#025094`; purple `#f5ebfe`/`#5824d4`; critical `#feeaed`/`#a3072b`; draft grey `#e5e9ee`/`#56657a`. For a row toggle that drives the badge, keep `statuses: Record<id, Status>` state, `<Switch isSelected onValueChange>`, and read the badge + tab filter from it; `isDisabled` + a `Tooltip` when not applicable.

### Gotchas
- **Never** put `overflow-hidden` / `overflow-x-auto` (or any non-`visible` overflow) on an ancestor of a `position: sticky` element — it traps the sticky child.
- Use HeroUI `Select`/`SelectItem` (not native `<select>`), `DatePickerField` (not native date input), framer-motion `Reorder` (not hand-rolled DnD).
- Tailwind "canonical class" lint warnings on `var(--color-…)` arbitrary classes are expected — the project uses them consistently; ignore.

---

## Figma → code workflow
`get_metadata` (structure) → `get_screenshot` (visual) → `get_design_context` (reference code + tokens). The returned React+Tailwind is a *reference* — adapt to this stack (HeroUI components, flex/grid layout, design tokens, the shared components above). Download new assets into `src/assets/` only when none already fit.

## Git
Feature branches → PR to `main`. When behind: `git merge origin/main` into your branch, resolve conflicts, make `tsc`/`build` pass before pushing. Don't force-push `main`; don't commit secrets.
