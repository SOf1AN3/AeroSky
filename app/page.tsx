"use client"

import { useState, useEffect } from "react"
import { WeatherCard } from "@/components/weather-card"
import { SearchBar } from "@/components/search-bar"
import { ForecastCard } from "@/components/forecast-card"
import { WeatherMetrics } from "@/components/weather-metrics"
import { ThemeToggle } from "@/components/theme-toggle"
import { WeatherBackground } from "@/components/weather-background"
import { LoadingSpinner } from "@/components/loading-spinner"

interface WeatherData {
  current: {
    temperature: number
    humidity: number
    windSpeed: number
    windDirection: number
    weatherCode: number
    visibility: number
    uvIndex: number
    pressure: number
  }
  location: {
    name: string
    country: string
    latitude: number
    longitude: number
  }
  forecast: Array<{
    date: string
    maxTemp: number
    minTemp: number
    weatherCode: number
    precipitation: number
  }>
}

interface SearchParams {
  cityName: string
  latitude?: number
  longitude?: number
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWeatherData = async (latitude: number, longitude: number, locationName?: string) => {
    try {
      setLoading(true)
      setError(null)

      // Fetch current weather and forecast
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,visibility,uv_index,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7`,
      )

      if (!weatherResponse.ok) {
        if (weatherResponse.status === 429) {
          throw new Error("Trop de requêtes. Veuillez réessayer dans quelques minutes.")
        } else if (weatherResponse.status >= 500) {
          throw new Error("Service temporairement indisponible. Réessayez plus tard.")
        } else {
          throw new Error(`Erreur lors de la récupération des données météo (${weatherResponse.status})`)
        }
      }

      const weatherJson = await weatherResponse.json()

      // Get location name if not provided
      let finalLocationName = locationName
      if (!finalLocationName) {
        try {
          const geoResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`,
          )
          const geoData = await geoResponse.json()
          finalLocationName = geoData.city || geoData.locality || "Localisation inconnue"
        } catch {
          finalLocationName = "Localisation inconnue"
        }
      }

      const data: WeatherData = {
        current: {
          temperature: Math.round(weatherJson.current.temperature_2m),
          humidity: weatherJson.current.relative_humidity_2m,
          windSpeed: Math.round(weatherJson.current.wind_speed_10m),
          windDirection: weatherJson.current.wind_direction_10m,
          weatherCode: weatherJson.current.weather_code,
          visibility: weatherJson.current.visibility / 1000, // Convert to km
          uvIndex: weatherJson.current.uv_index,
          pressure: weatherJson.current.surface_pressure,
        },
        location: {
          name: finalLocationName || "Localisation inconnue",
          country: "France",
          latitude,
          longitude,
        },
        forecast: weatherJson.daily.time.slice(1, 7).map((date: string, index: number) => ({
          date,
          maxTemp: Math.round(weatherJson.daily.temperature_2m_max[index + 1]),
          minTemp: Math.round(weatherJson.daily.temperature_2m_min[index + 1]),
          weatherCode: weatherJson.daily.weather_code[index + 1],
          precipitation: weatherJson.daily.precipitation_sum[index + 1],
        })),
      }

      setWeatherData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude)
        },
        () => {
          // Default to Paris if geolocation fails
          fetchWeatherData(48.8566, 2.3522, "Paris")
        },
      )
    } else {
      // Default to Paris if geolocation is not supported
      fetchWeatherData(48.8566, 2.3522, "Paris")
    }
  }

  const handleCitySearch = async (searchParams: string | SearchParams) => {
    try {
      let latitude: number, longitude: number, cityName: string

      if (typeof searchParams === 'string') {
        // Recherche par nom de ville (méthode traditionnelle)
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchParams)}&count=1&language=fr&format=json`,
        )
        const data = await response.json()

        if (data.results && data.results.length > 0) {
          const city = data.results[0]
          latitude = city.latitude
          longitude = city.longitude
          cityName = city.name
        } else {
          setError("Ville non trouvée")
          return
        }
      } else {
        // Recherche avec coordonnées (depuis les suggestions)
        latitude = searchParams.latitude || 0
        longitude = searchParams.longitude || 0
        cityName = searchParams.cityName
      }

      await fetchWeatherData(latitude, longitude, cityName)
    } catch (err) {
      setError("Erreur lors de la recherche de la ville")
    }
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={getCurrentLocation}
            className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <WeatherBackground weatherCode={weatherData?.current.weatherCode || 0} />

      <div className="relative z-10 min-h-screen bg-black/10 dark:bg-black/30">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center sm:text-left">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
                AeroSky
              </span>
            </h1>
            <ThemeToggle />
          </div>

          {/* Search Bar */}
          <div className="mb-6 sm:mb-8">
            <SearchBar onSearch={handleCitySearch} />
          </div>

          {weatherData && (
            <>
              {/* Current Weather */}
              <div className="mb-6 sm:mb-8">
                <WeatherCard data={weatherData} />
              </div>

              {/* Weather Details */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg flex items-center">
                  <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Détails météorologiques
                  </span>
                </h2>
                <WeatherMetrics data={{
                  windSpeed: weatherData.current.windSpeed,
                  windDirection: weatherData.current.windDirection,
                  humidity: weatherData.current.humidity,
                  visibility: weatherData.current.visibility,
                  pressure: weatherData.current.pressure,
                  uvIndex: weatherData.current.uvIndex
                }} />
              </div>

              {/* Forecast */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">
                  <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Prévisions 6 jours
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
                  {weatherData.forecast.map((day, index) => (
                    <ForecastCard key={index} data={day} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
