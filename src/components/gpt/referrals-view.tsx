"use client";

import { useStore } from "@/lib/store";
import { referrals, levelConfig } from "@/lib/data";
import { SectionHeader, Badge, GlassPanel, StatCard, ProgressBar } from "./ui";
import * as Icons from "lucide-react";
import { formatMoney, formatNumber } from "@/lib/helpers";
import { toast } from "sonner";
import { useState } from "react";

export function ReferralsView() {
  const { user, siteSettings } = useStore();
  const [copied, setCopied] = useState(false);
  const siteUrl = (siteSettings?.siteUrl || "https://earncashrm.xyz").replace(/\/$/, "");
  const referralLink = `${siteUrl}/r/${user.referralCode}`;
  const l1Rate = siteSettings?.referralCommissionL1 ?? 10;
  const l2Rate = siteSettings?.referralCommissionL2 ?? 5;
  const l3Rate = siteSettings?.referralCommissionL3 ?? 2;

  const copyLink = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!", { description: `Share it with friends to earn ${l1Rate}% on their earnings.` });
    setTimeout(() => setCopied(false), 2000);
  };

  const level1 = referrals.filter((r) => r.level === 1);
  const level2 = referrals.filter((r) => r.level === 2);
  const level3 = referrals.filter((r) => r.level === 3);

  const levelStats = [
    { level: 1, rate: l1Rate, count: level1.length, earnings: level1.reduce((a, r) => a + r.earnings, 0), color: "#E53935" },
    { level: 2, rate: l2Rate, count: level2.length, earnings: level2.reduce((a, r) => a + r.earnings, 0), color: "#F59E0B" },
    { level: 3, rate: l3Rate, count: level3.length, earnings: level3.reduce((a, r) => a + r.earnings, 0), color: "#8B5CF6" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Referral Program"
        subtitle={`Invite friends and earn ${l1Rate}% on 3 levels of referrals`}
        icon="Users"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Referrals" value={formatNumber(referrals.length)} icon="Users" accent="#E53935" subtitle={`${referrals.filter((r) => r.status === "active").length} active`} />
        <StatCard title="Referral Earnings" value={formatMoney(user.referralEarnings)} icon="DollarSign" accent="#22C55E" trend="+$48 this week" />
        <StatCard title="This Month" value={formatMoney(184.5)} icon="Calendar" accent="#F59E0B" />
        <StatCard title="Conversion Rate" value="68%" icon="Target" accent="#3B82F6" trend="+4% vs last month" />
      </div>

      {/* Referral link */}
      <GlassPanel className="relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#E53935]/15 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Icons.Link2 size={18} className="text-[#E53935]" />
            <h3 className="font-bold">Your Referral Link</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              <Icons.Link size={16} className="text-white/40 shrink-0" />
              <input
                readOnly
                value={referralLink}
                className="bg-transparent text-sm flex-1 outline-none text-white/80 min-w-0"
              />
            </div>
            <button
              onClick={copyLink}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E53935] to-[#ff5a56] text-white font-bold text-sm hover:scale-105 transition-transform flex items-center justify-center gap-2 accent-glow whitespace-nowrap"
            >
              {copied ? <Icons.Check size={16} /> : <Icons.Copy size={16} />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["WhatsApp", "Telegram", "Twitter", "Facebook", "Copy Code"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  navigator.clipboard?.writeText(user.referralCode);
                  toast.success(`${s} — code copied!`);
                }}
                className="px-3 py-1.5 rounded-lg glass hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5"
              >
                <Icons.Share2 size={12} /> {s}
              </button>
            ))}
          </div>
          <div className="mt-3 px-3 py-2 rounded-lg bg-white/5 inline-flex items-center gap-2">
            <Icons.Ticket size={14} className="text-[#E53935]" />
            <span className="text-xs text-white/60">Referral code:</span>
            <span className="text-xs font-black tracking-wider">{user.referralCode}</span>
          </div>
        </div>
      </GlassPanel>

      {/* Commission tiers */}
      <div>
        <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Commission Structure (3-Level)</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {levelStats.map((ls) => (
            <div key={ls.level} className="glass glass-hover rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-20" style={{ background: ls.color }} />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-white/60">Level {ls.level}</span>
                <span className="text-2xl font-black" style={{ color: ls.color }}>{ls.rate}%</span>
              </div>
              <p className="text-3xl font-black">{ls.count}</p>
              <p className="text-xs text-white/50">referrals</p>
              <div className="mt-3 pt-3 border-t border-white/8">
                <p className="text-[10px] text-white/50 uppercase">Earned</p>
                <p className="font-black text-green-400">{formatMoney(ls.earnings)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral list */}
      <GlassPanel>
        <SectionHeader title="Your Referrals" subtitle={`${referrals.length} friends joined using your link`} icon="Users" />
        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-gpt">
          {referrals.map((r) => (
            <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl glass glass-hover">
              <div className="relative">
                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full bg-white/10" />
                <span
                  className="absolute -bottom-1 -right-1 text-[9px] font-black px-1.5 py-0.5 rounded-full text-white"
                  style={{ background: levelStats[r.level - 1].color }}
                >
                  L{r.level}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{r.name}</p>
                <p className="text-xs text-white/40">Joined {r.joinedAt}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-green-400">{formatMoney(r.earnings)}</p>
                <Badge variant={r.status === "active" ? "success" : "default"}>{r.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* How it works */}
      <GlassPanel className="bg-gradient-to-br from-[#102C57]/40 to-transparent">
        <div className="flex items-center gap-2 mb-4">
          <Icons.Lightbulb size={18} className="text-yellow-400" />
          <h3 className="font-bold">How referrals work</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: "Share2", title: "Share your link", desc: "Send your unique referral link to friends via social media or messaging." },
            { icon: "UserPlus", title: "They sign up", desc: "When they register using your link, they're linked to you permanently." },
            { icon: "DollarSign", title: "You earn forever", desc: "Get 10% of L1, 5% of L2, and 2% of L3 earnings — for life!" },
          ].map((s, i) => {
            const Icon = (Icons as any)[s.icon];
            return (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#E53935]/15 flex items-center justify-center mx-auto mb-3 text-[#E53935]">
                  <Icon size={22} />
                </div>
                <p className="font-bold text-sm mb-1">{s.title}</p>
                <p className="text-xs text-white/50">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </GlassPanel>
    </div>
  );
}
