"use client";

import { useStore } from "@/lib/store";
import { formatMoney, formatNumber } from "@/lib/helpers";
import { StatCard, SectionHeader, Badge, GlassPanel, ProgressBar } from "./ui";
import * as Icons from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { earningsChart, leaderboard, levelConfig } from "@/lib/data";
import { toast } from "sonner";

export function DashboardView() {
  const { user, activities, setView, addBalance, addActivity } = useStore();
  const level = levelConfig[user.level];
  const levels = Object.keys(levelConfig);
  const nextLevelIdx = Math.min(levels.indexOf(user.level) + 1, levels.length - 1);
  const nextLevel = levels[nextLevelIdx];

  const claimDaily = () => {
    const reward = 2.5 + user.dailyStreak * 0.5;
    addBalance(reward);
    addActivity({
      type: "bonus",
      title: `Daily streak bonus (Day ${user.dailyStreak + 1})`,
      amount: reward,
      status: "completed",
    });
    useStore.getState().claimDailyStreak();
    toast.success(`+${formatMoney(reward)} claimed!`, {
      description: `Day ${user.dailyStreak + 1} streak bonus. Come back tomorrow!`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="glass-strong rounded-3xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#E53935]/15 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold">
                <Icons.Crown size={10} /> {user.level} Member
              </Badge>
              <Badge variant="success">
                <Icons.Check size={10} /> Verified
              </Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
              Welcome back, <span className="text-gradient-red">{user.name.split(" ")[0]}</span> 👋
            </h1>
            <p className="text-white/60 mt-1 text-sm">
              You're <span className="font-bold text-white">{formatNumber(user.xpToNext - user.xp)} XP</span> away from{" "}
              <span style={{ color: levelConfig[nextLevel].color }}>{nextLevel}</span> level.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <button
                onClick={claimDaily}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E53935] to-[#ff5a56] text-white font-bold text-sm hover:scale-105 transition-transform accent-glow"
              >
                <Icons.Gift size={16} /> Claim Daily Bonus
              </button>
              <button
                onClick={() => setView("offerwall")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass hover:bg-white/10 text-white font-bold text-sm transition-colors"
              >
                <Icons.Store size={16} /> Browse Offers
              </button>
            </div>
          </div>
          <div className="glass rounded-2xl p-5 lg:min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icons.Flame size={18} className="text-yellow-400" />
                <span className="font-bold text-sm">Daily Streak</span>
              </div>
              <span className="font-black text-2xl text-yellow-400">{user.dailyStreak}</span>
            </div>
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    i < user.dailyStreak % 7
                      ? "bg-gradient-to-b from-yellow-400 to-orange-500 text-black"
                      : "bg-white/5 text-white/30"
                  }`}
                >
                  {i < user.dailyStreak % 7 ? "✓" : i + 1}
                </div>
              ))}
            </div>
            <p className="text-xs text-white/50">
              Day {(user.dailyStreak % 7) + 1} of 7 • Next milestone: 7-day bonus
            </p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Current Balance" value={formatMoney(user.currentBalance)} icon="Wallet" accent="#E53935" trend="+12.5% this week" />
        <StatCard title="Pending Balance" value={formatMoney(user.pendingBalance)} icon="Clock" accent="#F59E0B" subtitle="From 4 offers" />
        <StatCard title="Total Earnings" value={formatMoney(user.totalEarnings)} icon="TrendingUp" accent="#22C55E" trend="+$842 this month" />
        <StatCard title="Referral Earnings" value={formatMoney(user.referralEarnings)} icon="Users" accent="#8B5CF6" trend="28 active refs" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Earnings chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <SectionHeader
            title="Earnings Overview"
            subtitle="Your daily earnings for the past week"
            icon="TrendingUp"
            action={
              <div className="flex gap-2">
                {["7D", "30D", "All"].map((p, i) => (
                  <button
                    key={p}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      i === 0 ? "bg-[#E53935] text-white" : "glass text-white/60 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            }
          />
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={earningsChart} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E53935" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#E53935" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(8,27,51,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: "#fff",
                }}
                formatter={(v: number) => [formatMoney(v), "Earnings"]}
              />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#E53935"
                strokeWidth={2.5}
                fill="url(#earnGrad)"
                dot={{ fill: "#E53935", r: 3 }}
                activeDot={{ r: 6, fill: "#ff5a56" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Level progress */}
        <div className="glass rounded-2xl p-5">
          <SectionHeader title="Level Progress" icon="Crown" />
          <div className="text-center py-2">
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-black mb-3 relative"
              style={{ background: `${level.color}22`, color: level.color, boxShadow: `0 0 30px ${level.color}40` }}
            >
              <Icons.Crown size={32} />
            </div>
            <p className="font-black text-lg" style={{ color: level.color }}>
              {user.level}
            </p>
            <p className="text-xs text-white/50 mt-1">{formatNumber(user.xp)} / {formatNumber(user.xpToNext)} XP</p>
            <div className="mt-4">
              <ProgressBar value={user.xp} max={user.xpToNext} accent={level.color} height="h-2.5" />
            </div>
            <p className="text-xs text-white/50 mt-2">
              {formatNumber(user.xpToNext - user.xp)} XP to <span style={{ color: levelConfig[nextLevel].color }}>{nextLevel}</span>
            </p>
          </div>
          <div className="mt-5 space-y-2">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">Current Perks</p>
            {level.perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-xs text-white/70">
                <Icons.Check size={12} className="text-green-400 shrink-0" /> {perk}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <SectionHeader
            title="Recent Activity"
            subtitle="Your latest earnings and transactions"
            icon="Activity"
            action={
              <button onClick={() => setView("history")} className="text-xs text-[#E53935] font-semibold hover:underline">
                View all
              </button>
            }
          />
          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-gpt pr-1">
            {activities.slice(0, 8).map((a) => {
              const cfg: Record<string, { icon: string; color: string }> = {
                offer: { icon: "Store", color: "#3B82F6" },
                survey: { icon: "ClipboardList", color: "#22D3EE" },
                referral: { icon: "Users", color: "#8B5CF6" },
                bonus: { icon: "Gift", color: "#22C55E" },
                withdrawal: { icon: "ArrowUpFromLine", color: "#F59E0B" },
                deposit: { icon: "ArrowDownToLine", color: "#22C55E" },
              };
              const { icon, color } = cfg[a.type];
              const Icon = (Icons as any)[icon];
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-3 p-3 rounded-xl glass glass-hover"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${color}22`, color }}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{a.title}</p>
                    <p className="text-xs text-white/40">{a.timestamp}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`font-black text-sm ${
                        a.amount < 0 ? "text-[#E53935]" : "text-green-400"
                      }`}
                    >
                      {a.amount < 0 ? "" : "+"}
                      {formatMoney(a.amount)}
                    </p>
                    <Badge
                      variant={
                        a.status === "completed"
                          ? "success"
                          : a.status === "pending"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {a.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leaderboard preview */}
        <div className="glass rounded-2xl p-5">
          <SectionHeader
            title="Top Earners"
            icon="Trophy"
            action={
              <button onClick={() => setView("leaderboard")} className="text-xs text-[#E53935] font-semibold hover:underline">
                View all
              </button>
            }
          />
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((entry, i) => (
              <div
                key={entry.id}
                className={`flex items-center gap-3 p-2.5 rounded-xl ${
                  entry.isCurrentUser ? "bg-[#E53935]/15 border border-[#E53935]/30" : "glass"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                    i === 0
                      ? "bg-yellow-400/20 text-yellow-400"
                      : i === 1
                      ? "bg-gray-300/20 text-gray-300"
                      : i === 2
                      ? "bg-orange-700/30 text-orange-500"
                      : "bg-white/5 text-white/50"
                  }`}
                >
                  {i + 1}
                </div>
                <img src={entry.avatar} alt={entry.name} className="w-7 h-7 rounded-full bg-white/10" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate">{entry.name}</p>
                  <p className="text-[10px] text-white/40">{entry.country}</p>
                </div>
                <p className="text-xs font-black text-green-400">{formatMoney(entry.earnings)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lifetime withdrawals + offers bar */}
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassPanel>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider font-medium">Lifetime Withdrawals</p>
              <p className="text-3xl font-black mt-1">{formatMoney(user.lifetimeWithdrawals)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#E53935]/15 flex items-center justify-center text-[#E53935]">
              <Icons.ArrowUpFromLine size={22} />
            </div>
          </div>
          <button
            onClick={() => setView("withdraw")}
            className="w-full py-2.5 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white font-bold text-sm transition-colors"
          >
            Withdraw Funds
          </button>
        </GlassPanel>
        <GlassPanel>
          <SectionHeader title="Offers Completed" icon="Store" />
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={earningsChart}>
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                contentStyle={{ background: "rgba(8,27,51,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }}
              />
              <Bar dataKey="offers" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassPanel>
      </div>
    </div>
  );
}
