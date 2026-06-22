"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { revenueChart, levelConfig } from "@/lib/data";
import type { RevenueStat, AdminUserExtended, AdvertisingPartner } from "@/lib/data";
import type { PaymentMethod, Level, PromoCode } from "@/lib/types";
import { SectionHeader, Badge, GlassPanel, StatCard } from "./ui";
import * as Icons from "lucide-react";
import { formatMoney, formatNumber, compact } from "@/lib/helpers";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

const ICON_OPTIONS = ["DollarSign", "Users", "ArrowUpFromLine", "ArrowDownToLine", "Store", "TrendingUp", "Wallet", "Gift", "Trophy", "Star", "Zap", "Target"];
const COLOR_OPTIONS = ["#E53935", "#22C55E", "#3B82F6", "#F59E0B", "#A855F7", "#22D3EE", "#EC4899", "#84CC16"];

// ============================================================
// REVENUE TAB — fully editable stat cards (add/edit/delete)
// ============================================================
export function AdminRevenue() {
  const { registeredUsers, adminUsers, withdrawals, deposits, promoUsages, activities, partners } = useStore();

  // Compute REAL stats from actual store data
  const totalUsers = registeredUsers.length + adminUsers.length + 1; // +1 for demo user
  const totalRevenue = activities
    .filter((a) => a.type === "offer" || a.type === "survey")
    .reduce((s, a) => s + (a.amount > 0 ? a.amount : 0), 0);
  const pendingWithdrawals = withdrawals.filter((w) => w.status === "pending" || w.status === "processing");
  const pendingDeposits = deposits.filter((d) => d.status === "pending");
  const pendingWithdrawalAmount = pendingWithdrawals.reduce((s, w) => s + w.amount, 0);
  const pendingDepositAmount = pendingDeposits.reduce((s, d) => s + d.amount, 0);
  const totalPaidOut = activities
    .filter((a) => a.type === "bonus" || a.type === "referral")
    .reduce((s, a) => s + (a.amount > 0 ? a.amount : 0), 0);
  const activePartners = partners.filter((p) => p.enabled).length;

  const stats = [
    { title: "Total Users", value: String(totalUsers), icon: "Users", accent: "#3B82F6", trend: `${registeredUsers.length} registered` },
    { title: "Total Revenue", value: formatMoney(totalRevenue), icon: "DollarSign", accent: "#22C55E", trend: "from offers & surveys" },
    { title: "Pending Withdrawals", value: formatMoney(pendingWithdrawalAmount), icon: "ArrowUpFromLine", accent: "#F59E0B", trend: `${pendingWithdrawals.length} requests` },
    { title: "Pending Deposits", value: formatMoney(pendingDepositAmount), icon: "ArrowDownToLine", accent: "#22C55E", trend: `${pendingDeposits.length} requests` },
    { title: "Total Paid Out", value: formatMoney(totalPaidOut), icon: "Gift", accent: "#A855F7", trend: "bonuses & rewards" },
    { title: "Active Partners", value: String(activePartners), icon: "Webhook", accent: "#E53935", trend: `${partners.length} total integrated` },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Revenue Dashboard"
        subtitle="Real-time platform statistics — computed from actual data (read-only)"
        icon="TrendingUp"
      />

      {/* Real stat cards — read only, not editable */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = (Icons as any)[stat.icon] ?? Icons.Circle;
          return (
            <div key={i} className="glass rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-20" style={{ background: stat.accent }} />
              <div className="flex items-start justify-between relative">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider font-medium">{stat.title}</p>
                  <p className="text-2xl font-black mt-2 tracking-tight">{stat.value}</p>
                  <p className="text-xs mt-2 text-white/40">{stat.trend}</p>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${stat.accent}22`, color: stat.accent }}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info banner */}
      <div className="glass rounded-2xl p-4 border border-blue-500/20">
        <div className="flex items-center gap-3">
          <Icons.Info size={18} className="text-blue-400 shrink-0" />
          <p className="text-sm text-white/60">
            These statistics are <span className="font-bold text-white">automatically computed</span> from real platform data (registered users, transactions, withdrawals, deposits, partner integrations). They update in real-time and cannot be manually edited.
          </p>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="glass rounded-2xl p-5">
        <SectionHeader title="Recent Transactions" subtitle="Latest platform activity" icon="Activity" />
        {activities.length === 0 ? (
          <div className="text-center py-8 text-white/40">
            <Icons.Activity size={32} className="mx-auto mb-2 opacity-50" />
            No transactions yet. Activity will appear here as users complete offers and earn rewards.
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-gpt">
            {activities.slice(0, 10).map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl glass">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold">
                  {a.type === "offer" ? "🎮" : a.type === "survey" ? "📋" : a.type === "bonus" ? "🎁" : a.type === "referral" ? "👥" : a.type === "withdrawal" ? "💸" : "💰"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{a.title}</p>
                  <p className="text-xs text-white/40">{a.timestamp} • {a.type}</p>
                </div>
                <p className={`font-black text-sm ${a.amount < 0 ? "text-[#E53935]" : "text-green-400"}`}>
                  {a.amount < 0 ? "" : "+"}{formatMoney(a.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ADVANCED USER MANAGEMENT
// ============================================================
export function AdminUsersAdvanced() {
  const { adminUsers, updateAdminUser, deleteAdminUser } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "banned" | "suspended">("all");
  const [editing, setEditing] = useState<AdminUserExtended | null>(null);
  const [viewing, setViewing] = useState<AdminUserExtended | null>(null);

  const filtered = adminUsers.filter(
    (u) =>
      (filter === "all" || u.status === filter) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const act = (user: AdminUserExtended, action: string) => {
    const updates: any = {};
    if (action === "Activate") updates.status = "active";
    else if (action === "Suspend") updates.status = "suspended";
    else if (action === "Ban") updates.status = "banned";
    else if (action === "Verify") updates.verified = true;
    else if (action === "Unverify") updates.verified = false;
    else if (action === "Approve KYC") updates.kycStatus = "verified";
    else if (action === "Reject KYC") updates.kycStatus = "rejected";
    updateAdminUser(user.id, updates);
    toast.success(`${action}: ${user.name}`);
  };

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={String(adminUsers.length)} icon="Users" accent="#3B82F6" />
        <StatCard title="Active" value={String(adminUsers.filter((u) => u.status === "active").length)} icon="CheckCircle2" accent="#22C55E" />
        <StatCard title="Suspended" value={String(adminUsers.filter((u) => u.status === "suspended").length)} icon="AlertTriangle" accent="#F59E0B" />
        <StatCard title="Banned" value={String(adminUsers.filter((u) => u.status === "banned").length)} icon="Ban" accent="#E53935" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icons.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users by name or email..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
        </div>
        <div className="flex p-1 rounded-xl bg-white/5">
          {(["all", "active", "suspended", "banned"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn("px-4 py-2 rounded-lg text-xs font-semibold capitalize", filter === f ? "bg-[#E53935] text-white" : "text-white/60")}>{f}</button>
          ))}
        </div>
      </div>

      <GlassPanel className="p-0 overflow-hidden">
        <div className="overflow-x-auto scrollbar-gpt">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-xs text-white/50 uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-semibold">User</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Balance</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">XP / Level</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">KYC</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#102C57] to-[#081B33] flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate flex items-center gap-1">
                          {u.name}
                          {u.verified && <Icons.BadgeCheck size={12} className="text-blue-400" />}
                          {u.twoFactorEnabled && <Icons.Shield size={11} className="text-green-400" />}
                        </p>
                        <p className="text-xs text-white/40 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-green-400 hidden sm:table-cell">{formatMoney(u.balance)}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-xs text-white/60">{compact(u.xp)} XP</p>
                    <Badge variant="gold">{u.level}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <Badge variant={u.kycStatus === "verified" ? "success" : u.kycStatus === "pending" ? "warning" : u.kycStatus === "rejected" ? "danger" : "default"}>
                      {u.kycStatus.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={u.status === "active" ? "success" : u.status === "suspended" ? "warning" : "danger"}>{u.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewing(u)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white" title="View details"><Icons.Eye size={14} /></button>
                      <button onClick={() => setEditing(u)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white" title="Edit"><Icons.Pencil size={14} /></button>
                      {u.status === "active" ? (
                        <>
                          <button onClick={() => act(u, "Suspend")} className="p-1.5 rounded-lg hover:bg-yellow-500/15 text-white/60 hover:text-yellow-400" title="Suspend"><Icons.Pause size={14} /></button>
                          <button onClick={() => act(u, "Ban")} className="p-1.5 rounded-lg hover:bg-[#E53935]/15 text-white/60 hover:text-[#E53935]" title="Ban"><Icons.Ban size={14} /></button>
                        </>
                      ) : (
                        <button onClick={() => act(u, "Activate")} className="p-1.5 rounded-lg hover:bg-green-500/15 text-white/60 hover:text-green-400" title="Activate"><Icons.Play size={14} /></button>
                      )}
                      {!u.verified && <button onClick={() => act(u, "Verify")} className="p-1.5 rounded-lg hover:bg-blue-500/15 text-white/60 hover:text-blue-400" title="Verify"><Icons.Check size={14} /></button>}
                      {u.kycStatus === "pending" && (
                        <>
                          <button onClick={() => act(u, "Approve KYC")} className="p-1.5 rounded-lg hover:bg-green-500/15 text-white/60 hover:text-green-400" title="Approve KYC"><Icons.ShieldCheck size={14} /></button>
                          <button onClick={() => act(u, "Reject KYC")} className="p-1.5 rounded-lg hover:bg-[#E53935]/15 text-white/60 hover:text-[#E53935]" title="Reject KYC"><Icons.X size={14} /></button>
                        </>
                      )}
                      <button onClick={() => { if (confirm(`Delete ${u.name}?`)) { deleteAdminUser(u.id); toast.success("User deleted"); } }} className="p-1.5 rounded-lg hover:bg-[#E53935]/15 text-white/60 hover:text-[#E53935]" title="Delete"><Icons.Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      {editing && <EditUserModal user={editing} onClose={() => setEditing(null)} onSave={(updates) => { updateAdminUser(editing.id, updates); toast.success("User updated!"); setEditing(null); }} />}
      {viewing && <UserDetailModal user={viewing} onClose={() => setViewing(null)} onEdit={() => { setEditing(viewing); setViewing(null); }} />}
    </div>
  );
}

function EditUserModal({ user, onClose, onSave }: { user: AdminUserExtended; onClose: () => void; onSave: (u: Partial<AdminUserExtended>) => void }) {
  const [balance, setBalance] = useState(user.balance);
  const [xp, setXp] = useState(user.xp);
  const [level, setLevel] = useState<Level>(user.level);
  const [status, setStatus] = useState(user.status);
  const [verified, setVerified] = useState(user.verified);
  const [totalEarnings, setTotalEarnings] = useState(user.totalEarnings);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-gpt" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#102C57] to-[#081B33] flex items-center justify-center font-bold">{user.name.charAt(0)}</div>
            <div>
              <h3 className="font-black text-lg">Edit User</h3>
              <p className="text-xs text-white/50">{user.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white"><Icons.X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">Balance ($)</label>
            <input type="number" step="0.01" value={balance} onChange={(e) => setBalance(parseFloat(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">Total Earnings ($)</label>
            <input type="number" step="0.01" value={totalEarnings} onChange={(e) => setTotalEarnings(parseFloat(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">XP</label>
            <input type="number" value={xp} onChange={(e) => setXp(parseInt(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">Level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50">
              {Object.keys(levelConfig).map((l) => <option key={l} value={l} className="bg-[#081B33]">{l}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50">
              <option value="active" className="bg-[#081B33]">Active</option>
              <option value="suspended" className="bg-[#081B33]">Suspended</option>
              <option value="banned" className="bg-[#081B33]">Banned</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="accent-[#E53935] w-4 h-4 rounded" />
            <span className="text-white/80">Verified user</span>
          </label>
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold">Cancel</button>
            <button onClick={() => onSave({ balance, xp, level, status, verified, totalEarnings })} className="flex-1 py-2.5 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white text-sm font-bold">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserDetailModal({ user, onClose, onEdit }: { user: AdminUserExtended; onClose: () => void; onEdit: () => void }) {
  const details = [
    { label: "User ID", value: user.id },
    { label: "Email", value: user.email },
    { label: "Country", value: user.country },
    { label: "Joined", value: user.joinedAt },
    { label: "Last Active", value: user.lastActive },
    { label: "IP Address", value: user.ipAddress },
    { label: "Referral Code", value: user.referralCode },
    { label: "Total Earnings", value: formatMoney(user.totalEarnings) },
    { label: "Balance", value: formatMoney(user.balance) },
    { label: "XP", value: formatNumber(user.xp) },
    { label: "Level", value: user.level },
    { label: "KYC Status", value: user.kycStatus.replace("_", " ") },
    { label: "Email Verified", value: user.emailVerified ? "Yes" : "No" },
    { label: "2FA Enabled", value: user.twoFactorEnabled ? "Yes" : "No" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-gpt" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#102C57] to-[#081B33] flex items-center justify-center font-bold text-lg">{user.name.charAt(0)}</div>
            <div>
              <h3 className="font-black text-lg flex items-center gap-2">{user.name} {user.verified && <Icons.BadgeCheck size={14} className="text-blue-400" />}</h3>
              <p className="text-xs text-white/50">User Details</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white"><Icons.X size={20} /></button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {details.map((d) => (
            <div key={d.label} className="glass rounded-xl p-3">
              <p className="text-[10px] text-white/40 uppercase tracking-wider">{d.label}</p>
              <p className="text-sm font-semibold mt-0.5 truncate">{d.value}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold">Close</button>
          <button onClick={onEdit} className="flex-1 py-2.5 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white text-sm font-bold flex items-center justify-center gap-2"><Icons.Pencil size={14} /> Edit User</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAYMENT METHODS MANAGEMENT (add / remove / edit)
// ============================================================
export function AdminPaymentMethods() {
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = useStore();
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Payment Methods"
        subtitle="Add, edit, remove or toggle any payout / deposit method"
        icon="CreditCard"
        action={
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white text-xs font-bold flex items-center gap-2">
            <Icons.Plus size={14} /> Add Method
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentMethods.map((m) => (
          <div key={m.id} className="glass glass-hover rounded-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">{m.icon}</div>
                <div>
                  <p className="font-bold text-sm">{m.name}</p>
                  <Badge variant={m.type === "crypto" ? "info" : m.type === "mobile" ? "gold" : "default"}>{m.type}</Badge>
                </div>
              </div>
              <button
                onClick={() => { updatePaymentMethod(m.id, { enabled: !m.enabled }); toast.success(`${m.name} ${m.enabled ? "disabled" : "enabled"}`); }}
                className={cn("relative w-10 h-5 rounded-full transition-colors", m.enabled ? "bg-green-500" : "bg-white/15")}
              >
                <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform", m.enabled ? "translate-x-5" : "translate-x-0.5")} />
              </button>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-white/50">Min amount</span><span className="font-bold">{formatMoney(m.minAmount)}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Fee</span><span className="font-bold">{m.feeType === "percent" ? `${m.fee}%` : formatMoney(m.fee)}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Processing</span><span className="font-semibold">{m.processingTime}</span></div>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-white/8">
              <button onClick={() => setEditing(m)} className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-1.5"><Icons.Pencil size={12} /> Edit</button>
              <button onClick={() => { if (confirm(`Delete ${m.name}?`)) { deletePaymentMethod(m.id); toast.success("Method deleted"); } }} className="py-1.5 px-3 rounded-lg bg-[#E53935]/15 text-[#ff6b6b] hover:bg-[#E53935]/25 text-xs font-semibold"><Icons.Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && <PaymentMethodModal method={editing} onClose={() => setEditing(null)} onSave={(updates) => { updatePaymentMethod(editing.id, updates); toast.success("Method updated!"); setEditing(null); }} />}
      {showAdd && <PaymentMethodModal onClose={() => setShowAdd(false)} onSave={(m) => { addPaymentMethod(m as Omit<PaymentMethod, "id">); toast.success("Method added!"); setShowAdd(false); }} />}
    </div>
  );
}

function PaymentMethodModal({ method, onClose, onSave }: { method?: PaymentMethod; onClose: () => void; onSave: (m: any) => void }) {
  const [name, setName] = useState(method?.name ?? "");
  const [icon, setIcon] = useState(method?.icon ?? "💳");
  const [type, setType] = useState<PaymentMethod["type"]>(method?.type ?? "fiat");
  const [minAmount, setMinAmount] = useState(method?.minAmount ?? 2);
  const [fee, setFee] = useState(method?.fee ?? 0);
  const [feeType, setFeeType] = useState<PaymentMethod["feeType"]>(method?.feeType ?? "fixed");
  const [processingTime, setProcessingTime] = useState(method?.processingTime ?? "Instant");
  const [enabled, setEnabled] = useState(method?.enabled ?? true);

  const EMOJI_OPTIONS = ["💳", "🅿️", "🟡", "💵", "🪙", "₿", "Ξ", "💠", "🏦", "📱", "📲", "🚀", "💰", "🏷️", "⚡", "🎁"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-gpt" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-lg">{method ? "Edit Payment Method" : "Add Payment Method"}</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white"><Icons.X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">Method Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. PayPal, bKash, USDT" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">Icon</label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_OPTIONS.map((em) => (
                <button key={em} type="button" onClick={() => setIcon(em)} className={cn("aspect-square rounded-lg flex items-center justify-center text-xl transition-all", icon === em ? "bg-[#E53935]" : "bg-white/5 hover:bg-white/10")}>{em}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50">
                <option value="fiat" className="bg-[#081B33]">Fiat</option>
                <option value="crypto" className="bg-[#081B33]">Crypto</option>
                <option value="mobile" className="bg-[#081B33]">Mobile</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Min Amount ($)</label>
              <input type="number" step="0.01" value={minAmount} onChange={(e) => setMinAmount(parseFloat(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Fee</label>
              <input type="number" step="0.01" value={fee} onChange={(e) => setFee(parseFloat(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Fee Type</label>
              <select value={feeType} onChange={(e) => setFeeType(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50">
                <option value="fixed" className="bg-[#081B33]">Fixed ($)</option>
                <option value="percent" className="bg-[#081B33]">Percent (%)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">Processing Time</label>
            <input value={processingTime} onChange={(e) => setProcessingTime(e.target.value)} placeholder="Instant" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="accent-[#E53935] w-4 h-4 rounded" />
            <span className="text-white/80">Enabled (visible to users)</span>
          </label>
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold">Cancel</button>
            <button onClick={() => onSave({ name, icon, type, minAmount, fee, feeType, processingTime, enabled })} disabled={!name} className="flex-1 py-2.5 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white text-sm font-bold disabled:opacity-50">
              {method ? "Save Changes" : "Add Method"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// OFFERWALL INTEGRATION (Advertising Partners)
// ============================================================
export function AdminOfferwallIntegration() {
  const { partners, addPartner, updatePartner, deletePartner } = useStore();
  const [editing, setEditing] = useState<AdvertisingPartner | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const totalEarnings = partners.reduce((s, p) => s + p.earnings, 0);
  const activeCount = partners.filter((p) => p.enabled).length;

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Offerwall Integration"
        subtitle="Manage advertising partners — add, remove, edit API credentials"
        icon="Webhook"
        action={
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white text-xs font-bold flex items-center gap-2">
            <Icons.Plus size={14} /> Add Partner
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Partners" value={String(partners.length)} icon="Grid3x3" accent="#3B82F6" />
        <StatCard title="Active" value={String(activeCount)} icon="CheckCircle2" accent="#22C55E" />
        <StatCard title="Partner Earnings" value={formatMoney(totalEarnings)} icon="DollarSign" accent="#E53935" />
        <StatCard title="Total Offers" value={String(partners.reduce((s, p) => s + p.totalOffers, 0))} icon="Store" accent="#A855F7" />
      </div>

      {/* Postback info banner */}
      <GlassPanel className="bg-gradient-to-br from-[#102C57]/40 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E53935]/15 flex items-center justify-center text-[#E53935]"><Icons.Webhook size={22} /></div>
          <div className="flex-1">
            <p className="font-bold">Postback Configuration</p>
            <p className="text-sm text-white/50">Each partner uses a unique postback URL for server-to-server reward verification.</p>
          </div>
          <code className="hidden sm:block px-3 py-2 rounded-lg bg-black/30 text-xs text-green-400 font-mono">/api/postback/{"{slug}"}</code>
        </div>
      </GlassPanel>

      {/* Partner cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {partners.map((p) => (
          <div key={p.id} className="glass glass-hover rounded-2xl overflow-hidden relative">
            {/* Performance badge */}
            <div className={cn("absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[9px] font-black", p.performance.startsWith("+") ? "bg-green-500 text-white" : "bg-[#E53935] text-white")}>
              {p.performance}
            </div>
            {/* Logo header */}
            <div className="h-24 flex items-center justify-center relative" style={{ background: p.bgColor }}>
              <span className="font-black text-lg text-center px-2" style={{ color: p.textColor }}>{p.logo}</span>
              {!p.enabled && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Badge variant="danger">Disabled</Badge></div>}
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-sm">{p.name}</p>
                <span className="flex items-center gap-0.5 text-[10px]"><Icons.Star size={9} className="text-yellow-400" /> {p.rating}</span>
              </div>
              <div className="space-y-1 text-[10px] text-white/50 mb-3">
                <div className="flex justify-between"><span>Offers</span><span className="font-bold text-white/70">{p.totalOffers}</span></div>
                <div className="flex justify-between"><span>Avg payout</span><span className="font-bold text-green-400">{formatMoney(p.avgPayout)}</span></div>
                <div className="flex justify-between"><span>Earnings</span><span className="font-bold text-white/70">{formatMoney(p.earnings)}</span></div>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <code className="flex-1 px-2 py-1 rounded bg-black/30 text-[9px] text-white/50 font-mono truncate">{p.apiKey}</code>
                <button onClick={() => { navigator.clipboard?.writeText(p.apiKey); toast.success("API key copied"); }} className="p-1 rounded bg-white/5 hover:bg-white/10"><Icons.Copy size={10} className="text-white/60" /></button>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(p)} className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-semibold flex items-center justify-center gap-1"><Icons.Pencil size={10} /> Edit</button>
                <button onClick={() => { updatePartner(p.id, { enabled: !p.enabled }); toast.success(`${p.name} ${p.enabled ? "disabled" : "enabled"}`); }} className={cn("py-1.5 px-2 rounded-lg text-[10px] font-semibold", p.enabled ? "bg-[#E53935]/15 text-[#ff6b6b]" : "bg-green-500/15 text-green-400")}>
                  {p.enabled ? <Icons.Power size={10} /> : <Icons.Power size={10} />}
                </button>
                <button onClick={() => { if (confirm(`Delete ${p.name}?`)) { deletePartner(p.id); toast.success("Partner deleted"); } }} className="py-1.5 px-2 rounded-lg bg-[#E53935]/15 text-[#ff6b6b] hover:bg-[#E53935]/25"><Icons.Trash2 size={10} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && <PartnerModal partner={editing} onClose={() => setEditing(null)} onSave={(updates) => { updatePartner(editing.id, updates); toast.success("Partner updated!"); setEditing(null); }} />}
      {showAdd && <PartnerModal onClose={() => setShowAdd(false)} onSave={(p) => { addPartner(p as Omit<AdvertisingPartner, "id">); toast.success("Partner added!"); setShowAdd(false); }} />}
    </div>
  );
}

function PartnerModal({ partner, onClose, onSave }: { partner?: AdvertisingPartner; onClose: () => void; onSave: (p: any) => void }) {
  const [name, setName] = useState(partner?.name ?? "");
  const [logo, setLogo] = useState(partner?.logo ?? "");
  const [bgColor, setBgColor] = useState(partner?.bgColor ?? "#3B82F6");
  const [textColor, setTextColor] = useState(partner?.textColor ?? "#FFFFFF");
  const [rating, setRating] = useState(partner?.rating ?? 4);
  const [performance, setPerformance] = useState(partner?.performance ?? "+10%");
  const [apiKey, setApiKey] = useState(partner?.apiKey ?? "");
  const [postbackUrl, setPostbackUrl] = useState(partner?.postbackUrl ?? `/api/postback/${name.toLowerCase() || "new"}`);
  const [totalOffers, setTotalOffers] = useState(partner?.totalOffers ?? 0);
  const [avgPayout, setAvgPayout] = useState(partner?.avgPayout ?? 1.5);
  const [earnings, setEarnings] = useState(partner?.earnings ?? 0);
  const [enabled, setEnabled] = useState(partner?.enabled ?? true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-gpt" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-lg">{partner ? "Edit Partner" : "Add Advertising Partner"}</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white"><Icons.X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Partner Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Notik" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Logo Text</label>
              <input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="NOTIK ME" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Background Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 rounded-lg bg-transparent cursor-pointer" />
                <input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E53935]/50" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Text Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-12 h-10 rounded-lg bg-transparent cursor-pointer" />
                <input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E53935]/50" />
              </div>
            </div>
          </div>
          {/* Preview */}
          <div className="h-20 rounded-xl flex items-center justify-center" style={{ background: bgColor }}>
            <span className="font-black text-lg" style={{ color: textColor }}>{logo || "Preview"}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Rating</label>
              <input type="number" step="0.1" min="0" max="5" value={rating} onChange={(e) => setRating(parseFloat(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Performance</label>
              <input value={performance} onChange={(e) => setPerformance(e.target.value)} placeholder="+15%" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Total Offers</label>
              <input type="number" value={totalOffers} onChange={(e) => setTotalOffers(parseInt(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">API Key</label>
            <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="nk_xxxxxxxxxxxx" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E53935]/50" />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">Postback URL</label>
            <input value={postbackUrl} onChange={(e) => setPostbackUrl(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E53935]/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Avg Payout ($)</label>
              <input type="number" step="0.01" value={avgPayout} onChange={(e) => setAvgPayout(parseFloat(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Earnings ($)</label>
              <input type="number" step="0.01" value={earnings} onChange={(e) => setEarnings(parseFloat(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="accent-[#E53935] w-4 h-4 rounded" />
            <span className="text-white/80">Enabled (live for users)</span>
          </label>
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold">Cancel</button>
            <button onClick={() => onSave({ name, logo, bgColor, textColor, rating, performance, apiKey, postbackUrl, totalOffers, avgPayout, earnings, enabled })} disabled={!name || !logo} className="flex-1 py-2.5 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white text-sm font-bold disabled:opacity-50">
              {partner ? "Save Changes" : "Add Partner"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PROMO CODES MANAGEMENT (create / edit / delete)
// ============================================================
export function AdminPromoCodes() {
  const { promoCodes, promoUsages, addPromoCode, updatePromoCode, deletePromoCode } = useStore();
  const [editing, setEditing] = useState<PromoCode | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showUsages, setShowUsages] = useState<string | null>(null);

  const activeCount = promoCodes.filter((p) => p.active && (!p.expiresAt || new Date(p.expiresAt) > new Date()) && (p.usageLimit === 0 || p.usedCount < p.usageLimit)).length;
  const totalRedeemed = promoCodes.reduce((s, p) => s + p.usedCount, 0);
  const totalPaid = promoUsages.reduce((s, u) => s + u.reward, 0);

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Promo Codes"
        subtitle="Create and manage promo codes — users redeem them for instant rewards"
        icon="Ticket"
        action={
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white text-xs font-bold flex items-center gap-2">
            <Icons.Plus size={14} /> Create Code
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Codes" value={String(promoCodes.length)} icon="Ticket" accent="#3B82F6" />
        <StatCard title="Active" value={String(activeCount)} icon="CheckCircle2" accent="#22C55E" />
        <StatCard title="Total Redemptions" value={String(totalRedeemed)} icon="Users" accent="#F59E0B" />
        <StatCard title="Total Paid Out" value={formatMoney(totalPaid)} icon="DollarSign" accent="#E53935" />
      </div>

      {/* Promo codes table */}
      <GlassPanel className="p-0 overflow-hidden">
        <div className="overflow-x-auto scrollbar-gpt">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-xs text-white/50 uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-semibold">Code</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Reward</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Usage</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Expires</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((p) => {
                const expired = p.expiresAt && new Date(p.expiresAt) < new Date();
                const exhausted = p.usageLimit > 0 && p.usedCount >= p.usageLimit;
                const status = !p.active ? "Inactive" : expired ? "Expired" : exhausted ? "Used Up" : "Active";
                const statusVariant = status === "Active" ? "success" : "default";
                return (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-mono font-bold text-sm">{p.code}</p>
                      <p className="text-xs text-white/40">{p.description}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="font-bold text-green-400">{p.type === "fixed" ? formatMoney(p.reward) : `${p.reward}%`}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-white/60">{p.usedCount}{p.usageLimit > 0 ? ` / ${p.usageLimit}` : ""} used</span>
                      <button onClick={() => setShowUsages(showUsages === p.id ? null : p.id)} className="ml-2 text-[10px] text-[#E53935] hover:underline">view</button>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-white/50">{p.expiresAt || "Never"}</td>
                    <td className="px-4 py-3"><Badge variant={statusVariant as any}>{status}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditing(p)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white" title="Edit"><Icons.Pencil size={14} /></button>
                        <button onClick={() => { updatePromoCode(p.id, { active: !p.active }); toast.success(`${p.code} ${p.active ? "deactivated" : "activated"}`); }} className={cn("p-1.5 rounded-lg", p.active ? "hover:bg-[#E53935]/15 text-white/60 hover:text-[#E53935]" : "hover:bg-green-500/15 text-white/60 hover:text-green-400")} title={p.active ? "Deactivate" : "Activate"}><Icons.Power size={14} /></button>
                        <button onClick={() => { if (confirm(`Delete ${p.code}?`)) { deletePromoCode(p.id); toast.success("Promo code deleted"); } }} className="p-1.5 rounded-lg hover:bg-[#E53935]/15 text-white/60 hover:text-[#E53935]" title="Delete"><Icons.Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      {/* Usage details */}
      {showUsages && (
        <GlassPanel>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold">Redemptions for "{promoCodes.find((p) => p.id === showUsages)?.code}"</p>
            <button onClick={() => setShowUsages(null)} className="text-white/50 hover:text-white"><Icons.X size={16} /></button>
          </div>
          {promoUsages.filter((u) => u.promoCodeId === showUsages).length === 0 ? (
            <p className="text-sm text-white/40 text-center py-4">No redemptions yet</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-gpt">
              {promoUsages.filter((u) => u.promoCodeId === showUsages).map((u) => (
                <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg glass">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold">{u.userName.charAt(0)}</div>
                  <div className="flex-1"><p className="text-sm font-semibold">{u.userName}</p><p className="text-xs text-white/40">{u.createdAt}</p></div>
                  <p className="font-bold text-green-400">+{formatMoney(u.reward)}</p>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      )}

      {editing && <PromoCodeModal code={editing} onClose={() => setEditing(null)} onSave={(updates) => { updatePromoCode(editing.id, updates); toast.success("Promo code updated!"); setEditing(null); }} />}
      {showAdd && <PromoCodeModal onClose={() => setShowAdd(false)} onSave={(p) => { addPromoCode(p as any); toast.success("Promo code created!"); setShowAdd(false); }} />}
    </div>
  );
}

function PromoCodeModal({ code, onClose, onSave }: { code?: PromoCode; onClose: () => void; onSave: (p: any) => void }) {
  const [codeVal, setCodeVal] = useState(code?.code ?? "");
  const [description, setDescription] = useState(code?.description ?? "");
  const [type, setType] = useState<"fixed" | "percent">(code?.type ?? "fixed");
  const [reward, setReward] = useState(code?.reward ?? 10);
  const [usageLimit, setUsageLimit] = useState(code?.usageLimit ?? 100);
  const [expiresAt, setExpiresAt] = useState(code?.expiresAt ?? "");
  const [active, setActive] = useState(code?.active ?? true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-gpt" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-lg">{code ? "Edit Promo Code" : "Create Promo Code"}</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white"><Icons.X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">Code (uppercase)</label>
            <input value={codeVal} onChange={(e) => setCodeVal(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} placeholder="WELCOME10" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono uppercase tracking-wider focus:outline-none focus:border-[#E53935]/50" />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="New user welcome bonus" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50">
                <option value="fixed" className="bg-[#081B33]">Fixed ($)</option>
                <option value="percent" className="bg-[#081B33]">Percent (%)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">{type === "fixed" ? "Reward ($)" : "Reward (%)"}</label>
              <input type="number" step="0.01" value={reward} onChange={(e) => setReward(parseFloat(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Usage Limit (0 = unlimited)</label>
              <input type="number" value={usageLimit} onChange={(e) => setUsageLimit(parseInt(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Expires At (empty = never)</label>
              <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="accent-[#E53935] w-4 h-4 rounded" />
            <span className="text-white/80">Active (users can redeem)</span>
          </label>
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold">Cancel</button>
            <button onClick={() => onSave({ code: codeVal, description, type, reward, usageLimit, expiresAt: expiresAt || null, active })} disabled={!codeVal} className="flex-1 py-2.5 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white text-sm font-bold disabled:opacity-50">{code ? "Save Changes" : "Create Code"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SITE SETTINGS (general, SEO, SMTP, social, system)
// ============================================================
export function AdminSiteSettings() {
  const { siteSettings, updateSiteSettings } = useStore();
  const [section, setSection] = useState<"general" | "seo" | "smtp" | "social" | "system">("general");
  const [draft, setDraft] = useState(siteSettings);

  const dirty = JSON.stringify(draft) !== JSON.stringify(siteSettings);
  const save = () => { updateSiteSettings(draft); toast.success("Site settings saved!", { description: "All changes are now live." }); };
  const reset = () => { setDraft(siteSettings); toast.info("Changes discarded"); };

  const sections = [
    { id: "general" as const, label: "General", icon: "Globe" },
    { id: "seo" as const, label: "SEO", icon: "Search" },
    { id: "smtp" as const, label: "Email / SMTP", icon: "Mail" },
    { id: "social" as const, label: "Social Links", icon: "Share2" },
    { id: "system" as const, label: "System", icon: "Cog" },
  ];

  const field = (key: keyof typeof draft, label: string, opts?: { type?: string; placeholder?: string; mono?: boolean }) => (
    <div>
      <label className="text-xs font-semibold text-white/70 mb-1.5 block">{label}</label>
      <input type={opts?.type ?? "text"} value={String(draft[key])} onChange={(e) => setDraft({ ...draft, [key]: opts?.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value })} placeholder={opts?.placeholder} className={cn("w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50 transition-all", opts?.mono && "font-mono")} />
    </div>
  );
  const textarea = (key: keyof typeof draft, label: string, rows = 3) => (
    <div>
      <label className="text-xs font-semibold text-white/70 mb-1.5 block">{label}</label>
      <textarea value={String(draft[key])} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} rows={rows} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50 resize-none" />
    </div>
  );
  const toggle = (key: keyof typeof draft, label: string, desc?: string) => (
    <div className="flex items-center justify-between p-3 rounded-xl glass">
      <div><p className="text-sm font-semibold">{label}</p>{desc && <p className="text-xs text-white/40 mt-0.5">{desc}</p>}</div>
      <button onClick={() => setDraft({ ...draft, [key]: !draft[key] })} className={cn("relative w-10 h-5 rounded-full transition-colors shrink-0 ml-3", draft[key] ? "bg-green-500" : "bg-white/15")}><span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform", draft[key] ? "translate-x-5" : "translate-x-0.5")} /></button>
    </div>
  );

  return (
    <div className="space-y-4">
      <SectionHeader title="Site Settings" subtitle="Control your entire platform — site name, SEO, SMTP, social, maintenance mode" icon="Settings" action={dirty ? (
        <div className="flex gap-2">
          <button onClick={reset} className="px-4 py-2 rounded-xl glass hover:bg-white/10 text-xs font-semibold">Discard</button>
          <button onClick={save} className="px-4 py-2 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white text-xs font-bold flex items-center gap-2"><Icons.Save size={14} /> Save Changes</button>
        </div>
      ) : <Badge variant="success"><Icons.Check size={10} /> All saved</Badge>} />

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {sections.map((s) => { const Ic = (Icons as any)[s.icon]; return (
          <button key={s.id} onClick={() => setSection(s.id)} className={cn("px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all", section === s.id ? "bg-[#E53935] text-white" : "glass text-white/60 hover:text-white")}><Ic size={14} /> {s.label}</button>
        ); })}
      </div>

      {section === "general" && (
        <GlassPanel>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">{field("siteName", "Site Name")}{field("siteTagline", "Site Tagline")}</div>
            {textarea("siteDescription", "Site Description", 3)}
            <div className="grid sm:grid-cols-2 gap-4">{field("siteUrl", "Site URL (used for referral links)", { mono: true })}{field("logoText", "Logo Text (1-2 chars)")}</div>
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Accent Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={draft.accentColor} onChange={(e) => setDraft({ ...draft, accentColor: e.target.value })} className="w-14 h-10 rounded-lg bg-transparent cursor-pointer" />
                <input value={draft.accentColor} onChange={(e) => setDraft({ ...draft, accentColor: e.target.value })} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E53935]/50" />
                <div className="flex gap-1">{["#E53935", "#22C55E", "#3B82F6", "#A855F7", "#F59E0B"].map((c) => (<button key={c} onClick={() => setDraft({ ...draft, accentColor: c })} className="w-7 h-7 rounded-lg border-2 border-white/10 hover:border-white/40" style={{ background: c }} />))}</div>
              </div>
            </div>
          </div>
        </GlassPanel>
      )}
      {section === "seo" && (
        <GlassPanel><div className="space-y-4">{field("metaTitle", "Meta Title")}{textarea("metaDescription", "Meta Description", 3)}{field("metaKeywords", "Meta Keywords (comma-separated)")}</div></GlassPanel>
      )}
      {section === "smtp" && (
        <GlassPanel><div className="space-y-4"><div className="grid sm:grid-cols-2 gap-4">{field("smtpHost", "SMTP Host", { mono: true })}{field("smtpPort", "SMTP Port", { mono: true })}</div><div className="grid sm:grid-cols-2 gap-4">{field("smtpUsername", "SMTP Username", { mono: true })}{field("smtpPassword", "SMTP Password", { mono: true })}</div><div className="grid sm:grid-cols-2 gap-4">{field("smtpFromEmail", "From Email", { mono: true })}{field("smtpFromName", "From Name")}</div><button onClick={() => toast.success("Test email sent!")} className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold flex items-center justify-center gap-2"><Icons.Send size={14} /> Send Test Email</button></div></GlassPanel>
      )}
      {section === "social" && (
        <GlassPanel><div className="space-y-4">{field("facebookUrl", "Facebook URL", { mono: true })}{field("twitterUrl", "Twitter / X URL", { mono: true })}{field("discordUrl", "Discord URL", { mono: true })}{field("telegramUrl", "Telegram URL", { mono: true })}</div></GlassPanel>
      )}
      {section === "system" && (
        <div className="space-y-4">
          <GlassPanel><p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Platform Status</p><div className="space-y-2">{toggle("maintenanceMode", "Maintenance Mode", "Disables the site for non-admin users")}{toggle("registrationEnabled", "Registration Enabled")}{toggle("emailVerificationRequired", "Require Email Verification")}</div>{draft.maintenanceMode && <div className="mt-3">{textarea("maintenanceMessage", "Maintenance Message", 2)}</div>}</GlassPanel>
          <GlassPanel><p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Financial Settings</p><div className="grid sm:grid-cols-2 gap-4">{field("minWithdrawal", "Minimum Withdrawal ($)", { type: "number" })}<div className="flex items-end"><div className="text-xs text-white/50 p-3"><Icons.Info size={12} className="inline mr-1" />Users must have at least this balance to withdraw.</div></div></div><p className="text-xs font-semibold text-white/60 uppercase tracking-wider mt-5 mb-3">Referral Commission</p><div className="grid sm:grid-cols-3 gap-4">{field("referralCommissionL1", "Level 1 (%)", { type: "number" })}{field("referralCommissionL2", "Level 2 (%)", { type: "number" })}{field("referralCommissionL3", "Level 3 (%)", { type: "number" })}</div></GlassPanel>
        </div>
      )}
      {dirty && (
        <div className="sticky bottom-4 z-20 glass-strong rounded-2xl p-3 flex items-center justify-between border border-[#E53935]/30">
          <p className="text-sm font-semibold flex items-center gap-2"><Icons.AlertTriangle size={14} className="text-yellow-400" /> You have unsaved changes</p>
          <div className="flex gap-2"><button onClick={reset} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold">Discard</button><button onClick={save} className="px-4 py-2 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white text-xs font-bold flex items-center gap-2"><Icons.Save size={14} /> Save Now</button></div>
        </div>
      )}
    </div>
  );
}
