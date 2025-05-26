import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"
import Link from "next/link"

export default function FicheBien() {
  const router = useRouter()
  const { id } = router.query
  const [bien, setBien] = useState(null)
  const [loading, setLoading] = useState(true)
  const [photoUrl, setPhotoUrl] = useState("")

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      setLoading(true)

      const { data, error } = await supabase.from("biens").select("*").eq("id", id).single()
      if (!error) {
        setBien(data)
        // Récupère la photo de couverture
        const { data: urlData } = supabase.storage.from("photos").getPublicUrl(`cover-${id}.jpg`)
        if (urlData?.publicUrl) {
          setPhotoUrl(urlData.publicUrl)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [id])

  if (loading) return <p className="p-6 text-gray-500">Chargement...</p>
  if (!bien) return <p className="p-6 text-red-600">Bien introuvable.</p>

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 bg-white shadow-xl rounded-xl mt-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-600">🏡 {bien.titre}</h1>
        <Link
          href="/biens"
          className="text-sm text-orange-600 hover:underline"
        >
          ⬅️ Retour aux biens
        </Link>
      </div>

      {/* Photo de couverture */}
      {photoUrl && (
        <div className="w-full h-72 relative overflow-hidden rounded-xl shadow">
          <Image src={photoUrl} alt="Photo de couverture" layout="fill" objectFit="cover" />
        </div>
      )}

      {/* Infos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
        <p><strong>📍 Ville :</strong> {bien.ville}</p>
        <p><strong>🏷️ Type :</strong> {bien.type_bien}</p>
        <p><strong>📐 Surface :</strong> {bien.surface_m2} m²</p>
        <p><strong>💰 Prix :</strong> {bien.prix?.toLocaleString()} €</p>
        <p><strong>🔋 DPE :</strong> {bien.dpe}</p>
        <p><strong>🧾 Honoraires :</strong> {bien.honoraires} € {bien.charge_honoraires === "acquéreur" ? "(charge acquéreur)" : "(charge vendeur)"}</p>
        <p><strong>🛑 Statut :</strong> {bien.statut}</p>
        <p><strong>🔖 Mandat :</strong> {bien.mandat}</p>
      </div>

      {/* Description */}
      {bien.description && (
        <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
          <h3 className="font-semibold text-orange-700 mb-1">📝 Description du bien</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">{bien.description}</p>
        </div>
      )}

      {/* Options du bien */}
      <div className="bg-gray-50 p-6 rounded-xl border">
        <h3 className="font-semibold text-orange-700 mb-3">✅ Options</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-800 list-disc pl-5">
          {Object.entries(bien).map(([key, value]) => {
            if (key.startsWith("option_") && value === true) {
              return <li key={key}>{key.replace("option_", "").replace(/_/g, " ")}</li>
            }
            return null
          })}
        </ul>
      </div>
    </div>
  )
}
