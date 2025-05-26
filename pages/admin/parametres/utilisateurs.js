import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import Image from "next/image"

export default function ListeUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([])
  const [agences, setAgences] = useState([])
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    role: "agent",
    ville: "",
    telephone: "",
    agence_id: ""
  })
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

    const { data: authUser, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password
    })

    if (signUpError) {
      alert("❌ Erreur à la création du compte : " + signUpError.message)
      return
    }

    const { error: insertError } = await supabase.from("utilisateurs").insert([{
      id: authUser.user.id,
      prenom: formData.prenom,
      nom: formData.nom,
      email: formData.email,
      telephone: formData.telephone,
      ville: formData.ville,
      role: formData.role,
      agence_id: formData.agence_id || null
    }])

    if (insertError) {
      alert("⚠️ Compte créé, mais erreur d’enregistrement des infos : " + insertError.message)
      return
    }

    alert("✅ Utilisateur ajouté avec succès")
    setFormData({
      prenom: "",
      nom: "",
      email: "",
      password: "",
      role: "agent",
      ville: "",
      telephone: "",
      agence_id: ""
    })
    fetchUtilisateurs()
  }

  const getUserPhoto = (userId) => {
    if (!userId) return "/no-avatar.jpg"
    return `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/avatars/${userId}.jpg?t=${Date.now()}`
  }

  const handleExport = async (user) => {
    if (!user?.id) return alert("ID utilisateur manquant")

    const { data: freshUser, error } = await supabase
      .from("utilisateurs")
      .select("*")
      .eq("id", user.id)
      .single()

    if (error || !freshUser) {
      alert("❌ Impossible de charger les données à jour.")
      return
    }

    try {
      const res = await fetch("http://localhost/wordpress/wp-json/oi/v1/create-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: freshUser.id,
          nom: `${freshUser.prenom || ""} ${freshUser.nom}`.trim(),
          ville: freshUser.ville || "",
          telephone: freshUser.telephone || "",
          email: freshUser.email || "",
          photo_url: freshUser.avatar_url || freshUser.photo_url || ""
        })
      })

      if (!res.ok) throw new Error("Erreur d’export WordPress")
      alert("✅ Agent exporté sur WordPress")
    } catch (err) {
      console.error("Erreur export :", err)
      alert("❌ Échec de l’export")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("❌ Supprimer cet utilisateur ?")) return

    const { error } = await supabase.from("utilisateurs").delete().eq("id", id)
    if (error) alert("Erreur lors de la suppression")
    else {
      try {
        await fetch(`http://localhost/wordpress/wp-json/oi/v1/supabase-delete/${id}`, {
          method: "DELETE",
        })
      } catch (err) {
        console.warn("⚠️ Supprimé sur Supabase, mais pas sur WordPress", err)
      }

      alert("✅ Supprimé avec succès")
      fetchUtilisateurs()
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">👥 Utilisateurs</h1>

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl shadow p-6 mb-10 space-y-4">
        <h2 className="text-xl font-semibold mb-2">➕ Ajouter un utilisateur</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="prenom" value={formData.prenom} onChange={handleInputChange} placeholder="Prénom" className="border p-2 rounded w-full" required />
          <input name="nom" value={formData.nom} onChange={handleInputChange} placeholder="Nom" className="border p-2 rounded w-full" required />
          <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="border p-2 rounded w-full" required />
          <input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Mot de passe" className="border p-2 rounded w-full" required />
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
          {utilisateurs.map((user) => {
            const photoUrl = getUserPhoto(user.id)
            return (
              <div key={user.id} className="bg-white rounded-xl shadow-md p-5 border">
                <div className="flex items-center gap-4 mb-3">
                  {photoUrl ? (
                    <Image src={photoUrl} alt="avatar" width={60} height={60} className="rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl">👤</div>
                  )}
                  <div>
                    <p className="font-semibold text-lg">{user.prenom} {user.nom}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">🏢 Agence : {user.agences?.nom || "NC"}</p>
                <p className="text-sm text-gray-600 mb-1">📍 Ville : {user.ville || "NC"}</p>
                <p className="text-sm text-gray-600 mb-3">🧑‍💼 Rôle : {user.role}</p>

                <div className="flex justify-between items-center">
                  <Link href={`/admin/utilisateur/${user.id}/modifier`} className="text-sm text-orange-600 hover:underline">
                    ✏️ Modifier
                  </Link>
                  <button onClick={() => handleDelete(user.id)} className="text-sm text-red-600 hover:underline">
                    🗑️ Supprimer
                  </button>
                </div>

                <button
                  onClick={() => handleExport(user)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  🌍 Exporter WordPress
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
