import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Acquereurs() {
  const [clients, setClients] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState("")
  const [userId, setUserId] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const uid = sessionData?.session?.user?.id
      setUserId(uid)

      if (uid) {
        const { data: userData } = await supabase
          .from("utilisateurs")
          .select("role")
          .eq("id", uid)
          .single()

        if (userData?.role === "admin") {
          setIsAdmin(true)
        }
      }

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error && data) {
        setClients(data)
        setFiltered(data)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const term = search.toLowerCase()
    const results = clients.filter(c => {
      const nomMatch = c.nom?.toLowerCase().includes(term)
      const motsClesMatch = (c.mots_cles || []).some(m => m.toLowerCase().includes(term))
      return nomMatch || motsClesMatch
    })
    setFiltered(results)
  }, [search, clients])

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet acquéreur ?")) return
    const { error } = await supabase.from("clients").delete().eq("id", id)
    if (!error) setClients(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-6 py-10">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-sm text-orange-600 hover:underline mb-2"
      >
        ← Retour
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-orange-600">👥 Acquéreurs</h1>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔎 Rechercher (nom, mot-clé...)"
          className="border px-3 py-2 rounded-md text-sm w-full md:w-80"
        />

        <Link href="/clients/acquereurs/ajouter">
          <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm">
            ➕ Ajouter un acquéreur
          </button>
        </Link>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">Aucun acquéreur trouvé.</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((client) => (
            <div key={client.id} className="bg-white rounded-xl shadow p-5 border relative space-y-2">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-bold text-gray-800">{client.nom}</h2>
                <div className="flex gap-2">
                  {(isAdmin || userId === client.created_by) && (
                    <button
                      onClick={() => router.push(`/clients/acquereurs/modifier/${client.id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      📝
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600">📍 {client.ville_recherche || "Ville non précisée"}</p>
              <p className="text-sm text-gray-600">💰 Budget : {client.budget_min || 0} € → {client.budget_max || "Max"} €</p>
              <p className="text-sm text-gray-600">🏡 Recherche : {client.type_bien || "Non spécifié"}</p>

              {client.mots_cles?.length > 0 && (
                <div className="flex flex-wrap gap-1 text-xs text-orange-600">
                  {client.mots_cles.map((m, i) => (
                    <span key={i} className="bg-orange-100 px-2 py-0.5 rounded-full">{m}</span>
                  ))}
                </div>
              )}

              <Link
                href={`/clients/acquereurs/${client.id}`}
                className="text-sm text-blue-600 hover:underline block mt-2"
              >
                Voir la fiche ➜
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
