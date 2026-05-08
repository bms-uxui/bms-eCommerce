import { useState } from "react";
import { useNavigate } from "react-router";
import { Input, Button, Select, SelectItem } from "@heroui/react";
import {
  User as UserIcon,
  Package,
  ClipboardList,
  Crown,
  Bell,
  Tag,
  Heart,
  Settings as SettingsIcon,
  LogOut,
  Pencil,
} from "lucide-react";
import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";
import avatar from "../assets/avatar.jpg";

const SIDEBAR_ITEMS = [
  { icon: UserIcon, label: "บัญชีของฉัน", key: "account" },
  { icon: Package, label: "การสั่งซื้อ", key: "orders" },
  { icon: ClipboardList, label: "ใบเสนอราคา", key: "quotes" },
  { icon: Crown, label: "BMS Member", key: "member" },
  { icon: Bell, label: "การแจ้งเตือน", key: "notifications" },
  { icon: Tag, label: "โค้ดส่วนลด", key: "coupons" },
  { icon: Heart, label: "สิ่งที่ถูกใจ", key: "wishlist" },
  { icon: SettingsIcon, label: "การตั้งค่า", key: "settings" },
] as const;

type Key = (typeof SIDEBAR_ITEMS)[number]["key"];

const TABS = ["ข้อมูลส่วนตัว", "ข้อมูลที่อยู่", "รหัสผ่าน"] as const;
type Tab = (typeof TABS)[number];

function Sidebar({
  active,
  onChange,
  onLogout,
}: {
  active: Key;
  onChange: (k: Key) => void;
  onLogout: () => void;
}) {
  return (
    <aside className="w-full lg:w-[260px] shrink-0 bg-white rounded-2xl border border-[var(--color-neutral-300)] p-2 self-start">
      <ul className="flex flex-col">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => onChange(item.key)}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors",
                  isActive
                    ? "bg-[var(--color-primary-100)] text-[var(--color-primary)] font-semibold"
                    : "text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-100)] hover:text-[var(--color-primary)]",
                ].join(" ")}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
      <hr className="my-2 border-t border-[var(--color-neutral-300)]" />
      <button
        type="button"
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-[var(--color-critical)] hover:bg-[var(--color-critical)]/10 transition-colors"
      >
        <LogOut size={18} />
        ออกจากระบบ
      </button>
    </aside>
  );
}

function ProfileForm() {
  const [tab, setTab] = useState<Tab>(TABS[0]);
  const [first, setFirst] = useState("Okinowa");
  const [last, setLast] = useState("Kawasaki");
  const [email, setEmail] = useState("okinowa@example.com");
  const [phone, setPhone] = useState("093-695-5932");
  const [dob, setDob] = useState("1995-06-15");
  const [gender, setGender] = useState<string>("male");
  const [nationality, setNationality] = useState<string>("th");

  return (
    <section className="flex-1 min-w-0 bg-white rounded-2xl border border-[var(--color-neutral-300)] p-6">
      <h1 className="text-[20px] font-bold text-[var(--color-neutral-900)]">
        บัญชีของฉัน
      </h1>

      {/* Tabs */}
      <div className="mt-4 flex border-b border-[var(--color-neutral-300)]">
        {TABS.map((t) => {
          const active = t === tab;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={[
                "h-10 px-5 text-[14px] font-medium border-b-2 transition-colors",
                active
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-[var(--color-neutral-700)] hover:text-[var(--color-primary)]",
              ].join(" ")}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Avatar uploader */}
      <div className="mt-6 flex items-center gap-5">
        <div className="relative shrink-0">
          <img
            src={avatar}
            alt=""
            className="w-[100px] h-[100px] rounded-full object-cover ring-1 ring-[var(--color-neutral-300)]"
          />
          <button
            aria-label="แก้ไขรูป"
            className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-md hover:brightness-110 active:scale-95 transition"
          >
            <Pencil size={14} />
          </button>
        </div>
        <div>
          <p className="text-[16px] font-semibold text-[var(--color-neutral-900)]">
            Okinowa Kawasaki
          </p>
          <p className="text-[13px] text-[var(--color-neutral-600)] mt-0.5">
            สมาชิกระดับ Silver
          </p>
          <button className="mt-3 h-9 px-4 rounded-md border border-[var(--color-primary)] text-[var(--color-primary)] text-[13px] font-medium hover:bg-[var(--color-primary-100)] transition">
            อัปโหลดรูปภาพ
          </button>
        </div>
      </div>

      {/* Form */}
      <form
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <Field label="ชื่อ">
          <Input
            value={first}
            onValueChange={setFirst}
            radius="sm"
            classNames={inputClassNames}
          />
        </Field>
        <Field label="นามสกุล">
          <Input
            value={last}
            onValueChange={setLast}
            radius="sm"
            classNames={inputClassNames}
          />
        </Field>
        <Field label="อีเมล">
          <Input
            type="email"
            value={email}
            onValueChange={setEmail}
            radius="sm"
            classNames={inputClassNames}
          />
        </Field>
        <Field label="เบอร์โทรศัพท์">
          <Input
            value={phone}
            onValueChange={(v) => {
              const d = v.replace(/\D/g, "").slice(0, 10);
              if (d.length <= 3) setPhone(d);
              else if (d.length <= 6)
                setPhone(`${d.slice(0, 3)}-${d.slice(3)}`);
              else setPhone(`${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`);
            }}
            inputMode="numeric"
            radius="sm"
            classNames={inputClassNames}
          />
        </Field>
        <Field label="วันเกิด">
          <Input
            type="date"
            value={dob}
            onValueChange={setDob}
            radius="sm"
            classNames={inputClassNames}
          />
        </Field>
        <Field label="เพศ">
          <Select
            selectedKeys={[gender]}
            onSelectionChange={(k) => setGender(Array.from(k)[0] as string)}
            aria-label="เพศ"
            radius="sm"
            classNames={{
              trigger:
                "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] shadow-none",
              value: "text-[14px] text-[var(--color-neutral-900)]",
            }}
          >
            <SelectItem key="male">ชาย</SelectItem>
            <SelectItem key="female">หญิง</SelectItem>
            <SelectItem key="other">อื่นๆ</SelectItem>
          </Select>
        </Field>
        <Field label="สัญชาติ" full>
          <Select
            selectedKeys={[nationality]}
            onSelectionChange={(k) =>
              setNationality(Array.from(k)[0] as string)
            }
            aria-label="สัญชาติ"
            radius="sm"
            classNames={{
              trigger:
                "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:border-[var(--color-primary-400)] shadow-none",
              value: "text-[14px] text-[var(--color-neutral-900)]",
            }}
          >
            <SelectItem key="th">ไทย</SelectItem>
            <SelectItem key="jp">ญี่ปุ่น</SelectItem>
            <SelectItem key="us">สหรัฐอเมริกา</SelectItem>
            <SelectItem key="other">อื่นๆ</SelectItem>
          </Select>
        </Field>
        <div className="sm:col-span-2 flex justify-end pt-2">
          <Button
            type="submit"
            radius="md"
            className="h-10 px-8 bg-[var(--color-primary)] text-white text-[14px] font-medium hover:brightness-110 transition"
          >
            บันทึก
          </Button>
        </div>
      </form>
    </section>
  );
}

const inputClassNames = {
  inputWrapper:
    "h-10 bg-white border border-[var(--color-neutral-300)] data-[hover=true]:bg-white data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-[var(--color-primary)]/20 shadow-none",
  input:
    "text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)]",
};

function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={["flex flex-col gap-1.5", full && "sm:col-span-2"].filter(Boolean).join(" ")}>
      <span className="text-[13px] text-[var(--color-neutral-700)]">{label}</span>
      {children}
    </label>
  );
}

export default function UserSettings() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Key>("settings");

  const logout = () => {
    sessionStorage.removeItem("loggedIn");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />

      {/* Banner */}
      <section className="relative">
        <div
          className="h-[250px] w-full"
          style={{
            background:
              "linear-gradient(135deg, #5dd6f0 0%, #21bdff 30%, #0485f7 60%, #f0c674 100%)",
          }}
        />

        {/* Profile summary card overlapping banner */}
        <div className="max-w-[1240px] mx-auto px-3 sm:px-4 lg:px-5 -mt-[120px] relative z-10">
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(2,77,143,0.12)] p-5 flex items-center gap-4">
            <img
              src={avatar}
              alt=""
              className="w-[80px] h-[80px] rounded-full object-cover ring-4 ring-white shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-[18px] font-bold text-[var(--color-neutral-900)] truncate">
                Okinowa Kawasaki
              </h2>
              <p className="text-[13px] text-[var(--color-neutral-600)] mt-1">
                <span>2 ผู้ติดตาม</span>
                <span className="mx-2 text-[var(--color-neutral-300)]">|</span>
                <span>0 กำลังติดตาม</span>
              </p>
            </div>
            <button
              onClick={logout}
              className="h-9 px-4 rounded-md border border-[var(--color-critical)] text-[var(--color-critical)] text-[13px] font-medium hover:bg-[var(--color-critical)]/10 transition"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-[1240px] mx-auto px-3 sm:px-4 lg:px-5 pt-6 pb-12">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="page-section-in" style={{ animationDelay: "120ms" }}>
            <Sidebar active={active} onChange={setActive} onLogout={logout} />
          </div>
          <div
            className="flex-1 min-w-0 page-section-in"
            style={{ animationDelay: "200ms" }}
          >
            <ProfileForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
