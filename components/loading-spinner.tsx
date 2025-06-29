export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Main spinner */}
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-white/20 border-t-white"></div>
        <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-2 border-white/40"></div>
      </div>

      {/* Text with gradient */}
      <div className="text-center space-y-2">
        <p className="text-xl font-semibold">
          <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            Chargement de la météo...
          </span>
        </p>
        <p className="text-white/70 text-sm">
          Récupération des données en cours
        </p>
      </div>

      {/* Floating dots animation */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  )
}
