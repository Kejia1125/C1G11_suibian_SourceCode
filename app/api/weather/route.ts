import { NextResponse } from "next/server"
import { fetchWeatherData } from "@/lib/weather"

export async function GET() {
  try {
    console.log("[v0] Weather API route called")
    const weather = await fetchWeatherData()
    console.log("[v0] Returning weather data:", { temp: weather.temperature, humidity: weather.humidity })
    return NextResponse.json(weather)
  } catch (error) {
    console.error("[v0] Weather API route error:", error)
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 })
  }
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
