"use client";

import { useState, useRef } from "react";
import { offerProviders, offers, surveys, recentWinners, topOffers, featuredOffers } from "@/lib/data";
import type { OfferCard, RecentWinner } from "@/lib/data";
import { SectionHeader, Badge, GlassPanel } from "./ui";
import * as Icons from "lucide-react";
import { useStore } from "@/lib/store";
import { formatMoney, formatNumber, compact } from "@/lib/helpers";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function OfferwallView() {
  const { addActivity, addBalance, addPending } = useStore();
  const [activeTab, setActiveTab] = useState<"earn" | "providers" | "browse">("earn");

  const startOffer = (offer: { title: string; reward: number; provider: string }) => {
    addPending(offer.reward);
    addActivity({
      type: "offer",
      title: offer.title,
      amount: offer.reward,
      status: "pending",
    });
    toast.success("Offer started!", {
      description: `${offer.title} — ${formatMoney(offer.reward)} pending on completion.`,
    });
  };

  if (activeTab === "providers") {
    return <ProvidersView onBack={() => setActiveTab("earn")} startOffer={startOffer} />;
  }
  if (activeTab === "browse") {
    return <BrowseView onBack={() => setActiveTab("earn")} startOffer={startOffer} />;
  }

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="glass-strong rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#E53935]/15 blur-3xl" />
        <div className="relative">
          <Badge variant="danger"><Icons.Rocket size={10} /> {topOffers.length + featuredOffers.length} live offers</Badge>
          <h1 className="text-3xl font-black tracking-tight mt-3">
            Earn <span className="text-gradient-red">Real Rewards</span> 🚀
          </h1>
          <p className="text-white/60 mt-1">Complete offers, install apps, and cash out instantly. New offers added every hour.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button onClick={() => setActiveTab("browse")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E53935] to-[#ff5a56] text-white font-bold text-sm hover:scale-105 transition-transform accent-glow">
              <Icons.Store size={16} /> Browse All Offers
            </button>
            <button onClick={() => setActiveTab("providers")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass hover:bg-white/10 text-white font-bold text-sm transition-colors">
              <Icons.Grid3x3 size={16} /> Offer Partners
            </button>
          </div>
        </div>
      </div>

      {/* User Activity bar (recent winners) */}
      <WinnersBar />

      {/* Top Offers */}
      <OffersSection
        title="Top Offers"
        icon="Trophy"
        emoji="🏆"
        offers={topOffers}
        onStart={startOffer}
      />

      {/* Featured Offers */}
      <OffersSection
        title="Featured Offers"
        icon="Sparkles"
        emoji="✨"
        offers={featuredOffers}
        onStart={startOffer}
      />

      {/* Offers Partners preview */}
      <div>
        <SectionHeader
          title="Offers Partners"
          subtitle="12 premium offerwall providers integrated"
          icon="Star"
          action={
            <button onClick={() => setActiveTab("providers")} className="text-xs text-[#E53935] font-semibold hover:underline flex items-center gap-1">
              View All <Icons.ArrowRight size={12} />
            </button>
          }
        />
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {offerProviders.filter((p) => p.enabled).slice(0, 8).map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveTab("providers")}
              className="glass glass-hover rounded-2xl p-4 min-w-[140px] text-left shrink-0 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full blur-xl opacity-30" style={{ background: p.color }} />
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-2" style={{ background: `${p.color}22` }}>
                {p.logo}
              </div>
              <p className="text-sm font-bold truncate">{p.name}</p>
              <p className="text-[10px] text-white/50">{p.totalOffers} offers</p>
              <p className="text-[10px] text-green-400 font-semibold mt-1">~{formatMoney(p.avgPayout)}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== Recent Winners Activity Bar =====
function WinnersBar() {
  return (
    <div className="glass rounded-2xl p-4 relative overflow-hidden">
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#E53935]/15 blur-2xl" />
      <div className="flex items-center gap-2 mb-3 relative">
        <Icons.Rocket size={16} className="text-[#E53935]" />
        <span className="text-xs font-bold uppercase tracking-wider text-white/70">Live Activity</span>
        <span className="text-[10px] text-white/40">— recent winners across the platform</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-red" /> Live
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 relative">
        {recentWinners.map((w) => (
          <WinnerCard key={w.id} winner={w} />
        ))}
      </div>
    </div>
  );
}

function WinnerCard({ winner }: { winner: RecentWinner }) {
  return (
    <div className="glass glass-hover rounded-xl p-3 min-w-[180px] shrink-0 flex items-center gap-3">
      <div className="relative shrink-0">
        <img src={winner.avatar} alt={winner.name} className="w-10 h-10 rounded-full bg-white/10" />
        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#0A1224] flex items-center justify-center">
          <Icons.Check size={9} className="text-white" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold truncate">{winner.name}</p>
        <p className="text-[10px] text-white/40 truncate">{winner.offer}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Icons.Coins size={10} className="text-yellow-400" />
          <span className="text-[11px] font-black text-yellow-400">{formatNumber(winner.coins)}</span>
          <span className="text-[9px] text-white/30 ml-1">{winner.timeAgo}</span>
        </div>
      </div>
    </div>
  );
}

// ===== Offers Section (horizontal scrolling cards) =====
function OffersSection({
  title,
  icon,
  emoji,
  offers,
  onStart,
}: {
  title: string;
  icon: string;
  emoji: string;
  offers: OfferCard[];
  onStart: (o: { title: string; reward: number; provider: string }) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <h2 className="text-lg font-black">{title}</h2>
          <Badge variant="default">{offers.length}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll("left")} className="p-2 rounded-lg glass hover:bg-white/10 text-white/70">
            <Icons.ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll("right")} className="p-2 rounded-lg glass hover:bg-white/10 text-white/70">
            <Icons.ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-gpt pb-3 snap-x">
        {offers.map((offer) => (
          <OfferCardItem key={offer.id} offer={offer} onStart={onStart} />
        ))}
      </div>
    </div>
  );
}

function OfferCardItem({
  offer,
  onStart,
}: {
  offer: OfferCard;
  onStart: (o: { title: string; reward: number; provider: string }) => void;
}) {
  const difficultyColor =
    offer.difficulty === "Easy" ? "success" : offer.difficulty === "Medium" ? "warning" : "danger";

  return (
    <div className="glass glass-hover rounded-2xl overflow-hidden min-w-[240px] max-w-[240px] shrink-0 snap-start group">
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={offer.thumbnail}
          alt={offer.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1224] via-[#0A1224]/30 to-transparent" />
        {/* Coins badge */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-[#0A1224]/80 backdrop-blur-sm flex items-center gap-1">
          <Icons.Coins size={11} className="text-yellow-400" />
          <span className="text-[11px] font-black text-yellow-400">{formatNumber(offer.coins)}</span>
        </div>
        {offer.top && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#E53935] text-[9px] font-black uppercase tracking-wide flex items-center gap-1">
            <Icons.Flame size={9} /> Hot
          </div>
        )}
        {offer.featured && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-purple-500 text-[9px] font-black uppercase tracking-wide flex items-center gap-1">
            <Icons.Star size={9} /> Featured
          </div>
        )}
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="font-black text-sm leading-tight">{offer.title}</p>
          <p className="text-[10px] text-white/60">{offer.provider}</p>
        </div>
      </div>
      {/* Details */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2 text-[10px] text-white/50">
          <Badge variant={difficultyColor as any}>{offer.difficulty}</Badge>
          <span className="flex items-center gap-0.5"><Icons.Clock size={9} /> {offer.duration}</span>
          <span className="flex items-center gap-0.5"><Icons.Star size={9} className="text-yellow-400" /> {offer.rating}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-[9px] text-white/40 uppercase">Reward</p>
            <p className="font-black text-green-400 text-sm">{formatMoney(offer.reward)}</p>
          </div>
          <button
            onClick={() => onStart(offer)}
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#E53935] to-[#ff5a56] text-white font-bold text-xs hover:scale-105 transition-transform flex items-center gap-1"
          >
            Start <Icons.ArrowRight size={11} />
          </button>
        </div>
        <p className="text-[9px] text-white/30">{compact(offer.completions)} completed</p>
      </div>
    </div>
  );
}

// ===== Providers View =====
function ProvidersView({ onBack, startOffer }: { onBack: () => void; startOffer: (o: any) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = selected ? offers.filter((o) => o.providerId === selected) : offers;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Offer Partners"
        subtitle="12 premium offerwall providers — click to filter offers"
        icon="Grid3x3"
        action={
          <button onClick={onBack} className="px-4 py-2 rounded-xl glass hover:bg-white/10 text-xs font-semibold flex items-center gap-2">
            <Icons.ArrowLeft size={14} /> Back to Earn
          </button>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {offerProviders.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(selected === p.id ? null : p.id)}
            disabled={!p.enabled}
            className={cn(
              "glass glass-hover rounded-2xl p-4 text-left relative overflow-hidden transition-all",
              selected === p.id && "ring-2 ring-[#E53935]",
              !p.enabled && "opacity-40 cursor-not-allowed"
            )}
          >
            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl opacity-30" style={{ background: p.color }} />
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-2" style={{ background: `${p.color}22` }}>
              {p.logo}
            </div>
            <p className="text-sm font-bold truncate">{p.name}</p>
            <p className="text-[10px] text-white/50 mt-0.5">{p.totalOffers} offers</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-green-400 font-semibold">~{formatMoney(p.avgPayout)}</span>
              {p.enabled ? <Badge variant="success">Live</Badge> : <Badge>Off</Badge>}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold">Offers from {offerProviders.find((p) => p.id === selected)?.name}</p>
            <button onClick={() => setSelected(null)} className="text-xs text-[#E53935] font-semibold">Clear filter</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((offer) => (
              <div key={offer.id} className="glass glass-hover rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${offerProviders.find((p) => p.id === offer.providerId)?.color}22` }}>
                    {offerProviders.find((p) => p.id === offer.providerId)?.logo}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm leading-tight">{offer.title}</p>
                    <p className="text-xs text-white/50 mt-1 line-clamp-2">{offer.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/8">
                  <p className="text-xl font-black text-green-400">{formatMoney(offer.reward)}</p>
                  <button onClick={() => startOffer(offer)} className="px-5 py-2.5 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white font-bold text-sm flex items-center gap-2">
                    Start <Icons.ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== Browse View (all offers with filters) =====
function BrowseView({ onBack, startOffer }: { onBack: () => void; startOffer: (o: any) => void }) {
  const [category, setCategory] = useState("All");
  const allOffers = [...topOffers, ...featuredOffers];
  const categories = ["All", ...Array.from(new Set(allOffers.map((o) => o.category)))];
  const filtered = category === "All" ? allOffers : allOffers.filter((o) => o.category === category);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Browse All Offers"
        subtitle={`${allOffers.length} offers available across all providers`}
        icon="Store"
        action={
          <button onClick={onBack} className="px-4 py-2 rounded-xl glass hover:bg-white/10 text-xs font-semibold flex items-center gap-2">
            <Icons.ArrowLeft size={14} /> Back to Earn
          </button>
        }
      />
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold transition-all",
              category === c ? "bg-[#E53935] text-white" : "glass text-white/60 hover:text-white"
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((offer) => (
          <div key={offer.id} className="glass glass-hover rounded-2xl overflow-hidden group">
            <div className="relative aspect-square overflow-hidden">
              <img src={offer.thumbnail} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1224] via-transparent to-transparent" />
              <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-[#0A1224]/80 backdrop-blur-sm flex items-center gap-1">
                <Icons.Coins size={11} className="text-yellow-400" />
                <span className="text-[11px] font-black text-yellow-400">{formatNumber(offer.coins)}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="font-bold text-sm leading-tight">{offer.title}</p>
                <p className="text-[10px] text-white/60">{offer.provider}</p>
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-white/40 uppercase">Reward</p>
                  <p className="font-black text-green-400 text-sm">{formatMoney(offer.reward)}</p>
                </div>
                <button onClick={() => startOffer(offer)} className="px-3 py-1.5 rounded-lg bg-[#E53935] hover:bg-[#ff5a56] text-white font-bold text-xs flex items-center gap-1">
                  Start <Icons.ArrowRight size={10} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SurveysView() {
  const { addActivity, addPending } = useStore();
  const surveyProviders = offerProviders.filter((p) => p.type === "surveys" || p.type === "both");

  const startSurvey = (s: (typeof surveys)[number]) => {
    addPending(s.reward);
    addActivity({ type: "survey", title: s.title, amount: s.reward, status: "pending" });
    toast.success("Survey started!", { description: `${s.title} — ${formatMoney(s.reward)} pending.` });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Surveys"
        subtitle="Share your opinion and earn from top survey providers"
        icon="ClipboardList"
        action={<Badge variant="info"><Icons.Zap size={10} /> {surveys.length} surveys available</Badge>}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {surveyProviders.map((p) => (
          <div key={p.id} className="glass glass-hover rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl opacity-25" style={{ background: p.color }} />
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-2" style={{ background: `${p.color}22` }}>
              {p.logo}
            </div>
            <p className="font-bold text-sm">{p.name}</p>
            <p className="text-[10px] text-white/50 mt-0.5">{p.description.slice(0, 60)}...</p>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-green-400 font-semibold">~{formatMoney(p.avgPayout)}/survey</span>
              <Badge variant="success">Live</Badge>
            </div>
          </div>
        ))}
      </div>
      <div>
        <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Available Surveys</p>
        <div className="space-y-3">
          {surveys.map((s) => {
            const provider = offerProviders.find((p) => p.id === s.providerId);
            return (
              <div key={s.id} className="glass glass-hover rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${provider?.color}22` }}>
                  {provider?.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm">{s.title}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-white/50">
                    <span className="flex items-center gap-1"><Icons.Building2 size={11} /> {s.providerName}</span>
                    <span className="flex items-center gap-1"><Icons.Clock size={11} /> {s.duration}</span>
                    <span className="flex items-center gap-1"><Icons.Star size={11} className="text-yellow-400" /> {s.rating}</span>
                    <span className="flex items-center gap-1"><Icons.Target size={11} /> {s.matchRate}% match</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] text-white/50 uppercase">Reward</p>
                    <p className="text-lg font-black text-green-400">{formatMoney(s.reward)}</p>
                  </div>
                  <button onClick={() => startSurvey(s)} className="px-4 py-2.5 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white font-bold text-xs transition-colors whitespace-nowrap">
                    Take Survey
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <GlassPanel className="bg-gradient-to-br from-[#102C57]/40 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E53935]/15 flex items-center justify-center text-[#E53935]">
            <Icons.ShieldCheck size={24} />
          </div>
          <div>
            <p className="font-bold">Survey fraud protection enabled</p>
            <p className="text-sm text-white/50 mt-0.5">We use advanced anti-fraud detection (VPN block, duplicate prevention, speed-checks) to keep our survey ecosystem healthy.</p>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
