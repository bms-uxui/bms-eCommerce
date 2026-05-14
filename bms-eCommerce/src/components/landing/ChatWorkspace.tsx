import { useEffect, useMemo, useRef, useState } from "react";
import { Star, Image as ImageIcon, Store, Send, Smile, X } from "lucide-react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import Icon from "./Icon";
import SearchIcon from "../SearchIcon";

export type ChatProductRef = { img: string; name: string; price: number; oldPrice?: number; rating: number; sold: string };

export type ChatMsg =
  | { id: string; kind: "text"; from: "me" | "them"; text: string; time: string }
  | { id: string; kind: "product"; from: "me" | "them"; product: ChatProductRef; time: string }
  | { id: string; kind: "image"; from: "me" | "them"; url: string; time: string }
  | { id: string; kind: "sticker"; from: "me" | "them"; emoji: string; time: string };

export type ChatConversation = {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastActive: string;
  msgs: ChatMsg[];
};

function previewOf(m: ChatMsg): string {
  if (m.kind === "text") return m.text;
  if (m.kind === "product") return `[สินค้า] ${m.product.name}`;
  if (m.kind === "image") return "[รูปภาพ]";
  return `[สติกเกอร์] ${m.emoji}`;
}

function nowTime(): string {
  return new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น.";
}

function Avatar({ src, online, size = 40 }: { src?: string; online?: boolean; size?: number }) {
  return (
    <span className="relative shrink-0 inline-block" style={{ width: size, height: size }}>
      {src ? (
        <img src={src} alt="" className="block w-full h-full rounded-full object-cover" />
      ) : (
        <span className="block w-full h-full rounded-full bg-[var(--color-neutral-200)]" />
      )}
      {online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22c55e] ring-2 ring-white" />}
    </span>
  );
}

function ProductBubble({ p }: { p: ChatProductRef }) {
  const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return (
    <div className="w-[280px] rounded-xl border border-[var(--color-neutral-200)] bg-white overflow-hidden">
      <div className="px-3 pt-2 text-[12px] text-[var(--color-neutral-500)]">สินค้า</div>
      <div className="flex gap-3 p-3">
        <img src={p.img} alt="" className="w-14 h-14 rounded object-cover shrink-0" />
        <div className="min-w-0 flex flex-col gap-0.5">
          <p className="text-[13px] text-[var(--color-neutral-900)] line-clamp-2">{p.name}</p>
          <p className="text-[13px]">
            <span className="font-semibold text-[var(--color-primary)]">฿ {p.price.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</span>{" "}
            {p.oldPrice && <span className="text-[11px] text-[var(--color-neutral-400)] line-through">฿{p.oldPrice.toLocaleString("th-TH")}</span>}{" "}
            {off > 0 && <span className="text-[10px] px-1 rounded bg-[var(--color-critical)]/10 text-[var(--color-critical)]">{off}%</span>}
          </p>
          <p className="flex items-center gap-1 text-[11px] text-[var(--color-neutral-500)]"><Star size={11} className="text-[#ffb800]" fill="#ffb800" /> {p.rating}/5 <span className="ml-1">{p.sold} ขายแล้ว</span></p>
        </div>
      </div>
    </div>
  );
}

export default function ChatWorkspace({
  title,
  conversations,
}: {
  title: string;
  conversations: ChatConversation[];
}) {
  const [convos, setConvos] = useState<ChatConversation[]>(conversations);
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const active = convos.find((c) => c.id === activeId) ?? convos[0];
  const filtered = useMemo(
    () => convos.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase())),
    [convos, query]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [activeId, active?.msgs.length]);

  const appendMsg = (msg: ChatMsg) =>
    setConvos((cs) => cs.map((c) => (c.id === activeId ? { ...c, msgs: [...c.msgs, msg] } : c)));

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    appendMsg({ id: `m${Date.now()}`, kind: "text", from: "me", text, time: nowTime() });
  };

  const sendImage = (file: File) => {
    appendMsg({ id: `m${Date.now()}`, kind: "image", from: "me", url: URL.createObjectURL(file), time: nowTime() });
  };

  const addEmoji = (emoji: string) => {
    setDraft((d) => d + emoji);
    setEmojiOpen(false);
    inputRef.current?.focus();
  };

  if (!active) return null;

  return (
    <>
      <main className="flex-1 min-w-0 h-[calc(100vh-72px)] flex bg-white">
        {/* Conversation list */}
        <aside className="w-[340px] shrink-0 border-r border-[var(--color-neutral-200)] flex flex-col">
          <div className="px-5 py-4 border-b border-[var(--color-neutral-200)]">
            <h1 className="text-[20px] font-semibold text-[var(--color-primary-700)]">{title}</h1>
          </div>
          <div className="p-3 border-b border-[var(--color-neutral-200)]">
            <div className="flex items-center">
              <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="ค้นหา" className="h-9 flex-1 min-w-0 bg-white border border-[var(--color-neutral-300)] rounded-l-lg px-3 text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary)]" />
              <button type="button" aria-label="ค้นหา" className="h-9 px-3 flex items-center justify-center rounded-r-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-600)] transition-colors"><SearchIcon size={16} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((c) => {
              const sel = c.id === activeId;
              const last = c.msgs[c.msgs.length - 1];
              return (
                <button key={c.id} type="button" onClick={() => setActiveId(c.id)} className={["w-full flex items-center gap-3 px-4 py-3 text-left border-b border-[var(--color-neutral-100,#f1f4f7)] transition-colors", sel ? "bg-[var(--color-primary-100)]" : "hover:bg-[var(--color-neutral-100,#f5f8fa)]"].join(" ")}>
                  <Avatar src={c.avatar} online={c.online} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[var(--color-neutral-900)] truncate">{c.name}</p>
                    <p className="text-[13px] text-[var(--color-neutral-500)] truncate">{last?.from === "me" ? "คุณ: " : ""}{last ? previewOf(last) : ""}</p>
                  </div>
                  <span className="text-[12px] text-[var(--color-neutral-400)] whitespace-nowrap shrink-0">{last?.time}</span>
                </button>
              );
            })}
            {filtered.length === 0 && <div className="py-12 text-center text-[14px] text-[var(--color-neutral-500)]">ไม่พบแชท</div>}
          </div>
        </aside>

        {/* Conversation view */}
        <section className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center gap-3 px-6 py-3 border-b border-[var(--color-neutral-200)]">
            <Avatar src={active.avatar} online={active.online} size={40} />
            <div>
              <p className="text-[15px] font-semibold text-[var(--color-neutral-900)]">{active.name}</p>
              <p className={`text-[12px] ${active.online ? "text-[#16a34a]" : "text-[var(--color-neutral-400)]"}`}>{active.lastActive}</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3 bg-[#fafbfc]">
            <div className="self-center px-3 py-1 rounded-full bg-[var(--color-neutral-200)] text-[12px] text-[var(--color-neutral-600)]">12 ก.ย. 2025</div>
            {active.msgs.map((m) => {
              const mine = m.from === "me";
              return (
                <div key={m.id} className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}>
                  {!mine && <Avatar src={active.avatar} size={28} />}
                  <div className={m.kind === "text" ? `max-w-[60%] ${mine ? "bg-[var(--color-primary)] text-white" : "bg-white text-[var(--color-neutral-900)] border border-[var(--color-neutral-200)]"} rounded-2xl px-3.5 py-2 text-[14px] leading-6` : "max-w-[60%]"}>
                    {m.kind === "text" && m.text}
                    {m.kind === "product" && <ProductBubble p={m.product} />}
                    {m.kind === "image" && <button type="button" onClick={() => setLightbox(m.url)} className="block cursor-zoom-in"><img src={m.url} alt="" className="max-w-[220px] max-h-[260px] rounded-xl object-cover border border-[var(--color-neutral-200)]" /></button>}
                    {m.kind === "sticker" && <div className="w-16 h-16 rounded-xl bg-white border border-[var(--color-neutral-200)] flex items-center justify-center text-3xl">{m.emoji}</div>}
                  </div>
                  <span className="text-[11px] text-[var(--color-neutral-400)] whitespace-nowrap mb-0.5">{m.time}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-[var(--color-neutral-200)] px-6 py-3">
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); send(); } }}
              placeholder="พิมพ์ข้อความ..."
              className="w-full h-10 text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none"
            />
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3 text-[var(--color-neutral-500)]">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) sendImage(f); e.target.value = ""; }} />
                <button type="button" aria-label="แนบรูปภาพ" onClick={() => fileRef.current?.click()} className="hover:text-[var(--color-primary)] transition-colors"><ImageIcon size={20} /></button>
                <button type="button" aria-label="แนบสินค้า" className="hover:text-[var(--color-primary)] transition-colors"><Store size={20} /></button>
                <div className="relative flex items-center">
                  <button type="button" aria-label="อีโมจิ" onClick={() => setEmojiOpen((o) => !o)} className={`flex items-center transition-colors ${emojiOpen ? "text-[var(--color-primary)]" : "hover:text-[var(--color-primary)]"}`}><Smile size={20} /></button>
                  {emojiOpen && (
                    <>
                      <button type="button" aria-hidden tabIndex={-1} className="fixed inset-0 z-10 cursor-default" onClick={() => setEmojiOpen(false)} />
                      <div className="absolute bottom-9 left-0 z-20 animate-dropdown">
                        <EmojiPicker
                          onEmojiClick={(e) => addEmoji(e.emoji)}
                          theme={Theme.LIGHT}
                          emojiStyle={EmojiStyle.NATIVE}
                          lazyLoadEmojis
                          searchPlaceholder="ค้นหาอีโมจิ"
                          width={320}
                          height={360}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <button type="button" aria-label="ส่ง" disabled={!draft.trim()} onClick={send} className="w-9 h-9 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[var(--color-primary-600)] transition-colors disabled:opacity-40"><Send size={16} /></button>
            </div>
          </div>
        </section>
      </main>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6 drawer-overlay-in" onClick={() => setLightbox(null)}>
          <button type="button" aria-label="ปิด" className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition" onClick={() => setLightbox(null)}><X size={18} /></button>
          <img src={lightbox} alt="" onClick={(e) => e.stopPropagation()} className="max-w-[90vw] max-h-[85vh] rounded-lg object-contain shadow-2xl" />
        </div>
      )}
    </>
  );
}
