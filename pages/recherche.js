// pages/recherche.js
import { useEffect } from "react"

export default function RechercheGoogle() {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://cse.google.com/cse.js?cx=008de3bdf3e704239"
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="p-10 bg-white min-h-screen space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">🔍 Recherche Google</h1>
      <p className="text-gray-600">
        Utilisez le moteur personnalisé pour rechercher des biens sur Google (LeBonCoin, SeLoger, Bien’ici...).
      </p>
      <div className="gcse-search"></div>
    </div>
  )
}
