import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export function VisiteCapsule({ bienId }) {
  const [visites, setVisites] = useState([])

  useEffect(() => {
    const fetchVisites = async () => {
      const { data, error } = await supabase
        .from("visites")
        .select("date_visite, commentaires, clients(nom), utilisateurs(nom)")
        .eq("bien_id", bienId)
        .order("date_visite", { ascending: false })

      if (!error) setVisites(data || [])
    }
    fetchVisites()
  }, [bienId])

  return (
    <div className="bg-white border rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-4">🗓 Dernières visites</h3>
      {visites.length === 0 ? (
        <p className="text-gray-500">Aucune visite enregistrée</p>
      ) : (
        <ul className="space-y-3">
          {visites.map((v, i) => (
            <li key={i} className="border-b pb-2">
              <p className="text-sm text-gray-700">
                👤 {v.clients?.nom || "-"} | 🧑‍💼 Agent : {v.utilisateurs?.nom || "-"}
              </p>
              <p className="text-xs text-gray-500">📅 {new Date(v.date_visite).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 mt-1">📝 {v.commentaires}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
