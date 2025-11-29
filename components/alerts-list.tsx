import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, AlertCircle, Clock } from "lucide-react"
import type { AlertData } from "@/lib/occupancy"

interface AlertsListProps {
  alerts: AlertData[]
}

export function AlertsList({ alerts }: AlertsListProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Today's Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-primary/30 bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">All Clear</AlertTitle>
            <AlertDescription className="text-primary/80">
              No anomalies detected. All rooms are operating normally.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          Today's Alerts
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
            {alerts.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.type === "critical" ? "destructive" : "default"}
            className={alert.type === "warning" ? "border-warning/30 bg-warning/5" : ""}
          >
            <AlertTriangle className={`h-4 w-4 ${alert.type === "warning" ? "text-warning" : ""}`} />
            <AlertTitle className="flex items-center justify-between">
              <span>{alert.title}</span>
              <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {alert.timestamp}
              </span>
            </AlertTitle>
            <AlertDescription>
              <span className="font-medium">{alert.roomName}:</span> {alert.description}
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  )
}
