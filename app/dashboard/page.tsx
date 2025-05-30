"use client"

import { useState } from "react"
import WeatherDisplay from "@/components/weather-display"
import { fetchWeather } from "@/lib/weather"

export default function Dashboard() {
  const [city, setCity] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [weatherData, setWeatherData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [unit, setUnit] = useState<"fahrenheit" | "celsius">("fahrenheit")
  const [luggageSize, setLuggageSize] = useState("small")

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
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Weather + Outfit Planner</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Enter city"
          className="border rounded px-3 py-2 w-44"
        />
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          value={luggageSize}
          onChange={e => setLuggageSize(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="small">Small item only</option>
          <option value="small-carryon">Small + Carry-On</option>
          <option value="small-carryon-checked">Small + Carry-On + Checked Luggage</option>
        </select>
        <button
          onClick={handleGetForecast}
          disabled={loading || !city.trim() || !startDate || !endDate}
          className="bg-black text-white rounded px-5 py-2"
        >
          {loading ? "Loading..." : "Get Forecast"}
        </button>
      </div>
      {/* Only WeatherDisplay. Remove or comment out OutfitRecommendations for now */}
      <WeatherDisplay
        weatherData={weatherData}
        unit={unit}
        setUnit={setUnit}
        startDate={startDate}
        endDate={endDate}
        luggageSize={luggageSize}
      />
    </main>
  )
}
