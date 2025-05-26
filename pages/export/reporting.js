// pages/export/reporting.js
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

const PORTAILS = [
  { nom: "Bien'ici", slug: "bienici", logo: "/logos/bienici.png" },
  { nom: "SeLoger", slug: "seloger", logo: "/logos/seloger.png" },
  { nom: "Le Bon Coin", slug: "leboncoin", logo: "/logos/leboncoin.png" },
  { nom: "Green Acres", slug: "greenacres", logo: "/logos/greenacres.png" },
  { nom: "Figaro Immo", slug: "figaro", logo: "/logos/figaro.png" },
  { nom: "Immo Gratuit", slug: "immogratuit", logo: "/logos/immogratuit.png" }
]

export default function ReportingExport() {
  const [reporting, setReporting] = useState([])

  useEffect(() => {
    const fetchExportLogs = async () => {
      const { data, error } = await supabase
        .from("export_logs")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error && data) setReporting(data)
    }

    fetchExportLogs()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold text-orange-600">📤 Reporting d’export</h1>

      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-orange-50 text-gray-700 text-left">
          <tr>
            <th className="p-3">Portail</th>
            <th className="p-3">Type</th>
            <th className="p-3">Biens exportés</th>
            <th className="p-3">Dernier envoi</th>
          </tr>
        </thead>
        <tbody>
          {PORTAILS.map((p) => {
            const lastLog = reporting.find(r => r.portail === p.slug)

            return (
              <tr key={p.slug} className="border-t border-gray-200">
                <td className="p-3 flex items-center gap-3">
                  <img src={p.logo} alt={p.nom} className="w-8 h-8" />
                  <span className="font-semibold">{p.nom}</span>
                </td>
                <td className="p-3">Automatique</td>
                <td className="p-3">{lastLog?.nb_biens || 0}</td>
                <td className="p-3 text-gray-500">
                  {lastLog?.created_at
                    ? new Date(lastLog.created_at).toLocaleString()
                    : "Aucun envoi"}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
