// pages/admin/export-logs.tsx
import { useEffect, useState } from "react"

export default function ExportLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("/api/export/logs")
      const json = await res.json()
      setLogs(json.logs || [])
      setLoading(false)
    }
    fetchLogs()
  }, [])

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">📜 Historique des exports</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">Aucun export enregistré pour le moment.</p>
      ) : (
        <table className="w-full text-sm border mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Portail</th>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Nombre de biens</th>
              <th className="text-left px-4 py-2">Utilisateur</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2 font-medium text-orange-600">{log.portail}</td>
                <td className="px-4 py-2">{new Date(log.created_at).toLocaleString()}</td>
                <td className="px-4 py-2">{log.nb_biens}</td>
                <td className="px-4 py-2">{log.user_email || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
          {status && <p className="text-green-700 font-medium mt-4">{status}</p>}

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">🕒 Derniers exports enregistrés</h2>
        <ExportLogTable />
      </div>
    </div>
  )
}

function ExportLogTable() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/export/logs")
      .then(res => res.json())
      .then(json => {
        setLogs(json.logs || [])
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Chargement...</p>
  if (!logs.length) return <p className="text-sm text-gray-500">Aucun export enregistré pour le moment.</p>

  return (
    <div className="border rounded bg-gray-50">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-3 py-2 text-left">Portail</th>
            <th className="px-3 py-2 text-left">Date</th>
            <th className="px-3 py-2 text-left">Biens</th>
            <th className="px-3 py-2 text-left">Utilisateur</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log: any, i: number) => (
            <tr key={i} className="border-t">
              <td className="px-3 py-2 font-semibold text-orange-600">{log.portail}</td>
              <td className="px-3 py-2">{new Date(log.created_at).toLocaleString()}</td>
              <td className="px-3 py-2">{log.nb_biens}</td>
              <td className="px-3 py-2">{log.user_email || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
