import { Navbar } from "@/components/navbar"
import { RoomAnalyzerForm } from "@/components/room-analyzer-form"

const rooms = [
  { id: "A1", name: "Tutorial Room 1" },
  { id: "A2", name: "Tutorial Room 2" },
  { id: "LIB1", name: "Library Area 1" },
  { id: "LAB1", name: "Computer Lab 1" },
  { id: "MTG1", name: "Meeting Room 1" },
]

export default function AnalyzerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Room Analyzer</h1>
          <p className="text-muted-foreground">Input sensor data to calculate room occupancy and detect anomalies</p>
        </div>
        <RoomAnalyzerForm rooms={rooms} />
      </main>
    </div>
  )
}
