"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { GlassCard } from "@/components/GlassCard";
import { COUNTRIES } from "@/types";

export default function OnboardingPage() {
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const { signIn, user } = useUser();
  const router = useRouter();

  const cities = COUNTRIES.find((c) => c.country === country)?.cities ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !country || !city || !area.trim()) return;
    signIn(email.trim(), country, city, area.trim());
    router.replace("/inbox");
  };

  if (user) {
    router.replace("/inbox");
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center py-14 px-10 sm:py-20 sm:px-14">
      <div className="w-full max-w-md">
        <h1 className="mb-5 font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          EchoDrop
        </h1>
        <p className="mb-14 leading-relaxed text-[var(--foreground-muted)]">
          Share your wandering moments with strangers in your city.
        </p>

        <GlassCard className="p-8" hover={false} luminous>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground-muted)]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-[16px] border border-black/[0.06] bg-white/95 px-4 py-3 placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground-muted)]">
                Country
              </label>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setCity("");
                }}
                required
                className="w-full rounded-[16px] border border-black/[0.06] bg-white/95 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
              >
                <option value="">Select country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.country} value={c.country}>
                    {c.country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground-muted)]">
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={!country}
                className="w-full rounded-[16px] border border-black/[0.06] bg-white/95 px-4 py-3 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
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
              <label className="mb-2 block text-sm font-medium text-[var(--foreground-muted)]">
                Area
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Gangnam, Shibuya, Brooklyn"
                required
                className="w-full rounded-[16px] border border-black/[0.06] bg-white/95 px-4 py-3 placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
              />
            </div>

            <button
              type="submit"
              className="btn-pressable w-full rounded-[16px] bg-[var(--foreground)] py-3.5 font-medium text-white transition-all duration-300 ease-out hover:opacity-90"
            >
              Continue
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
