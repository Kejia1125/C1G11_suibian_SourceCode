import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, AlertTriangle, Leaf } from "lucide-react"
import type { RoomData, AlertData } from "@/lib/occupancy"

interface StatsCardsProps {
  rooms: RoomData[]
  alerts: AlertData[]
}

export function StatsCards({ rooms, alerts }: StatsCardsProps) {
  const totalRooms = rooms.length
  const occupiedRooms = rooms.filter((r) => r.status === "Occupied").length
  const avgOccupancy = Math.round((rooms.reduce((sum, r) => sum + r.occupancyScore, 0) / totalRooms) * 100)
  const totalAlerts = alerts.length

  const stats = [
    {
      title: "Total Rooms",
      value: totalRooms,
      icon: Building2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Currently Occupied",
      value: occupiedRooms,
      icon: Users,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Active Alerts",
      value: totalAlerts,
      icon: AlertTriangle,
      color: totalAlerts > 0 ? "text-destructive" : "text-primary",
      bgColor: totalAlerts > 0 ? "bg-destructive/10" : "bg-primary/10",
    },
    {
      title: "Avg. Occupancy",
      value: `${avgOccupancy}%`,
      icon: Leaf,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
