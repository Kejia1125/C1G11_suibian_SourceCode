"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState, useEffect } from "react"
import { calculateWeeklyWasteTrend } from "@/lib/energy"
import { generateEnergyData } from "@/lib/mock-data"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value.toFixed(2)}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function EnergyWasteChart() {
  const [data, setData] = useState(() => {
    const rooms = generateEnergyData()
    return calculateWeeklyWasteTrend(rooms)
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const rooms = generateEnergyData()
      const weeklyData = calculateWeeklyWasteTrend(rooms)
      setData(weeklyData)
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  console.log("[v0] Weekly waste data:", data)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Energy Waste Trend</CardTitle>
        <CardDescription>Daily waste in kWh and cost (RM)</CardDescription>
        <div className="flex items-center gap-6 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(210 100% 50%)" }} />
            <span className="text-sm text-muted-foreground">Waste (kWh)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(45 93% 47%)" }} />
            <span className="text-sm text-muted-foreground">Cost (RM)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="day" className="text-xs" />
            <YAxis yAxisId="left" className="text-xs" label={{ value: "kWh", angle: -90, position: "insideLeft" }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              className="text-xs"
              label={{ value: "RM", angle: 90, position: "insideRight" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar yAxisId="left" dataKey="waste" fill="hsl(210 100% 50%)" name="Waste (kWh)" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="cost" fill="hsl(45 93% 47%)" name="Cost (RM)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
