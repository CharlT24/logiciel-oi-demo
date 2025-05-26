import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Statistiques() {
  const [stats, setStats] = useState({
    total: 0,
    dispo: 0,
    compromis: 0,
    vendu: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: biens } = await supabase
        .from("biens")
        .select("*")
        .eq("agent_id", session.user.id)

      const dispo = biens.filter(b => b.disponible && !b.vendu && !b.sous_compromis).length
      const compromis = biens.filter(b => b.sous_compromis).length
      const vendu = biens.filter(b => b.vendu).length

      setStats({
        total: biens.length,
        dispo,
        compromis,
        vendu
      })
    }

    fetchStats()
  }, [])

  const chartData = {
    labels: ["Disponibles", "Sous compromis", "Vendus"],
    datasets: [
      {
        label: "Répartition des biens",
        data: [stats.dispo, stats.compromis, stats.vendu],
        backgroundColor: ["#3b82f6", "#facc15", "#10b981"],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 Statistiques</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-6 space-y-2">
          <h2 className="text-xl font-semibold">📦 Biens</h2>
          <p>Total : <strong>{stats.total}</strong></p>
          <p>Disponibles : <strong>{stats.dispo}</strong></p>
          <p>Sous compromis : <strong>{stats.compromis}</strong></p>
          <p>Vendus : <strong>{stats.vendu}</strong></p>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📈 Graphique</h2>
          <Pie data={chartData} />
        </div>
      </div>
    </div>
  )
}
