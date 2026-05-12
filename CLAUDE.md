# CLAUDE.md — Project conventions for Brightify (BMS E-Commerce)

App code lives in [`bms-eCommerce/`](./bms-eCommerce/). React 19 + TS + Vite + `react-router` v7 + HeroUI + Tailwind v4. UI prototype from Figma — mock data, no backend. Thai UI text.

## Golden rules
1. **Reuse first.** Scan `src/components/landing/` and `src/pages/` before building anything. Match existing patterns; extend with props/variants instead of forking. Recreating shared UI causes drift.
2. **Match the surrounding style**, including its quirks: arbitrary classes like `text-[var(--color-primary)]` are used everywhere — the "canonical class" lint warnings are expected; ignore them.
3. **Quality gate before "done":** run `npx tsc -b` and `npm run build` from `bms-eCommerce/`. If you didn't open it in a browser, say so.
4. Every new page needs a `<Route>` in `src/main.tsx`.

## Shared / reusable building blocks
- `ProfilePageShell` (`components/landing/`) — Header + profile banner + sidebar (sticky desktop / pill-scroller mobile) + Footer. Props `activeKey`, `onItemClick`, `avatarSrc`. Used by all customer "profile" pages (`/settings`, `/delivery`, `/quotation`, `/bms-member`, `/notifications`, `/coupons`, `/favorites`).
- `SellerChrome` (`components/`) — exports `SellerHeader` (prop `active`: "manage"|"storefront") and `SellerSidebar` (prop `active` = the Thai sidebar-leaf label, e.g. `"การจัดการสินค้า"`). A leaf needs a `to` to navigate — add it when wiring a new page.
- `TabBar` (`components/landing/`) — generic segmented control; `count` badge, `sticky`, `className`.
- `AddProductModal` — product picker (`catalog: CatalogProduct[]` → `onConfirm(QuoteProduct[])`); reuse for any "+ เพิ่มสินค้า" picker. `MARKETING_CATALOG` (exported from `CreatePromotionModal.tsx`) is a ready mock catalog.
- `CopyButton` — copy + green-check swap + "คัดลอกแล้ว" tooltip. Use for any copy-to-clipboard icon.
- `DatePickerField` — wraps HeroUI `DatePicker`. **Always use this for date fields — never `<input type="date">`.**
- `SignaturePad` — drawable canvas (mouse/touch) + image upload, reports via `onChange`. Used by `SelectNameModal`, `OwnSignatureModal`.
- `OrderCard`, `ProductCard` (variant/flashSale), `QuoteRequestModal`, `AddressModals`, `PaymentModals`, `AddSocialLinkModal`, `Header`, `Footer`, etc.
- `Icon` (`components/landing/`) = Lineicons webfont (`lni lni-<name>`); some names don't render — prefer **lucide-react** for new icons.
- Animations: keyframes live in `src/index.css` (`animate-dropdown`, `page-section-in`, `dock-bar-in`, `drawer-overlay-in`, `drawer-panel-in`, `step-row-in`, `drop-bounce`). Add new ones there.

## Layout patterns to copy
**Seller list page** (SellerOrders / SellerProductsManage / SellerRefunds / SellerPromotions / SellerDiscounts / SellerFlashSale):
```
<div className="min-h-screen bg-[#f5f8fa]">
  <SellerHeader />
  <div className="flex">
    <SellerSidebar active="…" />
    <main className="flex-1 min-w-0 px-8 py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
      {/* title (text-[20px] font-semibold text-[var(--color-primary-700)]) + search-input group + optional "+ …" primary button */}
      {/* tab bar: flex bg-white border rounded-lg p-1 w-fit, count badges = bg-[var(--color-critical)] */}
      {/* white card: rounded-xl shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)]
            -> grid header (bg-[var(--color-primary-100)] text-[12px] font-medium uppercase text-[var(--color-neutral-600)])
            -> scrollable rows
            -> h-14 pagination footer ("10,488 รายการ | แสดง 20 | ‹ 1 2 3 4 5 … 12 ›") */}
```
Filter rows & tab counts off the **live** status state, not the static mock.

**Seller detail page** (SellerOrderDetail / SellerQuoteDetail / SellerRefundDetail / SellerFlashSaleDetail): top bar = `ChevronLeft` back + `#id` + status badge (+ optional action); body = `flex flex-col lg:flex-row gap-6` — left `flex-1` column of card sections, right `lg:w-[~340px] shrink-0 self-start lg:sticky lg:top-[88px]` column (the seller header is 72px). Card const: `bg-white rounded-xl shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] flex flex-col`.

## Conventions
- **Status badge:** `inline-flex items-center justify-center px-3 py-1 rounded text-[12px] font-medium whitespace-nowrap` with `style={{ backgroundColor, color }}`. Palette: positive/active `#d6fc92`/`#235c04`; warning/pending `#fdefb0`/`#863a00`; info/in-progress `#cce7ff`/`#025094`; quoted/purple `#f5ebfe`/`#5824d4`; critical/expired/rejected `#feeaed`/`#a3072b`; draft grey `#e5e9ee`/`#56657a`.
- **Toggle ↔ status:** keep `statuses: Record<id, Status>` state; `<Switch isSelected onValueChange>`; badge + tab filter read from it. When a toggle shouldn't be usable (e.g. out of stock) disable it AND wrap in HeroUI `Tooltip` explaining why.
- **Modals:** HeroUI `Modal isOpen onClose placement="center" size="md|lg" hideCloseButton scrollBehavior="inside" classNames={{base:"rounded-2xl"}}`; `ModalHeader` = flex justify-between border-b p-4, title `text-[18px] font-semibold`, custom close = `w-6 h-6 rounded-full bg-[var(--color-neutral-200)]` + lucide `X size={12} strokeWidth={2.5}`; `ModalFooter` border-t p-4 with bordered "ยกเลิก" + primary "บันทึก". Reset state in `useEffect([isOpen])`.
- **Dropdowns:** HeroUI `Select`/`SelectItem` with the `selectClassNames` trigger/value override — never native `<select>`.
- **Drag-to-reorder:** framer-motion `Reorder.Group` / `Reorder.Item` + `useDragControls` for handle-only dragging (`dragListener={false}`), `whileDrag` for lift feedback — not hand-rolled HTML5 DnD.
- **`position: sticky` gotcha:** never put `overflow-hidden` / `overflow-x-auto` / any non-`visible` overflow on an ancestor of a sticky element — it traps the sticky child (caused several "TabBar/header renders mid-list" bugs). For rounded corners on a card wrapping a sticky bar, give the sticky child its own `rounded-t-*` instead. For mobile-wide tables, make columns responsive (`hidden sm:block`) rather than wrapping in `overflow-x-auto`.
- Design tokens are CSS vars in `src/index.css` (`--color-primary`, `--color-neutral-*`, `--color-critical`, `--color-positive-*`, etc.) — use them, don't hardcode raw colors (except Figma-specific badge hex with no token).
- Mock data lives in the page file or `src/components/landing/mockData.ts`.

## Git
Feature branches → PR to `main`. When your branch is behind, `git merge origin/main` into it and make `tsc`/`build` pass before pushing. Resolve conflicts; don't force-push `main`. Don't commit secrets.

## Figma → code workflow
`get_metadata` (structure) → `get_screenshot` (visual) → `get_design_context` (reference code/tokens). The returned React+Tailwind is a *reference* — adapt it to this stack (HeroUI components, flex/grid layout, design tokens, the shared components above). Download new assets into `src/assets/` only when none already fit.
