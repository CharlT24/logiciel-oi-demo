import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function FicheProprietaire() {
  const router = useRouter()
  const { id } = router.query
  const [proprio, setProprio] = useState(null)
  const [biens, setBiens] = useState([])

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      // Récupérer le propriétaire
      const { data: userData } = await supabase
        .from("utilisateurs")
        .select("*")
        .eq("id", id)
        .single()

      setProprio(userData)

      // Récupérer les biens dont il est propriétaire
      const { data: biensData } = await supabase
        .from("biens")
        .select("*")
        .eq("proprietaire_id", id) // ✅ IMPORTANT : utiliser la bonne colonne
      setBiens(biensData || [])
    }

    fetchData()
  }, [id])

  if (!proprio) return <p className="p-10 text-center">Chargement...</p>

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">🏡 Fiche Propriétaire</h1>

      {/* Infos perso */}
      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <p><strong>Nom :</strong> {proprio.nom}</p>
        <p><strong>Email :</strong> {proprio.email}</p>
        <p><strong>Téléphone :</strong> {proprio.telephone}</p>
        <p><strong>Rôle :</strong> {proprio.role || "N/A"}</p>
      </div>

      {/* Biens liés */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h2 className="text-lg font-semibold text-orange-700">📦 Biens associés</h2>
        {biens.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun bien lié à ce propriétaire.</p>
        ) : (
          biens.map(b => (
            <div key={b.id} className="border-b pb-2">
              <p className="font-semibold">{b.titre}</p>
              <p className="text-sm text-gray-500">Statut : {b.statut}</p>
              {b.date_fin_mandat && (
                <p className="text-sm text-gray-500">
                  Fin de mandat : {new Date(b.date_fin_mandat).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <Link href="/clients/proprietaires" className="text-sm text-orange-600 hover:underline block">
        ⬅️ Retour à la liste des propriétaires
      </Link>
    </div>
  )
}
