import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function VisiteForm({ bienId }) {
  const [clients, setClients] = useState([])
  const [form, setForm] = useState({ client_id: "", commentaires: "" })

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase.from("clients").select("id, nom")
      setClients(data || [])
    }
    fetchClients()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const session = await supabase.auth.getSession()
    const agentId = session.data.session.user.id

    const { error } = await supabase.from("visites").insert([
      {
        bien_id: bienId,
        client_id: form.client_id,
        commentaires: form.commentaires,
        agent_id: agentId
      }
    ])

    if (error) return alert("Erreur lors de l'enregistrement ❌")

    await supabase.rpc("notifier_proprietaire_apres_visite", {
      bien_id_input: bienId
    })

    alert("Visite enregistrée ✅ Mail envoyé au propriétaire")
    setForm({ client_id: "", commentaires: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        name="client_id"
        value={form.client_id}
        onChange={(e) => setForm({ ...form, client_id: e.target.value })}
        className="w-full border rounded px-4 py-2"
        required
      >
        <option value="">-- Sélectionner un acquéreur --</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>{c.nom}</option>
        ))}
      </select>

      <textarea
        placeholder="Commentaires (compte rendu de visite)"
        className="w-full border rounded px-4 py-2"
        rows={4}
        value={form.commentaires}
        onChange={(e) => setForm({ ...form, commentaires: e.target.value })}
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Enregistrer la visite
      </button>
    </form>
  )
}
