import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Rapprochements() {
  const [clients, setClients] = useState([])
  const [biens, setBiens] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: allClients } = await supabase.from("clients").select("*")
      const { data: allBiens } = await supabase.from("biens").select("*").eq("disponible", true)
      setClients(allClients || [])
      setBiens(allBiens || [])
    }
    fetchData()
  }, [])

  const filtrerBiensCompatibles = (client) => {
    return biens.filter(
      (bien) =>
        bien.ville?.toLowerCase().trim() === client.ville?.toLowerCase().trim() &&
        bien.prix <= client.budget_max
    )
  }

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🔍 Rapprochements Clients ↔ Biens</h1>

      {clients.map((client) => {
        const correspondances = filtrerBiensCompatibles(client)

        return (
          <div key={client.id} className="bg-white shadow rounded-xl p-4 mb-6">
            <h2 className="text-lg font-semibold text-orange-600 mb-2">
              👤 {client.nom} — {client.ville} — Budget max : {client.budget_max.toLocaleString()} €
            </h2>

            {correspondances.length === 0 ? (
              <p className="text-sm text-gray-500">❌ Aucun bien correspondant</p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {correspondances.map((bien) => (
                  <li key={bien.id} className="border p-3 rounded-lg bg-gray-50">
                    <p className="font-semibold">{bien.titre}</p>
                    <p className="text-sm text-gray-600">📍 {bien.ville}</p>
                    <p className="text-sm text-gray-600">
                      💰 {bien.prix.toLocaleString()} € — {bien.surface_m2} m²
                    </p>
                    <p className="text-sm text-gray-500">🔋 DPE : {bien.dpe}</p>
                    <p className="text-xs text-gray-400 mt-2">Agent ID : {bien.agent_id}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
