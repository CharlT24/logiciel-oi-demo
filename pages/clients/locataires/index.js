import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import supabase from "@/lib/supabaseClient"

export default function ListeLocataires() {
  const [locataires, setLocataires] = useState([])
  const router = useRouter()

  const fetchLocataires = async () => {
    const { data, error } = await supabase
      .from("locataires")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) console.error("Erreur chargement locataires :", error)
    else setLocataires(data)
  }

  useEffect(() => {
    fetchLocataires()
  }, [])

  const supprimerLocataire = async (id) => {
    const confirmDelete = confirm("❌ Supprimer ce locataire ?")
    if (!confirmDelete) return

    const { error } = await supabase.from("locataires").delete().eq("id", id)
    if (error) {
      console.error("Erreur suppression :", error)
      alert("Une erreur est survenue lors de la suppression.")
    } else {
      setLocataires(locataires.filter((loc) => loc.id !== id))
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 space-y-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-sm text-orange-600 hover:underline"
      >
        ← Retour
      </button>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-600">📄 Dossiers des locataires</h1>
        <Link href="/clients/locataires/ajouter" className="bg-orange-600 text-white px-4 py-2 rounded shadow hover:bg-orange-700">
          ➕ Ajouter un locataire
        </Link>
      </div>

      {locataires.length === 0 ? (
        <p className="text-gray-600">Aucun locataire enregistré.</p>
      ) : (
        <div className="grid gap-4">
          {locataires.map((loc) => (
            <div
              key={loc.id}
              className="flex justify-between items-center bg-white border rounded-lg shadow p-4 hover:bg-orange-50 transition"
            >
              <Link href={`/clients/locataires/${loc.id}`} className="flex-1">
                <h2 className="font-bold text-lg">{loc.prenom} {loc.nom}</h2>
                <p className="text-sm text-gray-600">📧 {loc.email} — 📞 {loc.telephone}</p>
              </Link>
              <button
                onClick={() => supprimerLocataire(loc.id)}
                className="ml-4 text-sm text-red-600 hover:underline"
              >
                🗑️ Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
