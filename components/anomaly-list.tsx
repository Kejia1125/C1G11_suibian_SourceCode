import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react"
import type { Anomaly } from "@/lib/occupancy"

interface AnomalyListProps {
  anomalies: Anomaly[]
}

export function AnomalyList({ anomalies }: AnomalyListProps) {
  if (anomalies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Anomaly Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-primary/30 bg-primary/5">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">No Anomalies Detected</AlertTitle>
            <AlertDescription className="text-primary/80">
              All sensor readings are within normal parameters. The room is operating efficiently.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Anomalies Detected
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
            {anomalies.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {anomalies.map((anomaly) => (
          <Alert
            key={anomaly.id}
            variant={anomaly.type === "critical" ? "destructive" : "default"}
            className={anomaly.type === "warning" ? "border-warning/30 bg-warning/5" : ""}
          >
            <AlertTriangle className={`h-4 w-4 ${anomaly.type === "warning" ? "text-warning" : ""}`} />
            <AlertTitle>{anomaly.title}</AlertTitle>
            <AlertDescription>{anomaly.description}</AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  )
}
