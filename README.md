# Brightify — E-Commerce by BMS

เว็บแอปพลิเคชัน E-Commerce ฝั่งหน้าร้าน (storefront) สำหรับ BMS พัฒนาเป็น **prototype ระดับ UI** ที่แปลงจากดีไซน์ใน Figma มาเป็นโค้ด React ที่ใช้งานจริงได้ (คลิก/นำทาง/เปิด modal/สลับแท็บได้) โดยข้อมูลทั้งหมดยังเป็น mock data

> โปรเจกต์นี้เริ่มต้นจากเทมเพลต “React Design Starter” แล้วถูกพัฒนาต่อยอดเป็นแอป Brightify เต็มรูปแบบ

---

## สารบัญ

- [ภาพรวมแอป](#ภาพรวมแอป)
- [ความคืบหน้า (Work Progress)](#ความคืบหน้า-work-progress)
- [Tech Stack](#tech-stack)
- [การติดตั้งและรัน](#การติดตั้งและรัน)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [เส้นทาง (Routes)](#เส้นทาง-routes)
- [กระบวนการพัฒนา (Development Process)](#กระบวนการพัฒนา-development-process)
  - [1. Workflow แปลงดีไซน์ Figma → โค้ด](#1-workflow-แปลงดีไซน์-figma--โค้ด)
  - [2. หลักการ “Reuse Component”](#2-หลักการ-reuse-component)
  - [3. Shared Components / Patterns ที่สร้างขึ้น](#3-shared-components--patterns-ที่สร้างขึ้น)
  - [4. ระบบ Routing และการรักษา Scroll](#4-ระบบ-routing-และการรักษา-scroll)
  - [5. Responsive / Mobile](#5-responsive--mobile)
  - [6. บทเรียนที่เจอบ่อย (Gotchas)](#6-บทเรียนที่เจอบ่อย-gotchas)
- [Convention ในการเขียนโค้ด](#convention-ในการเขียนโค้ด)
- [Workflow ของ Git](#workflow-ของ-git)
- [Quality Gates](#quality-gates)

---

## ภาพรวมแอป

แอปครอบคลุมฟีเจอร์หลักของหน้าร้าน E-Commerce:

- **หน้า Public** — หน้าแรก (hero / flash sale / หมวดหมู่ / แนะนำสินค้า), รายการสินค้าทั้งหมด, รายละเอียดสินค้า (ทั้งแบบทั่วไปและแบบยา/เวชภัณฑ์ที่มีปุ่ม “เสนอราคา”), หน้าร้านค้า, เข้าสู่ระบบ
- **ตะกร้า & ชำระเงิน** — ตะกร้าแยกตามร้าน, หน้า Checkout พร้อม modal เลือก/เพิ่มที่อยู่ และเลือก/เพิ่มบัตร/บัญชีธนาคาร, แถบสรุปยอดแบบ sticky
- **ศูนย์รวมบัญชี (Profile area)** ที่ใช้ layout ร่วมกัน:
  - บัญชีของฉัน (ข้อมูลส่วนตัว / บัญชีธนาคารและบัตร / ที่อยู่)
  - การสั่งซื้อ (แท็บตามสถานะ + การ์ดออเดอร์ 6 สถานะ)
  - ใบเสนอราคา (ตารางแบบ paginate + หน้ารายละเอียดที่มี stepper 7 ขั้น และการอัปโหลด PDF ที่ลงนาม)
  - BMS Member (บัตรสมาชิก gradient, เงื่อนไข, ประวัติ Point)
  - การแจ้งเตือน (แท็บหมวดหมู่ + อ่านทั้งหมด)
  - โค้ดส่วนลด (แท็บหมวดหมู่ + การ์ดคูปองแบบตั๋ว)
  - สิ่งที่ถูกใจ (กริดสินค้า reuse `ProductCard`)
  - วิธีการชำระเงิน / การตั้งค่าการแจ้งเตือน
- **Modal flows** — ขอใบเสนอราคา (สำหรับสินค้าเวชภัณฑ์) → เลือกสินค้าเพิ่ม, เพิ่ม/เลือกที่อยู่, เพิ่ม/เลือกบัตร & บัญชีธนาคาร
- **ส่วนเสริม** — Playground (sandbox สำหรับนักออกแบบ), Docs (ฝัง doc ของ HeroUI components)

ดูภาพรวมเส้นทางทั้งหมดได้ที่ไฟล์ [`sitemap.svg`](./bms-eCommerce/sitemap.svg)

> โค้ดแอปทั้งหมดอยู่ในโฟลเดอร์ [`bms-eCommerce/`](./bms-eCommerce/) ของ repo นี้

---

## ความคืบหน้า (Work Progress)

สถานะ: prototype ระดับ UI — flow คลิก/นำทาง/เปิด modal ทำงานครบ ข้อมูลยังเป็น mock data

### หน้าที่ทำเสร็จแล้ว

**ฝั่งลูกค้า (Storefront)**
- หน้าแรก / Landing — hero, flash sale, หมวดหมู่, แนะนำสินค้า
- รายการสินค้าทั้งหมด · รายละเอียดสินค้า (ทั่วไป + เวชภัณฑ์ที่มีปุ่ม “เสนอราคา”) · หน้าร้านค้า · เข้าสู่ระบบ
- ตะกร้า (แยกตามร้าน) · Checkout — modal เลือก/เพิ่มที่อยู่ + บัตร/บัญชีธนาคาร, แถบสรุปยอด sticky
- บัญชีของฉาน (`/settings`) — ข้อมูลส่วนตัว / บัญชีธนาคารและบัตร / ที่อยู่ + sub-panel วิธีการชำระเงิน + การตั้งค่าการแจ้งเตือน
- การสั่งซื้อ (`/delivery`) — แท็บตามสถานะ + `OrderCard` 6 สถานะ, ปุ่มคัดลอกเลขพัสดุ
- ใบเสนอราคา (`/quotation`) — ตารางแบบ paginate + รายละเอียด (`/quotation/:id`) ที่มี stepper 7 ขั้น (รองรับ 3 สถานะ) + อัปโหลด PDF ที่ลงนาม
- BMS Member (`/bms-member`) — บัตรสมาชิก gradient ตรงดีไซน์ + เงื่อนไข + ประวัติ Point
- การแจ้งเตือน / โค้ดส่วนลด / สิ่งที่ถูกใจ — แท็บหมวดหมู่ + การ์ดเฉพาะของแต่ละหน้า
- Affiliate Registration (`/affiliate/register`) — ฟอร์มสมัคร (บุคคล/นิติบุคคล) + modal เพิ่มบัญชี Social + หน้า success

**ฝั่งร้านค้า (Seller)**
- ภาพรวมร้านค้า (`/seller/overview`) · คำสั่งซื้อ (`/seller/orders`) · เข้าสู่ระบบ / สมัครร้านค้า — *จากทีมอื่น*
- ใบเสนอราคา (`/seller/quotes`) — ตารางใบเสนอราคา, แท็บสถานะ 8 แท็บ, pagination, เลือกหลายรายการ + dock bar ลอย (อัปเดตคำขอ / ยกเลิกคำขอ), drawer “การดำเนินการ” (timeline 7 ขั้น + ปุ่ม “ดำเนินการต่อ” เลื่อน stepper); “อัปเดตคำขอ” กดได้เฉพาะเมื่อรายการที่เลือกสถานะเดียวกัน
- รายละเอียดใบเสนอราคา (`/seller/quotes/:id`) — รายละเอียดใบเสนอราคา / การจัดการ (แก้ราคาต่อชิ้น, สวิตช์ VAT, อายุใบเสนอราคา/เงื่อนไขการชำระเงิน/ระยะเวลาจัดส่ง) / การตั้งค่า PDF (ผู้เสนอราคา–ผู้อนุมัติ + เลือกรายชื่อ + เซ็นด้วยตนเอง) / timeline ด้านขวา; แถวในตารางคลิกแล้วมาหน้านี้

### Flow ลายเซ็น (ใหม่)
- `SignaturePad` — กล่องลายเซ็นที่ **วาดได้จริง** ด้วยเมาส์/นิ้ว (canvas, รองรับ device pixel ratio) + แท็บ “อัปโหลดรูปภาพ” (เลือกไฟล์ เก็บชื่อไฟล์); ปุ่ม “ล้างทั้งหมด” — เป็นคอมโพเนนต์ใช้ซ้ำ
- `SelectNameModal` (“เลือกรายชื่อ” + ฟอร์ม “เพิ่มรายชื่อ”), `OwnSignatureModal` (“เซ็นด้วยตนเอง”)
- ในการตั้งค่า PDF ของหน้ารายละเอียดใบเสนอราคา: ช่องผู้เสนอราคา/ผู้อนุมัติแสดงสถานะ “มีลายเซ็นแล้ว” (เมื่อเลือกรายชื่อที่มีลายเซ็น) หรือป้าย “เซ็นแล้ว” + แถวแนบลายเซ็น (วาด/อัปโหลด พร้อมปุ่มลบ); ลายเซ็นที่วาดจะแสดง preview เป็นรูปย่อ

### แอนิเมชัน
- `dock-bar-in` — แถบ dock เลื่อนขึ้น + จาง
- `drawer-panel-in` / `drawer-overlay-in` — drawer สไลด์จากขวา + พื้นหลังจาง
- `step-row-in` — timeline ทยอยเข้าทีละขั้น + จุด/เส้น/ข้อความเปลี่ยนสีนุ่ม ๆ ตอนเลื่อนขั้น
- (keyframes ทั้งหมดอยู่ใน `src/index.css`)

### ค้างไว้ / ยังไม่ทำ
- หน้า Seller ส่วนอื่น (สินค้า / การตลาด / โลจิสติกส์ / รีวิว / แชท / การวิเคราะห์ / กระเป๋าเงิน / การตั้งค่าร้านค้า)
- หน้าสมัครบัญชีลูกค้า / ลืมรหัสผ่าน, หน้าผลการค้นหา, Affiliate dashboard
- การเชื่อมข้อมูลจริง (ทั้งหมดยังเป็น mock)

---

## Tech Stack

| ด้าน | เทคโนโลยี |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Routing | `react-router` v7 (`BrowserRouter` + `basename` = `import.meta.env.BASE_URL` รองรับ GitHub Pages) |
| UI Library หลัก | HeroUI (`@heroui/react`) — Modal, Input, Select, Switch, Button ฯลฯ |
| UI เสริม | MUI, Radix UI Themes/primitives, Framer Motion, Lucide icons |
| Styling | Tailwind CSS v4 (ผ่าน `@tailwindcss/vite`) + CSS variables เป็น design tokens |
| Lint | ESLint + `typescript-eslint` + `eslint-plugin-react-hooks` / `react-refresh` |

**Design tokens** อยู่ใน `src/index.css` เป็น CSS custom properties เช่น `--color-primary`, `--color-neutral-*`, `--color-critical`, `--color-positive-*`, `--color-warning-*`, `--color-promote-*` — โค้ดทั้งโปรเจกต์อ้างอิงผ่านตัวแปรเหล่านี้ (หรือใช้รูป `text-[var(--color-primary)]` ตามสไตล์เดิมของโปรเจกต์)

---

## การติดตั้งและรัน

> ต้องมี Node.js (LTS) — ดาวน์โหลดที่ https://nodejs.org

```bash
# เข้าไปในโฟลเดอร์โค้ดแอปก่อน
cd bms-eCommerce

# ติดตั้ง dependencies
npm install

# รัน dev server (http://localhost:5173)
npm run dev

# ตรวจ type + build production ลงโฟลเดอร์ dist/
npm run build

# พรีวิว production build
npm run preview

# ตรวจ lint
npm run lint
```

---

## โครงสร้างโปรเจกต์

```
src/
├── main.tsx                 # entry point — ประกาศ <Routes>, ScrollToTop, providers (HeroUI/MUI/Radix)
├── App.tsx                  # หน้าแรก (Landing)
├── index.css                # design tokens (CSS variables) + keyframes แอนิเมชัน
├── pages/                   # หนึ่งไฟล์ = หนึ่งหน้า (route)
│   ├── AllProducts.tsx      ProductDetail.tsx   StoreProfile.tsx   Login.tsx
│   ├── Cart.tsx             Checkout.tsx
│   ├── UserSettings.tsx     # บัญชีของฉัน + sub-panels (payment / notification settings)
│   ├── Delivery.tsx         Quotation.tsx       QuotationDetail.tsx
│   ├── BmsMember.tsx        Notifications.tsx   Coupons.tsx        Favorites.tsx
│   ├── AffiliateRegister.tsx
│   ├── SellerLogin.tsx      SellerRegister.tsx  SellerOverview.tsx SellerOrders.tsx   # ฝั่งร้านค้า (บางส่วนจากทีมอื่น)
│   ├── SellerQuotes.tsx     SellerQuoteDetail.tsx                                     # ใบเสนอราคา (ร้านค้า)
│   ├── Playground.tsx       # sandbox สำหรับนักออกแบบ
│   └── docs/                # DocsIndex.tsx + DocEmbed.tsx (ฝัง iframe doc ของ HeroUI)
├── components/landing/      # คอมโพเนนต์ที่ใช้ร่วมกันหลายหน้า
│   ├── Header.tsx           Footer.tsx
│   ├── ProfilePageShell.tsx # โครงหน้า profile (banner + sidebar) — ใช้ซ้ำหลายหน้า
│   ├── TabBar.tsx           # แท็บ segmented control แบบ generic
│   ├── ProductCard.tsx      ProductCarousel.tsx ProductGridSection.tsx
│   ├── OrderCard.tsx        # การ์ดออเดอร์ — รองรับ 6 สถานะ + ปุ่มตามสถานะ
│   ├── ProductDetailHero.tsx
│   ├── QuoteRequestModal.tsx AddProductModal.tsx AddSocialLinkModal.tsx
│   ├── SignaturePad.tsx     SelectNameModal.tsx OwnSignatureModal.tsx   # flow ลายเซ็น (วาด/อัปโหลด/เลือกรายชื่อ)
│   ├── AddressModals.tsx    PaymentModals.tsx   AddressModal.tsx
│   ├── HeroBanner.tsx PromoBanners.tsx CategoryGrid.tsx FlashSaleSection.tsx
│   ├── CountdownTimer.tsx CartItemRow.tsx SectionHeader.tsx Icon.tsx
│   └── mockData.ts
├── lib/
│   └── flyToCart.ts         # แอนิเมชัน “บินเข้าตะกร้า”
└── assets/                  # รูปสินค้า, แบนเนอร์, โลโก้ payment/shipping, bms-logo-blue.png
```

---

## เส้นทาง (Routes)

ประกาศไว้ใน `src/main.tsx`:

| Path | หน้า |
|---|---|
| `/` | หน้าแรก / Landing |
| `/login` | เข้าสู่ระบบ |
| `/products` · `/products/:id` | รายการสินค้า · รายละเอียดสินค้า |
| `/store/:id` | หน้าร้านค้า |
| `/cart` · `/checkout` | ตะกร้า · ชำระเงิน |
| `/settings` | บัญชีของฉัน (รวม sub-panel: วิธีการชำระเงิน / การตั้งค่าการแจ้งเตือน) |
| `/delivery` | การสั่งซื้อ / สถานะจัดส่ง |
| `/quotation` · `/quotation/:id` | ใบเสนอราคา · รายละเอียดใบเสนอราคา (`?status=` เปลี่ยน stepper) |
| `/bms-member` | BMS Member |
| `/notifications` | การแจ้งเตือน |
| `/coupons` | โค้ดส่วนลด |
| `/favorites` | สิ่งที่ถูกใจ |
| `/seller/login` · `/seller/register` | เข้าสู่ระบบ / สมัครร้านค้า (จากทีมอื่น) |
| `/seller/overview` · `/seller/orders` | ภาพรวมร้านค้า · คำสั่งซื้อ (จากทีมอื่น) |
| `/seller/quotes` · `/seller/quotes/:id` | ใบเสนอราคา (ร้านค้า) · รายละเอียดใบเสนอราคา (`?status=` เปลี่ยน stepper) |
| `/affiliate/register` | สมัคร Affiliate |
| `/playground` · `/docs` · `/docs/:component` | Sandbox · เอกสาร HeroUI |

---

## กระบวนการพัฒนา (Development Process)

### 1. Workflow แปลงดีไซน์ Figma → โค้ด

แต่ละหน้า/คอมโพเนนต์ในแอปนี้ถูกสร้างจากเฟรมใน Figma โดยมีขั้นตอนดังนี้:

1. **ดึงดีไซน์จาก Figma** — ใช้ Figma MCP (`get_metadata` เพื่อดูโครงสร้างเฟรม, `get_screenshot` เพื่อดูภาพ, `get_design_context` เพื่อดูโค้ดอ้างอิง + ค่า token + สี)
2. **ตีความเป็นโครงสร้าง** — โค้ดที่ Figma ให้มาเป็น React+Tailwind แบบ absolute-position เป็นแค่ *reference* ไม่ใช่โค้ดสุดท้าย ต้องแปลงให้เข้ากับ stack จริง (HeroUI components, layout แบบ flex/grid, design tokens ของโปรเจกต์)
3. **เทียบ pattern ที่มีอยู่แล้ว** — ก่อนเขียนใหม่ ต้องเช็คก่อนว่ามีคอมโพเนนต์/หน้าที่คล้ายกันอยู่แล้วหรือไม่ (เช่น หน้า profile ใหม่ ๆ ใช้ `ProfilePageShell` ร่วมกัน, แท็บใช้ `TabBar`, การ์ดสินค้าใช้ `ProductCard`)
4. **Implement + ต่อ flow** — สร้างไฟล์หน้าใน `src/pages/`, เพิ่ม `<Route>` ใน `main.tsx`, แล้ว “เดินสาย” (wire) ปุ่ม/ลิงก์ที่เกี่ยวข้อง — เช่นเพิ่มเมนูใน sidebar, ลิงก์ใน Header dropdown, เพิ่มเข้า `PROFILE_PATHS`
5. **ตรวจสอบ** — `npx tsc --noEmit` + `npm run build` ทุกครั้งก่อนถือว่าเสร็จ

> ตัวอย่างที่ทำตามขั้นตอนนี้: หน้า BMS Member — การ์ดบัตรสมาชิกถูกสร้างให้ตรงดีไซน์โดยดึง gradient / วงรีตกแต่ง / โลโก้ glossy จาก Figma มาเป็น CSS radial-gradient + รูป asset จริงที่ดาวน์โหลดเก็บไว้ใน `src/assets/bms-logo-blue.png`

### 2. หลักการ “Reuse Component”

หลักการสำคัญของโปรเจกต์: **ก่อนสร้างคอมโพเนนต์/หน้าใหม่ ให้สำรวจของเดิมก่อนเสมอ**

- ตรวจ `src/components/landing/` และ `src/pages/` ก่อน — ถ้ามี pattern คล้ายกันให้ reuse แทนสร้างใหม่
- หน้าใหม่ที่หน้าตาคล้ายของเดิม (เช่น Delivery / Quotation / BmsMember หน้าตาเหมือน UserSettings — banner + sidebar + เนื้อหา) ให้ใช้โครงเดียวกัน
- ถ้ารูปแบบเดียวกันจะปรากฏหลายที่ ให้แยกเป็น shared component แล้ว parametrize ด้วย props/variants แทนการ copy
- reuse asset ใน `src/assets/`, reuse CSS variables, reuse HeroUI components ตามแบบที่ใช้อยู่แล้ว (รวมถึง `classNames` overrides ของ Input/Select)

### 3. Shared Components / Patterns ที่สร้างขึ้น

| คอมโพเนนต์ | หน้าที่ | ใช้ที่ |
|---|---|---|
| `ProfilePageShell` | Header + แบนเนอร์โปรไฟล์ (responsive) + sidebar (sticky บน desktop / pill scroll บน mobile) + Footer; รับ `activeKey` และ `onItemClick` (ให้ UserSettings สลับ sub-panel ในหน้าเดียวแทนการเปลี่ยน route) | UserSettings, Delivery, Quotation, BmsMember, Notifications, Coupons, Favorites |
| `TabBar` | segmented control แบบ generic — รองรับ `count` badge, prop `sticky`, รับ `className` (เช่น `rounded-t-2xl` ให้มุมตรงกับ card) | Delivery, Quotation, UserSettings; รูปแบบเดียวกันถูกคัดลอกใน Notifications / Coupons / Favorites (เพราะมี layout เฉพาะ — มีลิงก์ข้าง ๆ ในแถวเดียวกัน) |
| `OrderCard` | การ์ดออเดอร์ — สี badge ตามสถานะ (`wait_pay` / `arranging` / `shipping` / `delivered` / `received` / `cancelled`), แถวขนส่ง + เลขพัสดุ + ปุ่มคัดลอก, ปุ่มตามสถานะ; responsive (มือถือ stack แนวตั้ง) | Delivery |
| `ProductCard` | การ์ดสินค้า — `variant: "default" \| "quote"` (quote = ปุ่มตะกร้า + “ขอใบเสนอราคา” → เปิด `QuoteRequestModal`), prop `flashSale` (โชว์แบนเนอร์ FLASHSALE + countdown) | AllProducts, ProductDetail, StoreProfile, Favorites, carousels |
| `QuoteRequestModal` + `AddProductModal` | flow ขอใบเสนอราคาสำหรับสินค้าเวชภัณฑ์ — รายการสินค้า + stepper จำนวน + ฟอร์มข้อมูลลูกค้า + ที่อยู่จัดส่ง + หมายเหตุ; ปุ่ม “+ เพิ่มสินค้า” เปิด modal เลือกจาก catalog | ProductDetailHero, ProductCard |
| `AddressModals` (`SelectAddressModal` / `AddAddressModal`), `PaymentModals` (`SelectCardModal` / `AddCardModal` / `SelectBankModal` / `AddBankModal`) | modal เลือก/เพิ่มที่อยู่และวิธีชำระเงิน | Checkout, UserSettings |
| `SignaturePad` | กล่องลายเซ็นวาดได้จริง (canvas + pointer events, รองรับ DPR, `touch-none`) + แท็บอัปโหลดรูป + ปุ่มล้าง; รายงานผลผ่าน `onChange(SignatureResult \| null)` | `SelectNameModal`, `OwnSignatureModal` |
| `SelectNameModal` / `OwnSignatureModal` | modal “เลือกรายชื่อ” (+ ฟอร์ม “เพิ่มรายชื่อ” พร้อม `SignaturePad`) / “เซ็นด้วยตนเอง” | SellerQuoteDetail (การตั้งค่า PDF) |
| `AddSocialLinkModal` | modal เพิ่มลิงก์บัญชี Social ตอนสมัคร Affiliate | AffiliateRegister |

### 4. ระบบ Routing และการรักษา Scroll

- `ScrollToTop` ใน `main.tsx` จะ scroll ขึ้นบนสุดทุกครั้งที่ `pathname` เปลี่ยน — **ยกเว้น** เมื่อสลับไปมาระหว่างหน้าในกลุ่ม `PROFILE_PATHS` (`/settings`, `/delivery`, `/quotation`, `/bms-member`, `/notifications`, `/coupons`, `/favorites`) เพราะหน้ากลุ่มนี้ใช้ sidebar ร่วมกัน — ผู้ใช้ที่เลื่อนลงมาแล้วคลิกเมนูในแถบข้างจะได้อยู่ที่ตำแหน่ง scroll เดิม
- `ProfilePageShell` จัดการ navigation ของ sidebar ผ่าน `path` ของแต่ละ item ส่วน `UserSettings` ส่ง `onItemClick` ของตัวเองเข้าไป — ถ้า path ไม่ใช่ `/settings` ก็ `navigate(path)` ไม่อย่างนั้น `setActive(key)` เพื่อสลับ sub-panel ในหน้าเดิม

### 5. Responsive / Mobile

- `ProfilePageShell` — แบนเนอร์/อวตารเล็กลงบนมือถือ, profile row stack แนวตั้ง, ปุ่ม Seller/Affiliate เต็มความกว้าง; sidebar เปลี่ยนเป็นแถบ pill เลื่อนแนวนอนบนมือถือ (≤ `lg`) และเป็น sidebar แนวตั้งแบบ sticky บน desktop
- `OrderCard` / `TabBar` — แถวข้อมูล stack บนมือถือ, ปุ่มกลายเป็น `flex-1`, แท็บเลื่อนแนวนอนแทนการบีบทุกแท็บให้พอดี
- ตาราง Quotation — ใช้วิธี “ซ่อนคอลัมน์รอง” บนจอเล็ก (`hidden sm:block` / `hidden md:block`) แทนการ scroll แนวนอน (ดูเหตุผลในหัวข้อ Gotchas)

### 6. บทเรียนที่เจอบ่อย (Gotchas)

- **`position: sticky` + ancestor ที่มี `overflow` ไม่ใช่ `visible`** — ถ้า element พ่อ-แม่ของ sticky มี `overflow-hidden` / `overflow-clip` / `overflow-x-auto` / `overflow-y-auto` / `overflow-scroll` element จะถูกขังในกรอบนั้นและ “ไม่ติด” กับ viewport (เคยเจอ TabBar / หัวตารางหลุดไปแสดงกลางรายการ) วิธีแก้: อย่าใส่ overflow เหล่านี้บน ancestor ของ sticky — ถ้าอยากได้มุมโค้ง ให้ใส่ `rounded-t-2xl` ที่ตัว sticky เอง; ถ้าอยากให้ตาราง scroll บนมือถือ ให้ทำคอลัมน์ responsive แทน
- **HeroUI Modal + reset state** — pattern reset state เมื่อ `isOpen` เปลี่ยนทำใน `useEffect` (ESLint จะเตือน “setState in effect” ซึ่งเป็น pattern ที่ยอมรับในโปรเจกต์นี้)
- **คลาส Tailwind แบบ arbitrary** (`text-[var(--color-primary)]`) — ESLint จะเตือนว่า “เขียนแบบ canonical ได้” แต่โปรเจกต์ใช้รูปแบบนี้ทั้งหมดเพื่อความสม่ำเสมอ จึงปล่อยไว้

---

## Convention ในการเขียนโค้ด

- หนึ่งหน้า = หนึ่งไฟล์ใน `src/pages/` และต้องมี `<Route>` ใน `main.tsx`
- ใช้ design tokens (CSS variables) เสมอ ไม่ hardcode สีดิบ (ยกเว้นสีจาก Figma ที่ยังไม่มี token เช่นสี badge เฉพาะ)
- ใช้ HeroUI components สำหรับ form / modal / button ตามแบบที่ใช้อยู่แล้ว
- ข้อความ UI เป็นภาษาไทย (ตามดีไซน์)
- mock data ประกาศไว้ในไฟล์หน้านั้น ๆ หรือใน `mockData.ts`
- คอมโพเนนต์ที่ใช้ร่วมหลายหน้าอยู่ใน `src/components/landing/`

---

## Workflow ของ Git

- ทำงานบน feature branch (เช่น `Joe`, `Auan`) แล้วเปิด PR ไปยัง `main`
- ทุก PR ที่ merge แล้วจะปรากฏเป็น merge commit ใน `main`
- เมื่อ branch แตกจาก `main` (มีคนอื่น merge เข้าก่อน) ให้ `git merge origin/main` เข้า branch ตัวเอง แก้ conflict ให้ครบ (เช่น conflict ที่ `MenuLink` ใน `Header.tsx` — รวม prop `to` กับ `onClick` ให้รองรับทั้งคู่) แล้วให้ `tsc` / `build` ผ่านก่อน push
- ไม่ commit ไฟล์ที่อาจมี secret, ไม่ force-push ไป `main`

---

## Quality Gates

ก่อน push ทุกครั้ง:

1. `npx tsc --noEmit` — ต้องไม่มี error
2. `npm run build` — ต้อง build ผ่าน
3. `npm run lint` — ตรวจดูว่าไม่มี error ใหม่ที่เป็นปัญหาจริง (โปรเจกต์มี baseline ของ `no-unused-vars` / `setState in effect` / arbitrary-class warnings ที่ยอมรับอยู่แล้ว)
4. ถ้าเป็นงาน UI — เปิดดูบนเบราว์เซอร์จริง ทดสอบทั้ง desktop และ mobile width
