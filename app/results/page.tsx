"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MetricCard } from "@/components/metric-card"
import { FailuresList } from "@/components/failures-list"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const DEMO_METRICS = {
  "gpt-4": {
    latency: 1.24,
    accuracy: 0.89,
    f1: 0.87,
    bleu: 0.82,
    rouge: 0.85,
    hallucination: 0.03,
    tokenUsage: 1250,
    costPerRequest: 0.015,
    errorRate: 1.2,
  },
  "claude-3": {
    latency: 1.58,
    accuracy: 0.91,
    f1: 0.89,
    bleu: 0.84,
    rouge: 0.87,
    hallucination: 0.02,
    tokenUsage: 980,
    costPerRequest: 0.012,
    errorRate: 0.8,
  },
  "gpt-35-turbo": {
    latency: 0.89,
    accuracy: 0.84,
    f1: 0.82,
    bleu: 0.78,
    rouge: 0.81,
    hallucination: 0.05,
    tokenUsage: 1100,
    costPerRequest: 0.008,
    errorRate: 2.1,
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

const MODEL_OPTIONS = [
  { label: "Model A", value: "model-a" },
  { label: "Model B", value: "model-b" },
  { label: "Model C", value: "model-c" },
]

export default function ResultsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"metrics" | "failures">("metrics")
  const [selectedModel, setSelectedModel] = useState("model-a")

  const calculateAverageScore = () => {
    const metrics = Object.values(DEMO_METRICS)
    const avg = metrics.reduce((sum, m) => sum + m.accuracy, 0) / metrics.length
    return (avg * 100).toFixed(1)
  }

  const getLastRunTime = () => {
    const now = new Date()
    const minutesAgo = Math.floor(Math.random() * 120) + 5
    return `${minutesAgo} min ago`
  }

  const handleDownloadReport = () => {
    const csvContent = `ModelLens — AI Model Dashboard Report
Generated: ${new Date().toLocaleString()}

PROBLEM STATEMENT:
• Model operations teams need live metrics to maintain AI performance across deployments

METRIC SUMMARY:
• Average Score: ${calculateAverageScore()}%
• Last Run Time: ${getLastRunTime()}

DETAILED METRICS:
Model,Latency (ms),Token Usage,Cost per Request,Error Rate (%),Accuracy,F1 Score
GPT-4,${DEMO_METRICS["gpt-4"].latency * 1000},${DEMO_METRICS["gpt-4"].tokenUsage},\$${DEMO_METRICS["gpt-4"].costPerRequest},${DEMO_METRICS["gpt-4"].errorRate},${(DEMO_METRICS["gpt-4"].accuracy * 100).toFixed(0)}%,${(DEMO_METRICS["gpt-4"].f1 * 100).toFixed(0)}%
Claude 3,${DEMO_METRICS["claude-3"].latency * 1000},${DEMO_METRICS["claude-3"].tokenUsage},\$${DEMO_METRICS["claude-3"].costPerRequest},${DEMO_METRICS["claude-3"].errorRate},${(DEMO_METRICS["claude-3"].accuracy * 100).toFixed(0)}%,${(DEMO_METRICS["claude-3"].f1 * 100).toFixed(0)}%
GPT-3.5,${DEMO_METRICS["gpt-35-turbo"].latency * 1000},${DEMO_METRICS["gpt-35-turbo"].tokenUsage},\$${DEMO_METRICS["gpt-35-turbo"].costPerRequest},${DEMO_METRICS["gpt-35-turbo"].errorRate},${(DEMO_METRICS["gpt-35-turbo"].accuracy * 100).toFixed(0)}%,${(DEMO_METRICS["gpt-35-turbo"].f1 * 100).toFixed(0)}%`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "modellens-report.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

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

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">ModelLens — AI Model Dashboard</h1>
          <p className="text-lg text-muted-foreground mb-6">Designed & Built by Bhumi Kadam</p>

          <Card className="border-border bg-gradient-to-r from-primary/5 to-accent/5 p-6 mb-8">
            <div className="flex gap-4">
              <div className="text-2xl">→</div>
              <div>
                <h3 className="font-semibold mb-2">Problem Statement</h3>
                <p className="text-muted-foreground">
                  • Model operations teams need live metrics to maintain AI performance across deployments
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border bg-card/50 backdrop-blur p-6 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">• Latency (ms)</p>
                  <p className="text-3xl font-bold">1.24</p>
                  <p className="text-xs text-muted-foreground mt-3">Avg response time</p>
                </div>
              </div>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur p-6 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">• Token Usage</p>
                  <p className="text-3xl font-bold">1,110</p>
                  <p className="text-xs text-muted-foreground mt-3">Avg tokens per request</p>
                </div>
              </div>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur p-6 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">• Cost per Request</p>
                  <p className="text-3xl font-bold">$0.012</p>
                  <p className="text-xs text-muted-foreground mt-3">Avg cost per request</p>
                </div>
              </div>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur p-6 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">• Error Rate (%)</p>
                  <p className="text-3xl font-bold">1.4</p>
                  <p className="text-xs text-muted-foreground mt-3">Avg error rate</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Model Selection</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-48 bg-transparent">
                  {MODEL_OPTIONS.find((m) => m.value === selectedModel)?.label || "Select Model"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {MODEL_OPTIONS.map((model) => (
                  <DropdownMenuItem key={model.value} onClick={() => setSelectedModel(model.value)}>
                    {model.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={handleDownloadReport} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            Download Report (PDF)
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="border-border bg-card/50 backdrop-blur p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">• Average Score</p>
                <p className="text-3xl font-bold">{calculateAverageScore()}%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
            </div>
          </Card>
          <Card className="border-border bg-card/50 backdrop-blur p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">• Last Run Time</p>
                <p className="text-3xl font-bold">{getLastRunTime()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <span className="text-lg">⏱️</span>
              </div>
            </div>
          </Card>
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
              <MetricCard title="Fastest Latency" value="0.89s" model="Model B" trend="-0.3s" />
              <MetricCard title="Lowest Hallucination" value="2%" model="Model C" trend="-1%" />
            </div>

            {/* Comparison Charts */}
            <Card className="border-border bg-card/50 backdrop-blur p-8 rounded-lg">
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
                <Card key={modelName} className="border-border bg-card/50 backdrop-blur p-6 rounded-lg">
                  <h3 className="font-semibold mb-4 capitalize">{modelName}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">• Latency</span>
                      <span className="font-medium">{metrics.latency}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">• Accuracy</span>
                      <span className="font-medium">{(metrics.accuracy * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">• F1 Score</span>
                      <span className="font-medium">{(metrics.f1 * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">• BLEU</span>
                      <span className="font-medium">{(metrics.bleu * 100).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">• ROUGE</span>
                      <span className="font-medium">{(metrics.rouge * 100).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">• Hallucination</span>
                      <span className="font-medium">{(metrics.hallucination * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="text-muted-foreground">• Tokens</span>
                      <span className="font-medium">{metrics.tokenUsage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">• Cost/Req</span>
                      <span className="font-medium">${metrics.costPerRequest.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">• Error Rate</span>
                      <span className="font-medium">{metrics.errorRate}%</span>
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

      <footer className="border-t border-border bg-card/40 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-sm text-muted-foreground">ModelLens — Designed & Built by Bhumi Kadam</p>
        </div>
      </footer>
    </div>
  )
}
