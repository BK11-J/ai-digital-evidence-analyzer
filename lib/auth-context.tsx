"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  is_premium: boolean
  subscription_tier: string | null
  team_seats: number
  trial_ends_at: string | null
  is_admin: boolean
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isPremium: boolean
  isAdmin: boolean
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const isDemoMode = supabase === null

  const createMinimalProfile = (authUser: User): UserProfile => ({
    id: authUser.id,
    email: authUser.email || "",
    full_name: (authUser.user_metadata?.full_name as string) || null,
    is_premium: false,
    subscription_tier: "free",
    team_seats: 1,
    trial_ends_at: null,
    is_admin: false,
  })

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isDemoMode) {
          setLoading(false)
          return
        }

        const {
          data: { user },
        } = await supabase!.auth.getUser()
        setUser(user)

        if (user) {
          setProfile(createMinimalProfile(user))
        }
      } catch (error) {
        console.warn("[v0] Auth initialization:", error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    if (isDemoMode) return

    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        // Use minimal profile from auth metadata
        setProfile(createMinimalProfile(session.user))
      } else {
        setProfile(null)
      }
    })

    return () => subscription?.unsubscribe()
  }, [isDemoMode, supabase])

  const signUp = async (email: string, password: string, fullName: string) => {
    if (isDemoMode) {
      throw new Error("Authentication is not configured. Please add Supabase credentials to use this feature.")
    }

    const { error: signUpError } = await supabase!.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
        },
      },
    })

    if (signUpError) throw signUpError
  }

  const signIn = async (email: string, password: string) => {
    if (isDemoMode) {
      throw new Error("Authentication is not configured. Please add Supabase credentials to use this feature.")
    }

    const { error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (isDemoMode) return

    const { error } = await supabase!.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        isPremium: profile?.is_premium ?? false,
        isAdmin: profile?.is_admin ?? false,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
