"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import type { CostAnalysis } from "@/lib/energy"

export function CostAnalysisCard() {
  const [analysis, setAnalysis] = useState<CostAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await fetch("/api/ai-recommendations")
        const data = await response.json()
        setAnalysis(data.costAnalysis)
      } catch (error) {
        console.error("[v0] Failed to fetch cost analysis:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [])

  if (loading || !analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cost Analysis</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Cost Analysis</CardTitle>
        <CardDescription>Based on TNB commercial rate (RM 0.467/kWh)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current Daily Cost</span>
            <span className="font-semibold">RM {analysis.currentCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Optimized Cost</span>
            <span className="font-semibold text-primary">RM {analysis.optimizedCost.toFixed(2)}</span>
          </div>
        </div>

        <div className="pt-4 border-t space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-medium">Daily Waste</p>
                <p className="text-xs text-muted-foreground">Money lost per day</p>
              </div>
            </div>
            <span className="text-xl font-bold text-destructive">RM {analysis.dailyWaste.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Potential Savings</p>
                <p className="text-xs text-muted-foreground">Monthly projection</p>
              </div>
            </div>
            <span className="text-xl font-bold text-primary">RM {analysis.monthlyProjection.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
