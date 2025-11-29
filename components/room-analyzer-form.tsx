"use client"

import { useState, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Thermometer, Droplets, Sun, Wind, Activity, BrainCircuit, ShieldAlert } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface Room {
  id: string
  name: string
}

// --- CONFIGURATION ---
const SCALER_MEAN = [21.44120578709908, 25.38920115808988, 195.76859309389798, 721.1552879031536, 0.00403457825736191]
const SCALER_SCALE = [1.0294898306746725, 2.4503972376406296, 251.84274493163858, 294.29231033446035, 0.0006131763062187735]

// --- UTILITIES ---
function scaleInput(input: number[]): number[] {
  return input.map((val, i) => (val - SCALER_MEAN[i]) / SCALER_SCALE[i])
}

// Simple rule-based logic for fallback (Light + CO2 are strong indicators)
function calculateRuleBasedOccupancy(light: number, co2: number): number {
  let score = 0
  
  // Rule 1: Lights are on (typical office > 300 lux)
  if (light > 350) score += 0.6
  else if (light > 100) score += 0.2

  // Rule 2: High CO2 implies breathing humans
  if (co2 > 800) score += 0.5
  else if (co2 > 600) score += 0.3

  // Cap probability at 1.0
  return Math.min(score, 1.0) 
}

export function RoomAnalyzerForm({ rooms }: { rooms: Room[] }) {
  const { toast } = useToast()

  const [model, setModel] = useState<tf.LayersModel | null>(null)
  const [isModelLoading, setIsModelLoading] = useState(true)

  // Form State
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [temperature, setTemperature] = useState<string>("23.7")
  const [humidity, setHumidity] = useState<string>("26.2")
  const [light, setLight] = useState<string>("500")
  const [co2, setCo2] = useState<string>("750")
  const [humidityRatio, setHumidityRatio] = useState<string>("0.0047")

  // Result State
  const [prediction, setPrediction] = useState<number | null>(null)
  const [predictionSource, setPredictionSource] = useState<"AI" | "Rule-Based">("AI")

  // Load model
  useEffect(() => {
    async function loadModel() {
      try {
        const loadedModel = await tf.loadLayersModel('/model/model.json')
        setModel(loadedModel)
        setIsModelLoading(false)
      } catch (error: any) {
        console.error("Failed to load model:", error)
        setIsModelLoading(false)
        // We don't error toast here anymore, we just log it. 
        // The user will see "Fallback Mode" when they click predict.
      }
    }
    loadModel()
  }, [])

  const handlePredict = async () => {
    if (!selectedRoom) {
      toast({ title: "Room Required", description: "Please select a room.", variant: "destructive" })
      return
    }

    const valTemp = parseFloat(temperature) || 0
    const valHum = parseFloat(humidity) || 0
    const valLight = parseFloat(light) || 0
    const valCo2 = parseFloat(co2) || 0
    const valHumRatio = parseFloat(humidityRatio) || 0

    try {
      // 1. Try AI Approach
      if (!model) throw new Error("Model not loaded")

      const rawInputs = [valTemp, valHum, valLight, valCo2, valHumRatio]
      const scaled = scaleInput(rawInputs)
      
      const inputTensor = tf.tensor2d([scaled])
      const resultTensor = model.predict(inputTensor) as tf.Tensor
      const probability = (await resultTensor.data())[0]
      
      inputTensor.dispose()
      resultTensor.dispose()

      setPrediction(probability)
      setPredictionSource("AI")
      
      toast({
        title: "AI Analysis Complete",
        description: `Occupancy probability calculated via Neural Network`,
      })

    } catch (err) {
      // 2. Fallback Rule-Based Approach
      console.warn("AI Model failed or not loaded. Switching to fallback rules.", err)
      
      const ruleProb = calculateRuleBasedOccupancy(valLight, valCo2)
      
      setPrediction(ruleProb)
      setPredictionSource("Rule-Based")
      
      toast({
        title: "Fallback Analysis Used",
        description: "AI model unavailable. Used sensor rules (Light/CO2) instead.",
        variant: "default", 
        className: "border-yellow-500"
      })
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* LEFT CARD - FORM */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BrainCircuit className="h-5 w-5" />
            AI Occupancy Predictor
          </CardTitle>
          <CardDescription>
            {isModelLoading 
              ? "Initializing system..." 
              : model 
                ? "Neural Network Online" 
                : "Neural Network Offline (Running in Fallback Mode)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Room select */}
          <div className="space-y-2">
            <Label>Select Room</Label>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger className="rounded-2xl">
                <SelectValue placeholder="Choose a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Inputs grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Thermometer className="h-4 w-4" /> Temp (°C)
              </Label>
              <Input type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} className="rounded-2xl" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Droplets className="h-4 w-4" /> Humidity (%)
              </Label>
              <Input type="number" value={humidity} onChange={(e) => setHumidity(e.target.value)} className="rounded-2xl" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Sun className="h-4 w-4" /> Light (Lux)
              </Label>
              <Input type="number" value={light} onChange={(e) => setLight(e.target.value)} className="rounded-2xl" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Wind className="h-4 w-4" /> CO2 (ppm)
              </Label>
              <Input type="number" value={co2} onChange={(e) => setCo2(e.target.value)} className="rounded-2xl" />
            </div>

            <div className="space-y-2 col-span-2">
              <Label className="flex items-center gap-1">
                <Activity className="h-4 w-4" /> Humidity Ratio
              </Label>
              <Input type="number" step="0.0001" value={humidityRatio} onChange={(e) => setHumidityRatio(e.target.value)} className="rounded-2xl" />
            </div>
          </div>

          <Button onClick={handlePredict} className="w-full rounded-2xl py-6 text-lg font-medium">
             Calculate Occupancy
          </Button>
        </CardContent>
      </Card>

      {/* RIGHT CARD - RESULT */}
      <div className="space-y-6">
        {prediction !== null ? (
          <Card className={prediction > 0.5 ? "border-red-400 shadow-red-200" : "border-green-400 shadow-green-200"}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle>Analysis Result</CardTitle>
                    {predictionSource === 'AI' ? (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            <BrainCircuit className="h-3 w-3 mr-1" /> AI Model
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                            <ShieldAlert className="h-3 w-3 mr-1" /> Rule Fallback
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <h2 className="text-5xl font-bold mb-4">
                {prediction > 0.5 ? "Occupied" : "Vacant"}
              </h2>
              <p className="text-2xl text-muted-foreground">
                Confidence: {(prediction * 100).toFixed(2)}%
              </p>
              
              {predictionSource === 'Rule-Based' && (
                  <p className="mt-6 text-sm bg-yellow-50 p-3 rounded-md border border-yellow-200 text-yellow-800 max-w-xs">
                    <strong>Note:</strong> The AI model could not be reached. This result is an estimate based on Light and CO2 levels.
                  </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
              Click calculate to see results
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}