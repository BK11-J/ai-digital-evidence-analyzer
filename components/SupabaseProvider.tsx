"use client"

import type React from "react"

import { AuthProvider } from "@/lib/auth-context"

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
