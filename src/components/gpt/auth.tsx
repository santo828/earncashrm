"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import * as Icons from "lucide-react";
import { toast } from "sonner";

const AVATAR_SEEDS = [
  "Lion", "Tiger", "Eagle", "Wolf", "Dragon", "Phoenix", "Falcon", "Panther",
  "Shark", "Bear", "Hawk", "Cobra", "Bull", "Rhino", "Fox", "Owl",
  "Viper", "Raven", "Lynx", "Stallion", "Cougar", "Jackal", "Manta", "Orca",
  "Bison", "Moose", "Otter", "Panda", "Koala", "Lemur", "Seal", "Hedgehog",
  "Fennec", "Ibex", "Macaque", "Tapir",
];

const RANDOM_NAMES = [
  "CryptoHunter", "RewardSeeker", "EarnMaster", "CashFlow", "GoldRush", "LuckyStar",
  "QuickEarn", "SmartStack", "BonusKing", "PrizeFinder", "WinStreak", "FlashEarn",
  "NeonCash", "TurboEarn", "ProStacker", "EliteEarner", "MegaWin", "CoinRush",
  "PixelPay", "StarEarn", "VoidCash", "ApexEarner", "NovaPay", "ZenStack",
];

function randomAvatar() {
  return AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)];
}
function randomName() {
  return RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)] + Math.floor(Math.random() * 999);
}

export function AuthScreen() {
  const loginWithEmail = useStore((s) => s.loginWithEmail);
  const register = useStore((s) => s.register);
  const siteSettings = useStore((s) => s.siteSettings);
  const registeredUsers = useStore((s) => s.registeredUsers);
  const activities = useStore((s) => s.activities);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatarSeed, setAvatarSeed] = useState(randomAvatar());

  const accent = siteSettings?.accentColor || "#E53935";
  const siteName = siteSettings?.siteName || "EarnCashRM";
  const logoChar = siteSettings?.logoText || siteName.charAt(0);
  const nameParts = siteName.length > 2
    ? [siteName.slice(0, -2), siteName.slice(-2)]
    : [siteName, ""];
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

  // Real computed stats
  const useReal = siteSettings?.statUseRealData !== false;
  const realUsers = registeredUsers?.length || 0;
  const realPaid = activities?.filter((a: any) => a.amount > 0).reduce((s: number, a: any) => s + a.amount, 0) || 0;
  const paidOutDisplay = useReal ? `$${realPaid.toFixed(2)}` : `$${(siteSettings?.statTotalPaidOut || 0).toLocaleString()}+`;
  const usersDisplay = useReal ? String(realUsers) : `${(siteSettings?.statTotalUsers || 0).toLocaleString()}+`;
  const ratingDisplay = (siteSettings?.statRating || 5).toFixed(1);
  const reviewDisplay = (siteSettings?.statReviewCount || 0).toLocaleString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === "register") {
        const finalName = name.trim() || randomName();
        const result = register(finalName, email, password, avatarUrl);
        if (!result.success) {
          setError(result.error || "Registration failed");
          toast.error("Registration failed", { description: result.error });
          return;
        }
        toast.success(`Welcome to ${siteName}, ${finalName}! 🎉`, {
          description: "Your account is ready. Start earning now!",
        });
      } else {
        const result = loginWithEmail(email, password);
        if (!result.success) {
          setError(result.error || "Login failed");
          toast.error("Login failed", { description: result.error });
          return;
        }
        toast.success(`Welcome back to ${siteName}!`, {
          description: "You're signed in.",
        });
      }
    }, 700);
  };

  const randomizeName = () => { setName(randomName()); };
  const shuffleAvatar = () => { setAvatarSeed(randomAvatar()); };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 grid-bg relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl float-anim" style={{ background: `${accent}1a` }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#102C57]/40 blur-3xl float-anim" style={{ animationDelay: "1s" }} />

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left: Hero */}
        <div className="hidden lg:block px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-2xl" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 0 30px ${accent}66` }}>
              {logoChar}
            </div>
            <div>
              <h1 className="font-black text-3xl tracking-tight">
                {nameParts[0]}<span style={{ color: accent }}>{nameParts[1]}</span>
              </h1>
              <p className="text-xs text-white/50 tracking-widest uppercase">{siteSettings?.siteTagline || "GPT Offerwall Platform"}</p>
            </div>
          </div>

          <h2 className="text-4xl font-black leading-tight mb-4">
            Earn real rewards by{" "}
            <span style={{ color: accent }}>completing offers</span>, surveys & daily bonuses.
          </h2>
          <p className="text-white/60 mb-8">
            {siteSettings?.siteDescription || "Complete offers, take surveys, spin the wheel and earn real rewards."}
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: "Wallet", value: paidOutDisplay, label: "Paid out" },
              { icon: "Users", value: usersDisplay, label: "Active users" },
              { icon: "Zap", value: "Instant", label: "Cash outs" },
            ].map((s) => {
              const Icon = (Icons as any)[s.icon];
              return (
                <div key={s.label} className="glass rounded-2xl p-4">
                  <Icon size={18} className="mb-2" style={{ color: accent }} />
                  <p className="font-black text-lg">{s.value}</p>
                  <p className="text-xs text-white/50">{s.label}</p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mt-8">
            <div className="flex -space-x-2">
              {["A", "M", "K", "S", "L"].map((s, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#102C57] to-[#081B33] border-2 border-[#0A1224] flex items-center justify-center text-xs font-bold">
                  {s}
                </div>
              ))}
            </div>
            <p className="text-xs text-white/50">
              <span className="text-yellow-400">★★★★★</span> Rated {ratingDisplay}/5 by {reviewDisplay}+ users
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="glass-strong rounded-3xl p-8 shadow-2xl">
          <div className="lg:hidden flex items-center gap-3 mb-6 justify-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-xl" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>
              {logoChar}
            </div>
            <h1 className="font-black text-2xl">
              {nameParts[0]}<span style={{ color: accent }}>{nameParts[1]}</span>
            </h1>
          </div>

          <div className="flex p-1 rounded-xl bg-white/5 mb-6">
            <button type="button" onClick={() => { setMode("login"); setError(""); setEmail(""); setPassword(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "login" ? "text-white" : "text-white/60 hover:text-white"}`}
              style={mode === "login" ? { background: accent } : {}}>
              Sign In
            </button>
            <button type="button" onClick={() => { setMode("register"); setError(""); setEmail(""); setPassword(""); setName(randomName()); setAvatarSeed(randomAvatar()); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "register" ? "text-white" : "text-white/60 hover:text-white"}`}
              style={mode === "register" ? { background: accent } : {}}>
              Create Account
            </button>
          </div>

          <h3 className="text-2xl font-black mb-1">
            {mode === "login" ? "Welcome back 👋" : "Start earning today 🚀"}
          </h3>
          <p className="text-sm text-white/50 mb-6">
            {mode === "login" ? "Sign in to continue to your dashboard." : "Create your free account in seconds. Starts at $0.00 balance."}
          </p>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-[#E53935]/15 border border-[#E53935]/30 text-sm text-[#ff6b6b] flex items-center gap-2 mb-2">
              <Icons.AlertCircle size={16} /> {error}
            </div>
          )}

          {mode === "register" && (
            <div className="flex items-center gap-4 mb-4 p-3 rounded-xl glass">
              <img src={avatarUrl} alt="avatar" className="w-14 h-14 rounded-full bg-white/10 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white/70 mb-1">Your Avatar</p>
                <p className="text-xs text-white/40">{avatarSeed}</p>
              </div>
              <button type="button" onClick={shuffleAvatar} className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5 shrink-0">
                <Icons.Shuffle size={12} /> Shuffle
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-xs font-semibold text-white/70 mb-1.5 block">Username</label>
                <div className="relative">
                  <Icons.User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Pick a username"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#E53935]/50 transition-all" />
                  <button type="button" onClick={randomizeName} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white" title="Randomize">
                    <Icons.Shuffle size={14} />
                  </button>
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Email Address</label>
              <div className="relative">
                <Icons.Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#E53935]/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Password</label>
              <div className="relative">
                <Icons.Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#E53935]/50 transition-all" />
              </div>
            </div>

            {mode === "login" && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-white/60 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#E53935] w-4 h-4 rounded" />
                  Remember me
                </label>
                <button type="button" className="text-[#E53935] hover:underline font-semibold">Forgot password?</button>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 accent-glow"
              style={{ background: `linear-gradient(to right, ${accent}, ${accent}dd)` }}>
              {loading ? (<><Icons.Loader2 size={16} className="animate-spin" /> Please wait...</>) : (<>{mode === "login" ? "Sign In" : "Create Account"} <Icons.ArrowRight size={16} /></>)}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/40">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "Google", icon: "🔍" },
              { name: "Facebook", icon: "f" },
              { name: "Discord", icon: "🎮" },
            ].map((s) => (
              <button key={s.name} type="button" onClick={() => toast.info(`${s.name} login (demo)`)}
                className="py-2.5 rounded-xl glass hover:bg-white/10 transition-colors text-sm font-semibold flex items-center justify-center gap-1.5">
                <span>{s.icon}</span> {s.name}
              </button>
            ))}
          </div>

          <p className="text-[10px] text-white/40 text-center mt-6">
            🔒 Protected by reCAPTCHA • By continuing you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
