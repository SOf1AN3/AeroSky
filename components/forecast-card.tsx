import { getWeatherIcon, getWeatherDescription } from "@/lib/weather-utils"
import { Droplets, Wind } from "lucide-react"

interface ForecastCardProps {
  data: {
    date: string
    maxTemp: number
    minTemp: number
    weatherCode: number
    precipitation: number
  }
}

export function ForecastCard({ data }: ForecastCardProps) {
  const WeatherIcon = getWeatherIcon(data.weatherCode)
  const date = new Date(data.date)
  const dayName = date.toLocaleDateString("fr-FR", { weekday: "short" })
  const dayDate = date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
  const isToday = date.toDateString() === new Date().toDateString()

  return (
    <div className={`group relative overflow-hidden bg-gradient-to-br from-white/20 to-white/5 dark:from-black/20 dark:to-black/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl border border-white/10 ${isToday ? 'ring-2 ring-blue-400/50 bg-gradient-to-br from-blue-500/20 to-purple-500/10' : ''}`}>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 text-center">
        <div className="mb-3 sm:mb-4">
          <h3 className={`font-bold text-base sm:text-lg capitalize mb-1 ${isToday ? 'text-blue-200' : ''}`}>
            {isToday ? 'Aujourd\'hui' : dayName}
          </h3>
          <p className="text-xs sm:text-sm opacity-80">{dayDate}</p>
        </div>

        <div className="mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform duration-300">
          <WeatherIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-yellow-300 drop-shadow-lg" />
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {data.maxTemp}°
            </span>
            <span className="text-base sm:text-lg opacity-70">{data.minTemp}°</span>
          </div>

          <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
            {getWeatherDescription(data.weatherCode)}
          </p>

          {/* Additional info */}
          <div className="flex justify-center space-x-4 pt-2">
            {data.precipitation > 0 && (
              <div className="flex items-center space-x-1 text-xs text-blue-200">
                <Droplets className="w-3 h-3" />
                <span>{data.precipitation.toFixed(1)}mm</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}
