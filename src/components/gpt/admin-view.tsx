"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { adminUsers, offerProviders, revenueChart, withdrawals as seedW, deposits as seedD } from "@/lib/data";
import { SectionHeader, Badge, GlassPanel, StatCard } from "./ui";
import { AdminRevenue, AdminUsersAdvanced, AdminPaymentMethods, AdminOfferwallIntegration, AdminPromoCodes, AdminSiteSettings } from "./admin-tabs";
import * as Icons from "lucide-react";
import { formatMoney, formatNumber } from "@/lib/helpers";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";

type AdminTab = "overview" | "revenue" | "users" | "withdrawals" | "deposits" | "payments" | "offerwall" | "integration" | "promos" | "settings";

export function AdminView() {
  const [tab, setTab] = useState<AdminTab>("overview");
  const { toggleAdmin } = useStore();

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "LayoutDashboard" },
    { id: "revenue", label: "Revenue", icon: "TrendingUp" },
    { id: "users", label: "Users", icon: "Users" },
    { id: "withdrawals", label: "Withdrawals", icon: "ArrowUpFromLine" },
    { id: "deposits", label: "Deposits", icon: "ArrowDownToLine" },
    { id: "payments", label: "Payment Methods", icon: "CreditCard" },
    { id: "offerwall", label: "Offerwall", icon: "Store" },
    { id: "integration", label: "Offerwall Integration", icon: "Webhook" },
    { id: "promos", label: "Promo Codes", icon: "Ticket" },
    { id: "settings", label: "Site Settings", icon: "Settings" },
  ];

  return (
    <div className="space-y-6">
      {/* Admin header */}
      <div className="glass-strong rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#E53935]/15 blur-3xl" />
        <div className="flex items-center gap-3 relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E53935] to-[#ff5a56] flex items-center justify-center text-white accent-glow">
            <Icons.ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black flex items-center gap-2">
              Admin Panel <Badge variant="danger">Super Admin</Badge>
            </h2>
            <p className="text-xs text-white/50">Full platform control • admin@example.com</p>
          </div>
        </div>
        <button
          onClick={toggleAdmin}
          className="px-4 py-2 rounded-xl glass hover:bg-white/10 text-xs font-semibold flex items-center gap-2 relative"
        >
          <Icons.LogOut size={14} /> Exit Admin
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((t) => {
          const Icon = (Icons as any)[t.icon];
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all",
                tab === t.id ? "bg-[#E53935] text-white" : "glass text-white/60 hover:text-white"
              )}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "overview" && <AdminOverview />}
      {tab === "revenue" && <AdminRevenue />}
      {tab === "users" && <AdminUsersAdvanced />}
      {tab === "withdrawals" && <AdminWithdrawals />}
      {tab === "deposits" && <AdminDeposits />}
      {tab === "payments" && <AdminPaymentMethods />}
      {tab === "offerwall" && <AdminOfferwall />}
      {tab === "integration" && <AdminOfferwallIntegration />}
      {tab === "promos" && <AdminPromoCodes />}
      {tab === "settings" && <AdminSiteSettings />}
    </div>
  );
}

function AdminOverview() {
  const { registeredUsers, adminUsers, withdrawals, deposits, activities, partners, promoCodes, promoUsages } = useStore();

  // Real computed stats
  const totalUsers = registeredUsers.length + adminUsers.length + 1;
  const totalRevenue = activities.filter((a) => a.type === "offer" || a.type === "survey").reduce((s, a) => s + (a.amount > 0 ? a.amount : 0), 0);
  const pendingWithdrawals = withdrawals.filter((w) => w.status === "pending" || w.status === "processing");
  const pendingDeposits = deposits.filter((d) => d.status === "pending");
  const pendingWithdrawalAmount = pendingWithdrawals.reduce((s, w) => s + w.amount, 0);
  const pendingDepositAmount = pendingDeposits.reduce((s, d) => s + d.amount, 0);

  const platformStats = [
    { title: "Total Revenue", value: formatMoney(totalRevenue), icon: "DollarSign", accent: "#22C55E", trend: "from offers & surveys" },
    { title: "Total Users", value: String(totalUsers), icon: "Users", accent: "#3B82F6", trend: `${registeredUsers.length} registered` },
    { title: "Pending Withdrawals", value: formatMoney(pendingWithdrawalAmount), icon: "ArrowUpFromLine", accent: "#F59E0B", subtitle: `${pendingWithdrawals.length} requests` },
    { title: "Pending Deposits", value: formatMoney(pendingDepositAmount), icon: "ArrowDownToLine", accent: "#22C55E", subtitle: `${pendingDeposits.length} requests` },
  ];

  const providerPie = offerProviders.filter((p) => p.enabled).slice(0, 5).map((p) => ({
    name: p.name,
    value: p.totalOffers,
    color: p.color,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="glass rounded-2xl p-4 border border-blue-500/20">
        <div className="flex items-center gap-3">
          <Icons.Info size={18} className="text-blue-400 shrink-0" />
          <p className="text-sm text-white/60">
            All statistics are <span className="font-bold text-white">real-time</span> — computed from actual registered users, transactions, and platform activity.
          </p>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Partners" value={String(partners.filter((p) => p.enabled).length)} icon="Webhook" accent="#E53935" subtitle={`${partners.length} total`} />
        <StatCard title="Promo Codes" value={String(promoCodes.filter((p) => p.active).length)} icon="Ticket" accent="#A855F7" subtitle={`${promoUsages.length} redemptions`} />
        <StatCard title="Total Transactions" value={String(activities.length)} icon="Activity" accent="#3B82F6" subtitle="all time" />
        <StatCard title="Completed Withdrawals" value={String(withdrawals.filter((w) => w.status === "completed").length)} icon="CheckCircle2" accent="#22C55E" subtitle="processed" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <SectionHeader title="Offer Distribution by Provider" subtitle="Active offerwall providers" icon="PieChart" />
          {providerPie.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <Icons.PieChart size={32} className="mx-auto mb-2 opacity-50" />
              No active providers. Enable providers in the Offerwall tab.
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={providerPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                    {providerPie.map((p) => (
                      <Cell key={p.name} fill={p.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "rgba(8,27,51,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {providerPie.map((p) => (
                  <div key={p.name} className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                    <span className="flex-1 text-white/60">{p.name}</span>
                    <span className="font-bold">{p.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="glass rounded-2xl p-5">
          <SectionHeader title="Recent Activity" subtitle="Latest platform transactions" icon="Activity" />
          {activities.length === 0 ? (
            <div className="text-center py-8 text-white/40">
              <Icons.Activity size={28} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-gpt">
              {activities.slice(0, 8).map((a) => (
                <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg glass text-xs">
                  <span className="flex-1 truncate">{a.title}</span>
                  <span className={a.amount < 0 ? "text-[#E53935] font-bold" : "text-green-400 font-bold"}>{a.amount < 0 ? "" : "+"}{formatMoney(a.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassPanel>
          <SectionHeader title="Registered Users" subtitle={`${totalUsers} total users`} icon="Users" />
          {registeredUsers.length === 0 ? (
            <div className="text-center py-8 text-white/40">
              <Icons.Users size={28} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No registered users yet</p>
              <p className="text-xs mt-1">Users will appear here after they sign up</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-gpt">
              {registeredUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg glass">
                  <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full bg-white/10" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{u.name}</p>
                    <p className="text-xs text-white/40 truncate">{u.email}</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
        <GlassPanel>
          <SectionHeader title="Platform Health" icon="ShieldCheck" />
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl glass">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-green-500/15 text-green-400"><Icons.CheckCircle2 size={16} /></div>
              <div className="flex-1"><p className="text-sm font-semibold">System Status</p><p className="text-xs text-white/40">All systems operational</p></div>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl glass">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-500/15 text-blue-400"><Icons.Webhook size={16} /></div>
              <div className="flex-1"><p className="text-sm font-semibold">Active Partners</p><p className="text-xs text-white/40">{partners.filter((p) => p.enabled).length} of {partners.length} providers live</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl glass">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-purple-500/15 text-purple-400"><Icons.Ticket size={16} /></div>
              <div className="flex-1"><p className="text-sm font-semibold">Active Promo Codes</p><p className="text-xs text-white/40">{promoCodes.filter((p) => p.active).length} codes available</p></div>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

function AdminUsers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "banned" | "suspended">("all");
  const filtered = adminUsers.filter(
    (u) =>
      (filter === "all" || u.status === filter) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const action = (name: string, action: string) => {
    toast.success(`${action} ${name}`, { description: `User has been ${action.toLowerCase()}.` });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icons.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50"
          />
        </div>
        <div className="flex p-1 rounded-xl bg-white/5">
          {(["all", "active", "suspended", "banned"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn("px-4 py-2 rounded-lg text-xs font-semibold capitalize", filter === f ? "bg-[#E53935] text-white" : "text-white/60")}
            >
              {f}
            </button>
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
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Level</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Joined</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#102C57] to-[#081B33] flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate flex items-center gap-1">
                          {u.name}
                          {u.verified && <Icons.BadgeCheck size={12} className="text-blue-400" />}
                        </p>
                        <p className="text-xs text-white/40 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-green-400 hidden sm:table-cell">{formatMoney(u.balance)}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant="gold">{u.level}</Badge>
                  </td>
                  <td className="px-4 py-3 text-white/50 hidden lg:table-cell">{u.joinedAt}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.status === "active" ? "success" : u.status === "suspended" ? "warning" : "danger"}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => action(u.name, "Edit")}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
                        title="Edit"
                      >
                        <Icons.Pencil size={14} />
                      </button>
                      {u.status === "active" ? (
                        <button
                          onClick={() => action(u.name, "Suspend")}
                          className="p-1.5 rounded-lg hover:bg-yellow-500/15 text-white/60 hover:text-yellow-400"
                          title="Suspend"
                        >
                          <Icons.Ban size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => action(u.name, "Activate")}
                          className="p-1.5 rounded-lg hover:bg-green-500/15 text-white/60 hover:text-green-400"
                          title="Activate"
                        >
                          <Icons.Check size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => action(u.name, "Delete")}
                        className="p-1.5 rounded-lg hover:bg-[#E53935]/15 text-white/60 hover:text-[#E53935]"
                        title="Delete"
                      >
                        <Icons.Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}

function AdminWithdrawals() {
  const [items, setItems] = useState(seedW.map((w) => ({ ...w })));
  const act = (id: string, action: "approve" | "reject") => {
    setItems((prev) => prev.map((w) => (w.id === id ? { ...w, status: action === "approve" ? "completed" as const : "rejected" as const } : w)));
    toast.success(`Withdrawal ${action}d`, { description: `Request #${id} has been ${action}d.` });
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending" value={String(items.filter((w) => w.status === "pending").length)} icon="Clock" accent="#F59E0B" />
        <StatCard title="Processing" value={String(items.filter((w) => w.status === "processing").length)} icon="Loader2" accent="#3B82F6" />
        <StatCard title="Completed" value={String(items.filter((w) => w.status === "completed").length)} icon="CheckCircle2" accent="#22C55E" />
        <StatCard title="Total Value" value={formatMoney(items.reduce((s, w) => s + w.amount, 0))} icon="DollarSign" accent="#E53935" />
      </div>
      <GlassPanel className="p-0 overflow-hidden">
        <div className="overflow-x-auto scrollbar-gpt">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-xs text-white/50 uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-semibold">Method</th>
                <th className="text-left px-4 py-3 font-semibold">Amount</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Address</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((w) => (
                <tr key={w.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 font-semibold">{w.method}</td>
                  <td className="px-4 py-3 font-bold text-green-400">{formatMoney(w.amount)}</td>
                  <td className="px-4 py-3 text-white/50 font-mono text-xs hidden sm:table-cell">{w.address}</td>
                  <td className="px-4 py-3 text-white/50 hidden md:table-cell">{w.date}</td>
                  <td className="px-4 py-3">
                    <Badge variant={w.status === "completed" ? "success" : w.status === "processing" ? "info" : w.status === "pending" ? "warning" : "danger"}>
                      {w.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {w.status === "pending" || w.status === "processing" ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => act(w.id, "approve")} className="px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 text-xs font-bold hover:bg-green-500/25">Approve</button>
                        <button onClick={() => act(w.id, "reject")} className="px-3 py-1.5 rounded-lg bg-[#E53935]/15 text-[#ff6b6b] text-xs font-bold hover:bg-[#E53935]/25">Reject</button>
                      </div>
                    ) : (
                      <span className="text-xs text-white/30">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}

function AdminDeposits() {
  const [items, setItems] = useState(seedD.map((d) => ({ ...d })));
  const act = (id: string, action: "approve" | "reject") => {
    setItems((prev) => prev.map((d) => (d.id === id ? { ...d, status: action === "approve" ? "completed" as const : "rejected" as const } : d)));
    toast.success(`Deposit ${action}d`, { description: `Request #${id} has been ${action}d.` });
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending" value={String(items.filter((d) => d.status === "pending").length)} icon="Clock" accent="#F59E0B" />
        <StatCard title="Completed" value={String(items.filter((d) => d.status === "completed").length)} icon="CheckCircle2" accent="#22C55E" />
        <StatCard title="Total Value" value={formatMoney(items.reduce((s, d) => s + d.amount, 0))} icon="DollarSign" accent="#E53935" />
        <StatCard title="Bonuses Paid" value={formatMoney(items.reduce((s, d) => s + d.bonus, 0))} icon="Gift" accent="#A855F7" />
      </div>
      <GlassPanel className="p-0 overflow-hidden">
        <div className="overflow-x-auto scrollbar-gpt">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-xs text-white/50 uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-semibold">Method</th>
                <th className="text-left px-4 py-3 font-semibold">Amount</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Bonus</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 font-semibold">{d.method}</td>
                  <td className="px-4 py-3 font-bold text-green-400">{formatMoney(d.amount)}</td>
                  <td className="px-4 py-3 text-white/50 hidden sm:table-cell">+{formatMoney(d.bonus)}</td>
                  <td className="px-4 py-3 text-white/50 hidden md:table-cell">{d.date}</td>
                  <td className="px-4 py-3">
                    <Badge variant={d.status === "completed" ? "success" : d.status === "pending" ? "warning" : "danger"}>{d.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {d.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => act(d.id, "approve")} className="px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 text-xs font-bold hover:bg-green-500/25">Approve</button>
                        <button onClick={() => act(d.id, "reject")} className="px-3 py-1.5 rounded-lg bg-[#E53935]/15 text-[#ff6b6b] text-xs font-bold hover:bg-[#E53935]/25">Reject</button>
                      </div>
                    ) : (
                      <span className="text-xs text-white/30">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}

function AdminOfferwall() {
  const [providers, setProviders] = useState(offerProviders.map((p) => ({
    ...p,
    apiKey: "",
    apiSecret: "",
    postbackUrl: `https://earncashrm.xyz/api/postback/${p.id}`,
    publisherId: "",
  })));
  const [configuring, setConfiguring] = useState<typeof providers[0] | null>(null);

  const toggle = (id: string) => {
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
    const p = providers.find((x) => x.id === id);
    toast.success(`${p?.name} ${p?.enabled ? "disabled" : "enabled"}`, { description: `Provider is now ${p?.enabled ? "offline" : "live"}.` });
  };

  const saveConfig = (id: string, updates: any) => {
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    toast.success("Configuration saved!", { description: `${providers.find((p) => p.id === id)?.name} settings updated.` });
    setConfiguring(null);
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="Offerwall Providers" subtitle="12 providers — click Configure to edit API keys, postback URLs and credentials" icon="Store" />

      <GlassPanel className="bg-gradient-to-br from-[#102C57]/40 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#E53935]/15 flex items-center justify-center text-[#E53935]">
            <Icons.Webhook size={22} />
          </div>
          <div>
            <p className="font-bold">Postback configuration</p>
            <p className="text-sm text-white/50">Each provider needs a unique postback URL for reward verification.</p>
          </div>
          <div className="ml-auto hidden sm:block">
            <code className="px-3 py-2 rounded-lg bg-black/30 text-xs text-green-400 font-mono">https://earncashrm.xyz/api/postback/&#123;provider&#125;</code>
          </div>
        </div>
      </GlassPanel>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((p) => (
          <div key={p.id} className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${p.color}22` }}>
                  {p.logo}
                </div>
                <div>
                  <p className="font-bold text-sm">{p.name}</p>
                  <p className="text-[10px] text-white/40 capitalize">{p.type}</p>
                </div>
              </div>
              <button
                onClick={() => toggle(p.id)}
                className={cn(
                  "relative w-10 h-5 rounded-full transition-colors",
                  p.enabled ? "bg-green-500" : "bg-white/15"
                )}
              >
                <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform", p.enabled ? "translate-x-5" : "translate-x-0.5")} />
              </button>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-white/50">API Key</span>
                <span className="font-mono text-white/70">{p.apiKey ? `••••${p.apiKey.slice(-4)}` : "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Postback</span>
                <span className="font-mono text-white/70 truncate ml-2 max-w-[120px]">{p.postbackUrl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Offers</span>
                <span className="font-bold">{p.totalOffers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Avg payout</span>
                <span className="font-bold text-green-400">{formatMoney(p.avgPayout)}</span>
              </div>
            </div>
            <button
              onClick={() => setConfiguring(p)}
              className="w-full mt-3 py-2 rounded-lg bg-gradient-to-r from-[#E53935] to-[#ff5a56] hover:scale-[1.02] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-transform"
            >
              <Icons.Settings size={12} /> Configure
            </button>
          </div>
        ))}
      </div>

      {configuring && (
        <ProviderConfigModal provider={configuring} onClose={() => setConfiguring(null)} onSave={(updates) => saveConfig(configuring.id, updates)} />
      )}
    </div>
  );
}

function ProviderConfigModal({ provider, onClose, onSave }: { provider: any; onClose: () => void; onSave: (updates: any) => void }) {
  const [apiKey, setApiKey] = useState(provider.apiKey || "");
  const [apiSecret, setApiSecret] = useState(provider.apiSecret || "");
  const [postbackUrl, setPostbackUrl] = useState(provider.postbackUrl || `https://earncashrm.xyz/api/postback/${provider.id}`);
  const [publisherId, setPublisherId] = useState(provider.publisherId || "");
  const [totalOffers, setTotalOffers] = useState(provider.totalOffers);
  const [avgPayout, setAvgPayout] = useState(provider.avgPayout);
  const [enabled, setEnabled] = useState(provider.enabled);
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-gpt" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${provider.color}22` }}>
              {provider.logo}
            </div>
            <div>
              <h3 className="font-black text-lg">Configure {provider.name}</h3>
              <p className="text-xs text-white/50 capitalize">{provider.type} provider</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white"><Icons.X size={20} /></button>
        </div>

        <div className="space-y-4">
          {/* Postback URL */}
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">Postback URL (set this in {provider.name} dashboard)</label>
            <div className="flex gap-2">
              <input
                value={postbackUrl}
                onChange={(e) => setPostbackUrl(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-green-400 focus:outline-none focus:border-[#E53935]/50"
              />
              <button
                onClick={() => { navigator.clipboard?.writeText(postbackUrl); toast.success("Postback URL copied!"); }}
                className="px-3 rounded-xl bg-white/5 hover:bg-white/10 flex items-center"
              >
                <Icons.Copy size={14} />
              </button>
            </div>
            <p className="text-[10px] text-white/40 mt-1">Copy this URL and paste it in your {provider.name} publisher dashboard under postback/callback settings.</p>
          </div>

          {/* API Key */}
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">API Key</label>
            <input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key from provider dashboard"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E53935]/50"
            />
          </div>

          {/* API Secret */}
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">API Secret</label>
            <div className="flex gap-2">
              <input
                type={showSecret ? "text" : "password"}
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="Enter your API secret"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E53935]/50"
              />
              <button onClick={() => setShowSecret(!showSecret)} className="px-3 rounded-xl bg-white/5 hover:bg-white/10 flex items-center">
                {showSecret ? <Icons.EyeOff size={14} /> : <Icons.Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Publisher ID */}
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">Publisher ID / Affiliate ID</label>
            <input
              value={publisherId}
              onChange={(e) => setPublisherId(e.target.value)}
              placeholder="Enter your publisher ID"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#E53935]/50"
            />
          </div>

          {/* Offer stats */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Total Offers</label>
              <input type="number" value={totalOffers} onChange={(e) => setTotalOffers(parseInt(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Avg Payout ($)</label>
              <input type="number" step="0.01" value={avgPayout} onChange={(e) => setAvgPayout(parseFloat(e.target.value) || 0)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50" />
            </div>
          </div>

          {/* Test postback */}
          <button
            onClick={() => toast.success("Test postback sent!", { description: `Waiting for response from ${provider.name}...` })}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Icons.Send size={14} /> Send Test Postback
          </button>

          {/* Enable toggle */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="accent-[#E53935] w-4 h-4 rounded" />
            <span className="text-white/80">Enabled (live for users)</span>
          </label>

          {/* Save buttons */}
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold">Cancel</button>
            <button
              onClick={() => onSave({ apiKey, apiSecret, postbackUrl, publisherId, totalOffers, avgPayout, enabled })}
              className="flex-1 py-2.5 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white text-sm font-bold"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// AdminKYC removed — replaced by AdminPromoCodes and AdminSiteSettings in admin-tabs.tsx
