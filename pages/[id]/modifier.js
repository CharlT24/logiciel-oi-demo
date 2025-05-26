import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ModifierBien() {
  const router = useRouter()
  const { id } = router.query
  const [form, setForm] = useState({
    titre: "",
    ville: "",
    prix: "",
    surface_m2: "",
    dpe: "",
    description: "",
    honoraires: "",
    disponible: true,
    sous_compromis: false,
    vendu: false,
    export_leboncoin: false,
    export_seloger: false,
  })
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    if (!id) return
    const fetchBien = async () => {
      const { data } = await supabase.from("biens").select("*").eq("id", id).single()
      if (data) {
        setForm(data)
        const { data: img } = supabase.storage
          .from("photos-biens")
          .getPublicUrl(`${data.id}/main.jpg`)
        setImageUrl(img?.publicUrl || "")
      }
    }
    fetchBien()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
  }

  const handleImageUpload = async (file) => {
    const fileName = `${id}/main.jpg`
    const { error } = await supabase.storage
      .from("photos-biens")
      .upload(fileName, file, { upsert: true })

    if (!error) {
      const { data } = supabase.storage
        .from("photos-biens")
        .getPublicUrl(fileName)
      setImageUrl(data?.publicUrl)
    }
  }

  const generateDescription = async () => {
    const prompt = `Rédige une description immobilière pour un bien à ${form.ville}, type "${form.titre}", ${form.surface_m2} m², DPE ${form.dpe}, au prix de ${form.prix} €.`
    const response = await fetch("/api/generate-description", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })
    const data = await response.json()
    if (data.text) {
      setForm((prev) => ({ ...prev, description: data.text }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from("biens")
      .update({
        ...form,
        prix: Number(form.prix),
        surface_m2: Number(form.surface_m2),
        honoraires: Number(form.honoraires),
      })
      .eq("id", id)

    if (error) {
      alert("❌ Erreur mise à jour")
      console.error(error)
    } else {
      const file = document.querySelector("#photo-upload")?.files?.[0]
      if (file) await handleImageUpload(file)
      alert("✅ Bien modifié")
      router.push("/biens")
    }
  }

  if (!form.titre) return <div className="p-8">Chargement...</div>

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded shadow mt-8 space-y-4">
      <h1 className="text-2xl font-bold">✏️ Modifier un bien</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="titre" value={form.titre} onChange={handleChange} placeholder="Titre" className="w-full p-2 border rounded" />
        <input name="ville" value={form.ville} onChange={handleChange} placeholder="Ville" className="w-full p-2 border rounded" />
        <input type="number" name="prix" value={form.prix} onChange={handleChange} placeholder="Prix (€)" className="w-full p-2 border rounded" />
        <input type="number" name="surface_m2" value={form.surface_m2} onChange={handleChange} placeholder="Surface (m²)" className="w-full p-2 border rounded" />
        <input name="dpe" value={form.dpe} onChange={handleChange} placeholder="DPE" className="w-full p-2 border rounded" />
        <input type="number" name="honoraires" value={form.honoraires} onChange={handleChange} placeholder="Honoraires (€)" className="w-full p-2 border rounded" />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description complète"
          rows="4"
          className="w-full p-2 border rounded"
        />
        <button
          type="button"
          onClick={generateDescription}
          className="bg-gray-200 text-sm px-2 py-1 rounded hover:bg-gray-300"
        >
          ✨ Générer automatiquement
        </button>

        {imageUrl && <img src={imageUrl} alt="Photo" className="w-full rounded shadow" />}
        <input id="photo-upload" type="file" accept="image/*" className="block mt-2" />

        <div className="flex flex-col gap-2">
          <label><input type="checkbox" name="disponible" checked={form.disponible} onChange={handleChange} /> Disponible</label>
          <label><input type="checkbox" name="sous_compromis" checked={form.sous_compromis} onChange={handleChange} /> Sous compromis</label>
          <label><input type="checkbox" name="vendu" checked={form.vendu} onChange={handleChange} /> Vendu</label>
        </div>

        <div className="border-t pt-4 mt-4">
          <p className="font-semibold mb-2">🌐 Export :</p>
          <label><input type="checkbox" name="export_leboncoin" checked={form.export_leboncoin} onChange={handleChange} /> LeBonCoin</label><br />
          <label><input type="checkbox" name="export_seloger" checked={form.export_seloger} onChange={handleChange} /> SeLoger</label>
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">💾 Enregistrer</button>
      </form>
    </div>
  )
}
