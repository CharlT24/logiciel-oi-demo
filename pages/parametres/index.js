import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function Parametres() {
  const [sessionUserId, setSessionUserId] = useState(null)
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
    photo_url: "",
  })

  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const session = await supabase.auth.getSession()
      const userId = session?.data?.session?.user?.id
      if (!userId) return router.push("/login")
      setSessionUserId(userId)
      fetchInfos(userId)
    }
    getUser()
  }, [])

  const fetchInfos = async (userId) => {
    const { data, error } = await supabase.from("utilisateurs").select("*").eq("id", userId).single()
    if (!error && data) {
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
        photo_url: data.photo_url || "",
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !sessionUserId) return

    const ext = file.name.split(".").pop()
    const filename = `${sessionUserId}.${ext}`
    const path = `avatars/${filename}`

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(path, file, { upsert: true })

    if (uploadError) {
      console.error("❌ Erreur upload Supabase :", uploadError)
      return alert("Erreur lors de l'upload de la photo.")
    }

    const { data: publicUrlData } = supabase
      .storage
      .from("photos")
      .getPublicUrl(path)

    const publicUrl = publicUrlData?.publicUrl

    const { error: updateError } = await supabase
      .from("utilisateurs")
      .update({ photo_url: publicUrl })
      .eq("id", sessionUserId)

    if (updateError) {
      console.error("❌ Erreur mise à jour Supabase :", updateError)
      return alert("Photo uploadée mais non enregistrée.")
    }

    setFormData((prev) => ({ ...prev, photo_url: publicUrl }))
    alert("✅ Photo mise à jour avec succès !")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from("utilisateurs").update(formData).eq("id", sessionUserId)

    if (error) {
      console.error("❌ Erreur mise à jour :", error)
      alert("Erreur lors de la mise à jour.")
    } else {
      alert("✅ Profil mis à jour avec succès")
      router.push("/dashboard")
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-xl p-8 mt-8 space-y-8">
      <h1 className="text-2xl font-bold text-orange-700">⚙️ Paramètres du compte</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        {formData.photo_url ? (
          <img src={formData.photo_url} alt="avatar" className="w-20 h-20 rounded-full object-cover border" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-lg border">?</div>
        )}
        <div>
          <label className="block mb-1 font-medium text-sm">Photo de profil</label>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-sm" />
        </div>
      </div>

      {/* Formulaire */}
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

        <div className="col-span-full text-right">
          <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded shadow">
            💾 Enregistrer mes modifications
          </button>
        </div>
      </form>
    </div>
  )
}

function Input({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 font-medium">{label}</label>
      <input id={name} name={name} value={value} onChange={onChange} className="border border-gray-300 rounded px-3 py-2" />
    </div>
  )
}
