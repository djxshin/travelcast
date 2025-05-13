"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import WeatherDisplay from "@/components/weather-display"
import OutfitRecommendations from "@/components/outfit-recommendations"
import { fetchWeather } from "@/lib/weather"

export default function Dashboard() {
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(false)
  const [weatherData, setWeatherData] = useState(null)
  const [luggageSize, setLuggageSize] = useState("backpack")
  const [style, setStyle] = useState("casual")
  const [unit, setUnit] = useState("fahrenheit")

  const handleGetForecast = async () => {
    if (!city.trim()) return

    setLoading(true)
    try {
      const data = await fetchWeather(city)
      setWeatherData(data)
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
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleGetForecast} disabled={loading || !city.trim()} className="whitespace-nowrap">
              {loading ? "Loading..." : "Get Forecast"}
            </Button>
          </div>
        </div>

        {weatherData && (
          <>
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              {/* Weather Display */}
              <WeatherDisplay weatherData={weatherData} unit={unit} setUnit={setUnit} />

              {/* Outfit Recommendations */}
              <OutfitRecommendations weatherData={weatherData} luggageSize={luggageSize} style={style} />
            </div>

            {/* Preferences */}
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
                      <SelectItem value="backpack">Backpack only</SelectItem>
                      <SelectItem value="backpack-carryon">Backpack + Carry-On</SelectItem>
                      <SelectItem value="carryon-checked">Carry-On + Checked</SelectItem>
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
          </>
        )}
      </main>
    </div>
  )
}
