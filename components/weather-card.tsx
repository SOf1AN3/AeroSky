import { MapPin, Sunrise, Sunset } from "lucide-react"
import { getWeatherIcon, getWeatherDescription } from "@/lib/weather-utils"

interface WeatherCardProps {
  data: {
    current: {
      temperature: number
      weatherCode: number
      humidity: number
      windSpeed: number
      uvIndex: number
    }
    location: {
      name: string
      country: string
    }
  }
}

export function WeatherCard({ data }: WeatherCardProps) {
  const WeatherIcon = getWeatherIcon(data.current.weatherCode)
  const currentHour = new Date().getHours()
  const isDay = currentHour >= 6 && currentHour < 20

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white/25 to-white/10 dark:from-black/25 dark:to-black/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 lg:p-8 text-white shadow-2xl border border-white/20 dark:border-white/10">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/10 to-pink-500/20 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-pink-900/30"></div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 lg:gap-0">
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-200" />
              <span className="text-base sm:text-lg opacity-90 font-medium">{data.location.name}</span>
            </div>

            <div className="mb-4">
              <div className="text-5xl sm:text-6xl lg:text-7xl font-extralight mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {data.current.temperature}°
              </div>
              <div className="text-lg sm:text-xl opacity-80 font-medium">
                {getWeatherDescription(data.current.weatherCode)}
              </div>
            </div>

            {/* Mini stats */}
            <div className="flex justify-center lg:justify-start space-x-4 sm:space-x-6">
              <div className="text-center">
                <div className="text-xs sm:text-sm opacity-70">Humidité</div>
                <div className="text-sm sm:text-base font-semibold">{data.current.humidity}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs sm:text-sm opacity-70">Vent</div>
                <div className="text-sm sm:text-base font-semibold">{data.current.windSpeed} km/h</div>
              </div>
              <div className="text-center">
                <div className="text-xs sm:text-sm opacity-70">UV</div>
                <div className="text-sm sm:text-base font-semibold">{data.current.uvIndex || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-right lg:ml-8">
            <WeatherIcon className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 text-yellow-300 drop-shadow-2xl animate-pulse mx-auto lg:mx-0" />
            <div className="flex items-center justify-center lg:justify-end mt-4 space-x-2">
              {isDay ? (
                <Sunrise className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300" />
              ) : (
                <Sunset className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300" />
              )}
              <span className="text-xs sm:text-sm opacity-70">
                {isDay ? 'Jour' : 'Nuit'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
