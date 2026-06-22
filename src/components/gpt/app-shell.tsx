"use client";

import { useStore } from "@/lib/store";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { DashboardView } from "./dashboard-view";
import { OfferwallView, SurveysView } from "./offerwall-view";
import { BonusesView } from "./bonuses-view";
import { ReferralsView } from "./referrals-view";
import { WithdrawView, DepositView } from "./finance-views";
import { LeaderboardView, AchievementsView, PromoView, HistoryView } from "./community-views";
import { TicketsView, NotificationsView } from "./support-views";
import { AdminView } from "./admin-view";
import { ViewErrorBoundary } from "./error-boundary";
import * as Icons from "lucide-react";

export function AppShell() {
  const { currentView, isAdmin } = useStore();

  const renderView = () => {
    // Admin mode forces admin panel
    if (isAdmin && currentView !== "admin") {
      return (
        <ViewErrorBoundary name="admin">
          <AdminView />
        </ViewErrorBoundary>
      );
    }
    switch (currentView) {
      case "dashboard":
        return (<ViewErrorBoundary name="dashboard"><DashboardView /></ViewErrorBoundary>);
      case "offerwall":
        return (<ViewErrorBoundary name="offerwall"><OfferwallView /></ViewErrorBoundary>);
      case "surveys":
        return (<ViewErrorBoundary name="surveys"><SurveysView /></ViewErrorBoundary>);
      case "bonuses":
        return (<ViewErrorBoundary name="bonuses"><BonusesView /></ViewErrorBoundary>);
      case "referrals":
        return (<ViewErrorBoundary name="referrals"><ReferralsView /></ViewErrorBoundary>);
      case "withdraw":
        return (<ViewErrorBoundary name="withdraw"><WithdrawView /></ViewErrorBoundary>);
      case "deposit":
        return (<ViewErrorBoundary name="deposit"><DepositView /></ViewErrorBoundary>);
      case "leaderboard":
        return (<ViewErrorBoundary name="leaderboard"><LeaderboardView /></ViewErrorBoundary>);
      case "achievements":
        return (<ViewErrorBoundary name="achievements"><AchievementsView /></ViewErrorBoundary>);
      case "promo":
        return (<ViewErrorBoundary name="promo"><PromoView /></ViewErrorBoundary>);
      case "history":
        return (<ViewErrorBoundary name="history"><HistoryView /></ViewErrorBoundary>);
      case "tickets":
        return (<ViewErrorBoundary name="tickets"><TicketsView /></ViewErrorBoundary>);
      case "notifications":
        return (<ViewErrorBoundary name="notifications"><NotificationsView /></ViewErrorBoundary>);
      case "admin":
        return (<ViewErrorBoundary name="admin"><AdminView /></ViewErrorBoundary>);
      default:
        return (<ViewErrorBoundary name="dashboard"><DashboardView /></ViewErrorBoundary>);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 lg:p-6 max-w-[1600px] mx-auto w-full">
          {renderView()}
        </main>
        <Footer />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-auto glass-strong border-t border-white/8">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E53935] to-[#ff6b6b] flex items-center justify-center font-black text-white text-sm">
              R
            </div>
            <span>© 2024 RewardHive. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">FAQ</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <span className="flex items-center gap-1 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 pulse-red" /> All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
