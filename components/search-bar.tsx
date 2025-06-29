"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Loader, X } from "lucide-react"

interface CityResult {
  id: number
  name: string
  country: string
  country_code: string
  latitude: number
  longitude: number
  admin1?: string
}

interface SearchBarProps {
  onSearch: (search: string | { cityName: string; latitude?: number; longitude?: number }) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<CityResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setLoadingSuggestions(true)
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=8&language=fr&format=json`
      )
      const data = await response.json()

      if (data.results) {
        setSuggestions(data.results)
        setShowSuggestions(true)
        setSelectedIndex(-1)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)

    // Debounce pour éviter trop de requêtes
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(value)
    }, 300)
  }

  const handleSuggestionClick = async (suggestion: CityResult) => {
    const fullName = suggestion.admin1
      ? `${suggestion.name}, ${suggestion.admin1}, ${suggestion.country}`
      : `${suggestion.name}, ${suggestion.country}`

    setQuery(fullName)
    setShowSuggestions(false)
    setSuggestions([])
    setIsLoading(true)
    try {
      await onSearch({
        cityName: suggestion.name,
        latitude: suggestion.latitude,
        longitude: suggestion.longitude
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else if (query.trim()) {
          handleSubmit(e)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const clearSearch = () => {
    setQuery("")
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [selectedIndex])

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsLoading(true)
      setShowSuggestions(false)
      try {
        await onSearch(query.trim())
        setQuery("")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="relative max-w-xl sm:max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative group">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/25 to-white/10 dark:from-black/25 dark:to-black/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 dark:border-white/10 group-focus-within:border-white/40 group-focus-within:shadow-xl transition-all duration-300"></div>

          <div className="relative flex items-center">
            <Search className="absolute left-3 sm:left-5 w-4 h-4 sm:w-5 sm:h-5 text-white/70 group-focus-within:text-white transition-colors duration-300" />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Rechercher une ville ou un pays..."
              className="w-full px-10 sm:px-14 py-3 sm:py-4 bg-transparent text-white placeholder-white/60 focus:outline-none focus:placeholder-white/40 text-base sm:text-lg font-medium"
              aria-label="Rechercher une ville"
              autoComplete="off"
              disabled={isLoading}
              aria-expanded={showSuggestions}
              aria-haspopup="listbox"
              role="combobox"
            />

            {/* Clear button */}
            {query && !isLoading && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-24 sm:right-32 p-1 text-white/60 hover:text-white transition-colors duration-200"
                aria-label="Effacer la recherche"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="absolute right-2 sm:right-3 px-3 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50 flex items-center space-x-1 sm:space-x-2 shadow-lg"
            >
              {isLoading ? (
                <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
              ) : (
                <>
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Rechercher</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="bg-white/15 dark:bg-black/25 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden">
            {loadingSuggestions ? (
              <div className="p-3 sm:p-4 text-center text-white/70">
                <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mx-auto mb-2" />
                <span className="text-xs sm:text-sm">Recherche en cours...</span>
              </div>
            ) : suggestions.length > 0 ? (
              <ul role="listbox" className="max-h-60 sm:max-h-80 overflow-y-auto">
                {suggestions.map((suggestion, index) => {
                  const fullName = suggestion.admin1
                    ? `${suggestion.name}, ${suggestion.admin1}, ${suggestion.country}`
                    : `${suggestion.name}, ${suggestion.country}`

                  return (
                    <li key={suggestion.id} role="option" aria-selected={selectedIndex === index}>
                      <button
                        ref={el => { suggestionRefs.current[index] = el }}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-left hover:bg-white/10 dark:hover:bg-black/20 transition-colors duration-200 border-b border-white/10 last:border-b-0 ${selectedIndex === index ? 'bg-white/10 dark:bg-black/20' : ''
                          }`}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium truncate text-sm sm:text-base">
                              {suggestion.name}
                            </div>
                            <div className="text-white/60 text-xs sm:text-sm truncate">
                              {suggestion.admin1 && `${suggestion.admin1}, `}{suggestion.country}
                              <span className="ml-1 sm:ml-2 text-xs bg-white/10 px-1 sm:px-2 py-0.5 rounded-full">
                                {suggestion.country_code}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : query.length >= 2 ? (
              <div className="p-3 sm:p-4 text-center text-white/70">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 opacity-50" />
                <div className="text-xs sm:text-sm">Aucune ville trouvée</div>
                <div className="text-xs mt-1 opacity-60">Essayez avec un autre nom</div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Tip when no suggestions shown */}
      {!showSuggestions && query.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 opacity-0 group-focus-within:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl border border-white/20 p-3 text-white/80 text-sm">
            💡 Astuce : Commencez à taper pour voir les suggestions
          </div>
        </div>
      )}
    </div>
  )
}
