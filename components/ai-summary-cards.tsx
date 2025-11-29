"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, DollarSign, AlertTriangle, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

interface SummaryData {
  energyWaste: number
  costWaste: number
  topIssue: string
  recommendations: number
}

export function AISummaryCards() {
  const [data, setData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/ai-recommendations")
        const result = await response.json()

        setData({
          energyWaste: result.costAnalysis.dailyWaste,
          costWaste: result.costAnalysis.monthlyProjection,
          topIssue: result.energyWastes[0]?.roomName || "No issues",
          recommendations: result.recommendations.length,
        })
      } catch (error) {
        console.error("[v0] Failed to fetch AI summary:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: "Energy Waste Today",
      value: `RM ${data?.energyWaste.toFixed(2)}`,
      icon: Zap,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      badge: "Daily",
    },
    {
      title: "Monthly Projection",
      value: `RM ${data?.costWaste.toFixed(2)}`,
      icon: DollarSign,
      color: "text-warning",
      bgColor: "bg-warning/10",
      badge: "Est.",
    },
    {
      title: "Most Inefficient",
      value: data?.topIssue || "N/A",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      badge: "Alert",
    },
    {
      title: "AI Insights",
      value: data?.recommendations || 0,
      icon: Sparkles,
      color: "text-primary",
      bgColor: "bg-primary/10",
      badge: "Active",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {card.badge}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                <p className="text-2xl font-bold tracking-tight">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
