import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Reseau() {
  const [utilisateurs, setUtilisateurs] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [biens, setBiens] = useState([])
  const [clients, setClients] = useState([])

  useEffect(() => {
    fetchUtilisateurs()
  }, [])

  const fetchUtilisateurs = async () => {
    const { data, error } = await supabase.from("utilisateurs").select("*")
    if (error) {
      console.error("Erreur utilisateurs :", error)
    } else {
      setUtilisateurs(data)
    }
  }

  const voirDetails = async (userId) => {
    setSelectedUser(userId)

    const { data: biensData } = await supabase.from("biens").select("*").eq("agent_id", userId)
    const { data: clientsData } = await supabase.from("clients").select("*").eq("agent_id", userId)

    setBiens(biensData || [])
    setClients(clientsData || [])
  }

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">👥 Voir le réseau</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {utilisateurs.map((user) => (
          <div key={user.id} className="bg-white rounded-xl shadow p-4">
            <p className="font-semibold text-lg">{user.nom || "Utilisateur"}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 mb-2">📍 {user.ville || "Ville inconnue"}</p>
            <button
              className="text-orange-600 text-sm hover:underline"
              onClick={() => voirDetails(user.id)}
            >
              ➕ Voir ses biens & clients
            </button>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">📦 Biens et clients de l’agent sélectionné</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Biens */}
            <div>
              <h3 className="font-semibold text-orange-500 mb-2">🏡 Biens</h3>
              {biens.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun bien enregistré.</p>
              ) : (
                <ul className="text-sm space-y-1">
                  {biens.map((b) => (
                    <li key={b.id}>• {b.titre} – {b.ville} – {b.prix?.toLocaleString()} €</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Clients */}
            <div>
              <h3 className="font-semibold text-orange-500 mb-2">👤 Clients</h3>
              {clients.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun client enregistré.</p>
              ) : (
                <ul className="text-sm space-y-1">
                  {clients.map((c) => (
                    <li key={c.id}>• {c.nom} – {c.ville} – {c.budget_max?.toLocaleString()} €</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
