"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { leaderboard, achievements, contests } from "@/lib/data";
import { SectionHeader, Badge, GlassPanel, ProgressBar, EmptyState } from "./ui";
import * as Icons from "lucide-react";
import { formatMoney, formatNumber } from "@/lib/helpers";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function LeaderboardView() {
  const [tab, setTab] = useState<"earnings" | "referrals">("earnings");
  const [period, setPeriod] = useState<"weekly" | "monthly" | "alltime">("alltime");

  const sorted = [...leaderboard].sort((a, b) =>
    tab === "earnings" ? b.earnings - a.earnings : b.referrals - a.referrals
  );

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="space-y-6">
      <SectionHeader title="Leaderboard" subtitle="Compete with top earners worldwide" icon="Trophy" />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex p-1 rounded-xl bg-white/5">
          {(["earnings", "referrals"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all",
                tab === t ? "bg-[#E53935] text-white" : "text-white/60 hover:text-white"
              )}
            >
              {t === "earnings" ? "Top Earners" : "Top Referrers"}
            </button>
          ))}
        </div>
        <div className="flex p-1 rounded-xl bg-white/5">
          {(["weekly", "monthly", "alltime"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all",
                period === p ? "bg-[#E53935] text-white" : "text-white/60 hover:text-white"
              )}
            >
              {p === "alltime" ? "All Time" : p}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[1, 0, 2].map((podiumIdx) => {
          const entry = top3[podiumIdx];
          if (!entry) return <div key={podiumIdx} />;
          const heights = ["h-28 sm:h-36", "h-36 sm:h-44", "h-24 sm:h-32"];
          const medals = ["🥇", "🥈", "🥉"];
          const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
          return (
            <div key={entry.id} className="flex flex-col items-center">
              <div className="relative mb-3">
                <img src={entry.avatar} alt={entry.name} className={cn("rounded-full bg-white/10 border-4", podiumIdx === 0 ? "w-16 h-16 sm:w-20 sm:h-20" : "w-14 h-14 sm:w-16 sm:h-16")} style={{ borderColor: colors[podiumIdx] }} />
                <span className="absolute -top-2 -right-2 text-xl">{medals[podiumIdx]}</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-center truncate max-w-full">{entry.name}</p>
              <p className="text-[10px] text-white/40">{entry.country}</p>
              <p className="font-black text-sm sm:text-base mt-1" style={{ color: colors[podiumIdx] }}>
                {formatMoney(entry.earnings)}
              </p>
              <div
                className={cn("w-full mt-3 rounded-t-2xl glass-strong flex items-start justify-center pt-3", heights[podiumIdx])}
                style={{ borderTop: `3px solid ${colors[podiumIdx]}` }}
              >
                <span className="text-3xl sm:text-4xl font-black" style={{ color: colors[podiumIdx] }}>
                  {podiumIdx + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      <GlassPanel>
        <div className="space-y-2">
          {rest.map((entry, i) => (
            <div
              key={entry.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all",
                entry.isCurrentUser ? "bg-[#E53935]/15 border border-[#E53935]/30" : "glass glass-hover"
              )}
            >
              <span className="w-8 text-center font-black text-white/40">{i + 4}</span>
              <img src={entry.avatar} alt={entry.name} className="w-10 h-10 rounded-full bg-white/10" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">
                  {entry.name} {entry.isCurrentUser && <span className="text-[#E53935] text-xs">(You)</span>}
                </p>
                <p className="text-xs text-white/40">{entry.country} • {entry.level}</p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-[10px] text-white/40">Offers</p>
                <p className="text-sm font-bold">{formatNumber(entry.offers)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-black text-green-400">{formatMoney(entry.earnings)}</p>
                <p className="text-[10px] text-white/40">{entry.referrals} refs</p>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Contest */}
      <GlassPanel className="relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#E53935]/15 blur-3xl" />
        <SectionHeader title="Weekly Earning Contest" subtitle="$550 prize pool • Ends in 3 days" icon="Trophy" action={<Badge variant="danger"><Icons.Flame size={10} /> Live</Badge>} />
        <div className="space-y-2 relative">
          {contests.map((c) => (
            <div
              key={c.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl",
                c.id === "u_001" ? "bg-[#E53935]/15 border border-[#E53935]/30" : "glass"
              )}
            >
              <span className="w-8 text-center font-black" style={{ color: c.rank <= 3 ? "#FFD700" : "rgba(255,255,255,0.4)" }}>
                {c.rank}
              </span>
              <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full bg-white/10" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{c.name} {c.id === "u_001" && <span className="text-[#E53935] text-xs">(You)</span>}</p>
                <p className="text-xs text-white/40">{c.entries} entries this week</p>
              </div>
              {c.prize > 0 ? (
                <Badge variant="gold">🏆 {formatMoney(c.prize)}</Badge>
              ) : (
                <span className="text-xs text-white/40">No prize</span>
              )}
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}

const RARITY_COLORS: Record<string, string> = {
  common: "#94A3B8",
  rare: "#3B82F6",
  epic: "#A855F7",
  legendary: "#FFD700",
};

export function AchievementsView() {
  const { addBalance, addActivity } = useStore();
  const unlocked = achievements.filter((a) => a.unlocked).length;

  const claim = (a: (typeof achievements)[number]) => {
    if (!a.unlocked) return;
    addBalance(a.reward);
    addActivity({ type: "bonus", title: `Achievement: ${a.name}`, amount: a.reward, status: "completed" });
    toast.success("Reward claimed!", { description: `${a.name} — +${formatMoney(a.reward)}` });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Achievements"
        subtitle="Unlock badges and earn bonus rewards"
        icon="Award"
        action={<Badge variant="gold">{unlocked}/{achievements.length} unlocked</Badge>}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((a) => {
          const color = RARITY_COLORS[a.rarity];
          return (
            <div
              key={a.id}
              className={cn(
                "glass rounded-2xl p-5 relative overflow-hidden transition-all",
                a.unlocked ? "glass-hover" : "opacity-70"
              )}
              style={a.unlocked ? { boxShadow: `0 0 24px ${color}22` } : {}}
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-20" style={{ background: color }} />
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: `${color}22`, filter: a.unlocked ? "none" : "grayscale(1)" }}
                  >
                    {a.icon}
                  </div>
                  <Badge style={{}} variant={a.unlocked ? "gold" : "default"} className="capitalize">
                    {a.rarity}
                  </Badge>
                </div>
                <p className="font-bold text-sm">{a.name}</p>
                <p className="text-xs text-white/50 mt-1 mb-3">{a.description}</p>

                {a.unlocked ? (
                  <div className="flex items-center justify-between">
                    <Badge variant="success"><Icons.Check size={10} /> Unlocked</Badge>
                    <button
                      onClick={() => claim(a)}
                      className="text-xs font-bold text-[#E53935] hover:underline"
                    >
                      Claim {formatMoney(a.reward)}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-[10px] text-white/40 mb-1">
                      <span>{formatNumber(a.progress)}</span>
                      <span>{formatNumber(a.total)}</span>
                    </div>
                    <ProgressBar value={a.progress} max={a.total} accent={color} height="h-1.5" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PromoView() {
  const { user, promoCodes, redeemPromoCode } = useStore();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const redeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const result = redeemPromoCode(code, user.name, user.id);
      if (result.success) {
        toast.success(`Redeemed ${formatMoney(result.reward!)}!`, { description: `Code ${code.toUpperCase()} applied successfully.` });
        setCode("");
      } else {
        toast.error("Redemption failed", { description: result.error });
      }
    }, 800);
  };

  // Only show active, non-expired codes with remaining uses
  const availableCodes = promoCodes.filter((p) => {
    if (!p.active) return false;
    if (p.expiresAt && new Date(p.expiresAt) < new Date()) return false;
    if (p.usageLimit > 0 && p.usedCount >= p.usageLimit) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <SectionHeader title="Promo Codes" subtitle="Redeem codes for instant rewards" icon="Ticket" />

      <GlassPanel className="relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#E53935]/15 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Icons.Ticket size={18} className="text-[#E53935]" />
            <h3 className="font-bold">Have a promo code?</h3>
          </div>
          <form onSubmit={redeem} className="flex flex-col sm:flex-row gap-3">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your promo code"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm uppercase tracking-widest font-bold focus:outline-none focus:border-[#E53935]/50 transition-all placeholder:normal-case placeholder:tracking-normal placeholder:font-normal"
            />
            <button
              type="submit"
              disabled={loading || !code}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E53935] to-[#ff5a56] text-white font-bold text-sm hover:scale-105 transition-transform disabled:opacity-60 flex items-center justify-center gap-2 accent-glow whitespace-nowrap"
            >
              {loading ? <Icons.Loader2 size={16} className="animate-spin" /> : <Icons.Gift size={16} />}
              Redeem Code
            </button>
          </form>
          <p className="text-xs text-white/40 mt-3">{availableCodes.length} active promo codes available — check the list below</p>
        </div>
      </GlassPanel>

      <div>
        <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Available Promotions</p>
        {availableCodes.length === 0 ? (
          <GlassPanel>
            <div className="text-center py-8 text-white/50">
              <Icons.Ticket size={32} className="mx-auto mb-2 opacity-50" />
              No active promo codes available right now. Check back later!
            </div>
          </GlassPanel>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableCodes.map((p) => (
              <div key={p.id} className="glass glass-hover rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-[#E53935]/15 blur-2xl" />
                <div className="flex items-start justify-between mb-3 relative">
                  <div className="w-12 h-12 rounded-xl bg-[#E53935]/15 flex items-center justify-center text-[#E53935]">
                    <Icons.Ticket size={22} />
                  </div>
                  <p className="text-2xl font-black text-green-400">
                    {p.type === "fixed" ? `+${formatMoney(p.reward)}` : `+${p.reward}%`}
                  </p>
                </div>
                <p className="font-mono font-bold text-sm tracking-wider">{p.code}</p>
                <p className="text-xs text-white/50 mt-1">{p.description}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/8 text-xs text-white/40">
                  <span>Expires {p.expiresAt || "Never"}</span>
                  <span>{p.usageLimit > 0 ? `${p.usedCount}/${p.usageLimit} used` : `${p.usedCount} redeemed`}</span>
                </div>
                <button
                  onClick={() => { setCode(p.code); toast.info(`Code ${p.code} ready to redeem`); }}
                  className="w-full mt-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold transition-colors"
                >
                  Use this code
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function HistoryView() {
  const { activities, withdrawals, deposits } = useStore();
  const [filter, setFilter] = useState<"all" | "offer" | "survey" | "referral" | "bonus" | "withdrawal" | "deposit">("all");

  const filtered = filter === "all" ? activities : activities.filter((a) => a.type === filter);

  return (
    <div className="space-y-6">
      <SectionHeader title="Reward History" subtitle="Track all your earnings and transactions" icon="History" />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Offers", value: activities.filter((a) => a.type === "offer").reduce((s, a) => s + a.amount, 0), icon: "Store", color: "#3B82F6" },
          { label: "Surveys", value: activities.filter((a) => a.type === "survey").reduce((s, a) => s + a.amount, 0), icon: "ClipboardList", color: "#22D3EE" },
          { label: "Referrals", value: activities.filter((a) => a.type === "referral").reduce((s, a) => s + a.amount, 0), icon: "Users", color: "#8B5CF6" },
          { label: "Bonuses", value: activities.filter((a) => a.type === "bonus").reduce((s, a) => s + a.amount, 0), icon: "Gift", color: "#22C55E" },
        ].map((s) => {
          const Icon = (Icons as any)[s.icon];
          return (
            <div key={s.label} className="glass rounded-2xl p-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${s.color}22`, color: s.color }}>
                <Icon size={16} />
              </div>
              <p className="text-xs text-white/50">{s.label}</p>
              <p className="text-xl font-black text-green-400">{formatMoney(s.value)}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", "offer", "survey", "referral", "bonus", "withdrawal", "deposit"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all",
              filter === f ? "bg-[#E53935] text-white" : "glass text-white/60 hover:text-white"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* History list */}
      <GlassPanel>
        {filtered.length === 0 ? (
          <EmptyState icon="History" title="No transactions found" subtitle="Try a different filter." />
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-gpt">
            {filtered.map((a) => {
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
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl glass glass-hover">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}22`, color }}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{a.title}</p>
                    <p className="text-xs text-white/40">{a.timestamp} • {a.type}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-black text-sm ${a.amount < 0 ? "text-[#E53935]" : "text-green-400"}`}>
                      {a.amount < 0 ? "" : "+"}{formatMoney(a.amount)}
                    </p>
                    <Badge variant={a.status === "completed" ? "success" : a.status === "pending" ? "warning" : "danger"}>{a.status}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
