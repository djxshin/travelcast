"use client"

import React from "react"

interface WeatherDisplayProps {
  weatherData: any
  unit: string
  setUnit: (unit: string) => void
  startDate: string
  endDate: string
}

function getClosestForecast(slots: any[], hour: number) {
  return slots.reduce((prev, curr) => {
    const currHour = new Date(curr.dt_txt).getHours()
    const prevHour = new Date(prev.dt_txt).getHours()
    return Math.abs(currHour - hour) < Math.abs(prevHour - hour) ? curr : prev
  })
}

function getOutfitSuggestion({ temp, condition, wind }: { temp: number; condition: string; wind: number }, style: string) {
  const layers = []
  if (temp < 55) layers.push("Warm jacket or hoodie")
  else if (temp < 68) layers.push("Light jacket or long sleeve")
  else layers.push("T-shirt or short sleeve")

  if (condition.includes("rain")) layers.push("Raincoat or umbrella")
  if (condition.includes("cloud")) layers.push("Optional hat")
  if (condition.includes("sun")) layers.push("Sunglasses/hat")
  if (wind > 10) layers.push("Windbreaker")
  return layers.join(", ")
}

export default function WeatherDisplay({
  weatherData,
  unit,
  setUnit,
  startDate,
  endDate,
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

  // -- Packing List (Minimum Required) --
  const numDays = days.length
  const hasRain = days.some((date) =>
    [getClosestForecast(dailySlots[date], 14), getClosestForecast(dailySlots[date], 20)]
      .some(slot => slot.weather[0].main.toLowerCase().includes("rain"))
  )
  const minPacking = [
    `${Math.max(1, Math.ceil(numDays * 0.7))} tops`,
    `${Math.max(1, Math.ceil(numDays / 3))} bottoms`,
    `1 jacket/hoodie`,
    hasRain ? "Raincoat or umbrella" : "",
    "1–2 pair(s) of shoes",
  ].filter(Boolean)

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

        <div className="space-y-4">
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
            const dayCond = daySlot.weather[0]?.main || "N/A"
            const nightCond = nightSlot.weather[0]?.main || "N/A"

            // Outfit suggestion: combine both times for flexibility
            const outfit = getOutfitSuggestion(
              {
                temp: Math.min(dayTemp, nightTemp),
                condition: (dayCond + " " + nightCond).toLowerCase(),
                wind: Math.max(daySlot.wind?.speed || 0, nightSlot.wind?.speed || 0),
              },
              "casual"
            )

            return (
              <div key={date}>
                <div className="text-sm font-semibold text-gray-700 mb-1">{date}</div>
                <div className="flex gap-3 items-center text-sm">
                  <div>
                    <span className="text-xs text-gray-500">Day (2pm): </span>
                    <span className="text-gray-700">{dayCond} {dayTemp}°{isFahrenheit ? "F" : "C"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Night (8pm): </span>
                    <span className="text-gray-700">{nightCond} {nightTemp}°{isFahrenheit ? "F" : "C"}</span>
                  </div>
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  Outfit: <span className="font-medium">{outfit}</span>
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
          {minPacking.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <div className="text-xs text-gray-400 mt-3">
          *Packing list is for minimum essentials. Adjust for your style or longer trips.
        </div>
      </div>
    </div>
  )
}
