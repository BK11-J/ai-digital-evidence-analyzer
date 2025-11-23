"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Footer from "@/components/footer"

export default function ExportPage() {
  const router = useRouter()
  const [exportFormat, setExportFormat] = useState("csv")
  const [selectedData, setSelectedData] = useState(["metrics", "failures"])

  const toggleData = (dataType: string) => {
    setSelectedData((prev) => (prev.includes(dataType) ? prev.filter((d) => d !== dataType) : [...prev, dataType]))
  }

  const handleExport = () => {
    alert(`Exporting as ${exportFormat.toUpperCase()} with: ${selectedData.join(", ")}`)
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
          <h1 className="text-4xl font-bold mb-3">Export Results</h1>
          <p className="text-muted-foreground">Download your evaluation results in any format</p>
        </div>

        {/* Format Selection */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Export Format</h2>
          <div className="space-y-4">
            {[
              { id: "csv", label: "CSV (Spreadsheet)", description: "Excel & Google Sheets compatible" },
              { id: "pdf", label: "PDF Report", description: "Formatted report with charts" },
              { id: "json", label: "JSON", description: "Raw data for programmatic access" },
            ].map((format) => (
              <label
                key={format.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-border cursor-pointer hover:bg-card/30 transition-colors"
              >
                <input
                  type="radio"
                  name="format"
                  value={format.id}
                  checked={exportFormat === format.id}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium">{format.label}</p>
                  <p className="text-sm text-muted-foreground">{format.description}</p>
                </div>
              </label>
            ))}
          </div>
        </Card>

        {/* Data Selection */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Include Data</h2>
          <div className="space-y-3">
            {[
              { id: "metrics", label: "Metrics Summary" },
              { id: "failures", label: "Top Failures" },
              { id: "detailed", label: "Detailed Results" },
              { id: "config", label: "Configuration" },
            ].map((item) => (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={selectedData.includes(item.id)} onChange={() => toggleData(item.id)} />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button variant="outline" onClick={() => router.push("/results")}>
            Back
          </Button>
          <Button onClick={handleExport} className="bg-primary hover:bg-primary/90">
            Download Export
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
