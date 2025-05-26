// /pages/api/admin/supabase-action.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Méthode non autorisée" })
    }
  
    // Authentification admin (exemple simple à adapter)
    const isAdmin = req.headers.authorization === `Bearer ${process.env.ADMIN_SECRET}`
    if (!isAdmin) {
      return res.status(403).json({ error: "Accès refusé" })
    }
  
    const { sql } = req.body
    if (!sql || typeof sql !== "string") {
      return res.status(400).json({ error: "Requête SQL invalide" })
    }
  
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sql })
    })
  
    const result = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({ error: result.message || "Erreur Supabase" })
    }
  
    return res.status(200).json({ success: true, result })
  }
  