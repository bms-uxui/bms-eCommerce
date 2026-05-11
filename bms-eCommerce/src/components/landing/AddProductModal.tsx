import { useEffect, useMemo, useState } from "react";
import {
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
} from "@heroui/react";
import { Search, X } from "lucide-react";
import type { QuoteProduct } from "./QuoteRequestModal";

export type CatalogProduct = {
  id: string;
  image: string;
  name: string;
  unitPrice: number;
  stock: number;
  minOrderQty?: number;
};

const baht = (n: number) =>
  `฿ ${n.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function ProductRow({
  item,
  checked,
  onToggle,
}: {
  item: CatalogProduct;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="bg-white rounded-lg flex items-center gap-2 p-2 w-full text-left hover:bg-[var(--color-neutral-100)] transition"
    >
      <img
        src={item.image}
        alt=""
        className="w-16 h-16 rounded shrink-0 object-cover"
      />
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
        <p className="text-[12px] font-medium text-black truncate">
          {item.name}
        </p>
        <p className="text-[14px] font-semibold text-[var(--color-primary)]">
          {baht(item.unitPrice)}
        </p>
        <p className="text-[12px] text-[var(--color-neutral-900)]">
          มีสินค้า {item.stock} ชิ้น
        </p>
      </div>
      <Checkbox
        isSelected={checked}
        onValueChange={onToggle}
        size="md"
        color="primary"
        aria-label={item.name}
      />
    </button>
  );
}

export default function AddProductModal({
  isOpen,
  onClose,
  catalog,
  onConfirm,
  excludeIds = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  catalog: CatalogProduct[];
  onConfirm: (products: QuoteProduct[]) => void;
  excludeIds?: string[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelected(new Set());
    }
  }, [isOpen]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog
      .filter((p) => !excludeIds.includes(p.id))
      .filter((p) => (q ? p.name.toLowerCase().includes(q) : true));
  }, [catalog, query, excludeIds]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const count = selected.size;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="md"
      hideCloseButton
      classNames={{ base: "rounded-2xl" }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between gap-4 border-b border-[var(--color-neutral-300)] p-4">
          <h2 className="text-[18px] font-semibold leading-4 text-[var(--color-neutral-900)]">
            เลือกสินค้า
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

        <ModalBody className="p-3 pb-0">
          <Input
            value={query}
            onValueChange={setQuery}
            placeholder="ค้นหา"
            radius="sm"
            endContent={
              <Search size={16} className="text-[var(--color-neutral-700)]" />
            }
            classNames={{
              inputWrapper:
                "h-9 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] shadow-none",
              input:
                "text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-800)]",
            }}
          />
        </ModalBody>

        <div className="px-3 pb-3 flex flex-col gap-3 max-h-[353px] overflow-y-auto">
          {visible.map((p) => (
            <ProductRow
              key={p.id}
              item={p}
              checked={selected.has(p.id)}
              onToggle={() => toggle(p.id)}
            />
          ))}
          {visible.length === 0 && (
            <p className="text-center text-[14px] text-[var(--color-neutral-500)] py-8">
              ไม่พบสินค้า
            </p>
          )}
        </div>

        <ModalFooter className="border-t border-[var(--color-neutral-300)] p-4">
          <Button
            isDisabled={count === 0}
            onPress={() => {
              const chosen: QuoteProduct[] = catalog
                .filter((p) => selected.has(p.id))
                .map((p) => ({
                  id: p.id,
                  image: p.image,
                  name: p.name,
                  unitPrice: p.unitPrice,
                  qty: p.minOrderQty ?? 1,
                  minOrderQty: p.minOrderQty,
                }));
              onConfirm(chosen);
              onClose();
            }}
            radius="sm"
            className="w-full h-10 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 disabled:opacity-50 transition"
          >
            เลือก {count} รายการ
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
