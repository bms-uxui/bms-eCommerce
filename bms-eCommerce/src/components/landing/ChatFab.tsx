import { useState } from "react";
import { useLocation } from "react-router";
import { MessageCircle, X } from "lucide-react";
import ChatPanel from "./ChatPanel";

const UNREAD = 3;

export default function ChatFab() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Sellers reach แชท from their sidebar; no FAB in the seller area.
  if (pathname.startsWith("/seller")) return null;

  return (
    <>
      {open && <ChatPanel onClose={() => setOpen(false)} />}
      <button
        type="button"
        aria-label="แชท"
        onClick={() => setOpen((o) => !o)}
        className="group fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[var(--color-primary)] text-white shadow-[0_8px_24px_rgba(4,133,247,0.4)] flex items-center justify-center hover:bg-[var(--color-primary-600)] active:scale-95 transition-all"
      >
        {open ? <X size={26} /> : <MessageCircle size={26} />}
        {!open && UNREAD > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 rounded-full bg-[var(--color-critical)] text-[11px] font-semibold flex items-center justify-center ring-2 ring-white">
            {UNREAD > 99 ? "99+" : UNREAD}
          </span>
        )}
      </button>
    </>
  );
}
