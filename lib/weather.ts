const API_KEY = "dd15e97c144c99e3d25af0fd2be534c2";

export async function fetchWeather(city: string) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${API_KEY}`
    );
    

    if (!response.ok) {
      throw new Error("Weather data not available");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}
