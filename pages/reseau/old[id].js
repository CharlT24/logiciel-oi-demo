// pages/reseau/[id].js
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"
import Link from "next/link"

export default function FicheAgent() {
  const router = useRouter()
  const { id } = router.query

  const [agent, setAgent] = useState(null)
  const [clients, setClients] = useState([])
  const [biens, setBiens] = useState([])

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      const { data: agentData } = await supabase.from("utilisateurs").select("*").eq("id", id).single()
      setAgent(agentData)

      const { data: biensData } = await supabase.from("biens").select("*").eq("agent_id", id)
      setBiens(biensData || [])

      const { data: clientsData } = await supabase.from("clients").select("*").eq("agent_id", id)
      setClients(clientsData || [])
    }
    fetchData()
  }, [id])

  if (!agent) return <p className="text-gray-600 p-8">Chargement de l’agent...</p>

  return (
    <div className="space-y-10 max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-orange-600">👤 Fiche Agent</h1>
        <Link href="/reseau" className="text-sm text-orange-600 hover:underline">⬅️ Retour au réseau</Link>
      </div>

      {/* Carte agent */}
      <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 flex flex-col items-center justify-center bg-orange-50 md:w-1/3">
          <Image
            src={agent.photo_url || "/avatar.png"}
            alt="Photo de l’agent"
            width={100}
            height={100}
            className="rounded-full shadow"
          />
          <h2 className="text-lg font-bold mt-4">{agent.nom || "Nom inconnu"}</h2>
          <p className="text-sm text-gray-500">{agent.email}</p>
          <p className="text-sm text-gray-500">{agent.telephone}</p>
          <p className="text-sm text-gray-500">📍 {agent.ville}</p>
        </div>

        <div className="p-6 flex-1 space-y-3">
          <p><span className="font-semibold">Entreprise :</span> {agent.entreprise || "N/A"}</p>
          <p><span className="font-semibold">Secteur :</span> {agent.secteur || "Non spécifié"}</p>
          <p><span className="font-semibold">Rôle :</span> {agent.role}</p>
          <p><span className="font-semibold">Statut :</span> {agent.statut}</p>
          <p className="text-sm text-gray-600 mt-2">{agent.description}</p>
        </div>
      </div>

      {/* Biens et clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold text-orange-700 mb-2">🏡 Biens ({biens.length})</h3>
          {biens.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun bien pour cet agent.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {biens.map((b) => (
                <li key={b.id}>• {b.titre} – {b.ville} – {b.prix?.toLocaleString()} €</li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold text-orange-700 mb-2">👥 Clients ({clients.length})</h3>
          {clients.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun client pour cet agent.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {clients.map((c) => (
                <li key={c.id}>• {c.nom} – {c.ville_recherche} – {c.budget_max?.toLocaleString()} €</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
