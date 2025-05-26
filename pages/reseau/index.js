// pages/reseau/index.js
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import Image from "next/image"

export default function Reseau() {
  const [utilisateurs, setUtilisateurs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchUtilisateurs()
  }, [])

  const fetchUtilisateurs = async () => {
    const { data, error } = await supabase.from("utilisateurs").select("*")
    if (error) console.error("Erreur chargement utilisateurs :", error)
    else {
      setUtilisateurs(data)
      setFiltered(data)
    }
  }

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase()
    setSearch(val)
    setFiltered(
      utilisateurs.filter(
        (u) =>
          u.nom?.toLowerCase().includes(val) ||
          u.ville?.toLowerCase().includes(val)
      )
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-orange-600">🌐 Mon réseau</h1>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="🔍 Recherche agent ou ville..."
          className="border px-3 py-2 rounded-md text-sm shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.length === 0 && (
          <p className="text-sm text-gray-500">Aucun agent trouvé.</p>
        )}
        {filtered.map((agent) => (
          <div
            key={agent.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center border"
          >
            <Image
              src={agent.photo_url || "/avatar.png"}
              alt={agent.nom}
              width={80}
              height={80}
              className="rounded-full shadow mb-3"
            />
            <p className="font-semibold text-gray-800">{agent.nom}</p>
            <p className="text-sm text-gray-500">{agent.email}</p>
            <p className="text-sm text-gray-400">📍 {agent.ville || "Ville inconnue"}</p>

            <Link
              href={`/reseau/${agent.slug}`}
              className="mt-3 text-sm text-orange-600 hover:underline"
            >
              🔍 Voir sa fiche
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
