// AI Logic for occupancy calculation and anomaly detection

export interface SensorData {
  wifiDevices: number
  motionActivity: string
  roomSchedule: string
  temperature: number
  electricityUsage: number
}

export interface OccupancyResult {
  score: number
  label: "Empty" | "Low" | "Occupied"
  wifiProbability: number
  motionProbability: number
  scheduleProbability: number
}

export interface Anomaly {
  id: string
  type: "warning" | "critical"
  title: string
  description: string
}

// Calculate WiFi probability based on connected devices
function getWifiProbability(devices: number): number {
  if (devices === 0) return 0
  if (devices <= 5) return 0.3
  if (devices <= 20) return 0.6
  return 0.9
}

// Calculate motion probability based on last activity
function getMotionProbability(activity: string): number {
  switch (activity) {
    case "just-now":
      return 1.0
    case "5-mins":
      return 0.7
    case "30-mins":
      return 0.4
    case "1-hour":
      return 0.1
    case "2-hours":
      return 0.05
    case "no-motion":
      return 0
    default:
      return 0
  }
}

// Calculate schedule probability
function getScheduleProbability(schedule: string): number {
  switch (schedule) {
    case "class-now":
      return 1.0
    case "no-class":
      return 0.3
    case "class-empty":
      return 0.1
    case "after-hours":
      return 0.2
    default:
      return 0.3
  }
}

// Get occupancy label from score
function getOccupancyLabel(score: number): "Empty" | "Low" | "Occupied" {
  if (score < 0.3) return "Empty"
  if (score < 0.6) return "Low"
  return "Occupied"
}

// Main occupancy calculation function
export function calculateOccupancy(data: SensorData): OccupancyResult {
  const wifiProbability = getWifiProbability(data.wifiDevices)
  const motionProbability = getMotionProbability(data.motionActivity)
  const scheduleProbability = getScheduleProbability(data.roomSchedule)

  // Occupancy formula: 0.5 * wifi + 0.3 * motion + 0.2 * schedule
  const score = 0.5 * wifiProbability + 0.3 * motionProbability + 0.2 * scheduleProbability

  return {
    score,
    label: getOccupancyLabel(score),
    wifiProbability,
    motionProbability,
    scheduleProbability,
  }
}

// Anomaly detection rules
export function detectAnomalies(data: SensorData, occupancyResult: OccupancyResult): Anomaly[] {
  const anomalies: Anomaly[] = []
  const isLowOccupancy = occupancyResult.score < 0.3
  const isEmpty = occupancyResult.label === "Empty"

  // High electricity but low occupancy
  if (data.electricityUsage > 20 && isLowOccupancy) {
    anomalies.push({
      id: "high-electricity-low-occupancy",
      type: "warning",
      title: "High Electricity Usage",
      description: `Electricity usage (${data.electricityUsage} kWh) detected with low occupancy.`,
    })
  }

  // Motion detected but 0 WiFi devices
  if (data.motionActivity === "just-now" && data.wifiDevices === 0) {
    anomalies.push({
      id: "motion-no-wifi",
      type: "warning",
      title: "Motion Without Devices",
      description:
        "Motion detected but no WiFi devices connected. Possible sensor malfunction or visitor without device.",
    })
  }

  // Room supposed to have class but score < 0.2
  if (data.roomSchedule === "class-empty" && occupancyResult.score < 0.2) {
    anomalies.push({
      id: "scheduled-class-empty",
      type: "critical",
      title: "Scheduled Class Empty",
      description: "A class is scheduled but the room appears to be empty.",
    })
  }

  // Temperature > 28°C + no occupancy → AC misuse
  if (data.temperature > 28 && isEmpty) {
    anomalies.push({
      id: "high-temp-empty",
      type: "warning",
      title: "High Temperature",
      description: `Room temperature (${data.temperature}°C) is high with no occupants. Consider checking AC settings.`,
    })
  }

  // Power usage > 40 when room is empty
  if (data.electricityUsage > 40 && isEmpty) {
    anomalies.push({
      id: "high-power-empty",
      type: "critical",
      title: "Excessive Power Usage",
      description: `High power consumption (${data.electricityUsage} kWh) in an empty room. Potential energy waste.`,
    })
  }

  return anomalies
}

// Mock data for dashboard
export interface RoomData {
  id: string
  name: string
  occupancyScore: number
  status: "Empty" | "Low" | "Occupied"
  hasAnomaly: boolean
  anomalyCount: number
  temperature: number
  electricityUsage: number
  wifiDevices: number
}

export function generateMockRoomData(): RoomData[] {
  return [
    {
      id: "A1",
      name: "Tutorial Room 1",
      occupancyScore: 0.75,
      status: "Occupied",
      hasAnomaly: false,
      anomalyCount: 0,
      temperature: 24,
      electricityUsage: 35,
      wifiDevices: 18,
    },
    {
      id: "A2",
      name: "Tutorial Room 2",
      occupancyScore: 0.15,
      status: "Empty",
      hasAnomaly: true,
      anomalyCount: 1,
      temperature: 30,
      electricityUsage: 45,
      wifiDevices: 0,
    },
    {
      id: "LIB1",
      name: "Library Area 1",
      occupancyScore: 0.45,
      status: "Low",
      hasAnomaly: false,
      anomalyCount: 0,
      temperature: 22,
      electricityUsage: 28,
      wifiDevices: 12,
    },
    {
      id: "LAB1",
      name: "Computer Lab 1",
      occupancyScore: 0.85,
      status: "Occupied",
      hasAnomaly: false,
      anomalyCount: 0,
      temperature: 23,
      electricityUsage: 55,
      wifiDevices: 25,
    },
    {
      id: "MTG1",
      name: "Meeting Room 1",
      occupancyScore: 0.08,
      status: "Empty",
      hasAnomaly: true,
      anomalyCount: 2,
      temperature: 26,
      electricityUsage: 50,
      wifiDevices: 2,
    },
  ]
}

export interface AlertData {
  id: string
  roomId: string
  roomName: string
  type: "warning" | "critical"
  title: string
  description: string
  timestamp: string
}

export function generateMockAlerts(): AlertData[] {
  return [
    {
      id: "1",
      roomId: "A2",
      roomName: "Tutorial Room 2",
      type: "critical",
      title: "Excessive Power Usage",
      description: "High power consumption (45 kWh) in an empty room.",
      timestamp: "10 mins ago",
    },
    {
      id: "2",
      roomId: "MTG1",
      roomName: "Meeting Room 1",
      type: "critical",
      title: "Excessive Power Usage",
      description: "High power consumption (50 kWh) in an empty room.",
      timestamp: "25 mins ago",
    },
    {
      id: "3",
      roomId: "MTG1",
      roomName: "Meeting Room 1",
      type: "warning",
      title: "High Electricity Usage",
      description: "Electricity usage detected with low occupancy.",
      timestamp: "25 mins ago",
    },
  ]
}
