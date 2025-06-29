"use client"

import { useEffect, useState } from "react"

interface WeatherBackgroundProps {
  weatherCode: number
}

export function WeatherBackground({ weatherCode }: WeatherBackgroundProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; speed: number }>>([])

  const getBackgroundGradient = (code: number) => {
    // Clear sky
    if (code === 0) {
      return "from-blue-400 via-blue-500 to-blue-600 dark:from-blue-900 dark:via-blue-800 dark:to-gray-900"
    }
    // Partly cloudy
    if (code >= 1 && code <= 3) {
      return "from-blue-300 via-gray-400 to-blue-500 dark:from-gray-700 dark:via-gray-600 dark:to-gray-800"
    }
    // Fog
    if (code >= 45 && code <= 48) {
      return "from-gray-300 via-gray-400 to-gray-500 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900"
    }
    // Rain
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      return "from-gray-400 via-gray-500 to-gray-600 dark:from-gray-900 dark:via-gray-800 dark:to-black"
    }
    // Snow
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
      return "from-gray-200 via-gray-300 to-gray-400 dark:from-gray-700 dark:via-gray-600 dark:to-gray-800"
    }
    // Thunderstorm
    if (code >= 95 && code <= 99) {
      return "from-gray-800 via-gray-700 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black"
    }

    return "from-blue-400 via-blue-500 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
  }

  const shouldShowParticles = (code: number) => {
    // Rain or snow
    return (code >= 51 && code <= 67) || (code >= 71 && code <= 77) || (code >= 80 && code <= 86)
  }

  useEffect(() => {
    if (shouldShowParticles(weatherCode)) {
      const particleCount = window.innerWidth < 768 ? 25 : 50; // Reduce particles on mobile
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: Math.random() * 2 + 1,
      }))
      setParticles(newParticles)

      const interval = setInterval(() => {
        setParticles((prev) =>
          prev.map((particle) => ({
            ...particle,
            y: (particle.y + particle.speed) % 100,
          })),
        )
      }, 100)

      return () => clearInterval(interval)
    } else {
      setParticles([])
    }
  }, [weatherCode])

  const isSnow = weatherCode >= 71 && weatherCode <= 77
  const particleColor = isSnow ? "bg-white" : "bg-blue-300"
  const particleSize = isSnow ? "w-1 h-1" : "w-0.5 h-2"

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br ${getBackgroundGradient(weatherCode)} transition-all duration-1000 animate-gradient`}
    >
      {/* Animated particles for rain/snow */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute ${particleColor} ${particleSize} opacity-60 ${isSnow ? "rounded-full animate-float" : "rounded-sm"}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: isSnow ? "none" : "rotate(15deg)",
            animation: isSnow ? `float ${3 + Math.random() * 2}s ease-in-out infinite` : undefined,
          }}
        />
      ))}

      {/* Enhanced floating clouds animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-16 bg-white/10 rounded-full animate-float-slow opacity-60"></div>
        <div className="absolute top-40 right-20 w-24 h-12 bg-white/5 rounded-full animate-float-slower opacity-40"></div>
        <div className="absolute top-60 left-1/3 w-40 h-20 bg-white/8 rounded-full animate-float opacity-50"></div>
        <div className="absolute bottom-32 right-1/4 w-28 h-14 bg-white/6 rounded-full animate-float-slow opacity-30"></div>
        <div className="absolute top-1/2 left-20 w-36 h-18 bg-white/4 rounded-full animate-float-slower opacity-35"></div>
      </div>

      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-black/5 dark:bg-black/10"></div>
    </div>
  )
}
