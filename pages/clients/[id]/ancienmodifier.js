// pages/clients/acquereurs/modifier.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function ModifierClient() {
  const router = useRouter()
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)

  const rawId = router.query.id
  const id = rawId ? parseInt(rawId.toString().split(":").pop()) : null

  useEffect(() => {
    if (!id) return
    const fetchClient = async () => {
      const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()
      if (!error) setForm(data)
      setLoading(false)
    }
    fetchClient()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await supabase.from("clients").update({
      ...form,
      budget_min: parseInt(form.budget_min),
      budget_max: parseInt(form.budget_max),
      surface_min: parseInt(form.surface_min),
    }).eq("id", id)

    if (error) {
      alert("Erreur lors de la modification ❌")
      console.error(error)
    } else {
      alert("Client modifié ✅")
      router.push("/clients/acquereurs")
    }
  }

  if (loading) return <p className="text-center mt-10">Chargement…</p>

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow space-y-8">
      <h1 className="text-2xl font-bold text-orange-600">✏️ Modifier l’acquéreur</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identité */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="nom" value={form.nom || ''} onChange={handleChange} className="input" placeholder="Nom complet *" required />
          <input name="email" value={form.email || ''} onChange={handleChange} className="input" placeholder="Email *" required />
          <input name="telephone" value={form.telephone || ''} onChange={handleChange} className="input" placeholder="Téléphone *" required />
        </div>

        {/* Recherche */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="type_bien" value={form.type_bien || ''} onChange={handleChange} className="input" placeholder="Type de bien" />
          <input name="ville_recherche" value={form.ville_recherche || ''} onChange={handleChange} className="input" placeholder="Ville recherchée" />
          <input type="number" name="budget_min" value={form.budget_min || ''} onChange={handleChange} className="input" placeholder="Budget minimum (€)" />
          <input type="number" name="budget_max" value={form.budget_max || ''} onChange={handleChange} className="input" placeholder="Budget maximum (€)" />
          <input type="number" name="surface_min" value={form.surface_min || ''} onChange={handleChange} className="input" placeholder="Surface minimale (m²)" />
        </div>

        {/* Infos complémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="profil" value={form.profil || ''} onChange={handleChange} className="input" placeholder="Profil" />
          <input name="canal_entree" value={form.canal_entree || ''} onChange={handleChange} className="input" placeholder="Canal d'entrée" />
        </div>
        <textarea name="notes" value={form.notes || ''} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 mt-4" rows={4} placeholder="Notes..." />

        <div className="text-right">
          <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">💾 Enregistrer</button>
        </div>
      </form>
    </div>
  )
}
