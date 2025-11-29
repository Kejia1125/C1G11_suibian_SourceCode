import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Leaf, Brain, Bell, BarChart3, Shield } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: Building2,
      title: "Room Monitoring",
      description: "Real-time occupancy tracking across all campus rooms with detailed sensor data visualization.",
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Intelligent occupancy scoring using WiFi, motion, and schedule data with weighted probability calculations.",
    },
    {
      icon: Shield,
      title: "Anomaly Detection",
      description:
        "Rule-based detection system identifies energy waste, sensor malfunctions, and scheduling conflicts.",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Instant notifications for detected anomalies with severity-based prioritization.",
    },
    {
      icon: BarChart3,
      title: "Data Visualization",
      description: "Interactive charts and dashboards for quick insights into campus space utilization.",
    },
    {
      icon: Leaf,
      title: "Sustainability Focus",
      description: "Designed to reduce energy waste and promote efficient use of campus resources.",
    },
  ]

  const teamMembers = [
    { name: "Eng Ke Jia" },
    { name: "Lim Qian Hui" },
    { name: "Thong Shu Heng" },
    { name: "Hor Yee Min" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="outline" className="mb-2">
            Sustainable Campus Initiative
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">About EnerSense AI</h1>
          <p className="text-muted-foreground text-lg">
            An intelligent monitoring system designed to optimize campus space utilization, reduce energy consumption,
            and promote sustainable practices through real-time occupancy detection and anomaly alerts.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-2">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-8">
            <div className="text-center max-w-xl mx-auto space-y-4">
              <h2 className="text-xl font-semibold">How It Works</h2>
              <div className="grid gap-4 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">1. Data Collection:</strong> Sensors collect WiFi device counts,
                  motion activity, temperature, and electricity usage from each room.
                </p>
                <p>
                  <strong className="text-foreground">2. Occupancy Calculation:</strong> Our AI combines sensor data
                  using weighted probabilities (50% WiFi + 30% Motion + 20% Schedule) to estimate room occupancy.
                </p>
                <p>
                  <strong className="text-foreground">3. Anomaly Detection:</strong> Rule-based analysis identifies
                  issues like high energy use in empty rooms, AC misuse, or scheduling conflicts.
                </p>
                <p>
                  <strong className="text-foreground">4. Alerts & Action:</strong> Facility managers receive real-time
                  notifications to take corrective action and reduce waste.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Our Team</CardTitle>
            <p className="text-muted-foreground">Meet the talented individuals behind EnerSense AI</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="flex flex-col items-center p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <span className="text-2xl font-semibold text-primary">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-center">{member.name}</h3>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}