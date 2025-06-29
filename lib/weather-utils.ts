import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Cloudy, type LucideIcon } from "lucide-react"

export function getWeatherIcon(weatherCode: number): LucideIcon {
  // Clear sky
  if (weatherCode === 0) return Sun

  // Partly cloudy
  if (weatherCode >= 1 && weatherCode <= 3) return Cloudy

  // Fog
  if (weatherCode >= 45 && weatherCode <= 48) return Cloud

  // Drizzle
  if (weatherCode >= 51 && weatherCode <= 57) return CloudDrizzle

  // Rain
  if ((weatherCode >= 61 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
    return CloudRain
  }

  // Snow
  if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) {
    return CloudSnow
  }

  // Thunderstorm
  if (weatherCode >= 95 && weatherCode <= 99) return CloudLightning

  return Sun
}

export function getWeatherDescription(weatherCode: number): string {
  const descriptions: { [key: number]: string } = {
    0: "Ciel dégagé",
    1: "Principalement dégagé",
    2: "Partiellement nuageux",
    3: "Couvert",
    45: "Brouillard",
    48: "Brouillard givrant",
    51: "Bruine légère",
    53: "Bruine modérée",
    55: "Bruine dense",
    56: "Bruine verglaçante légère",
    57: "Bruine verglaçante dense",
    61: "Pluie légère",
    63: "Pluie modérée",
    65: "Pluie forte",
    66: "Pluie verglaçante légère",
    67: "Pluie verglaçante forte",
    71: "Neige légère",
    73: "Neige modérée",
    75: "Neige forte",
    77: "Grains de neige",
    80: "Averses légères",
    81: "Averses modérées",
    82: "Averses violentes",
    85: "Averses de neige légères",
    86: "Averses de neige fortes",
    95: "Orage",
    96: "Orage avec grêle légère",
    99: "Orage avec grêle forte",
  }

  return descriptions[weatherCode] || "Conditions inconnues"
}
