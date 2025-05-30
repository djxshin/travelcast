"use client"

import React from "react"

interface WeatherDisplayProps {
  weatherData: any
  unit: "fahrenheit" | "celsius"
  setUnit: React.Dispatch<React.SetStateAction<"fahrenheit" | "celsius">>
  startDate: string
  endDate: string
  luggageSize: string
}

const packingRules: Record<string, any> = {
  "small": {
    maxTops: 2,
    maxBottoms: 1,
    maxJackets: 1,
    maxShoes: 1,
  },
  "small-carryon": {
    maxTops: 4,
    maxBottoms: 2,
    maxJackets: 1,
    maxShoes: 2,
  },
  "small-carryon-checked": {
    maxTops: 7,
    maxBottoms: 3,
    maxJackets: 2,
    maxShoes: 3,
  },
}

function getWeatherIcon(cond: string) {
  if (cond.includes("rain")) return "🌧️"
  if (cond.includes("cloud")) return "☁️"
  if (cond.includes("snow")) return "❄️"
  if (cond.includes("clear") || cond.includes("sun")) return "☀️"
  if (cond.includes("fog")) return "🌫️"
  if (cond.includes("storm")) return "⛈️"
  return "🌈"
}

function getAccessories({ condition, wind, temp }: { condition: string; wind: number; temp: number }) {
  const acc: string[] = []
  if (condition.includes("sun") || condition.includes("clear")) acc.push("Sunglasses", "Cap")
  if (condition.includes("rain")) acc.push("Umbrella")
  if (condition.includes("cloud")) acc.push("Cap")
  if (wind > 10) acc.push("Windbreaker")
  if (temp < 40) acc.push("Beanie")
  return [...new Set(acc)]
}

function buildOutfit({ temp, condition, wind }: { temp: number; condition: string; wind: number }) {
  let top = ""
  if (condition.includes("rain")) top = "Raincoat or warm jacket, Tee"
  else if (temp < 55) top = "Warm jacket or hoodie, Tee"
  else if (temp < 68) top = "Light jacket or long sleeve, Tee"
  else top = "Tee or short sleeve"

  let bottom = temp > 78 ? "Shorts" : "Jeans or pants"
  let shoes = condition.includes("rain")
    ? "Waterproof boots or sneakers"
    : "Sneakers or boots"

  const accessories = getAccessories({ condition, wind, temp })
  return { top, bottom, shoes, accessories }
}

function summarizeDay(dayCond: string, nightCond: string) {
  if (dayCond.includes("rain") && nightCond.includes("rain")) return "Mostly Rainy"
  if (dayCond.includes("cloud") && nightCond.includes("cloud")) return "Cloudy"
  if (dayCond.includes("clear") && nightCond.includes("clear")) return "Clear"
  if (dayCond.includes("rain")) return "Rain in Day"
  if (nightCond.includes("rain")) return "Rain at Night"
  return "Mixed"
}

export default function WeatherDisplay({
  weatherData,
  unit,
  setUnit,
  startDate,
  endDate,
  luggageSize,
}: WeatherDisplayProps) {
  if (!Array.isArray(weatherData) || weatherData.length === 0) return null

  const isFahrenheit = unit === "fahrenheit"

  // Group by date
  const dailySlots: Record<string, any[]> = {}
  weatherData.forEach((slot: any) => {
    const date = slot.dt_txt.split(" ")[0]
    if (!dailySlots[date]) dailySlots[date] = []
    dailySlots[date].push(slot)
  })

  const days = Object.keys(dailySlots)
    .filter((date) => date >= startDate && date <= endDate)
    .sort()

  // Helper: Closest forecast per day
  function getClosestForecast(slots: any[], hour: number) {
    return slots.reduce((prev, curr) => {
      const currHour = new Date(curr.dt_txt).getHours()
      const prevHour = new Date(prev.dt_txt).getHours()
      return Math.abs(currHour - hour) < Math.abs(prevHour - hour) ? curr : prev
    })
  }

  // ----------- DYNAMIC ESSENTIAL PACKING LIST LOGIC --------------
  const rules = packingRules[luggageSize] || packingRules["small"]

  // Section 1: Wear on the flight/travel
  const wearEssentials = [
    "1 top",
    "1 bottom",
    "1 jacket",
    "1 pair of shoes",
  ]

  // Section 2: Packing list (the rest, only if max > 1)
  const packEssentials = [
    rules.maxTops > 1 ? `Pack ${rules.maxTops - 1} top${rules.maxTops - 1 > 1 ? "s" : ""}` : null,
    rules.maxBottoms > 1 ? `Pack ${rules.maxBottoms - 1} bottom${rules.maxBottoms - 1 > 1 ? "s" : ""}` : null,
    rules.maxJackets > 1 ? `Pack ${rules.maxJackets - 1} jacket${rules.maxJackets - 1 > 1 ? "s" : ""}` : null,
    rules.maxShoes > 1 ? `Pack ${rules.maxShoes - 1} pair${rules.maxShoes - 1 > 1 ? "s" : ""} of shoes` : null,
    `${days.length} socks (1 per day)`,
    `${days.length} underwear (1 per day)`,
  ].filter(Boolean)

  // ------------------- RENDER -------------------
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Forecast & Outfits */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Forecast</h3>
          <div className="flex gap-2">
            <button
              className={`rounded px-2 py-1 text-sm font-medium ${
                isFahrenheit ? "bg-black text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setUnit("fahrenheit")}
            >
              °F
            </button>
            <button
              className={`rounded px-2 py-1 text-sm font-medium ${
                !isFahrenheit ? "bg-black text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setUnit("celsius")}
            >
              °C
            </button>
          </div>
        </div>
        <div className="space-y-5">
          {days.map((date) => {
            const slots = dailySlots[date]
            const daySlot = getClosestForecast(slots, 14)
            const nightSlot = getClosestForecast(slots, 20)
            const dayTemp = isFahrenheit
              ? Math.round(daySlot.main.temp)
              : Math.round(((daySlot.main.temp - 32) * 5) / 9)
            const nightTemp = isFahrenheit
              ? Math.round(nightSlot.main.temp)
              : Math.round(((nightSlot.main.temp - 32) * 5) / 9)
            const dayCond = daySlot.weather[0]?.main.toLowerCase() || "n/a"
            const nightCond = nightSlot.weather[0]?.main.toLowerCase() || "n/a"
            const wind = Math.max(daySlot.wind?.speed || 0, nightSlot.wind?.speed || 0)

            // For summary line/icon:
            const summary = summarizeDay(dayCond, nightCond)
            const icon = getWeatherIcon(dayCond + nightCond)

            // Get outfit details as object
            const outfit = buildOutfit({
              temp: Math.min(dayTemp, nightTemp),
              condition: `${dayCond} ${nightCond}`,
              wind,
            })

            return (
              <div key={date} className="pb-2 border-b last:border-b-0">
                <div className="text-sm font-semibold text-gray-700 mb-1">
                  <span className="mr-1">{icon}</span>
                  {date} <span className="ml-2 text-xs text-gray-500">{summary}</span>
                </div>
                <div className="flex gap-3 items-center text-sm mb-1">
                  <div>
                    <span className="text-xs text-gray-500">Day (2pm): </span>
                    <span className="text-gray-700 capitalize">
                      {daySlot.weather[0]?.main} {dayTemp}°{isFahrenheit ? "F" : "C"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Night (8pm): </span>
                    <span className="text-gray-700 capitalize">
                      {nightSlot.weather[0]?.main} {nightTemp}°{isFahrenheit ? "F" : "C"}
                    </span>
                  </div>
                </div>
                <div className="mt-1 pl-1 text-sm leading-tight">
                  <div>
                    <span className="font-semibold">Top:</span> {outfit.top}
                  </div>
                  <div>
                    <span className="font-semibold">Bottom:</span> {outfit.bottom}
                  </div>
                  <div>
                    <span className="font-semibold">Shoes:</span> {outfit.shoes}
                  </div>
                  {outfit.accessories.length > 0 && (
                    <div>
                      <span className="font-semibold">Accessories:</span> {outfit.accessories.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Essential Packing List */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-medium">Essential Packing List</h3>
        {/* Section 1 */}
        <div className="mb-3">
          <div className="font-semibold">Wear on the flight/travel:</div>
          <ul className="list-disc pl-6 text-sm">
            {wearEssentials.map((item, idx) => (
              <li key={`wear-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
        {/* Section 2 */}
        <div>
          <div className="font-semibold">Packing List:</div>
          <ul className="list-disc pl-6 text-sm">
            {packEssentials.map((item, idx) => (
              <li key={`pack-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="text-xs text-gray-400 mt-3">
          Packing list is based on your luggage choice and forecast. The goal is to save room for potential shopping or souvenirs!
        </div>
      </div>
    </div>
  )
}
