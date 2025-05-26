import { useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"

export default function Register() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: "",
    password: "",
    nom: "",
    telephone: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { email, password, nom, telephone } = form

    if (!email || !password || !nom || !telephone) {
      alert("Tous les champs sont requis")
      setLoading(false)
      return
    }

    // Étape 1 : création de l'utilisateur via Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      console.error("❌ Erreur création compte :", signUpError)
      alert("Erreur à la création du compte : " + signUpError.message)
      setLoading(false)
      return
    }

    // 🕐 Attente pour s'assurer que la session est bien active
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Étape 2 : appel RPC sécurisé pour insertion dans la table utilisateurs
    const { error: rpcError } = await supabase.rpc("insert_utilisateur", {
      p_email: email,
      p_nom: nom,
      p_telephone: telephone,
      p_role: "agent", // ou "admin" si besoin
    })

    if (rpcError) {
      console.error("❌ Erreur RPC :", rpcError)
      alert("Erreur lors de l'enregistrement dans la base.")
      setLoading(false)
      return
    }

    alert("✅ Compte créé avec succès !")
    router.push("/login")
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 shadow-lg rounded-xl space-y-6">
      <h1 className="text-2xl font-bold text-orange-600 text-center">📝 Créer un compte</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          name="nom"
          placeholder="Nom complet"
          value={form.nom}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="tel"
          name="telephone"
          placeholder="Téléphone"
          value={form.telephone}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          className="input"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>
    </div>
  )
}
