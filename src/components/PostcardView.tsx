"use client";

import type { ReceivedPostcard } from "@/types";
import { PostcardVintage } from "./PostcardVintage";

interface PostcardViewProps {
  postcard: ReceivedPostcard;
  onSave: (id: string, saved: boolean) => void;
  onClose?: () => void;
}

export function PostcardView({ postcard, onSave, onClose }: PostcardViewProps) {
  return (
    <div className="flex min-h-[500px] flex-col gap-5">
      <div className="flex items-center justify-end gap-4">
        {onClose && (
          <button
            onClick={onClose}
            className="btn-pressable rounded-[12px] bg-white/95 px-4 py-2 text-sm font-normal text-[var(--foreground)] transition-all duration-300 ease-out hover:bg-white hover:shadow-[var(--shadow-elevated)]"
          >
            Close
          </button>
        )}
        <button
          onClick={() => onSave(postcard.id, !postcard.saved)}
          className="btn-pressable rounded-[12px] bg-white/95 px-4 py-2 text-sm font-normal text-[var(--foreground)] transition-all duration-300 ease-out hover:bg-white hover:shadow-[var(--shadow-elevated)]"
        >
          {postcard.saved ? "Unsave" : "Save"}
        </button>
      </div>
      <div className="flex w-full justify-center px-4">
        <div className="w-full max-w-[840px] shrink-0 overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(60,50,40,0.15),0_4px_12px_rgba(0,0,0,0.08)]">
          <div className="aspect-[3/2] w-full">
            <PostcardVintage
              design={postcard.design}
              echoes={postcard.echoes}
              caption={postcard.caption}
              city={postcard.city}
              area={postcard.area}
              locationName={postcard.locationName}
            />
          </div>
        </div>
      </div>
      <p className="text-xs text-[var(--foreground-muted)]">
        Received {new Date(postcard.receivedAt).toLocaleDateString()}
      </p>
    </div>
  );
}
