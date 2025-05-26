import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export function VisiteHistorique() {
  const [visites, setVisites] = useState([])
  const [agentFilter, setAgentFilter] = useState("")
  const [dateMin, setDateMin] = useState("")

  useEffect(() => {
    const fetchVisites = async () => {
      let query = supabase.from("visites").select("*, biens(titre), clients(nom), utilisateurs(nom)")
      if (agentFilter) query = query.eq("agent_id", agentFilter)
      if (dateMin) query = query.gte("date_visite", dateMin)
      const { data, error } = await query.order("date_visite", { ascending: false })
      if (!error) setVisites(data || [])
    }
    fetchVisites()
  }, [agentFilter, dateMin])

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">📚 Historique des visites</h2>
      <div className="flex gap-4 mb-4">
        <input type="date" value={dateMin} onChange={(e) => setDateMin(e.target.value)} className="border rounded px-2 py-1" />
        <input type="text" placeholder="ID agent (UUID)" value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)} className="border rounded px-2 py-1" />
      </div>
      <ul className="space-y-3">
        {visites.map((v, i) => (
          <li key={i} className="border-b pb-2">
            <p className="text-sm text-gray-700">
              🏡 {v.biens?.titre} | 👤 {v.clients?.nom || "-"} | Agent : {v.utilisateurs?.nom || "-"}
            </p>
            <p className="text-xs text-gray-500">📅 {new Date(v.date_visite).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600 mt-1">📝 {v.commentaires}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
