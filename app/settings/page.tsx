"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    huggingface: "",
    anthropic: "",
  })

  const handleKeyChange = (key: string, value: string) => {
    setApiKeys((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    sessionStorage.setItem("apiKeys", JSON.stringify(apiKeys))
    alert("Settings saved successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">ML</span>
            </div>
            <span className="font-bold text-lg">ModelLens</span>
          </div>
          <Button variant="ghost" onClick={() => router.push("/")}>
            Home
          </Button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Settings</h1>
          <p className="text-muted-foreground">Configure API keys and model access</p>
        </div>

        {/* API Keys */}
        <Card className="border-border bg-card/50 backdrop-blur p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">API Keys</h2>
          <div className="space-y-6">
            {[
              { key: "openai", label: "OpenAI API Key", placeholder: "sk-..." },
              { key: "huggingface", label: "HuggingFace Token", placeholder: "hf_..." },
              { key: "anthropic", label: "Anthropic API Key", placeholder: "sk-ant-..." },
            ].map((config) => (
              <div key={config.key}>
                <label className="block text-sm font-medium mb-2">{config.label}</label>
                <Input
                  type="password"
                  placeholder={config.placeholder}
                  value={apiKeys[config.key as keyof typeof apiKeys]}
                  onChange={(e) => handleKeyChange(config.key, e.target.value)}
                  className="bg-input border-border"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your API keys are only stored locally and never sent to our servers.
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Demo Mode */}
        <Card className="border-border bg-card/50 backdrop-blur p-8 mb-8">
          <h2 className="text-xl font-semibold mb-3">Demo Mode</h2>
          <p className="text-muted-foreground mb-4">
            Without API keys configured, ModelLens will use demo data with sample results. Configure API keys above to
            evaluate your own models.
          </p>
          <Button variant="outline" onClick={() => router.push("/results")}>
            View Demo Results
          </Button>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            Back
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Save Settings
          </Button>
        </div>
      </main>
    </div>
  )
}
