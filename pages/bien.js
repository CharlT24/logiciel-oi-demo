import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"

export default function Biens() {
  const [userId, setUserId] = useState(null)
  const [biens, setBiens] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndBiens = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push("/login")

      const uid = session.user.id
      setUserId(uid)
      console.log("✅ Agent connecté :", uid)

      const { data, error: fetchError } = await supabase
        .from("biens")
        .select("*") // ← PAS DE .eq pour debug total

      if (fetchError) {
        console.error("❌ Erreur chargement biens :", fetchError)
      } else {
        console.log("📦 Biens récupérés :", data)
        setBiens(data || [])
      }

      setLoading(false)
    }

    fetchUserAndBiens()
  }, [])

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-4 flex flex-col space-y-6 fixed h-full">
        <div className="text-2xl font-bold text-blue-600">LOGICIEL IMMO</div>
        <nav className="flex flex-col space-y-2 mt-6">
          <a href="/dashboard" className="hover:text-blue-600">🏠 Tableau de bord</a>
          <a href="/clients" className="hover:text-blue-600">👥 Clients</a>
          <a href="/biens" className="text-blue-600 font-semibold">🏡 Biens</a>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 ml-64 p-8">
        <div className="mb-4 text-sm text-gray-500">🧠 Mon ID : <strong>{userId}</strong></div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🏡 Tous les biens (debug)</h1>
          <a href="/biens/ajouter" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            ➕ Ajouter un bien
          </a>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : biens.length === 0 ? (
          <p className="text-gray-500">Aucun bien trouvé.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {biens.map((bien) => {
              const isMine = bien.agent_id === userId
              return (
                <div key={bien.id} className={`bg-white rounded-xl shadow p-4 space-y-2 ${isMine ? 'border-l-4 border-green-500' : 'border-l-4 border-yellow-400'}`}>
                  <div className="font-bold text-lg">{bien.titre}</div>
                  <div className="text-sm text-gray-600">📍 {bien.ville}</div>
                  <div className="text-sm text-gray-600">📏 {bien.surface_m2} m²</div>
                  <div className="text-sm text-gray-600">💰 {bien.prix?.toLocaleString()} €</div>
                  <div className="text-sm text-gray-600">🔋 DPE : {bien.dpe}</div>
                  <div className="text-sm text-gray-600">🟢 Statut : {bien.disponible ? "Disponible" : "Indisponible"}</div>
                  <div className="text-xs text-gray-400 italic">agent_id: {bien.agent_id}</div>
                  <div className={`text-xs font-bold ${isMine ? 'text-green-600' : 'text-yellow-600'}`}>
                    {isMine ? "✅ C'est ton bien" : "⚠️ Pas à toi"}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
