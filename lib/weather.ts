const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY || ""

export async function fetchWeather(city: string, _startDate?: string, _endDate?: string) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${API_KEY}`
    )
    if (!response.ok) throw new Error("Weather data not available")
    const data = await response.json()
    return data.list // <-- returns an array of forecast objects
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
}
