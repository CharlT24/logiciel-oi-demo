// pages/reseau/[slug].js
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import Image from "next/image"

export default function FicheAgent() {
  const router = useRouter()
  const { slug } = router.query

  const [agent, setAgent] = useState(null)
  const [clients, setClients] = useState([])
  const [biens, setBiens] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    const fetchData = async () => {
      setLoading(true)

      const { data: agentData, error } = await supabase
        .from("utilisateurs")
        .select("*")
        .eq("slug", slug)
        .single()

      if (error || !agentData) {
        setAgent(null)
        setLoading(false)
        return
      }

      setAgent(agentData)

      const { data: clientsData } = await supabase
        .from("clients")
        .select("*")
        .eq("agent_id", agentData.id)

      const { data: biensData } = await supabase
        .from("biens")
        .select("*")
        .eq("agent_id", agentData.id)

      setClients(clientsData || [])
      setBiens(biensData || [])
      setLoading(false)
    }

    fetchData()
  }, [slug])

  if (loading) return <p className="text-gray-600 p-8">Chargement de l’agent...</p>
  if (!agent) return <p className="text-red-500 p-8">Agent introuvable</p>

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-700">👤 {agent.nom}</h1>
        <Link href="/reseau" className="text-sm text-orange-600 hover:underline">⬅️ Retour au réseau</Link>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 flex gap-6 items-start">
        {/* Photo */}
        <div>
          {agent.avatar_url ? (
            <Image
              src={agent.avatar_url}
              alt="Avatar"
              width={100}
              height={100}
              className="rounded-full border"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              👤
            </div>
          )}
        </div>

        {/* Infos agent */}
        <div className="flex-1 space-y-2">
          <p><span className="font-semibold">📧 Email :</span> {agent.email}</p>
          <p><span className="font-semibold">📍 Ville :</span> {agent.ville || "Non précisée"}</p>
          <p><span className="font-semibold">📱 Téléphone :</span> {agent.telephone || "—"}</p>
          <p><span className="font-semibold">🏢 Agence :</span> {agent.agence || "—"}</p>
          <p><span className="font-semibold">🧑‍💼 Rôle :</span> {agent.role || "agent"}</p>
        </div>
      </div>

      {/* Données */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Clients */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">👥 Ses clients ({clients.length})</h2>
          {clients.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun client enregistré</p>
          ) : (
            <ul className="space-y-2 text-sm text-gray-700">
              {clients.map((client) => (
                <li key={client.id}>
                  🔹 <strong>{client.nom}</strong> — {client.ville_recherche} ({client.budget_min}€ à {client.budget_max}€)
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Biens */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">🏡 Ses biens ({biens.length})</h2>
          {biens.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun bien enregistré</p>
          ) : (
            <ul className="space-y-2 text-sm text-gray-700">
              {biens.map((bien) => (
                <li key={bien.id}>
                  📍 <strong>{bien.titre}</strong> à {bien.ville} — {bien.prix?.toLocaleString()} €
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
