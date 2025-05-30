"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import WeatherDisplay from "@/components/weather-display"
import { fetchWeather } from "@/lib/weather"

// Utility to format date to YYYY-MM-DD
function getTodayDate() {
  return new Date().toISOString().split("T")[0]
}
function addDays(dateString: string, days: number) {
  if (!dateString) return ""
  const date = new Date(dateString)
  date.setDate(date.getDate() + days)
  return date.toISOString().split("T")[0]
}

export default function Dashboard() {
  const [city, setCity] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [weatherData, setWeatherData] = useState<any[]>([])
  const [luggageSize, setLuggageSize] = useState("small")
  const [unit, setUnit] = useState<"fahrenheit" | "celsius">("fahrenheit")

  const handleGetForecast = async () => {
    if (!city.trim() || !startDate || !endDate) return
    setLoading(true)
    try {
      const data = await fetchWeather(city, startDate, endDate)
      setWeatherData(data)
    } catch (err) {
      setWeatherData([])
      alert("Error fetching weather")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-2 pb-8 flex flex-col">
      {/* Controls */}
      <div className="sticky top-0 bg-gray-50 z-20 pt-4 pb-2 flex flex-col gap-2">
        <h1 className="text-xl font-bold mb-1">Weather + Outfit Planner</h1>
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Enter city..."
            value={city}
            onChange={e => setCity(e.target.value)}
            className="rounded-lg text-base"
          />
          <div className="flex gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              min={getTodayDate()}
              className="rounded-lg text-base"
            />
            <Input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              min={startDate || getTodayDate()}
              max={startDate ? addDays(startDate, 5) : ""}
              className="rounded-lg text-base"
            />
          </div>
          {/* Disclaimer about API limit */}
          <div className="text-xs italic text-gray-500 mt-1">
            Currently using free weather API that limits forecasts to 5 days ahead.
          </div>
          <Select value={luggageSize} onValueChange={setLuggageSize}>
            <SelectTrigger>
              <SelectValue placeholder="Luggage size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small item only</SelectItem>
              <SelectItem value="small-carryon">Small + Carry-On</SelectItem>
              <SelectItem value="small-carryon-checked">Small + Carry-On + Checked Luggage</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleGetForecast}
            disabled={loading || !city.trim() || !startDate || !endDate}
            className="w-full bg-black text-white mt-2 rounded-xl py-2"
          >
            {loading ? "Loading..." : "Get Forecast"}
          </Button>
        </div>
      </div>

      {/* Forecast & Packing */}
      <div className="mt-4 flex flex-col gap-6">
        <WeatherDisplay
          weatherData={weatherData}
          unit={unit}
          setUnit={setUnit}
          startDate={startDate}
          endDate={endDate}
          luggageSize={luggageSize}
        />
      </div>
    </main>
  )
}
