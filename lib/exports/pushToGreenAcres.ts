// lib/exports/pushToGreenAcres.ts
import { supabase } from "@/lib/supabaseClient"
import { generateGreenAcresXML } from "@/lib/exports/generateGreenAcresXML"
import * as ftp from "basic-ftp"
import { Readable } from "stream"

export async function pushToGreenAcres() {
  try {
    // 1. Récupérer les biens à publier
    const { data: biens, error } = await supabase
      .from("biens")
      .select("*")
      .eq("publier_portail", true)

    if (error || !biens) throw new Error("Erreur récupération biens Supabase")

    // 2. Générer le XML
    const xmlContent = generateGreenAcresXML(biens)

    // 3. Connexion FTP
    const client = new ftp.Client()
    client.ftp.verbose = true

    await client.access({
      host: "ftp.green-acres.com",
      user: "hektor_group",
      password: "hydatia",
      secure: false,
    })

    // 4. Créer un flux lisible pour l'envoi
    const stream = Readable.from([xmlContent])
    await client.uploadFrom(stream, "export.xml")

    console.log("✅ Export XML envoyé avec succès sur Green-Acres")
    client.close()
  } catch (err) {
    console.error("❌ Échec export Green-Acres:", err)
  }
}
