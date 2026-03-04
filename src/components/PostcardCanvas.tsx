"use client";

import type { Echo, Postcard } from "@/types";
import { MOOD_PALETTES } from "@/lib/postcardDesign";

interface PostcardCanvasProps {
  echoes: Echo[];
  caption?: string;
  city: string;
  area: string;
  locationName?: string;
  design?: Postcard["design"];
  isPreview?: boolean;
}

const DEFAULT_GRADIENT = MOOD_PALETTES.default;

export function PostcardCanvas({
  echoes,
  caption,
  city,
  area,
  locationName,
  design,
  isPreview = false,
}: PostcardCanvasProps) {
  const firstPhoto = echoes.find((e) => e.type === "photo");
  const drawingEcho = echoes.find((e) => e.type === "drawing");
  const texts = echoes.filter(
    (e) => e.type === "text" || e.type === "handwriting"
  );
  const colors = design?.gradientColors?.length
    ? design.gradientColors
    : DEFAULT_GRADIENT;
  const gradientStyle =
    colors.length >= 2
      ? {
          background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2] ?? colors[1]} 100%)`,
        }
      : { background: colors[0] };

  return (
    <div
      className="paper-grain flex min-h-[400px] flex-col overflow-hidden rounded-[16px]"
      style={gradientStyle}
      role={isPreview ? "img" : undefined}
      aria-label={isPreview ? "Postcard preview" : undefined}
    >
      <div className="relative flex flex-1 flex-col overflow-auto p-8">
        {isPreview && (
          <span className="absolute right-4 top-4 rounded-[12px] bg-white/95 px-2.5 py-1.5 text-xs font-normal text-[var(--foreground-muted)]">
            Preview
          </span>
        )}

        <div className="mb-5 flex items-center justify-between">
          <span className="font-display font-medium text-[var(--foreground)]">
            {city} · {area}
          </span>
        </div>

        {firstPhoto && (
          <div className="relative mb-6 aspect-video overflow-hidden rounded-[16px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={firstPhoto.content}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {drawingEcho && drawingEcho.content && (
          <div className="relative mb-6 overflow-hidden rounded-[16px] border border-black/[0.04] shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={drawingEcho.content}
              alt="Hand-drawn sketch"
              className="w-full object-contain"
              style={{ aspectRatio: "400 / 280" }}
            />
          </div>
        )}

        <div className="space-y-4">
          {texts.map((e) => (
            <p
              key={e.id}
              className="text-lg leading-loose text-[var(--foreground-muted)]"
            >
              {e.content}
            </p>
          ))}
        </div>

        {caption && (
          <p className="mt-4 italic text-[var(--foreground-muted)]">{caption}</p>
        )}

        {locationName && (
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            {locationName}
          </p>
        )}
      </div>
    </div>
  );
}
