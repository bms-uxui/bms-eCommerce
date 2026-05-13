import { useEffect, useRef, useState } from "react";
import { Star, Image as ImageIcon, Send, Smile, X, ChevronLeft, Search } from "lucide-react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import type { ChatConversation, ChatMsg, ChatProductRef } from "./ChatWorkspace";
import shopAvatar from "../../assets/store-avatar.png";
import skirt from "../../assets/products/p01-skirt.jpg";
import bpMonitor from "../../assets/products/p03-bp-monitor.jpg";
import ginseng from "../../assets/products/p08-ginseng.jpg";

const PROD_SKIRT: ChatProductRef = { img: skirt, name: "กระโปรงพลีทสั้นลายดอกไม้สีฟ้าสดใส", price: 590, oldPrice: 890, rating: 4.8, sold: "3.2k" };
const PROD_BP: ChatProductRef = { img: bpMonitor, name: "เครื่องวัดความดัน BP-200", price: 1290, oldPrice: 1690, rating: 4.8, sold: "2.1k" };
const PROD_GINSENG: ChatProductRef = { img: ginseng, name: "โสมสกัดเข้มข้น บำรุงร่างกาย", price: 850, oldPrice: 1100, rating: 4.7, sold: "1.4k" };

const INITIAL: ChatConversation[] = [
  {
    id: "s1", name: "BMS.shop", avatar: shopAvatar, online: true, lastActive: "กำลังออนไลน์อยู่",
    msgs: [
      { id: "m1", kind: "text", from: "me", text: "สวัสดีค่ะ ชาอูหลงตัวนี้สั่ง 3 กล่องส่งฟรีไหมคะ", time: "13:20 น." },
      { id: "m2", kind: "text", from: "them", text: "สวัสดีครับ สั่งครบ 500 บาทส่งฟรีทั่วประเทศครับ", time: "13:22 น." },
      { id: "m3", kind: "product", from: "them", product: PROD_GINSENG, time: "13:23 น." },
      { id: "m4", kind: "text", from: "me", text: "โอเคค่ะ เดี๋ยวกดสั่งเลยนะคะ", time: "13:25 น." },
      { id: "m5", kind: "sticker", from: "them", emoji: "🙏", time: "13:26 น." },
    ],
  },
  {
    id: "s2", name: "Fashion House BKK", avatar: shopAvatar, online: true, lastActive: "กำลังออนไลน์อยู่",
    msgs: [
      { id: "m1", kind: "text", from: "me", text: "กระโปรงตัวนี้มีไซส์ M ไหมคะ", time: "10:05 น." },
      { id: "m2", kind: "product", from: "them", product: PROD_SKIRT, time: "10:06 น." },
      { id: "m3", kind: "text", from: "them", text: "มีครบทุกไซส์ครับ S / M / L รอบเอว 24-30 นิ้วครับ", time: "10:08 น." },
      { id: "m4", kind: "text", from: "me", text: "ขอบคุณค่ะ", time: "10:10 น." },
    ],
  },
  {
    id: "s3", name: "ร้านขายยาเภสัชภัณฑ์", avatar: shopAvatar, online: false, lastActive: "ออนไลน์ล่าสุด 1 ชั่วโมงที่แล้ว",
    msgs: [
      { id: "m1", kind: "text", from: "me", text: "เครื่องวัดความดันมีรับประกันกี่ปีคะ", time: "09:30 น." },
      { id: "m2", kind: "product", from: "them", product: PROD_BP, time: "09:31 น." },
      { id: "m3", kind: "text", from: "them", text: "รับประกันศูนย์ไทย 2 ปีครับ มีบริการเปลี่ยนเครื่องใหม่ใน 7 วันแรก", time: "09:34 น." },
    ],
  },
  {
    id: "s4", name: "Healthy Life Store", avatar: shopAvatar, online: false, lastActive: "ออนไลน์ล่าสุดเมื่อวาน",
    msgs: [
      { id: "m1", kind: "text", from: "me", text: "ของยังไม่ถึงเลยค่ะ เลขพัสดุ TH202548 ตรวจสอบให้หน่อยได้ไหมคะ", time: "เมื่อวาน" },
      { id: "m2", kind: "text", from: "them", text: "ขออภัยครับ ตรวจสอบแล้วพัสดุอยู่ที่ศูนย์คัดแยก คาดว่าถึงพรุ่งนี้ครับ", time: "เมื่อวาน" },
    ],
  },
  {
    id: "s5", name: "Beauty Corner", avatar: shopAvatar, online: true, lastActive: "กำลังออนไลน์อยู่",
    msgs: [
      { id: "m1", kind: "text", from: "me", text: "มีโค้ดส่วนลดสำหรับลูกค้าใหม่ไหมคะ", time: "16:40 น." },
      { id: "m2", kind: "text", from: "them", text: "มีครับ ใช้โค้ด NEW50 ลด 50 บาท เมื่อซื้อครบ 300 บาทครับ", time: "16:42 น." },
      { id: "m3", kind: "sticker", from: "me", emoji: "🥰", time: "16:43 น." },
    ],
  },
  {
    id: "s6", name: "ออร์แกนิคฟาร์ม", avatar: shopAvatar, online: false, lastActive: "ออนไลน์ล่าสุด 3 วันที่แล้ว",
    msgs: [
      { id: "m1", kind: "text", from: "me", text: "ผักออร์แกนิคจัดส่งวันไหนบ้างคะ", time: "3 วันก่อน" },
      { id: "m2", kind: "text", from: "them", text: "จัดส่งทุกวันอังคารและศุกร์ครับ ตัดรอบสั่งก่อน 18:00 น. วันก่อนหน้า", time: "3 วันก่อน" },
    ],
  },
];

function previewOf(m: ChatMsg): string {
  if (m.kind === "text") return m.text;
  if (m.kind === "product") return `[สินค้า] ${m.product.name}`;
  if (m.kind === "image") return "[รูปภาพ]";
  return `[สติกเกอร์] ${m.emoji}`;
}
function nowTime() {
  return new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น.";
}

function Avatar({ src, online, size = 36 }: { src?: string; online?: boolean; size?: number }) {
  return (
    <span className="relative shrink-0 inline-block" style={{ width: size, height: size }}>
      {src ? <img src={src} alt="" className="block w-full h-full rounded-full object-cover" /> : <span className="block w-full h-full rounded-full bg-[var(--color-neutral-200)]" />}
      {online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22c55e] ring-2 ring-white" />}
    </span>
  );
}

function ProductBubble({ p }: { p: ChatProductRef }) {
  const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return (
    <div className="w-[220px] rounded-xl border border-[var(--color-neutral-200)] bg-white overflow-hidden">
      <div className="px-2.5 pt-1.5 text-[11px] text-[var(--color-neutral-500)]">สินค้า</div>
      <div className="flex gap-2 p-2.5">
        <img src={p.img} alt="" className="w-11 h-11 rounded object-cover shrink-0" />
        <div className="min-w-0 flex flex-col gap-0.5">
          <p className="text-[12px] text-[var(--color-neutral-900)] line-clamp-2">{p.name}</p>
          <p className="text-[12px]"><span className="font-semibold text-[var(--color-primary)]">฿{p.price.toLocaleString("th-TH")}</span>{p.oldPrice && <span className="text-[10px] text-[var(--color-neutral-400)] line-through ml-1">฿{p.oldPrice.toLocaleString("th-TH")}</span>}{off > 0 && <span className="text-[9px] px-1 rounded bg-[var(--color-critical)]/10 text-[var(--color-critical)] ml-1">{off}%</span>}</p>
          <p className="flex items-center gap-1 text-[10px] text-[var(--color-neutral-500)]"><Star size={10} className="text-[#ffb800]" fill="#ffb800" />{p.rating}/5 · {p.sold} ขายแล้ว</p>
        </div>
      </div>
    </div>
  );
}

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [convos, setConvos] = useState<ChatConversation[]>(INITIAL);
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const active = convos.find((c) => c.id === openId) ?? null;
  const filtered = convos.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    if (active) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [openId, active?.msgs.length]);

  const appendMsg = (msg: ChatMsg) => setConvos((cs) => cs.map((c) => (c.id === openId ? { ...c, msgs: [...c.msgs, msg] } : c)));
  const send = () => { const t = draft.trim(); if (!t) return; setDraft(""); appendMsg({ id: `m${Date.now()}`, kind: "text", from: "me", text: t, time: nowTime() }); };
  const sendImage = (f: File) => appendMsg({ id: `m${Date.now()}`, kind: "image", from: "me", url: URL.createObjectURL(f), time: nowTime() });
  const addEmoji = (e: string) => { setDraft((d) => d + e); setEmojiOpen(false); inputRef.current?.focus(); };

  return (
    <div className="fixed inset-0 z-[60] w-full h-full sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[384px] sm:max-w-[calc(100vw-2rem)] sm:h-[560px] sm:max-h-[calc(100vh-8rem)] flex flex-col rounded-none sm:rounded-2xl bg-white shadow-[0_16px_48px_rgba(29,33,45,0.24),0_0_1px_rgba(29,33,45,0.2)] overflow-hidden drawer-panel-in">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 h-14 shrink-0 bg-[var(--color-primary)] text-white">
        {active && <button type="button" onClick={() => setOpenId(null)} aria-label="ย้อนกลับ" className="w-7 h-7 -ml-1 flex items-center justify-center rounded-full hover:bg-white/15 transition"><ChevronLeft size={20} /></button>}
        {active ? (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Avatar src={active.avatar} online={active.online} size={32} />
            <div className="min-w-0">
              <p className="text-[15px] font-semibold truncate leading-tight">{active.name}</p>
              <p className="text-[11px] text-white/80 truncate">{active.lastActive}</p>
            </div>
          </div>
        ) : (
          <p className="text-[16px] font-semibold flex-1">แชทของฉัน</p>
        )}
        <button type="button" onClick={onClose} aria-label="ปิด" className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/15 transition"><X size={18} /></button>
      </div>

      {!active ? (
        <>
          <div className="p-3 border-b border-[var(--color-neutral-200)]">
            <div className="h-9 flex items-center gap-2 rounded-lg border border-[var(--color-neutral-300)] px-3 focus-within:border-[var(--color-primary)]">
              <Search size={16} className="text-[var(--color-neutral-400)]" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหาร้านค้า" className="flex-1 min-w-0 text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((c) => {
              const last = c.msgs[c.msgs.length - 1];
              return (
                <button key={c.id} type="button" onClick={() => { setOpenId(c.id); setDraft(""); }} className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-[var(--color-neutral-100,#f1f4f7)] hover:bg-[var(--color-neutral-100,#f5f8fa)] transition-colors">
                  <Avatar src={c.avatar} online={c.online} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[var(--color-neutral-900)] truncate">{c.name}</p>
                    <p className="text-[13px] text-[var(--color-neutral-500)] truncate">{last?.from === "me" ? "คุณ: " : ""}{last ? previewOf(last) : ""}</p>
                  </div>
                  <span className="text-[11px] text-[var(--color-neutral-400)] whitespace-nowrap shrink-0">{last?.time}</span>
                </button>
              );
            })}
            {filtered.length === 0 && <div className="py-10 text-center text-[14px] text-[var(--color-neutral-500)]">ไม่พบแชท</div>}
          </div>
        </>
      ) : (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2.5 bg-[#fafbfc]">
            <div className="self-center px-3 py-1 rounded-full bg-[var(--color-neutral-200)] text-[11px] text-[var(--color-neutral-600)]">12 ก.ย. 2025</div>
            {active.msgs.map((m) => {
              const mine = m.from === "me";
              return (
                <div key={m.id} className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}>
                  {!mine && <Avatar src={active.avatar} size={24} />}
                  <div className={m.kind === "text" ? `max-w-[72%] ${mine ? "bg-[var(--color-primary)] text-white" : "bg-white text-[var(--color-neutral-900)] border border-[var(--color-neutral-200)]"} rounded-2xl px-3 py-1.5 text-[14px] leading-6` : "max-w-[72%]"}>
                    {m.kind === "text" && m.text}
                    {m.kind === "product" && <ProductBubble p={m.product} />}
                    {m.kind === "image" && <button type="button" onClick={() => setLightbox(m.url)} className="block cursor-zoom-in"><img src={m.url} alt="" className="max-w-[180px] max-h-[220px] rounded-xl object-cover border border-[var(--color-neutral-200)]" /></button>}
                    {m.kind === "sticker" && <div className="w-14 h-14 rounded-xl bg-white border border-[var(--color-neutral-200)] flex items-center justify-center text-2xl">{m.emoji}</div>}
                  </div>
                  <span className="text-[10px] text-[var(--color-neutral-400)] whitespace-nowrap mb-0.5">{m.time}</span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-[var(--color-neutral-200)] px-3 py-2.5 shrink-0">
            <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); send(); } }} placeholder="พิมพ์ข้อความ..." className="w-full h-9 text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none" />
            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-3 text-[var(--color-neutral-500)]">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) sendImage(f); e.target.value = ""; }} />
                <button type="button" aria-label="แนบรูปภาพ" onClick={() => fileRef.current?.click()} className="flex items-center hover:text-[var(--color-primary)] transition-colors"><ImageIcon size={20} /></button>
                <div className="relative flex items-center">
                  <button type="button" aria-label="อีโมจิ" onClick={() => setEmojiOpen((o) => !o)} className={`flex items-center transition-colors ${emojiOpen ? "text-[var(--color-primary)]" : "hover:text-[var(--color-primary)]"}`}><Smile size={20} /></button>
                  {emojiOpen && (
                    <>
                      <button type="button" aria-hidden tabIndex={-1} className="fixed inset-0 z-10 cursor-default" onClick={() => setEmojiOpen(false)} />
                      <div className="absolute bottom-9 left-0 z-20 animate-dropdown">
                        <EmojiPicker onEmojiClick={(e) => addEmoji(e.emoji)} theme={Theme.LIGHT} emojiStyle={EmojiStyle.NATIVE} lazyLoadEmojis searchPlaceholder="ค้นหาอีโมจิ" width={300} height={340} />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <button type="button" aria-label="ส่ง" disabled={!draft.trim()} onClick={send} className="w-9 h-9 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[var(--color-primary-600)] transition-colors disabled:opacity-40"><Send size={16} /></button>
            </div>
          </div>
        </>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-6 drawer-overlay-in" onClick={() => setLightbox(null)}>
          <button type="button" aria-label="ปิด" className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition" onClick={() => setLightbox(null)}><X size={18} /></button>
          <img src={lightbox} alt="" onClick={(e) => e.stopPropagation()} className="max-w-[90vw] max-h-[85vh] rounded-lg object-contain shadow-2xl" />
        </div>
      )}
    </div>
  );
}
