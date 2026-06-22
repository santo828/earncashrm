// ===== GPT Offerwall Platform — Type Definitions =====

export type ViewId =
  | "dashboard"
  | "offerwall"
  | "surveys"
  | "bonuses"
  | "referrals"
  | "withdraw"
  | "deposit"
  | "leaderboard"
  | "achievements"
  | "promo"
  | "tickets"
  | "notifications"
  | "history"
  | "admin";

export type Level = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "VIP";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: Level;
  xp: number;
  xpToNext: number;
  currentBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  referralEarnings: number;
  lifetimeWithdrawals: number;
  dailyStreak: number;
  lastStreakDate: string;
  referralCode: string;
  joinedAt: string;
  country: string;
  verified: boolean;
  rank: number;
}

export interface OfferProvider {
  id: string;
  name: string;
  logo: string;
  color: string;
  enabled: boolean;
  description: string;
  totalOffers: number;
  avgPayout: number;
  type: "offers" | "surveys" | "both";
}

export interface Offer {
  id: string;
  providerId: string;
  providerName: string;
  title: string;
  description: string;
  reward: number;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  rating: number;
  completions: number;
}

export interface Survey {
  id: string;
  providerId: string;
  providerName: string;
  title: string;
  reward: number;
  duration: string;
  loi: number; // length of interview in minutes
  rating: number;
  matchRate: number;
}

export interface Activity {
  id: string;
  type: "offer" | "survey" | "referral" | "bonus" | "withdrawal" | "deposit";
  title: string;
  amount: number;
  status: "completed" | "pending" | "rejected";
  timestamp: string;
}

export interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "reward";
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  country: string;
  earnings: number;
  offers: number;
  referrals: number;
  level: Level;
  isCurrentUser?: boolean;
}

export interface Referral {
  id: string;
  name: string;
  avatar: string;
  level: 1 | 2 | 3;
  joinedAt: string;
  earnings: number;
  status: "active" | "inactive";
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  total: number;
  reward: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: "crypto" | "fiat" | "mobile";
  minAmount: number;
  fee: number;
  feeType: "percent" | "fixed";
  enabled: boolean;
  processingTime: string;
}

export interface Withdrawal {
  id: string;
  method: string;
  amount: number;
  fee: number;
  status: "pending" | "processing" | "completed" | "rejected";
  date: string;
  address: string;
}

export interface Deposit {
  id: string;
  method: string;
  amount: number;
  status: "pending" | "completed" | "rejected";
  date: string;
  bonus: number;
}

export interface PromoCode {
  id: string;
  code: string;
  type: "fixed" | "percent";
  reward: number;
  minAmount: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
  description: string;
}

export interface PromoCodeUsage {
  id: string;
  promoCodeId: string;
  code: string;
  userId: string;
  userName: string;
  reward: number;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "open" | "answered" | "closed";
  lastUpdate: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  author: "user" | "admin";
  name: string;
  message: string;
  timestamp: string;
}

export interface SpinHistory {
  id: string;
  prize: number;
  date: string;
  type: "wheel" | "mystery" | "hourly" | "daily";
}

export interface ContestEntry {
  id: string;
  name: string;
  avatar: string;
  entries: number;
  prize: number;
  rank: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  balance: number;
  level: Level;
  status: "active" | "banned" | "suspended";
  joinedAt: string;
  country: string;
  verified: boolean;
}
