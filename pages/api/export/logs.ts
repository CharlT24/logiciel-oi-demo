import { supabase } from "@/lib/supabaseClient"

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("export_logs")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error })
  res.status(200).json({ logs: data })
}
