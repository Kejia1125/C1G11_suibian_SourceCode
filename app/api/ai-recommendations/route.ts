import { NextResponse } from "next/server"
import { generateAIRecommendations } from "@/lib/ai-recommendations"
import { analyzeEnergyWaste, optimizeTemperature, optimizeScheduling, calculateCostAnalysis } from "@/lib/energy"
import { generateEnergyData } from "@/lib/mock-data"
import { generateDummyWeather } from "@/lib/weather"

export async function GET() {
  try {
    // Get mock energy data
    const energyData = generateEnergyData()

    // Analyze energy waste
    const energyWastes = energyData
      .map((room) => analyzeEnergyWaste(room))
      .filter((waste): waste is NonNullable<typeof waste> => waste !== null)
      .sort((a, b) => b.wastedCost - a.wastedCost)

    // Temperature optimizations
    const tempOptimizations = energyData
      .map((room) => optimizeTemperature(room))
      .filter((opt): opt is NonNullable<typeof opt> => opt !== null)

    // Schedule optimizations
    const scheduleOptimizations = optimizeScheduling(energyData)

    // Get weather data
    const weather = generateDummyWeather()

    // Calculate total waste
    const costAnalysis = calculateCostAnalysis(energyData)

    // Generate AI recommendations
    const recommendations = await generateAIRecommendations(
      energyWastes,
      tempOptimizations,
      scheduleOptimizations,
      weather,
      costAnalysis.dailyWaste,
    )

    return NextResponse.json({
      recommendations,
      energyWastes,
      tempOptimizations,
      scheduleOptimizations,
      costAnalysis,
      weather,
    })
  } catch (error) {
    console.error("[v0] AI recommendations error:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
