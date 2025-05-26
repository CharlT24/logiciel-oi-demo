import { generateGreenAcresXML } from "@/lib/exports/generateGreenAcresXML"
import { supabase } from "@/lib/supabaseClient"
import * as ftp from "basic-ftp"
import { Readable } from "stream"

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end("Méthode non autorisée")

  try {
    const session = await supabase.auth.getSession()

    const { data: biens, error } = await supabase
      .from("biens")
      .select("*")
      .eq("publier_portail", true)

    if (error || !biens) throw new Error("Erreur récupération biens Supabase")

    const xmlContent = generateGreenAcresXML(biens)

    const client = new ftp.Client()
    client.ftp.verbose = true

    await client.access({
      host: "ftp.green-acres.com",
      user: "hektor_group",
      password: "hydatia",
      secure: false,
    })

    // ✅ Convertir en stream au lieu de Buffer
    const stream = Readable.from([xmlContent])
    await client.uploadFrom(stream, "export.xml")

    client.close()

    // 📝 Log de l'export
    await supabase.from("export_logs").insert({
      portail: "greenacres",
      nb_biens: biens.length,
      user_email: session?.data?.session?.user?.email || null,
    })

    res.status(200).send("✅ Export Green-Acres réussi.")
  } catch (err) {
    console.error("Erreur export Green-Acres:", err)
    res.status(500).send("❌ Erreur export Green-Acres.")
  }
}
