// pages/biens/ajouter.js
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function AjouterBienAccueil() {
  const router = useRouter()

  useEffect(() => {
    // Si un brouillon existe, on peut le reprendre
    const draft = localStorage.getItem("ajoutBien")
    if (draft) {
      console.log("🔄 Brouillon trouvé : bien en cours d'ajout")
    }
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-orange-600">➕ Ajouter un nouveau bien</h1>

      <p className="text-gray-600">
        Suivez les étapes pour créer un bien complet dans votre base. Vous pouvez enregistrer votre progression à chaque étape.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <EtapeCard numero={1} titre="🏡 Informations principales" description="Titre, ville, type de bien, surface, etc." />
        <EtapeCard numero={2} titre="📍 Localisation" description="Adresse précise, géolocalisation, étage, etc." />
        <EtapeCard numero={3} titre="🛏️ Détails & prestations" description="Nombre de pièces, équipements, DPE..." />
        <EtapeCard numero={4} titre="📷 Média & photos" description="Ajoutez une photo principale et galerie." />
        <EtapeCard numero={5} titre="✅ Finalisation" description="Disponibilité, honoraires, publication." />
      </div>

      <div className="mt-10">
        <button
          onClick={() => router.push("/biens")}
          className="text-sm text-orange-600 hover:underline"
        >
          ⬅️ Retour aux biens
        </button>
      </div>
    </div>
  )
}

function EtapeCard({ numero, titre, description }) {
  return (
    <Link
      href={`/biens/ajouter/etape${numero}`}
      className="bg-white border border-orange-100 rounded-xl p-6 shadow-sm hover:shadow-md transition block"
    >
      <h2 className="text-lg font-semibold text-orange-700 mb-2">Étape {numero}</h2>
      <p className="text-md font-medium mb-1">{titre}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  )
}
