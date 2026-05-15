import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { X, Star, ImageIcon } from "lucide-react";

export type ReviewProduct = {
  image: string;
  name: string;
  qty: number;
  price: number;
};

const baht = (n: number) =>
  `฿ ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ReviewProductModal({
  isOpen,
  onClose,
  product,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: ReviewProduct;
  onSubmit?: (data: { rating: number; text: string; anonymous: boolean }) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoverRating(0);
      setText("");
      setAnonymous(false);
    }
  }, [isOpen]);

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
            รีวิวสินค้า
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
          <div className="flex items-center gap-4 p-6">
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

          <div className="flex justify-center gap-3 py-2">
            {Array.from({ length: 5 }, (_, i) => {
              const value = i + 1;
              const filled = (hoverRating || rating) >= value;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={filled ? "fill-[#facc15] text-[#facc15]" : "text-[#d3dfe7]"}
                  />
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 px-6 pt-4">
            <label className="text-[14px] font-medium text-black">เขียนรีวิว</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="อธิบายรายละเอียด"
              className="h-20 px-3 py-2 rounded-lg border border-[var(--color-neutral-300)] text-[16px] text-[var(--color-neutral-900)] placeholder:text-[#798aa3] outline-none focus:border-[var(--color-primary)] resize-none"
            />
          </div>

          <div className="flex flex-col gap-2 px-6 pt-4">
            <span className="text-[14px] font-medium text-black">เพิ่มรูปภาพหรือวีดิโอ</span>
            <button
              type="button"
              className="h-20 rounded-lg border border-dashed border-[#a8b9ca] bg-[#f7fcfe] flex flex-col items-center justify-center gap-2 hover:border-[var(--color-primary)] transition"
            >
              <ImageIcon size={24} className="text-[#1d212d]" />
              <span className="text-[12px] text-[#1d212d]">เพิ่มรูปภาพหรือวีดิโอ 0/5</span>
            </button>
          </div>

          <div className="flex items-center gap-3 px-6 py-6">
            <input
              id="anonymous-review"
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="w-4 h-4 accent-[var(--color-primary)]"
            />
            <label htmlFor="anonymous-review" className="text-[14px] text-[#1d212d] cursor-pointer">
              โพสต์โดยไม่ระบุชื่อ
            </label>
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
            disabled={rating === 0}
            onClick={() => {
              onSubmit?.({ rating, text, anonymous });
              onClose();
            }}
            className="w-[150px] h-10 rounded-lg bg-[var(--color-primary)] text-[16px] font-medium text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ส่ง
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
