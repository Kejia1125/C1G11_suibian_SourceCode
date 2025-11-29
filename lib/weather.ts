// Weather API integration using Open-Meteo for hourly temperature

export interface HourlyWeatherData {
  time: string[]
  temperature: number[]
  humidity: number[]
}

export interface WeatherData {
  temperature: number
  humidity: number
  description: string
  location: string
  timestamp: Date
  hourly?: HourlyWeatherData
}

export async function fetchWeatherData(latitude = 3.139, longitude = 101.6869): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&hourly=temperature_2m,relative_humidity_2m&forecast_days=1&timezone=Asia/Singapore`

    console.log("[v0] Fetching weather from Open-Meteo API...")
    console.log("[v0] Weather API URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })

    console.log("[v0] Weather API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Weather API error response:", errorText)
      throw new Error(`Weather API failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Weather API success! Temperature:", data.current.temperature_2m)

    return {
      temperature: Math.round(data.current.temperature_2m),
      humidity: data.current.relative_humidity_2m,
      description: getWeatherDescription(data.current.weather_code),
      location: "Kuala Lumpur",
      timestamp: new Date(),
      hourly: {
        time: data.hourly.time,
        temperature: data.hourly.temperature_2m.map((t: number) => Math.round(t)),
        humidity: data.hourly.relative_humidity_2m,
      },
    }
  } catch (error) {
    console.error("[v0] Weather fetch error:", error)
    console.log("[v0] Using dummy weather data as fallback")
    // Return dummy data as fallback with hourly mock data
    return generateDummyWeatherWithHourly()
  }
}

function getWeatherDescription(code: number): string {
  if (code === 0) return "Clear sky"
  if (code <= 3) return "Partly cloudy"
  if (code <= 48) return "Foggy"
  if (code <= 67) return "Rainy"
  if (code <= 77) return "Snowy"
  if (code <= 82) return "Rain showers"
  if (code <= 86) return "Snow showers"
  return "Thunderstorm"
}

function generateDummyWeatherWithHourly(): WeatherData {
  const now = new Date()
  const hourlyTimes: string[] = []
  const hourlyTemps: number[] = []
  const hourlyHumidity: number[] = []

  // Generate 24 hours of data
  for (let i = 0; i < 24; i++) {
    const hour = new Date(now)
    hour.setHours(i, 0, 0, 0)
    hourlyTimes.push(hour.toISOString())

    // Temperature varies throughout the day (cooler at night, warmer during day)
    const baseTemp = 28
    const variation = Math.sin(((i - 6) * Math.PI) / 12) * 5
    hourlyTemps.push(Math.round(baseTemp + variation))

    // Humidity inversely related to temperature
    hourlyHumidity.push(Math.round(75 - variation))
  }

  return {
    temperature: hourlyTemps[now.getHours()],
    humidity: hourlyHumidity[now.getHours()],
    description: "Partly cloudy",
    location: "Kuala Lumpur",
    timestamp: now,
    hourly: {
      time: hourlyTimes,
      temperature: hourlyTemps,
      humidity: hourlyHumidity,
    },
  }
}

export function generateDummyWeather(): WeatherData {
  const temps = [28, 30, 32, 31, 33, 29]
  const descriptions = ["Clear sky", "Partly cloudy", "Sunny", "Hot and humid"]
  const randomTemp = temps[Math.floor(Math.random() * temps.length)]

  return {
    temperature: randomTemp,
    humidity: 70 + Math.floor(Math.random() * 15),
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    location: "Kuala Lumpur",
    timestamp: new Date(),
  }
}
