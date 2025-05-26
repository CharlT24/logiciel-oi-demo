import SftpClient from "ssh2-sftp-client";

export const config = {
  runtime: "nodejs"
};

export async function pushToSftp({
  host,
  port = 22,
  user,
  password,
  destination,
  fileName,
  content,
}: {
  host: string;
  port?: number;
  user: string;
  password: string;
  destination?: string;
  fileName: string;
  content: string;
}) {
  const client = new SftpClient();

  try {
    console.log("🔐 Connexion SFTP en cours...");
    await client.connect({
      host,
      port,
      username: user,
      password,
    });
    console.log(`✅ Connecté à ${host}:${port} en tant que ${user}`);

    const cleanDestination = destination?.replace(/^\/+|\/+$/g, "") || "";
    const finalPath = cleanDestination ? `${cleanDestination}/${fileName}` : fileName;

    if (cleanDestination) {
      console.log(`📂 Vérification dossier : ${cleanDestination}`);
      const exists = await client.exists(cleanDestination);
      if (!exists) {
        await client.mkdir(cleanDestination, true); // recursive = true
        console.log("📁 Dossier créé");
      } else {
        console.log("📁 Dossier déjà existant");
      }
    }

    const buffer = Buffer.from(content, "utf-8");
    console.log(`🚀 Upload du fichier vers ${finalPath}`);
    await client.put(buffer, finalPath);
    console.log("✅ Upload terminé");

    return { success: true };
  } catch (err) {
    console.error("❌ SFTP Error:", err);
    return { success: false, error: (err as Error).message };
  } finally {
    await client.end();
    console.log("🔌 Connexion SFTP fermée");
  }
}
