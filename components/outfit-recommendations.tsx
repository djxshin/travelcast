"use client"

import { Shirt, PenIcon as Pants, FootprintsIcon as Shoe, Layers } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OutfitRecommendationsProps {
  weatherData: any
  luggageSize: string
  style: string
}

export default function OutfitRecommendations({ weatherData, luggageSize, style }: OutfitRecommendationsProps) {
  if (!weatherData) return null

  const today = weatherData.list?.[0]
  const tempF = Math.round(today?.main?.temp || 0)
  const condition = today?.weather?.[0]?.main?.toLowerCase() || "unknown"

  // Generate outfit recommendations based on temperature, condition, and style
  const getOutfitRecommendations = () => {
    let top, bottom, shoes, layer

    // Base recommendations on temperature
    if (tempF > 80) {
      // Hot weather
      top = style === "business" ? "Light cotton dress shirt" : style === "smart-casual" ? "Polo shirt" : "T-shirt"

      bottom = style === "business" ? "Lightweight slacks" : style === "smart-casual" ? "Chinos" : "Shorts"

      shoes = style === "business" ? "Loafers" : style === "smart-casual" ? "Boat shoes" : "Sandals"

      layer = style === "business" ? "Light blazer (optional)" : "None needed"
    } else if (tempF > 65) {
      // Warm weather
      top =
        style === "business" ? "Dress shirt" : style === "smart-casual" ? "Button-down shirt" : "Light long sleeve tee"

      bottom = style === "business" ? "Wool trousers" : style === "smart-casual" ? "Chinos" : "Jeans or shorts"

      shoes = style === "business" ? "Oxfords" : style === "smart-casual" ? "Loafers" : "Sneakers"

      layer = style === "business" ? "Blazer" : style === "smart-casual" ? "Light cardigan" : "Light jacket"
    } else if (tempF > 45) {
      // Cool weather
      top = style === "business" ? "Dress shirt" : style === "smart-casual" ? "Button-down shirt" : "Long sleeve tee"

      bottom = style === "business" ? "Wool trousers" : "Jeans"

      shoes = style === "business" ? "Oxfords" : style === "smart-casual" ? "Chelsea boots" : "Boots or sneakers"

      layer =
        style === "business"
          ? "Wool blazer or suit jacket"
          : style === "smart-casual"
            ? "Sweater or light coat"
            : "Hoodie or jacket"
    } else {
      // Cold weather
      top = style === "business" ? "Dress shirt" : style === "smart-casual" ? "Turtleneck" : "Thermal or long sleeve"

      bottom = style === "business" ? "Wool trousers" : "Heavy jeans"

      shoes = style === "business" ? "Leather boots" : "Winter boots"

      layer = style === "business" ? "Wool overcoat" : style === "smart-casual" ? "Wool coat" : "Heavy jacket or parka"
    }

    // Adjust for rain
    if (condition.includes("rain") || condition.includes("drizzle")) {
      shoes = style === "business" ? "Waterproof dress shoes" : "Waterproof boots"
      layer = style === "business" ? "Trench coat" : "Rain jacket"
    }

    // Adjust for luggage size
    if (luggageSize === "backpack") {
      // Minimize items for backpack only
      layer = layer.includes("optional") ? "None (limited space)" : layer
    }

    return { top, bottom, shoes, layer }
  }

  const outfit = getOutfitRecommendations()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Outfit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Shirt className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Top</p>
              <p className="font-medium">{outfit.top}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Pants className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Bottom</p>
              <p className="font-medium">{outfit.bottom}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Shoe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Shoes</p>
              <p className="font-medium">{outfit.shoes}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Layer</p>
              <p className="font-medium">{outfit.layer}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
