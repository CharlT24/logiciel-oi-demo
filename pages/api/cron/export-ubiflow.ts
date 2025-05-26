import { supabase } from "@/lib/supabaseClient";
import { generateUbiflowXML } from "@/lib/exports/generateUbiflowXML";
import { pushToFtp } from "@/lib/exports/pushToFtp";

export default async function handler(req, res) {
  // ✅ Sécurité avec clé secrète (dans .env)
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end("Unauthorized");
  }

  try {
    // 1. Récupérer tous les biens actifs
    const { data: biens, error } = await supabase.from("biens").select("*");

    if (error || !biens) {
      console.error("❌ Erreur récupération biens:", error);
      return res.status(500).send("Erreur récupération données");
    }

    // 2. Récupérer les agents liés
    const agentIds = [...new Set(biens.map(b => b.agent_id).filter(Boolean))];
    const { data: agents } = await supabase
      .from("utilisateurs")
      .select("id, nom, email, telephone")
      .in("id", agentIds);

    const agentsMap = Object.fromEntries((agents || []).map(a => [a.id, a]));
    const biensAvecAgents = biens.map(b => ({
      ...b,
      agent: agentsMap[b.agent_id] || null
    }));

    // 3. Générer le XML Ubiflow
    const xml = generateUbiflowXML(biensAvecAgents);

    // 4. Récupérer les credentials FTP (ubiflow)
    const { data: credentials } = await supabase
      .from("export_credentials")
      .select("*")
      .eq("portail", "ubiflow")
      .single();

    if (!credentials) {
      console.warn("⚠️ Aucune configuration FTP trouvée pour Ubiflow.");
      return res.status(400).send("Pas de configuration FTP");
    }

    // 5. Envoi FTP
    const ftpResult = await pushToFtp({
      host: credentials.url,
      user: credentials.username,
      password: credentials.password,
      destination: credentials.destination || "",
      fileName: "ag241309.xml",
      content: xml
    });

    if (!ftpResult.success) {
      console.error("❌ Échec FTP :", ftpResult.error);
      return res.status(500).send("Échec FTP");
    }

    console.log("✅ Envoi FTP terminé avec succès");
    return res.status(200).send("Export FTP réussi");
  } catch (err) {
    console.error("❌ Erreur serveur Cron:", err);
    return res.status(500).send("Erreur serveur");
  }
}
