"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Footer from "@/components/footer"

export default function Home() {
  const router = useRouter()

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
            <span className="text-xs text-muted-foreground">Free AI Evaluation</span>
          </div>
          <div className="flex gap-3 items-center">
            <Button variant="ghost" onClick={() => router.push("/billing")}>
              Support Us
            </Button>
            <Button variant="outline" onClick={() => router.push("/settings")}>
              Settings
            </Button>
          </div>
        </div>
      </nav>

      {/* Main content wrapper with flex-grow */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              ModelLens
              <br />
              AI Model Evaluation
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Free, open-access tool to evaluate multiple AI models simultaneously with comprehensive metrics and
              production-ready exports.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Button size="lg" onClick={() => router.push("/upload")} className="bg-primary hover:bg-primary/90">
                Start Evaluation
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/results")}>
                View Demo Results
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="border-primary/20 bg-card/50 backdrop-blur p-6 hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-lg">📤</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Upload Dataset</h3>
              <p className="text-sm text-muted-foreground">Support for CSV and JSON with flexible schema detection</p>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur p-6 hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <span className="text-lg">⚙️</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Configure Models</h3>
              <p className="text-sm text-muted-foreground">OpenAI, HuggingFace, Anthropic, and local models</p>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur p-6 hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-lg">📊</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Metrics</h3>
              <p className="text-sm text-muted-foreground">Latency, accuracy, BLEU, ROUGE, hallucination rate</p>
            </Card>
          </div>

          {/* Features Section */}
          <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6">Everything You Need</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Export results as CSV & PDF reports",
                "Process large jobs (100K+ samples)",
                "Download comprehensive reports",
                "Compare multiple models side-by-side",
                "Analyze top failures & errors",
                "Get actionable insights instantly",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-lg">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Start Evaluating Today</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              ModelLens is completely free. No credit card required. All features are available to everyone.
            </p>
            <Button size="lg" onClick={() => router.push("/upload")} className="bg-primary hover:bg-primary/90">
              Get Started Free
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
