import { useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function AjouterClient() {
  const router = useRouter()
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { nom, email, telephone, budget_min, budget_max, surface_min } = form

    // Vérification
    if (!nom || !email || !telephone || !budget_min || !budget_max || !surface_min) {
      alert("Tous les champs marqués * sont requis.")
      setLoading(false)
      return
    }

    // Insertion du client
    const { error: insertError } = await supabase.from("clients").insert([
      {
        nom,
        email,
        telephone,
        type_bien: form.type_bien || null,
        ville_recherche: form.ville_recherche || null,
        budget_min: parseInt(budget_min),
        budget_max: parseInt(budget_max),
        surface_min: parseInt(surface_min),
        profil: form.profil || null,
        canal_entree: form.canal_entree || null,
        notes: form.notes || null
      }
    ])

    if (insertError) {
      console.error("Erreur insertion :", insertError)
      alert("Erreur lors de l'ajout du client ❌")
      setLoading(false)
      return
    }

    // Recalcul des rapprochements
    const { error: rpcError } = await supabase.rpc("recalcul_rapprochements")
    if (rpcError) {
      console.warn("Client créé mais recalcul non effectué :", rpcError)
    }

    alert("Client ajouté ✅")
    router.push("/clients")
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow space-y-8">
      <h1 className="text-2xl font-bold text-orange-600">➕ Ajouter un client</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identité */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">📇 Identité</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="nom" value={form.nom || ''} onChange={handleChange} className="input" placeholder="Nom complet *" required />
            <input name="email" value={form.email || ''} onChange={handleChange} className="input" placeholder="Email *" required />
            <input name="telephone" value={form.telephone || ''} onChange={handleChange} className="input" placeholder="Téléphone *" required />
          </div>
        </div>

        {/* Critères de recherche */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">🏡 Recherche</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="type_bien" value={form.type_bien || ''} onChange={handleChange} className="input" placeholder="Type de bien recherché" />
            <input name="ville_recherche" value={form.ville_recherche || ''} onChange={handleChange} className="input" placeholder="Ville recherchée" />
            <input type="number" name="budget_min" value={form.budget_min || ''} onChange={handleChange} className="input" placeholder="Budget minimum (€)" required />
            <input type="number" name="budget_max" value={form.budget_max || ''} onChange={handleChange} className="input" placeholder="Budget maximum (€)" required />
            <input type="number" name="surface_min" value={form.surface_min || ''} onChange={handleChange} className="input" placeholder="Surface minimale (m²)" required />
          </div>
        </div>

        {/* Infos complémentaires */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">🧠 Infos complémentaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="profil" value={form.profil || ''} onChange={handleChange} className="input" placeholder="Profil (investisseur, primo-accédant, etc.)" />
            <input name="canal_entree" value={form.canal_entree || ''} onChange={handleChange} className="input" placeholder="Canal d'entrée (site, téléphone, agence...)" />
          </div>
          <textarea name="notes" value={form.notes || ''} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 mt-4" rows={4} placeholder="Notes, remarques..." />
        </div>

        <div className="text-right">
          <button type="submit" disabled={loading} className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
            {loading ? "Enregistrement..." : "💾 Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  )
}
