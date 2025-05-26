// pages/admin/agents/ajouter.js
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"

export default function AjouterAgent() {
  const [formData, setFormData] = useState({
    email: "",
    nom: "",
    ville: "",
    role: "agent",
    actif: true,
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase
      .from("utilisateurs")
      .insert([formData])
      .select()
      .single()

    setLoading(false)

    if (error) {
      console.error("Erreur :", error)
      alert("❌ Erreur lors de la création de l’agent.")
    } else {
      // ✅ Envoi des données vers WordPress
      await fetch("http://localhost/wordpress/wp-json/oi/v1/create-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.id,
          nom: data.nom,
          ville: data.ville,
          telephone: data.telephone,
          email: data.email_contact,
          photo_url: data.photo_url,
        }),
      })

      alert("✅ Agent ajouté avec succès !")
      router.push("/admin/utilisateurs")
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-orange-600">➕ Ajouter un agent</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 space-y-4 border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ville</label>
            <input
              type="text"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rôle</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
            >
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="actif"
            checked={formData.actif}
            onChange={handleChange}
            className="rounded"
          />
          <label className="text-sm text-gray-700">Actif</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
        >
          {loading ? "En cours..." : "Créer l’agent"}
        </button>
      </form>
    </div>
  )
}
