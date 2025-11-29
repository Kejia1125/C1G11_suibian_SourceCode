"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import type { RoomData } from "@/lib/occupancy"

interface OccupancyChartProps {
  rooms: RoomData[]
}

const COLORS: Record<"Empty" | "Low" | "Occupied", string> = {
  Empty: "#22c55e", // Green-500
  Low: "#eab308", // Yellow-500
  Occupied: "#3b82f6", // Blue-500
}

export function OccupancyChart({ rooms }: OccupancyChartProps) {
  const statusCounts = rooms.reduce(
    (acc, room) => {
      if (room.status === "Empty" || room.status === "Low" || room.status === "Occupied") {
        acc[room.status]++
      }
      return acc
    },
    { Empty: 0, Low: 0, Occupied: 0 } as Record<"Empty" | "Low" | "Occupied", number>,
  )

  const data = [
    { name: "Empty", value: statusCounts.Empty, fill: COLORS.Empty },
    { name: "Low", value: statusCounts.Low, fill: COLORS.Low },
    { name: "Occupied", value: statusCounts.Occupied, fill: COLORS.Occupied },
  ].filter((item) => item.value > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Occupancy Distribution</CardTitle>

        <div className="grid grid-cols-3 gap-4 pt-2 text-sm text-muted-foreground">
          {(["Empty", "Low", "Occupied"] as const).map((label) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[label] }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                isAnimationActive={true}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: "14px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
