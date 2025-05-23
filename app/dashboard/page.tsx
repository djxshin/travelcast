"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import WeatherDisplay from "@/components/weather-display"
import OutfitRecommendations from "@/components/outfit-recommendations"
import { fetchWeather } from "@/lib/weather"

export default function Dashboard() {
  const [city, setCity] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [weatherData, setWeatherData] = useState<any[]>([])
  const [luggageSize, setLuggageSize] = useState("small")
  const [style, setStyle] = useState("casual")
  const [unit, setUnit] = useState("fahrenheit")

  const getTodayDate = () => new Date().toISOString().split("T")[0]

  const handleGetForecast = async () => {
    if (!city.trim() || !startDate || !endDate) return

    setLoading(true)
    try {
      const data = await fetchWeather(city)

      // Filter forecast results between startDate and endDate
      const filtered = data.list.filter((entry: any) => {
        const dateOnly = entry.dt_txt.split(" ")[0]
        return dateOnly >= startDate && dateOnly <= endDate
      })

      setWeatherData(filtered)
    } catch (error) {
      console.error("Error fetching weather:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white p-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <h1 className="text-xl font-bold">TRAVELCAST</h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl p-4">
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold">Weather + Outfit Planner</h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              type="date"
              value={startDate}
              min={getTodayDate()}
              onChange={(e) => {
                setStartDate(e.target.value)
                if (endDate < e.target.value) setEndDate("")
              }}
            />
            <Input
              type="date"
              value={endDate}
              min={startDate || getTodayDate()}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Button
              onClick={handleGetForecast}
              disabled={loading || !city.trim() || !startDate || !endDate}
              className="whitespace-nowrap"
            >
              {loading ? "Loading..." : "Get Forecast"}
            </Button>
          </div>
        </div>

        {weatherData.length > 0 && (
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <WeatherDisplay
              weatherData={weatherData}
              unit={unit}
              setUnit={setUnit}
              startDate={startDate}
              endDate={endDate}
            />
            <OutfitRecommendations
              weatherData={weatherData}
              luggageSize={luggageSize}
              style={style}
            />
          </div>
        )}

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium">Travel Preferences</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Luggage Size</label>
              <Select value={luggageSize} onValueChange={setLuggageSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select luggage size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small item only</SelectItem>
                  <SelectItem value="small-carryon">Small + Carry-On</SelectItem>
                  <SelectItem value="small-carryon-checked">Small + Carry-On + Checked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Style</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="smart-casual">Smart Casual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
