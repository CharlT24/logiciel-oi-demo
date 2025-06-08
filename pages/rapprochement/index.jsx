import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"
import Link from "next/link"

export default function Rapprochements() {
  const [clients, setClients] = useState([])
  const [biens, setBiens] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: clientsData } = await supabase.from("clients").select("*")
      const { data: biensData } = await supabase.from("biens").select("*")
      setClients(clientsData || [])
      setBiens((biensData || []).filter((b) => b.disponibilite === true))
    }

    fetchData()

    const clientChannel = supabase
      .channel("realtime-clients")
      .on("postgres_changes", { event: "*", schema: "public", table: "clients" }, fetchData)
      .subscribe()

    const biensChannel = supabase
      .channel("realtime-biens")
      .on("postgres_changes", { event: "*", schema: "public", table: "biens" }, fetchData)
      .subscribe()

    return () => {
      supabase.removeChannel(clientChannel)
      supabase.removeChannel(biensChannel)
    }
  }, [])

  const biensCorrespondants = (client) => {
    return biens.filter((bien) => {
      const prixFAI = parseFloat(bien.prix_vente || 0) + parseFloat(bien.honoraires || 0)
      const budgetMax = parseFloat(client.budget_max || Infinity)
  
      const villeBien = (bien.ville || "").trim().toLowerCase()
      const villeClient = (client.ville_recherche || "").trim().toLowerCase()
      const villeOK = villeClient.length > 0 && villeBien.includes(villeClient)
  
      const prixOK = prixFAI <= budgetMax
  
      console.log("🔍 Rapprochement simplifié pour:", client.nom)
      console.log(" → Bien:", bien.titre)
      console.log("    Ville OK:", villeOK)
      console.log("    Prix FAI:", prixFAI, "| Budget Max:", budgetMax, "| Prix OK:", prixOK)
  
      return villeOK && prixOK
    })
  }  

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-600">🔍 Rapprochements</h1>
        <Link href="/recherche">
          <button className="bg-orange-100 text-orange-700 px-4 py-2 rounded hover:bg-orange-200 text-sm">
            🌐 Accès au moteur Google
          </button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map((client) => {
          const matches = biensCorrespondants(client)
          const hasMatch = matches.length > 0

          return (
            <div key={client.id} className="bg-white rounded-xl shadow p-5 border space-y-2">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-bold text-gray-800">{client.nom || "Acquéreur sans nom"}</h2>
                <span
                  className={
                    "text-xs font-bold px-2 py-1 rounded-full " +
                    (hasMatch ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700")
                  }
                >
                  {hasMatch ? `${matches.length} match` : "Aucun match"}
                </span>
              </div>

              <p className="text-sm text-gray-600">📍 {client.ville_recherche || "Ville inconnue"}</p>
              <p className="text-sm text-gray-600">
                💰 Budget : {client.budget_min?.toLocaleString() || "0"} € – {client.budget_max?.toLocaleString() || "Illimité"} €
              </p>
              <p className="text-sm text-gray-600">🏠 Recherche : {client.type_bien || "Non précisé"}</p>

              {hasMatch && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">🏡 Biens correspondants :</p>
                  <ul className="text-sm space-y-1">
                    {matches.map((bien) => {
                      const prixFAI = parseFloat(bien.prix_vente || 0) + parseFloat(bien.honoraires || 0)
                      return (
                        <li key={bien.id}>
                          <Link href={`/biens/${bien.id}`} className="text-orange-700 hover:underline">
                            📍 {bien.titre || "Bien sans titre"} — {bien.ville} — {prixFAI.toLocaleString()} €
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
