"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PremiumBadge } from "./premium-badge"

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  featureName: string
  onUpgradeClick: () => void
}

export function UpgradeModal({ open, onOpenChange, featureName, onUpgradeClick }: UpgradeModalProps) {
  const [isDemo, setIsDemo] = useState(true)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PremiumBadge />
            Unlock Premium
          </DialogTitle>
          <DialogDescription>
            {featureName} is a premium feature. Upgrade to get access to all advanced capabilities.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="p-6 border-2 border-primary/30">
            <h3 className="font-semibold mb-2">ModelLens Premium</h3>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <span>✓</span> Export CSV/PDF reports
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Large job processing (100K+ samples)
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Team seat management
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Scheduled reports & automation
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Priority support
              </li>
            </ul>

            <div className="text-center mb-6">
              <p className="text-2xl font-bold">$29</p>
              <p className="text-xs text-muted-foreground">/month or $290/year</p>
              <p className="text-xs text-primary mt-2">7-day free trial included</p>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsDemo(true)
                onUpgradeClick()
              }}
              className="flex-1"
            >
              Demo Checkout
            </Button>
            <Button
              onClick={() => {
                setIsDemo(false)
                onUpgradeClick()
              }}
              className="flex-1"
            >
              Go Premium
            </Button>
          </div>

          <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
