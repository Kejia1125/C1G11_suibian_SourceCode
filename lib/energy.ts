// Energy waste analysis and cost calculation utilities

export interface EnergyData {
  roomId: string
  roomName: string
  powerUsage: number // kWh
  occupancyScore: number
  temperature: number
  outdoorTemp: number
  capacity: number
  actualOccupants: number
  scheduledHours: number
  roomType: "classroom" | "lab" | "library" | "meeting"
}

export interface EnergyWaste {
  roomId: string
  roomName: string
  wastedKwh: number
  wastedCost: number // in RM
  wastePercentage: number
  reason: string
}

export interface CostAnalysis {
  currentCost: number
  optimizedCost: number
  potentialSavings: number
  dailyWaste: number
  monthlyProjection: number
}

// TNB tariff rates (simplified - RM per kWh)
const TNB_RATE = 0.467 // Average commercial rate

// Calculate baseline power for room type when empty
function getBaselinePower(roomType: string): number {
  switch (roomType) {
    case "classroom":
      return 2 // kWh when empty
    case "lab":
      return 5 // Higher due to equipment
    case "library":
      return 3
    case "meeting":
      return 1.5
    default:
      return 2
  }
}

// Calculate expected power based on occupancy
function getExpectedPower(roomType: string, occupancyScore: number, capacity: number): number {
  const baseline = getBaselinePower(roomType)
  const maxPower = capacity * 0.15 // Rough estimate: 150W per person
  return baseline + maxPower * occupancyScore
}

// Analyze energy waste for a single room
export function analyzeEnergyWaste(data: EnergyData): EnergyWaste | null {
  const expectedPower = getExpectedPower(data.roomType, data.occupancyScore, data.capacity)
  const wastedKwh = Math.max(0, data.powerUsage - expectedPower)

  // Only flag if waste is significant (> 10%)
  if (wastedKwh < expectedPower * 0.1) {
    return null
  }

  const wastePercentage = (wastedKwh / data.powerUsage) * 100
  const wastedCost = wastedKwh * TNB_RATE

  let reason = ""
  if (data.occupancyScore < 0.3 && data.powerUsage > 15) {
    reason = "High power usage in empty/low occupancy room"
  } else if (data.temperature < 22 && data.occupancyScore < 0.5) {
    reason = "AC overcooling with low occupancy"
  } else if (data.actualOccupants < data.capacity * 0.3 && data.powerUsage > expectedPower * 1.5) {
    reason = "Underutilized room with excessive power consumption"
  } else {
    reason = "Power usage exceeds expected baseline"
  }

  return {
    roomId: data.roomId,
    roomName: data.roomName,
    wastedKwh: Number.parseFloat(wastedKwh.toFixed(2)),
    wastedCost: Number.parseFloat(wastedCost.toFixed(2)),
    wastePercentage: Number.parseFloat(wastePercentage.toFixed(1)),
    reason,
  }
}

// Calculate cost analysis
export function calculateCostAnalysis(rooms: EnergyData[]): CostAnalysis {
  let currentCost = 0
  let optimizedCost = 0
  let dailyWaste = 0

  rooms.forEach((room) => {
    const roomCost = room.powerUsage * TNB_RATE
    currentCost += roomCost

    const expectedPower = getExpectedPower(room.roomType, room.occupancyScore, room.capacity)
    optimizedCost += expectedPower * TNB_RATE

    const waste = analyzeEnergyWaste(room)
    if (waste) {
      dailyWaste += waste.wastedCost
    }
  })

  return {
    currentCost: Number.parseFloat(currentCost.toFixed(2)),
    optimizedCost: Number.parseFloat(optimizedCost.toFixed(2)),
    potentialSavings: Number.parseFloat((currentCost - optimizedCost).toFixed(2)),
    dailyWaste: Number.parseFloat(dailyWaste.toFixed(2)),
    monthlyProjection: Number.parseFloat((dailyWaste * 30).toFixed(2)),
  }
}

// Generate temperature optimization suggestions
export interface TemperatureOptimization {
  roomId: string
  roomName: string
  currentTemp: number
  outdoorTemp: number
  recommendedTemp: number
  reasoning: string
  potentialSavings: number
}

export function optimizeTemperature(data: EnergyData): TemperatureOptimization | null {
  const { roomId, roomName, temperature, outdoorTemp, occupancyScore } = data

  let recommendedTemp = 24
  let reasoning = ""
  let potentialSavings = 0

  // If room is empty or low occupancy
  if (occupancyScore < 0.3) {
    recommendedTemp = 26
    reasoning = "Low occupancy - increase AC temperature to save energy"
    potentialSavings = 1.2
  }
  // If outdoor is hot
  else if (outdoorTemp > 32 && occupancyScore > 0.6) {
    recommendedTemp = 25
    reasoning = `Hot outdoor weather (${outdoorTemp}°C) - moderate AC to balance comfort and efficiency`
    potentialSavings = 0.8
  }
  // If outdoor is mild
  else if (outdoorTemp < 28) {
    recommendedTemp = 25
    reasoning = "Mild outdoor temperature - reduce AC cooling"
    potentialSavings = 1.0
  }
  // High occupancy
  else if (occupancyScore > 0.8) {
    recommendedTemp = 23
    reasoning = "High occupancy - maintain cooler temperature for comfort"
    potentialSavings = 0
  }

  // Only return if there's a change and savings
  if (Math.abs(temperature - recommendedTemp) < 1) {
    return null
  }

  return {
    roomId,
    roomName,
    currentTemp: temperature,
    outdoorTemp,
    recommendedTemp,
    reasoning,
    potentialSavings: Number.parseFloat(potentialSavings.toFixed(2)),
  }
}

// Room scheduling optimization
export interface ScheduleOptimization {
  suggestion: string
  impact: string
  estimatedSavings: number
  priority: "high" | "medium" | "low"
}

export function optimizeScheduling(rooms: EnergyData[]): ScheduleOptimization[] {
  const suggestions: ScheduleOptimization[] = []

  // Find underutilized large rooms
  const underutilized = rooms.filter(
    (r) => r.capacity > 30 && r.actualOccupants < r.capacity * 0.3 && r.actualOccupants > 0,
  )

  underutilized.forEach((room) => {
    suggestions.push({
      suggestion: `Move ${room.actualOccupants} students from ${room.roomName} (${room.capacity} seats) to a smaller room`,
      impact: `Reduce AC and lighting load by consolidating students`,
      estimatedSavings: Number.parseFloat((room.powerUsage * 0.4 * TNB_RATE).toFixed(2)),
      priority: "high",
    })
  })

  // Find rooms with low scheduled utilization
  const lowUtilization = rooms.filter((r) => r.scheduledHours < 4)

  if (lowUtilization.length >= 2) {
    suggestions.push({
      suggestion: `Consolidate ${lowUtilization.length} rooms with low utilization (< 4 hours/day)`,
      impact: "Reduce number of active rooms and AC zones",
      estimatedSavings: Number.parseFloat((lowUtilization.length * 15 * TNB_RATE).toFixed(2)),
      priority: "medium",
    })
  }

  // Suggest off-peak scheduling
  suggestions.push({
    suggestion: "Schedule energy-intensive labs during cooler morning hours (8-10 AM)",
    impact: "Reduce AC load during peak heat hours",
    estimatedSavings: 3.5,
    priority: "medium",
  })

  return suggestions
}

// Calculate weekly waste trends from room data
export function calculateWeeklyWasteTrend(rooms: EnergyData[]): {
  day: string
  waste: number
  cost: number
}[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const weeklyData = []

  for (let i = 0; i < days.length; i++) {
    // Calculate total waste for each day based on room data
    // Weekdays (Mon-Fri) have higher activity, weekends lower
    const isWeekend = i >= 5
    const activityMultiplier = isWeekend ? 0.3 : 1.0

    // Add some variation for each day
    const dayVariation = 1 + Math.sin(i * 0.7) * 0.15

    let totalWaste = 0
    let totalCost = 0

    rooms.forEach((room) => {
      const waste = analyzeEnergyWaste(room)
      if (waste) {
        const dailyWaste = waste.wastedKwh * activityMultiplier * dayVariation
        totalWaste += dailyWaste
        totalCost += dailyWaste * TNB_RATE
      }
    })

    weeklyData.push({
      day: days[i],
      waste: Number.parseFloat(totalWaste.toFixed(2)),
      cost: Number.parseFloat(totalCost.toFixed(2)),
    })
  }

  return weeklyData
}
