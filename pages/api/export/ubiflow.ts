import { supabase } from "@/lib/supabaseClient";
import { generateUbiflowXML } from "@/lib/exports/generateUbiflowXML";
import { pushToFtp } from "@/lib/exports/pushToFtp";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Méthode non autorisée");
  }

  try {
    console.log("🔄 Début de l’export manuel vers Ubiflow...");

    // 🔍 Étape 1 : Récupérer uniquement les biens cochés pour Ubiflow
    const { data: biens, error } = await supabase
      .from("biens")
      .select("*")
      .filter("exports->ubiflow", "eq", true);

    if (error || !biens) {
      console.error("❌ Erreur récupération biens:", error);
      return res.status(500).send("Erreur récupération données");
    }

    console.log(`📦 ${biens.length} bien(s) à exporter vers Ubiflow`);

    // 🔍 Étape 2 : Récupérer les agents associés
    const agentIds = [...new Set(biens.map(b => b.agent_id).filter(Boolean))];
    const { data: agents, error: agentError } = await supabase
      .from("utilisateurs")
      .select("id, nom, email, telephone")
      .in("id", agentIds);

    if (agentError) {
      console.error("❌ Erreur récupération agents:", agentError);
      return res.status(500).send("Erreur récupération agents");
    }

    const agentsMap = Object.fromEntries((agents || []).map(a => [a.id, a]));
    const biensAvecAgents = biens.map(bien => ({
      ...bien,
      agent: agentsMap[bien.agent_id] || null
    }));

    // 🔧 Étape 3 : Génération XML
    const xml = generateUbiflowXML(biensAvecAgents);
    console.log("✅ XML Ubiflow généré :", xml.length, "caractères");

    // 📤 Étape 4 : Envoi FTP
    const ftpResult = await pushToFtp({
      host: "ftp.ubiflow.net",
      user: "ag241309",
      password: "eweket63",
      destination: "",
      fileName: "ag241309.xml",
      content: xml
    });

    if (!ftpResult.success) {
      console.error("❌ Envoi FTP échoué :", ftpResult.error);
    }

    return res.status(200).json({
      message: ftpResult.success
        ? "✅ Export manuel Ubiflow terminé avec succès"
        : `❌ Export échoué : ${ftpResult.error}`,
      biensExportes: biens.length
    });
  } catch (err) {
    console.error("❌ Erreur serveur Ubiflow:", err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
}
