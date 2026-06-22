import type {
  Achievement,
  Activity,
  AdminUser,
  ContestEntry,
  Deposit,
  LeaderboardEntry,
  Notification,
  Offer,
  OfferProvider,
  PaymentMethod,
  PromoCode,
  Referral,
  SpinHistory,
  SupportTicket,
  Survey,
  User,
  Withdrawal,
} from "./types";

const AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Kai",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivy",
];

export const currentUser: User = {
  id: "u_001",
  name: "Alex Morgan",
  email: "alex.morgan@rewardhive.io",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexM",
  level: "Bronze",
  xp: 0,
  xpToNext: 2500,
  currentBalance: 0,
  pendingBalance: 0,
  totalEarnings: 0,
  referralEarnings: 0,
  lifetimeWithdrawals: 0,
  dailyStreak: 0,
  lastStreakDate: new Date().toISOString().slice(0, 10),
  referralCode: "ALEX-BRONZE-2024",
  joinedAt: new Date().toISOString().slice(0, 10),
  country: "",
  verified: false,
  rank: 0,
  isAdminUser: false,
};

// Admin account — only this user can access the admin panel
export const adminUser: User = {
  id: "admin_001",
  name: "Super Admin",
  email: "admin@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin",
  level: "VIP",
  xp: 250000,
  xpToNext: 500000,
  currentBalance: 0,
  pendingBalance: 0,
  totalEarnings: 0,
  referralEarnings: 0,
  lifetimeWithdrawals: 0,
  dailyStreak: 0,
  lastStreakDate: new Date().toISOString().slice(0, 10),
  referralCode: "ADMIN-2024",
  joinedAt: "2023-01-01",
  country: "Global",
  verified: true,
  rank: 0,
  isAdminUser: true,
};

export const ADMIN_EMAIL = "admin@example.com";
export const ADMIN_PASSWORD = "Admin@123456";

export const offerProviders: OfferProvider[] = [
  { id: "cpx", name: "CPX Research", logo: "📊", color: "#3B82F6", enabled: true, description: "High-paying surveys and studies from leading market researchers.", totalOffers: 184, avgPayout: 1.85, type: "surveys" },
  { id: "lootably", name: "Lootably", logo: "💎", color: "#8B5CF6", enabled: true, description: "Premium offerwall with games, apps and sign-up offers.", totalOffers: 312, avgPayout: 2.4, type: "offers" },
  { id: "adgate", name: "AdGate Media", logo: "🚪", color: "#22C55E", enabled: true, description: "Earn rewards by completing offers, surveys and downloads.", totalOffers: 268, avgPayout: 1.65, type: "both" },
  { id: "monlix", name: "Monlix", logo: "🎯", color: "#F59E0B", enabled: true, description: "Global offerwall with exclusive high-paying campaigns.", totalOffers: 196, avgPayout: 2.1, type: "offers" },
  { id: "ayet", name: "Ayet Studios", logo: "⚡", color: "#EC4899", enabled: true, description: "Offerwall focused on mobile app installs and games.", totalOffers: 154, avgPayout: 1.95, type: "offers" },
  { id: "adgem", name: "AdGem", logo: "💎", color: "#06B6D4", enabled: true, description: "Premium offerwall with great survey router integration.", totalOffers: 224, avgPayout: 1.75, type: "both" },
  { id: "offertoro", name: "OfferToro", logo: "🐂", color: "#EF4444", enabled: true, description: "Trusted offerwall with daily fresh campaigns.", totalOffers: 178, avgPayout: 1.5, type: "offers" },
  { id: "revuniverse", name: "Revenue Universe", logo: "🌌", color: "#A855F7", enabled: true, description: "Reliable offerwall with strong postback support.", totalOffers: 142, avgPayout: 1.8, type: "offers" },
  { id: "timewall", name: "TimeWall", logo: "⏰", color: "#14B8A6", enabled: false, description: "Time-based offerwall with unique task system.", totalOffers: 96, avgPayout: 1.4, type: "offers" },
  { id: "bitlabs", name: "BitLabs", logo: "🧪", color: "#3B82F6", enabled: true, description: "Advanced survey router with great match rates.", totalOffers: 210, avgPayout: 2.2, type: "surveys" },
  { id: "pollfish", name: "Pollfish", logo: "🐟", color: "#22D3EE", enabled: true, description: "Programmatic survey platform with instant payouts.", totalOffers: 165, avgPayout: 1.9, type: "surveys" },
  { id: "theoremreach", name: "TheoremReach", logo: "📐", color: "#F97316", enabled: true, description: "Survey sample provider with high conversion rates.", totalOffers: 138, avgPayout: 2.05, type: "surveys" },
];

export const offers: Offer[] = [
  { id: "o1", providerId: "lootably", providerName: "Lootably", title: "Reach Level 25 in Raid: Shadow Legends", description: "Install and reach level 25 within 30 days to earn this reward.", reward: 42.5, category: "Games", difficulty: "Medium", duration: "3-5 days", rating: 4.6, completions: 1842 },
  { id: "o2", providerId: "adgate", providerName: "AdGate Media", title: "Sign up & deposit $10 on Crypto.com", description: "Create a new account and make your first deposit of at least $10.", reward: 28.0, category: "Finance", difficulty: "Easy", duration: "1 day", rating: 4.8, completions: 3201 },
  { id: "o3", providerId: "monlix", providerName: "Monlix", title: "Complete 2 surveys about streaming habits", description: "Answer two qualifying surveys about your media consumption.", reward: 6.75, category: "Surveys", difficulty: "Easy", duration: "20 min", rating: 4.2, completions: 8942 },
  { id: "o4", providerId: "ayet", providerName: "Ayet Studios", title: "Install & open Coin Master", description: "Install the app and open it for the first time.", reward: 1.25, category: "Apps", difficulty: "Easy", duration: "2 min", rating: 4.4, completions: 12450 },
  { id: "o5", providerId: "adgem", providerName: "AdGem", title: "Sign up for a free trial of ExpressVPN", description: "Register with valid credit card and activate trial.", reward: 18.5, category: "Subscriptions", difficulty: "Medium", duration: "10 min", rating: 4.7, completions: 2156 },
  { id: "o6", providerId: "offertoro", providerName: "OfferToro", title: "Reach Level 10 in Mafia City", description: "Install the game and progress to level 10.", reward: 12.0, category: "Games", difficulty: "Easy", duration: "1-2 days", rating: 4.3, completions: 5421 },
  { id: "o7", providerId: "revuniverse", providerName: "Revenue Universe", title: "Register on SurveyJunkie & complete profile", description: "Create an account and fill out your full profile.", reward: 3.5, category: "Sign-ups", difficulty: "Easy", duration: "8 min", rating: 4.1, completions: 7821 },
  { id: "o8", providerId: "lootably", providerName: "Lootably", title: "Subscribe to Disney+ annual plan", description: "Purchase an annual Disney+ subscription.", reward: 65.0, category: "Subscriptions", difficulty: "Easy", duration: "5 min", rating: 4.9, completions: 894 },
  { id: "o9", providerId: "adgate", providerName: "AdGate Media", title: "Install TikTok and watch 3 videos", description: "New users only — install and engage with content.", reward: 0.85, category: "Apps", difficulty: "Easy", duration: "5 min", rating: 4.0, completions: 18420 },
  { id: "o10", providerId: "monlix", providerName: "Monlix", title: "Open a Chime bank account", description: "Open a free checking account with no minimum balance.", reward: 32.0, category: "Finance", difficulty: "Medium", duration: "1 day", rating: 4.6, completions: 1942 },
  { id: "o11", providerId: "ayet", providerName: "Ayet Studios", title: "Reach Town Hall 5 in Clash of Clans", description: "Install and progress to Town Hall level 5.", reward: 8.5, category: "Games", difficulty: "Medium", duration: "2-3 days", rating: 4.5, completions: 3621 },
  { id: "o12", providerId: "adgem", providerName: "AdGem", title: "Sign up for Netflix free trial", description: "Create a new Netflix account with valid payment.", reward: 22.0, category: "Subscriptions", difficulty: "Easy", duration: "10 min", rating: 4.7, completions: 2841 },
];

export const surveys: Survey[] = [
  { id: "s1", providerId: "cpx", providerName: "CPX Research", title: "Consumer tech purchasing habits 2024", reward: 4.25, duration: "12 min", loi: 12, rating: 4.5, matchRate: 78 },
  { id: "s2", providerId: "bitlabs", providerName: "BitLabs", title: "Streaming service preferences study", reward: 3.5, duration: "8 min", loi: 8, rating: 4.3, matchRate: 82 },
  { id: "s3", providerId: "pollfish", providerName: "Pollfish", title: "Mobile gaming behavior survey", reward: 2.75, duration: "6 min", loi: 6, rating: 4.1, matchRate: 85 },
  { id: "s4", providerId: "theoremreach", providerName: "TheoremReach", title: "Brand awareness — FMCG products", reward: 5.0, duration: "15 min", loi: 15, rating: 4.6, matchRate: 71 },
  { id: "s5", providerId: "cpx", providerName: "CPX Research", title: "Remote work productivity study", reward: 6.5, duration: "18 min", loi: 18, rating: 4.7, matchRate: 65 },
  { id: "s6", providerId: "bitlabs", providerName: "BitLabs", title: "Travel & vacation planning survey", reward: 3.0, duration: "9 min", loi: 9, rating: 4.2, matchRate: 80 },
  { id: "s7", providerId: "pollfish", providerName: "Pollfish", title: "Social media usage patterns", reward: 1.85, duration: "5 min", loi: 5, rating: 4.0, matchRate: 88 },
  { id: "s8", providerId: "theoremreach", providerName: "TheoremReach", title: "Financial services satisfaction", reward: 7.25, duration: "22 min", loi: 22, rating: 4.8, matchRate: 60 },
];

// Demo data removed — users start with empty activity feed
export const activities: Activity[] = [];

// Demo data removed — users start with no notifications
export const notifications: Notification[] = [];

export const leaderboard: LeaderboardEntry[] = [];

export const referrals: Referral[] = [];

export const achievements: Achievement[] = [
  { id: "ach1", name: "First Steps", description: "Complete your first offer", icon: "🎯", unlocked: false, progress: 0, total: 1, reward: 1, rarity: "common" },
  { id: "ach2", name: "Survey Pro", description: "Complete 50 surveys", icon: "📋", unlocked: false, progress: 0, total: 50, reward: 10, rarity: "rare" },
  { id: "ach3", name: "High Roller", description: "Earn $1,000 total", icon: "💰", unlocked: false, progress: 0, total: 1000, reward: 25, rarity: "epic" },
  { id: "ach4", name: "Streak Master", description: "30-day daily streak", icon: "🔥", unlocked: false, progress: 0, total: 30, reward: 50, rarity: "epic" },
  { id: "ach5", name: "Social Butterfly", description: "Refer 25 friends", icon: "🦋", unlocked: false, progress: 0, total: 25, reward: 30, rarity: "rare" },
  { id: "ach6", name: "Wheel Wizard", description: "Spin the wheel 100 times", icon: "🎡", unlocked: false, progress: 0, total: 100, reward: 15, rarity: "rare" },
  { id: "ach7", name: "Diamond Hands", description: "Reach Diamond level", icon: "💎", unlocked: false, progress: 0, total: 25000, reward: 100, rarity: "legendary" },
  { id: "ach8", name: "Early Bird", description: "Claim hourly bonus 7 days straight", icon: "⏰", unlocked: false, progress: 0, total: 7, reward: 5, rarity: "common" },
  { id: "ach9", name: "Mystery Solver", description: "Open 50 mystery boxes", icon: "🎁", unlocked: false, progress: 0, total: 50, reward: 20, rarity: "rare" },
  { id: "ach10", name: "VIP Status", description: "Reach VIP level", icon: "👑", unlocked: false, progress: 0, total: 100000, reward: 500, rarity: "legendary" },
  { id: "ach11", name: "Offer Machine", description: "Complete 500 offers", icon: "⚙️", unlocked: false, progress: 0, total: 500, reward: 40, rarity: "epic" },
  { id: "ach12", name: "Lucky Seven", description: "Win jackpot on the wheel", icon: "🍀", unlocked: false, progress: 0, total: 1, reward: 75, rarity: "legendary" },
];

export const paymentMethods: PaymentMethod[] = [
  { id: "paypal", name: "PayPal", icon: "🅿️", type: "fiat", minAmount: 5, fee: 0, feeType: "fixed", enabled: true, processingTime: "Instant - 24h" },
  { id: "binance", name: "Binance Pay", icon: "🟡", type: "crypto", minAmount: 2, fee: 0, feeType: "fixed", enabled: true, processingTime: "Instant" },
  { id: "usdt_trc", name: "USDT (TRC20)", icon: "💵", type: "crypto", minAmount: 2, fee: 1, feeType: "percent", enabled: true, processingTime: "Instant" },
  { id: "usdt_bep", name: "USDT (BEP20)", icon: "💵", type: "crypto", minAmount: 2, fee: 1, feeType: "percent", enabled: true, processingTime: "Instant" },
  { id: "ltc", name: "Litecoin", icon: "🪙", type: "crypto", minAmount: 2, fee: 0.5, feeType: "percent", enabled: true, processingTime: "Instant" },
  { id: "btc", name: "Bitcoin", icon: "₿", type: "crypto", minAmount: 10, fee: 1.5, feeType: "percent", enabled: true, processingTime: "10-30 min" },
  { id: "eth", name: "Ethereum", icon: "Ξ", type: "crypto", minAmount: 5, fee: 2, feeType: "percent", enabled: true, processingTime: "5-15 min" },
  { id: "pm", name: "Perfect Money", icon: "💠", type: "fiat", minAmount: 5, fee: 1, feeType: "percent", enabled: true, processingTime: "Instant" },
  { id: "bank", name: "Bank Transfer", icon: "🏦", type: "fiat", minAmount: 50, fee: 2, feeType: "fixed", enabled: true, processingTime: "3-5 days" },
  { id: "bkash", name: "bKash", icon: "📱", type: "mobile", minAmount: 2, fee: 1.5, feeType: "percent", enabled: true, processingTime: "Instant" },
  { id: "nagad", name: "Nagad", icon: "📲", type: "mobile", minAmount: 2, fee: 1.5, feeType: "percent", enabled: true, processingTime: "Instant" },
  { id: "rocket", name: "Rocket", icon: "🚀", type: "mobile", minAmount: 2, fee: 1.5, feeType: "percent", enabled: true, processingTime: "Instant" },
];

// Demo data removed — users start with no withdrawal history
export const withdrawals: Withdrawal[] = [];

export const deposits: Deposit[] = [];

export const supportTickets: SupportTicket[] = [];

export const spinHistory: SpinHistory[] = [];

// Demo data removed — contests start empty
export const contests: ContestEntry[] = [];

// Demo data removed — admin user list starts empty (real registered users appear here)
export const adminUsers: AdminUser[] = [];

// Demo chart data removed — charts will show real data from store
export const earningsChart: { day: string; earnings: number; offers: number }[] = [];

export const revenueChart: { month: string; revenue: number; users: number }[] = [];

export const levelConfig: Record<string, { min: number; color: string; perks: string[] }> = {
  Bronze: { min: 0, color: "#CD7F32", perks: ["5% referral bonus", "Standard withdrawals"] },
  Silver: { min: 2500, color: "#C0C0C0", perks: ["8% referral bonus", "Priority support"] },
  Gold: { min: 10000, color: "#FFD700", perks: ["10% referral bonus", "Faster withdrawals", "5% daily bonus boost"] },
  Platinum: { min: 25000, color: "#E5E4E2", perks: ["12% referral bonus", "Instant withdrawals", "10% daily bonus boost", "Exclusive offers"] },
  Diamond: { min: 50000, color: "#B9F2FF", perks: ["15% referral bonus", "Instant withdrawals", "15% daily bonus boost", "VIP offers", "Lower fees"] },
  VIP: { min: 100000, color: "#E53935", perks: ["20% referral bonus", "Instant withdrawals", "25% daily bonus boost", "Personal manager", "Zero fees", "Exclusive contests"] },
};

// ===== Earn page data (matches ExtraCashRM screenshots) =====

export interface RecentWinner {
  id: string;
  name: string;
  avatar: string;
  timeAgo: string;
  coins: number;
  offer: string;
}

export const recentWinners: RecentWinner[] = [
  { id: "rw1", name: "Ronyvai", avatar: AVATARS[0], timeAgo: "7h ago", coins: 500, offer: "Rise of Kingdoms" },
  { id: "rw2", name: "fritz6020D", avatar: AVATARS[1], timeAgo: "8h ago", coins: 525, offer: "Call of Dragons" },
  { id: "rw3", name: "bryantgill65", avatar: AVATARS[2], timeAgo: "8h ago", coins: 644, offer: "Game of Vampires" },
  { id: "rw4", name: "tressDonDh2a", avatar: AVATARS[3], timeAgo: "8h ago", coins: 644, offer: "Warpath" },
  { id: "rw5", name: "DeadlyDemon", avatar: AVATARS[4], timeAgo: "8h ago", coins: 644, offer: "Matching Story" },
  { id: "rw6", name: "chrone2897", avatar: AVATARS[5], timeAgo: "8h ago", coins: 644, offer: "The Parachute" },
  { id: "rw7", name: "princessanne", avatar: AVATARS[6], timeAgo: "9h ago", coins: 720, offer: "Space Debris" },
  { id: "rw8", name: "lunaTide99", avatar: AVATARS[7], timeAgo: "9h ago", coins: 318, offer: "Acorns" },
  { id: "rw9", name: "kaiStorm", avatar: AVATARS[8], timeAgo: "10h ago", coins: 412, offer: "Audible" },
  { id: "rw10", name: "ivyQueen", avatar: AVATARS[9], timeAgo: "10h ago", coins: 285, offer: "Dream Wedding" },
];

export interface OfferCard {
  id: string;
  title: string;
  thumbnail: string;
  coins: number;
  reward: number;
  provider: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  rating: number;
  completions: number;
  featured?: boolean;
  top?: boolean;
}

export const topOffers: OfferCard[] = [
  { id: "to1", title: "Rise of Kingdoms", thumbnail: "/offers/rise-of-kingdoms.png", coins: 326648, reward: 326.65, provider: "Lootably", category: "Games", difficulty: "Medium", duration: "3-5 days", rating: 4.8, completions: 18420, top: true },
  { id: "to2", title: "Game of Vampires", thumbnail: "/offers/game-of-vampires.png", coins: 140466, reward: 140.47, provider: "Monlix", category: "Games", difficulty: "Medium", duration: "2-4 days", rating: 4.6, completions: 9842, top: true },
  { id: "to3", title: "Call of Dragons", thumbnail: "/offers/call-of-dragons.png", coins: 126840, reward: 126.84, provider: "AdGate Media", category: "Games", difficulty: "Hard", duration: "5-7 days", rating: 4.7, completions: 7421, top: true },
  { id: "to4", title: "Matching Story", thumbnail: "/offers/matching-story.png", coins: 90860, reward: 90.86, provider: "Ayet Studios", category: "Games", difficulty: "Easy", duration: "1-2 days", rating: 4.5, completions: 12450, top: true },
  { id: "to5", title: "Warpath", thumbnail: "/offers/warpath.png", coins: 86195, reward: 86.20, provider: "AdGem", category: "Games", difficulty: "Medium", duration: "3-5 days", rating: 4.4, completions: 6842, top: true },
  { id: "to6", title: "The Parachute", thumbnail: "/offers/parachute.png", coins: 54999, reward: 55.00, provider: "OfferToro", category: "Games", difficulty: "Easy", duration: "1 day", rating: 4.3, completions: 9421, top: true },
];

export const featuredOffers: OfferCard[] = [
  { id: "fo1", title: "Space Debris", thumbnail: "/offers/space-debris.png", coins: 2836, reward: 2.84, provider: "Revenue Universe", category: "Games", difficulty: "Easy", duration: "10 min", rating: 4.2, completions: 5421, featured: true },
  { id: "fo2", title: "Acorns", thumbnail: "/offers/acorns.png", coins: 3150, reward: 3.15, provider: "Lootably", category: "Finance", difficulty: "Easy", duration: "5 min", rating: 4.6, completions: 8421, featured: true },
  { id: "fo3", title: "Audible", thumbnail: "/offers/audible.png", coins: 85, reward: 0.85, provider: "AdGate Media", category: "Subscriptions", difficulty: "Easy", duration: "5 min", rating: 4.4, completions: 12450, featured: true },
  { id: "fo4", title: "Dream Wedding", thumbnail: "/offers/dream-wedding.png", coins: 98, reward: 0.98, provider: "Monlix", category: "Apps", difficulty: "Easy", duration: "5 min", rating: 4.0, completions: 3421, featured: true },
  { id: "fo5", title: "Rise of Kingdoms", thumbnail: "/offers/rise-of-kingdoms.png", coins: 1184, reward: 1.18, provider: "Lootably", category: "Games", difficulty: "Easy", duration: "15 min", rating: 4.8, completions: 18420, featured: true },
  { id: "fo6", title: "Call of Dragons", thumbnail: "/offers/call-of-dragons.png", coins: 5488, reward: 5.49, provider: "AdGate Media", category: "Games", difficulty: "Medium", duration: "30 min", rating: 4.7, completions: 7421, featured: true },
  { id: "fo7", title: "Matching Story", thumbnail: "/offers/matching-story.png", coins: 112, reward: 1.12, provider: "Ayet Studios", category: "Games", difficulty: "Easy", duration: "10 min", rating: 4.5, completions: 12450, featured: true },
  { id: "fo8", title: "Warpath", thumbnail: "/offers/warpath.png", coins: 7, reward: 0.07, provider: "AdGem", category: "Games", difficulty: "Easy", duration: "2 min", rating: 4.4, completions: 6842, featured: true },
];

// ===== Advertising Partners (admin offerwall integration) =====
export interface AdvertisingPartner {
  id: string;
  name: string;
  logo: string;
  bgColor: string;
  textColor: string;
  rating: number;
  performance: string;
  enabled: boolean;
  apiKey: string;
  postbackUrl: string;
  totalOffers: number;
  avgPayout: number;
  earnings: number;
}

export const advertisingPartners: AdvertisingPartner[] = [
  { id: "ap1", name: "Notik", logo: "NOTIK ME", bgColor: "#F3F4F6", textColor: "#1F2937", rating: 5, performance: "+38%", enabled: true, apiKey: "nk_••••••8f2K", postbackUrl: "/api/postback/notik", totalOffers: 184, avgPayout: 1.85, earnings: 8420 },
  { id: "ap2", name: "Offery", logo: "Offery", bgColor: "#14B8A6", textColor: "#FFFFFF", rating: 5, performance: "+12%", enabled: true, apiKey: "of_••••••3a9P", postbackUrl: "/api/postback/offery", totalOffers: 142, avgPayout: 1.65, earnings: 5280 },
  { id: "ap3", name: "AdBreak Media", logo: "A", bgColor: "#3B82F6", textColor: "#FFFFFF", rating: 4, performance: "+8%", enabled: true, apiKey: "ab_••••••7k2X", postbackUrl: "/api/postback/adbreak", totalOffers: 96, avgPayout: 1.45, earnings: 3180 },
  { id: "ap4", name: "Radientwall", logo: "R", bgColor: "#64748B", textColor: "#FFFFFF", rating: 4.5, performance: "+5%", enabled: true, apiKey: "rw_••••••1m8Q", postbackUrl: "/api/postback/radientwall", totalOffers: 78, avgPayout: 1.55, earnings: 2840 },
  { id: "ap5", name: "Revtoo", logo: "R", bgColor: "#8B5CF6", textColor: "#FFFFFF", rating: 5, performance: "+20%", enabled: true, apiKey: "rv_••••••9p3L", postbackUrl: "/api/postback/revtoo", totalOffers: 124, avgPayout: 2.1, earnings: 7420 },
  { id: "ap6", name: "PrimeWall", logo: "P", bgColor: "#E5E7EB", textColor: "#1F2937", rating: 4, performance: "+3%", enabled: false, apiKey: "pw_••••••2d7T", postbackUrl: "/api/postback/primewall", totalOffers: 62, avgPayout: 1.35, earnings: 1840 },
  { id: "ap7", name: "UpWall", logo: "U", bgColor: "#0EA5E9", textColor: "#FFFFFF", rating: 4.5, performance: "+15%", enabled: true, apiKey: "uw_••••••5r1K", postbackUrl: "/api/postback/upwall", totalOffers: 88, avgPayout: 1.75, earnings: 4120 },
  { id: "ap8", name: "TaskWall", logo: "T", bgColor: "#22C55E", textColor: "#FFFFFF", rating: 5, performance: "+22%", enabled: true, apiKey: "tw_••••••8n4B", postbackUrl: "/api/postback/taskwall", totalOffers: 156, avgPayout: 1.95, earnings: 9180 },
  { id: "ap9", name: "Clickwall", logo: "C", bgColor: "#84CC16", textColor: "#FFFFFF", rating: 4, performance: "+18%", enabled: true, apiKey: "cw_••••••3k9Z", postbackUrl: "/api/postback/clickwall", totalOffers: 112, avgPayout: 1.7, earnings: 6240 },
  { id: "ap10", name: "Adswedmedia", logo: "AD", bgColor: "#111827", textColor: "#3B82F6", rating: 3.5, performance: "-2%", enabled: false, apiKey: "as_••••••7q2M", postbackUrl: "/api/postback/adswedmedia", totalOffers: 54, avgPayout: 1.25, earnings: 1240 },
  { id: "ap11", name: "MobiVortex", logo: "M", bgColor: "#FFFFFF", textColor: "#6B7280", rating: 4, performance: "+38%", enabled: true, apiKey: "mv_••••••4w8R", postbackUrl: "/api/postback/mobivortex", totalOffers: 98, avgPayout: 1.6, earnings: 4820 },
  { id: "ap12", name: "ubScale", logo: "u", bgColor: "#FFFFFF", textColor: "#22C55E", rating: 3, performance: "+5%", enabled: false, apiKey: "ub_••••••6t3N", postbackUrl: "/api/postback/ubscale", totalOffers: 42, avgPayout: 1.15, earnings: 980 },
];

// ===== Admin editable revenue stats (fully controllable) =====
export interface RevenueStat {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  icon: string;
  accent: string;
  trend: string;
  editable: boolean;
}

export const defaultRevenueStats: RevenueStat[] = [
  { id: "rs1", title: "Total Revenue", value: "$84,290", numericValue: 84290, icon: "DollarSign", accent: "#22C55E", trend: "+18.2%", editable: true },
  { id: "rs2", title: "Active Users", value: "12,840", numericValue: 12840, icon: "Users", accent: "#3B82F6", trend: "+342 today", editable: true },
  { id: "rs3", title: "Pending Withdrawals", value: "$8,420", numericValue: 8420, icon: "ArrowUpFromLine", accent: "#F59E0B", trend: "24 requests", editable: true },
  { id: "rs4", title: "Pending Deposits", value: "$3,180", numericValue: 3180, icon: "ArrowDownToLine", accent: "#22C55E", trend: "8 requests", editable: true },
  { id: "rs5", title: "Offerwall Payouts", value: "$42,180", numericValue: 42180, icon: "Store", accent: "#A855F7", trend: "+12.4%", editable: true },
  { id: "rs6", title: "Net Profit", value: "$28,940", numericValue: 28940, icon: "TrendingUp", accent: "#E53935", trend: "+22.8%", editable: true },
];

// Extended admin users with more fields for advanced management
export interface AdminUserExtended extends AdminUser {
  xp: number;
  totalEarnings: number;
  referralCode: string;
  lastActive: string;
  kycStatus: "verified" | "pending" | "rejected" | "not_submitted";
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  ipAddress: string;
}

// Demo data removed — admin users start empty (real registered users appear here)
export const adminUsersExtended: AdminUserExtended[] = [];

// ===== Promo Codes (admin-managed) — sample codes with 0 usage =====
export const defaultPromoCodes: PromoCode[] = [
  { id: "pc1", code: "WELCOME10", type: "fixed", reward: 10, minAmount: 0, usageLimit: 1000, usedCount: 0, expiresAt: "2025-12-31", active: true, createdAt: "2024-01-15", description: "New user welcome bonus" },
  { id: "pc2", code: "FREEMONEY5", type: "fixed", reward: 5, minAmount: 0, usageLimit: 500, usedCount: 0, expiresAt: "2025-11-30", active: true, createdAt: "2024-02-01", description: "Quick $5 on us" },
  { id: "pc3", code: "BONUS25", type: "fixed", reward: 25, minAmount: 0, usageLimit: 100, usedCount: 0, expiresAt: "2025-12-31", active: true, createdAt: "2024-03-01", description: "Premium bonus code" },
];

// ===== Site Settings (admin-configurable) =====
export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  siteUrl: string;
  logoText: string;
  accentColor: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  smtpFromEmail: string;
  smtpFromName: string;
  facebookUrl: string;
  twitterUrl: string;
  discordUrl: string;
  telegramUrl: string;
  adminEmail: string;
  adminPassword: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  minWithdrawal: number;
  referralCommissionL1: number;
  referralCommissionL2: number;
  referralCommissionL3: number;
  // Platform Stats (configurable from admin, shown on login page + dashboard)
  statTotalPaidOut: number;
  statTotalUsers: number;
  statRating: number;
  statReviewCount: number;
  statUseRealData: boolean;
}

export const defaultSiteSettings: SiteSettings = {
  siteName: "EarnCashRM",
  siteTagline: "GPT Offerwall Rewards Platform",
  siteDescription: "Complete offers, take surveys, spin the wheel and earn real rewards. Cash out instantly via PayPal, Crypto and more.",
  siteUrl: "https://earncashrm.xyz",
  logoText: "E",
  accentColor: "#E53935",
  metaTitle: "EarnCashRM — GPT Offerwall Rewards Platform",
  metaDescription: "Complete offers, take surveys, spin the wheel and earn real rewards. Withdraw via PayPal, Crypto, bKash and more on EarnCashRM.",
  metaKeywords: "GPT, Offerwall, Rewards, Earn money online, Surveys, PayPal rewards, EarnCashRM",
  smtpHost: "smtp.gmail.com",
  smtpPort: "587",
  smtpUsername: "noreply@earncashrm.xyz",
  smtpPassword: "",
  smtpFromEmail: "noreply@earncashrm.xyz",
  smtpFromName: "EarnCashRM",
  facebookUrl: "",
  twitterUrl: "",
  discordUrl: "",
  telegramUrl: "",
  adminEmail: "hasibulbd694@gmail.com",
  adminPassword: "Santo420@#$!",
  maintenanceMode: false,
  maintenanceMessage: "We're performing scheduled maintenance. We'll be back shortly!",
  registrationEnabled: true,
  emailVerificationRequired: true,
  minWithdrawal: 2,
  referralCommissionL1: 10,
  referralCommissionL2: 5,
  referralCommissionL3: 2,
  statTotalPaidOut: 0,
  statTotalUsers: 0,
  statRating: 5.0,
  statReviewCount: 0,
  statUseRealData: true,
};
