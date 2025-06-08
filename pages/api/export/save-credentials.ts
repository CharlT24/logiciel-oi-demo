// pages/api/export/save-credentials.ts

import supabase from "@/lib/supabaseClient"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" })
  }

  const { portail, url, username, password, destination, autoExport } = req.body

  if (!portail) {
    return res.status(400).json({ error: "Portail manquant" })
  }

  const { data, error } = await supabase
    .from("portails_config")
    .upsert(
      [{
        portail,
        url,
        username,
        password,
        destination,
        auto_export: autoExport
      }],
      { onConflict: 'portail'}
    )

  if (error) {
    console.error("Erreur Supabase :", error)
    return res.status(500).json({ error: "Échec enregistrement" })
  }

  return res.status(200).json({ success: true })
}
