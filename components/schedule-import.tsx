"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { parseScheduleCSV, type ClassSchedule } from "@/lib/schedule"

interface ScheduleImportProps {
  onScheduleImported: (schedules: ClassSchedule[]) => void
}

export function ScheduleImport({ onScheduleImported }: ScheduleImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [scheduleCount, setScheduleCount] = useState(0)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setStatus("idle")
    }
  }

  const handleImport = async () => {
    if (!file) return

    try {
      const text = await file.text()
      const schedules = parseScheduleCSV(text)

      if (schedules.length === 0) {
        setStatus("error")
        setMessage("No valid schedule data found in file")
        return
      }

      setScheduleCount(schedules.length)
      setStatus("success")
      setMessage(`Successfully imported ${schedules.length} class schedules`)
      onScheduleImported(schedules)

      console.log("[v0] Imported schedules:", schedules)
    } catch (error) {
      setStatus("error")
      setMessage("Failed to parse CSV file. Please check the format.")
      console.error("[v0] Schedule import error:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Import Class Schedule
        </CardTitle>
        <CardDescription>Upload a CSV file with columns: room, day, start_time, end_time, students</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" id="schedule-upload" />
          <label htmlFor="schedule-upload">
            <Button asChild variant="outline">
              <span className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </span>
            </Button>
          </label>
          {file && <span className="text-sm text-muted-foreground">{file.name}</span>}
        </div>

        {file && (
          <Button onClick={handleImport} className="w-full">
            Import Schedule
          </Button>
        )}

        {status === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {status === "success" && scheduleCount > 0 && (
          <div className="text-sm text-muted-foreground">
            The AI will now use this schedule data for optimization recommendations.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
