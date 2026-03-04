"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, Inbox, LogOut, PenSquare, Send } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/inbox", label: "Arrivals", icon: Inbox },
  { href: "/sent", label: "Released", icon: Send },
  { href: "/archive", label: "Archive", icon: Archive },
  { href: "/create", label: "Create", icon: PenSquare },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useUser();

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
          <div className="rounded-[12px] bg-white/95 px-3 py-2 text-sm backdrop-blur-sm">
            {user.country && (
              <span className="text-[var(--foreground-muted)]">{user.country}</span>
            )}
            <p className="font-display font-normal">{user.city}</p>
            <p className="text-xs text-[var(--foreground-muted)]">{user.area}</p>
          </div>
          <button
            onClick={signOut}
            className="btn-pressable flex w-full items-center gap-3 rounded-[16px] border border-black/[0.06] px-3 py-2 text-left text-sm text-[var(--foreground-muted)] transition-all duration-300 ease-out hover:bg-white/95 hover:shadow-[var(--shadow-elevated)] hover:text-[var(--foreground)]"
          >
            <LogOut className="size-4 shrink-0" strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
