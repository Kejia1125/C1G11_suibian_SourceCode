// Hourly energy consumption data utilities

export interface HourlyEnergyData {
  room: string
  date: string
  hour: number
  kwh: number
}

// Mock hourly energy data based on provided JSON
export const mockHourlyEnergy: HourlyEnergyData[] = [
  { room: "Tutorial Room 1", date: "2025-11-27", hour: 9, kwh: 12 },
  { room: "Tutorial Room 1", date: "2025-11-27", hour: 15, kwh: 35 },
  { room: "Tutorial Room 1", date: "2025-11-27", hour: 17, kwh: 42 },
  { room: "Computer Lab 1", date: "2025-11-27", hour: 11, kwh: 22 },
  { room: "Computer Lab 1", date: "2025-11-27", hour: 16, kwh: 46 },
  { room: "Computer Lab 1", date: "2025-11-27", hour: 19, kwh: 55 },
  { room: "Tutorial Room 2", date: "2025-11-27", hour: 10, kwh: 8 },
  { room: "Tutorial Room 2", date: "2025-11-27", hour: 14, kwh: 29 },
  { room: "Tutorial Room 2", date: "2025-11-27", hour: 18, kwh: 41 },
  { room: "Meeting Room 1", date: "2025-11-27", hour: 17, kwh: 40 },
  { room: "Library Area 1", date: "2025-11-27", hour: 13, kwh: 26 },
  { room: "Library Area 1", date: "2025-11-27", hour: 16, kwh: 39 },
]

// Get peak usage hours
export function getPeakUsageHours(data: HourlyEnergyData[]): { hour: number; totalKwh: number }[] {
  const hourlyTotals = new Map<number, number>()

  data.forEach((entry) => {
    const current = hourlyTotals.get(entry.hour) || 0
    hourlyTotals.set(entry.hour, current + entry.kwh)
  })

  return Array.from(hourlyTotals.entries())
    .map(([hour, totalKwh]) => ({ hour, totalKwh }))
    .sort((a, b) => b.totalKwh - a.totalKwh)
}

// Get room energy profile
export function getRoomEnergyProfile(
  room: string,
  data: HourlyEnergyData[],
): {
  totalKwh: number
  peakHour: number
  peakKwh: number
  averageKwh: number
} {
  const roomData = data.filter((d) => d.room === room)

  if (roomData.length === 0) {
    return { totalKwh: 0, peakHour: 0, peakKwh: 0, averageKwh: 0 }
  }

  const totalKwh = roomData.reduce((sum, d) => sum + d.kwh, 0)
  const averageKwh = totalKwh / roomData.length

  const peak = roomData.reduce((max, d) => (d.kwh > max.kwh ? d : max), roomData[0])

  return {
    totalKwh: Number.parseFloat(totalKwh.toFixed(2)),
    peakHour: peak.hour,
    peakKwh: peak.kwh,
    averageKwh: Number.parseFloat(averageKwh.toFixed(2)),
  }
}
