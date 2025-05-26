// pages/immopro/ajouter/confirmation.js
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Confirmation() {
  const router = useRouter()
  const infos = router.query

  useEffect(() => {
    document.title = "Étape 5 – Confirmation"
  }, [])

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">🔒 Étape 5 : Confirmation</h1>
      <p className="text-gray-600">
        Voici un récapitulatif des données que vous venez de saisir pour l'immobilier pro.
      </p>

      <div className="bg-white rounded-xl shadow p-6 space-y-2 border text-sm">
        {Object.entries(infos).map(([key, value]) => (
          <div key={key} className="flex justify-between border-b py-1">
            <span className="font-medium text-gray-500">{key.replace(/_/g, " ")}</span>
            <span className="text-gray-800">{value}</span>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Cette page est statique pour l'instant. Tu peux ajouter l'envoi en base de données ou vers Supabase ici.
      </p>
    </div>
  )
}
