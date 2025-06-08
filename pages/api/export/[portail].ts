// pages/api/export/[portail].ts
import supabase from "@/lib/supabaseClient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { portail } = req.query;

  if (!portail || typeof portail !== "string") {
    return res.status(400).json({ error: "Paramètre portail manquant." });
  }

  try {
    const { data: biens, error } = await supabase
      .from("biens")
      .select("*");
    // .eq("publie", true)
    // .not("statut", "eq", "Archivé")

    if (error || !biens) {
      console.error("❌ Erreur récupération biens:", error);
      return res.status(500).json({ error: "Erreur récupération biens." });
    }

    // 📝 Log export (sans XML)
    await supabase.from("export_logs").insert({
      portail,
      nb_biens: biens.length,
      user_email: req.headers["x-user-email"] || "admin",
    });

    console.log("⛔️ Aucun export XML généré — uniquement loggé");
    return res.status(200).json({ message: "✅ Export loggué. Aucun fichier XML généré." });
  } catch (err: any) {
    console.error("❌ Erreur export :", err.message);
    return res.status(500).json({ error: "Erreur export : " + err.message });
  }
}
