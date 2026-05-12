import { Button, Modal, ModalContent, ModalBody, ModalFooter } from "@heroui/react";
import { X, Zap } from "lucide-react";

const OFFERS = [
  "รับส่วนลดสูงสุดตามที่บริษัทกำหนดเฉพาะช่วงกิจกรรม Flash Sale",
  "สินค้าที่เข้าร่วมกิจกรรมจะได้รับการโปรโมตผ่านช่องทางของ BMS",
  "เพิ่มโอกาสในการเข้าถึงลูกค้าใหม่ และกระตุ้นยอดขายในระยะเวลาจำกัด",
  "สิทธิ์เข้าร่วมกิจกรรมพิเศษและแคมเปญถัดไป (ตามเงื่อนไขที่บริษัทกำหนด)",
];
const CONDITIONS = [
  "การเข้าร่วม Flash Sale เป็นไปตามรอบกิจกรรมที่ผู้ดูแลและระบบเป็นผู้กำหนด",
  "ร้านค้าต้องเลือกและตั้งค่าสินค้าที่ต้องการเข้าร่วม Flash Sale ภายในระยะเวลาที่กำหนด",
  "ราคาสินค้าและส่วนลดต้องเป็นไปตามเงื่อนไขที่ BMS กำหนด",
  "ไม่สามารถยกเลิกหรือเปลี่ยนแปลงสินค้าที่เข้าร่วมได้หลังจากเริ่มกิจกรรมแล้ว",
  "BMS ขอสงวนสิทธิ์ในการเปลี่ยนแปลงเงื่อนไขหรือยุติกิจกรรมโดยไม่ต้องแจ้งให้ทราบล่วงหน้า",
];

export default function FlashSaleTermsModal({ isOpen, onClose, onJoin }: { isOpen: boolean; onClose: () => void; onJoin?: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" size="md" hideCloseButton scrollBehavior="inside" classNames={{ base: "rounded-2xl overflow-hidden" }}>
      <ModalContent>
        <div className="relative h-[180px] flex items-center justify-center" style={{ backgroundImage: "linear-gradient(180deg, #ff5a6e 0%, #f10b27 100%)" }}>
          <button type="button" aria-label="ปิด" onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition"><X size={16} /></button>
          <Zap size={56} className="text-[#ffd84a]" fill="#ffd84a" />
        </div>
        <ModalBody className="p-6 flex flex-col gap-5">
          <h2 className="text-[18px] font-semibold text-[var(--color-neutral-900)] text-center">เงื่อนไขและข้อเสนอสุดพิเศษ</h2>
          <div>
            <p className="text-[14px] font-medium text-[var(--color-neutral-900)] mb-2">ข้อเสนอสุดพิเศษ</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 text-[13px] text-[var(--color-neutral-700)]">{OFFERS.map((o, i) => <li key={i}>{o}</li>)}</ul>
          </div>
          <div>
            <p className="text-[14px] font-medium text-[var(--color-neutral-900)] mb-2">เงื่อนไขการเข้าร่วม</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 text-[13px] text-[var(--color-neutral-700)]">{CONDITIONS.map((c, i) => <li key={i}>{c}</li>)}</ul>
          </div>
        </ModalBody>
        <ModalFooter className="p-6 pt-0">
          <Button radius="sm" onPress={() => { onJoin?.(); onClose(); }} className="w-full h-11 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 transition">เข้าร่วม</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
