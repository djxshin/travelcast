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
  // Return the forecast in slots closest to the target hour
  return slots.reduce((prev, curr) => {
    const currHour = new Date(curr.dt_txt).getHours()
    const prevHour = new Date(prev.dt_txt).getHours()
    return Math.abs(currHour - hour) < Math.abs(prevHour - hour) ? curr : prev
  })
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

  // Only show dates within startDate and endDate (inclusive)
  const days = Object.keys(dailySlots)
    .filter((date) => date >= startDate && date <= endDate)
    .sort()

  return (
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

      <div className="space-y-3">
        {days.map((date) => {
          const slots = dailySlots[date]
          // Find closest slot to 2pm (14:00) and 8pm (20:00)
          const daySlot = getClosestForecast(slots, 14)
          const nightSlot = getClosestForecast(slots, 20)
          // If both slots are the same, only show once
          return (
            <div key={date}>
              <div className="text-sm font-semibold text-gray-700 mb-1">{date}</div>
              <div className="flex gap-3 items-center">
                <div>
                  <span className="text-xs text-gray-500">Day (2pm): </span>
                  <span className="text-gray-700">{daySlot.weather[0]?.main || "N/A"}</span>{" "}
                  <span className="font-semibold">
                    {isFahrenheit
                      ? `${Math.round(daySlot.main?.temp)}°F`
                      : `${Math.round(((daySlot.main?.temp - 32) * 5) / 9)}°C`}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Night (8pm): </span>
                  <span className="text-gray-700">{nightSlot.weather[0]?.main || "N/A"}</span>{" "}
                  <span className="font-semibold">
                    {isFahrenheit
                      ? `${Math.round(nightSlot.main?.temp)}°F`
                      : `${Math.round(((nightSlot.main?.temp - 32) * 5) / 9)}°C`}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
