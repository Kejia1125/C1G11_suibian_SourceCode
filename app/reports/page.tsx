"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { ScheduleImport } from "@/components/schedule-import"
import { ScheduleAnalytics } from "@/components/schedule-analytics"
import { HourlyEnergyChart } from "@/components/hourly-energy-chart"
import { defaultSchedule, type ClassSchedule } from "@/lib/schedule"

export default function ReportsPage() {
  const [schedules, setSchedules] = useState<ClassSchedule[]>(defaultSchedule)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Import schedules and view detailed energy analytics</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ScheduleImport onScheduleImported={setSchedules} />
          <HourlyEnergyChart />
        </div>

        <ScheduleAnalytics schedules={schedules} />
      </main>
    </div>
  )
}
