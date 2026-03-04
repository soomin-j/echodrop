"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { getEchoes, sendPostcard } from "@/lib/store";
import type { Echo, Postcard } from "@/types";
import { COUNTRIES, ALL_CITIES } from "@/types";
import { GlassCard } from "@/components/GlassCard";
import { PostcardCanvas } from "@/components/PostcardCanvas";
import { GeneratedPostcardView } from "@/components/GeneratedPostcardView";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { getDesignForDraft, getGeneratedPostcardDesign, MOOD_OPTIONS } from "@/lib/postcardDesign";
import { generateId } from "@/lib/utils";

export default function CreatePage() {
  const { user } = useUser();
  const router = useRouter();
  const [echoes, setEchoes] = useState<Echo[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [caption, setCaption] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [locationName, setLocationName] = useState("");
  const [mood, setMood] = useState(MOOD_OPTIONS[0]);
  const [design, setDesign] = useState<Postcard["design"] | null>(null);
  const [generatedDesign, setGeneratedDesign] = useState<Postcard["design"] | null>(null);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [drawing, setDrawing] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEchoes(getEchoes(user.id));
      setCity(user.city);
      setArea(user.area);
    }
  }, [user]);

  const cities =
    user?.country != null
      ? COUNTRIES.find((c) => c.country === user.country)?.cities ?? ALL_CITIES
      : ALL_CITIES;
  const selectedEchoes = echoes.filter((e) => selected.has(e.id));

  useEffect(() => {
    const selectedList = echoes.filter((e) => selected.has(e.id));
    if (selectedList.length === 0) {
      setDesign(null);
      return;
    }
    let cancelled = false;
    getDesignForDraft(selectedList, mood).then((d) => {
      if (!cancelled) setDesign(d);
    });
    return () => {
      cancelled = true;
    };
  }, [echoes, selected, mood]);

  const toggleEcho = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const cycleMood = useCallback(() => {
    const i = MOOD_OPTIONS.indexOf(mood);
    setMood(MOOD_OPTIONS[(i + 1) % MOOD_OPTIONS.length]);
  }, [mood]);

  const echoesForDesign =
    drawing && user
      ? [
          ...selectedEchoes,
          {
            id: "postcard-drawing",
            userId: user.id,
            type: "drawing" as const,
            content: drawing,
            createdAt: new Date().toISOString(),
          },
        ]
      : selectedEchoes;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || selectedEchoes.length === 0 || !city || !area.trim()) return;

    setGenerating(true);
    try {
      const result = await getGeneratedPostcardDesign(
        echoesForDesign,
        mood,
        undefined,
        caption || undefined
      );
      setGeneratedDesign(result);
    } finally {
      setGenerating(false);
    }
  };

  const echoesForPostcard = echoesForDesign;

  const handleSend = useCallback(async () => {
    if (!user || selectedEchoes.length === 0 || !city || !area.trim() || !generatedDesign) return;

    setSending(true);
    const postcard: Postcard = {
      id: generateId(),
      senderId: user.id,
      echoes: echoesForPostcard,
      caption: caption || undefined,
      city,
      area,
      locationName: locationName || undefined,
      design: generatedDesign,
      createdAt: new Date().toISOString(),
    };
    sendPostcard(postcard);
    setSending(false);
    setSent(true);
    setTimeout(() => router.push("/inbox"), 1500);
  }, [user, echoesForPostcard, city, area, caption, locationName, generatedDesign]);

  const canPreview = selectedEchoes.length > 0 && city.trim() !== "" && area.trim() !== "";

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-24">
        <p className="font-display text-xl font-medium text-[var(--foreground)]">
          Postcard sent
        </p>
        <p className="leading-relaxed text-[var(--foreground-muted)]">
          A stranger in {city} will receive your echo soon.
        </p>
      </div>
    );
  }

  if (generatedDesign) {
    return (
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-medium text-[var(--foreground)]">
            Create Postcard
          </h1>
          <div className="mt-12">
            <GeneratedPostcardView
              design={generatedDesign}
              echoes={echoesForPostcard}
              caption={caption || undefined}
              city={city}
              area={area}
              locationName={locationName || undefined}
              onSend={handleSend}
              sending={sending}
            />
          </div>
        </div>
        <aside
          className="w-full shrink-0 lg:sticky lg:top-6 lg:w-[380px]"
          aria-label="Generated postcard"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-2xl font-medium text-[var(--foreground)]">
          Create Postcard
        </h1>

        <form onSubmit={handleGenerate} className="mt-12 space-y-12">
          <GlassCard className="p-6 lg:p-10" hover={false} luminous>
            <h2 className="mb-6 text-sm font-normal text-[var(--foreground-muted)]">
              Select echoes from your archive
            </h2>
            {echoes.length === 0 ? (
              <p className="leading-relaxed text-[var(--foreground-muted)]">
                No echoes yet. Add some in your Archive first.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {echoes.map((echo) => (
                  <button
                    key={echo.id}
                    type="button"
                    onClick={() => toggleEcho(echo.id)}
                    className={`btn-pressable overflow-hidden rounded-[16px] border text-left transition-all duration-300 ease-out ${
                      selected.has(echo.id)
                        ? "border-black/[0.08] bg-[var(--active-bg)] shadow-[var(--active-glow)]"
                        : "border-transparent bg-white/90 text-[var(--foreground)] hover:bg-white"
                    }`}
                  >
                    {echo.type === "photo" ? (
                      <div className="aspect-video">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={echo.content}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="p-3">
                        <p className="line-clamp-3 text-sm">{echo.content}</p>
                      </div>
                    )}
                    {selected.has(echo.id) && (
                      <div className="bg-white/80 px-3 py-1.5 text-xs font-medium text-[var(--foreground-muted)]">
                        Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-6 lg:p-10" hover={false} luminous>
            <div className="space-y-6">
              <DrawingCanvas
                value={drawing}
                onChange={setDrawing}
                width={400}
                height={280}
              />
              <div>
                <label className="mb-2 block text-sm font-medium">Echo note (optional)</label>
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="A short note..."
                  className="w-full rounded-[16px] border border-black/[0.06] bg-white/95 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full rounded-[16px] border border-black/[0.06] bg-white/95 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
                >
                  <option value="">Select city</option>
                  {cities.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Area</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Gangnam, Shibuya, Brooklyn"
                  required
                  className="w-full rounded-[16px] border border-black/[0.06] bg-white/95 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Location name for receiver (optional)
                </label>
                <input
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Near the old bridge"
                  className="w-full rounded-[16px] border border-black/[0.06] bg-white/95 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
                />
              </div>
              {selectedEchoes.length > 0 && (
                <div>
                  <label className="mb-2 block text-sm font-medium">Mood</label>
                  <button
                    type="button"
                    onClick={cycleMood}
                    className="btn-pressable rounded-[16px] border border-black/[0.06] bg-white/95 px-4 py-2.5 text-sm font-medium capitalize text-[var(--foreground)] transition-all duration-300 ease-out hover:bg-white hover:shadow-[var(--shadow-elevated)]"
                  >
                    {mood} — Regenerate mood
                  </button>
                </div>
              )}
            </div>
          </GlassCard>

          <button
            type="submit"
            disabled={selectedEchoes.length === 0 || !city || !area.trim() || generating}
            className="btn-pressable w-full rounded-[16px] bg-[var(--foreground)] py-3.5 font-medium text-white transition-all duration-300 ease-out hover:opacity-90 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
          >
            {generating ? "Generating..." : "Generate Postcard"}
          </button>
        </form>
      </div>

      <aside
        className="w-full shrink-0 lg:sticky lg:top-6 lg:w-[380px]"
        aria-label="Postcard preview"
      >
        <h2 className="mb-6 text-sm font-normal text-[var(--foreground-muted)]">
          Preview
        </h2>
        {canPreview ? (
          <PostcardCanvas
            echoes={echoesForPostcard}
            caption={caption || undefined}
            city={city}
            area={area}
            locationName={locationName || undefined}
            design={design ?? undefined}
            isPreview
          />
        ) : (
          <div className="glass-card-luminous flex min-h-[400px] flex-col items-center justify-center rounded-[20px] border border-dashed border-black/[0.06] bg-white/95 p-14 text-center">
            <p className="text-[var(--foreground-muted)]">
              Select echoes and fill city & area to see preview
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
