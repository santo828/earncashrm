"use client";

import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/helpers";
import * as Icons from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

export function Topbar() {
  const {
    user,
    setView,
    setMobileNavOpen,
    notifications,
    markAllRead,
    markRead,
    logout,
    toggleAdmin,
    isAdmin,
  } = useStore();
  const [showSearch, setShowSearch] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-white/8">
      <div className="flex items-center gap-3 px-4 lg:px-6 py-3">
        <button
          onClick={() => setMobileNavOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white/80"
        >
          <Icons.Menu size={20} />
        </button>

        {/* Balance pill */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl glass">
          <Icons.Wallet size={16} className="text-[#E53935]" />
          <div className="leading-none">
            <p className="text-[10px] text-white/50 uppercase tracking-wider">Balance</p>
            <p className="font-black text-sm">{formatMoney(user.currentBalance)}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl glass">
          <Icons.Clock size={16} className="text-yellow-400" />
          <div className="leading-none">
            <p className="text-[10px] text-white/50 uppercase tracking-wider">Pending</p>
            <p className="font-black text-sm">{formatMoney(user.pendingBalance)}</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md ml-auto hidden lg:block">
          <div className="relative">
            <Icons.Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              placeholder="Search offers, surveys, games..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#E53935]/50 focus:bg-white/8 transition-all"
            />
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 ml-auto lg:ml-0">
          <button
            onClick={() => setView("deposit")}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/15 hover:bg-green-500/25 text-green-400 text-xs font-semibold transition-colors"
          >
            <Icons.ArrowDownToLine size={14} /> Deposit
          </button>
          <button
            onClick={() => setView("withdraw")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E53935] hover:bg-[#ff5a56] text-white text-xs font-semibold transition-colors"
          >
            <Icons.ArrowUpFromLine size={14} /> Cash Out
          </button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative p-2.5 rounded-xl glass hover:bg-white/10 transition-colors">
                <Icons.Bell size={18} className="text-white/80" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 flex items-center justify-center text-[9px] font-black rounded-full bg-[#E53935] text-white pulse-red">
                    {unread}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 lg:w-96 p-0 glass-strong border-white/10 bg-[#081B33]/95"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <p className="font-bold text-sm">Notifications</p>
                <button
                  onClick={markAllRead}
                  className="text-xs text-[#E53935] hover:underline font-semibold"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto scrollbar-gpt">
                {notifications.slice(0, 6).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3",
                      !n.read && "bg-[#E53935]/5"
                    )}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        n.read ? "bg-white/20" : "bg-[#E53935] pulse-red"
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{n.title}</p>
                      <p className="text-xs text-white/60 line-clamp-2 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-white/40 mt-1">{n.timestamp}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setView("notifications")}
                className="w-full text-center py-2.5 text-xs font-semibold text-[#E53935] hover:bg-white/5"
              >
                View all notifications
              </button>
            </PopoverContent>
          </Popover>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1 pr-2 rounded-xl glass hover:bg-white/10 transition-colors">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg bg-white/10" />
                <Icons.ChevronDown size={14} className="text-white/60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 glass-strong border-white/10 bg-[#081B33]/95"
            >
              <div className="px-3 py-2 border-b border-white/10">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-white/50 truncate">{user.email}</p>
              </div>
              <DropdownMenuItem
                onClick={() => setView("dashboard")}
                className="text-white/80 hover:!bg-white/10 hover:!text-white cursor-pointer"
              >
                <Icons.LayoutDashboard size={14} className="mr-2" /> Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setView("history")}
                className="text-white/80 hover:!bg-white/10 hover:!text-white cursor-pointer"
              >
                <Icons.History size={14} className="mr-2" /> Reward History
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard?.writeText(user.referralCode);
                  toast.success("Referral code copied!");
                }}
                className="text-white/80 hover:!bg-white/10 hover:!text-white cursor-pointer"
              >
                <Icons.Ticket size={14} className="mr-2" /> Copy referral code
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={toggleAdmin}
                className="text-white/80 hover:!bg-white/10 hover:!text-white cursor-pointer"
              >
                <Icons.ShieldCheck size={14} className="mr-2" />
                {isAdmin ? "Exit Admin Mode" : "Admin Panel"}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={logout}
                className="text-[#E53935] hover:!bg-[#E53935]/10 cursor-pointer"
              >
                <Icons.LogOut size={14} className="mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
