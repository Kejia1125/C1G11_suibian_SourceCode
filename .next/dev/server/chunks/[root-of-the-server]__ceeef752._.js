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
"[project]/Downloads/smart-campus-monitor-app-draft (1)/app/api/weather/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/smart-campus-monitor-app-draft (1)/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$lib$2f$weather$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/smart-campus-monitor-app-draft (1)/lib/weather.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        console.log("[v0] Weather API route called");
        const weather = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$lib$2f$weather$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchWeatherData"])();
        console.log("[v0] Returning weather data:", {
            temp: weather.temperature,
            humidity: weather.humidity
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(weather);
    } catch (error) {
        console.error("[v0] Weather API route error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$smart$2d$campus$2d$monitor$2d$app$2d$draft__$28$1$292f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch weather"
        }, {
            status: 500
        });
    }
}
const runtime = "nodejs";
const dynamic = "force-dynamic";
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ceeef752._.js.map