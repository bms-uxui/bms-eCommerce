import { Globe, Plus, Trash2 } from "lucide-react";
import facebookLogo from "../assets/social/facebook.png";
import tiktokLogo from "../assets/social/tiktok.png";
import instagramLogo from "../assets/social/instagram.png";
import xLogo from "../assets/social/x.png";
import youtubeLogo from "../assets/social/youtube.png";

export type SocialPlatform = { key: string; label: string; logo?: string; bg?: string };

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { key: "facebook", label: "Facebook", logo: facebookLogo, bg: "bg-white" },
  { key: "tiktok", label: "Tiktok", logo: tiktokLogo, bg: "bg-black" },
  { key: "instagram", label: "Instagram", logo: instagramLogo, bg: "bg-white" },
  { key: "x", label: "X", logo: xLogo, bg: "bg-black" },
  { key: "youtube", label: "Youtube", logo: youtubeLogo, bg: "bg-white" },
  { key: "other", label: "Other" },
];

export type ConnectedSocialAccount = { id: string; platform: SocialPlatform; name: string };

export function PlatformLogo({ platform }: { platform: SocialPlatform }) {
  return (
    <span
      className={`w-9 h-9 rounded-xl overflow-hidden shrink-0 flex items-center justify-center ${
        platform.bg ?? "bg-[var(--color-neutral-200)]"
      }`}
    >
      {platform.logo ? (
        <img src={platform.logo} alt="" className="w-9 h-9 object-cover" />
      ) : (
        <Globe size={20} className="text-[var(--color-neutral-700)]" />
      )}
    </span>
  );
}

/** Grid of selectable social platforms; clicking a card calls `onAddPlatform`. */
export function PlatformGrid({
  onAddPlatform,
  readOnly = false,
  className = "",
}: {
  onAddPlatform: (platform: SocialPlatform) => void;
  readOnly?: boolean;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {SOCIAL_PLATFORMS.map((p) => (
        <button
          key={p.key}
          type="button"
          disabled={readOnly}
          onClick={() => onAddPlatform(p)}
          className={[
            "bg-white border border-[var(--color-neutral-300)] rounded-xl h-[62px] px-4 flex items-center justify-between gap-2 transition",
            readOnly ? "opacity-60 cursor-default" : "hover:border-[var(--color-primary)]",
          ].join(" ")}
        >
          <span className="flex items-center gap-2">
            <PlatformLogo platform={p} />
            <span className="text-[16px] font-bold text-[#18181b]">{p.label}</span>
          </span>
          <Plus
            size={24}
            className={readOnly ? "text-[var(--color-neutral-400)]" : "text-[var(--color-neutral-700)]"}
          />
        </button>
      ))}
    </div>
  );
}

/** List of already-connected social accounts with remove buttons. */
export function ConnectedAccountsList({
  accounts,
  onRemove,
  readOnly = false,
  emptyText = "ยังไม่ได้เชื่อมต่อบัญชี",
  className = "",
}: {
  accounts: ConnectedSocialAccount[];
  onRemove: (id: string) => void;
  readOnly?: boolean;
  emptyText?: string;
  className?: string;
}) {
  if (accounts.length === 0) {
    return <p className={`text-[14px] text-[var(--color-neutral-500)] py-2 ${className}`}>{emptyText}</p>;
  }
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {accounts.map((a) => (
        <div
          key={a.id}
          className="bg-[var(--color-primary-100)] rounded-lg flex items-center justify-between px-3 py-2"
        >
          <span className="flex items-center gap-2">
            <PlatformLogo platform={a.platform} />
            <span className="text-[16px] text-[var(--color-neutral-900)] leading-4">{a.name}</span>
          </span>
          {!readOnly && (
            <button
              type="button"
              onClick={() => onRemove(a.id)}
              aria-label="ลบบัญชี"
              className="text-[var(--color-neutral-700)] hover:text-[var(--color-critical)] transition"
            >
              <Trash2 size={22} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

/** Full media picker: platform grid + "บัญชีที่เชื่อมต่อแล้ว" list. */
export default function SocialPlatformPicker({
  connected,
  onAddPlatform,
  onRemove,
  readOnly = false,
  className = "",
}: {
  connected: ConnectedSocialAccount[];
  onAddPlatform: (platform: SocialPlatform) => void;
  onRemove: (id: string) => void;
  readOnly?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      <PlatformGrid onAddPlatform={onAddPlatform} readOnly={readOnly} />
      <div className="flex flex-col gap-2">
        <p className="text-[14px] text-[var(--color-neutral-900)]">บัญชีที่เชื่อมต่อแล้ว :</p>
        <ConnectedAccountsList accounts={connected} onRemove={onRemove} readOnly={readOnly} />
      </div>
    </div>
  );
}
