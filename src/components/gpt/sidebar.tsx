"use client";

import { useStore } from "@/lib/store";
import { NAV_ITEMS } from "@/lib/helpers";
import type { ViewId } from "@/lib/types";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { levelConfig } from "@/lib/data";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  LayoutDashboard: Icons.LayoutDashboard,
  Store: Icons.Store,
  ClipboardList: Icons.ClipboardList,
  Gift: Icons.Gift,
  Users: Icons.Users,
  Trophy: Icons.Trophy,
  Award: Icons.Award,
  Ticket: Icons.Ticket,
  History: Icons.History,
  ArrowDownToLine: Icons.ArrowDownToLine,
  ArrowUpFromLine: Icons.ArrowUpFromLine,
  LifeBuoy: Icons.LifeBuoy,
  Bell: Icons.Bell,
  ShieldCheck: Icons.ShieldCheck,
};

export function Sidebar() {
  const { currentView, setView, user, mobileNavOpen, setMobileNavOpen } = useStore();
  const level = levelConfig[user.level];

  return (
    <>
      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 z-50 h-screen w-72 shrink-0 flex flex-col transition-transform duration-300",
          "glass-strong border-r border-white/8",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ background: "linear-gradient(180deg, rgba(8,27,51,0.95), rgba(10,18,36,0.95))" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/8">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E53935] to-[#ff6b6b] flex items-center justify-center font-black text-white text-lg shadow-lg accent-glow">
              R
            </div>
            <div className="absolute -inset-1 rounded-xl bg-[#E53935]/30 blur-md -z-10" />
          </div>
          <div>
            <h1 className="font-black text-lg leading-none tracking-tight">
              Reward<span className="text-gradient-red">Hive</span>
            </h1>
            <p className="text-[10px] text-white/50 mt-1 tracking-widest uppercase">GPT Offerwall</p>
          </div>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="ml-auto lg:hidden text-white/60 hover:text-white"
          >
            <Icons.X size={20} />
          </button>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-b border-white/8">
          <div className="glass rounded-2xl p-3 flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-white/10" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${level.color}22`, color: level.color }}
                >
                  <Icons.Crown size={9} /> {user.level}
                </span>
                <span className="text-[10px] text-white/40">#{user.rank}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 px-1">
            <div className="flex justify-between text-[10px] text-white/50 mb-1">
              <span>{user.xp.toLocaleString()} XP</span>
              <span>{user.xpToNext.toLocaleString()}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#E53935] to-[#ff8a80]"
                style={{ width: `${(user.xp / user.xpToNext) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-gpt px-3 py-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon] ?? Icons.Circle;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewId)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  active
                    ? "bg-gradient-to-r from-[#E53935]/20 to-transparent text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[#E53935]" />
                )}
                <Icon size={18} className={active ? "text-[#E53935]" : ""} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#E53935] text-white pulse-red">
                    {item.badge}
                  </span>
                )}
                {item.id === "notifications" && <NotifDot />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/8">
          <div className="glass rounded-2xl p-3">
            <div className="flex items-center gap-2 text-xs text-white/70 mb-2">
              <Icons.Zap size={14} className="text-yellow-400" />
              <span className="font-semibold">Daily Streak</span>
              <span className="ml-auto font-black text-yellow-400">{user.dailyStreak} 🔥</span>
            </div>
            <button
              onClick={() => setView("bonuses")}
              className="w-full text-xs font-semibold py-2 rounded-lg bg-[#E53935] hover:bg-[#ff5a56] text-white transition-colors"
            >
              Claim Bonus
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function NotifDot() {
  const unread = useStore((s) => s.notifications.filter((n) => !n.read).length);
  if (unread === 0) return null;
  return (
    <span className="text-[9px] font-black min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-[#E53935] text-white">
      {unread}
    </span>
  );
}
