import { Wind, Droplets, Eye, Thermometer, Gauge, Sun, Navigation } from "lucide-react"

interface WeatherMetricsProps {
   data: {
      windSpeed: number
      windDirection: number
      humidity: number
      visibility: number
      pressure: number
      uvIndex: number
   }
}

export function WeatherMetrics({ data }: WeatherMetricsProps) {
   const getWindDirection = (degrees: number) => {
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
      return directions[Math.round(degrees / 45) % 8]
   }

   const getUVLevel = (uvIndex: number) => {
      if (uvIndex <= 2) return { level: 'Faible', color: 'text-green-300' }
      if (uvIndex <= 5) return { level: 'Modéré', color: 'text-yellow-300' }
      if (uvIndex <= 7) return { level: 'Élevé', color: 'text-orange-300' }
      if (uvIndex <= 10) return { level: 'Très élevé', color: 'text-red-300' }
      return { level: 'Extrême', color: 'text-purple-300' }
   }

   const uvLevel = getUVLevel(data.uvIndex)

   const metrics = [
      {
         icon: Wind,
         label: 'Vent',
         value: `${data.windSpeed} km/h`,
         subtitle: getWindDirection(data.windDirection),
         color: 'text-blue-200',
         bgGradient: 'from-blue-500/20 to-cyan-500/10'
      },
      {
         icon: Droplets,
         label: 'Humidité',
         value: `${data.humidity}%`,
         subtitle: data.humidity > 70 ? 'Élevée' : data.humidity > 40 ? 'Modérée' : 'Faible',
         color: 'text-blue-300',
         bgGradient: 'from-blue-400/20 to-blue-600/10'
      },
      {
         icon: Eye,
         label: 'Visibilité',
         value: `${data.visibility.toFixed(1)} km`,
         subtitle: data.visibility > 10 ? 'Excellente' : data.visibility > 5 ? 'Bonne' : 'Limitée',
         color: 'text-indigo-200',
         bgGradient: 'from-indigo-500/20 to-purple-500/10'
      },
      {
         icon: Thermometer,
         label: 'Pression',
         value: `${Math.round(data.pressure)} hPa`,
         subtitle: data.pressure > 1013 ? 'Haute' : 'Basse',
         color: 'text-purple-200',
         bgGradient: 'from-purple-500/20 to-pink-500/10'
      },
      {
         icon: Sun,
         label: 'Index UV',
         value: data.uvIndex?.toString() || 'N/A',
         subtitle: uvLevel.level,
         color: uvLevel.color,
         bgGradient: 'from-yellow-500/20 to-orange-500/10'
      },
      {
         icon: Navigation,
         label: 'Direction',
         value: `${data.windDirection}°`,
         subtitle: getWindDirection(data.windDirection),
         color: 'text-green-200',
         bgGradient: 'from-green-500/20 to-teal-500/10'
      }
   ]

   return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
         {metrics.map((metric, index) => (
            <div
               key={index}
               className={`group relative overflow-hidden bg-gradient-to-br from-white/20 to-white/5 dark:from-black/20 dark:to-black/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white transition-all duration-500 hover:-translate-y-1 hover:shadow-xl border border-white/10`}
            >
               {/* Gradient overlay */}
               <div className={`absolute inset-0 bg-gradient-to-br ${metric.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

               <div className="relative z-10 text-center">
                  <metric.icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 ${metric.color} group-hover:scale-110 transition-transform duration-300`} />
                  <p className="text-xs opacity-70 mb-1">{metric.label}</p>
                  <p className="text-sm sm:text-lg font-bold mb-1">{metric.value}</p>
                  <p className={`text-xs ${metric.color} opacity-80`}>{metric.subtitle}</p>
               </div>

               {/* Hover effect border */}
               <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
         ))}
      </div>
   )
}
