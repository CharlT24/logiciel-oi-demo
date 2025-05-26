import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ModifierUtilisateur() {
  const router = useRouter()
  const { id } = router.query
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (id) {
      fetchUser()
    }
  }, [id])

  const fetchUser = async () => {
    const { data, error } = await supabase.from("utilisateurs").select("*").eq("id", id).single()
    if (error) {
      console.error("Erreur chargement utilisateur", error)
    } else {
      setUserData(data)
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from("utilisateurs")
      .update({
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        role: userData.role,
        ville: userData.ville,
        agence: userData.agence,
      })
      .eq("id", id)

    if (error) {
      alert("Erreur lors de la mise à jour")
    } else {
      setSuccess(true)
      setTimeout(() => router.push("/admin/utilisateur"), 1000)
    }
  }

  if (loading) return <p className="p-6">Chargement...</p>
  if (!userData) return <p className="p-6 text-red-500">Utilisateur introuvable.</p>

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">✏️ Modifier un utilisateur</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nom" value={userData.nom || ""} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Nom" />
        <input name="prenom" value={userData.prenom || ""} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Prénom" />
        <input name="email" value={userData.email || ""} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Email" />
        <input name="ville" value={userData.ville || ""} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Ville" />
        <input name="agence" value={userData.agence || ""} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Agence" />

        <select name="role" value={userData.role || ""} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
          💾 Enregistrer
        </button>
      </form>

      {success && <p className="text-green-600">✅ Modifications enregistrées !</p>}
    </div>
  )
}
