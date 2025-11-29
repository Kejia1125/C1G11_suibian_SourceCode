// Generate comprehensive dummy datasets for the SmartCampus Monitor

import type { EnergyData } from "./energy"

export function generateEnergyData(): EnergyData[] {
  const rooms = [
    {
      roomId: "A1",
      roomName: "Tutorial Room 1",
      powerUsage: 35,
      occupancyScore: 0.75,
      temperature: 24,
      outdoorTemp: 32,
      capacity: 40,
      actualOccupants: 30,
      scheduledHours: 6,
      roomType: "classroom" as const,
    },
    {
      roomId: "A2",
      roomName: "Tutorial Room 2",
      powerUsage: 45,
      occupancyScore: 0.15,
      temperature: 22,
      outdoorTemp: 32,
      capacity: 40,
      actualOccupants: 5,
      scheduledHours: 3,
      roomType: "classroom" as const,
    },
    {
      roomId: "LIB1",
      roomName: "Library Area 1",
      powerUsage: 28,
      occupancyScore: 0.45,
      temperature: 23,
      outdoorTemp: 32,
      capacity: 60,
      actualOccupants: 25,
      scheduledHours: 10,
      roomType: "library" as const,
    },
    {
      roomId: "LAB1",
      roomName: "Computer Lab 1",
      powerUsage: 65,
      occupancyScore: 0.85,
      temperature: 23,
      outdoorTemp: 32,
      capacity: 40,
      actualOccupants: 34,
      scheduledHours: 8,
      roomType: "lab" as const,
    },
    {
      roomId: "MTG1",
      roomName: "Meeting Room 1",
      powerUsage: 50,
      occupancyScore: 0.08,
      temperature: 21,
      outdoorTemp: 32,
      capacity: 20,
      actualOccupants: 2,
      scheduledHours: 2,
      roomType: "meeting" as const,
    },
    {
      roomId: "A3",
      roomName: "Lecture Hall A",
      powerUsage: 55,
      occupancyScore: 0.25,
      temperature: 23,
      outdoorTemp: 32,
      capacity: 100,
      actualOccupants: 25,
      scheduledHours: 4,
      roomType: "classroom" as const,
    },
  ]

  return rooms
}

// Historical energy usage data for charts
export interface HistoricalEnergyData {
  hour: string
  power: number
  occupancy: number
  temperature: number
}

export function generateHistoricalData(): HistoricalEnergyData[] {
  const hours = ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM"]
  const data: HistoricalEnergyData[] = []

  hours.forEach((hour, idx) => {
    data.push({
      hour,
      power: 150 + idx * 30 - (idx > 4 ? 50 : 0), // Peak at 2-4PM
      occupancy: 40 + idx * 15 - (idx > 4 ? 40 : 0), // Drop after 4PM
      temperature: 28 + idx * 0.8 - (idx > 4 ? 2 : 0), // Cooler in evening
    })
  })

  return data
}

// Weekly waste trend data
export interface WeeklyWasteData {
  day: string
  waste: number
  cost: number
}

// Kept for backwards compatibility but returns empty array
export function generateWeeklyWaste(): WeeklyWasteData[] {
  console.warn("[v0] generateWeeklyWaste is deprecated, use calculateWeeklyWasteTrend from energy.ts")
  return []
}
