"use client";

import type { Echo, Postcard } from "@/types";
import { cn } from "@/lib/utils";

const DEFAULT_DESIGN: NonNullable<Postcard["design"]> = {
  gradientColors: [],
  layoutVariant: "classic",
  typographyStyle: "default",
};

interface PostcardVintageProps {
  design?: Postcard["design"];
  echoes: Echo[];
  caption?: string;
  city: string;
  area: string;
  locationName?: string;
}

export function PostcardVintage({
  design = DEFAULT_DESIGN,
  echoes,
  caption,
  city,
  area,
  locationName,
}: PostcardVintageProps) {
  const firstPhoto = echoes.find((e) => e.type === "photo");
  const drawingEcho = echoes.find((e) => e.type === "drawing");
  const texts = echoes.filter(
    (e) => e.type === "text" || e.type === "handwriting"
  );

  // Optional handwritten accent: use last text as signature when there are 2+
  const handwrittenNote =
    texts.length >= 2 ? texts[texts.length - 1].content : undefined;
  const mainTexts = handwrittenNote ? texts.slice(0, -1) : texts;

  return (
    <div
      className={cn(
        "postcard-vintage-paper postcard-vintage-grain relative flex h-full w-full flex-row overflow-hidden rounded-2xl",
        "border border-[rgba(180,160,130,0.25)]"
      )}
    >
      {/* Subtle edge wear / darker corners */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          boxShadow: "inset 0 0 60px rgba(140,120,90,0.03), inset 0 0 0 1px rgba(200,180,150,0.15)",
        }}
      />

      {/* LEFT: Caption (top half) + Drawing (bottom half) */}
      <div className="relative flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        {/* Top half: caption and info */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="font-typewriter text-xs uppercase tracking-widest text-[#5a5045]">
            {city} · {area}
          </div>
          <hr className="my-3 border-t border-[rgba(120,100,80,0.2)]" />

          <div className="flex-1 space-y-2">
            {mainTexts.map((e) => (
              <p
                key={e.id}
                className="font-typewriter text-xs leading-relaxed text-[#4a453d]"
              >
                {e.content}
              </p>
            ))}
          </div>

          {caption && (
            <p className="mt-2 font-typewriter text-xs leading-relaxed text-[#4a453d]">
              {caption}
            </p>
          )}

          {handwrittenNote && (
            <p className="mt-3 font-handwriting text-sm text-[#5a5045]">
              {handwrittenNote}
            </p>
          )}

          {locationName && (
            <p className="mt-2 font-typewriter text-[10px] uppercase tracking-wider text-[#8a8075]">
              {locationName}
            </p>
          )}

          {design?.waveformBars && design.waveformBars.length > 0 && (
            <div className="mt-3 flex items-end justify-start gap-0.5">
              {design.waveformBars.map((h, i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-sm bg-[#8a8075]/40"
                  style={{ height: `${Math.max(4, h * 24)}px` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom half: drawing - takes equal space */}
        <div className="flex min-h-0 flex-1 flex-col pt-3">
          {drawingEcho?.content ? (
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded border border-[rgba(120,100,80,0.2)] bg-[rgba(255,252,245,0.5)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={drawingEcho.content}
                alt="Hand-drawn sketch"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 items-center justify-center rounded border border-dashed border-[rgba(120,100,80,0.2)] bg-[rgba(250,248,245,0.2)]">
              <span className="font-typewriter text-[10px] uppercase tracking-wider text-[#8a8075]/60">
                No drawing
              </span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Image and stamp */}
      <div className="relative flex flex-[1.1] flex-col border-l border-[rgba(120,100,80,0.15)]">
        <div className="relative flex flex-1 items-center justify-center overflow-hidden p-2 sm:p-3">
          {firstPhoto ? (
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-md border border-[rgba(120,100,80,0.2)] bg-[rgba(250,248,245,0.5)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={firstPhoto.content}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-[rgba(120,100,80,0.2)] bg-[rgba(250,248,245,0.3)]">
              <span className="font-typewriter text-[10px] uppercase tracking-wider text-[#8a8075]">
                No image
              </span>
            </div>
          )}
        </div>

        {/* Stamp + postmark cancellation - like a real postcard */}
        <div className="absolute right-2 top-2 z-10">
          <div className="relative size-[7rem]">
            {/* Stamp circle (postage) */}
            <svg
              width="112"
              height="112"
              viewBox="0 0 48 48"
              fill="none"
              className="absolute bottom-0 left-0 text-[#8b7355]"
            >
              <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" />
              <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4" />
            </svg>
            {/* Postmark date stamp - on top of stamp like real cancellation */}
            <div
              className="absolute left-0 top-0 flex flex-col items-center justify-center rounded border-2 border-[#3a3025] bg-white/95 px-3 py-1.5 shadow-sm"
              style={{ fontFamily: "var(--font-typewriter)" }}
            >
              <span className="text-base font-semibold uppercase tracking-wider text-[#3a3025]">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
              </span>
              <span className="text-sm text-[#5a5045]">{city}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
