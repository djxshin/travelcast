import React from "react"

type OutfitRecommendationsProps = {
  weatherData: any
  luggageSize: string
  style: string
}

const packingRules: Record<string, any> = {
  "small": {
    topsPerDay: 0.6,
    bottomsPerTrip: 1,
    jackets: 1,
    shoes: 1,
  },
  "small-carryon": {
    topsPerDay: 0.9,
    bottomsPerTrip: 2,
    jackets: 1,
    shoes: 2,
  },
  "small-carryon-checked": {
    topsPerDay: 1,
    bottomsPerTrip: 3,
    jackets: 2,
    shoes: 2,
  },
}

export default function OutfitRecommendations({
  weatherData,
  luggageSize,
  style,
}: OutfitRecommendationsProps) {
  if (!weatherData || !Array.isArray(weatherData)) return null

  const duration = weatherData.length
  const rules = packingRules[luggageSize] || packingRules["small"]
  const tops = Math.ceil(duration * rules.topsPerDay)
  const bottoms = rules.bottomsPerTrip
  const jackets = rules.jackets
  const shoes = rules.shoes

  const extras = new Set<string>()
  weatherData.forEach((day: any) => {
    const condition = day.weather[0].main.toLowerCase()
    const wind = day.wind?.speed || 0

    if (condition.includes("sun")) extras.add("Sunglasses or hat")
    if (condition.includes("rain")) extras.add("Umbrella or raincoat")
    if (wind > 10) extras.add("Windbreaker or light jacket")
  })

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-medium">Recommended Packing List</h3>
      <ul className="list-disc pl-6 text-sm">
        <li>{tops} tops</li>
        <li>{bottoms} bottoms</li>
        <li>{jackets} jacket(s)</li>
        <li>{shoes} pair(s) of shoes</li>
        {[...extras].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

