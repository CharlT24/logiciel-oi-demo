import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"
import Link from "next/link"

export default function FicheAcquereur() {
  const router = useRouter()
  const { id } = router.query
  const [client, setClient] = useState(null)
  const [visites, setVisites] = useState([])
  const [session, setSession] = useState(null)

  useEffect(() => {
    const fetchSession = async () => {
      const s = await supabase.auth.getSession()
      setSession(s.data.session)
    }

    const fetchData = async () => {
      if (!id) return

      const { data: c } = await supabase.from("clients").select("*").eq("id", id).single()
      setClient(c)

      const { data: v } = await supabase
        .from("visites")
        .select("date_visite, biens(titre)")
        .eq("client_id", id)
        .order("date_visite", { ascending: false })

      setVisites(v || [])
    }

    fetchSession()
    fetchData()
  }, [id])

  const supprimerClient = async () => {
    if (!window.confirm("Supprimer définitivement cet acquéreur ?")) return
    await supabase.from("clients").delete().eq("id", id)
    alert("Client supprimé ✅")
    router.push("/clients/acquereur")
  }

  if (!client) return <p className="text-center mt-10">Chargement...</p>

  const isAdmin = session?.user?.user_metadata?.role === "admin"

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">👤 Fiche Acquéreur</h1>

      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <p><strong>Nom :</strong> {client.nom}</p>
        <p><strong>Email :</strong> {client.email}</p>
        <p><strong>Téléphone :</strong> {client.telephone}</p>
        <p><strong>Ville recherchée :</strong> {client.ville_recherche}</p>
        <p><strong>Budget :</strong> {client.budget_min} € – {client.budget_max} €</p>
        <p><strong>Surface min :</strong> {client.surface_min} m²</p>
        {client.mots_cles && client.mots_cles.length > 0 && (
          <div>
            <p><strong>Mots-clés :</strong></p>
            <div className="flex flex-wrap gap-2 mt-1">
              {client.mots_cles.map((mot, i) => (
                <span key={i} className="bg-orange-100 px-3 py-1 rounded-full text-sm">
                  {mot}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <h2 className="text-lg font-semibold text-orange-700 mb-2">📍 Visites enregistrées</h2>
        {visites.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune visite encore enregistrée.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {visites.map((v, i) => (
              <li key={i}>
                {v.biens?.titre || "Bien inconnu"} — {new Date(v.date_visite).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      {isAdmin && (
        <div className="text-right">
          <button
            onClick={supprimerClient}
            className="text-sm text-red-600 hover:underline"
          >
            ❌ Supprimer cet acquéreur
          </button>
        </div>
      )}

      <Link href="/clients/acquereur" className="text-sm text-orange-600 hover:underline block">
        ⬅️ Retour à la liste
      </Link>
    </div>
  )
}
