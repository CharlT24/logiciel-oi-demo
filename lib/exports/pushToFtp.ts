import { Client } from "basic-ftp";
import { Readable } from "stream";

export async function pushToFtp({
  host,
  user,
  password,
  destination,
  fileName,
  content,
}: {
  host: string;
  user: string;
  password: string;
  destination?: string;
  fileName: string;
  content: string;
}) {
  const client = new Client();
  try {
    console.log("🔐 Connexion FTP en cours...");
    await client.access({ host, user, password });
    console.log(`✅ Connecté à ${host} en tant que ${user}`);

    const cleanDestination = destination?.replace(/^\/+|\/+$/g, "") || "";
    const finalPath = cleanDestination ? `${cleanDestination}/${fileName}` : fileName;

    console.log(`📁 Dossier de destination : ${cleanDestination || "(racine)"}`);
    console.log(`📄 Nom du fichier : ${fileName}`);

    if (cleanDestination) {
      console.log(`📂 Vérification/Création du dossier ${cleanDestination}...`);
      await client.ensureDir(cleanDestination);
      console.log("✅ Dossier prêt");
    }

    const stream = Readable.from([content]);
    console.log("🚀 Envoi du fichier...");
    await client.uploadFrom(stream, finalPath);
    console.log(`✅ FTP upload terminé : ${finalPath}`);

    return { success: true };
  } catch (err) {
    console.error("❌ FTP Error:", err);
    return { success: false, error: (err as Error).message };
  } finally {
    client.close();
    console.log("🔌 Connexion FTP fermée");
  }
}