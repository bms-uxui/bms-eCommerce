import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, X, ImagePlus, FileImage } from "lucide-react";

export type SignatureResult =
  | { kind: "drawn"; dataUrl: string }
  | { kind: "uploaded"; filename: string };

/**
 * Drawable signature area: a method toggle (draw / upload), a canvas you can
 * draw on with mouse or touch, or an image picker, plus back / clear controls.
 * Reports the current result (or null when empty) via `onChange`.
 */
export default function SignaturePad({
  onBack,
  onChange,
}: {
  onBack: () => void;
  onChange?: (result: SignatureResult | null) => void;
}) {
  const [tab, setTab] = useState<"draw" | "upload">("draw");
  const [drawnUrl, setDrawnUrl] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const inkRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const result: SignatureResult | null =
      tab === "draw"
        ? drawnUrl
          ? { kind: "drawn", dataUrl: drawnUrl }
          : null
        : uploadName
          ? { kind: "uploaded", filename: uploadName }
          : null;
    onChange?.(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, drawnUrl, uploadName]);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1d212d";
  }, []);

  useEffect(() => {
    if (tab !== "draw") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    setupCanvas();
    const ro = new ResizeObserver(() => setupCanvas());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [tab, setupCanvas]);

  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = pointFromEvent(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    drawingRef.current = true;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = pointFromEvent(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    inkRef.current = true;
  };

  const endStroke = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const canvas = canvasRef.current;
    if (inkRef.current && canvas) setDrawnUrl(canvas.toDataURL("image/png"));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    drawingRef.current = false;
    inkRef.current = false;
    setDrawnUrl(null);
  };

  const clearAll = () => {
    clearCanvas();
    setUploadName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const switchTab = (t: "draw" | "upload") => {
    if (t === tab) return;
    setTab(t);
    clearAll();
  };

  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) setUploadName(f.name);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Method toggle */}
      <div className="flex gap-1 p-1 rounded-lg bg-white border border-[var(--color-neutral-200)]">
        {(
          [
            { key: "draw", label: "วาดลายเซ็น" },
            { key: "upload", label: "อัปโหลดรูปภาพ" },
          ] as const
        ).map((t) => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => switchTab(t.key)}
              className={[
                "flex-1 h-9 rounded-md text-[14px] font-medium transition-colors",
                active
                  ? "bg-[#dcf2fe] text-[#0e3ed0]"
                  : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)]",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Signature area */}
      <div className="rounded-lg border-2 border-dashed border-[var(--color-neutral-300)] h-[160px] overflow-hidden">
        {tab === "draw" ? (
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            onPointerLeave={endStroke}
            className="w-full h-full block cursor-crosshair touch-none"
          />
        ) : uploadName ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-4">
            <div className="flex items-center gap-2 max-w-full">
              <FileImage size={20} className="text-[var(--color-primary)] shrink-0" />
              <span className="text-[14px] text-[var(--color-neutral-900)] truncate">
                {uploadName}
              </span>
              <button
                type="button"
                onClick={() => {
                  setUploadName(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                aria-label="ลบรูปภาพ"
                className="shrink-0 text-[var(--color-critical)] hover:opacity-80 transition"
              >
                <X size={16} />
              </button>
            </div>
            <label className="text-[12px] text-[var(--color-primary)] font-medium cursor-pointer hover:underline">
              เลือกไฟล์ใหม่
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={onFilePick}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center gap-2 text-[var(--color-neutral-500)] cursor-pointer hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-100)]/30 transition">
            <ImagePlus size={28} />
            <span className="text-[13px]">อัปโหลดรูปภาพลายเซ็น</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={onFilePick}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-[14px] text-[var(--color-neutral-700)] hover:text-[var(--color-neutral-900)] transition-colors"
        >
          <RotateCcw size={15} />
          ย้อนกลับ
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="flex items-center gap-1.5 text-[14px] text-[var(--color-critical)] hover:opacity-80 transition-opacity"
        >
          <X size={15} />
          ล้างทั้งหมด
        </button>
      </div>
      <p className="text-center text-[12px] text-[var(--color-neutral-500)]">
        {tab === "draw"
          ? "ใช้เมาส์หรือนิ้ววาดลายเซ็นในกรอบด้านบน"
          : "รองรับไฟล์รูปภาพ PNG หรือ JPG"}
      </p>
    </div>
  );
}
