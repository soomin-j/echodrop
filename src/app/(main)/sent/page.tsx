"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { getSentPostcards } from "@/lib/store";
import type { Postcard } from "@/types";
import { GlassCard } from "@/components/GlassCard";
import { PostcardVintage } from "@/components/PostcardVintage";

export default function SentPage() {
  const { user } = useUser();
  const [postcards, setPostcards] = useState<Postcard[]>([]);
  const [selected, setSelected] = useState<Postcard | null>(null);

  useEffect(() => {
    if (user) {
      setPostcards(getSentPostcards(user.id));
    }
  }, [user]);

  return (
    <div className="flex h-full gap-10">
      <div className="flex w-80 flex-shrink-0 flex-col gap-6">
        <h1 className="font-display text-2xl font-medium text-[var(--foreground)]">
          My postcards
        </h1>
        <div className="flex flex-col gap-4 overflow-auto">
          {postcards.map((p) => (
            <GlassCard
              key={p.id}
              hover
              onClick={() => setSelected(p)}
              className={`p-3 transition-all duration-300 ${selected?.id === p.id ? "glass-card-active !bg-[var(--active-bg)]" : ""}`}
            >
              <span className="truncate text-sm font-medium">
                {p.city} · {p.area}
              </span>
              <p className="mt-1 truncate text-xs text-[var(--foreground-muted)]">
                {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        {selected ? (
          <div className="flex min-h-[500px] flex-col gap-5">
            <div className="flex w-full justify-center px-4">
              <div className="w-full max-w-[840px] shrink-0 overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(60,50,40,0.15),0_4px_12px_rgba(0,0,0,0.08)]">
                <div className="aspect-[3/2] w-full">
                  <PostcardVintage
                    design={selected.design}
                    echoes={selected.echoes}
                    caption={selected.caption}
                    city={selected.city}
                    area={selected.area}
                    locationName={selected.locationName}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-[var(--foreground-muted)]">
              Sent {new Date(selected.createdAt).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <div className="glass-card-luminous flex h-96 items-center justify-center rounded-[20px] border border-dashed border-black/[0.06] bg-white/95 shadow-[var(--shadow-soft)]">
            <p className="text-[var(--foreground-muted)]">
              {postcards.length === 0
                ? "No postcards sent yet. Create one to get started."
                : "Select a postcard to view"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
