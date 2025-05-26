import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function MainNavbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase
          .from("utilisateurs")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (userData?.role === "admin") setIsAdmin(true);
      }
    };
    checkAdmin();
  }, []);

  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center mb-6">
      <div className="space-x-4 text-sm">
        <button onClick={() => router.push("/dashboard")} className="hover:underline">🏠 Dashboard</button>
        <button onClick={() => router.push("/clients")} className="hover:underline">👥 Clients</button>
        <button onClick={() => router.push("/biens")} className="hover:underline">🏡 Biens</button>
        <button onClick={() => router.push("/rapprochement")} className="hover:underline">🔗 Rapprochement</button>
        <button onClick={() => window.open("https://www.a2sformation.fr", "_blank")} className="hover:underline">🎓 Formation</button>
        {isAdmin && <button onClick={() => router.push("/crypto")} className="hover:underline">₿ Crypto</button>}
      </div>
      <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600">
        🚪 Déconnexion
      </button>
    </nav>
  )
}
