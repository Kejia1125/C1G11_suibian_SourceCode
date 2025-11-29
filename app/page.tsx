import { Navbar } from "@/components/navbar"
import { RoomCard } from "@/components/room-card"
import { OccupancyChart } from "@/components/occupancy-chart"
import { AlertsList } from "@/components/alerts-list"
import { StatsCards } from "@/components/stats-cards"
import { generateMockRoomData, generateMockAlerts } from "@/lib/occupancy"
import { AISummaryCards } from "@/components/ai-summary-cards"
import { AIRecommendationsList } from "@/components/ai-recommendations-list"
import { EnergyWasteChart } from "@/components/energy-waste-chart"
import { TemperatureWeatherCard } from "@/components/temperature-weather-card"
import { CostAnalysisCard } from "@/components/cost-analysis-card"
import { TabsNavigation } from "@/components/tabs-navigation"

export default function DashboardPage() {
  const rooms = generateMockRoomData()
  const alerts = generateMockAlerts()

  const overviewContent = (
    <div className="space-y-6">
      <AISummaryCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <AIRecommendationsList />
        <div className="space-y-6">
          <TemperatureWeatherCard />
          <AlertsList alerts={alerts} />
        </div>
      </div>
    </div>
  )

  const energyContent = (
    <div className="space-y-6">
      <CostAnalysisCard />
      <EnergyWasteChart />
    </div>
  )

  const analyticsContent = (
    <div className="space-y-6">
      <StatsCards rooms={rooms} alerts={alerts} />
      <OccupancyChart rooms={rooms} />
    </div>
  )

  const roomsContent = (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SmartCampus Monitor</h1>
          <p className="text-muted-foreground mt-1">AI-powered energy optimization for your campus</p>
        </div>

        <TabsNavigation
          overviewContent={overviewContent}
          energyContent={energyContent}
          analyticsContent={analyticsContent}
          roomsContent={roomsContent}
        />
      </main>
    </div>
  )
}
