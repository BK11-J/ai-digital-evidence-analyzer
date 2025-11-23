"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MetricCard } from "@/components/metric-card"
import { FailuresList } from "@/components/failures-list"
import Footer from "@/components/footer"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const DEMO_METRICS = {
  "gpt-4": {
    latency: 1.24,
    accuracy: 0.89,
    f1: 0.87,
    bleu: 0.82,
    rouge: 0.85,
    hallucination: 0.03,
  },
  "claude-3": {
    latency: 1.58,
    accuracy: 0.91,
    f1: 0.89,
    bleu: 0.84,
    rouge: 0.87,
    hallucination: 0.02,
  },
  "gpt-35-turbo": {
    latency: 0.89,
    accuracy: 0.84,
    f1: 0.82,
    bleu: 0.78,
    rouge: 0.81,
    hallucination: 0.05,
  },
}

const DEMO_FAILURES = [
  {
    id: 1,
    input: "What is the capital of France?",
    expected: "Paris",
    predicted: "The capital of France is Paris, France",
    model: "gpt-4",
    reason: "Over-verbose response",
  },
  {
    id: 2,
    input: 'Translate "hello" to Spanish',
    expected: "hola",
    predicted: "buenos días",
    model: "claude-3",
    reason: "Wrong translation",
  },
  {
    id: 3,
    input: "List 3 benefits of exercise",
    expected: "Improves cardiovascular health, builds strength, enhances mental health",
    predicted: "Makes you fit",
    model: "gpt-35-turbo",
    reason: "Incomplete response",
  },
]

const COMPARISON_DATA = [
  { model: "GPT-4", accuracy: 89, f1: 87, bleu: 82 },
  { model: "Claude 3", accuracy: 91, f1: 89, bleu: 84 },
  { model: "GPT-3.5", accuracy: 84, f1: 82, bleu: 78 },
]

export default function ResultsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"metrics" | "failures">("metrics")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">ML</span>
            </div>
            <span className="font-bold text-lg">ModelLens</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => router.push("/")}>
              Home
            </Button>
            <Button variant="outline" onClick={() => router.push("/settings")} className="text-xs">
              Settings
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-3">Evaluation Results</h1>
            <p className="text-muted-foreground">Comprehensive metrics comparison across selected models</p>
          </div>
          <Button onClick={() => router.push("/export")} className="bg-primary hover:bg-primary/90">
            Export Results
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("metrics")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "metrics"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab("failures")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "failures"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Top Failures
          </button>
        </div>

        {activeTab === "metrics" && (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <MetricCard title="Best Accuracy" value="91%" model="Claude 3" trend="+2%" />
              <MetricCard title="Fastest Latency" value="0.89s" model="GPT-3.5 Turbo" trend="-0.3s" />
              <MetricCard title="Lowest Hallucination" value="2%" model="Claude 3" trend="-1%" />
            </div>

            {/* Comparison Charts */}
            <Card className="border-border bg-card/50 backdrop-blur p-8">
              <h2 className="text-xl font-semibold mb-6">Model Comparison</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={COMPARISON_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                  <XAxis dataKey="model" stroke="hsl(var(--color-muted-foreground))" />
                  <YAxis stroke="hsl(var(--color-muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--color-card))",
                      border: "1px solid hsl(var(--color-border))",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="accuracy" fill="hsl(var(--color-chart-1))" />
                  <Bar dataKey="f1" fill="hsl(var(--color-chart-2))" />
                  <Bar dataKey="bleu" fill="hsl(var(--color-chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Detailed Metrics */}
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(DEMO_METRICS).map(([modelName, metrics]) => (
                <Card key={modelName} className="border-border bg-card/50 backdrop-blur p-6">
                  <h3 className="font-semibold mb-4 capitalize">{modelName}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Latency</span>
                      <span className="font-medium">{metrics.latency}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-medium">{(metrics.accuracy * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">F1 Score</span>
                      <span className="font-medium">{(metrics.f1 * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">BLEU</span>
                      <span className="font-medium">{(metrics.bleu * 100).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ROUGE</span>
                      <span className="font-medium">{(metrics.rouge * 100).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hallucination</span>
                      <span className="font-medium">{(metrics.hallucination * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "failures" && <FailuresList failures={DEMO_FAILURES} />}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mt-12">
          <Button variant="outline" onClick={() => router.push("/run")}>
            Back to Configuration
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/")}>
              Home
            </Button>
            <Button onClick={() => router.push("/export")} className="bg-primary hover:bg-primary/90">
              Export Results
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
