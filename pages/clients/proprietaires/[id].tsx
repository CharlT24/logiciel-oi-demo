import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function FicheProprietaire() {
  const router = useRouter()
  const { id } = router.query
  const [proprio, setProprio] = useState(null)
  const [biensAssocies, setBiensAssocies] = useState([])
  const [session, setSession] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      const s = await supabase.auth.getSession()
      setSession(s.data.session)

      const { data: p } = await supabase
        .from("proprietaires")
        .select("*")
        .eq("id", id)
        .single()

      setProprio(p)

      // Récupère tous les biens dont l'id correspond à bien_id du propriétaire
      const { data: biens } = await supabase
        .from("biens")
        .select("*")
        .in("id", [p.bien_id]) // si tu permets plusieurs bien_id, adapter ici

      setBiensAssocies(biens || [])
    }

    fetchData()
  }, [id])

  const supprimerProprio = async () => {
    if (!window.confirm("Supprimer ce propriétaire ?")) return
    await supabase.from("proprietaires").delete().eq("id", id)
    alert("Supprimé ✅")
    router.push("/clients/proprietaires")
  }

  const isAdmin = session?.user?.user_metadata?.role === "admin"

  if (!proprio) return <p className="p-10 text-center">Chargement...</p>

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">🏡 Fiche Propriétaire</h1>

      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <p><strong>Nom :</strong> {proprio.nom}</p>
        <p><strong>Email :</strong> {proprio.email}</p>
        <p><strong>Téléphone :</strong> {proprio.telephone}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <h2 className="text-lg font-semibold text-orange-700">📦 Biens liés</h2>
        {biensAssocies.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun bien associé.</p>
        ) : (
          biensAssocies.map(b => (
            <div key={b.id} className="border-b pb-2 mb-2">
              <p className="font-semibold">{b.titre}</p>
              <p className="text-sm text-gray-500">Statut : {b.statut}</p>
              {b.date_fin_mandat && (
                <p className="text-sm text-gray-500">
                  Fin mandat : {new Date(b.date_fin_mandat).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {isAdmin && (
        <div className="text-right">
          <button
            onClick={supprimerProprio}
            className="text-sm text-red-600 hover:underline"
          >
            ❌ Supprimer ce propriétaire
          </button>
        </div>
      )}

      <Link href="/clients/proprietaires" className="text-sm text-orange-600 hover:underline block">
        ⬅️ Retour à la liste
      </Link>
    </div>
  )
}
