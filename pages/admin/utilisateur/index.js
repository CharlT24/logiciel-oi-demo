import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import Image from "next/image"

export default function ListeUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([])
  const [agences, setAgences] = useState([])
  const [formData, setFormData] = useState({ nom: "", email: "", role: "agent", ville: "", telephone: "", agence_id: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUtilisateurs()
    fetchAgences()
  }, [])

  const fetchUtilisateurs = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("utilisateurs")
      .select("*, agences(nom)")
      .order("created_at", { ascending: false })

    if (!error) setUtilisateurs(data)
    setLoading(false)
  }

  const fetchAgences = async () => {
    const { data, error } = await supabase.from("agences").select("id, nom")
    if (!error) setAgences(data)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from("utilisateurs").insert([formData])
    if (error) alert("❌ Erreur lors de l'ajout")
    else {
      alert("✅ Utilisateur ajouté avec succès")
      setFormData({ nom: "", email: "", role: "agent", ville: "", telephone: "", agence_id: "" })
      fetchUtilisateurs()
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">👥 Utilisateurs</h1>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} className="bg-white border rounded-xl shadow p-6 mb-10 space-y-4">
        <h2 className="text-xl font-semibold mb-2">➕ Ajouter un utilisateur</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="nom" value={formData.nom} onChange={handleInputChange} placeholder="Nom complet" className="border p-2 rounded w-full" required />
          <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="border p-2 rounded w-full" required />
          <input name="ville" value={formData.ville} onChange={handleInputChange} placeholder="Ville" className="border p-2 rounded w-full" />
          <input name="telephone" value={formData.telephone} onChange={handleInputChange} placeholder="Téléphone" className="border p-2 rounded w-full" />
          <select name="role" value={formData.role} onChange={handleInputChange} className="border p-2 rounded w-full">
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
          <select name="agence_id" value={formData.agence_id} onChange={handleInputChange} className="border p-2 rounded w-full">
            <option value="">Aucune agence</option>
            {agences.map((a) => (
              <option key={a.id} value={a.id}>{a.nom}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">Enregistrer</button>
      </form>

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {utilisateurs.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-md p-5 border">
              <div className="flex items-center gap-4 mb-3">
                {user.avatar_url ? (
                  <Image src={user.avatar_url} alt="avatar" width={40} height={40} className="rounded-full" />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">👤</div>
                )}
                <div>
                  <p className="font-semibold text-lg">{user.prenom} {user.nom}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">🏢 Agence : {user.agences?.nom || "NC"}</p>
              <p className="text-sm text-gray-600 mb-1">📍 Ville : {user.ville || "NC"}</p>
              <p className="text-sm text-gray-600 mb-3">🧑‍💼 Rôle : {user.role}</p>
              <Link href={`/admin/utilisateur/${user.id}/modifier`} className="text-sm text-orange-600 hover:underline">
                ✏️ Modifier
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
