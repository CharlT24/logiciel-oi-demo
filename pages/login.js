import { useState } from "react"
import { useRouter } from "next/router"
import supabase from "@/lib/supabaseClient"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError("Email ou mot de passe incorrect.")
      setLoading(false)
      return
    }

    const user = data.user
    if (!user) {
      setError("Utilisateur introuvable.")
      setLoading(false)
      return
    }

    // 🔍 Vérifie si l'utilisateur existe dans la table "utilisateurs"
    const { data: profile, error: profileError } = await supabase
      .from("utilisateurs")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError) {
      // ❌ S’il n’existe pas encore → on l’insère avec des infos basiques
      const { error: insertError } = await supabase.from("utilisateurs").insert([
        {
          id: user.id,
          email: user.email,
          nom: user.user_metadata?.nom || "Utilisateur",
          telephone: user.user_metadata?.telephone || "",
          role: "agent",
        }
      ])
      if (insertError) {
        setError("Erreur lors de l'enregistrement du profil.")
        console.error("❌ Insert utilisateur :", insertError)
        setLoading(false)
        return
      }

      // 🟢 Redirige vers dashboard pour les agents par défaut
      router.push("/dashboard")
      return
    }

    // ✅ Si l’utilisateur existe déjà, on redirige selon son rôle
    if (profile.role === "admin") {
      router.push("/admin")
    } else {
      router.push("/dashboard")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-5">
        <h1 className="text-2xl font-bold text-center text-orange-600">Connexion</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <p className="text-sm text-center text-gray-600">
  Pas encore de compte ?{" "}
  <a href="/register" className="text-orange-600 hover:underline">Créer un compte</a>
</p>

<p className="text-sm text-center text-gray-600 mt-2">
  <a href="/reset-password" className="text-orange-600 hover:underline">🔑 Mot de passe oublié ?</a>
</p>
      </form>
    </div>
  )
}
