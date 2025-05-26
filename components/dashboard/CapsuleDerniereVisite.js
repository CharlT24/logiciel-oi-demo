import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function CapsuleDerniereVisite() {
  const [visite, setVisite] = useState(null)

  useEffect(() => {
    const fetchDerniereVisite = async () => {
      const { data, error } = await supabase
        .from("visites")
        .select("id, date_visite, clients(nom), biens(titre)")
        .order("date_visite", { ascending: false })
        .limit(1)
        .single()

      if (!error) setVisite(data)
    }

    fetchDerniereVisite()
  }, [])

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-indigo-700">📍 Dernière visite</h3>
        <Link href="/visites/nouvelle">
          <span className="text-sm text-blue-600 hover:underline">+ Nouvelle</span>
        </Link>
      </div>

      {visite ? (
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Client :</strong> {visite.clients?.nom || "-"}</p>
          <p><strong>Bien :</strong> {visite.biens?.titre || "-"}</p>
          <p><strong>Date :</strong> {new Date(visite.date_visite).toLocaleDateString()}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Aucune visite enregistrée.</p>
      )}
    </div>
  )
}
