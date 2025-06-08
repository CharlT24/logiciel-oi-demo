import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"
import Link from "next/link"
import { useRouter } from "next/router"

export default function ListeProprietaires() {
  const [proprietaires, setProprietaires] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const uid = sessionData?.session?.user?.id
      setUserId(uid)

      if (uid) {
        const { data: user } = await supabase
          .from("utilisateurs")
          .select("role")
          .eq("id", uid)
          .single()

        if (user?.role === "admin") {
          setIsAdmin(true)
        }
      }
    }

    const fetchProprietaires = async () => {
      const { data, error } = await supabase
        .from("proprietaires")
        .select("*")

      if (error) {
        console.error("Erreur Supabase:", error)
      } else {
        setProprietaires(data)
      }

      setLoading(false)
    }

    fetchSession()
    fetchProprietaires()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce propriétaire ?")) return

    const { error } = await supabase
      .from("proprietaires")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Erreur lors de la suppression")
      console.error(error)
    } else {
      setProprietaires((prev) => prev.filter((p) => p.id !== id))
    }
  }

  if (loading) return <p className="p-10 text-center">Chargement...</p>

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">

      {/* Bouton retour */}
      <button
        type="button"
        onClick={() => router.back()}
        className="text-sm text-orange-600 hover:underline"
      >
        ← Retour
      </button>

      <h1 className="text-3xl font-bold text-orange-600">📋 Liste des propriétaires</h1>

      {proprietaires.length === 0 ? (
        <p className="text-gray-500 mt-10">Aucun propriétaire trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {proprietaires.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow space-y-2 relative">
              <h2 className="text-lg font-semibold text-gray-800">{p.nom}</h2>
              <p className="text-sm text-gray-500">{p.email}</p>
              <p className="text-sm text-gray-500">{p.telephone}</p>
              <Link
                href={`/clients/proprietaires/${p.id}`}
                className="text-orange-600 hover:underline text-sm"
              >
                Voir la fiche
              </Link>

              {isAdmin && (
                <button
                  onClick={() => handleDelete(p.id)}
                  className="absolute top-3 right-3 text-red-600 hover:text-red-800 text-sm"
                >
                  🗑
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
