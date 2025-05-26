import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function ModifierUtilisateur() {
  const router = useRouter()
  const { id } = router.query

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email_contact: "",
    url_bareme: "",
    pays: "",
    ville: "",
    code_postal: "",
    adresse: "",
    siret: "",
    rsac: "",
  })

  useEffect(() => {
    if (id) fetchUtilisateur(id)
  }, [id])

  const fetchUtilisateur = async (userId) => {
    const { data, error } = await supabase.from("utilisateurs").select("*").eq("id", userId).single()
    if (data) {
      setFormData({
        nom: data.nom || "",
        prenom: data.prenom || "",
        telephone: data.telephone || "",
        email_contact: data.email_contact || "",
        url_bareme: data.url_bareme || "",
        pays: data.pays || "",
        ville: data.ville || "",
        code_postal: data.code_postal || "",
        adresse: data.adresse || "",
        siret: data.siret || "",
        rsac: data.rsac || "",
      })
    }
    if (error) console.error("Erreur utilisateur :", error)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await supabase
      .from("utilisateurs")
      .update(formData)
      .eq("id", id)

    if (error) {
      console.error("Erreur mise à jour :", error)
      alert("❌ Erreur lors de la mise à jour")
    } else {
      alert("✅ Profil mis à jour avec succès !")
      router.push("/reseau")
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow rounded-xl space-y-6">
      <h1 className="text-2xl font-bold text-orange-700">🛠 Modifier le profil de l'utilisateur</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
        <Input label="Nom" name="nom" value={formData.nom} onChange={handleChange} />
        <Input label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} />
        <Input label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} />
        <Input label="Email de contact" name="email_contact" value={formData.email_contact} onChange={handleChange} />
        <Input label="URL barème honoraires" name="url_bareme" value={formData.url_bareme} onChange={handleChange} />
        <Input label="Pays" name="pays" value={formData.pays} onChange={handleChange} />
        <Input label="Ville" name="ville" value={formData.ville} onChange={handleChange} />
        <Input label="Code postal" name="code_postal" value={formData.code_postal} onChange={handleChange} />
        <Input label="Adresse" name="adresse" value={formData.adresse} onChange={handleChange} />
        <Input label="SIRET" name="siret" value={formData.siret} onChange={handleChange} />
        <Input label="Numéro RSAC" name="rsac" value={formData.rsac} onChange={handleChange} />

        <div className="col-span-full">
          <button
            type="submit"
            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded shadow"
          >
            💾 Enregistrer
          </button>
        </div>
      </form>
    </div>
  )
}

function Input({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="font-medium mb-1">{label}</label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded px-3 py-2"
      />
    </div>
  )
}
