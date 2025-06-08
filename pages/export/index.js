// pages/export/index.js
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"
import { getSettings } from "@/utils/getSettings"

export default function ExportPage() {
  const [biens, setBiens] = useState([])
  const [portails, setPortails] = useState([])
  const [userId, setUserId] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      const uid = session?.user?.id
      setUserId(uid)

      const { data: user } = await supabase.from("utilisateurs").select("role").eq("id", uid).single()
      const admin = user?.role === "admin"
      setIsAdmin(admin)

      const { data: biensData } = await supabase
        .from("biens")
        .select("*")

      const filteredBiens = admin ? biensData : biensData.filter((b) => b.agent_id === uid)
      setBiens(filteredBiens || [])

      const settings = await getSettings()
const actifs = ["ubiflow", "seloger"];


      setPortails(actifs)
    }

    fetchData()
  }, [])

  const toggleExport = async (bienId, portail, value) => {
    const bien = biens.find((b) => b.id === bienId)
    const current = bien.exports || {}
    const updated = { ...current, [portail]: value }

    await supabase.from("biens").update({ exports: updated }).eq("id", bienId)
    setBiens(biens.map((b) => (b.id === bienId ? { ...b, exports: updated } : b)))

    if (value) {
      try {
        await fetch(`/api/export/${portail}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`
          },
          body: JSON.stringify({ biens: [bienId] })
        })
      } catch (err) {
        alert(`❌ Erreur export ${portail} : ${err.message}`)
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">📤 Export vers portails</h1>

      {portails.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun portail activé dans les paramètres.</p>
      ) : (
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Titre</th>
              <th className="p-2 border">Ville</th>
              {portails.map((p) => (
                <th key={p} className="p-2 border text-xs capitalize">{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {biens.map((b) => (
              <tr key={b.id} className="border-t hover:bg-orange-50 transition">
                <td className="p-2 border font-medium">{b.titre}</td>
                <td className="p-2 border">{b.ville}</td>
                {portails.map((p) => {
                  const key = `${b.id}_${p}`
                  const checked = b.exports?.[p] || false
                  return (
                    <td key={key} className="p-2 text-center border">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => toggleExport(b.id, p, e.target.checked)}
                        className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
