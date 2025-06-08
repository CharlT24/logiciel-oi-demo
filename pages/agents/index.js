import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"
import Link from "next/link"

export default function ListeUtilisateurs() {
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState(null)
  const [role, setRole] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user?.id
      if (!uid) return
      setUserId(uid)

      const { data: userData } = await supabase
        .from("utilisateurs")
        .select("role")
        .eq("id", uid)
        .single()
      setRole(userData?.role || "")
    }

    const fetchAllUsers = async () => {
      const { data, error } = await supabase
        .from("utilisateurs")
        .select("*, agences(nom)")

      if (!error) setUsers(data)
    }

    fetchUser()
    fetchAllUsers()
  }, [])

  const getUserPhoto = (userId) => {
    if (!userId) return "/no-avatar.jpg"
    const extensions = ["jpg", "jpeg", "png", "webp"]
    for (const ext of extensions) {
      const url = `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/avatars/${userId}.${ext}`
      const img = new Image()
      img.src = url
      if (img.complete || img.naturalWidth !== 0) {
        return `${url}?t=${Date.now()}`
      }
    }
    return "/no-avatar.jpg"
  }

  const handleDelete = async (id) => {
    if (!confirm("Confirmer la suppression de cet utilisateur ?")) return
    const { error } = await supabase.from("utilisateurs").delete().eq("id", id)
    if (!error) {
      setUsers(users.filter((u) => u.id !== id))
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-orange-600">👥 Tous les utilisateurs</h1>

      {users.length === 0 ? (
        <p className="text-gray-500 mt-10">Aucun utilisateur trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {users.map((user) => {
            const photoUrl = getUserPhoto(user.id)
            return (
              <div key={user.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col relative">
                {user.agences?.nom && (
                  <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-bl-xl">
                    🏢 {user.agences.nom}
                  </div>
                )}
                <img
                  src={photoUrl}
                  alt={user.nom}
                  className="w-full h-52 object-cover"
                  onError={(e) => { e.currentTarget.src = "/no-avatar.jpg" }}
                />
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">
                      {user.prenom ? `${user.prenom} ${user.nom}` : user.nom}
                    </h2>
                    {user.role && <p className="text-sm text-gray-400 italic">👤 {user.role}</p>}
                    {user.ville && <p className="text-sm text-gray-500">{user.ville}</p>}
                    {user.telephone && <p className="text-sm text-gray-500 mt-1">📞 {user.telephone}</p>}
                    {user.email && <p className="text-sm text-gray-500 mt-1">✉️ {user.email}</p>}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <Link href={`/agents/${user.id}`} legacyBehavior>
                      <a className="inline-block bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-orange-600 transition">
                        Voir la fiche
                      </a>
                    </Link>
                    {role === "admin" && (
                      <button onClick={() => handleDelete(user.id)} className="text-sm text-red-500 hover:underline ml-2">
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
