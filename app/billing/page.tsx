"use client"

import { redirect } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Footer from "@/components/footer"

export default function BillingPage() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    redirect("/auth/login")
  }

  const handleCheckout = () => {
    alert("Thank you for your interest! Stripe integration coming soon.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-white">ML</span>
            </div>
            <span className="font-bold text-lg">ModelLens</span>
          </div>
          <Button variant="ghost" onClick={() => (window.location.href = "/")}>
            Home
          </Button>
        </div>
      </nav>

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Support ModelLens</h1>
          <p className="text-muted-foreground">
            ModelLens is free for everyone. If you find it valuable, consider supporting its development.
          </p>
        </div>

        {/* Free Plan Highlight */}
        <Card className="border-2 border-primary/40 bg-gradient-to-br from-card to-primary/5 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Everything is Free</h2>
          </div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-sm">
              <span>✓</span> Unlimited evaluations
            </li>
            <li className="flex items-center gap-2 text-sm">
              <span>✓</span> All dataset sizes
            </li>
            <li className="flex items-center gap-2 text-sm">
              <span>✓</span> CSV/PDF/JSON exports
            </li>
            <li className="flex items-center gap-2 text-sm">
              <span>✓</span> All metrics and features
            </li>
            <li className="flex items-center gap-2 text-sm">
              <span>✓</span> No credit card required
            </li>
          </ul>

          <p className="text-sm text-muted-foreground">
            Everything you need to evaluate AI models is completely free and always will be.
          </p>
        </Card>

        {/* Support Section */}
        <Card className="border-primary/20 bg-card/50 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Support Development</h2>
          <p className="text-muted-foreground mb-6">
            If ModelLens has been helpful to you, consider supporting its continued development.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Button onClick={handleCheckout} className="bg-primary hover:bg-primary/90">
              Make a Donation
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "https://github.com")}>
              Star on GitHub
            </Button>
          </div>
        </Card>

        {/* Creator Info */}
        <Card className="border-border bg-card/50 p-8">
          <h3 className="text-xl font-bold mb-3">Created by Bhumi Kadam</h3>
          <p className="text-muted-foreground">
            ModelLens was created as a free resource for the AI community. Thank you for using it!
          </p>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
