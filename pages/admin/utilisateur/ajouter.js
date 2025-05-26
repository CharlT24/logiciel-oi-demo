// pages/admin/utilisateurs/ajouter.js
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"

export default function AjouterUtilisateur() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    role: "agent",
    ville: "",
    telephone: "",
    agence: "",
    description: "",
  })

  const [photo, setPhoto] = useState(null)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 🔄 Upload photo si présente
    let photo_url = null
    if (photo) {
      const fileName = `${Date.now()}-${photo.name}`
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, photo)

      if (error) {
        console.error("Erreur upload image :", error)
        return
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName)
      photo_url = urlData.publicUrl
    }

    // ✅ Insert dans la table
    const { error } = await supabase.from("utilisateurs").insert([
      {
        ...formData,
        photo_url,
        role: formData.role,
      },
    ])

    if (error) {
      console.error("❌ Erreur Supabase :", error)
    } else {
      alert("✅ Utilisateur ajouté avec succès !")
      router.push("/admin/utilisateurs")
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 bg-white shadow-md rounded-xl p-8">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">➕ Ajouter un utilisateur</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NOM */}
        <input
          type="text"
          name="nom"
          placeholder="Nom complet"
          className="w-full border p-2 rounded"
          value={formData.nom}
          onChange={handleChange}
          required
        />

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* ROLE */}
        <select
          name="role"
          className="w-full border p-2 rounded"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>

        {/* VILLE */}
        <input
          type="text"
          name="ville"
          placeholder="Ville"
          className="w-full border p-2 rounded"
          value={formData.ville}
          onChange={handleChange}
        />

        {/* TELEPHONE */}
        <input
          type="text"
          name="telephone"
          placeholder="Téléphone"
          className="w-full border p-2 rounded"
          value={formData.telephone}
          onChange={handleChange}
        />

        {/* AGENCE */}
        <input
          type="text"
          name="agence"
          placeholder="Nom de l’agence"
          className="w-full border p-2 rounded"
          value={formData.agence}
          onChange={handleChange}
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Présentation ou bio"
          className="w-full border p-2 rounded"
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />

        {/* PHOTO */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">📸 Photo de profil</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* BOUTON */}
        <button
          type="submit"
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition"
        >
          Enregistrer
        </button>
      </form>
    </div>
  )
}
