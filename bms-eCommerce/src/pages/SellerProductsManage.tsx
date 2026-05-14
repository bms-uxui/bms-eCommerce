import { useState } from "react";
import { useNavigate } from "react-router";
import { Switch, Tooltip } from "@heroui/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Icon from "../components/landing/Icon";
import SearchIcon from "../components/SearchIcon";
import { SellerHeader, SellerSidebar } from "../components/SellerChrome";
import paracetamol from "../assets/products/p02-paracetamol.jpg";

type PStatus = "active" | "inactive" | "out";

const STATUS: Record<PStatus, { label: string; bg: string; text: string }> = {
  active: { label: "เปิดขาย", bg: "#d6fc92", text: "#235c04" },
  inactive: { label: "ปิดขาย", bg: "#f5ebfe", text: "#5824d4" },
  out: { label: "สินค้าหมด", bg: "#feeaed", text: "#a3072b" },
};

const TABS: { key: "all" | PStatus; label: string; count: number }[] = [
  { key: "all", label: "สินค้าทั้งหมด", count: 6 },
  { key: "active", label: "เปิดขาย", count: 3 },
  { key: "inactive", label: "ปิดขาย", count: 1 },
  { key: "out", label: "สินค้าหมด", count: 1 },
];

type Row = {
  id: string;
  name: string;
  quote?: boolean;
  category: string;
  price: number;
  stock: number;
  sold: number;
  status: PStatus;
};

const PRODUCTS: Row[] = [
  { id: "p1", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใสหัว", category: "ยาสีฟัน", price: 190, stock: 50, sold: 20, status: "active" },
  { id: "p2", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใสหัว", quote: true, category: "ยาสีฟัน", price: 290, stock: 50, sold: 20, status: "active" },
  { id: "p3", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใสหัว", category: "เครื่องมือการแพทย์", price: 340, stock: 100, sold: 9, status: "inactive" },
  { id: "p4", name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใสหัว", category: "น้ำนมสด", price: 120, stock: 200, sold: 40, status: "out" },
];

const COLS = "grid-cols-[2.2fr_1fr_1fr_1fr_1fr_1fr_1.1fr]";

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function SellerProductsManage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [page, setPage] = useState(2);
  const [statuses, setStatuses] = useState<Record<string, PStatus>>(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.id, p.status]))
  );
  const toggleSale = (row: Row, on: boolean) =>
    setStatuses((s) => ({ ...s, [row.id]: on ? "active" : row.status === "out" ? "out" : "inactive" }));

  const rows = tab === "all" ? PRODUCTS : PRODUCTS.filter((p) => statuses[p.id] === tab);
  const pages = [1, 2, 3, 4, 5, "…", 12] as const;

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      <SellerHeader />
      <div className="flex">
        <SellerSidebar active="การจัดการสินค้า" />
        <main className="flex-1 min-w-0 px-8 py-6 flex flex-col gap-4 min-h-[calc(100vh-72px)]">
          {/* Title + search + add */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-[20px] font-semibold text-[var(--color-primary-700)]">การจัดการสินค้า</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="ค้นหาสินค้า"
                  className="h-10 w-[360px] bg-white border border-[var(--color-neutral-300)] rounded-l-lg px-4 text-[16px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary)]"
                />
                <button type="button" aria-label="ค้นหา" className="h-10 px-4 flex items-center justify-center rounded-r-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-600)] transition-colors">
                  <SearchIcon size={20} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => navigate("/seller/products/new")}
                className="h-10 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium flex items-center gap-2 hover:bg-[var(--color-primary-600)] transition-colors shrink-0"
              >
                <Plus size={16} />
                เพิ่มสินค้าใหม่
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white border border-[var(--color-neutral-200)] rounded-lg p-1 gap-0 w-fit">
            {TABS.map((t) => {
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => { setTab(t.key); setPage(1); }}
                  className={[
                    "h-8 px-4 flex items-center gap-2 rounded text-[14px] font-medium transition-colors whitespace-nowrap",
                    active
                      ? "bg-[var(--color-primary)] text-white shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)]"
                      : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]",
                  ].join(" ")}
                >
                  <span>{t.label}</span>
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-[var(--color-critical)] text-white text-[12px] leading-none">{t.count}</span>
                </button>
              );
            })}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(29,33,45,0.08),0_0_2px_rgba(29,33,45,0.08),0_0_1px_rgba(29,33,45,0.2)] flex flex-col flex-1 min-h-0">
            <div className={`grid ${COLS} bg-[var(--color-primary-100)] border-b border-[var(--color-neutral-200)] text-[12px] font-medium uppercase text-[var(--color-neutral-600)]`}>
              <div className="flex items-center h-9 px-4">สินค้า</div>
              <div className="flex items-center h-9 px-2">หมวดหมู่</div>
              <div className="flex items-center justify-end h-9 px-2">ราคา (฿)</div>
              <div className="flex items-center justify-end h-9 px-2">สต็อกสินค้า</div>
              <div className="flex items-center justify-end h-9 px-2">ขายแล้ว</div>
              <div className="flex items-center justify-center h-9 px-2">สถานะ</div>
              <div className="flex items-center justify-center h-9 px-2">การดำเนินการ</div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              {rows.map((r) => (
                <div key={r.id} className={`grid ${COLS} items-center border-b border-[var(--color-neutral-200)] last:border-b-0 py-3 hover:bg-[var(--color-primary-100)]/40 transition-colors`}>
                  <div className="flex items-center gap-3 px-4 min-w-0">
                    <img src={paracetamol} alt="" className="w-12 h-12 rounded object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[14px] text-[var(--color-neutral-900)] truncate">{r.name}</p>
                      {r.quote && <p className="text-[12px] text-[var(--color-neutral-500)] mt-0.5">ขอใบเสนอราคา</p>}
                    </div>
                  </div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] px-2 truncate">{r.category}</div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] px-2 text-right tabular-nums">{fmt(r.price)}</div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] px-2 text-right tabular-nums">{r.stock}</div>
                  <div className="text-[14px] text-[var(--color-neutral-900)] px-2 text-right tabular-nums">{r.sold}</div>
                  <div className="flex justify-center px-2">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded text-[12px] font-medium whitespace-nowrap" style={{ backgroundColor: STATUS[statuses[r.id]].bg, color: STATUS[statuses[r.id]].text }}>
                      {STATUS[statuses[r.id]].label}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 px-2">
                    {(() => {
                      const outOfStock = r.stock === 0 || statuses[r.id] === "out";
                      return (
                        <Tooltip content="สินค้าหมด — เติมสต็อกก่อนจึงจะเปิดขายได้" placement="top" size="sm" closeDelay={0} isDisabled={!outOfStock}>
                          <span className="inline-flex">
                            <Switch size="sm" color="success" isSelected={statuses[r.id] === "active"} isDisabled={outOfStock} onValueChange={(on) => toggleSale(r, on)} aria-label="เปิด/ปิดขาย" />
                          </span>
                        </Tooltip>
                      );
                    })()}
                    <button type="button" onClick={() => navigate("/seller/products/new")} aria-label="แก้ไข" className="w-7 h-7 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors">
                      <Pencil size={16} />
                    </button>
                    <button type="button" aria-label="ลบ" className="w-7 h-7 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-critical)]/10 hover:text-[var(--color-critical)] transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {rows.length === 0 && <div className="py-16 text-center text-[14px] text-[var(--color-neutral-500)]">ไม่มีสินค้า</div>}
            </div>

            {/* Pagination */}
            <div className="border-t border-[var(--color-neutral-300)] h-14 flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <p className="text-[14px]"><span className="text-[var(--color-neutral-900)]">10,488 </span><span className="text-[var(--color-neutral-500)]">รายการ</span></p>
                <span className="w-px h-6 bg-[var(--color-neutral-300)]" />
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[var(--color-neutral-500)]">แสดง</span>
                  <button type="button" className="h-8 pl-3 pr-2 flex items-center gap-2 rounded-lg bg-white border border-[var(--color-neutral-300)] text-[14px] font-semibold text-[var(--color-primary)]">
                    20<Icon name="chevron-down" size={14} className="text-[var(--color-neutral-600)]" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]" aria-label="ก่อนหน้า"><Icon name="chevron-left" size={16} /></button>
                {pages.map((p, i) => p === "…" ? (
                  <span key={i} className="w-8 h-8 flex items-center justify-center text-[12px] text-[var(--color-neutral-600)]">…</span>
                ) : (
                  <button key={i} type="button" onClick={() => setPage(p)} className={["min-w-8 h-8 px-2 flex items-center justify-center rounded text-[12px] font-medium transition-colors", p === page ? "bg-[#dcf2fe] text-[#0e3ed0]" : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]"].join(" ")}>{p}</button>
                ))}
                <button type="button" onClick={() => setPage((p) => p + 1)} className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100,#f5f8fa)]" aria-label="ถัดไป"><Icon name="chevron-right" size={16} /></button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
