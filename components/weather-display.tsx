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

function getWeatherIcon(cond: string) {
  cond = cond.toLowerCase()
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
  let jacket = ""
  if (condition.includes("rain")) {
    jacket = "Raincoat or waterproof jacket"
    top = "Tee"
  } else if (temp < 55) {
    jacket = "Warm jacket or hoodie"
    top = "Tee"
  } else if (temp < 68) {
    jacket = "Light jacket or long sleeve"
    top = "Tee"
  } else {
    jacket = ""
    top = "Tee or short sleeve"
  }
  let bottom = temp > 78 ? "Shorts" : "Jeans or pants"
  let shoes = condition.includes("rain")
    ? "Waterproof boots or sneakers"
    : "Sneakers or boots"
  const accessories = getAccessories({ condition, wind, temp })
  return { top, jacket, bottom, shoes, accessories }
}

function getClosestForecast(slots: any[], hour: number) {
  return slots.reduce((prev, curr) => {
    const currHour = new Date(curr.dt_txt).getHours()
    const prevHour = new Date(prev.dt_txt).getHours()
    return Math.abs(currHour - hour) < Math.abs(prevHour - hour) ? curr : prev
  })
}

// Packing logic for "small item only"
function getPackingList(luggageSize: string, days: number, rainLikely: boolean) {
  if (luggageSize === "small") {
    return {
      wear: [
        "1 top (wear)",
        "1 bottom (wear)",
        "1 jacket (wear or tie to bag)",
        "1 pair of shoes (wear)",
      ],
      pack: [
        "1 extra top (pack)",
        "maybe 1 light extra bottom (if space)",
        rainLikely ? "Ultra-light raincoat/poncho (if rainy)" : "",
        `${Math.min(days, 3)} socks & underwear (max)`,
        "Tiny toiletries only",
        "Flip-flops/slippers if absolutely needed"
      ].filter(Boolean),
      disclaimer: `*Packing list is based on your luggage choice and forecast, and aims to save you room for shopping or souvenirs.`,
    }
  }
  // You can add logic for other bag sizes similarly (if needed)
  return {
    wear: [
      "1 top (wear)",
      "1 bottom (wear)",
      "1 jacket (wear or tie to bag)",
      "1 pair of shoes (wear)",
    ],
    pack: [
      `1-2 extra tops (pack)`,
      `1-2 extra bottoms (pack)`,
      rainLikely ? "Raincoat/poncho" : "",
      `${days} socks & underwear`,
      "Toiletries",
      "Flip-flops/slippers (optional)"
    ].filter(Boolean),
    disclaimer: `*Packing list is based on your luggage choice and forecast, and aims to save you room for shopping or souvenirs.`,
  }
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

  // For the packing list, check if any day has rain
  const rainLikely = days.some(date =>
    [getClosestForecast(dailySlots[date], 9), getClosestForecast(dailySlots[date], 12), getClosestForecast(dailySlots[date], 21)]
      .some(slot => slot.weather[0]?.main?.toLowerCase().includes("rain"))
  )

  const packing = getPackingList(luggageSize, days.length, rainLikely)

  return (
    <div className="md:grid md:grid-cols-2 flex flex-col gap-8">
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
            const slot9am = getClosestForecast(slots, 9)
            const slotNoon = getClosestForecast(slots, 12)
            const slot9pm = getClosestForecast(slots, 21)
            // Weather values
            const v = (slot: any) => {
              const temp = isFahrenheit
                ? Math.round(slot.main.temp)
                : Math.round(((slot.main.temp - 32) * 5) / 9)
              const cond = slot.weather[0]?.main || ""
              return { temp, cond, wind: slot.wind?.speed || 0 }
            }
            const v9 = v(slot9am)
            const v12 = v(slotNoon)
            const v21 = v(slot9pm)
            // Use noon slot for outfit rec (or average)
            const outfit = buildOutfit({
              temp: v12.temp,
              condition: v12.cond.toLowerCase(),
              wind: v12.wind,
            })

            return (
              <div key={date} className="pb-2 border-b last:border-b-0">
                <div className="text-sm font-semibold text-gray-700 mb-1">
                  {date}
                </div>
                <div className="flex gap-4 items-center text-sm mb-1">
                  <span>9am: {getWeatherIcon(v9.cond)} {v9.temp}°{isFahrenheit ? "F" : "C"}</span>
                  <span>Noon: {getWeatherIcon(v12.cond)} {v12.temp}°{isFahrenheit ? "F" : "C"}</span>
                  <span>9pm: {getWeatherIcon(v21.cond)} {v21.temp}°{isFahrenheit ? "F" : "C"}</span>
                </div>
                <div className="mt-1 pl-1 text-sm leading-tight">
                  <div>
                    <span className="font-semibold">Top:</span> {outfit.top}
                  </div>
                  {outfit.jacket && (
                    <div>
                      <span className="font-semibold">Jacket:</span> {outfit.jacket}
                    </div>
                  )}
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
      {/* Essential Packing List */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-medium">Essential Packing List</h3>
        <div className="mb-2">
          <div className="font-semibold underline mb-1">Wear on the flight/travel:</div>
          <ul className="list-disc pl-6 text-sm">
            {packing.wear.map((item, idx) => (
              <li key={`wear-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="mb-2">
          <div className="font-semibold underline mb-1">Packing List:</div>
          <ul className="list-disc pl-6 text-sm">
            {packing.pack.map((item, idx) => (
              <li key={`pack-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="text-xs text-gray-400 mt-2">{packing.disclaimer}</div>
      </div>
    </div>
  )
}
