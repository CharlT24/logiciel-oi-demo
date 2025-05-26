import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function ModifierAcquereur() {
  const router = useRouter()
  const { id } = router.query

  const [formData, setFormData] = useState({
    nom: "",
    ville_recherche: "",
    budget_min: "",
    budget_max: "",
    type_bien: ""
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchClient = async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.error("Erreur chargement acquéreur:", error)
      } else {
        setFormData({
          nom: data.nom || "",
          ville_recherche: data.ville_recherche || "",
          budget_min: data.budget_min || "",
          budget_max: data.budget_max || "",
          type_bien: data.type_bien || ""
        })
      }
      setLoading(false)
    }

    fetchClient()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!id) return

    const { error } = await supabase
      .from("clients")
      .update(formData)
      .eq("id", id)

    if (error) {
      alert("Erreur lors de la mise à jour")
      console.error(error)
    } else {
      alert("✅ Acquéreur mis à jour avec succès")
      router.push("/clients/acquereurs")
    }
  }

  if (loading) return <p className="text-center py-10 text-gray-500">Chargement...</p>

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">✏️ Modifier Acquéreur</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Nom complet"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="ville_recherche"
          value={formData.ville_recherche}
          onChange={handleChange}
          placeholder="Ville recherchée"
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="budget_min"
          value={formData.budget_min}
          onChange={handleChange}
          placeholder="Budget minimum"
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="budget_max"
          value={formData.budget_max}
          onChange={handleChange}
          placeholder="Budget maximum"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="type_bien"
          value={formData.type_bien}
          onChange={handleChange}
          placeholder="Type de bien"
          className="border p-2 rounded w-full"
        />

        <div className="flex justify-between mt-6">
          <Link href="/clients/acquereurs" className="text-sm text-orange-600 hover:underline">
            ⬅️ Retour
          </Link>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
          >
            ✅ Enregistrer
          </button>
        </div>
      </form>
    </div>
  )
}
