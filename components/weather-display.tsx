"use client"

import { useEffect, useState } from "react"

interface WeatherDisplayProps {
  weatherData: any
  unit: "fahrenheit" | "celsius"
  setUnit: (unit: "fahrenheit" | "celsius") => void
  startDate: string
  endDate: string
}

export default function WeatherDisplay({
  weatherData,
  unit,
  setUnit,
  startDate,
  endDate,
}: WeatherDisplayProps) {
  const [dailyForecast, setDailyForecast] = useState<any[]>([])

  useEffect(() => {
    if (!weatherData?.list || !Array.isArray(weatherData.list)) return

    // Group forecast entries by date (YYYY-MM-DD)
    const grouped: Record<string, any[]> = {}

    weatherData.list.forEach((entry: any) => {
      const date = entry.dt_txt.split(" ")[0]
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(entry)
    })

    // Get one entry per day — prefer midday (~12:00)
    const daily = Object.entries(grouped).map(([date, entries]: [string, any[]]) => {
      const midday = entries.find((e) => e.dt_txt.includes("12:00:00")) || entries[0]
      return { date, ...midday }
    })

    // Filter to only include selected travel dates
    const filtered = daily.filter((day) => {
      return day.date >= startDate && day.date <= endDate
    })

    setDailyForecast(filtered)
  }, [weatherData, startDate, endDate])

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Forecast</h3>
        <div className="space-x-2">
          <button
            onClick={() => setUnit("fahrenheit")}
            className={`px-2 py-1 rounded ${unit === "fahrenheit" ? "bg-black text-white" : "bg-gray-200"}`}
          >
            °F
          </button>
          <button
            onClick={() => setUnit("celsius")}
            className={`px-2 py-1 rounded ${unit === "celsius" ? "bg-black text-white" : "bg-gray-200"}`}
          >
            °C
          </button>
        </div>
      </div>

      {dailyForecast.length === 0 ? (
        <p>No forecast data available.</p>
      ) : (
        <ul className="space-y-4">
          {dailyForecast.map((day) => {
            const tempF = Math.round(day.main.temp)
            const temp =
              unit === "fahrenheit"
                ? `${tempF}°F`
                : `${Math.round(((tempF - 32) * 5) / 9)}°C`
            const weather = day.weather[0]?.main || "N/A"

            return (
              <li key={day.date} className="flex justify-between border-b pb-2">
                <span className="font-medium">{day.date}</span>
                <span>{weather}</span>
                <span>{temp}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
