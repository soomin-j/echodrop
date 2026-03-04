"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

const BRUSH_COLORS = [
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#FF0000" },
  { name: "Orange", value: "#FF9000" },
  { name: "Yellow", value: "#FFE100" },
  { name: "Green", value: "#54DA00" },
  { name: "Blue", value: "#3300FF" },
  { name: "Purple", value: "#B700D4" },
] as const;

const BRUSH_SIZES = [
  { name: "Small", value: 2 },
  { name: "Medium", value: 4 },
  { name: "Large", value: 8 },
] as const;

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  value?: string | null;
  onChange?: (base64: string | null) => void;
  className?: string;
}

export function DrawingCanvas({
  width = 400,
  height = 280,
  value,
  onChange,
  className,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState<string>(BRUSH_COLORS[0].value);
  const [brushSize, setBrushSize] = useState<number>(BRUSH_SIZES[1].value);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const getCoords = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const draw = useCallback(
    (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    },
    [brushColor, brushSize]
  );

  const emitChange = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !onChange) return;
    const data = canvas.toDataURL("image/png");
    onChange(data);
  }, [onChange]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const coords = getCoords(e);
      if (!coords) return;
      setIsDrawing(true);
      lastPosRef.current = coords;
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = brushColor;
        ctx.fill();
      }
    },
    [getCoords, brushColor, brushSize]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const coords = getCoords(e);
      if (!coords || !lastPosRef.current) return;
      draw(lastPosRef.current, coords);
      lastPosRef.current = coords;
    },
    [isDrawing, getCoords, draw]
  );

  const handleMouseUp = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPosRef.current = null;
      emitChange();
    }
  }, [isDrawing, emitChange]);

  const handleMouseLeave = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPosRef.current = null;
      emitChange();
    }
  }, [isDrawing, emitChange]);

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#faf9f7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onChange?.(null);
  }, [onChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    if (value && value.startsWith("data:image")) {
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = "#faf9f7";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = value;
    } else {
      ctx.fillStyle = "#faf9f7";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [value]);

  useEffect(() => {
    const handleUp = () => {
      if (isDrawing) {
        setIsDrawing(false);
        lastPosRef.current = null;
        emitChange();
      }
    };
    window.addEventListener("mouseup", handleUp);
    return () => window.removeEventListener("mouseup", handleUp);
  }, [isDrawing, emitChange]);

  return (
    <div className={cn("space-y-3", className)}>
      <label className="mb-2 block text-sm font-medium">
        Draw on your postcard (optional)
      </label>
      <div
        className="overflow-hidden rounded-[22px] border border-black/[0.06] bg-[#faf9f7]"
        style={{
          boxShadow:
            "inset 0 2px 8px rgba(0,0,0,0.04), 0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="paper-grain block w-full cursor-crosshair touch-none"
          style={{
            maxWidth: "100%",
            height: "auto",
            aspectRatio: `${width} / ${height}`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--foreground-muted)]">Color:</span>
          {BRUSH_COLORS.map(({ name, value: v }) => (
            <button
              key={v}
              type="button"
              onClick={() => setBrushColor(v)}
              className={cn(
                "h-6 w-6 rounded-full transition-all duration-200",
                brushColor === v &&
                  "ring-2 ring-[var(--foreground-muted)] ring-offset-2 ring-offset-[#faf9f7]"
              )}
              style={{ backgroundColor: v }}
              title={name}
              aria-label={`${name} brush`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--foreground-muted)]">Size:</span>
          {BRUSH_SIZES.map(({ name, value: v }) => (
            <button
              key={v}
              type="button"
              onClick={() => setBrushSize(v)}
              className={cn(
                "rounded-[12px] px-2.5 py-1 text-xs font-medium transition-all duration-200",
                brushSize === v
                  ? "bg-[var(--foreground)] text-white"
                  : "bg-white/90 text-[var(--foreground-muted)] hover:bg-white hover:text-[var(--foreground)]"
              )}
            >
              {name}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-[12px] px-3 py-1.5 text-xs font-medium text-[var(--foreground-muted)] transition-all duration-200 hover:bg-black/[0.04] hover:text-[var(--foreground)]"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
