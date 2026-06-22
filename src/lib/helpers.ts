export function formatMoney(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  return `${sign}$${Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

export function timeAgo(date: string): string {
  return date;
}

export const NAV_ITEMS: { id: import("@/lib/types").ViewId; label: string; icon: string; badge?: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "offerwall", label: "Offerwall", icon: "Store" },
  { id: "surveys", label: "Surveys", icon: "ClipboardList" },
  { id: "bonuses", label: "Daily Bonuses", icon: "Gift", badge: "HOT" },
  { id: "referrals", label: "Referrals", icon: "Users" },
  { id: "leaderboard", label: "Leaderboard", icon: "Trophy" },
  { id: "achievements", label: "Achievements", icon: "Award" },
  { id: "promo", label: "Promo Codes", icon: "Ticket" },
  { id: "history", label: "Reward History", icon: "History" },
  { id: "deposit", label: "Deposit", icon: "ArrowDownToLine" },
  { id: "withdraw", label: "Withdraw", icon: "ArrowUpFromLine" },
  { id: "tickets", label: "Support", icon: "LifeBuoy" },
  { id: "notifications", label: "Notifications", icon: "Bell" },
  { id: "admin", label: "Admin Panel", icon: "ShieldCheck" },
];
