// 🔧 Fichier modifié : Dashboard avec raccourcis sur les capsules
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import dynamic from "next/dynamic"
import CapsuleDerniereVisite from "@/components/dashboard/CapsuleDerniereVisite"
import CapsuleRappelMandat from "@/components/dashboard/CapsuleRappelMandat"

const PDFViewer = dynamic(() => import("@/components/PDFViewer"), { ssr: false })

export default function Dashboard() {
  const [biens, setBiens] = useState([])
  const [clients, setClients] = useState([])
  const [caEstime, setCaEstime] = useState(0)
  const [caActe, setCaActe] = useState(0)
  const [topAgents, setTopAgents] = useState([])
  const [topCompromis, setTopCompromis] = useState([])
  const [newsletterUrl, setNewsletterUrl] = useState(null)
  const [latestBiens, setLatestBiens] = useState([])
  const [totalBiensReseau, setTotalBiensReseau] = useState(0)
  const [agentId, setAgentId] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession()
      const agentId = session.data?.session?.user?.id
      setAgentId(agentId)

      const { data: biensData } = await supabase.from("biens").select("*").eq("agent_id", agentId)
      const { data: clientsData } = await supabase.from("clients").select("*")

      const biensList = biensData || []
      const clientsList = clientsData || []

      setBiens(biensList)
      setClients(clientsList)

      const estime = biensList.reduce((acc, b) => acc + (b.honoraires || 0), 0)
      const acte = biensList
        .filter(b => b.statut === "Vendu")
        .reduce((acc, b) => acc + (b.honoraires || 0), 0)

      setCaEstime(estime)
      setCaActe(acte)

      const latest = biensList
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 4)

      setLatestBiens(latest)

      const { data: allBiens } = await supabase.from("biens").select("honoraires, agent_id, statut")
      const { data: allUsers } = await supabase.from("utilisateurs").select("id, nom, slug")

      const scores = {}
      const compromis = {}

      for (const bien of allBiens || []) {
        if (bien.agent_id) {
          if (bien.statut === "Vendu") {
            scores[bien.agent_id] = (scores[bien.agent_id] || 0) + (bien.honoraires || 0)
          }
          if (bien.statut === "Sous compromis") {
            compromis[bien.agent_id] = (compromis[bien.agent_id] || 0) + 1
          }
        }
      }

      const top = Object.entries(scores).map(([id, total]) => {
        const agent = allUsers.find(u => u.id === id)
        return { id, nom: agent?.nom || "Inconnu", slug: agent?.slug || "", total }
      }).sort((a, b) => b.total - a.total).slice(0, 3)

      const bestCompromis = Object.entries(compromis).map(([id, count]) => {
        const agent = allUsers.find(u => u.id === id)
        return { id, nom: agent?.nom || "Inconnu", slug: agent?.slug || "", count }
      }).sort((a, b) => b.count - a.count).slice(0, 1)

      setTopAgents(top)
      setTopCompromis(bestCompromis)

      const { data: allBiensData } = await supabase.from("biens").select("*")

      const actifs = allBiensData?.filter(bien =>
        bien.statut !== "Vendu" && bien.statut !== "Supprimé"
      ) || []

      setTotalBiensReseau(actifs.length)

      const { data: pdfs } = await supabase
        .from("newsletters")
        .select("url")
        .order("created_at", { ascending: false })
        .limit(1)

      if (pdfs?.length > 0) setNewsletterUrl(pdfs[0].url)
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-orange-700">📊 Tableau de bord</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard label="🏡 Biens actifs réseau" value={totalBiensReseau} color="green" href="/biens" />
        <StatCard label="📦 Biens enregistrés" value={biens.length} color="blue" href={`/biens?agent_id=${agentId}`} />
        <StatCard label="👥 Clients actifs" value={clients.length} color="gray" />
        <StatCard label="💼 CA estimé" value={`${caEstime.toLocaleString()} €`} color="orange" />
        <StatCard label="💰 CA acté (ventes)" value={`${caActe.toLocaleString()} €`} color="green" />
        <StatCard label="📄 Documents" value="Accéder" color="purple" href="/documents" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <CapsuleDerniereVisite />
        <CapsuleRappelMandat />
      </div>

      {latestBiens.length > 0 && (
        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h3 className="text-lg font-bold mb-4 text-orange-600">🆕 Derniers biens ajoutés</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {latestBiens.map((bien) => (
              <Link key={bien.id} href={`/biens/${bien.id}`} className="block bg-orange-50 p-3 rounded-xl border hover:shadow">
                <p className="text-sm font-semibold text-gray-800 truncate">{bien.titre || "Sans titre"}</p>
                <p className="text-xs text-gray-500">📍 {bien.ville}</p>
                <p className="text-xs text-gray-700 font-medium">💰 {bien.prix_vente?.toLocaleString()} €</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-xl p-6 border">
        <h3 className="text-lg font-bold mb-4 text-orange-700">🏆 Top vendeurs du réseau</h3>
        <ul className="space-y-2 text-sm">
          {topAgents.map((agent, index) => (
            <li key={agent.id} className="flex justify-between">
              <Link href={`/reseau/${agent.slug}`} className="text-orange-600 hover:underline">
                #{index + 1} {agent.nom}
              </Link>
              <span className="font-semibold text-gray-700">{agent.total.toLocaleString()} €</span>
            </li>
          ))}
        </ul>
      </div>

      {topCompromis.length > 0 && (
        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h3 className="text-lg font-bold mb-4 text-green-700">🔒 Top compromis</h3>
          <p className="text-sm">{topCompromis[0].nom} avec {topCompromis[0].count} compromis en cours</p>
        </div>
      )}

      {newsletterUrl && (
        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h3 className="text-lg font-bold mb-4 text-purple-700">📰 Dernière newsletter</h3>
          <PDFViewer url={newsletterUrl} />
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color = "gray", href }) {
  const colorMap = {
    orange: "text-orange-600 bg-orange-50",
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    gray: "text-gray-600 bg-gray-100",
    purple: "text-purple-600 bg-purple-100"
  }

  const content = (
    <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition cursor-pointer">
      <div className={`text-3xl ${colorMap[color]} p-3 rounded-full`}>📈</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )

  return href ? <Link href={href}>{content}</Link> : content
}
