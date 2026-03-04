import type { Echo, Postcard } from "@/types";

export const MOOD_PALETTES: Record<string, string[]> = {
  default: ["#f5f0eb", "#e8e0d5", "#ddd5c8"],
  soft: ["#f8f4f0", "#efe8e2", "#e5dcd4"],
  warm: ["#fdf3e7", "#f5e6d3", "#ecd9c4"],
  cool: ["#f0f4f8", "#e2e8ef", "#d4dce6"],
  muted: ["#e8e6e3", "#ddd9d5", "#d2cdc8"],
  joyful: ["#fef5e7", "#fdebd0", "#f9e79f"],
  nostalgic: ["#f5eef8", "#e8daef", "#d7bde2"],
  melancholic: ["#ebedef", "#d5dbdb", "#bdc3c7"],
  love: ["#fdedec", "#fadbd8", "#f5b7b1"],
  peaceful: ["#e8f6f3", "#d1f2eb", "#a3e4d7"],
};

/** Lighten and soften a hex color for pastel gradient (blend with white) */
function toPastel(hex: string, blend = 0.55): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const R = Math.round(r + (255 - r) * blend);
  const G = Math.round(g + (255 - g) * blend);
  const B = Math.round(b + (255 - b) * blend);
  return `#${R.toString(16).padStart(2, "0")}${G.toString(16).padStart(2, "0")}${B.toString(16).padStart(2, "0")}`;
}

/** Sample dominant colors from image via canvas (works with data URLs / same-origin) */
export function getDesignFromPhoto(imageUrl: string): Promise<{ gradientColors: string[] }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 64;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ gradientColors: MOOD_PALETTES.default });
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;
        const colorCounts: Record<string, number> = {};
        const step = 4;
        for (let i = 0; i < data.length; i += step * 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const key = `${Math.floor(r / 32) * 32},${Math.floor(g / 32) * 32},${Math.floor(b / 32) * 32}`;
          colorCounts[key] = (colorCounts[key] || 0) + 1;
        }
        const sorted = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([k]) => {
            const [r, g, b] = k.split(",").map(Number);
            return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
          });
        const gradientColors =
          sorted.length >= 2
            ? sorted.map((c) => toPastel(c))
            : MOOD_PALETTES.default;
        resolve({ gradientColors });
      } catch {
        resolve({ gradientColors: MOOD_PALETTES.default });
      }
    };
    img.onerror = () => resolve({ gradientColors: MOOD_PALETTES.default });
    img.src = imageUrl;
  });
}

export function getDesignFromMood(mood: string): { gradientColors: string[] } {
  const palette = MOOD_PALETTES[mood] ?? MOOD_PALETTES.default;
  return { gradientColors: palette };
}

export const MOOD_OPTIONS = Object.keys(MOOD_PALETTES);

export type PostcardDesign = NonNullable<Postcard["design"]>;

/** Extract gradient colors from drawing (base64 data URL). Same canvas approach as photos. */
export function getDesignFromDrawing(imageDataUrl: string): Promise<{ gradientColors: string[] }> {
  return getDesignFromPhoto(imageDataUrl);
}

/** Blend two color arrays by averaging corresponding hex colors */
function blendGradientColors(
  a: string[],
  b: string[],
  weightA = 0.5
): string[] {
  const len = Math.max(a.length, b.length);
  return Array.from({ length: len }, (_, i) => {
    const hexA = a[i] ?? a[0] ?? "#f5f0eb";
    const hexB = b[i] ?? b[0] ?? "#f5f0eb";
    const nA = parseInt(hexA.slice(1), 16);
    const nB = parseInt(hexB.slice(1), 16);
    const r = Math.round(((nA >> 16) & 0xff) * weightA + ((nB >> 16) & 0xff) * (1 - weightA));
    const g = Math.round(((nA >> 8) & 0xff) * weightA + ((nB >> 8) & 0xff) * (1 - weightA));
    const bVal = Math.round((nA & 0xff) * weightA + (nB & 0xff) * (1 - weightA));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bVal.toString(16).padStart(2, "0")}`;
  });
}

export async function getDesignForDraft(
  echoes: Echo[],
  mood?: string
): Promise<PostcardDesign> {
  const firstPhoto = echoes.find((e) => e.type === "photo");
  const firstDrawing = echoes.find((e) => e.type === "drawing");
  const chosenMood = mood ?? "default";
  const fallback = { ...getDesignFromMood(chosenMood), mood: chosenMood };

  if (firstPhoto?.content && firstDrawing?.content) {
    try {
      const [photoDesign, drawingDesign] = await Promise.all([
        getDesignFromPhoto(firstPhoto.content),
        getDesignFromDrawing(firstDrawing.content),
      ]);
      const gradientColors = blendGradientColors(
        photoDesign.gradientColors,
        drawingDesign.gradientColors,
        0.6
      );
      return { gradientColors, mood: chosenMood };
    } catch {
      return fallback;
    }
  }

  if (firstPhoto?.content) {
    try {
      const { gradientColors } = await getDesignFromPhoto(firstPhoto.content);
      return { gradientColors, mood: chosenMood };
    } catch {
      return fallback;
    }
  }

  if (firstDrawing?.content) {
    try {
      const { gradientColors } = await getDesignFromDrawing(firstDrawing.content);
      return { gradientColors, mood: chosenMood };
    } catch {
      return fallback;
    }
  }

  return fallback;
}

const LAYOUT_VARIANTS = ["classic", "centered", "minimal"] as const;
const TYPOGRAPHY_STYLES = ["calm", "energetic", "reflective", "default"] as const;

/** Map mood to typography style */
function moodToTypography(mood: string): (typeof TYPOGRAPHY_STYLES)[number] {
  const map: Record<string, (typeof TYPOGRAPHY_STYLES)[number]> = {
    soft: "calm",
    warm: "energetic",
    cool: "reflective",
    muted: "reflective",
    joyful: "energetic",
    nostalgic: "reflective",
    melancholic: "reflective",
    love: "calm",
    peaceful: "calm",
  };
  return map[mood] ?? "default";
}

const MOOD_KEYWORDS: Record<string, RegExp> = {
  joyful: /\b(happy|joy|excited|celebrate|amazing|love it|wow|awesome|fantastic|great day|sunshine)\b/i,
  nostalgic: /\b(remember|memories|back then|used to|childhood|miss|old days|past)\b/i,
  melancholic: /\b(sad|miss|lonely|empty|grey|rain|tired|heavy|quiet|alone)\b/i,
  love: /\b(love|heart|dear|beloved|sweet|adore|forever|together)\b/i,
  peaceful: /\b(calm|peace|serene|quiet|still|gentle|soft|tranquil|rest)\b/i,
};

/** Infer mood from caption + text/handwriting echoes. Returns mood key or null. */
function inferMoodFromNotes(caption: string, textEchoes: Echo[]): string | null {
  const text = [caption, ...textEchoes.map((e) => e.content)].join(" ");
  if (!text.trim()) return null;
  for (const [mood, re] of Object.entries(MOOD_KEYWORDS)) {
    if (re.test(text)) return mood;
  }
  const hasExclamation = /!+/.test(text);
  const hasEllipsis = /\.{2,}/.test(text);
  const reflectiveWords = /\b(maybe|perhaps|wonder|feel|thought|remember)\b/i;
  if (hasExclamation && !/\?+/.test(text)) return "joyful";
  if (reflectiveWords.test(text) || hasEllipsis) return "nostalgic";
  return null;
}

/** Typography from notes when no explicit mood inferred */
function inferTypographyFromNotes(
  caption: string,
  textEchoes: Echo[]
): (typeof TYPOGRAPHY_STYLES)[number] | null {
  const mood = inferMoodFromNotes(caption, textEchoes);
  return mood ? moodToTypography(mood) : null;
}

/** Seeded random for deterministic variation */
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/** Generate gradient mesh colors (subtle overlay colors from base) */
function generateMeshColors(
  baseColors: string[],
  seed: number
): string[] {
  const rng = seededRandom(seed);
  return baseColors.map((hex) => {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 0xff;
    const g = (n >> 8) & 0xff;
    const b = n & 0xff;
    const shift = Math.round((rng() - 0.5) * 40);
    const R = Math.max(0, Math.min(255, r + shift));
    const G = Math.max(0, Math.min(255, g + shift));
    const B = Math.max(0, Math.min(255, b + shift));
    return `#${R.toString(16).padStart(2, "0")}${G.toString(16).padStart(2, "0")}${B.toString(16).padStart(2, "0")}`;
  });
}

/** Generate synthetic waveform bars for audio visualization */
function generateWaveformBars(seed: number, count = 12): number[] {
  const rng = seededRandom(seed);
  return Array.from({ length: count }, () => 0.3 + rng() * 0.7);
}

/**
 * Full AI-generated postcard design with layout, typography, mesh, waveform.
 * Use seed for Regenerate to produce variation.
 */
export async function getGeneratedPostcardDesign(
  echoes: Echo[],
  mood?: string,
  seed?: number,
  caption?: string
): Promise<PostcardDesign> {
  const chosenMood = mood ?? "default";
  const effectiveSeed = seed ?? Date.now() + Math.random() * 1000;
  const rng = seededRandom(Math.floor(effectiveSeed));

  const baseDesign = await getDesignForDraft(echoes, chosenMood);
  let gradientColors = baseDesign.gradientColors ?? MOOD_PALETTES.default;

  const textEchoes = echoes.filter(
    (e) => e.type === "text" || e.type === "handwriting"
  );
  const inferredMood = inferMoodFromNotes(caption ?? "", textEchoes);
  if (inferredMood && MOOD_PALETTES[inferredMood]) {
    gradientColors = blendGradientColors(
      gradientColors,
      MOOD_PALETTES[inferredMood],
      0.7
    );
  }

  const layoutVariant =
    LAYOUT_VARIANTS[Math.floor(rng() * LAYOUT_VARIANTS.length)];
  const typographyStyle =
    inferTypographyFromNotes(caption ?? "", textEchoes) ??
    moodToTypography(chosenMood);

  const gradientMesh = generateMeshColors(gradientColors, effectiveSeed + 1);

  const audioEcho = echoes.find((e) => e.type === "audio" && e.content);
  const waveformBars = audioEcho
    ? generateWaveformBars(effectiveSeed + 2)
    : undefined;

  return {
    gradientColors,
    mood: chosenMood,
    layoutVariant,
    typographyStyle,
    gradientMesh,
    waveformBars,
  };
}
