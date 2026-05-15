import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Input,
  Button,
  RadioGroup,
  Radio,
  Checkbox,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { ChevronDown, Check } from "lucide-react";
import { inputClassNames } from "../components/inputStyles";
import LanguageSelect from "../components/LanguageSelect";
import HelpSelect from "../components/HelpSelect";
import NotificationBell from "../components/NotificationBell";
import {
  PlatformGrid,
  ConnectedAccountsList,
  SOCIAL_PLATFORMS,
  type SocialPlatform,
  type ConnectedSocialAccount,
} from "../components/SocialPlatformPicker";
import avatar from "../assets/avatar.jpg";
import TermsOfServiceModal from "../components/landing/TermsOfServiceModal";
import PrivacyPolicyModal from "../components/landing/PrivacyPolicyModal";

const BG_GRADIENT =
  "linear-gradient(116.5deg, #b4e1ff 0%, #e9f8ff 24.9%, #f7fcfe 52.2%, #e9f8ff 74.9%, #55c9ff 109%)";

type Platform = SocialPlatform;
type ConnectedAccount = ConnectedSocialAccount;
const PLATFORMS = SOCIAL_PLATFORMS;

const PLATFORM_EXAMPLE: Record<string, string> = {
  facebook: "ตัวอย่าง: https://www.facebook.com/?locale=th_TH",
  tiktok: "ตัวอย่าง: https://www.tiktok.com/@yourname",
  instagram: "ตัวอย่าง: https://www.instagram.com/yourname",
  x: "ตัวอย่าง: https://x.com/yourname",
  youtube: "ตัวอย่าง: https://www.youtube.com/@yourchannel",
  other: "ตัวอย่าง: https://www.yourwebsite.com",
};

function AddSocialLinkModal({
  platform,
  onClose,
  onConfirm,
}: {
  platform: Platform | null;
  onClose: () => void;
  onConfirm: (link: string) => void;
}) {
  const [link, setLink] = useState("");
  return (
    <Modal
      isOpen={!!platform}
      onClose={onClose}
      onOpenChange={(o) => {
        if (o) setLink("");
      }}
      placement="center"
      size="sm"
      hideCloseButton
      classNames={{ base: "rounded-3xl" }}
    >
      <ModalContent>
        <ModalHeader className="border-b border-[var(--color-neutral-300)] px-6 pt-6 pb-4">
          <h2 className="text-[20px] font-semibold leading-4 text-[var(--color-primary-600)]">
            เพิ่มบัญชี Social Media ที่เลือก
          </h2>
        </ModalHeader>
        <ModalBody className="px-6 py-8 flex flex-col gap-3">
          <p className="text-[14px] text-[var(--color-neutral-900)]">
            กรุณาใส่ลิงก์จาก (Social) ที่จะใช้ในการโปรโมต
          </p>
          <Input
            value={link}
            onValueChange={setLink}
            placeholder={
              platform ? PLATFORM_EXAMPLE[platform.key] ?? "ใส่ลิงก์ของคุณ" : ""
            }
            radius="sm"
            classNames={{
              inputWrapper:
                "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] shadow-none",
              input:
                "text-[16px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)]",
            }}
          />
        </ModalBody>
        <ModalFooter className="border-t border-[var(--color-neutral-300)] flex gap-4 px-6 py-4">
          <Button
            onPress={onClose}
            radius="sm"
            variant="bordered"
            className="flex-1 h-10 border border-[var(--color-neutral-400)] text-[var(--color-neutral-900)] text-[16px] font-medium bg-white"
          >
            ยกเลิก
          </Button>
          <Button
            isDisabled={!link.trim()}
            onPress={() => {
              onConfirm(link.trim());
              onClose();
            }}
            radius="sm"
            className="flex-1 h-10 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 disabled:opacity-50 transition"
          >
            ยืนยัน
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const PHONE_CODES = ["+66", "+65", "+60", "+1", "+44"];

function AffiliateHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--color-neutral-300)] px-4 sm:px-6 py-[18px]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-4 sm:gap-6">
          <span className="flex items-center gap-2">
            <span
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-[0_2px_4px_rgba(4,133,247,0.3)]"
              style={{
                background:
                  "linear-gradient(135deg, #21bdff 0%, #0485f7 50%, #036ac6 100%)",
              }}
            >
              <span className="font-extrabold text-white text-[22px] leading-none">
                B
              </span>
            </span>
            <span className="text-[22px] sm:text-[24px] font-medium text-[var(--color-primary)] leading-none">
              BRIGHTIFY
            </span>
          </span>
          <span className="hidden sm:block w-px h-6 bg-[var(--color-neutral-300)]" />
          <span className="hidden sm:block text-[20px] font-semibold text-[var(--color-neutral-900)]">
            Affiliate
          </span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex items-center gap-1">
            <LanguageSelect />
            <HelpSelect />
          </div>
          <span className="hidden md:block w-px h-5 bg-[var(--color-neutral-300)]" />
          <NotificationBell />
          <button className="flex items-center gap-2">
            <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
            <ChevronDown size={18} className="text-[var(--color-neutral-600)]" />
          </button>
        </div>
      </div>
    </header>
  );
}

function FormRow({
  label,
  required,
  hint,
  children,
}: {
  label: React.ReactNode;
  required?: boolean;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start gap-2 lg:gap-16 px-4 sm:px-12 lg:px-24">
      <div className="lg:w-[300px] shrink-0 lg:text-right">
        <p className="text-[16px] lg:text-[18px] text-[var(--color-neutral-900)] leading-4 pt-2">
          {required && <span className="text-[#f64669]">* </span>}
          {label} :
        </p>
        {hint && (
          <p className="text-[14px] text-[var(--color-neutral-500)] mt-1 leading-[22px]">
            {hint}
          </p>
        )}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}


function RegistrationForm({ onSubmit }: { onSubmit: () => void }) {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [accountType, setAccountType] = useState<"individual" | "company">(
    "individual"
  );
  const [orgName, setOrgName] = useState("");
  const [connected, setConnected] = useState<ConnectedAccount[]>([
    { id: "1", platform: PLATFORMS[0], name: "FB Account name" },
    { id: "2", platform: PLATFORMS[1], name: "Tiktok Account name" },
  ]);
  const [phoneCode, setPhoneCode] = useState("+66");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [consent, setConsent] = useState(true);
  const [pendingPlatform, setPendingPlatform] = useState<Platform | null>(null);

  const addPlatform = (p: Platform, link: string) =>
    setConnected((prev) => [
      ...prev,
      { id: `${p.key}-${Date.now()}`, platform: p, name: link },
    ]);
  const removeAccount = (id: string) =>
    setConnected((prev) => prev.filter((a) => a.id !== id));

  const valid =
    connected.length >= 1 &&
    phone.trim() &&
    email.trim() &&
    code.trim() &&
    consent &&
    (accountType === "individual" || orgName.trim());

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col gap-8 pb-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
      {/* Header bar */}
      <div className="bg-[var(--color-primary)] px-4 py-6 text-center">
        <h1 className="text-[20px] font-semibold text-white leading-4">
          สมัครเป็นสมาชิกโปรแกรม Affiliate
        </h1>
      </div>

      {/* Account type */}
      <FormRow label="ประเภทบัญชี" required>
        <RadioGroup
          orientation="horizontal"
          value={accountType}
          onValueChange={(v) => setAccountType(v as "individual" | "company")}
          classNames={{ wrapper: "gap-4" }}
        >
          <Radio value="individual">บุคคล</Radio>
          <Radio value="company">นิติบุคคล</Radio>
        </RadioGroup>
      </FormRow>

      {/* Org name (company only) */}
      {accountType === "company" && (
        <FormRow label="ชื่อองค์กร/บริษัท" required>
          <Input
            value={orgName}
            onValueChange={setOrgName}
            placeholder="ใส่ชื่อองค์กร หรือ บริษัทของคุณ"
            radius="sm"
            classNames={inputClassNames}
            className="max-w-[500px]"
          />
        </FormRow>
      )}

      {/* Platforms */}
      <FormRow
        label="เลือกแพลตฟอร์มที่ใช้โปรโมท"
        required
        hint={
          <>
            เชื่อมต่อ <span className="text-[#dd214f]">อย่างน้อย 1 แพลตฟอร์ม</span>{" "}
            ที่คุณใช้ในการโปรโมตสินค้าเพื่อยืนยันความน่าเชื่อถือและเพิ่มโอกาสในการอนุมัติการสมัครเข้าร่วมมากขึ้น
          </>
        }
      >
        <PlatformGrid onAddPlatform={(p) => setPendingPlatform(p)} />
      </FormRow>

      {/* Connected accounts */}
      <FormRow label="บัญชีที่เชื่อมต่อแล้ว">
        <ConnectedAccountsList accounts={connected} onRemove={removeAccount} />
      </FormRow>

      <hr className="border-t border-[var(--color-neutral-200)]" />

      {/* Phone */}
      <FormRow label="เบอร์โทรศัพท์ติดต่อ" required>
        <div className="flex gap-2 items-start">
          <Select
            aria-label="รหัสประเทศ"
            selectedKeys={[phoneCode]}
            onSelectionChange={(k) => setPhoneCode(Array.from(k)[0] as string)}
            radius="sm"
            className="w-[90px] shrink-0"
            classNames={{
              trigger:
                "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] shadow-none",
              value: "text-[16px] font-semibold text-[var(--color-neutral-900)]",
            }}
          >
            {PHONE_CODES.map((c) => (
              <SelectItem key={c}>{c}</SelectItem>
            ))}
          </Select>
          <Input
            value={phone}
            onValueChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 10))}
            placeholder="กรอกหมายเลขเบอร์โทรศัพท์"
            inputMode="tel"
            radius="sm"
            classNames={inputClassNames}
            className="w-full sm:w-[250px]"
          />
        </div>
      </FormRow>

      {/* Email */}
      <FormRow label="อีเมลติดต่อ" required>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <Input
              value={email}
              onValueChange={setEmail}
              placeholder="ใส่อีเมลของคุณ"
              type="email"
              radius="sm"
              classNames={inputClassNames}
              className="w-full sm:w-[342px]"
            />
            <Button
              radius="sm"
              variant="bordered"
              className="h-10 px-4 border border-[var(--color-primary)] text-[var(--color-primary)] text-[16px] font-medium bg-white"
            >
              ส่งโค้ดยืนยัน
            </Button>
          </div>
          <p className="text-[14px] text-black/50">แนะนำให้ใช้อีเมล์ของ Google</p>
        </div>
      </FormRow>

      {/* Verification code */}
      <FormRow label="รหัสยืนยันอีเมล" required>
        <Input
          value={code}
          onValueChange={(v) => setCode(v.replace(/\D/g, "").slice(0, 6))}
          placeholder="โปรดใส่รหัสยืนยันของคุณ"
          inputMode="numeric"
          radius="sm"
          classNames={inputClassNames}
          className="w-full sm:w-[342px]"
        />
      </FormRow>

      <hr className="border-t border-[var(--color-neutral-200)]" />

      {/* Consent + submit — aligned under the input column on desktop */}
      <div className="px-4 sm:px-12 lg:pl-[460px] lg:pr-24 flex flex-col gap-8">
        <label className="flex items-start gap-4 cursor-pointer">
          <Checkbox
            isSelected={consent}
            onValueChange={setConsent}
            color="primary"
            size="md"
            className="mt-0.5"
            aria-label="ยอมรับเงื่อนไข"
          />
          <span className="text-[16px] text-[var(--color-neutral-900)] leading-6">
            ฉันยืนยันว่าฉันได้กรอกข้อมูลข้างต้นทั้งหมดถูกต้อง รวมถึงฉันได้อ่านและยอมรับ{" "}
            <button type="button" onClick={() => setTermsOpen(true)} className="text-[var(--color-primary)] underline">
              เงื่อนไขการใช้บริการ
            </button>{" "}และ{" "}
            <button type="button" onClick={() => setPrivacyOpen(true)} className="text-[var(--color-primary)] underline">
              นโยบายความเป็นส่วนตัว
            </button>{" "}
            ของโปรแกรม Affiliate
          </span>
        </label>
        <Button
          radius="sm"
          isDisabled={!valid}
          onPress={onSubmit}
          className="w-[150px] h-11 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 disabled:opacity-50 transition"
        >
          ส่งแบบฟอร์ม
        </Button>
      </div>

      <AddSocialLinkModal
        platform={pendingPlatform}
        onClose={() => setPendingPlatform(null)}
        onConfirm={(link) => {
          if (pendingPlatform) addPlatform(pendingPlatform, link);
        }}
      />
      <TermsOfServiceModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}

function SuccessState() {
  const navigate = useNavigate();
  return (
    <div className="relative w-full max-w-[1200px] mx-auto">
      <span
        aria-hidden
        className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 top-8 text-[clamp(60px,15vw,180px)] font-bold text-white/40 leading-none whitespace-nowrap"
      >
        Affiliate
      </span>
      <div className="relative bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] w-full px-4 sm:px-8 py-12 flex flex-col items-center text-center gap-4">
        <span className="w-16 h-16 rounded-full bg-[var(--color-positive-700)]/10 flex items-center justify-center">
          <span className="w-12 h-12 rounded-full bg-[#2ecc71] flex items-center justify-center">
            <Check size={28} className="text-white" strokeWidth={3} />
          </span>
        </span>
        <h2 className="text-[22px] font-semibold text-[var(--color-neutral-900)]">
          ส่งแบบฟอร์มสำเร็จแล้ว
        </h2>
        <p className="text-[15px] text-[var(--color-neutral-600)] max-w-[1200px]">
          ขอบคุณสำหรับการสมัครโปรแกรม Affiliate เราจะทำการตรวจสอบข้อมูลที่คุณส่งมา และจะแจ้งให้คุณทราบทางอีเมล
        </p>
        <Button
          radius="sm"
          onPress={() => navigate("/affiliate/overview")}
          className="mt-6 h-11 px-6 bg-[var(--color-primary)] text-white text-[16px] font-medium hover:brightness-110 transition"
        >
          ดูรายละเอียด Affiliate เพิ่มเติม
        </Button>
        <p className="text-[14px] text-[var(--color-neutral-500)]">
          หากคุณไม่ได้รับการตอบกลับภายใน 5 วัน กรุณา{" "}
          <button type="button" className="text-[var(--color-primary)] hover:underline">
            ติดต่อเรา
          </button>
        </p>
      </div>
    </div>
  );
}

export default function AffiliateRegister() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG_GRADIENT }}>
      <AffiliateHeader />
      <main
        className={`flex-1 w-full mx-auto px-3 sm:px-4 lg:px-5 py-8 sm:py-12 ${
          submitted
            ? "flex items-center justify-center"
            : "max-w-[1200px]"
        }`}
      >
        {submitted ? (
          <SuccessState />
        ) : (
          <RegistrationForm onSubmit={() => setSubmitted(true)} />
        )}
      </main>
    </div>
  );
}
