"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { paymentMethods } from "@/lib/data";
import { SectionHeader, Badge, GlassPanel } from "./ui";
import * as Icons from "lucide-react";
import { formatMoney } from "@/lib/helpers";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/lib/types";

export function WithdrawView() {
  const { user, addWithdrawal, withdrawals } = useStore();
  const [selected, setSelected] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const amt = parseFloat(amount);
    if (!amt || amt < selected.minAmount) {
      toast.error("Amount too low", { description: `Minimum is ${formatMoney(selected.minAmount)}.` });
      return;
    }
    if (amt > user.currentBalance) {
      toast.error("Insufficient balance", { description: `You only have ${formatMoney(user.currentBalance)}.` });
      return;
    }
    if (!address) {
      toast.error("Address required", { description: "Enter your payout destination." });
      return;
    }
    setLoading(true);
    const fee = selected.feeType === "percent" ? (amt * selected.fee) / 100 : selected.fee;
    setTimeout(() => {
      addWithdrawal({
        method: selected.name,
        amount: amt,
        fee,
        status: "pending",
        address: address.slice(0, 6) + "..." + address.slice(-4),
      });
      setLoading(false);
      setSelected(null);
      setAmount("");
      setAddress("");
      toast.success("Withdrawal requested!", {
        description: `${formatMoney(amt)} via ${selected.name} is now processing.`,
      });
    }, 900);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Withdraw Funds"
        subtitle="Cash out instantly via 12+ payment methods"
        icon="ArrowUpFromLine"
        action={
          <Badge variant="success">
            <Icons.Zap size={10} /> Instant payouts
          </Badge>
        }
      />

      {/* Balance banner */}
      <div className="glass-strong rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#E53935]/15 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider">Available for withdrawal</p>
            <p className="text-4xl font-black mt-1 text-gradient-red">{formatMoney(user.currentBalance)}</p>
            <p className="text-xs text-white/50 mt-1">+ {formatMoney(user.pendingBalance)} pending from offers</p>
          </div>
          <div className="flex gap-3">
            <div className="glass rounded-xl p-3 text-center">
              <p className="text-xs text-white/50">Min withdrawal</p>
              <p className="font-black text-sm">{formatMoney(2)}</p>
            </div>
            <div className="glass rounded-xl p-3 text-center">
              <p className="text-xs text-white/50">Lifetime cashed out</p>
              <p className="font-black text-sm">{formatMoney(user.lifetimeWithdrawals)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Methods */}
        <div className="lg:col-span-1">
          <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Payment Methods</p>
          <div className="space-y-2 max-h-[480px] overflow-y-auto scrollbar-gpt pr-1">
            {paymentMethods.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m)}
                disabled={!m.enabled}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                  selected?.id === m.id ? "glass ring-2 ring-[#E53935]" : "glass glass-hover",
                  !m.enabled && "opacity-40 cursor-not-allowed"
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl shrink-0">
                  {m.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{m.name}</p>
                  <p className="text-[10px] text-white/40">Min {formatMoney(m.minAmount)} • {m.processingTime}</p>
                </div>
                {m.fee > 0 && (
                  <span className="text-[10px] text-white/40">
                    {m.feeType === "percent" ? `${m.fee}%` : formatMoney(m.fee)} fee
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          {selected ? (
            <GlassPanel>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                  {selected.icon}
                </div>
                <div>
                  <p className="font-bold">{selected.name}</p>
                  <p className="text-xs text-white/50">Min {formatMoney(selected.minAmount)} • Fee {selected.feeType === "percent" ? `${selected.fee}%` : formatMoney(selected.fee)} • {selected.processingTime}</p>
                </div>
              </div>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 mb-1.5 block">Amount (USD)</label>
                  <div className="relative">
                    <Icons.DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-lg font-bold focus:outline-none focus:border-[#E53935]/50 transition-all"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[25, 50, 100, "Max"].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setAmount(v === "Max" ? String(user.currentBalance) : String(v))}
                        className="px-3 py-1 rounded-lg glass text-xs font-semibold hover:bg-white/10"
                      >
                        {v === "Max" ? "Max" : formatMoney(v as number)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 mb-1.5 block">
                    {selected.type === "crypto" ? "Wallet Address" : selected.type === "mobile" ? "Mobile Number" : "Account / Email"}
                  </label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={selected.type === "crypto" ? "Enter your wallet address" : selected.type === "mobile" ? "01XXXXXXXXX" : "Enter your account"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E53935]/50 transition-all"
                  />
                </div>
                <div className="glass rounded-xl p-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Amount</span>
                    <span className="font-semibold">{formatMoney(parseFloat(amount) || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Network fee</span>
                    <span className="font-semibold text-[#E53935]">- {formatMoney(selected.feeType === "percent" ? ((parseFloat(amount) || 0) * selected.fee) / 100 : selected.fee)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-white/8">
                    <span className="font-bold">You receive</span>
                    <span className="font-black text-green-400">
                      {formatMoney((parseFloat(amount) || 0) - (selected.feeType === "percent" ? ((parseFloat(amount) || 0) * selected.fee) / 100 : selected.fee))}
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E53935] to-[#ff5a56] text-white font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-60 flex items-center justify-center gap-2 accent-glow"
                >
                  {loading ? (
                    <><Icons.Loader2 size={16} className="animate-spin" /> Processing...</>
                  ) : (
                    <>Request Withdrawal <Icons.ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            </GlassPanel>
          ) : (
            <GlassPanel className="h-full flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-4 text-white/40">
                  <Icons.Wallet size={28} />
                </div>
                <p className="font-semibold text-white/70">Select a payment method</p>
                <p className="text-sm text-white/40 mt-1">Choose from 12+ payout options on the left.</p>
              </div>
            </GlassPanel>
          )}

          {/* Recent withdrawals */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Recent Withdrawals</p>
            <div className="space-y-2">
              {withdrawals.slice(0, 5).map((w) => (
                <div key={w.id} className="flex items-center gap-3 p-3 rounded-xl glass">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                    <Icons.ArrowUpFromLine size={16} className="text-[#E53935]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{w.method}</p>
                    <p className="text-xs text-white/40">{w.address} • {w.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm">{formatMoney(w.amount)}</p>
                    <Badge variant={w.status === "completed" ? "success" : w.status === "processing" ? "info" : w.status === "pending" ? "warning" : "danger"}>
                      {w.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DepositView() {
  const { user, addDeposit, deposits } = useStore();
  const [selected, setSelected] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const depositMethods = paymentMethods.filter((m) => ["binance", "usdt_trc", "usdt_bep", "bkash", "nagad", "rocket", "bank"].includes(m.id));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const amt = parseFloat(amount);
    if (!amt || amt < selected.minAmount) {
      toast.error("Amount too low", { description: `Minimum is ${formatMoney(selected.minAmount)}.` });
      return;
    }
    setLoading(true);
    const bonus = +(amt * 0.05).toFixed(2);
    setTimeout(() => {
      addDeposit({ method: selected.name, amount: amt, status: "pending", bonus });
      setLoading(false);
      setSelected(null);
      setAmount("");
      toast.success("Deposit submitted!", {
        description: `${formatMoney(amt)} via ${selected.name} + ${formatMoney(bonus)} bonus pending verification.`,
      });
    }, 900);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Deposit Funds"
        subtitle="Top up your balance and get a 5% bonus on every deposit"
        icon="ArrowDownToLine"
        action={<Badge variant="success"><Icons.Gift size={10} /> +5% bonus</Badge>}
      />

      <div className="glass-strong rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-green-500/15 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider">Current Balance</p>
            <p className="text-4xl font-black mt-1 text-green-400">{formatMoney(user.currentBalance)}</p>
          </div>
          <div className="glass rounded-xl p-3">
            <p className="text-xs text-white/50">Lifetime deposits</p>
            <p className="font-black text-sm">{formatMoney(850)}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Deposit Methods</p>
          <div className="space-y-2">
            {depositMethods.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                  selected?.id === m.id ? "glass ring-2 ring-green-500" : "glass glass-hover"
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl shrink-0">
                  {m.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{m.name}</p>
                  <p className="text-[10px] text-white/40">Min {formatMoney(m.minAmount)} • {m.processingTime}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <GlassPanel>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                  {selected.icon}
                </div>
                <div>
                  <p className="font-bold">{selected.name}</p>
                  <p className="text-xs text-white/50">Min {formatMoney(selected.minAmount)} • {selected.processingTime}</p>
                </div>
              </div>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 mb-1.5 block">Amount (USD)</label>
                  <div className="relative">
                    <Icons.DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-lg font-bold focus:outline-none focus:border-green-500/50 transition-all"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[20, 50, 100, 500].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setAmount(String(v))}
                        className="px-3 py-1 rounded-lg glass text-xs font-semibold hover:bg-white/10"
                      >
                        {formatMoney(v)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="glass rounded-xl p-4 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Icons.Gift size={16} className="text-green-400" />
                    <span className="text-sm font-bold text-green-400">Deposit Bonus: +5%</span>
                  </div>
                  <p className="text-xs text-white/60">
                    Deposit {formatMoney(parseFloat(amount) || 0)} and receive an extra{" "}
                    <span className="font-bold text-green-400">{formatMoney((parseFloat(amount) || 0) * 0.05)}</span> bonus instantly!
                  </p>
                </div>
                <div className="glass rounded-xl p-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Deposit amount</span>
                    <span className="font-semibold">{formatMoney(parseFloat(amount) || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Bonus (5%)</span>
                    <span className="font-semibold text-green-400">+ {formatMoney((parseFloat(amount) || 0) * 0.05)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-white/8">
                    <span className="font-bold">Total credited</span>
                    <span className="font-black text-green-400">{formatMoney((parseFloat(amount) || 0) * 1.05)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Icons.Loader2 size={16} className="animate-spin" /> Processing...</>
                  ) : (
                    <>Submit Deposit <Icons.ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            </GlassPanel>
          ) : (
            <GlassPanel className="h-full flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-4 text-white/40">
                  <Icons.ArrowDownToLine size={28} />
                </div>
                <p className="font-semibold text-white/70">Select a deposit method</p>
                <p className="text-sm text-white/40 mt-1">Choose a payment method to get started.</p>
              </div>
            </GlassPanel>
          )}

          <div className="mt-6">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Recent Deposits</p>
            <div className="space-y-2">
              {deposits.slice(0, 5).map((d) => (
                <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl glass">
                  <div className="w-9 h-9 rounded-lg bg-green-500/15 flex items-center justify-center">
                    <Icons.ArrowDownToLine size={16} className="text-green-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{d.method}</p>
                    <p className="text-xs text-white/40">{d.date} • +{formatMoney(d.bonus)} bonus</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-green-400">+{formatMoney(d.amount)}</p>
                    <Badge variant={d.status === "completed" ? "success" : d.status === "pending" ? "warning" : "danger"}>
                      {d.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
