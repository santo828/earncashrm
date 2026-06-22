"use client";

import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { SectionHeader, Badge, GlassPanel } from "./ui";
import * as Icons from "lucide-react";
import { formatMoney } from "@/lib/helpers";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const WHEEL_SEGMENTS = [
  { label: "$0.50", value: 0.5, color: "#102C57" },
  { label: "$2", value: 2, color: "#E53935" },
  { label: "$1", value: 1, color: "#102C57" },
  { label: "$5", value: 5, color: "#E53935" },
  { label: "$0.25", value: 0.25, color: "#102C57" },
  { label: "$10", value: 10, color: "#E53935" },
  { label: "$0.75", value: 0.75, color: "#102C57" },
  { label: "JACKPOT", value: 50, color: "#22C55E" },
  { label: "$1.50", value: 1.5, color: "#102C57" },
  { label: "$3", value: 3, color: "#E53935" },
  { label: "$0.50", value: 0.5, color: "#102C57" },
  { label: "$25", value: 25, color: "#A855F7" },
];

const MYSTERY_BOXES = [
  { id: "mb1", color: "#3B82F6", label: "Blue", value: 0.5 },
  { id: "mb2", color: "#22C55E", label: "Green", value: 2 },
  { id: "mb3", color: "#A855F7", label: "Purple", value: 5 },
  { id: "mb4", color: "#E53935", label: "Red", value: 0.1 },
  { id: "mb5", color: "#F59E0B", label: "Gold", value: 15 },
  { id: "mb6", color: "#22D3EE", label: "Cyan", value: 1 },
];

export function BonusesView() {
  const { user, wheelSpinsLeft, consumeWheelSpin, addSpin, addBalance, addActivity, claimDailyStreak, hourlyClaimedAt, claimHourly } = useStore();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [openedBox, setOpenedBox] = useState<string | null>(null);
  const [boxOpening, setBoxOpening] = useState(false);

  const spin = () => {
    if (spinning || wheelSpinsLeft <= 0) return;
    setSpinning(true);
    setLastWin(null);
    const segIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const segAngle = 360 / WHEEL_SEGMENTS.length;
    const targetRotation = 360 * 6 + (360 - segIndex * segAngle - segAngle / 2);
    setRotation((prev) => prev + targetRotation);
    consumeWheelSpin();

    setTimeout(() => {
      setSpinning(false);
      const won = WHEEL_SEGMENTS[segIndex].value;
      setLastWin(won);
      addSpin(won, "wheel");
      addBalance(won);
      addActivity({ type: "bonus", title: "Wheel spin reward", amount: won, status: "completed" });
      toast.success(`You won ${formatMoney(won)}!`, {
        description: segIndex === 7 ? "JACKPOT! Congratulations 🎉" : "Reward added to your balance.",
      });
    }, 4200);
  };

  const openBox = (box: (typeof MYSTERY_BOXES)[number]) => {
    if (boxOpening) return;
    setBoxOpening(true);
    setOpenedBox(box.id);
    setTimeout(() => {
      addSpin(box.value, "mystery");
      addBalance(box.value);
      addActivity({ type: "bonus", title: `Mystery box (${box.label})`, amount: box.value, status: "completed" });
      toast.success(`You found ${formatMoney(box.value)}!`, { description: "Mystery box reward added." });
      setBoxOpening(false);
      setTimeout(() => setOpenedBox(null), 2000);
    }, 1200);
  };

  const claimHourlyBonus = () => {
    if (hourlyClaimedAt && Date.now() - hourlyClaimedAt < 3600000) {
      toast.error("Already claimed!", { description: "Come back in an hour for your next bonus." });
      return;
    }
    const reward = 0.5 + Math.random() * 2;
    addSpin(+reward.toFixed(2), "hourly");
    addBalance(+reward.toFixed(2));
    addActivity({ type: "bonus", title: "Hourly bonus", amount: +reward.toFixed(2), status: "completed" });
    claimHourly();
    toast.success(`+${formatMoney(+reward.toFixed(2))} claimed!`, { description: "Come back in 1 hour." });
  };

  const claimDaily = () => {
    const reward = 2.5 + user.dailyStreak * 0.5;
    addSpin(+reward.toFixed(2), "daily");
    addBalance(+reward.toFixed(2));
    addActivity({ type: "bonus", title: `Daily streak bonus (Day ${user.dailyStreak + 1})`, amount: +reward.toFixed(2), status: "completed" });
    claimDailyStreak();
    toast.success(`+${formatMoney(+reward.toFixed(2))} claimed!`, { description: `Day ${user.dailyStreak + 1} streak!` });
  };

  const hourlyReady = !hourlyClaimedAt || Date.now() - hourlyClaimedAt > 3600000;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Daily Bonuses"
        subtitle="Spin the wheel, open mystery boxes and keep your streak alive"
        icon="Gift"
      />

      {/* Bonus cards row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Daily streak */}
        <GlassPanel className="relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-yellow-400/20 blur-2xl" />
          <div className="flex items-center gap-2 mb-3">
            <Icons.Flame size={20} className="text-yellow-400" />
            <span className="font-bold">Daily Streak</span>
            <Badge variant="gold" className="ml-auto">{user.dailyStreak} days</Badge>
          </div>
          <p className="text-3xl font-black text-yellow-400 mb-2">{formatMoney(2.5 + user.dailyStreak * 0.5)}</p>
          <p className="text-xs text-white/50 mb-4">Today's bonus — grows with your streak!</p>
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 h-6 rounded flex items-center justify-center text-[9px] font-bold",
                  i < user.dailyStreak % 7
                    ? "bg-gradient-to-b from-yellow-400 to-orange-500 text-black"
                    : "bg-white/5 text-white/30"
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <button
            onClick={claimDaily}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm hover:scale-105 transition-transform"
          >
            Claim Bonus
          </button>
        </GlassPanel>

        {/* Hourly bonus */}
        <GlassPanel className="relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-blue-400/20 blur-2xl" />
          <div className="flex items-center gap-2 mb-3">
            <Icons.Clock size={20} className="text-blue-400" />
            <span className="font-bold">Hourly Bonus</span>
            <Badge variant={hourlyReady ? "success" : "warning"} className="ml-auto">
              {hourlyReady ? "Ready" : "Wait"}
            </Badge>
          </div>
          <p className="text-3xl font-black text-blue-400 mb-2">$0.50 - $2.50</p>
          <p className="text-xs text-white/50 mb-4">Claim a random bonus every hour!</p>
          <div className="flex items-center gap-2 text-xs text-white/50 mb-4">
            <Icons.Timer size={14} />
            <span>{hourlyReady ? "Available now" : "Available in ~1 hour"}</span>
          </div>
          <button
            onClick={claimHourlyBonus}
            disabled={!hourlyReady}
            className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Claim Hourly
          </button>
        </GlassPanel>

        {/* Wheel spins left */}
        <GlassPanel className="relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-[#E53935]/20 blur-2xl" />
          <div className="flex items-center gap-2 mb-3">
            <Icons.Disc3 size={20} className="text-[#E53935]" />
            <span className="font-bold">Wheel Spins</span>
            <Badge variant="danger" className="ml-auto">{wheelSpinsLeft} left</Badge>
          </div>
          <p className="text-3xl font-black text-[#E53935] mb-2">Win up to $50</p>
          <p className="text-xs text-white/50 mb-4">3 free spins daily • Jackpot = $50!</p>
          <button
            onClick={() => document.getElementById("wheel-section")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full py-2.5 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white font-bold text-sm transition-colors"
          >
            Spin Now
          </button>
        </GlassPanel>
      </div>

      {/* Wheel + Mystery box */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Wheel */}
        <GlassPanel id="wheel-section" className="relative">
          <SectionHeader title="Lucky Wheel" subtitle={`${wheelSpinsLeft} spins remaining today`} icon="Disc3" />
          <div className="flex flex-col items-center py-4">
            <div className="relative w-72 h-72">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-[#E53935] drop-shadow-lg" />
              {/* Wheel */}
              <div
                className="w-full h-full rounded-full relative transition-transform"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transitionDuration: spinning ? "4200ms" : "0ms",
                  transitionTimingFunction: "cubic-bezier(0.17, 0.67, 0.12, 0.99)",
                  background: `conic-gradient(${WHEEL_SEGMENTS.map(
                    (s, i) => `${s.color} ${(i * 360) / WHEEL_SEGMENTS.length}deg ${((i + 1) * 360) / WHEEL_SEGMENTS.length}deg`
                  ).join(", ")})`,
                  boxShadow: "0 0 40px rgba(229,57,53,0.3), inset 0 0 0 4px rgba(255,255,255,0.1)",
                }}
              >
                {WHEEL_SEGMENTS.map((seg, i) => {
                  const angle = (i * 360) / WHEEL_SEGMENTS.length + 360 / WHEEL_SEGMENTS.length / 2;
                  return (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 origin-left text-[10px] font-black text-white"
                      style={{ transform: `rotate(${angle}deg) translateX(40px)` }}
                    >
                      <span className="inline-block -translate-y-1/2 whitespace-nowrap drop-shadow">
                        {seg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-[#081B33] to-[#102C57] border-4 border-[#E53935] flex items-center justify-center z-10 accent-glow">
                <Icons.Star size={24} className="text-[#E53935]" />
              </div>
            </div>

            {lastWin !== null && (
              <div className="mt-4 px-6 py-2 rounded-full bg-green-500/15 text-green-400 font-black animate-in">
                🎉 You won {formatMoney(lastWin)}!
              </div>
            )}

            <button
              onClick={spin}
              disabled={spinning || wheelSpinsLeft <= 0}
              className={cn(
                "mt-5 px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2",
                spinning || wheelSpinsLeft <= 0
                  ? "bg-white/10 text-white/40 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#E53935] to-[#ff5a56] text-white hover:scale-105 accent-glow"
              )}
            >
              {spinning ? (
                <>
                  <Icons.Loader2 size={16} className="animate-spin" /> Spinning...
                </>
              ) : (
                <>
                  <Icons.Disc3 size={16} /> {wheelSpinsLeft > 0 ? "Spin the Wheel" : "No spins left"}
                </>
              )}
            </button>
          </div>
        </GlassPanel>

        {/* Mystery box */}
        <GlassPanel className="relative">
          <SectionHeader title="Mystery Box" subtitle="Pick a box — reveal a hidden reward" icon="Gift" />
          <div className="grid grid-cols-3 gap-3 py-2">
            {MYSTERY_BOXES.map((box) => {
              const isOpened = openedBox === box.id;
              return (
                <button
                  key={box.id}
                  onClick={() => openBox(box)}
                  disabled={boxOpening}
                  className={cn(
                    "aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden group",
                    isOpened ? "scale-95" : "glass glass-hover hover:scale-105",
                    boxOpening && !isOpened && "opacity-40"
                  )}
                  style={isOpened ? { background: `${box.color}22`, boxShadow: `0 0 30px ${box.color}66` } : {}}
                >
                  {isOpened ? (
                    <>
                      <Icons.Check size={28} style={{ color: box.color }} />
                      <span className="text-sm font-black" style={{ color: box.color }}>
                        {formatMoney(box.value)}
                      </span>
                    </>
                  ) : (
                    <>
                      <Icons.Gift size={32} className="text-white/60 group-hover:text-white transition-colors" />
                      <span className="text-[10px] text-white/40 font-semibold uppercase">{box.label}</span>
                      <div className="absolute inset-0 shine opacity-0 group-hover:opacity-100" />
                    </>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/8 text-xs text-white/50 text-center">
            <Icons.Info size={12} className="inline mr-1" />
            Mystery boxes reset every 2 hours. Higher tier boxes = bigger rewards (and some duds).
          </div>
        </GlassPanel>
      </div>

      {/* History */}
      <GlassPanel>
        <SectionHeader title="Bonus History" icon="History" />
        <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-gpt">
          {useStore((s) => s.spinHistory).map((sp) => (
            <div key={sp.id} className="flex items-center gap-3 p-2.5 rounded-xl glass">
              <div className="w-8 h-8 rounded-lg bg-[#E53935]/15 flex items-center justify-center text-[#E53935]">
                {sp.type === "wheel" ? <Icons.Disc3 size={14} /> : sp.type === "mystery" ? <Icons.Gift size={14} /> : sp.type === "hourly" ? <Icons.Clock size={14} /> : <Icons.Flame size={14} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold capitalize">{sp.type} Bonus</p>
                <p className="text-xs text-white/40">{sp.date}</p>
              </div>
              <p className="font-black text-green-400">+{formatMoney(sp.prize)}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
