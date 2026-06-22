"use client";

import { useStore } from "@/lib/store";
import { AuthScreen } from "@/components/gpt/auth";
import { AppShell } from "@/components/gpt/app-shell";

export default function Home() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  return isAuthenticated ? <AppShell /> : <AuthScreen />;
}
