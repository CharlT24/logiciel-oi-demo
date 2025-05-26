// pages/admin/dashboard.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState({ utilisateurs: 0, biens: 0, clients: 0 })

  useEffect(() => {
    const checkAdmin = async () => {
      const session = await supabase.auth.getSession()
      const userData = session.data?.session?.user
      if (!userData) return router.push("/login")
      setUser(userData)

      // Vérifie le rôle depuis Supabase
      const { data, error } = await supabase
        .from("utilisateurs")
        .select("role")
        .eq("id", userData.id)
        .single()

      if (error || data?.role !== "admin") {
        return router.push("/dashboard") // Pas admin => dashboard normal
      }

      setIsAdmin(true)
      fetchStats()
    }

    const fetchStats = async () => {
      const [{ count: utilisateurs }, { count: biens }, { count: clients }] = await Promise.all([
        supabase.from("utilisateurs").select("*", { count: "exact", head: true }),
        supabase.from("biens").select("*", { count: "exact", head: true }),
        supabase.from("clients").select("*", { count: "exact", head: true })
      ])

      setStats({ utilisateurs, biens, clients })
    }

    checkAdmin()
  }, [])

  if (!isAdmin) return null

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-orange-700">👑 Tableau de bord Administrateur</h1>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card icon="👥" label="Utilisateurs" value={stats.utilisateurs} />
        <Card icon="🏡" label="Biens en base" value={stats.biens} />
        <Card icon="🗂️" label="Clients enregistrés" value={stats.clients} />
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">⚙️ Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AdminLink href="/admin/utilisateurs" text="👥 Gérer les utilisateurs" />
          <AdminLink href="/admin/utilisateurs/ajouter" text="➕ Créer un nouvel agent" />
          <AdminLink href="/biens" text="📦 Liste des biens" />
          <AdminLink href="/clients" text="👤 Liste des clients" />
          <AdminLink href="/reseau" text="🌐 Voir le réseau" />
          <AdminLink href="/statistiques" text="📊 Statistiques globales" />
        </div>
      </div>
    </div>
  )
}

function Card({ icon, label, value }) {
  return (
    <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 flex items-center gap-4 shadow">
      <div className="text-3xl text-orange-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

function AdminLink({ href, text }) {
  return (
    <a
      href={href}
      className="block text-sm px-4 py-2 rounded-md border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 transition"
    >
      {text}
    </a>
  )
}
