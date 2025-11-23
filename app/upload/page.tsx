"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
import Footer from "@/components/footer"

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) return

    setIsLoading(true)
    setTimeout(() => {
      sessionStorage.setItem("uploadedFile", file.name)
      sessionStorage.setItem("fileSize", file.size.toString())
      router.push("/run")
    }, 1500)
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

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Upload Dataset</h1>
          <p className="text-muted-foreground">Upload your evaluation dataset in CSV or JSON format</p>
        </div>

        {/* Upload Card */}
        <Card className="border-border bg-card/50 backdrop-blur p-8 mb-8">
          <FileUpload onFileSelect={setFile} />
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-border bg-card/50 backdrop-blur p-6">
            <h3 className="font-semibold mb-3">Supported Formats</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• CSV with headers</li>
              <li>• JSON (array of objects)</li>
              <li>• JSONL (newline-delimited)</li>
              <li>• Up to 100MB files</li>
            </ul>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur p-6">
            <h3 className="font-semibold mb-3">Required Fields</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Input text/prompt</li>
              <li>• Expected output (reference)</li>
              <li>• Optional: category, difficulty</li>
            </ul>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            Back
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/results")}>
              Use Demo Data
            </Button>
            <Button onClick={handleUpload} disabled={!file || isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? "Processing..." : "Continue"}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
