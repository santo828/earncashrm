"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { supportTickets as seedTickets } from "@/lib/data";
import { SectionHeader, Badge, GlassPanel, EmptyState } from "./ui";
import * as Icons from "lucide-react";
import { formatMoney } from "@/lib/helpers";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { SupportTicket } from "@/lib/types";

export function TicketsView() {
  const [tickets, setTickets] = useState<SupportTicket[]>(seedTickets);
  const [selected, setSelected] = useState<SupportTicket | null>(seedTickets[0]);
  const [reply, setReply] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState("Reward Issue");
  const [newMessage, setNewMessage] = useState("");

  const sendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !reply.trim()) return;
    const updated = tickets.map((t) =>
      t.id === selected.id
        ? {
            ...t,
            status: "open" as const,
            lastUpdate: "Just now",
            messages: [
              ...t.messages,
              { id: `m${Date.now()}`, author: "user" as const, name: "Alex Morgan", message: reply, timestamp: "Just now" },
            ],
          }
        : t
    );
    setTickets(updated);
    setSelected(updated.find((t) => t.id === selected.id) ?? null);
    setReply("");
    toast.success("Reply sent", { description: "Our support team will respond shortly." });
  };

  const createTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;
    const t: SupportTicket = {
      id: `t${Date.now()}`,
      subject: newSubject,
      category: newCategory,
      priority: "medium",
      status: "open",
      lastUpdate: "Just now",
      messages: [{ id: `m${Date.now()}`, author: "user", name: "Alex Morgan", message: newMessage, timestamp: "Just now" }],
    };
    setTickets([t, ...tickets]);
    setSelected(t);
    setShowNew(false);
    setNewSubject("");
    setNewMessage("");
    toast.success("Ticket created!", { description: "We'll get back to you within 24 hours." });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Support Tickets"
        subtitle="Get help from our support team"
        icon="LifeBuoy"
        action={
          <button
            onClick={() => setShowNew(true)}
            className="px-4 py-2 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white text-xs font-bold flex items-center gap-2"
          >
            <Icons.Plus size={14} /> New Ticket
          </button>
        }
      />

      {showNew && (
        <GlassPanel>
          <form onSubmit={createTicket} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Create New Ticket</h3>
              <button type="button" onClick={() => setShowNew(false)} className="text-white/50 hover:text-white">
                <Icons.X size={18} />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-white/70 mb-1.5 block">Subject</label>
                <input
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Briefly describe your issue"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-white/70 mb-1.5 block">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50"
                >
                  {["Reward Issue", "Withdrawal", "Deposit", "Account", "Bug Report", "Other"].map((c) => (
                    <option key={c} value={c} className="bg-[#081B33]">{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-white/70 mb-1.5 block">Message</label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={4}
                placeholder="Describe your issue in detail..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50 resize-none"
              />
            </div>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white font-bold text-sm flex items-center gap-2">
              <Icons.Send size={14} /> Submit Ticket
            </button>
          </form>
        </GlassPanel>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ticket list */}
        <div className="lg:col-span-1">
          <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Your Tickets</p>
          <div className="space-y-2">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={cn(
                  "w-full text-left p-3 rounded-xl transition-all",
                  selected?.id === t.id ? "glass ring-2 ring-[#E53935]" : "glass glass-hover"
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-white/40">#{t.id}</span>
                  <Badge variant={t.status === "open" ? "warning" : t.status === "answered" ? "success" : "default"}>
                    {t.status}
                  </Badge>
                </div>
                <p className="text-sm font-semibold truncate">{t.subject}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-white/40">{t.category}</span>
                  <span className="text-[10px] text-white/40">{t.lastUpdate}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation */}
        <div className="lg:col-span-2">
          {selected ? (
            <GlassPanel className="flex flex-col h-full min-h-[500px]">
              <div className="flex items-center justify-between pb-4 border-b border-white/8">
                <div>
                  <p className="font-bold">{selected.subject}</p>
                  <p className="text-xs text-white/40">#{selected.id} • {selected.category}</p>
                </div>
                <Badge variant={selected.status === "open" ? "warning" : selected.status === "answered" ? "success" : "default"}>
                  {selected.status}
                </Badge>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-gpt py-4 space-y-4 max-h-[400px]">
                {selected.messages.map((m) => (
                  <div key={m.id} className={cn("flex gap-3", m.author === "user" && "flex-row-reverse")}>
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                        m.author === "user" ? "bg-[#E53935] text-white" : "bg-[#102C57] text-white"
                      )}
                    >
                      {m.author === "user" ? "U" : "S"}
                    </div>
                    <div className={cn("max-w-[75%]", m.author === "user" && "text-right")}>
                      <div className={cn("flex items-center gap-2 mb-1", m.author === "user" && "justify-end")}>
                        <span className="text-xs font-semibold">{m.name}</span>
                        <span className="text-[10px] text-white/40">{m.timestamp}</span>
                      </div>
                      <div
                        className={cn(
                          "inline-block px-4 py-2.5 rounded-2xl text-sm text-left",
                          m.author === "user"
                            ? "bg-[#E53935] text-white rounded-tr-sm"
                            : "glass rounded-tl-sm"
                        )}
                      >
                        {m.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {selected.status !== "closed" && (
                <form onSubmit={sendReply} className="pt-4 border-t border-white/8">
                  <div className="flex gap-2">
                    <input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53935]/50"
                    />
                    <button type="submit" className="px-4 py-2.5 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white font-bold text-sm flex items-center gap-2">
                      <Icons.Send size={14} /> Send
                    </button>
                  </div>
                </form>
              )}
            </GlassPanel>
          ) : (
            <GlassPanel className="flex items-center justify-center min-h-[400px]">
              <EmptyState icon="LifeBuoy" title="Select a ticket" subtitle="Choose a ticket to view the conversation." />
            </GlassPanel>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationsView() {
  const { notifications, markAllRead, markRead } = useStore();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Notifications"
        subtitle={`${unread} unread of ${notifications.length} total`}
        icon="Bell"
        action={
          unread > 0 && (
            <button
              onClick={markAllRead}
              className="px-4 py-2 rounded-xl glass hover:bg-white/10 text-xs font-semibold flex items-center gap-2"
            >
              <Icons.CheckCheck size={14} /> Mark all read
            </button>
          )
        }
      />

      <div className="space-y-2">
        {notifications.map((n) => {
          const cfg: Record<string, { icon: string; color: string }> = {
            success: { icon: "CheckCircle2", color: "#22C55E" },
            info: { icon: "Info", color: "#3B82F6" },
            warning: { icon: "AlertTriangle", color: "#F59E0B" },
            reward: { icon: "Gift", color: "#E53935" },
          };
          const { icon, color } = cfg[n.type];
          const Icon = (Icons as any)[icon];
          return (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={cn(
                "w-full text-left flex items-start gap-3 p-4 rounded-2xl transition-all",
                n.read ? "glass opacity-70" : "glass-strong ring-1 ring-[#E53935]/20"
              )}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}22`, color }}>
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm">{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-[#E53935] pulse-red shrink-0" />}
                </div>
                <p className="text-sm text-white/60 mt-0.5">{n.message}</p>
                <p className="text-xs text-white/40 mt-1.5">{n.timestamp}</p>
              </div>
            </button>
          );
        })}
      </div>

      <GlassPanel className="bg-gradient-to-br from-[#102C57]/40 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E53935]/15 flex items-center justify-center text-[#E53935]">
            <Icons.BellRing size={22} />
          </div>
          <div>
            <p className="font-bold">Notification preferences</p>
            <p className="text-sm text-white/50 mt-0.5">Manage email, push and in-app notifications in your account settings.</p>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
