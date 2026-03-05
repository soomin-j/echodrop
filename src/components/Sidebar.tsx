"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, Inbox, LogOut, PenSquare, Send } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/types";

const navItems = [
  { href: "/inbox", label: "Arrivals", icon: Inbox },
  { href: "/sent", label: "Released", icon: Send },
  { href: "/archive", label: "Archive", icon: Archive },
  { href: "/create", label: "Create", icon: PenSquare },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut, updateLocation } = useUser();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editCountry, setEditCountry] = useState(user?.country ?? "");
  const [editCity, setEditCity] = useState(user?.city ?? "");
  const [editArea, setEditArea] = useState(user?.area ?? "");

  const cities = COUNTRIES.find((c) => c.country === editCountry)?.cities ?? [];

  const handleOpenLocationModal = () => {
    setEditCountry(user?.country ?? "");
    setEditCity(user?.city ?? "");
    setEditArea(user?.area ?? "");
    setShowLocationModal(true);
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCountry || !editCity || !editArea.trim()) return;
    updateLocation(editCountry, editCity, editArea.trim());
    setShowLocationModal(false);
  };

  return (
    <aside className="flex h-full w-56 flex-shrink-0 flex-col gap-6 p-8 pt-10">
      <div className="font-display text-xl font-semibold tracking-tight text-[var(--foreground)]">
        EchoDrop
      </div>

      <nav className="flex flex-col gap-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <GlassCard
              hover
              className={cn(
                "rounded-[22px] px-4 py-3 font-normal transition-all duration-250 ease-out",
                pathname === href
                  ? "nav-button-active"
                  : "text-[var(--foreground-muted)] hover:bg-white hover:text-[var(--foreground)]"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-4 shrink-0" strokeWidth={1.5} />
                {label}
              </span>
            </GlassCard>
          </Link>
        ))}
      </nav>

      {user && (
        <div className="mt-auto space-y-3 pt-4">
          <button
            type="button"
            onClick={handleOpenLocationModal}
            className="btn-pressable w-full rounded-[12px] bg-white/95 px-3 py-2 text-left text-sm backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-[var(--shadow-elevated)]"
          >
            {user.country && (
              <span className="text-[var(--foreground-muted)]">{user.country}</span>
            )}
            <p className="font-display font-normal">{user.city}</p>
            <p className="text-xs text-[var(--foreground-muted)]">{user.area}</p>
          </button>
          <button
            onClick={signOut}
            className="btn-pressable flex w-full items-center gap-3 rounded-[16px] border border-black/[0.06] px-3 py-2 text-left text-sm text-[var(--foreground-muted)] transition-all duration-300 ease-out hover:bg-white/95 hover:shadow-[var(--shadow-elevated)] hover:text-[var(--foreground)]"
          >
            <LogOut className="size-4 shrink-0" strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      )}

      {/* Location change modal */}
      {showLocationModal && user && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setShowLocationModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 font-display text-lg font-medium text-[var(--foreground)]">
              Change location
            </h3>
            <form onSubmit={handleSaveLocation} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--foreground-muted)]">
                  Country
                </label>
                <select
                  value={editCountry}
                  onChange={(e) => {
                    setEditCountry(e.target.value);
                    setEditCity("");
                  }}
                  required
                  className="w-full rounded-[12px] border border-black/[0.08] bg-white/95 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
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
                <label className="mb-1.5 block text-xs font-medium text-[var(--foreground-muted)]">
                  City
                </label>
                <select
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  required
                  disabled={!editCountry}
                  className="w-full rounded-[12px] border border-black/[0.08] bg-white/95 px-3 py-2 text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
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
                <label className="mb-1.5 block text-xs font-medium text-[var(--foreground-muted)]">
                  Area
                </label>
                <input
                  type="text"
                  value={editArea}
                  onChange={(e) => setEditArea(e.target.value)}
                  placeholder="e.g. Gangnam, Soho"
                  required
                  className="w-full rounded-[12px] border border-black/[0.08] bg-white/95 px-3 py-2 text-sm placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-black/[0.06]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="btn-pressable flex-1 rounded-[12px] bg-[var(--foreground)] py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="btn-pressable rounded-[12px] border border-black/[0.08] bg-white/95 px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-white hover:shadow-[var(--shadow-elevated)]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}
