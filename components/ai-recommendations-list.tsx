"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import type { AIRecommendation } from "@/lib/ai-recommendations"

export function AIRecommendationsList() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await fetch("/api/ai-recommendations")
        const data = await response.json()
        setRecommendations(data.recommendations || [])
      } catch (error) {
        console.error("[v0] Failed to fetch recommendations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  const priorityColors = {
    high: "bg-destructive/10 text-destructive border-destructive/30",
    medium: "bg-warning/10 text-warning-foreground border-warning/30",
    low: "bg-primary/10 text-primary border-primary/30",
  }

  const categoryIcons = {
    energy: "⚡",
    temperature: "🌡️",
    scheduling: "📅",
    general: "💡",
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Recommendations</CardTitle>
          </div>
          <CardDescription>Loading intelligent suggestions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>AI Recommendations</CardTitle>
        </div>
        <CardDescription>Powered by Mistral-7B via OpenRouter (fallback: rule-based)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.id} className="flex gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div className="text-2xl">{categoryIcons[rec.category]}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm leading-tight">{rec.title}</h4>
                  <Badge variant="outline" className={priorityColors[rec.priority]}>
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
                <div className="flex items-center gap-4 pt-2 text-xs">
                  <div className="flex items-center gap-1 text-primary">
                    <TrendingUp className="h-3 w-3" />
                    <span>{rec.impact}</span>
                  </div>
                  {rec.savings && (
                    <div className="flex items-center gap-1 text-success">
                      <DollarSign className="h-3 w-3" />
                      <span>RM {rec.savings.toFixed(2)}/day</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
