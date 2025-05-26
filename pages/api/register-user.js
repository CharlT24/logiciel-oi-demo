import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return res.status(401).json({ error: "Non authentifié (via token)" })
  }

  const { nom, telephone } = req.body

  const { error: insertError } = await supabase.from("utilisateurs").insert([
    {
      id: user.id,
      email: user.email,
      nom,
      telephone,
      role: "agent",
    }
  ])

  if (insertError) {
    return res.status(500).json({ error: insertError.message })
  }

  res.status(200).json({ message: "Utilisateur inséré ✅" })
}
