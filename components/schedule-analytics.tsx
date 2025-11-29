"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, TrendingDown, Users, Clock } from "lucide-react"
import { groupSchedulesByRoom, analyzeScheduleEfficiency, type ClassSchedule } from "@/lib/schedule"

interface ScheduleAnalyticsProps {
  schedules: ClassSchedule[]
}

export function ScheduleAnalytics({ schedules }: ScheduleAnalyticsProps) {
  const roomSchedules = groupSchedulesByRoom(schedules)

  // Room capacities (from mock data)
  const roomCapacities = new Map([
    ["Tutorial Room 1", 40],
    ["Tutorial Room 2", 40],
    ["Computer Lab 1", 40],
    ["Library Area 1", 60],
    ["Meeting Room 1", 20],
    ["Lecture Hall A", 100],
  ])

  const inefficiencies = analyzeScheduleEfficiency(schedules, roomCapacities)
  const totalPotentialSavings = inefficiencies.reduce((sum, i) => sum + i.potentialSavings, 0)

  return (
    <div className="space-y-6">
      {/* Schedule Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Overview</CardTitle>
          <CardDescription>
            Analyzing {schedules.length} classes across {roomSchedules.size} rooms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from(roomSchedules.entries()).map(([room, data]) => (
              <div key={room} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{room}</h3>
                  <Badge variant={data.utilizationScore > 0.7 ? "default" : "secondary"}>
                    {Math.round(data.utilizationScore * 100)}%
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{data.totalHours} hours/week</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{data.classes.length} classes</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inefficiencies & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Schedule Optimization Opportunities
          </CardTitle>
          <CardDescription>Potential savings: RM {totalPotentialSavings.toFixed(2)}/day</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {inefficiencies.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No significant inefficiencies detected. Schedule is well optimized!
            </p>
          ) : (
            inefficiencies.map((item, idx) => (
              <Alert key={idx} className="border-amber-200 bg-amber-50">
                <TrendingDown className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-900">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {item.class.room} - {item.class.day} {item.class.start_time}-{item.class.end_time}
                    </div>
                    <div className="text-sm">{item.issue}</div>
                    <div className="text-sm font-medium text-teal-700">💡 {item.recommendation}</div>
                    {item.potentialSavings > 0 && (
                      <div className="text-sm text-amber-700">
                        Potential savings: RM {item.potentialSavings.toFixed(2)}/day
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
