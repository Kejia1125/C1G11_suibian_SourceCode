import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Wifi, Activity, Calendar } from "lucide-react"
import type { OccupancyResult } from "@/lib/occupancy"

interface OccupancyResultCardProps {
  result: OccupancyResult
  roomName: string
}

export function OccupancyResultCard({ result, roomName }: OccupancyResultCardProps) {
  const scorePercent = Math.round(result.score * 100)

  const statusConfig = {
    Empty: {
      color: "bg-muted text-muted-foreground",
      progressColor: "bg-muted-foreground",
      description: "The room appears to be unoccupied based on sensor data.",
    },
    Low: {
      color: "bg-warning/20 text-warning-foreground border-warning/30",
      progressColor: "bg-warning",
      description: "The room has minimal occupancy. Some activity detected.",
    },
    Occupied: {
      color: "bg-primary/20 text-primary border-primary/30",
      progressColor: "bg-primary",
      description: "The room is actively being used with significant occupancy.",
    },
  }

  const config = statusConfig[result.label]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Occupancy Analysis Result
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">{roomName}</p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-5xl font-bold">{scorePercent}%</span>
            <Badge variant="outline" className={`text-lg px-4 py-1 ${config.color}`}>
              {result.label}
            </Badge>
          </div>
          <Progress value={scorePercent} className="h-3 mt-4 max-w-xs mx-auto" />
        </div>

        <p className="text-sm text-muted-foreground text-center">{config.description}</p>

        <div className="space-y-3 pt-4 border-t">
          <h4 className="text-sm font-medium">Probability Breakdown</h4>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Wifi className="h-4 w-4 text-primary" />
                <span>WiFi Probability</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={result.wifiProbability * 100} className="w-20 h-2" />
                <span className="text-sm font-medium w-12 text-right">{Math.round(result.wifiProbability * 100)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-primary" />
                <span>Motion Probability</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={result.motionProbability * 100} className="w-20 h-2" />
                <span className="text-sm font-medium w-12 text-right">
                  {Math.round(result.motionProbability * 100)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Schedule Probability</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={result.scheduleProbability * 100} className="w-20 h-2" />
                <span className="text-sm font-medium w-12 text-right">
                  {Math.round(result.scheduleProbability * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
