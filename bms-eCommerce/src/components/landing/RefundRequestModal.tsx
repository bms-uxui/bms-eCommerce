import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { ChevronRight, ImageIcon, X } from "lucide-react";

export type RefundProduct = {
  image: string;
  name: string;
  qty: number;
  price: number;
};

const REFUND_REASONS = [
  "ไม่มีการรับพัสดุ",
  "สินค้าไม่ตรงตามที่สั่งซื้อ",
  "สินค้าเสียหาย",
  "สินค้าใช้งานไม่ได้เลย",
  "ส่งสินค้าผิดที่",
  "สินค้าปลอม หลอกลวง",
  "ส่งไม่ทันตามวันที่ต้องจัดส่ง",
];

const baht = (n: number) =>
  `฿ ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type RefundType = "refund_only" | "refund_return";

export default function RefundRequestModal({
  isOpen,
  onClose,
  product,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: RefundProduct;
  onSubmit?: (data: { type: RefundType; reason: string | null; note: string }) => void;
}) {
  const [type, setType] = useState<RefundType>("refund_only");
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [reasonOpen, setReasonOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setType("refund_only");
      setReason(null);
      setNote("");
      setReasonOpen(false);
    }
  }, [isOpen]);

  const refundShipping = 0;
  const totalRefund = product.price + refundShipping;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="center"
        size="md"
        hideCloseButton
        scrollBehavior="inside"
        classNames={{ base: "rounded-2xl !max-w-[600px] w-[600px]" }}
      >
        <ModalContent>
          <ModalHeader className="flex items-center justify-between gap-4 border-b border-[var(--color-neutral-300)] p-6">
            <h2 className="text-[18px] font-semibold leading-4 text-[var(--color-neutral-900)]">
              ขอคืนเงิน/คืนสินค้า
            </h2>
            <button
              type="button"
              aria-label="ปิด"
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-[var(--color-neutral-200)] flex items-center justify-center text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-300)] transition"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          </ModalHeader>

          <ModalBody className="p-0">
            {/* Product summary */}
            <div className="flex items-center gap-4 p-6 border-b border-[#e9f0f4]">
              <img
                src={product.image}
                alt=""
                className="w-16 h-16 rounded object-cover shrink-0"
              />
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <p className="text-[16px] font-medium text-black truncate">{product.name}</p>
                <p className="text-[14px] text-[#798aa3]">จำนวน {product.qty} รายการ</p>
              </div>
              <p className="text-[14px] font-semibold text-[var(--color-primary)] whitespace-nowrap">
                {baht(product.price)}
              </p>
            </div>

            {/* Request type */}
            <div className="flex flex-col gap-2 pt-6 px-6">
              <span className="text-[14px] font-medium text-black">เลือกประเภทคำขอ</span>
              <div className="flex gap-4">
                {([
                  { key: "refund_only", label: "คืนเงินเท่านั้น" },
                  { key: "refund_return", label: "คืนเงินและคืนสินค้า" },
                ] as const).map((opt) => {
                  const active = type === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setType(opt.key)}
                      className={[
                        "flex-1 flex items-center gap-2 p-4 rounded-xl border transition-colors",
                        active
                          ? "border-[var(--color-primary)]"
                          : "border-[#a8b9ca] hover:border-[var(--color-primary-400)]",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "size-4 rounded-full border-2 flex items-center justify-center shrink-0",
                          active ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-[#798aa3] bg-white",
                        ].join(" ")}
                      >
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span
                        className={[
                          "text-[16px] text-left",
                          active ? "text-[#1d212d]" : "text-[#798aa3]",
                        ].join(" ")}
                      >
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Refund breakdown */}
            <div className="flex flex-col gap-4 p-6 border-b border-[#e9f0f4]">
              <button
                type="button"
                onClick={() => setReasonOpen(true)}
                className="flex items-center gap-2 text-left"
              >
                <span className="flex-1 text-[16px] font-medium text-[#1d212d]">เหตุผล</span>
                <span className={`text-[16px] ${reason ? "text-[#1d212d]" : "text-[#798aa3]"}`}>
                  {reason ?? "เลือก"}
                </span>
                <ChevronRight size={20} className="text-[#798aa3]" />
              </button>

              <div className="flex items-center gap-2 text-[14px]">
                <span className="flex-1 text-[#798aa3]">การคืนเงินค่าสินค้า</span>
                <span className="text-[#1d212d]">{baht(product.price)}</span>
              </div>
              <div className="flex items-center gap-2 text-[14px]">
                <span className="flex-1 text-[#798aa3]">การคืนเงินค่าจัดส่ง</span>
                <span className="text-[#1d212d]">{baht(refundShipping)}</span>
              </div>
              <div className="flex items-center gap-2 text-[16px]">
                <span className="flex-1 font-medium text-[#1d212d]">ยอดรวมการคืนเงิน</span>
                <span className="font-semibold text-[var(--color-primary)]">{baht(totalRefund)}</span>
              </div>

              <button type="button" className="flex items-center gap-2 text-left">
                <span className="flex-1 text-[16px] font-medium text-[#1d212d]">วิธีการคืนเงิน</span>
                <span className="flex flex-col items-end gap-1">
                  <span className="text-[14px] text-[#1d212d]">Kasikorn Bank</span>
                  <span className="text-[12px] text-[#798aa3]">96* **** *08</span>
                </span>
                <ChevronRight size={20} className="text-[#798aa3]" />
              </button>
            </div>

            {/* Image upload */}
            <div className="flex flex-col gap-2 px-6 pt-6">
              <span className="text-[14px] font-medium text-black">เพิ่มรูปภาพหรือวีดิโอ</span>
              <button
                type="button"
                className="h-20 rounded-lg border border-dashed border-[#a8b9ca] bg-[#f7fcfe] flex flex-col items-center justify-center gap-2 hover:border-[var(--color-primary)] transition"
              >
                <ImageIcon size={24} className="text-[#1d212d]" />
                <span className="text-[12px] text-[#1d212d]">เพิ่มรูปภาพหรือวีดิโอ</span>
              </button>
            </div>

            {/* Note */}
            <div className="flex flex-col gap-2 px-6 py-6">
              <span className="text-[14px] font-medium text-black">ข้อความเพิ่มเติม</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="รายละเอียดที่เกี่ยวกับปัญหานี้"
                className="h-20 px-3 py-2 rounded-lg border border-[var(--color-neutral-300)] text-[16px] text-[var(--color-neutral-900)] placeholder:text-[#798aa3] outline-none focus:border-[var(--color-primary)] resize-none"
              />
            </div>
          </ModalBody>

          <ModalFooter className="border-t border-[var(--color-neutral-300)] p-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-[150px] h-10 rounded-lg border border-[#a8b9ca] bg-white text-[16px] font-medium text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              disabled={!reason}
              onClick={() => {
                onSubmit?.({ type, reason, note });
                onClose();
              }}
              className="w-[150px] h-10 rounded-lg bg-[var(--color-primary)] text-[16px] font-medium text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ส่ง
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ReasonPickerModal
        isOpen={reasonOpen}
        onClose={() => setReasonOpen(false)}
        value={reason}
        onConfirm={(r) => {
          setReason(r);
          setReasonOpen(false);
        }}
      />
    </>
  );
}

function ReasonPickerModal({
  isOpen,
  onClose,
  value,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  value: string | null;
  onConfirm: (reason: string) => void;
}) {
  const [draft, setDraft] = useState<string | null>(value);

  useEffect(() => {
    if (isOpen) setDraft(value);
  }, [isOpen, value]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="md"
      hideCloseButton
      scrollBehavior="inside"
      classNames={{ base: "rounded-2xl !max-w-[600px] w-[600px]" }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between gap-4 border-b border-[var(--color-neutral-300)] p-6">
          <h2 className="text-[18px] font-semibold leading-4 text-[var(--color-neutral-900)]">
            เลือกเหตุผล
          </h2>
          <button
            type="button"
            aria-label="ปิด"
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-[var(--color-neutral-200)] flex items-center justify-center text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-300)] transition"
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </ModalHeader>

        <ModalBody className="p-6 flex flex-col gap-3">
          {REFUND_REASONS.map((r) => {
            const active = draft === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setDraft(r)}
                className={[
                  "flex items-center gap-4 p-4 rounded-xl border text-left transition-colors",
                  active
                    ? "border-[var(--color-primary)]"
                    : "border-[var(--color-neutral-300)] hover:border-[var(--color-primary-400)]",
                ].join(" ")}
              >
                <span
                  className={[
                    "size-4 rounded-full border-2 flex items-center justify-center shrink-0",
                    active ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-[#798aa3] bg-white",
                  ].join(" ")}
                >
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                <span
                  className={[
                    "text-[16px]",
                    active ? "text-[#1d212d]" : "text-[#798aa3]",
                  ].join(" ")}
                >
                  {r}
                </span>
              </button>
            );
          })}
        </ModalBody>

        <ModalFooter className="border-t border-[var(--color-neutral-300)] p-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="w-[150px] h-10 rounded-lg border border-[#a8b9ca] bg-white text-[16px] font-medium text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            disabled={!draft}
            onClick={() => draft && onConfirm(draft)}
            className="w-[150px] h-10 rounded-lg bg-[var(--color-primary)] text-[16px] font-medium text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ยืนยัน
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
