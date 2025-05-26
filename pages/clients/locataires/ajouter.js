import { useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function AjouterLocataire() {
  const router = useRouter()
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    justificatif_identite: "",
    justificatif_domicile: "",
    justificatif_revenus: "",
    contrat_travail: "",
    dernier_avertissement_loyer: "",
    autres_documents: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpload = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return

    const filePath = `temp/${field}-${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from("documents-locataires").upload(filePath, file)

    if (error) {
      console.error("Erreur upload :", error)
      return
    }

    const publicUrl = supabase.storage.from("documents-locataires").getPublicUrl(filePath).data.publicUrl
    setForm((prev) => ({ ...prev, [field]: publicUrl }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from("locataires").insert(form)

    if (error) {
      console.error("❌ Erreur Supabase:", error)
      alert("Erreur lors de l'ajout du locataire")
    } else {
      alert("✅ Locataire ajouté avec succès")
      router.push("/clients/locataires")
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">➕ Ajouter un locataire</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input label="Nom" name="nom" value={form.nom} onChange={handleChange} />
        <Input label="Prénom" name="prenom" value={form.prenom} onChange={handleChange} />
        <Input label="Téléphone" name="telephone" value={form.telephone} onChange={handleChange} />
        <Input label="Email" name="email" value={form.email} onChange={handleChange} />

        <div className="space-y-4">
          <label className="block text-sm font-medium">Justificatif d'identité</label>
          <input type="file" onChange={(e) => handleUpload(e, "justificatif_identite")} />

          <label className="block text-sm font-medium">Justificatif de domicile</label>
          <input type="file" onChange={(e) => handleUpload(e, "justificatif_domicile")} />

          <label className="block text-sm font-medium">Justificatif de revenus</label>
          <input type="file" onChange={(e) => handleUpload(e, "justificatif_revenus")} />

          <label className="block text-sm font-medium">Contrat de travail</label>
          <input type="file" onChange={(e) => handleUpload(e, "contrat_travail")} />

          <label className="block text-sm font-medium">Dernier avertissement de loyer</label>
          <input type="file" onChange={(e) => handleUpload(e, "dernier_avertissement_loyer")} />

          <label className="block text-sm font-medium">Autres documents</label>
          <input type="file" onChange={(e) => handleUpload(e, "autres_documents")} />
        </div>

        <button type="submit" className="bg-orange-600 text-white px-6 py-3 rounded hover:bg-orange-700">
          ✅ Enregistrer
        </button>
      </form>
    </div>
  )
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
  )
}
