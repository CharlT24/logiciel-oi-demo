import { supabase } from "@/lib/supabaseClient"

export const getSettings = async () => {
  const { data } = await supabase.from("parametres").select("*")
  const settings = {}
  for (const p of data || []) {
    settings[p.cle] = p.valeur
  }
  return settings
}