"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { getEchoes, addEcho, deleteEcho, updateEcho } from "@/lib/store";
import type { Echo, EchoType } from "@/types";
import { GlassCard } from "@/components/GlassCard";
import { generateId } from "@/lib/utils";

export default function ArchivePage() {
  const { user } = useUser();
  const [echoes, setEchoes] = useState<Echo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<EchoType>("text");
  const [content, setContent] = useState("");
  const [caption, setCaption] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (user) setEchoes(getEchoes(user.id));
  }, [user]);

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(reader.result as string);
    reader.readAsDataURL(file);
    setType("photo");
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("Audio selected:", file);
    // TODO: integrate into archive state later
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload: Echo = {
      id: generateId(),
      userId: user.id,
      type,
      content: type === "photo" && photoDataUrl ? photoDataUrl : content,
      caption: caption || undefined,
      createdAt: new Date().toISOString(),
    };

    addEcho(payload);
    setEchoes(getEchoes(user.id));
    setShowForm(false);
    setContent("");
    setCaption("");
    setPhotoDataUrl(null);
    setType("text");
  };

  const handleDelete = (echoId: string) => {
    if (!user) return;
    deleteEcho(user.id, echoId);
    setEchoes(getEchoes(user.id));
    if (editingId === echoId) setEditingId(null);
  };

  const handleEditStart = (echo: Echo) => {
    setEditingId(echo.id);
    setEditContent(echo.type === "text" || echo.type === "handwriting" ? echo.content : "");
    setEditCaption(echo.caption ?? "");
  };

  const handleEditSave = () => {
    if (!user || !editingId) return;
    const echo = echoes.find((e) => e.id === editingId);
    if (!echo) return;
    updateEcho(user.id, editingId, {
      ...((echo.type === "text" || echo.type === "handwriting") && { content: editContent }),
      caption: editCaption || undefined,
    });
    setEchoes(getEchoes(user.id));
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent("");
    setEditCaption("");
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-[var(--foreground)]">Archive</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn-pressable rounded-[16px] px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-out ${
            showForm
              ? "border border-black/[0.06] bg-white/95 text-[var(--foreground)] hover:bg-white hover:shadow-[var(--shadow-elevated)]"
              : "border border-transparent bg-[var(--foreground)] text-white hover:opacity-90"
          }`}
        >
          {showForm ? "Cancel" : "Add Echo"}
        </button>
      </div>

      {showForm && (
        <GlassCard className="p-6" hover={false} luminous>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Type</label>
              <div className="flex gap-2">
                {(["text", "photo"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setType(t);
                      if (t === "photo") fileInputRef.current?.click();
                      else setPhotoDataUrl(null);
                    }}
                    className={`btn-pressable rounded-[12px] px-3 py-2 text-sm font-medium transition-all duration-300 ease-out ${
                      type === t
                        ? "bg-[var(--active-bg)] text-[var(--foreground)] shadow-[var(--active-glow)] hover:shadow-[var(--shadow-elevated)]"
                        : "bg-white/90 text-[var(--foreground-muted)] hover:bg-white hover:shadow-[var(--shadow-elevated)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAddPhoto}
                />
                <button
                  type="button"
                  onClick={() => audioInputRef.current?.click()}
                  className="btn-pressable rounded-[12px] px-3 py-2 text-sm font-medium transition-all duration-300 ease-out bg-white/90 text-[var(--foreground-muted)] hover:bg-white hover:shadow-[var(--shadow-elevated)] hover:text-[var(--foreground)]"
                >
                  ambient
                </button>
                <input
                  type="file"
                  accept="audio/*"
                  ref={audioInputRef}
                  className="hidden"
                  onChange={handleAudioUpload}
                />
              </div>
            </div>

            {type === "photo" && photoDataUrl && (
              <div className="relative aspect-video w-48 overflow-hidden rounded-[12px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoDataUrl} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoDataUrl(null)}
                  className="btn-pressable absolute right-2 top-2 rounded-[12px] bg-white/95 px-2 py-1 text-xs text-[var(--foreground)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:bg-white hover:shadow-[var(--shadow-elevated)]"
                >
                  Remove
                </button>
              </div>
            )}

            {type === "text" && (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="A poem, a note, a fragment..."
                rows={4}
                required={type === "text"}
                className="w-full rounded-[16px] border border-black/[0.06] bg-white/95 p-3 placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
              />
            )}

            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Optional caption"
                className="w-full rounded-[16px] border border-black/[0.06] bg-white/95 px-3 py-2 text-sm placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
            />

            <button
              type="submit"
              disabled={(type === "text" && !content.trim()) || (type === "photo" && !photoDataUrl)}
              className="btn-pressable rounded-[16px] bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 ease-out hover:opacity-90 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
            >
              Add to Archive
            </button>
          </form>
        </GlassCard>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {echoes.map((echo) => (
          <GlassCard key={echo.id} className="group relative overflow-hidden p-4" hover={false}>
            {editingId === echo.id ? (
              <div className="space-y-3">
                {(echo.type === "text" || echo.type === "handwriting") && (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Content..."
                    rows={4}
                    className="w-full rounded-[12px] border border-black/[0.06] bg-white/95 p-2 text-sm placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
                  />
                )}
                {echo.type === "photo" && (
                  <div className="aspect-square overflow-hidden rounded-[12px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={echo.content}
                      alt={echo.caption ?? ""}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <input
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  placeholder="Caption (optional)"
                  className="w-full rounded-[12px] border border-black/[0.06] bg-white/95 px-2 py-1.5 text-sm placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEditSave}
                    className="btn-pressable rounded-[12px] bg-[var(--foreground)] px-2 py-1.5 text-xs font-medium text-white hover:opacity-90"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="btn-pressable rounded-[12px] border border-black/[0.06] bg-white/95 px-2 py-1.5 text-xs font-medium text-[var(--foreground)] hover:bg-white hover:shadow-[var(--shadow-elevated)]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {echo.type === "photo" ? (
                  <div className="aspect-square overflow-hidden rounded-[12px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={echo.content}
                      alt={echo.caption ?? ""}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <p className="line-clamp-4 text-sm">{echo.content}</p>
                )}
                {echo.caption && (
                  <p className="mt-2 text-xs text-[var(--foreground-muted)]">{echo.caption}</p>
                )}
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <button
                    onClick={() => handleEditStart(echo)}
                    className="btn-pressable flex items-center gap-1 rounded-[12px] bg-white/95 px-2 py-1 text-xs text-[var(--foreground)] shadow-[var(--shadow-soft)] hover:bg-white hover:shadow-[var(--shadow-elevated)]"
                  >
                    <Pencil className="size-3" strokeWidth={1.5} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(echo.id)}
                    className="btn-pressable rounded-[12px] bg-white/95 px-2 py-1 text-xs text-[var(--foreground)] shadow-[var(--shadow-soft)] hover:bg-white hover:shadow-[var(--shadow-elevated)]"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </GlassCard>
        ))}
      </div>

      {echoes.length === 0 && !showForm && (
        <div className="glass-card-luminous flex h-64 items-center justify-center rounded-[20px] border border-dashed border-black/[0.06] bg-white/95 shadow-[var(--shadow-soft)]">
          <p className="text-[var(--foreground-muted)]">No echoes yet. Add your first one.</p>
        </div>
      )}
    </div>
  );
}
