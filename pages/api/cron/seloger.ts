import supabase from "@/lib/supabaseClient";
import { generateSeLogerCSV } from "@/lib/exports/generateSeLogerCSV";
// import { pushToSftp } from "@/lib/exports/pushToSftp"; // temporairement désactivé

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  const { data: biens, error } = await supabase
    .from("biens")
    .select("*");

  if (error) {
    return res.status(500).json({ message: "Erreur chargement biens", error });
  }

  const csv = generateSeLogerCSV(biens);

  /*
  const sftpResult = await pushToSftp({
    host: process.env.SELOGER_SFTP_HOST!,
    user: process.env.SELOGER_SFTP_USER!,
    password: process.env.SELOGER_SFTP_PASS!,
    destination: process.env.SELOGER_SFTP_DEST || "",
    fileName: "seloger.csv",
    content: csv,
  });

  if (!sftpResult.success) {
    return res.status(500).json({ message: "❌ Échec envoi SFTP", error: sftpResult.error });
  }
  */

  console.log("🛑 SFTP désactivé temporairement");

  return res.status(200).json({ message: "✅ CSV généré (sans SFTP)" });
} // 👈 cette accolade FINALE est essentielle
