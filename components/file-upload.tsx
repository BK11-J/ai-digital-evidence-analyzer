"use client"

import type React from "react"

import { useState, useRef } from "react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.name.endsWith(".csv") || file.name.endsWith(".json") || file.name.endsWith(".jsonl")) {
        setFileName(file.name)
        onFileSelect(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      const file = files[0]
      setFileName(file.name)
      onFileSelect(file)
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
      }`}
    >
      <input ref={fileInputRef} type="file" onChange={handleFileChange} accept=".csv,.json,.jsonl" className="hidden" />

      <div className="space-y-4">
        <div className="text-4xl">📁</div>
        <div>
          <p className="font-semibold mb-1">{fileName ? `Selected: ${fileName}` : "Drag and drop your file here"}</p>
          <p className="text-sm text-muted-foreground">or click to browse (CSV, JSON, JSONL)</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-sm text-primary hover:underline font-medium"
        >
          Select File
        </button>
      </div>
    </div>
  )
}
