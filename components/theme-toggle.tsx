"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem("theme")
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (theme === "dark" || (!theme && systemPrefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)

    if (newTheme) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="group relative overflow-hidden p-2 sm:p-3 bg-gradient-to-br from-white/25 to-white/10 dark:from-black/25 dark:to-black/10 backdrop-blur-md rounded-xl sm:rounded-2xl text-white border border-white/20 dark:border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl"
      aria-label="Changer le thème"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:rotate-180 transition-transform duration-500" />
        ) : (
          <Moon className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:-rotate-12 transition-transform duration-500" />
        )}
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  )
}
