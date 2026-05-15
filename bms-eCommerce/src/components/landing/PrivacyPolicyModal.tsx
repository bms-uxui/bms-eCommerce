import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { X } from "lucide-react";

export default function PrivacyPolicyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="2xl"
      hideCloseButton
      scrollBehavior="inside"
      classNames={{ base: "rounded-2xl" }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-4 border-b border-[var(--color-neutral-300)] p-6">
          <span className="flex-1 text-[20px] font-semibold text-[var(--color-neutral-900)]">
            นโยบายความคุ้มครองข้อมูลส่วนบุคคล
          </span>
          <span className="text-[14px] text-[var(--color-neutral-600)] text-right shrink-0">
            อัปเดตล่าสุด: 14 พฤษภาคม 2026
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[var(--color-neutral-200)] flex items-center justify-center hover:bg-[var(--color-neutral-300)] transition shrink-0"
            aria-label="ปิด"
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </ModalHeader>
        <ModalBody className="p-6">
          <div className="flex flex-col gap-1 text-[16px] leading-[30px] text-[var(--color-neutral-900)]">
            <p>
              BMS E-Commerce ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้งานและมุ่งมั่นในการคุ้มครองข้อมูลส่วนบุคคลตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) ของประเทศไทย
            </p>

            <p className="mt-4"><span className="font-semibold">1. ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม</span> เราอาจเก็บรวบรวมข้อมูลดังต่อไปนี้ :</p>
            <ul className="list-disc pl-6 flex flex-col gap-0.5">
              {["ชื่อ-นามสกุล","อีเมล","เบอร์โทรศัพท์","ที่อยู่จัดส่ง","ข้อมูลบัญชีร้านค้า","ข้อมูลการชำระเงิน","ข้อมูลการใช้งานระบบ","IP Address, Cookies และ Device Information"].map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>

            <p className="mt-4"><span className="font-semibold">2. วัตถุประสงค์ในการใช้ข้อมูล</span> เราใช้ข้อมูลเพื่อ :</p>
            <ul className="list-disc pl-6 flex flex-col gap-0.5">
              {["สมัครสมาชิกและยืนยันตัวตน","ให้บริการแพลตฟอร์ม","ประมวลผลคำสั่งซื้อและการชำระเงิน","ติดต่อแจ้งเตือนเกี่ยวกับบริการ","ปรับปรุงประสิทธิภาพและความปลอดภัยของระบบ","ส่งข้อมูลข่าวสาร โปรโมชั่น หรือการตลาด (เมื่อได้รับความยินยอม)"].map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>

            <p className="mt-4"><span className="font-semibold">3. ฐานทางกฎหมายในการประมวลผลข้อมูล</span> บริษัทอาจประมวลผลข้อมูลภายใต้ฐานดังต่อไปนี้ :</p>
            <ul className="list-disc pl-6 flex flex-col gap-0.5">
              {["การปฏิบัติตามสัญญา","การปฏิบัติตามกฎหมาย","ประโยชน์โดยชอบด้วยกฎหมาย","ความยินยอมของเจ้าของข้อมูล"].map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>

            <p className="mt-4"><span className="font-semibold">4. การเปิดเผยข้อมูลส่วนบุคคล</span> บริษัทอาจเปิดเผยข้อมูลแก่ :</p>
            <ul className="list-disc pl-6 flex flex-col gap-0.5">
              {["ผู้ให้บริการชำระเงิน","บริษัทขนส่ง","ผู้ให้บริการ Cloud หรือ Hosting","หน่วยงานราชการตามที่กฎหมายกำหนด"].map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <p>โดยบริษัทจะดำเนินมาตรการคุ้มครองข้อมูลอย่างเหมาะสม</p>

            <p className="mt-4"><span className="font-semibold">5. ระยะเวลาการจัดเก็บข้อมูล</span> บริษัทจะเก็บข้อมูลส่วนบุคคลเท่าที่จำเป็นต่อวัตถุประสงค์ในการใช้งาน หรือเท่าที่กฎหมายกำหนด</p>

            <p className="mt-4"><span className="font-semibold">6. สิทธิของเจ้าของข้อมูล</span> ท่านมีสิทธิ :</p>
            <ul className="list-disc pl-6 flex flex-col gap-0.5">
              {["ขอเข้าถึงข้อมูลส่วนบุคคล","ขอแก้ไขข้อมูล","ขอถอนความยินยอม","ขอให้ลบหรือทำลายข้อมูล","ขอคัดค้านการประมวลผลข้อมูล","ขอรับสำเนาข้อมูลส่วนบุคคล"].map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <p>หากต้องการใช้สิทธิ กรุณาติดต่อบริษัทตามข้อมูลด้านล่าง</p>

            <p className="mt-4"><span className="font-semibold">7. Cookies และเทคโนโลยีติดตาม</span> เว็บไซต์อาจใช้ Cookies เพื่อ :</p>
            <ul className="list-disc pl-6 flex flex-col gap-0.5">
              {["จดจำการเข้าสู่ระบบ","วิเคราะห์การใช้งานเว็บไซต์","ปรับปรุงประสบการณ์ของผู้ใช้งาน","ผู้ใช้งานสามารถตั้งค่า Browser เพื่อปฏิเสธ Cookies ได้"].map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>

            <p className="mt-4"><span className="font-semibold">8. มาตรการรักษาความปลอดภัย</span> บริษัทใช้มาตรการทางเทคนิคและองค์กรเพื่อป้องกัน :</p>
            <ul className="list-disc pl-6 flex flex-col gap-0.5">
              {["การเข้าถึงโดยไม่ได้รับอนุญาต","การสูญหายของข้อมูล","การเปิดเผยหรือแก้ไขข้อมูลโดยมิชอบ"].map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>

            <p className="mt-4"><span className="font-semibold">9. การส่งข้อมูลไปต่างประเทศ</span> ในบางกรณี บริษัทอาจมีการส่งหรือจัดเก็บข้อมูลบนระบบ Cloud หรือผู้ให้บริการในต่างประเทศ โดยจะดำเนินการตามมาตรฐาน PDPA และมาตรการคุ้มครองข้อมูลที่เหมาะสม</p>

            <p className="mt-4"><span className="font-semibold">10. การแก้ไขนโยบาย</span> บริษัทสามารถแก้ไขนโยบายฉบับนี้ได้ตามความเหมาะสม โดยจะแจ้งผ่านเว็บไซต์หรือช่องทางที่เกี่ยวข้อง</p>

            <p className="mt-4"><span className="font-semibold">11. ช่องทางติดต่อ</span> หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว กรุณาติดต่อ:</p>
            <p className="whitespace-pre-line">{`อีเมล: support@BMS E-Commerce.com\nเว็บไซต์: BMS E-Commerce`}</p>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
