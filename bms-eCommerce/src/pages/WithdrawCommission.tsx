import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Check, X } from "lucide-react";
import Icon from "../components/landing/Icon";
import Pagination from "../components/Pagination";
import StatusBadge, { type StatusTone } from "../components/StatusBadge";
import { AffiliateHeader, AffiliateSidebar } from "../components/AffiliateChrome";
import DateRangePicker from "../components/DateRangePicker";
import kasikornLogo from "../assets/payments/kasikorn.png";

type TxStatus = { label: string; tone: StatusTone };
const STATUSES: TxStatus[] = [
  { label: "กำลังดำเนินการ", tone: "pending" },
  { label: "ถอนเงินไม่สำเร็จ", tone: "danger" },
  { label: "ถอนเงินสำเร็จ", tone: "success" },
  { label: "ถอนเงินสำเร็จ", tone: "success" },
  { label: "ถอนเงินสำเร็จ", tone: "success" },
  { label: "ถอนเงินสำเร็จ", tone: "success" },
];

const TXS = STATUSES.map((s, i) => ({
  id: i,
  type: i % 2 === 0 ? "ถอนเงินคอมมิชชันอัตโนมัติ" : "ถอนเงินคอมมิชชัน",
  date: "27/05/2026 - 12.15",
  amount: 578,
  ref: `567289043594873${(20 + i).toString()}`,
  status: s,
}));

const ACCOUNTS = [
  { bank: "ธนาคารกสิกรไทย", logo: kasikornLogo, masked: "96* **** *08", primary: true },
  { bank: "ธนาคารกสิกรไทย", logo: kasikornLogo, masked: "89* **** *88", primary: false },
];

const TH = "px-3 py-2.5 text-[12px] font-medium text-[var(--color-neutral-500)] align-bottom bg-[#EFF9FE]";
const TD = "px-3 py-3.5 text-[13px] text-[var(--color-neutral-900)] align-middle";
const TR_DATA = "border-b border-[var(--color-neutral-200)] last:border-b-0";

const BALANCE = 6500;
const baht2 = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function WithdrawModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const num = Number(amount.replace(/,/g, "")) || 0;
  const fee = 0;
  const receive = Math.max(0, num - fee);
  const remaining = Math.max(0, BALANCE - num);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const chips: { label: string; value: number }[] = [
    { label: "ถอนทั้งหมด", value: BALANCE },
    { label: "฿ 5,000", value: 5000 },
    { label: "฿ 10,000", value: 10000 },
    { label: "฿ 100,000", value: 100000 },
    { label: "฿ 200,000", value: 200000 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-[527px] max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[var(--color-neutral-200)]">
          <h2 className="text-[20px] font-bold text-[var(--color-primary-700)]">การถอนเงิน</h2>
          <p className="text-[14px] text-[var(--color-neutral-600)] mt-1">
            คุณจะได้รับเงินภายใน 5 วันทำการ
          </p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Account */}
          <div className="flex items-center gap-3">
            <img src={kasikornLogo} alt="" className="w-9 h-9 rounded-md object-cover border border-[var(--color-neutral-200)] shrink-0" />
            <span className="text-[14px] text-[var(--color-neutral-900)] flex-1">ธนาคารกสิกรไทย</span>
            <span className="text-[14px] text-[var(--color-neutral-700)]">96* **** *08</span>
            <button
              type="button"
              className="h-8 px-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition"
            >
              เปลี่ยน
            </button>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[14px] text-[var(--color-neutral-900)]">จำนวนเงิน</span>
            <div className="h-11 px-3 rounded-lg border border-[var(--color-neutral-300)] bg-white flex items-center gap-2 focus-within:border-[var(--color-primary)]">
              <span className="text-[15px] text-[var(--color-neutral-700)]">฿</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ""))}
                placeholder="กรอกจำนวนเงิน"
                inputMode="decimal"
                className="flex-1 min-w-0 bg-transparent text-[15px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] outline-none"
              />
              {amount && (
                <button type="button" onClick={() => setAmount("")} aria-label="ล้าง" className="text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)]">
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>
            <span className="text-[13px] text-[var(--color-neutral-500)]">ยอดคงเหลือ ฿ {baht2(remaining)}</span>
            <div className="flex flex-wrap gap-2 pt-1">
              {chips.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setAmount(String(c.value))}
                  className="h-8 px-3 rounded-lg border border-[var(--color-neutral-300)] text-[13px] text-[var(--color-neutral-700)] hover:border-[var(--color-primary-400)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-medium text-[var(--color-neutral-900)]">รายการ</p>
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-[var(--color-neutral-600)]">ค่าบริการ</span>
              <span className="text-[var(--color-neutral-900)]">฿ {baht2(fee)}</span>
            </div>
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-[var(--color-neutral-600)]">จำนวนเงินที่จะได้รับ</span>
              <span className="text-[var(--color-primary)] font-medium">฿ {baht2(receive)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--color-neutral-200)] flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-lg border border-[var(--color-neutral-400)] text-[var(--color-neutral-900)] text-[14px] font-medium bg-white hover:bg-[var(--color-neutral-100,#f5f8fa)] transition"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={num <= 0}
            className="flex-1 h-10 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 disabled:opacity-50 transition"
          >
            ส่ง
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 text-[14px]">
      <span className="text-[var(--color-neutral-600)] shrink-0">{label}</span>
      <span className="text-right text-[var(--color-neutral-900)]">{children}</span>
    </div>
  );
}

function TxDetailModal({
  tx,
  onClose,
}: {
  tx: (typeof TXS)[number];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const failed = tx.status.tone === "danger";
  const pending = tx.status.tone === "pending";
  const title = failed ? "ถอนเงินไม่สำเร็จ" : pending ? "กำลังดำเนินการถอน" : "ถอนเงินสำเร็จ";
  const subtitle = pending
    ? "คุณจะได้รับเงินภายใน 5 วันทำการ"
    : `วันเวลาที่ดำเนินการสำเร็จ 27/05/2026 - 12.20`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-[400px] max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div
          className="px-6 pt-7 pb-5 flex flex-col items-center text-center gap-3 border-b border-[var(--color-neutral-200)]"
          style={{ background: "linear-gradient(180deg, #eaf6ff 0%, #ffffff 100%)" }}
        >
          <span
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              failed ? "bg-[#f5567a]" : "bg-[#2ecc71]"
            }`}
          >
            {failed ? (
              <X size={28} className="text-white" strokeWidth={3} />
            ) : (
              <Check size={28} className="text-white" strokeWidth={3} />
            )}
          </span>
          <div>
            <h2 className="text-[20px] font-bold text-[var(--color-neutral-900)]">{title}</h2>
            <p className="text-[13px] text-[var(--color-neutral-600)] mt-1">{subtitle}</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-3">
          <p className="text-[14px] font-medium text-[var(--color-neutral-900)]">รายการ</p>
          <DetailRow label="จำนวนเงินที่ถอน">฿ {baht2(tx.amount)}</DetailRow>
          <DetailRow label="ค่าบริการ">฿ 0.00</DetailRow>
          <DetailRow label="จำนวนเงินที่จะได้รับ">฿ {baht2(tx.amount)}</DetailRow>
          <DetailRow label="โอนไปยัง">
            {failed ? (
              <span className="text-[var(--color-critical)]">บัญชีปลายทางมีปัญหา</span>
            ) : (
              <span className="flex flex-col items-end">
                <span>Kasikorn Bank</span>
                <span className="text-[12px] text-[var(--color-neutral-500)]">96* **** *08</span>
              </span>
            )}
          </DetailRow>
          <DetailRow label="หมายเลขอ้างอิง">{tx.ref}</DetailRow>
          <DetailRow label="วันเวลาทำการ">{tx.date}</DetailRow>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-lg bg-[var(--color-primary)] text-white text-[15px] font-medium hover:brightness-110 transition"
          >
            ปิดหน้านี้
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WithdrawCommission() {
  const navigate = useNavigate();
  const [page, setPage] = useState(2);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [detailTx, setDetailTx] = useState<(typeof TXS)[number] | null>(null);

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <AffiliateHeader />
      <div className="flex">
        <AffiliateSidebar active="ถอนเงินคอมมิชชัน" />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 flex flex-col gap-5">
          <nav className="flex items-center gap-1.5 text-[13px] text-[var(--color-neutral-500)]">
            <span>รายได้คอมมิชชัน</span>
            <span>/</span>
            <span className="text-[var(--color-neutral-900)]">ถอนเงินคอมมิชชัน</span>
          </nav>

          <h1 className="text-[20px] font-bold text-[var(--color-neutral-900)]">ถอนเงินคอมมิชชัน</h1>

          {/* Top cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Withdrawable */}
            <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-5 flex flex-col gap-3 justify-between h-full">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[14px] text-[var(--color-neutral-700)]">คอมมิชชันที่สามารถถอนได้</p>
                <p className="text-[12px] text-[var(--color-neutral-500)]">อัปเดตข้อมูลล่าสุดวันที่ 27/04/2026</p>
              </div>
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-baseline gap-2 shrink-0">
                  <span className="text-[34px] font-bold text-[var(--color-primary)] leading-none">฿</span>
                  <span className="text-[34px] font-bold text-[var(--color-primary)] leading-none">6,500</span>
                </div>
                <button
                  type="button"
                  onClick={() => setWithdrawOpen(true)}
                  className="w-[150px] h-10 rounded-lg bg-[#a5e840] text-[#1d212d] text-[14px] font-medium text-center hover:brightness-105 transition shrink-0"
                >
                  ถอนเงิน
                </button>
              </div>
              <p className="text-[12px] text-[var(--color-neutral-500)] leading-relaxed">
                คุณสามารถถอนได้ทุกเดือน และสามารถกำหนดการถอนอัตโนมัติเมื่อมีถึงขั้นต่ำที่ตั้งไว้
                ระบบจะจ่ายถอนให้ในรอบ 1 ครั้งเท่านั้น{" "}
                <button
                  type="button"
                  onClick={() =>
                    navigate("/affiliate/settings", { state: { tab: "บัญชีธนาคารและการชำระเงิน" } })
                  }
                  className="text-[var(--color-primary)] hover:underline"
                >
                  ตั้งค่าการถอนเงินอัตโนมัติ
                </button>
              </p>
            </section>

            {/* Accounts */}
            <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[14px] font-medium text-[var(--color-neutral-900)]">บัญชีการถอนเงิน</p>
                <button
                  type="button"
                  onClick={() =>
                    navigate("/affiliate/settings", { state: { tab: "บัญชีธนาคารและการชำระเงิน" } })
                  }
                  className="text-[13px] text-[var(--color-primary)] hover:underline"
                >
                  จัดการบัญชี
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {ACCOUNTS.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5">
                    <img src={a.logo} alt="" className="w-9 h-9 rounded-md object-cover shrink-0 border border-[var(--color-neutral-200)]" />
                    <div className="flex items-center gap-2 min-w-0 shrink-0">
                      <span className="text-[14px] text-[var(--color-neutral-900)] truncate">{a.bank}</span>
                      {a.primary && (
                        <span className="text-[10px] text-white bg-[#0088ff] px-3 py-1 rounded shrink-0">
                          ค่าเริ่มต้น
                        </span>
                      )}
                    </div>
                    <span className="flex-1 text-right text-[14px] text-[var(--color-neutral-700)]">{a.masked}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* History */}
          <section className="bg-white rounded-2xl border border-[var(--color-neutral-300)] p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-[18px] font-bold text-[var(--color-primary-700)]">ประวัติการทำธุรกรรม</h2>
              <div className="flex items-center gap-3">
                <DateRangePicker />
                <button
                  type="button"
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
                >
                  <Icon name="download" size={18} />
                  ดาวน์โหลด
                </button>
              </div>
            </div>

            <hr className="border-t border-[var(--color-neutral-200)]" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] border-collapse">
                <thead>
                  <tr className="text-left">
                    <th className={`${TH} rounded-l-lg`}>ประเภท</th>
                    <th className={TH}>วันที่-เวลา</th>
                    <th className={`${TH} text-right`}>ยอดเงิน</th>
                    <th className={TH}>หมายเลขอ้างอิง</th>
                    <th className={TH}>สถานะ</th>
                    <th className={`${TH} text-right rounded-r-lg`}>การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {TXS.map((t) => (
                    <tr key={t.id} className={TR_DATA}>
                      <td className={TD}>{t.type}</td>
                      <td className={`${TD} whitespace-nowrap`}>{t.date}</td>
                      <td className={`${TD} text-right whitespace-nowrap`}>
                        {t.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className={`${TD} whitespace-nowrap`}>{t.ref}</td>
                      <td className={TD}>
                        <StatusBadge tone={t.status.tone}>{t.status.label}</StatusBadge>
                      </td>
                      <td className={`${TD} text-right`}>
                        <button
                          type="button"
                          onClick={() => setDetailTx(t)}
                          className="text-[13px] text-[var(--color-primary)] hover:underline"
                        >
                          ดูรายละเอียด
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination page={page} onPageChange={setPage} />
          </section>
        </main>
      </div>

      {withdrawOpen && <WithdrawModal onClose={() => setWithdrawOpen(false)} />}
      {detailTx && <TxDetailModal tx={detailTx} onClose={() => setDetailTx(null)} />}
    </div>
  );
}
