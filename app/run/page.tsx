"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Footer from "@/components/footer"

const AVAILABLE_MODELS = [
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI", enabled: true },
  { id: "gpt-35-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI", enabled: true },
  { id: "llama-2", name: "Llama 2 7B", provider: "HuggingFace", enabled: false },
  { id: "llama-2-70b", name: "Llama 2 70B", provider: "HuggingFace", enabled: false },
  { id: "claude-3", name: "Claude 3", provider: "Anthropic", enabled: true },
  { id: "local-bert", name: "Local BERT", provider: "Local", enabled: false },
]

export default function RunPage() {
  const router = useRouter()
  const [selectedModels, setSelectedModels] = useState<string[]>(["gpt-4", "claude-3"])
  const [isRunning, setIsRunning] = useState(false)

  const toggleModel = (modelId: string) => {
    setSelectedModels((prev) => (prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]))
  }

  const handleRun = async () => {
    if (selectedModels.length === 0) return

    setIsRunning(true)
    setTimeout(() => {
      sessionStorage.setItem("selectedModels", JSON.stringify(selectedModels))
      router.push("/results")
    }, 3000)
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

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Configure Evaluation</h1>
          <p className="text-muted-foreground">Select models and configure evaluation parameters</p>
        </div>

        {/* Models Selection */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Select Models</h2>
          <div className="grid gap-4">
            {AVAILABLE_MODELS.map((model) => (
              <div
                key={model.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-card/30 transition-colors cursor-pointer"
                onClick={() => toggleModel(model.id)}
              >
                <Checkbox checked={selectedModels.includes(model.id)} onChange={() => toggleModel(model.id)} />
                <div className="flex-1">
                  <p className="font-medium">{model.name}</p>
                  <p className="text-sm text-muted-foreground">{model.provider}</p>
                </div>
                {!model.enabled && (
                  <span className="text-xs px-2 py-1 rounded bg-muted/50 text-muted-foreground">Not configured</span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Dataset Size Selection */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Dataset Size</h2>
          <div className="space-y-4">
            <label className="flex items-start gap-4 p-4 rounded-lg border border-border cursor-pointer hover:bg-card/30 transition-colors">
              <input type="radio" name="size" value="small" defaultChecked className="mt-1" />
              <div className="flex-1">
                <p className="font-medium">Small (Up to 10,000 samples)</p>
                <p className="text-sm text-muted-foreground">Free</p>
              </div>
            </label>

            <label className="flex items-start gap-4 p-4 rounded-lg border border-border cursor-pointer hover:bg-card/30 transition-colors">
              <input type="radio" name="size" value="large" className="mt-1" />
              <div className="flex-1">
                <p className="font-medium">Large (100K+ samples)</p>
                <p className="text-sm text-muted-foreground">Free</p>
              </div>
            </label>
          </div>
        </Card>

        {/* Metrics Configuration */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Evaluation Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "Latency", checked: true },
              { name: "Accuracy/F1", checked: true },
              { name: "BLEU Score", checked: true },
              { name: "ROUGE Score", checked: true },
              { name: "Hallucination Rate", checked: true },
              { name: "Token Count", checked: false },
            ].map((metric) => (
              <label key={metric.name} className="flex items-center gap-3 cursor-pointer">
                <Checkbox defaultChecked={metric.checked} />
                <span className="text-sm">{metric.name}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button variant="outline" onClick={() => router.push("/upload")}>
            Back
          </Button>
          <Button
            onClick={handleRun}
            disabled={selectedModels.length === 0 || isRunning}
            className="bg-primary hover:bg-primary/90"
          >
            {isRunning ? "Running Evaluation..." : "Run Evaluation"}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
