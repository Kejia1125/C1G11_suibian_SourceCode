module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Downloads/smart-campus-monitor-app-draft (1)/lib/ai-recommendations.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// AI-powered recommendations using OpenRouter with Mistral-7B
// Falls back to rule-based system if AI fails
__turbopack_context__.s([
    "generateAIRecommendations",
    ()=>generateAIRecommendations,
    "generateRuleBasedRecommendations",
    ()=>generateRuleBasedRecommendations
]);
function generateRuleBasedRecommendations(energyWastes, tempOptimizations, scheduleOptimizations, weather) {
    const recommendations = [];
    // Energy waste recommendations
    energyWastes.slice(0, 3).forEach((waste, idx)=>{
        recommendations.push({
            id: `energy-${idx}`,
            title: `Reduce Energy Waste in ${waste.roomName}`,
            description: `${waste.reason}. Currently wasting ${waste.wastedKwh} kWh (RM ${waste.wastedCost}/day).`,
            priority: waste.wastePercentage > 30 ? "high" : "medium",
            category: "energy",
            impact: `Save RM ${(waste.wastedCost * 30).toFixed(2)}/month`,
            savings: waste.wastedCost
        });
    });
    // Temperature recommendations
    tempOptimizations.slice(0, 2).forEach((opt, idx)=>{
        recommendations.push({
            id: `temp-${idx}`,
            title: `Optimize AC in ${opt.roomName}`,
            description: `${opt.reasoning}. Adjust from ${opt.currentTemp}°C to ${opt.recommendedTemp}°C.`,
            priority: "medium",
            category: "temperature",
            impact: `Save approximately RM ${opt.potentialSavings}/day`,
            savings: opt.potentialSavings
        });
    });
    // Schedule recommendations
    scheduleOptimizations.slice(0, 2).forEach((sched, idx)=>{
        recommendations.push({
            id: `schedule-${idx}`,
            title: "Optimize Room Allocation",
            description: sched.suggestion,
            priority: sched.priority,
            category: "scheduling",
            impact: sched.impact,
            savings: sched.estimatedSavings
        });
    });
    // Weather-based recommendation
    if (weather.temperature > 30) {
        recommendations.push({
            id: "weather-1",
            title: "Hot Weather Alert",
            description: `Outdoor temperature is ${weather.temperature}°C. Consider pre-cooling rooms before peak occupancy hours.`,
            priority: "medium",
            category: "temperature",
            impact: "Reduce peak AC load and improve comfort"
        });
    }
    return recommendations.slice(0, 6) // Return top 6
    ;
}
async function generateAIRecommendations(energyWastes, tempOptimizations, scheduleOptimizations, weather, totalDailyWaste) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        console.log("[v0] No OpenRouter API key found, using rule-based recommendations");
        return generateRuleBasedRecommendations(energyWastes, tempOptimizations, scheduleOptimizations, weather);
    }
    // 1. IMPROVED PROMPT: Strong negative constraints
    const prompt = `You are an energy management AI. Analyze the data and provide 5-6 actionable recommendations.

Current Situation:
- Daily energy waste: RM ${totalDailyWaste.toFixed(2)}
- Outdoor temperature: ${weather.temperature}°C
- Weather: ${weather.description}

Issues:
${energyWastes.slice(0, 3).map((w)=>`- ${w.roomName}: RM ${w.wastedCost}/day - ${w.reason}`).join("\n")}
${tempOptimizations.slice(0, 2).map((t)=>`- ${t.roomName}: ${t.reasoning}`).join("\n")}
${scheduleOptimizations.slice(0, 2).map((s)=>`- ${s.suggestion}`).join("\n")}

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
]`;
    // 2. RETRY LOGIC: Handle empty responses from free-tier models
    const MAX_RETRIES = 3;
    for(let attempt = 1; attempt <= MAX_RETRIES; attempt++){
        try {
            console.log(`[v0] AI Attempt ${attempt}/${MAX_RETRIES}...`);
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                    "HTTP-Referer": "https://smartcampus.example.com",
                    "X-Title": "SmartCampus Monitor"
                },
                body: JSON.stringify({
                    model: "mistralai/mistral-7b-instruct:free",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });
            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }
            const data = await response.json();
            const aiResponse = data.choices[0]?.message?.content;
            // Check for empty/useless responses (the "3 token" bug)
            if (!aiResponse || aiResponse.trim().length < 10) {
                console.warn(`[v0] Attempt ${attempt} failed: AI returned empty response.`);
                if (attempt === MAX_RETRIES) throw new Error("Empty response after retries");
                continue;
            }
            console.log("[v0] Raw AI response:", aiResponse);
            // 3. ROBUST PARSING LOGIC
            let cleanedResponse = aiResponse;
            // First, strip known "leakage" tags explicitly
            cleanedResponse = cleanedResponse.replace(/\[\/?B_INST\]/g, "") // Removes [B_INST] and [/B_INST]
            .replace(/\[\/?INST\]/g, "") // Removes [INST] and [/INST]
            .replace(/<s>/g, "") // Removes <s>
            .replace(/<\/s>/g, ""); // Removes </s>
            // Second, find the JSON array boundaries
            const firstBracket = cleanedResponse.indexOf('[');
            const lastBracket = cleanedResponse.lastIndexOf(']');
            if (firstBracket !== -1 && lastBracket !== -1) {
                cleanedResponse = cleanedResponse.substring(firstBracket, lastBracket + 1);
            } else {
                // Fallback cleanup if brackets aren't clear
                cleanedResponse = cleanedResponse.replace(/```json/g, "").replace(/```/g, "").trim();
            }
            console.log("[v0] Cleaned AI response for parsing:", cleanedResponse);
            const recommendations = JSON.parse(cleanedResponse);
            return recommendations.map((rec, idx)=>({
                    id: `ai-${idx}`,
                    title: rec.title,
                    description: rec.description,
                    priority: rec.priority || "medium",
                    category: rec.category || "general",
                    impact: rec.impact,
                    savings: rec.savings
                }));
        } catch (error) {
            console.error(`[v0] Error on attempt ${attempt}:`, error);
            // If this was the last attempt, fall back to rules
            if (attempt === MAX_RETRIES) {
                console.log("[v0] All AI attempts failed. Falling back to rule-based system.");
                return generateRuleBasedRecommendations(energyWastes, tempOptimizations, scheduleOptimizations, weather);
            }
        }
    }
    return generateRuleBasedRecommendations(energyWastes, tempOptimizations, scheduleOptimizations, weather);
}
}),
"[project]/Downloads/smart-campus-monitor-app-draft (1)/lib/energy.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Energy waste analysis and cost calculation utilities
__turbopack_context__.s([
    "analyzeEnergyWaste",
    ()=>analyzeEnergyWaste,
    "calculateCostAnalysis",
    ()=>calculateCostAnalysis,
    "calculateWeeklyWasteTrend",
    ()=>calculateWeeklyWasteTrend,
    "optimizeScheduling",
    ()=>optimizeScheduling,
    "optimizeTemperature",
    ()=>optimizeTemperature
]);
// TNB tariff rates (simplified - RM per kWh)
const TNB_RATE = 0.467 // Average commercial rate
;
// Calculate baseline power for room type when empty
function getBaselinePower(roomType) {
    switch(roomType){
        case "classroom":
            return 2 // kWh when empty
            ;
        case "lab":
            return 5 // Higher due to equipment
            ;
        case "library":
            return 3;
        case "meeting":
            return 1.5;
        default:
            return 2;
    }
}
// Calculate expected power based on occupancy
function getExpectedPower(roomType, occupancyScore, capacity) {
    const baseline = getBaselinePower(roomType);
    const maxPower = capacity * 0.15 // Rough estimate: 150W per person
    ;
    return baseline + maxPower * occupancyScore;
}
function analyzeEnergyWaste(data) {
    const expectedPower = getExpectedPower(data.roomType, data.occupancyScore, data.capacity);
    const wastedKwh = Math.max(0, data.powerUsage - expectedPower);
    // Only flag if waste is significant (> 10%)
    if (wastedKwh < expectedPower * 0.1) {
        return null;
    }
    const wastePercentage = wastedKwh / data.powerUsage * 100;
    const wastedCost = wastedKwh * TNB_RATE;
    let reason = "";
    if (data.occupancyScore < 0.3 && data.powerUsage > 15) {
        reason = "High power usage in empty/low occupancy room";
    } else if (data.temperature < 22 && data.occupancyScore < 0.5) {
        reason = "AC overcooling with low occupancy";
    } else if (data.actualOccupants < data.capacity * 0.3 && data.powerUsage > expectedPower * 1.5) {
        reason = "Underutilized room with excessive power consumption";
    } else {
        reason = "Power usage exceeds expected baseline";
    }
    return {
        roomId: data.roomId,
        roomName: data.roomName,
        wastedKwh: Number.parseFloat(wastedKwh.toFixed(2)),
        wastedCost: Number.parseFloat(wastedCost.toFixed(2)),
        wastePercentage: Number.parseFloat(wastePercentage.toFixed(1)),
        reason
    };
}
function calculateCostAnalysis(rooms) {
    let currentCost = 0;
    let optimizedCost = 0;
    let dailyWaste = 0;
    rooms.forEach((room)=>{
        const roomCost = room.powerUsage * TNB_RATE;
        currentCost += roomCost;
        const expectedPower = getExpectedPower(room.roomType, room.occupancyScore, room.capacity);
        optimizedCost += expectedPower * TNB_RATE;
        const waste = analyzeEnergyWaste(room);
        if (waste) {
            dailyWaste += waste.wastedCost;
        }
    });
    return {
        currentCost: Number.parseFloat(currentCost.toFixed(2)),
        optimizedCost: Number.parseFloat(optimizedCost.toFixed(2)),
        potentialSavings: Number.parseFloat((currentCost - optimizedCost).toFixed(2)),
        dailyWaste: Number.parseFloat(dailyWaste.toFixed(2)),
        monthlyProjection: Number.parseFloat((dailyWaste * 30).toFixed(2))
    };
}
function optimizeTemperature(data) {
    const { roomId, roomName, temperature, outdoorTemp, occupancyScore } = data;
    let recommendedTemp = 24;
    let reasoning = "";
    let potentialSavings = 0;
    // If room is empty or low occupancy
    if (occupancyScore < 0.3) {
        recommendedTemp = 26;
        reasoning = "Low occupancy - increase AC temperature to save energy";
        potentialSavings = 1.2;
    } else if (outdoorTemp > 32 && occupancyScore > 0.6) {
        recommendedTemp = 25;
        reasoning = `Hot outdoor weather (${outdoorTemp}°C) - moderate AC to balance comfort and efficiency`;
        potentialSavings = 0.8;
    } else if (outdoorTemp < 28) {
        recommendedTemp = 25;
        reasoning = "Mild outdoor temperature - reduce AC cooling";
        potentialSavings = 1.0;
    } else if (occupancyScore > 0.8) {
        recommendedTemp = 23;
        reasoning = "High occupancy - maintain cooler temperature for comfort";
        potentialSavings = 0;
    }
    // Only return if there's a change and savings
    if (Math.abs(temperature - recommendedTemp) < 1) {
        return null;
    }
    return {
        roomId,
        roomName,
        currentTemp: temperature,
        outdoorTemp,
        recommendedTemp,
        reasoning,
        potentialSavings: Number.parseFloat(potentialSavings.toFixed(2))
    };
}
function optimizeScheduling(rooms) {
    const suggestions = [];
    // Find underutilized large rooms
    const underutilized = rooms.filter((r)=>r.capacity > 30 && r.actualOccupants < r.capacity * 0.3 && r.actualOccupants > 0);
    underutilized.forEach((room)=>{
        suggestions.push({
            suggestion: `Move ${room.actualOccupants} students from ${room.roomName} (${room.capacity} seats) to a smaller room`,
            impact: `Reduce AC and lighting load by consolidating students`,
            estimatedSavings: Number.parseFloat((room.powerUsage * 0.4 * TNB_RATE).toFixed(2)),
            priority: "high"
        });
    });
    // Find rooms with low scheduled utilization
    const lowUtilization = rooms.filter((r)=>r.scheduledHours < 4);
    if (lowUtilization.length >= 2) {
        suggestions.push({
            suggestion: `Consolidate ${lowUtilization.length} rooms with low utilization (< 4 hours/day)`,
            impact: "Reduce number of active rooms and AC zones",
            estimatedSavings: Number.parseFloat((lowUtilization.length * 15 * TNB_RATE).toFixed(2)),
            priority: "medium"
        });
    }
    // Suggest off-peak scheduling
    suggestions.push({
        suggestion: "Schedule energy-intensive labs during cooler morning hours (8-10 AM)",
        impact: "Reduce AC load during peak heat hours",
        estimatedSavings: 3.5,
        priority: "medium"
    });
    return suggestions;
}
function calculateWeeklyWasteTrend(rooms) {
    const days = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];
    const weeklyData = [];
    for(let i = 0; i < days.length; i++){
        // Calculate total waste for each day based on room data
        // Weekdays (Mon-Fri) have higher activity, weekends lower
        const isWeekend = i >= 5;
        const activityMultiplier = isWeekend ? 0.3 : 1.0;
        // Add some variation for each day
        const dayVariation = 1 + Math.sin(i * 0.7) * 0.15;
        let totalWaste = 0;
        let totalCost = 0;
        rooms.forEach((room)=>{
            const waste = analyzeEnergyWaste(room);
            if (waste) {
                const dailyWaste = waste.wastedKwh * activityMultiplier * dayVariation;
                totalWaste += dailyWaste;
                totalCost += dailyWaste * TNB_RATE;
            }
        });
        weeklyData.push({
            day: days[i],
            waste: Number.parseFloat(totalWaste.toFixed(2)),
            cost: Number.parseFloat(totalCost.toFixed(2))
        });
    }
    return weeklyData;
}
}),
"[project]/Downloads/smart-campus-monitor-app-draft (1)/lib/mock-data.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Generate comprehensive dummy datasets for the SmartCampus Monitor
__turbopack_context__.s([
    "generateEnergyData",
    ()=>generateEnergyData,
    "generateHistoricalData",
    ()=>generateHistoricalData,
    "generateWeeklyWaste",
    ()=>generateWeeklyWaste
]);
function generateEnergyData() {
    const rooms = [
        {
            roomId: "A1",
            roomName: "Tutorial Room 1",
            powerUsage: 35,
            occupancyScore: 0.75,
            temperature: 24,
            outdoorTemp: 32,
            capacity: 40,
            actualOccupants: 30,
            scheduledHours: 6,
            roomType: "classroom"
        },
        {
            roomId: "A2",
            roomName: "Tutorial Room 2",
            powerUsage: 45,
            occupancyScore: 0.15,
            temperature: 22,
            outdoorTemp: 32,
            capacity: 40,
            actualOccupants: 5,
            scheduledHours: 3,
            roomType: "classroom"
        },
        {
            roomId: "LIB1",
            roomName: "Library Area 1",
            powerUsage: 28,
            occupancyScore: 0.45,
            temperature: 23,
            outdoorTemp: 32,
            capacity: 60,
            actualOccupants: 25,
            scheduledHours: 10,
            roomType: "library"
        },
        {
            roomId: "LAB1",
            roomName: "Computer Lab 1",
            powerUsage: 65,
            occupancyScore: 0.85,
            temperature: 23,
            outdoorTemp: 32,
            capacity: 40,
            actualOccupants: 34,
            scheduledHours: 8,
            roomType: "lab"
        },
        {
            roomId: "MTG1",
            roomName: "Meeting Room 1",
            powerUsage: 50,
            occupancyScore: 0.08,
            temperature: 21,
            outdoorTemp: 32,
            capacity: 20,
            actualOccupants: 2,
            scheduledHours: 2,
            roomType: "meeting"
        },
        {
            roomId: "A3",
            roomName: "Lecture Hall A",
            powerUsage: 55,
            occupancyScore: 0.25,
            temperature: 23,
            outdoorTemp: 32,
            capacity: 100,
            actualOccupants: 25,
            scheduledHours: 4,
            roomType: "classroom"
        }
    ];
    return rooms;
}
function generateHistoricalData() {
    const hours = [
        "8AM",
        "10AM",
        "12PM",
        "2PM",
        "4PM",
        "6PM"
    ];
    const data = [];
    hours.forEach((hour, idx)=>{
        data.push({
            hour,
            power: 150 + idx * 30 - (idx > 4 ? 50 : 0),
            occupancy: 40 + idx * 15 - (idx > 4 ? 40 : 0),
            temperature: 28 + idx * 0.8 - (idx > 4 ? 2 : 0)
        });
    });
    return data;
}
function generateWeeklyWaste() {
    console.warn("[v0] generateWeeklyWaste is deprecated, use calculateWeeklyWasteTrend from energy.ts");
    return [];
}
}),
"[project]/Downloads/smart-campus-monitor-app-draft (1)/lib/weather.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Weather API integration using Open-Meteo for hourly temperature
__turbopack_context__.s([
    "fetchWeatherData",
    ()=>fetchWeatherData,
    "generateDummyWeather",
    ()=>generateDummyWeather
]);
async function fetchWeatherData(latitude = 3.139, longitude = 101.6869) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&hourly=temperature_2m,relative_humidity_2m&forecast_days=1&timezone=Asia/Singapore`;
        console.log("[v0] Fetching weather from Open-Meteo API...");
        console.log("[v0] Weather API URL:", url);
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json"
            },
            cache: "no-store"
        });
        console.log("[v0] Weather API response status:", response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.error("[v0] Weather API error response:", errorText);
            throw new Error(`Weather API failed with status ${response.status}`);
        }
        const data = await response.json();
        console.log("[v0] Weather API success! Temperature:", data.current.temperature_2m);
        return {
            temperature: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            description: getWeatherDescription(data.current.weather_code),
            location: "Kuala Lumpur",
            timestamp: new Date(),
            hourly: {
                time: data.hourly.time,
                temperature: data.hourly.temperature_2m.map((t)=>Math.round(t)),
                humidity: data.hourly.relative_humidity_2m
            }
        };
    } catch (error) {
        console.error("[v0] Weather fetch error:", error);
        console.log("[v0] Using dummy weather data as fallback");
        // Return dummy data as fallback with hourly mock data
        return generateDummyWeatherWithHourly();
    }
}
function getWeatherDescription(code) {
    if (code === 0) return "Clear sky";
    if (code <= 3) return "Partly cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snowy";
    if (code <= 82) return "Rain showers";
    if (code <= 86) return "Snow showers";
    return "Thunderstorm";
}
function generateDummyWeatherWithHourly() {
    const now = new Date();
    const hourlyTimes = [];
    const hourlyTemps = [];
    const hourlyHumidity = [];
    // Generate 24 hours of data
    for(let i = 0; i < 24; i++){
        const hour = new Date(now);
        hour.setHours(i, 0, 0, 0);
        hourlyTimes.push(hour.toISOString());
        // Temperature varies throughout the day (cooler at night, warmer during day)
        const baseTemp = 28;
        const variation = Math.sin((i - 6) * Math.PI / 12) * 5;
        hourlyTemps.push(Math.round(baseTemp + variation));
        // Humidity inversely related to temperature
        hourlyHumidity.push(Math.round(75 - variation));
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
            humidity: hourlyHumidity
        }
    };
}
function generateDummyWeather() {
    const temps = [
        28,
        30,
        32,
        31,
        33,
        29
    ];
    const descriptions = [
        "Clear sky",
        "Partly cloudy",
        "Sunny",
        "Hot and humid"
    ];
    const randomTemp = temps[Math.floor(Math.random() * temps.length)];
    return {
        temperature: randomTemp,
        humidity: 70 + Math.floor(Math.random() * 15),
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        location: "Kuala Lumpur",
        timestamp: new Date()
    };
}
}),
"[project]/Downloads/smart-campus-monitor-app-draft (1)/app/api/ai-recommendations/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/smart-campus-monitor-app-draft (1)/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$lib$2f$ai$2d$recommendations$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/smart-campus-monitor-app-draft (1)/lib/ai-recommendations.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$lib$2f$energy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/smart-campus-monitor-app-draft (1)/lib/energy.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/smart-campus-monitor-app-draft (1)/lib/mock-data.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$lib$2f$weather$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/smart-campus-monitor-app-draft (1)/lib/weather.ts [app-route] (ecmascript)");
;
;
;
;
;
async function GET() {
    try {
        // Get mock energy data
        const energyData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateEnergyData"])();
        // Analyze energy waste
        const energyWastes = energyData.map((room)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$lib$2f$energy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeEnergyWaste"])(room)).filter((waste)=>waste !== null).sort((a, b)=>b.wastedCost - a.wastedCost);
        // Temperature optimizations
        const tempOptimizations = energyData.map((room)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$lib$2f$energy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["optimizeTemperature"])(room)).filter((opt)=>opt !== null);
        // Schedule optimizations
        const scheduleOptimizations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$lib$2f$energy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["optimizeScheduling"])(energyData);
        // Get weather data
        const weather = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$lib$2f$weather$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateDummyWeather"])();
        // Calculate total waste
        const costAnalysis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$lib$2f$energy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateCostAnalysis"])(energyData);
        // Generate AI recommendations
        const recommendations = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$lib$2f$ai$2d$recommendations$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateAIRecommendations"])(energyWastes, tempOptimizations, scheduleOptimizations, weather, costAnalysis.dailyWaste);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            recommendations,
            energyWastes,
            tempOptimizations,
            scheduleOptimizations,
            costAnalysis,
            weather
        });
    } catch (error) {
        console.error("[v0] AI recommendations error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to generate recommendations"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__19a1613e._.js.map