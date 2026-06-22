"use client";

import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function StatCard({
  title,
  value,
  icon,
  trend,
  accent = "#E53935",
  subtitle,
}: {
  title: string;
  value: string;
  icon: string;
  trend?: string;
  accent?: string;
  subtitle?: string;
}) {
  const Icon = (Icons as any)[icon] ?? Icons.Circle;
  return (
    <div className="glass glass-hover rounded-2xl p-5 relative overflow-hidden group">
      <div
        className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs text-white/50 uppercase tracking-wider font-medium">{title}</p>
          <p className="text-2xl font-black mt-2 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-white/40 mt-1">{subtitle}</p>}
          {trend && (
            <p className="text-xs mt-2 inline-flex items-center gap-1 font-semibold text-green-400">
              <Icons.TrendingUp size={12} /> {trend}
            </p>
          )}
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${accent}22`, color: accent }}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: ReactNode;
}) {
  const Icon = icon ? (Icons as any)[icon] ?? Icons.Circle : null;
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-[#E53935]/15 flex items-center justify-center text-[#E53935]">
            <Icon size={20} />
          </div>
        )}
        <div>
          <h2 className="text-xl font-black tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-white/50 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "gold";
  className?: string;
}) {
  const variants: Record<string, string> = {
    default: "bg-white/10 text-white/70",
    success: "bg-green-500/15 text-green-400",
    warning: "bg-yellow-500/15 text-yellow-400",
    danger: "bg-[#E53935]/15 text-[#ff6b6b]",
    info: "bg-blue-500/15 text-blue-400",
    gold: "bg-yellow-400/15 text-yellow-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function GlassPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("glass rounded-2xl p-5", className)}>{children}</div>;
}

export function ProgressBar({
  value,
  max,
  accent = "#E53935",
  height = "h-2",
}: {
  value: number;
  max: number;
  accent?: string;
  height?: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className={cn("w-full rounded-full bg-white/10 overflow-hidden", height)}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${accent}, ${accent}cc)` }}
      />
    </div>
  );
}

export function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  const Icon = (Icons as any)[icon] ?? Icons.Circle;
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-4 text-white/40">
        <Icon size={28} />
      </div>
      <p className="font-semibold text-white/70">{title}</p>
      {subtitle && <p className="text-sm text-white/40 mt-1">{subtitle}</p>}
    </div>
  );
}
