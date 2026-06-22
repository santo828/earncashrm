"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Activity,
  Notification,
  User,
  ViewId,
  Withdrawal,
  Deposit,
  SpinHistory,
  PaymentMethod,
  PromoCode,
  PromoCodeUsage,
} from "./types";
import {
  currentUser as seedUser,
  adminUser,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  activities as seedActivities,
  notifications as seedNotifications,
  withdrawals as seedWithdrawals,
  deposits as seedDeposits,
  spinHistory as seedSpinHistory,
  paymentMethods as seedPaymentMethods,
  advertisingPartners as seedPartners,
  defaultRevenueStats,
  adminUsersExtended,
  defaultSiteSettings,
  defaultPromoCodes,
  type RevenueStat,
  type AdvertisingPartner,
  type AdminUserExtended,
  type SiteSettings,
} from "./data";

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  createdAt: string;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  isAdmin: boolean;
  registeredUsers: RegisteredUser[];
  currentUserId: string | null;
  login: () => void;
  loginWithEmail: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  toggleAdmin: () => void;

  // Navigation
  currentView: ViewId;
  setView: (v: ViewId) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;

  // User data
  user: User;
  addBalance: (amount: number) => void;
  addPending: (amount: number) => void;
  addXp: (amount: number) => void;
  claimDailyStreak: () => void;

  // Activity
  activities: Activity[];
  addActivity: (a: Omit<Activity, "id" | "timestamp">) => void;

  // Notifications
  notifications: Notification[];
  unreadCount: () => number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  addNotification: (n: Omit<Notification, "id" | "timestamp" | "read">) => void;

  // Withdrawals / Deposits
  withdrawals: Withdrawal[];
  deposits: Deposit[];
  addWithdrawal: (w: Omit<Withdrawal, "id" | "date">) => void;
  addDeposit: (d: Omit<Deposit, "id" | "date">) => void;

  // Bonuses
  spinHistory: SpinHistory[];
  wheelSpinsLeft: number;
  hourlyClaimedAt: number | null;
  dailyClaimedAt: number | null;
  addSpin: (prize: number, type: SpinHistory["type"]) => void;
  consumeWheelSpin: () => void;
  claimHourly: () => void;
  reset: () => void;

  // Toast trigger (simple)
  lastToast: { title: string; description: string; type: "success" | "info" } | null;
  showToast: (t: { title: string; description: string; type: "success" | "info" }) => void;

  // ===== Site Settings (persists permanently) =====
  siteSettings: SiteSettings;
  updateSiteSettings: (updates: Partial<SiteSettings>) => void;

  // ===== Admin CRUD state =====
  revenueStats: RevenueStat[];
  addRevenueStat: (stat: Omit<RevenueStat, "id">) => void;
  updateRevenueStat: (id: string, updates: Partial<RevenueStat>) => void;
  deleteRevenueStat: (id: string) => void;

  adminUsers: AdminUserExtended[];
  updateAdminUser: (id: string, updates: Partial<AdminUserExtended>) => void;
  deleteAdminUser: (id: string) => void;
  addAdminUser: (user: Omit<AdminUserExtended, "id">) => void;

  paymentMethods: PaymentMethod[];
  addPaymentMethod: (m: Omit<PaymentMethod, "id">) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;

  partners: AdvertisingPartner[];
  addPartner: (p: Omit<AdvertisingPartner, "id">) => void;
  updatePartner: (id: string, updates: Partial<AdvertisingPartner>) => void;
  deletePartner: (id: string) => void;

  // Promo Codes (admin-managed)
  promoCodes: PromoCode[];
  promoUsages: PromoCodeUsage[];
  addPromoCode: (p: Omit<PromoCode, "id" | "usedCount" | "createdAt">) => void;
  updatePromoCode: (id: string, updates: Partial<PromoCode>) => void;
  deletePromoCode: (id: string) => void;
  redeemPromoCode: (code: string, userName: string, userId: string) => { success: boolean; reward?: number; error?: string };
}

const now = () => new Date().toLocaleString();

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isAdmin: false,
      registeredUsers: [],
      currentUserId: null,
      login: () => set({ isAuthenticated: true, currentUserId: null, user: seedUser }),
      loginWithEmail: (email, password) => {
        const state = get();
        const normalizedEmail = email.trim().toLowerCase();
        // Admin account
        if (normalizedEmail === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true, currentUserId: null, user: adminUser, isAdmin: false, currentView: "dashboard" });
          return { success: true };
        }
        // Demo account
        if (normalizedEmail === seedUser.email.toLowerCase() && password === "demo1234") {
          set({ isAuthenticated: true, currentUserId: null, user: seedUser, isAdmin: false, currentView: "dashboard" });
          return { success: true };
        }
        // Registered account
        const found = state.registeredUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
        if (!found) {
          return { success: false, error: "No account found with this email. Please register first." };
        }
        if (found.password !== password) {
          return { success: false, error: "Incorrect password. Please try again." };
        }
        const freshUser: User = {
          ...seedUser,
          id: found.id,
          name: found.name,
          email: found.email,
          avatar: found.avatar,
          currentBalance: 0,
          pendingBalance: 0,
          totalEarnings: 0,
          referralEarnings: 0,
          lifetimeWithdrawals: 0,
          xp: 0,
          xpToNext: 2500,
          level: "Bronze",
          dailyStreak: 0,
          referralCode: found.name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) + "-" + found.id.slice(-4).toUpperCase(),
          rank: 0,
          verified: false,
          joinedAt: found.createdAt,
          isAdminUser: false,
        };
        set({ isAuthenticated: true, currentUserId: found.id, user: freshUser, isAdmin: false, currentView: "dashboard" });
        return { success: true };
      },
      register: (name, email, password) => {
        const state = get();
        const normalizedEmail = email.trim().toLowerCase();
        if (normalizedEmail === seedUser.email.toLowerCase() || normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
          return { success: false, error: "This email is already registered. Please sign in instead." };
        }
        if (state.registeredUsers.some((u) => u.email.toLowerCase() === normalizedEmail)) {
          return { success: false, error: "An account with this email already exists. Please sign in." };
        }
        const id = `ru_${Date.now()}`;
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
        const newUser: RegisteredUser = { id, name: name.trim(), email: email.trim(), password, avatar, createdAt: new Date().toISOString().slice(0, 10) };
        const freshUser: User = {
          ...seedUser,
          id, name: newUser.name, email: newUser.email, avatar,
          currentBalance: 0, pendingBalance: 0, totalEarnings: 0, referralEarnings: 0, lifetimeWithdrawals: 0,
          xp: 0, xpToNext: 2500, level: "Bronze", dailyStreak: 0,
          referralCode: newUser.name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) + "-" + id.slice(-4).toUpperCase(),
          rank: 0, verified: false, joinedAt: newUser.createdAt, isAdminUser: false,
        };
        set((s) => ({
          registeredUsers: [...s.registeredUsers, newUser],
          currentUserId: id, user: freshUser, isAuthenticated: true, isAdmin: false, currentView: "dashboard",
          activities: [{ id: `welcome_${Date.now()}`, type: "bonus" as const, title: "Welcome to RewardHive! 🎉", amount: 0, status: "completed" as const, timestamp: "Just now" }],
          notifications: [{ id: `nw_${Date.now()}`, type: "success" as const, title: "Account Created!", message: `Welcome ${newUser.name}! Complete your first offer to start earning.`, read: false, timestamp: "Just now" }],
        }));
        return { success: true };
      },
      logout: () => set({ isAuthenticated: false, isAdmin: false, currentView: "dashboard", currentUserId: null }),
      toggleAdmin: () => set((s) => ({ isAdmin: !s.isAdmin, currentView: s.isAdmin ? "dashboard" : "admin" })),

      currentView: "dashboard",
      setView: (v) => set({ currentView: v, mobileNavOpen: false }),
      mobileNavOpen: false,
      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

      user: seedUser,
      addBalance: (amount) =>
        set((s) => ({
          user: {
            ...s.user,
            currentBalance: +(s.user.currentBalance + amount).toFixed(2),
            totalEarnings: amount > 0 ? +(s.user.totalEarnings + amount).toFixed(2) : s.user.totalEarnings,
          },
        })),
      addPending: (amount) =>
        set((s) => ({
          user: { ...s.user, pendingBalance: +(s.user.pendingBalance + amount).toFixed(2) },
        })),
      addXp: (amount) =>
        set((s) => ({ user: { ...s.user, xp: s.user.xp + amount } })),
      claimDailyStreak: () =>
        set((s) => ({
          user: {
            ...s.user,
            dailyStreak: s.user.dailyStreak + 1,
            lastStreakDate: new Date().toISOString().slice(0, 10),
          },
        })),

      activities: seedActivities,
      addActivity: (a) =>
        set((s) => ({
          activities: [
            { ...a, id: `a${Date.now()}`, timestamp: "Just now" },
            ...s.activities,
          ],
        })),

      notifications: seedNotifications,
      unreadCount: () => get().notifications.filter((n) => !n.read).length,
      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      markRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      addNotification: (n) =>
        set((s) => ({
          notifications: [
            { ...n, id: `n${Date.now()}`, timestamp: "Just now", read: false },
            ...s.notifications,
          ],
        })),

      withdrawals: seedWithdrawals,
      deposits: seedDeposits,
      addWithdrawal: (w) =>
        set((s) => ({
          withdrawals: [{ ...w, id: `w${Date.now()}`, date: "Just now" }, ...s.withdrawals],
          user: {
            ...s.user,
            currentBalance: +(s.user.currentBalance - w.amount).toFixed(2),
            lifetimeWithdrawals: +(s.user.lifetimeWithdrawals + w.amount).toFixed(2),
          },
        })),
      addDeposit: (d) =>
        set((s) => ({
          deposits: [{ ...d, id: `d${Date.now()}`, date: "Just now" }, ...s.deposits],
        })),

      spinHistory: seedSpinHistory,
      wheelSpinsLeft: 3,
      hourlyClaimedAt: null,
      dailyClaimedAt: null,
      addSpin: (prize, type) =>
        set((s) => ({
          spinHistory: [{ id: `sp${Date.now()}`, prize, date: "Just now", type }, ...s.spinHistory],
          user: {
            ...s.user,
            currentBalance: +(s.user.currentBalance + prize).toFixed(2),
            totalEarnings: +(s.user.totalEarnings + prize).toFixed(2),
          },
        })),
      consumeWheelSpin: () => set((s) => ({ wheelSpinsLeft: Math.max(0, s.wheelSpinsLeft - 1) })),
      claimHourly: () => set({ hourlyClaimedAt: Date.now() }),

      reset: () =>
        set({
          user: seedUser,
          activities: seedActivities,
          notifications: seedNotifications,
          withdrawals: seedWithdrawals,
          deposits: seedDeposits,
          spinHistory: seedSpinHistory,
          wheelSpinsLeft: 3,
          hourlyClaimedAt: null,
          revenueStats: defaultRevenueStats,
          adminUsers: adminUsersExtended,
          paymentMethods: seedPaymentMethods,
          partners: seedPartners,
        }),

      lastToast: null,
      showToast: (t) => set({ lastToast: { ...t } }),

      // ===== Site Settings (persists permanently) =====
      siteSettings: defaultSiteSettings,
      updateSiteSettings: (updates) =>
        set((s) => ({ siteSettings: { ...s.siteSettings, ...updates } })),

      // ===== Admin CRUD state =====
      revenueStats: defaultRevenueStats,
      addRevenueStat: (stat) =>
        set((s) => ({ revenueStats: [...s.revenueStats, { ...stat, id: `rs${Date.now()}` }] })),
      updateRevenueStat: (id, updates) =>
        set((s) => ({
          revenueStats: s.revenueStats.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),
      deleteRevenueStat: (id) =>
        set((s) => ({ revenueStats: s.revenueStats.filter((r) => r.id !== id) })),

      adminUsers: adminUsersExtended,
      updateAdminUser: (id, updates) =>
        set((s) => ({
          adminUsers: s.adminUsers.map((u) => (u.id === id ? { ...u, ...updates } : u)),
        })),
      deleteAdminUser: (id) =>
        set((s) => ({ adminUsers: s.adminUsers.filter((u) => u.id !== id) })),
      addAdminUser: (user) =>
        set((s) => ({ adminUsers: [{ ...user, id: `au${Date.now()}` }, ...s.adminUsers] })),

      paymentMethods: seedPaymentMethods,
      addPaymentMethod: (m) =>
        set((s) => ({ paymentMethods: [...s.paymentMethods, { ...m, id: `pm${Date.now()}` }] })),
      updatePaymentMethod: (id, updates) =>
        set((s) => ({
          paymentMethods: s.paymentMethods.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),
      deletePaymentMethod: (id) =>
        set((s) => ({ paymentMethods: s.paymentMethods.filter((m) => m.id !== id) })),

      partners: seedPartners,
      addPartner: (p) =>
        set((s) => ({ partners: [...s.partners, { ...p, id: `ap${Date.now()}` }] })),
      updatePartner: (id, updates) =>
        set((s) => ({
          partners: s.partners.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deletePartner: (id) =>
        set((s) => ({ partners: s.partners.filter((p) => p.id !== id) })),

      // ===== Promo Codes =====
      promoCodes: defaultPromoCodes,
      promoUsages: [],
      addPromoCode: (p) =>
        set((s) => ({
          promoCodes: [
            { ...p, id: `pc${Date.now()}`, usedCount: 0, createdAt: new Date().toISOString().slice(0, 10) },
            ...s.promoCodes,
          ],
        })),
      updatePromoCode: (id, updates) =>
        set((s) => ({
          promoCodes: s.promoCodes.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deletePromoCode: (id) =>
        set((s) => ({ promoCodes: s.promoCodes.filter((p) => p.id !== id) })),
      redeemPromoCode: (code, userName, userId) => {
        const state = get();
        const upperCode = code.trim().toUpperCase();
        const promo = state.promoCodes.find((p) => p.code.toUpperCase() === upperCode);
        if (!promo) {
          return { success: false, error: "Invalid promo code. This code does not exist." };
        }
        if (!promo.active) {
          return { success: false, error: "This promo code has been deactivated." };
        }
        if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
          return { success: false, error: "This promo code has expired." };
        }
        if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit) {
          return { success: false, error: "This promo code has reached its usage limit." };
        }
        // Check if this user already used this code
        if (state.promoUsages.some((u) => u.promoCodeId === promo.id && u.userId === userId)) {
          return { success: false, error: "You have already redeemed this promo code." };
        }
        const reward = promo.type === "fixed" ? promo.reward : 0; // percent type would need a base amount
        const usage: PromoCodeUsage = {
          id: `pu${Date.now()}`,
          promoCodeId: promo.id,
          code: promo.code,
          userId,
          userName,
          reward,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        set((s) => ({
          promoUsages: [usage, ...s.promoUsages],
          promoCodes: s.promoCodes.map((p) => (p.id === promo.id ? { ...p, usedCount: p.usedCount + 1 } : p)),
          user: {
            ...s.user,
            currentBalance: +(s.user.currentBalance + reward).toFixed(2),
            totalEarnings: +(s.user.totalEarnings + reward).toFixed(2),
          },
          activities: [
            { id: `a${Date.now()}`, type: "bonus" as const, title: `Promo code: ${promo.code}`, amount: reward, status: "completed" as const, timestamp: "Just now" },
            ...s.activities,
          ],
        }));
        return { success: true, reward };
      },
    }),
    {
      name: "rewardhive-store",
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        isAdmin: s.isAdmin,
        registeredUsers: s.registeredUsers,
        currentUserId: s.currentUserId,
        user: s.user,
        siteSettings: s.siteSettings,
        activities: s.activities,
        notifications: s.notifications,
        withdrawals: s.withdrawals,
        deposits: s.deposits,
        spinHistory: s.spinHistory,
        wheelSpinsLeft: s.wheelSpinsLeft,
        hourlyClaimedAt: s.hourlyClaimedAt,
        dailyClaimedAt: s.dailyClaimedAt,
        mysteryClaimedAt: s.mysteryClaimedAt,
        revenueStats: s.revenueStats,
        adminUsers: s.adminUsers,
        paymentMethods: s.paymentMethods,
        partners: s.partners,
        promoCodes: s.promoCodes,
        promoUsages: s.promoUsages,
      }),
    }
  )
);
