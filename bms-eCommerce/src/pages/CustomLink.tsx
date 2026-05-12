import { useState } from "react";
import { Link } from "react-router";
import Icon from "../components/landing/Icon";
import { AffiliateHeader, AffiliateSidebar } from "../components/AffiliateChrome";

const PLACEHOLDERS = [
  "paiboon", "Bangkok", "Sri2000", "paiboon19", "Sri2000",
  "Sri2000", "Sri2000", "Sri2000", "Sri2000", "Sri2000",
];

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 text-[13px] text-[var(--color-neutral-500)]">
      <Link to="/affiliate/overview" className="hover:text-[var(--color-primary)]">
        สินค้าลิงก์คอมมิชชัน
      </Link>
      <span>/</span>
      <span className="text-[var(--color-neutral-900)]">ลิงก์ที่กำหนดเอง</span>
    </nav>
  );
}

export default function CustomLink() {
  const [values, setValues] = useState<string[]>(() => Array(10).fill(""));

  const setAt = (i: number, v: string) =>
    setValues((prev) => prev.map((x, idx) => (idx === i ? v : x)));

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <AffiliateHeader />
      <div className="flex">
        <AffiliateSidebar active="ลิงก์ที่กำหนดเอง" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 flex flex-col gap-5">
          <Breadcrumb />

          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h1 className="text-[20px] font-bold text-[var(--color-primary-700)]">
                ลิงก์ที่กำหนดเอง
              </h1>
              <p className="text-[14px] text-[var(--color-neutral-600)]">
                สร้างลิงก์ของคุณเพื่อโปรโมต BMS E-Commerce หรือสินค้า
              </p>
            </div>

            {/* Example box */}
            <div className="rounded-xl border border-[var(--color-neutral-300)] bg-[#f9fbfd] px-4 py-3 text-[14px] text-[var(--color-neutral-700)] leading-relaxed">
              <p>ตัวอย่าง :</p>
              <p>* ลิงก์เดิม https://BMS.co.th/</p>
              <p>* ลิงก์ใหม่ที่ใส่ตัวอักษร (Sub_id) https://BMS.co.th/paiboon</p>
            </div>

            <p className="text-[13px] text-[var(--color-critical)]">
              *หากต้องการที่จะแปลงลิงก์มากกว่า 1 ลิงก์ สามารถใส่ได้มากถึง 10 ลิงก์พร้อมกันได้เลยสะดวกรวดเร็ว
            </p>

            <span className="block h-px bg-[var(--color-neutral-200)]" />

            <p className="text-[14px] text-[var(--color-neutral-700)] leading-relaxed">
              คุณสามารถเพิ่มตัวอักษรเพิ่มเติม เพื่อติดตามประสิทธิภาพการเชื่อมโยงของคุณโดยการติดแท็ก Sub_Id ที่ URL
              ค่าตัวเลข (a-z, A-Z, 0-9) คลิก{" "}
              <span className="font-medium text-[var(--color-neutral-900)]">"รับลิงก์"</span>{" "}
              โดยตรงหากคุณไม่ต้องการที่จะผนวกพารามิเตอร์ที่เชื่อมโยงของคุณ
            </p>

            {/* Sub_id inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-[1000px] mx-auto w-full">
              {values.map((v, i) => (
                <label key={i} className="flex items-center gap-3">
                  <span className="w-[72px] shrink-0 text-[14px] text-[var(--color-neutral-700)] text-right">
                    Sub_id {i + 1}
                  </span>
                  <input
                    value={v}
                    onChange={(e) => setAt(i, e.target.value)}
                    placeholder={`ตัวอย่าง : ${PLACEHOLDERS[i]}`}
                    className="flex-1 min-w-0 h-10 px-3 rounded-lg border border-[var(--color-neutral-300)] bg-white text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] outline-none focus:border-[var(--color-primary)]"
                  />
                </label>
              ))}
            </div>

            <div className="flex justify-center pt-1">
              <button
                type="button"
                className="inline-flex items-center gap-2 h-11 px-8 rounded-lg bg-[var(--color-primary)] text-white text-[15px] font-medium hover:brightness-110 transition"
              >
                <Icon name="link" size={18} />
                รับลิงก์
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
