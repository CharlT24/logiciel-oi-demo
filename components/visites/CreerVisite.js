import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { useRouter } from "next/router"

export default function CreerVisite() {
  const [clients, setClients] = useState([])
  const [biens, setBiens] = useState([])
  const [form, setForm] = useState({ client_id: "", bien_id: "", date_visite: "" })
  const [message, setMessage] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: clientsData } = await supabase.from("clients").select("id, nom")
      const { data: biensData } = await supabase.from("biens").select("id, titre")
      setClients(clientsData || [])
      setBiens(biensData || [])
    }
    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    const { error } = await supabase.from("visites").insert([
      {
        client_id: form.client_id,
        bien_id: form.bien_id,
        date_visite: form.date_visite || new Date().toISOString().split("T")[0],
      }
    ])

    if (error) {
      setMessage("Erreur lors de la création de la visite ❌")
      console.error(error)
    } else {
      setMessage("Visite enregistrée ✅")
      setTimeout(() => router.push("/dashboard"), 1000)
    }
  }

  const handleDownload = () => {
    if (!form.client_id || !form.bien_id) {
      alert("Veuillez choisir un acquéreur et un bien")
      return
    }
    const url = `/documents/bon-de-visite?client_id=${form.client_id}&bien_id=${form.bien_id}`
    window.open(url, "_blank")
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-xl font-bold text-orange-600">📝 Créer une visite</h2>

      {message && <p className="text-sm text-center text-green-600 font-medium">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select name="client_id" value={form.client_id} onChange={handleChange} className="input" required>
            <option value="">-- Choisir un acquéreur --</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.nom}</option>
            ))}
          </select>

          <select name="bien_id" value={form.bien_id} onChange={handleChange} className="input" required>
            <option value="">-- Choisir un bien --</option>
            {biens.map((bien) => (
              <option key={bien.id} value={bien.id}>{bien.titre}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            name="date_visite"
            value={form.date_visite}
            onChange={handleChange}
            className="input"
            placeholder="Date de la visite"
          />
        </div>

        <div className="flex justify-between items-center pt-4">
          <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
            💾 Enregistrer la visite
          </button>
          <button type="button" onClick={handleDownload} className="text-sm text-orange-600 hover:underline">
            📄 Télécharger bon de visite
          </button>
        </div>
      </form>

      <div className="text-right space-y-2">
        <Link href="/dashboard">
          <span className="text-sm text-orange-500 hover:underline">⬅ Retour au tableau de bord</span>
        </Link>
        <Link href="/visites/nouvelle">
          <span className="text-sm text-blue-600 hover:underline">➕ Nouvelle visite depuis le tableau de bord</span>
        </Link>
      </div>
    </div>
  )
}