import { useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function AjouterAcquereur() {
  const router = useRouter()
  const [form, setForm] = useState({})
  const [motsCles, setMotsCles] = useState([])
  const [motCleInput, setMotCleInput] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const addMotCle = () => {
    const trimmed = motCleInput.trim()
    if (trimmed !== "" && !motsCles.includes(trimmed)) {
      setMotsCles([...motsCles, trimmed])
      setMotCleInput("")
    }
  }

  const removeMotCle = (index) => {
    setMotsCles(motsCles.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { nom, email, telephone, budget_min, budget_max, surface_min } = form

    if (!nom || !email || !telephone || !budget_min || !budget_max || !surface_min) {
      return alert("Tous les champs obligatoires doivent être remplis.")
    }

    const { error } = await supabase.from("clients").insert([
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
        notes: form.notes || null,
        mots_cles: motsCles,
        type: "acquereur" // assure l'identification en tant qu'acquéreur
      }
    ])

    if (error) {
      console.error(error)
      alert("Erreur lors de l'ajout ❌")
    } else {
      alert("Client acquéreur ajouté ✅")
      router.push("/clients/acquereur")
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow space-y-8">
      <h1 className="text-2xl font-bold text-orange-600">➕ Ajouter un acquéreur</h1>

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

        {/* Recherche */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">🏡 Critères de recherche</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="type_bien" value={form.type_bien || ''} onChange={handleChange} className="input" placeholder="Type de bien" />
            <input name="ville_recherche" value={form.ville_recherche || ''} onChange={handleChange} className="input" placeholder="Ville recherchée" />
            <input type="number" name="budget_min" value={form.budget_min || ''} onChange={handleChange} className="input" placeholder="Budget minimum (€)" required />
            <input type="number" name="budget_max" value={form.budget_max || ''} onChange={handleChange} className="input" placeholder="Budget maximum (€)" required />
            <input type="number" name="surface_min" value={form.surface_min || ''} onChange={handleChange} className="input" placeholder="Surface min. (m²)" required />
          </div>
        </div>

        {/* Mots-clés */}
        <div>
          <label className="block mb-1 font-medium">🔑 Mots-clés</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {motsCles.map((mot, i) => (
              <span key={i} className="bg-orange-100 px-3 py-1 rounded-full">
                {mot} <button type="button" onClick={() => removeMotCle(i)}>×</button>
              </span>
            ))}
          </div>
          <input
            type="text"
            className="input"
            placeholder="ex: Musicien, Investisseur, etc."
            value={motCleInput}
            onChange={(e) => setMotCleInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addMotCle()
              }
            }}
          />
        </div>

        {/* Infos complémentaires */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">🧠 Informations complémentaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="profil" value={form.profil || ''} onChange={handleChange} className="input" placeholder="Profil (investisseur, primo-accédant…)" />
            <input name="canal_entree" value={form.canal_entree || ''} onChange={handleChange} className="input" placeholder="Canal d'entrée (site, agence…)" />
          </div>
          <textarea name="notes" value={form.notes || ''} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 mt-4" rows={4} placeholder="Notes, remarques..." />
        </div>

        <div className="text-right">
          <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
            💾 Enregistrer
          </button>
        </div>
      </form>
    </div>
  )
}
