"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  luminous?: boolean;
}

export function GlassCard({
  children,
  className,
  onClick,
  hover = true,
  luminous = false,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      className={cn(
        "glass-card",
        luminous && "glass-card-luminous",
        hover &&
          "btn-pressable transition-all duration-300 ease-out hover:shadow-[var(--shadow-elevated)] cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
