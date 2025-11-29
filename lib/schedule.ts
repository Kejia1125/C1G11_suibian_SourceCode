// Schedule management and parsing utilities

export interface ClassSchedule {
  room: string
  day: string
  start_time: string
  end_time: string
  students: number
}

export interface RoomScheduleData {
  room: string
  totalHours: number
  classes: ClassSchedule[]
  utilizationScore: number
}

// Parse CSV schedule data
export function parseScheduleCSV(csvContent: string): ClassSchedule[] {
  const lines = csvContent.trim().split("\n")
  const schedules: ClassSchedule[] = []

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const [room, day, start_time, end_time, students] = line.split(",").map((s) => s.trim())

    schedules.push({
      room,
      day,
      start_time,
      end_time,
      students: Number.parseInt(students) || 0,
    })
  }

  return schedules
}

// Group schedules by room
export function groupSchedulesByRoom(schedules: ClassSchedule[]): Map<string, RoomScheduleData> {
  const roomMap = new Map<string, RoomScheduleData>()

  schedules.forEach((schedule) => {
    const existing = roomMap.get(schedule.room) || {
      room: schedule.room,
      totalHours: 0,
      classes: [],
      utilizationScore: 0,
    }

    // Calculate hours for this class
    const startHour = Number.parseInt(schedule.start_time.split(":")[0])
    const endHour = Number.parseInt(schedule.end_time.split(":")[0])
    const hours = endHour - startHour

    existing.totalHours += hours
    existing.classes.push(schedule)

    roomMap.set(schedule.room, existing)
  })

  // Calculate utilization scores (assuming 12 hours/day is max)
  roomMap.forEach((data) => {
    data.utilizationScore = Math.min(data.totalHours / 12, 1)
  })

  return roomMap
}

// Default/mock schedule data
export const defaultSchedule: ClassSchedule[] = [
  { room: "Tutorial Room 1", day: "Monday", start_time: "8:00", end_time: "10:00", students: 15 },
  { room: "Computer Lab 1", day: "Monday", start_time: "14:00", end_time: "16:00", students: 35 },
  { room: "Tutorial Room 2", day: "Tuesday", start_time: "9:00", end_time: "11:00", students: 10 },
  { room: "Library Area 1", day: "Wednesday", start_time: "12:00", end_time: "14:00", students: 25 },
  { room: "Meeting Room 1", day: "Friday", start_time: "16:00", end_time: "18:00", students: 8 },
  { room: "Computer Lab 1", day: "Thursday", start_time: "18:00", end_time: "20:00", students: 20 },
  { room: "Tutorial Room 1", day: "Friday", start_time: "14:00", end_time: "16:00", students: 12 },
  { room: "Computer Lab 1", day: "Monday", start_time: "10:00", end_time: "12:00", students: 40 },
  { room: "Tutorial Room 2", day: "Monday", start_time: "14:00", end_time: "16:00", students: 30 },
  { room: "Meeting Room 1", day: "Tuesday", start_time: "18:00", end_time: "19:00", students: 5 },
]

// Analyze schedule inefficiencies
export interface ScheduleInefficiency {
  class: ClassSchedule
  issue: string
  recommendation: string
  potentialSavings: number
}

export function analyzeScheduleEfficiency(
  schedules: ClassSchedule[],
  roomCapacities: Map<string, number>,
): ScheduleInefficiency[] {
  const inefficiencies: ScheduleInefficiency[] = []

  schedules.forEach((schedule) => {
    const capacity = roomCapacities.get(schedule.room) || 40
    const utilization = schedule.students / capacity

    // Underutilized large room
    if (capacity > 30 && utilization < 0.3) {
      inefficiencies.push({
        class: schedule,
        issue: `Only ${schedule.students} students in ${capacity}-seat room (${Math.round(utilization * 100)}% utilization)`,
        recommendation: `Move to a smaller room (20-seat) to reduce AC and lighting load`,
        potentialSavings: 2.5,
      })
    }

    // Overcrowded room
    if (utilization > 0.95) {
      inefficiencies.push({
        class: schedule,
        issue: `Room at ${Math.round(utilization * 100)}% capacity`,
        recommendation: `Consider moving to a larger room for better comfort and air circulation`,
        potentialSavings: 0,
      })
    }
  })

  return inefficiencies
}
