// AI-powered recommendations using OpenRouter with Mistral-7B
// Falls back to rule-based system if AI fails

import type { EnergyWaste, TemperatureOptimization, ScheduleOptimization } from "./energy"
import type { WeatherData } from "./weather"

export interface AIRecommendation {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  category: "energy" | "temperature" | "scheduling" | "general"
  impact: string
  savings?: number
}

// Rule-based recommendations as fallback
export function generateRuleBasedRecommendations(
  energyWastes: EnergyWaste[],
  tempOptimizations: TemperatureOptimization[],
  scheduleOptimizations: ScheduleOptimization[],
  weather: WeatherData,
): AIRecommendation[] {
  const recommendations: AIRecommendation[] = []

  // Energy waste recommendations
  energyWastes.slice(0, 3).forEach((waste, idx) => {
    recommendations.push({
      id: `energy-${idx}`,
      title: `Reduce Energy Waste in ${waste.roomName}`,
      description: `${waste.reason}. Currently wasting ${waste.wastedKwh} kWh (RM ${waste.wastedCost}/day).`,
      priority: waste.wastePercentage > 30 ? "high" : "medium",
      category: "energy",
      impact: `Save RM ${(waste.wastedCost * 30).toFixed(2)}/month`,
      savings: waste.wastedCost,
    })
  })

  // Temperature recommendations
  tempOptimizations.slice(0, 2).forEach((opt, idx) => {
    recommendations.push({
      id: `temp-${idx}`,
      title: `Optimize AC in ${opt.roomName}`,
      description: `${opt.reasoning}. Adjust from ${opt.currentTemp}°C to ${opt.recommendedTemp}°C.`,
      priority: "medium",
      category: "temperature",
      impact: `Save approximately RM ${opt.potentialSavings}/day`,
      savings: opt.potentialSavings,
    })
  })

  // Schedule recommendations
  scheduleOptimizations.slice(0, 2).forEach((sched, idx) => {
    recommendations.push({
      id: `schedule-${idx}`,
      title: "Optimize Room Allocation",
      description: sched.suggestion,
      priority: sched.priority,
      category: "scheduling",
      impact: sched.impact,
      savings: sched.estimatedSavings,
    })
  })

  // Weather-based recommendation
  if (weather.temperature > 30) {
    recommendations.push({
      id: "weather-1",
      title: "Hot Weather Alert",
      description: `Outdoor temperature is ${weather.temperature}°C. Consider pre-cooling rooms before peak occupancy hours.`,
      priority: "medium",
      category: "temperature",
      impact: "Reduce peak AC load and improve comfort",
    })
  }

  return recommendations.slice(0, 6) // Return top 6
}

// AI-powered recommendations using OpenRouter
export async function generateAIRecommendations(
  energyWastes: EnergyWaste[],
  tempOptimizations: TemperatureOptimization[],
  scheduleOptimizations: ScheduleOptimization[],
  weather: WeatherData,
  totalDailyWaste: number,
): Promise<AIRecommendation[]> {
  const apiKey = process.env.OPENROUTER_API_KEY
  
  if (!apiKey) {
    console.log("[v0] No OpenRouter API key found, using rule-based recommendations")
    return generateRuleBasedRecommendations(energyWastes, tempOptimizations, scheduleOptimizations, weather)
  }

  // 1. IMPROVED PROMPT: Strong negative constraints
  const prompt = `You are an energy management AI. Analyze the data and provide 5-6 actionable recommendations.

Current Situation:
- Daily energy waste: RM ${totalDailyWaste.toFixed(2)}
- Outdoor temperature: ${weather.temperature}°C
- Weather: ${weather.description}

Issues:
${energyWastes.slice(0, 3).map((w) => `- ${w.roomName}: RM ${w.wastedCost}/day - ${w.reason}`).join("\n")}
${tempOptimizations.slice(0, 2).map((t) => `- ${t.roomName}: ${t.reasoning}`).join("\n")}
${scheduleOptimizations.slice(0, 2).map((s) => `- ${s.suggestion}`).join("\n")}

CRITICAL INSTRUCTIONS:
1. Return ONLY a raw JSON array.
2. Start your response IMMEDIATELY with the character '['.
3. Do NOT include markdown formatting (like \`\`\`json).
4. Do NOT include system tags like [B_INST], [/INST], or <s>.
5. Do NOT include any introductory text like "Here are the recommendations".

Required JSON Format:
[
  {
    "title": "Title",
    "description": "Explanation",
    "priority": "high",
    "category": "energy",
    "impact": "Outcome",
    "savings": 0.0
  }
]`

  // 2. RETRY LOGIC: Handle empty responses from free-tier models
  const MAX_RETRIES = 3;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[v0] AI Attempt ${attempt}/${MAX_RETRIES}...`);
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://smartcampus.example.com",
          "X-Title": "SmartCampus Monitor",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json()
      const aiResponse = data.choices[0]?.message?.content

      // Check for empty/useless responses (the "3 token" bug)
      if (!aiResponse || aiResponse.trim().length < 10) {
        console.warn(`[v0] Attempt ${attempt} failed: AI returned empty response.`);
        if (attempt === MAX_RETRIES) throw new Error("Empty response after retries");
        continue;
      }

      console.log("[v0] Raw AI response:", aiResponse)

      // 3. ROBUST PARSING LOGIC
      let cleanedResponse = aiResponse;

      // First, strip known "leakage" tags explicitly
      cleanedResponse = cleanedResponse
          .replace(/\[\/?B_INST\]/g, "") // Removes [B_INST] and [/B_INST]
          .replace(/\[\/?INST\]/g, "")   // Removes [INST] and [/INST]
          .replace(/<s>/g, "")           // Removes <s>
          .replace(/<\/s>/g, "");        // Removes </s>

      // Second, find the JSON array boundaries
      const firstBracket = cleanedResponse.indexOf('[');
      const lastBracket = cleanedResponse.lastIndexOf(']');

      if (firstBracket !== -1 && lastBracket !== -1) {
        cleanedResponse = cleanedResponse.substring(firstBracket, lastBracket + 1);
      } else {
        // Fallback cleanup if brackets aren't clear
        cleanedResponse = cleanedResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
      }

      console.log("[v0] Cleaned AI response for parsing:", cleanedResponse)

      const recommendations = JSON.parse(cleanedResponse)
      
      return recommendations.map((rec: any, idx: number) => ({
        id: `ai-${idx}`,
        title: rec.title,
        description: rec.description,
        priority: rec.priority || "medium",
        category: rec.category || "general",
        impact: rec.impact,
        savings: rec.savings,
      }))

    } catch (error) {
      console.error(`[v0] Error on attempt ${attempt}:`, error);
      
      // If this was the last attempt, fall back to rules
      if (attempt === MAX_RETRIES) {
        console.log("[v0] All AI attempts failed. Falling back to rule-based system.")
        return generateRuleBasedRecommendations(energyWastes, tempOptimizations, scheduleOptimizations, weather)
      }
    }
  }

  return generateRuleBasedRecommendations(energyWastes, tempOptimizations, scheduleOptimizations, weather)
}
