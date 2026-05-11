import { useEffect, useMemo, useState } from "react";
import {
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Search, X } from "lucide-react";
import SignaturePad from "./SignaturePad";

export type NameEntry = { id: string; name: string; hasSignature: boolean };

export const NAME_BOOK: NameEntry[] = [
  { id: "n1", name: "Meeree Kadasa", hasSignature: true },
  { id: "n2", name: "Somchai Jaidee", hasSignature: true },
  { id: "n3", name: "Pranee Suksai", hasSignature: true },
  { id: "n4", name: "Anan Wongchai", hasSignature: false },
  { id: "n5", name: "Kanya Thongdee", hasSignature: true },
];

export default function SelectNameModal({
  isOpen,
  onClose,
  onSelect,
  entries = NAME_BOOK,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (entry: NameEntry) => void;
  entries?: NameEntry[];
}) {
  const [list, setList] = useState<NameEntry[]>(entries);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"list" | "add">("list");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setList(entries);
      setQuery("");
      setMode("list");
      setFirst("");
      setLast("");
      setSigned(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? list.filter((e) => e.name.toLowerCase().includes(q)) : list;
  }, [list, query]);

  const fullName = `${first.trim()} ${last.trim()}`.trim();
  const canSave = first.trim().length > 0 && last.trim().length > 0;

  const saveNewName = () => {
    if (!canSave) return;
    setList((l) => [
      { id: `new-${Date.now()}`, name: fullName, hasSignature: signed },
      ...l,
    ]);
    setMode("list");
    setFirst("");
    setLast("");
    setSigned(false);
    setQuery("");
  };

  const inputClassNames = {
    inputWrapper:
      "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] shadow-none",
    input:
      "text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)]",
  };

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
            {mode === "add" ? "เพิ่มรายชื่อ" : "เลือกรายชื่อ"}
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

        {mode === "list" ? (
          <>
            <ModalBody className="p-3 pb-0">
              <Input
                value={query}
                onValueChange={setQuery}
                placeholder="ค้นหา"
                radius="sm"
                endContent={<Search size={16} className="text-[var(--color-neutral-700)]" />}
                classNames={{
                  inputWrapper:
                    "h-9 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] shadow-none",
                  input:
                    "text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-800)]",
                }}
              />
            </ModalBody>

            <div className="px-3 py-3 flex flex-col gap-2 max-h-[320px] min-h-[260px] overflow-y-auto">
              {visible.map((e, i) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => {
                    onSelect(e);
                    onClose();
                  }}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg text-left hover:bg-[var(--color-neutral-100)] transition"
                >
                  <span className="text-[14px] text-[var(--color-neutral-900)] truncate">
                    {i + 1}.{e.name}
                  </span>
                  {e.hasSignature ? (
                    <span className="shrink-0 px-3 py-1 rounded text-[12px] font-medium bg-[#d6fc92] text-[#235c04]">
                      มีลายเซ็น
                    </span>
                  ) : (
                    <span className="shrink-0 px-3 py-1 rounded text-[12px] font-medium bg-[var(--color-neutral-200)] text-[var(--color-neutral-600)]">
                      ยังไม่มีลายเซ็น
                    </span>
                  )}
                </button>
              ))}
              {visible.length === 0 && (
                <p className="text-center text-[14px] text-[var(--color-neutral-500)] py-8">
                  ไม่พบรายชื่อ
                </p>
              )}
            </div>

            <ModalFooter className="border-t border-[var(--color-neutral-300)] p-4">
              <Button
                radius="sm"
                onPress={() => setMode("add")}
                className="w-full h-10 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 transition"
              >
                เพิ่มรายชื่อ
              </Button>
            </ModalFooter>
          </>
        ) : (
          <>
            <ModalBody className="p-4 pb-0 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <span className="text-[14px] text-[var(--color-neutral-700)]">
                    ชื่อ<span className="text-[var(--color-critical)]"> *</span>
                  </span>
                  <Input
                    value={first}
                    onValueChange={setFirst}
                    placeholder="ระบุชื่อ"
                    radius="sm"
                    classNames={inputClassNames}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[14px] text-[var(--color-neutral-700)]">
                    นามสกุล<span className="text-[var(--color-critical)]"> *</span>
                  </span>
                  <Input
                    value={last}
                    onValueChange={setLast}
                    placeholder="ระบุนามสกุล"
                    radius="sm"
                    classNames={inputClassNames}
                  />
                </div>
              </div>

              <SignaturePad
                onBack={() => setMode("list")}
                onChange={(r) => setSigned(r !== null)}
              />
            </ModalBody>

            <ModalFooter className="border-t border-[var(--color-neutral-300)] p-4">
              <Button
                radius="sm"
                isDisabled={!canSave}
                onPress={saveNewName}
                className="w-full h-10 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 disabled:opacity-50 transition"
              >
                บันทึก
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
