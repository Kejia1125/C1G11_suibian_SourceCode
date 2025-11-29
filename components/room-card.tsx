import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Users, Thermometer, Zap, Wifi } from "lucide-react"
import type { RoomData } from "@/lib/occupancy"

interface RoomCardProps {
  room: RoomData
}

export function RoomCard({ room }: RoomCardProps) {
  const statusColors = {
    Empty: "bg-muted text-muted-foreground",
    Low: "bg-warning/20 text-warning-foreground border-warning/30",
    Occupied: "bg-primary/20 text-primary border-primary/30",
  }

  const progressColors = {
    Empty: "bg-muted-foreground",
    Low: "bg-warning",
    Occupied: "bg-primary",
  }

  return (
    <Card className="relative overflow-hidden">
      {room.hasAnomaly && (
        <div className="absolute top-0 right-0 p-2">
          <div className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-destructive">
            <AlertTriangle className="h-3 w-3" />
            <span className="text-xs font-medium">{room.anomalyCount}</span>
          </div>
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-sm font-medium">{room.name}</CardTitle>
            <p className="text-xs text-muted-foreground">Room {room.id}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{Math.round(room.occupancyScore * 100)}%</span>
            <Badge variant="outline" className={statusColors[room.status]}>
              {room.status}
            </Badge>
          </div>
          <Progress
            value={room.occupancyScore * 100}
            className="h-2"
            style={{
              ["--progress-background" as string]: `var(--${room.status === "Occupied" ? "primary" : room.status === "Low" ? "warning" : "muted-foreground"})`,
            }}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <div className="flex flex-col items-center gap-1">
            <Wifi className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">{room.wifiDevices}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Thermometer className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">{room.temperature}°C</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">{room.electricityUsage}kWh</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
