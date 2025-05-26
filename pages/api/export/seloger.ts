import { supabase } from "@/lib/supabaseClient";
import { generateSeLogerCSV } from "@/lib/exports/generateSeLogerCSV";
import { pushToSftp } from "../../../lib/exports/pushToSftp";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Méthode non autorisée");
  }

  try {
    console.log("🔄 Début de l’export manuel vers SeLoger...");

    // 🔍 Étape 1 : Ne récupérer que les biens cochés pour SeLoger
    const { data: biens, error } = await supabase
      .from("biens")
      .select("*")
      .filter("exports->seloger", "eq", true);

    if (error || !biens) {
      console.error("❌ Erreur récupération biens:", error);
      return res.status(500).send("Erreur récupération données");
    }

    console.log(`📦 ${biens.length} bien(s) à exporter vers SeLoger`);

    // 🔍 Étape 2 : Récupérer les agents
    const agentIds = [...new Set(biens.map(b => b.agent_id).filter(Boolean))];
    const { data: agents, error: agentError } = await supabase
      .from("utilisateurs")
      .select("id, nom, email, telephone")
      .in("id", agentIds);

    const agentMap = Object.fromEntries((agents || []).map(a => [a.id, a]));

    const biensAvecAgents = biens.map(bien => ({
      ...bien,
      agent: agentMap[bien.agent_id] || null
    }));

    // 📄 Étape 3 : Génération CSV
    const csv = generateSeLogerCSV(biensAvecAgents);

    // 📤 Étape 4 : Envoi SFTP
    const sftpResult = await pushToSftp({
      host: process.env.SELOGER_SFTP_HOST!,
      user: process.env.SELOGER_SFTP_USER!,
      password: process.env.SELOGER_SFTP_PASS!,
      destination: process.env.SELOGER_SFTP_DEST || "",
      fileName: "seloger.csv",
      content: csv
    });

    const ftpStatus = sftpResult.success
      ? "✅ Fichier CSV envoyé par SFTP"
      : `⚠️ Erreur SFTP : ${sftpResult.error}`;

    console.log("📤 Résultat SFTP :", ftpStatus);

    return res.status(200).json({
      csv,
      ftpStatus
    });
  } catch (err) {
    console.error("❌ Erreur export SeLoger:", err);
    return res.status(500).send("Erreur serveur");
  }
}
