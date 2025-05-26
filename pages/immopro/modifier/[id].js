import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ModifierBienPro() {
  const router = useRouter()
  const { id } = router.query

  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({})
  const [type, setType] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from("immo_pro")
      .update({ ...form, type, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      alert("Erreur lors de la mise à jour du bien")
      console.error(error)
    } else {
      alert("Bien mis à jour avec succès")
      router.push("/immopro")
    }
  }

  useEffect(() => {
    const fetchBien = async () => {
      if (!id) return

      const { data, error } = await supabase.from("immo_pro").select("*").eq("id", id).single()
      if (error || !data) {
        alert("Bien introuvable")
        return
      }

      setForm(data)
      setType(data.type || "")
      setLoading(false)
    }

    fetchBien()
  }, [id])

  if (loading) return <p className="text-center mt-10">Chargement...</p>

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-2xl font-bold text-orange-600">✏️ Modifier le bien pro</h1>

      {/* TYPE DE BIEN */}
      <div className="space-y-2">
        <p className="font-semibold">Type de bien</p>
        <label className="block">
          <input
            type="radio"
            name="type"
            value="fonds_de_commerce"
            checked={type === "fonds_de_commerce"}
            onChange={(e) => setType(e.target.value)}
            className="mr-2"
          />
          Fonds de commerce
        </label>
        <label className="block">
          <input
            type="radio"
            name="type"
            value="locaux_commerciaux"
            checked={type === "locaux_commerciaux"}
            onChange={(e) => setType(e.target.value)}
            className="mr-2"
          />
          Locaux commerciaux
        </label>
      </div>

      {/* INFOS DU BIEN */}
      <div className="grid md:grid-cols-2 gap-4">
        <input type="text" name="surface" placeholder="Surface en m²" value={form.surface || ""} onChange={handleChange} className="input" />
        <input type="number" name="prix" placeholder="Prix HT ou net vendeur" value={form.prix || ""} onChange={handleChange} className="input" />
        <input type="text" name="ville" placeholder="Ville" value={form.ville || ""} onChange={handleChange} className="input" />
        <input type="text" name="adresse" placeholder="Adresse exacte" value={form.adresse || ""} onChange={handleChange} className="input" />
        <input type="text" name="disponibilite" placeholder="Disponibilité" value={form.disponibilite || ""} onChange={handleChange} className="input" />
        <input type="text" name="destination" placeholder="Destination" value={form.destination || ""} onChange={handleChange} className="input" />
        <input type="text" name="etat" placeholder="État" value={form.etat || ""} onChange={handleChange} className="input" />
        <input type="text" name="accessibilite" placeholder="Accessibilité" value={form.accessibilite || ""} onChange={handleChange} className="input" />
      </div>

      {/* FONDS DE COMMERCE */}
      {type === "fonds_de_commerce" && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-orange-500">Informations Fonds de commerce</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" name="activite" placeholder="Activité" value={form.activite || ""} onChange={handleChange} className="input" />
            <input type="text" name="chiffre_affaires" placeholder="CA annuel" value={form.chiffre_affaires || ""} onChange={handleChange} className="input" />
            <input type="text" name="ebe" placeholder="EBE" value={form.ebe || ""} onChange={handleChange} className="input" />
            <input type="text" name="bail" placeholder="Type de bail" value={form.bail || ""} onChange={handleChange} className="input" />
            <input type="text" name="loyer" placeholder="Loyer mensuel" value={form.loyer || ""} onChange={handleChange} className="input" />
            <input type="text" name="charges" placeholder="Charges annuelles" value={form.charges || ""} onChange={handleChange} className="input" />
          </div>
        </div>
      )}

      {/* DESCRIPTION */}
      <div>
        <h2 className="text-lg font-semibold text-orange-500">Description</h2>
        <textarea
          name="description"
          rows="5"
          placeholder="Description du bien"
          value={form.description || ""}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />
      </div>

      {/* PHOTOS */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-orange-500">📸 Photos actuelles</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded overflow-hidden">
            <img src={`/photos/covers/${id}/cover.jpg`} alt="Cover" className="w-full h-full object-cover" />
            <p className="text-xs text-center">Photo principale</p>
          </div>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="border rounded overflow-hidden">
              <img src={`/photos/gallery/${id}/${n}.jpeg`} alt={`Photo ${n}`} className="w-full h-full object-cover" />
              <p className="text-xs text-center">Photo {n}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500">Remplace les fichiers en FTP ou ajoute une interface de gestion ultérieurement.</p>
      </div>

      {/* PROPRIÉTAIRE & MANDAT */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-orange-500">👨‍💼 Propriétaire / Société</h2>
        <input type="text" name="nom_structure" placeholder="Nom structure" value={form.nom_structure || ""} onChange={handleChange} className="input" />
        <input type="text" name="numero_mandat" placeholder="N° mandat" value={form.numero_mandat || ""} onChange={handleChange} className="input" />
        <input type="date" name="date_mandat" placeholder="Date mandat" value={form.date_mandat || ""} onChange={handleChange} className="input" />
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={() => router.back()} className="text-gray-600 hover:underline">⬅️ Retour</button>
        <button type="submit" onClick={handleSubmit} className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
          💾 Enregistrer les modifications
        </button>
      </div>
    </div>
  )
}
