import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"

export default function AdminCRM() {
  const [params, setParams] = useState(null)
  const [newType, setNewType] = useState("")
  const [types, setTypes] = useState([])
  const [newTable, setNewTable] = useState("")
  const [newColumn, setNewColumn] = useState({ table: "", name: "", type: "text" })

  useEffect(() => {
    const fetchParams = async () => {
      const { data, error } = await supabase.from("parametres_crm").select("*").single()
      if (!error && data) {
        setParams(data)
      } else {
        await supabase.from("parametres_crm").insert({
          nom_agence: "Mon Agence",
          message_accueil: "Bienvenue sur votre espace professionnel.",
          couleur_primaire: "#f97316",
          types_biens: ["Maison", "Appartement", "Terrain"]
        })
        fetchParams()
      }
    }

    const fetchTypes = async () => {
      const { data } = await supabase.from("types_biens").select("*").order("nom")
      setTypes(data || [])
    }

    fetchParams()
    fetchTypes()
  }, [])

  const handleChange = (field, value) => {
    setParams((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddType = () => {
    if (newType && !params.types_biens.includes(newType)) {
      setParams((prev) => ({
        ...prev,
        types_biens: [...prev.types_biens, newType]
      }))
      setNewType("")
    }
  }

  const handleDeleteType = (type) => {
    setParams((prev) => ({
      ...prev,
      types_biens: prev.types_biens.filter((t) => t !== type)
    }))
  }

  const handleSave = async () => {
    const { error } = await supabase.from("parametres_crm").update(params).eq("id", params.id)
    if (!error) {
      alert("✅ Paramètres enregistrés")
    } else {
      alert("❌ Erreur lors de l’enregistrement")
    }
  }

  const handleInsertType = async () => {
    if (!newType) return
    const { error } = await supabase.from("types_biens").insert({ nom: newType })
    if (!error) {
      setNewType("")
      const { data } = await supabase.from("types_biens").select("*").order("nom")
      setTypes(data || [])
    } else {
      alert("Erreur : " + error.message)
    }
  }

  const handleDeleteTypeSupabase = async (id) => {
    await supabase.from("types_biens").delete().eq("id", id)
    const { data } = await supabase.from("types_biens").select("*").order("nom")
    setTypes(data || [])
  }

  const handleCreateTable = async () => {
    if (!newTable) return
    const { error } = await supabase.rpc("execute_sql", {
      sql: `CREATE TABLE IF NOT EXISTS ${newTable} (id uuid PRIMARY KEY DEFAULT gen_random_uuid())`
    })
    if (!error) {
      alert("✅ Table créée")
      setNewTable("")
    } else {
      alert("❌ Erreur création : " + error.message)
    }
  }

  const handleAddColumn = async () => {
    const { table, name, type } = newColumn
    if (!table || !name || !type) return
    const { error } = await supabase.rpc("execute_sql", {
      sql: `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${name} ${type}`
    })
    if (!error) {
      alert("✅ Colonne ajoutée")
      setNewColumn({ table: "", name: "", type: "text" })
    } else {
      alert("❌ Erreur colonne : " + error.message)
    }
  }

  if (!params) return <p className="p-10 text-center">Chargement...</p>

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10 text-gray-800">
      <h1 className="text-3xl font-bold text-orange-600">⚙️ Paramètres CRM</h1>

      <div>
        <label className="block font-medium mb-1">🏢 Nom de l’agence</label>
        <input
          value={params.nom_agence}
          onChange={(e) => handleChange("nom_agence", e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">💬 Message d’accueil</label>
        <textarea
          value={params.message_accueil}
          onChange={(e) => handleChange("message_accueil", e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">🎨 Couleur principale</label>
        <input
          type="color"
          value={params.couleur_primaire}
          onChange={(e) => handleChange("couleur_primaire", e.target.value)}
          className="h-10 w-24 border rounded"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">🏷️ Types de biens (config)</label>
        <div className="flex gap-2 mb-2">
          <input
            placeholder="Ajouter un type"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <button onClick={handleAddType} className="bg-orange-500 text-white px-4 rounded hover:bg-orange-600">
            Ajouter
          </button>
        </div>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          {params.types_biens.map((type, idx) => (
            <li key={idx} className="flex justify-between items-center">
              {type}
              <button onClick={() => handleDeleteType(type)} className="text-red-500 hover:underline text-xs">
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4">
        <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          💾 Enregistrer les modifications
        </button>
      </div>

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">📦 Types de biens (base Supabase)</h2>
        <div className="flex gap-2 mb-4">
          <input
            placeholder="Type de bien"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <button onClick={handleInsertType} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">
            Ajouter
          </button>
        </div>
        <ul className="list-disc ml-6 text-sm">
          {types.map((t) => (
            <li key={t.id} className="flex justify-between items-center">
              {t.nom}
              <button onClick={() => handleDeleteTypeSupabase(t.id)} className="text-red-500 text-xs hover:underline">
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">📂 Administration Supabase</h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">🆕 Créer une table</label>
          <div className="flex gap-2">
            <input
              value={newTable}
              onChange={(e) => setNewTable(e.target.value)}
              placeholder="Nom de la nouvelle table"
              className="flex-1 border p-2 rounded"
            />
            <button onClick={handleCreateTable} className="bg-purple-600 text-white px-4 rounded hover:bg-purple-700">
              Créer
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">📑 Ajouter une colonne</label>
          <div className="grid grid-cols-3 gap-2">
            <input
              placeholder="Table cible"
              value={newColumn.table}
              onChange={(e) => setNewColumn({ ...newColumn, table: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              placeholder="Nom de colonne"
              value={newColumn.name}
              onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              placeholder="Type SQL"
              value={newColumn.type}
              onChange={(e) => setNewColumn({ ...newColumn, type: e.target.value })}
              className="border p-2 rounded"
            />
          </div>
          <button onClick={handleAddColumn} className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Ajouter la colonne
          </button>
        </div>
      </div>
    </div>
  )
}
