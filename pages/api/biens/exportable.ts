import { supabase } from "@/lib/supabaseClient"

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("biens")
    .select("*")

  console.log("📦 BIENS API exportables:", data?.length)
  console.log("❌ ERREUR:", error)

  if (error) return res.status(500).json({ error })

  res.status(200).json({ biens: data })
}
