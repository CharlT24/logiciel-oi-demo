import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AdminParametres() {
  const [parametres, setParametres] = useState([])
  const [newPortail, setNewPortail] = useState("")

  useEffect(() => {
    const fetchParametres = async () => {
      const { data } = await supabase.from("parametres").select("*").order("cle")
      setParametres(data || [])
    }

    fetchParametres()
  }, [])

  const handleChange = (index, valeur) => {
    const updated = [...parametres]
    updated[index].valeur = valeur
    setParametres(updated)
  }

  const handleSave = async () => {
    for (const p of parametres) {
      await supabase
        .from("parametres")
        .upsert({ cle: p.cle, valeur: p.valeur })
    }
    alert("✅ Paramètres sauvegardés.")
  }

  const handleAddPortail = async () => {
    if (!newPortail) return
    await supabase.from("parametres").upsert({ cle: `portail_${newPortail}`, valeur: "1" })
    setNewPortail("")
    location.reload()
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">⚙️ Paramètres du CRM</h1>

      {parametres.map((p, i) => (
        <div key={p.cle} className="flex gap-4 items-center">
          <label className="w-1/3 text-sm font-medium">{p.cle}</label>
          <input
            type="text"
            value={p.valeur}
            onChange={(e) => handleChange(i, e.target.value)}
            className="input flex-1"
          />
        </div>
      ))}

      <button
        onClick={handleSave}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
      >
        💾 Sauvegarder
      </button>

      <div className="pt-6">
        <h2 className="text-md font-semibold text-gray-700">➕ Ajouter un portail</h2>
        <div className="flex gap-3 mt-2">
          <input
            className="input"
            placeholder="ex: bienici, seloger"
            value={newPortail}
            onChange={(e) => setNewPortail(e.target.value)}
          />
          <button
            onClick={handleAddPortail}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}