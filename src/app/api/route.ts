import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    platform: "RewardHive",
    version: "1.0.0",
    status: "operational",
    features: [
      "offerwall",
      "surveys",
      "wheel-spin",
      "mystery-box",
      "daily-streak",
      "hourly-bonus",
      "referrals-3-level",
      "withdrawals-12-methods",
      "deposits",
      "leaderboard",
      "achievements",
      "promo-codes",
      "support-tickets",
      "admin-panel",
      "kyc",
      "fraud-detection",
    ],
    providers: 12,
    paymentMethods: 12,
    levels: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "VIP"],
  });
}
