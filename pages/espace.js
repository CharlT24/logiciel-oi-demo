import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"
import AdminNavbar from "../components/AdminNavbar"

export default function Espace() {
  const [biens, setBiens] = useState([])
  const [clients, setClients] = useState([])
  const [showAllBiens, setShowAllBiens] = useState(true) // DEBUG : afficher tout
  const [showAllClients, setShowAllClients] = useState(false)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error || !session) {
        console.warn("⚠️ Pas de session active")
        return
      }

      const uid = session.user.id
      setUserId(uid)
      console.log("📌 Agent connecté :", uid)

      let biensQuery = supabase.from("biens").select("*")
      let clientsQuery = supabase.from("clients").select("*")

      if (!showAllBiens) biensQuery = biensQuery.eq("agent_id", uid)
      if (!showAllClients) clientsQuery = clientsQuery.eq("agent_id", uid)

      const { data: biensData, error: biensError } = await biensQuery
      const { data: clientsData, error: clientsError } = await clientsQuery

      if (biensError) console.error("❌ Erreur biens :", biensError)
      if (clientsError) console.error("❌ Erreur clients :", clientsError)

      console.log("📦 Biens récupérés :", biensData)
      setBiens(biensData || [])
      setClients(clientsData || [])
    }

    fetchData()
  }, [showAllBiens, showAllClients])

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
      <AdminNavbar />
      <h1 className="text-3xl font-semibold mb-6 text-center">🏡 Espace Agent (Debug)</h1>

      {/* BIENS */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">📦 Biens</h2>
          <div>
            <button onClick={() => setShowAllBiens(false)} className={`px-3 py-1 rounded ${!showAllBiens ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Mes biens</button>
            <button onClick={() => setShowAllBiens(true)} className={`ml-2 px-3 py-1 rounded ${showAllBiens ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Tous les biens</button>
          </div>
        </div>
        {biens.length === 0 ? (
          <p className="text-gray-500">Aucun bien à afficher.</p>
        ) : (
          <ul className="space-y-3">
            {biens.map((b) => (
              <li key={b.id} className="bg-white p-4 rounded shadow border">
                <div className="font-bold text-lg">{b.titre}</div>
                <div className="text-sm">🏠 Ville : {b.ville}</div>
                <div className="text-sm">📏 Surface : {b.surface_m2} m²</div>
                <div className="text-sm">💶 Prix : {b.prix} €</div>
                <div className="text-sm">🔋 DPE : {b.dpe}</div>
                <div className="text-sm">🔑 Agent ID : {b.agent_id}</div>
                <div className="text-sm">✅ Disponible : {String(b.disponible)}</div>
                <div className="text-xs text-gray-400">📅 Créé le : {b.created_at}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CLIENTS */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">👥 Clients</h2>
          <div>
            <button onClick={() => setShowAllClients(false)} className={`px-3 py-1 rounded ${!showAllClients ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Mes clients</button>
            <button onClick={() => setShowAllClients(true)} className={`ml-2 px-3 py-1 rounded ${showAllClients ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Tous les clients</button>
          </div>
        </div>
        <ul className="space-y-3">
          {clients.map((c) => (
            <li key={c.id} className="bg-white p-4 rounded shadow border">
              <div className="font-semibold">{c.nom}</div>
              <div className="text-sm">📍 Ville : {c.ville_recherche}</div>
              <div className="text-sm">💶 Budget : {c.budget_min} € - {c.budget_max} €</div>
              <div className="text-sm">🔑 Agent ID : {c.agent_id}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
