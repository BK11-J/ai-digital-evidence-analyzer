"use client"

import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface User {
  id: string
  email: string
  full_name: string
  is_premium: boolean
  subscription_tier: string
}

export default function AdminPage() {
  const { loading, isAdmin, isDemoMode } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [searchEmail, setSearchEmail] = useState("")

  useEffect(() => {
    if (loading) return
    if (!isAdmin) {
      redirect("/")
    }

    if (!isDemoMode) {
      loadUsers()
    }
  }, [loading, isAdmin, isDemoMode])

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/admin/users")
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (err) {
      console.error("[v0] Failed to load users:", err)
    }
  }

  const togglePremium = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isPremium: !currentStatus }),
      })
      if (res.ok) {
        loadUsers()
      }
    } catch (err) {
      console.error("[v0] Failed to update user:", err)
    }
  }

  const filteredUsers = users.filter((u) => u.email.includes(searchEmail))

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (isDemoMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        <nav className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-sm font-bold text-white">ML</span>
              </div>
              <span className="font-bold text-lg">ModelLens Admin</span>
            </div>
            <Button variant="ghost" onClick={() => (window.location.href = "/")}>
              Home
            </Button>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="border-primary/20 bg-card/50 p-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Admin Features Not Available</h2>
            <p className="text-muted-foreground">Please configure Supabase to use admin features</p>
          </Card>
        </main>
      </div>
    )
  }

  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Not authorized</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-white">ML</span>
            </div>
            <span className="font-bold text-lg">ModelLens Admin</span>
          </div>
          <Button variant="ghost" onClick={() => (window.location.href = "/")}>
            Home
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">User Management</h1>
          <p className="text-muted-foreground">Manage user subscriptions and premium status</p>
        </div>

        {/* Search */}
        <Card className="border-primary/20 bg-card/50 p-6 mb-8">
          <Input
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="bg-input"
          />
        </Card>

        {/* Users Table */}
        <Card className="border-primary/20 bg-card/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-card/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tier</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-card/30 transition-colors">
                    <td className="px-6 py-4 text-sm">{user.email}</td>
                    <td className="px-6 py-4 text-sm">{user.full_name || "—"}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.is_premium ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {user.is_premium ? "Premium" : "Free"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.subscription_tier}</td>
                    <td className="px-6 py-4 text-sm">
                      <Button
                        size="sm"
                        variant={user.is_premium ? "destructive" : "outline"}
                        onClick={() => togglePremium(user.id, user.is_premium)}
                      >
                        {user.is_premium ? "Revoke" : "Grant"} Premium
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && <div className="p-12 text-center text-muted-foreground">No users found</div>}
        </Card>

        <div className="mt-8 text-sm text-muted-foreground">Total users: {users.length}</div>
      </main>
    </div>
  )
}
