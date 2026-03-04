"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/inbox");
  }, [user, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 py-16 px-12">
      <h1 className="font-display text-2xl font-medium text-[var(--foreground)]">EchoDrop</h1>
      <p className="leading-relaxed text-[var(--foreground-muted)]">Sensory digital postcards for your city</p>
      <Link
        href="/onboarding"
        className="btn-pressable inline-block rounded-[16px] bg-[var(--foreground)] px-6 py-3.5 font-medium text-white transition-all duration-300 ease-out hover:opacity-90"
      >
        Get started
      </Link>
    </div>
  );
}
