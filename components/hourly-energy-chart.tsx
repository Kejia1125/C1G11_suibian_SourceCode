"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { mockHourlyEnergy, getPeakUsageHours } from "@/lib/hourly-energy"
import { Zap } from "lucide-react"

export function HourlyEnergyChart() {
  const peakHours = getPeakUsageHours(mockHourlyEnergy).slice(0, 10)

  const chartData = peakHours.map((item) => ({
    hour: `${item.hour}:00`,
    kwh: item.totalKwh,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Peak Energy Usage Hours
        </CardTitle>
        <CardDescription>Highest consumption time slots across all rooms</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            kwh: {
              label: "Energy (kWh)",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="kwh" fill="var(--color-kwh)" radius={[4, 4, 0, 0]} name="Energy (kWh)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
