"use client";

import type { Echo, Postcard } from "@/types";
import { PostcardVintage } from "./PostcardVintage";

interface GeneratedPostcardViewProps {
  design: NonNullable<Postcard["design"]>;
  echoes: Echo[];
  caption?: string;
  city: string;
  area: string;
  locationName?: string;
  onSend: () => void;
  sending: boolean;
}

export function GeneratedPostcardView({
  design,
  echoes,
  caption,
  city,
  area,
  locationName,
  onSend,
  sending,
}: GeneratedPostcardViewProps) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-10 py-12">
      <h2 className="font-display text-lg font-medium text-[var(--foreground)]">
        Your generated postcard
      </h2>
      <div className="flex w-full justify-center px-4">
        <div className="w-full max-w-[840px] shrink-0 overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(60,50,40,0.15),0_4px_12px_rgba(0,0,0,0.08)]">
          <div className="aspect-[3/2] w-full">
            <PostcardVintage
              design={design}
              echoes={echoes}
              caption={caption}
              city={city}
              area={area}
              locationName={locationName}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onSend}
          disabled={sending}
          className="btn-pressable rounded-[16px] bg-[var(--foreground)] px-6 py-3 font-medium text-white transition-all duration-250 ease-out hover:opacity-90 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
        >
          {sending ? "Sending..." : "Send Postcard"}
        </button>
      </div>
    </div>
  );
}
