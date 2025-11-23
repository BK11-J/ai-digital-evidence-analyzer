"use client"

import { Checkbox } from "@/components/ui/checkbox"

interface Model {
  id: string
  name: string
  provider: string
  enabled: boolean
}

interface ModelSelectorProps {
  models: Model[]
  selected: string[]
  onSelectionChange: (modelIds: string[]) => void
}

export function ModelSelector({ models, selected, onSelectionChange }: ModelSelectorProps) {
  const toggle = (id: string) => {
    const newSelected = selected.includes(id) ? selected.filter((modelId) => modelId !== id) : [...selected, id]
    onSelectionChange(newSelected)
  }

  return (
    <div className="space-y-3">
      {models.map((model) => (
        <div
          key={model.id}
          className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-card/50 transition-colors cursor-pointer"
          onClick={() => toggle(model.id)}
        >
          <Checkbox checked={selected.includes(model.id)} onChange={() => toggle(model.id)} />
          <div className="flex-1">
            <p className="font-medium text-sm">{model.name}</p>
            <p className="text-xs text-muted-foreground">{model.provider}</p>
          </div>
          {!model.enabled && (
            <span className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive">Not configured</span>
          )}
        </div>
      ))}
    </div>
  )
}
