"use client"

import { Card } from "@/components/ui/card"

interface Failure {
  id: number
  input: string
  expected: string
  predicted: string
  model: string
  reason: string
}

interface FailuresListProps {
  failures: Failure[]
}

export function FailuresList({ failures }: FailuresListProps) {
  return (
    <div className="space-y-4">
      {failures.map((failure) => (
        <Card key={failure.id} className="border-border bg-card/50 backdrop-blur p-6">
          <div className="grid gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Input</p>
              <p className="text-sm">{failure.input}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Expected</p>
                <p className="text-sm bg-green-500/10 p-2 rounded border border-green-500/20 text-green-300">
                  {failure.expected}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Predicted</p>
                <p className="text-sm bg-red-500/10 p-2 rounded border border-red-500/20 text-red-300">
                  {failure.predicted}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded bg-muted/50">{failure.model}</span>
                <span className="px-2 py-1 rounded bg-destructive/20 text-destructive">{failure.reason}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
