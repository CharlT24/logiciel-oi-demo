import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { nom, email, ville, type_bien, surface_m2 } = req.body;

  console.log("📩 Données reçues :", req.body); // 👈 Ajout ici

  if (!nom || !email || !ville || !type_bien || !surface_m2) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  const { error } = await supabase.from("prospects").insert([
    {
      nom,
      email,
      ville,
      type_bien,
      surface_m2: parseFloat(surface_m2),
      source: "formulaire_wordpress",
      created_at: new Date().toISOString()
    }
  ]);

  if (error) {
    console.error("❌ Erreur Supabase :", error.message || error);
    return res.status(500).json({ error: error.message || "Erreur inconnue Supabase" });
  }

  return res.status(200).json({ success: true });
}
