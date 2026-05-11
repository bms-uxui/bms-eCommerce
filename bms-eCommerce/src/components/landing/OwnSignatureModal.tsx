import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { X } from "lucide-react";
import SignaturePad, { type SignatureResult } from "./SignaturePad";

export default function OwnSignatureModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (result: SignatureResult) => void;
}) {
  const [result, setResult] = useState<SignatureResult | null>(null);

  useEffect(() => {
    if (isOpen) setResult(null);
  }, [isOpen]);

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
            เซ็นด้วยตนเอง
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

        <ModalBody className="p-4 pb-0">
          <SignaturePad onBack={onClose} onChange={setResult} />
        </ModalBody>

        <ModalFooter className="border-t border-[var(--color-neutral-300)] p-4">
          <Button
            radius="sm"
            isDisabled={result === null}
            onPress={() => {
              if (result) onSave?.(result);
              onClose();
            }}
            className="w-full h-10 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 disabled:opacity-50 transition"
          >
            บันทึก
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
