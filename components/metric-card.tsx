"use client"

import { Card } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string
  model: string
  trend: string
}

export function MetricCard({ title, value, model, trend }: MetricCardProps) {
  return (
    <Card className="border-border bg-card/50 backdrop-blur p-6">
      <p className="text-sm text-muted-foreground mb-2">{title}</p>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{model}</p>
        <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">{trend}</span>
      </div>
    </Card>
  )
}
