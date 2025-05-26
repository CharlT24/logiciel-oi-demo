import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"
import { useSession } from "@supabase/auth-helpers-react"
import Link from "next/link"

export default function FicheClient() {
  const router = useRouter()
  const { id } = router.query
  const session = useSession()

  const [client, setClient] = useState(null)

  useEffect(() => {
    if (id) {
      fetchClient()
    }
  }, [id])

  const fetchClient = async () => {
    const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()
    if (error) {
      console.error("Erreur chargement client", error)
    } else {
      setClient(data)
    }
  }

  const handleDelete = async () => {
    const confirmed = confirm("❗️Confirmer la suppression de ce client ?")
    if (!confirmed) return

    const { error } = await supabase.from("clients").delete().eq("id", client.id)
    if (error) {
      alert("Erreur lors de la suppression ❌")
      console.error(error)
    } else {
      alert("Client supprimé ✅")
      router.push("/clients")
    }
  }

  if (!client) return <p className="text-center mt-10">Chargement...</p>

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl space-y-6">
      <h1 className="text-3xl font-semibold text-gray-900">👤 {client.nom}</h1>

      <div className="space-y-4 text-gray-800">
        <div className="flex justify-between items-center">
          <p><strong>Email :</strong> {client.email}</p>
          <p><strong>Téléphone :</strong> {client.telephone}</p>
        </div>
        <div className="flex justify-between items-center">
          <p><strong>Type de bien :</strong> {client.type_bien}</p>
          <p><strong>Ville :</strong> {client.ville_recherche}</p>
        </div>
        <div className="flex justify-between items-center">
          <p><strong>Budget :</strong> {client.budget_min} € → {client.budget_max} €</p>
          <p><strong>Surface minimum :</strong> {client.surface_min} m²</p>
        </div>
        <p><strong>Profil :</strong> {client.profil}</p>
        <p><strong>Canal d'entrée :</strong> {client.canal_entree}</p>
        <p><strong>Notes :</strong> {client.notes}</p>
      </div>

      <div className="flex items-center gap-6 pt-6 border-t mt-8">
        <Link href={`/clients/${client.id}/modifier`} className="text-blue-600 hover:underline text-lg">
          ✏️ Modifier
        </Link>

        {(session?.user.id === client.agent_id || session?.user.user_metadata.role === "admin") && (
          <button onClick={handleDelete} className="text-red-600 hover:underline text-lg">
            🗑 Supprimer
          </button>
        )}
      </div>
    </div>
  )
}
