import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"
import AdminNavbar from "@/components/AdminNavbar"

export default function Clients() {
  const [userId, setUserId] = useState(null)
  const [clients, setClients] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndClients = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (!session) return router.push("/login")

      setUserId(session.user.id)

      const { data, error: fetchError } = await supabase
        .from("clients")
        .select("*")
        .eq("agent_id", session.user.id)

      if (fetchError) console.error("❌ Erreur chargement clients :", fetchError)
      else setClients(data || [])
    }

    fetchUserAndClients()
  }, [])

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-4 flex flex-col space-y-6 fixed h-full">
        <div className="text-2xl font-bold text-blue-600">LOGICIEL IMMO</div>
        <nav className="flex flex-col space-y-2 mt-6">
          <a href="/dashboard" className="hover:text-blue-600">🏠 Tableau de bord</a>
          <a href="/clients" className="text-blue-600 font-semibold">👥 Clients</a>
          <a href="/biens" className="hover:text-blue-600">🏡 Biens</a>
        </nav>
      </aside>

      {/* Contenu */}
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">👥 Mes clients</h1>
          <a href="/clients/ajouter" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            ➕ Ajouter un client
          </a>
        </div>

        {clients.length === 0 ? (
          <p className="text-gray-500">Aucun client pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {clients.map((client) => (
              <div key={client.id} className="bg-white rounded-xl shadow p-4 space-y-2">
                <div className="font-bold text-lg">{client.nom}</div>
                <div className="text-sm text-gray-600">📍 {client.ville_recherche}</div>
                <div className="text-sm text-gray-600">💶 Budget : {client.budget_min} € - {client.budget_max} €</div>
                <div className="text-sm text-gray-600">🏠 Type : {client.type_bien}</div>
                <div className="text-sm text-gray-600">📞 {client.telephone}</div>
                <div className="text-sm text-gray-600">📧 {client.email}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
