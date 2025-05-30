"use client"

import React from "react"

interface WeatherDisplayProps {
  weatherData: any[]
  unit: "fahrenheit" | "celsius"
  setUnit: React.Dispatch<React.SetStateAction<"fahrenheit" | "celsius">>
  startDate: string
  endDate: string
  luggageSize: string
}

// Packing rules per luggage size
const packingRules: Record<string, { tops: number, bottoms: number, jackets: number, shoes: number }> = {
  "small": { tops: 4, bottoms: 2, jackets: 1, shoes: 1 },
  "small-carryon": { tops: 6, bottoms: 3, jackets: 2, shoes: 2 },
  "small-carryon-checked": { tops: 10, bottoms: 4, jackets: 3, shoes: 3 }
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

  // Group slots by date (YYYY-MM-DD)
  const dailySlots: Record<string, any[]> = {}
  weatherData.forEach((slot: any) => {
    const date = slot.dt_txt.split(" ")[0]
    if (!dailySlots[date]) dailySlots[date] = []
    dailySlots[date].push(slot)
  })

  const days = Object.keys(dailySlots)
    .filter((date) => date >= startDate && date <= endDate)
    .sort()

  // -- Packing List Dynamic by Bag --
  const rules = packingRules[luggageSize] || packingRules.small

  // For minimum: socks and underwear (1 per day)
  const essentials = [
    `${days.length} socks`,
    `${days.length} underwear`
  ]

  // Find if any day is rainy (for raincoat)
  const hasRain = days.some((date) =>
    [getClosestForecast(dailySlots[date], 14), getClosestForecast(dailySlots[date], 20)]
      .some(slot => slot.weather[0].main.toLowerCase().includes("rain"))
  )

  function getClosestForecast(slots: any[], hour: number) {
    return slots.reduce((prev, curr) => {
      const currHour = new Date(curr.dt_txt).getHours()
      const prevHour = new Date(prev.dt_txt).getHours()
      return Math.abs(currHour - hour) < Math.abs(prevHour - hour) ? curr : prev
    })
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Forecast & Outfits */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Forecast</h3>
          <div className="flex gap-2">
            <button
              className={`rounded px-2 py-1 text-sm font-medium ${isFahrenheit ? "bg-black text-white" : "bg-gray-200 text-gray-800"}`}
              onClick={() => setUnit("fahrenheit")}
            >
              °F
            </button>
            <button
              className={`rounded px-2 py-1 text-sm font-medium ${!isFahrenheit ? "bg-black text-white" : "bg-gray-200 text-gray-800"}`}
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

            const summary = summarizeDay(dayCond, nightCond)
            const icon = getWeatherIcon(dayCond + nightCond)
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

      {/* Packing List */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium">Essential Packing List</h3>
        <ul className="list-disc pl-6 text-sm">
          {essentials.map((item, idx) => <li key={idx}>{item}</li>)}
          <li>
            <span className="font-semibold">Tops:</span> up to {rules.tops}
          </li>
          <li>
            <span className="font-semibold">Bottoms:</span> up to {rules.bottoms}
          </li>
          <li>
            <span className="font-semibold">Jacket(s):</span> up to {rules.jackets}
          </li>
          <li>
            <span className="font-semibold">Shoes:</span> up to {rules.shoes}
          </li>
          {hasRain && <li><span className="font-semibold">Raincoat</span></li>}
        </ul>
        <div className="text-xs text-gray-400 mt-3">
          *Packing list is dynamic and adjusts to your luggage size.
        </div>
      </div>
    </div>
  )
}
