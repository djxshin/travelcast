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

// Helper to pick an emoji based on weather condition
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
  // Top
  let top = ""
  if (condition.includes("rain")) top = "Raincoat or warm jacket, Tee"
  else if (temp < 55) top = "Warm jacket or hoodie, Tee"
  else if (temp < 68) top = "Light jacket or long sleeve, Tee"
  else top = "Tee or short sleeve"

  // Bottom
  let bottom = temp > 78 ? "Shorts" : "Jeans or pants"
  // Shoes
  let shoes = condition.includes("rain")
    ? "Waterproof boots or sneakers"
    : "Sneakers or boots"

  // Accessories
  const accessories = getAccessories({ condition, wind, temp })

  return { top, bottom, shoes, accessories }
}

function getClosestForecast(slots: any[], hour: number) {
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

  // -- Packing List (Minimum Required, keep your logic here as needed) --
  const numDays = days.length
  const hasRain = days.some((date) =>
    [getClosestForecast(dailySlots[date], 12), getClosestForecast(dailySlots[date], 21)]
      .some(slot => slot.weather[0].main.toLowerCase().includes("rain"))
  )
  const minPacking = [
    `${numDays} socks`,
    `${numDays} underwear`,
    `Tops: up to 4`,
    `Bottoms: up to 2`,
    `Jacket(s): up to 1`,
    `Shoes: up to 1`,
    hasRain ? "Raincoat" : "",
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
        <div className="space-y-5">
          {days.map((date) => {
            const slots = dailySlots[date]
            const slot9am = getClosestForecast(slots, 9)
            const slotNoon = getClosestForecast(slots, 12)
            const slot9pm = getClosestForecast(slots, 21)

            const temp9am = isFahrenheit
              ? Math.round(slot9am.main.temp)
              : Math.round(((slot9am.main.temp - 32) * 5) / 9)
            const tempNoon = isFahrenheit
              ? Math.round(slotNoon.main.temp)
              : Math.round(((slotNoon.main.temp - 32) * 5) / 9)
            const temp9pm = isFahrenheit
              ? Math.round(slot9pm.main.temp)
              : Math.round(((slot9pm.main.temp - 32) * 5) / 9)

            const cond9am = slot9am.weather[0]?.main.toLowerCase() || "n/a"
            const condNoon = slotNoon.weather[0]?.main.toLowerCase() || "n/a"
            const cond9pm = slot9pm.weather[0]?.main.toLowerCase() || "n/a"

            // Show icon for noon slot as default
            const icon = getWeatherIcon(condNoon)

            // Use noon for outfit example, or switch as you wish
            const outfit = buildOutfit({
              temp: tempNoon,
              condition: condNoon,
              wind: slotNoon.wind?.speed || 0,
            })

            return (
              <div key={date} className="pb-2 border-b last:border-b-0">
                <div className="text-sm font-semibold text-gray-700 mb-1">
                  <span className="mr-1">{icon}</span>
                  {date}
                </div>
                <div className="flex gap-3 items-center text-sm mb-1">
                  <div>
                    <span className="text-xs text-gray-500">9am: </span>
                    <span className="text-gray-700 capitalize">
                      {slot9am.weather[0]?.main} {temp9am}°{isFahrenheit ? "F" : "C"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Noon: </span>
                    <span className="text-gray-700 capitalize">
                      {slotNoon.weather[0]?.main} {tempNoon}°{isFahrenheit ? "F" : "C"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">9pm: </span>
                    <span className="text-gray-700 capitalize">
                      {slot9pm.weather[0]?.main} {temp9pm}°{isFahrenheit ? "F" : "C"}
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
