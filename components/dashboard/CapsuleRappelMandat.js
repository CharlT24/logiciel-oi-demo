// 🔧 Fichier modifié : CapsuleRappelMandat lié à registres_mandats avec rappel 3 mois avant + lien vers listing agent/admin
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"
import Link from "next/link"

export default function CapsuleRappelMandat() {
  const [rappels, setRappels] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchRappels = async () => {
      const today = new Date()
      const threeMonthsLater = new Date()
      threeMonthsLater.setMonth(today.getMonth() + 3)

      const session = await supabase.auth.getSession()
      const userId = session.data?.session?.user?.id

      const { data: userRoleData } = await supabase
        .from("utilisateurs")
        .select("role")
        .eq("id", userId)
        .single()

      const isAdminUser = userRoleData?.role === "admin"
      setIsAdmin(isAdminUser)

      const { data, error } = await supabase
        .from("registres_mandats")
        .select("id, bien_id, date_fin, agent_id")
        .not("date_fin", "is", null)
        .lte("date_fin", threeMonthsLater.toISOString())
        .order("date_fin", { ascending: true })

      if (!error && data) {
        const filtered = isAdminUser ? data : data.filter(r => r.agent_id === userId)

        const biensIds = filtered.map(r => r.bien_id)
        const { data: biens, error: biensError } = await supabase
          .from("biens")
          .select("id, titre")
          .in("id", biensIds)

        if (!biensError && biens) {
          const mapped = filtered.map(r => {
            const bien = biens.find(b => b.id === r.bien_id)
            return {
              id: r.bien_id,
              titre: bien?.titre || "Bien sans titre",
              date_fin: r.date_fin
            }
          })
          setRappels(mapped)
        }
      }
    }

    fetchRappels()
  }, [])

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-red-600">⏰ Mandats à renouveler</h3>
        <Link 
          href={isAdmin ? "/mandats/liste" : "/mandats/mes-mandats"} 
          className="text-sm text-orange-600 hover:underline"
        >
          Voir tout
        </Link>
      </div>
      {rappels.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun mandat à échéance proche.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {rappels.map(bien => (
            <li key={bien.id} className="flex justify-between items-center">
              <Link href={`/biens/${bien.id}`} className="text-orange-600 hover:underline">
                {bien.titre}
              </Link>
              <span className="text-gray-500">{new Date(bien.date_fin).toLocaleDateString("fr-FR")}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
