"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { getReceivedPostcards, savePostcard } from "@/lib/store";
import type { ReceivedPostcard } from "@/types";
import { GlassCard } from "@/components/GlassCard";
import { PostcardView } from "@/components/PostcardView";

export default function InboxPage() {
  const { user } = useUser();
  const [postcards, setPostcards] = useState<ReceivedPostcard[]>([]);
  const [selected, setSelected] = useState<ReceivedPostcard | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (user) {
      setPostcards(getReceivedPostcards(user.id));
    }
  }, [user]);

  const filtered =
    filter === "all"
      ? postcards
      : postcards.filter((p) => p.echoes.some((e) => e.metadata?.tags?.includes(filter)));

  const handleSave = (id: string, saved: boolean) => {
    if (!user) return;
    savePostcard(user.id, id, saved);
    setPostcards(getReceivedPostcards(user.id));
    if (selected?.id === id) setSelected((s) => (s ? { ...s, saved } : null));
  };

  return (
    <div className="flex h-full gap-10">
      <div className="flex w-80 flex-shrink-0 flex-col gap-6">
        <h1 className="font-display text-2xl font-medium text-[var(--foreground)]">Arrivals</h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`btn-pressable rounded-[12px] px-3 py-2 text-sm font-medium transition-all duration-300 ease-out ${
              filter === "all"
                ? "bg-[var(--active-bg)] text-[var(--foreground)] shadow-[var(--active-glow)] hover:shadow-[var(--shadow-elevated)]"
                : "bg-white/90 text-[var(--foreground-muted)] hover:bg-white hover:shadow-[var(--shadow-elevated)] hover:text-[var(--foreground)]"
            }`}
          >
            All
          </button>
          {["quiet", "busy", "reflective", "golden hour"].map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`btn-pressable rounded-[12px] px-3 py-2 text-sm font-medium transition-all duration-300 ease-out ${
                filter === tag
                  ? "bg-[var(--active-bg)] text-[var(--foreground)] shadow-[var(--active-glow)] hover:shadow-[var(--shadow-elevated)]"
                  : "bg-white/90 text-[var(--foreground-muted)] hover:bg-white hover:shadow-[var(--shadow-elevated)] hover:text-[var(--foreground)]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-4 overflow-auto">
          {filtered.map((p) => (
            <GlassCard
              key={p.id}
              hover
              onClick={() => setSelected(p)}
              className={`p-3 transition-all duration-300 ${selected?.id === p.id ? "glass-card-active !bg-[var(--active-bg)]" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="truncate text-sm font-medium">
                  {p.city} · {p.area}
                </span>
                {p.saved && (
                  <span className="text-xs text-[var(--foreground-muted)]">Saved</span>
                )}
              </div>
              <p className="mt-1 truncate text-xs text-[var(--foreground-muted)]">
                {new Date(p.receivedAt).toLocaleDateString()}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        {selected ? (
          <PostcardView postcard={selected} onSave={handleSave} onClose={() => setSelected(null)} />
        ) : (
          <div className="glass-card-luminous flex h-96 items-center justify-center rounded-[20px] border border-dashed border-black/[0.06] bg-white/95 shadow-[var(--shadow-soft)]">
            <p className="text-[var(--foreground-muted)]">
              {postcards.length === 0
                ? "No postcards yet. Create one and send it to your city."
                : "Select a postcard to view"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
