"use client"

import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WeatherDisplayProps {
  weatherData: any
  unit: string
  setUnit: (unit: string) => void
}

export default function WeatherDisplay({ weatherData, unit, setUnit }: WeatherDisplayProps) {
  if (!weatherData) return null

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("clear") || conditionLower.includes("sun"))
      return <Sun className="h-12 w-12 text-yellow-500" />
    if (conditionLower.includes("rain")) return <CloudRain className="h-12 w-12 text-blue-500" />
    if (conditionLower.includes("snow")) return <CloudSnow className="h-12 w-12 text-blue-200" />
    if (conditionLower.includes("thunder") || conditionLower.includes("lightning"))
      return <CloudLightning className="h-12 w-12 text-purple-500" />
    if (conditionLower.includes("wind")) return <Wind className="h-12 w-12 text-gray-500" />
    return <Cloud className="h-12 w-12 text-gray-400" />
  }

  const tempF = Math.round(weatherData.main.temp)
  const tempC = Math.round(((tempF - 32) * 5) / 9)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Current Weather</span>
          <Tabs value={unit} onValueChange={setUnit} className="w-auto">
            <TabsList className="h-8">
              <TabsTrigger value="fahrenheit" className="text-xs">
                °F
              </TabsTrigger>
              <TabsTrigger value="celsius" className="text-xs">
                °C
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">{unit === "fahrenheit" ? `${tempF}°F` : `${tempC}°C`}</h3>
            <p className="text-gray-500">{weatherData.name}</p>
            <p className="mt-1 text-sm capitalize">{weatherData.weather[0].description}</p>
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            {getWeatherIcon(weatherData.weather[0].main)}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-md bg-gray-100 p-2">
            <p className="text-gray-500">Humidity</p>
            <p className="font-medium">{weatherData.main.humidity}%</p>
          </div>
          <div className="rounded-md bg-gray-100 p-2">
            <p className="text-gray-500">Wind</p>
            <p className="font-medium">{Math.round(weatherData.wind.speed)} mph</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
