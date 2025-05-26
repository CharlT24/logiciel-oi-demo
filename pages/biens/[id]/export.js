import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"
import { generateXML } from "@/utils/xmlGenerator"

export default function ExportBien() {
  const router = useRouter()
  const { id } = router.query
  const [bien, setBien] = useState(null)
  const [loading, setLoading] = useState(true)
  const [xmlContent, setXmlContent] = useState("")

  useEffect(() => {
    if (!id) return

    const fetchBien = async () => {
      const { data, error } = await supabase
        .from("biens")
        .select("*")
        .eq("id", id)
        .single()

      if (!error && data) {
        setBien(data)

        const xml = generateXML([data])
        setXmlContent(xml)

        // 📤 Envoi automatique du XML par email (invisible)
        fetch("/api/export/send", {
          method: "POST",
          headers: {
            "Content-Type": "text/plain"
          },
          body: xml
        })
      }

      setLoading(false)
    }

    fetchBien()
  }, [id])

  const handleDownload = () => {
    const blob = new Blob([xmlContent], { type: "application/xml" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `bien-${bien.id}.xml`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <p className="text-center mt-10">Chargement du bien...</p>
  if (!bien) return <p className="text-center mt-10 text-red-500">Bien introuvable.</p>

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">📤 Export du bien</h1>

      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <p><strong>Titre :</strong> {bien.titre}</p>
        <p><strong>Ville :</strong> {bien.ville}</p>
        <p><strong>Prix :</strong> {bien.prix} €</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">📄 Aperçu XML</h2>
        <pre className="bg-gray-100 text-xs p-4 rounded overflow-x-auto">
          {xmlContent}
        </pre>
        <button
          onClick={handleDownload}
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition"
        >
          ⬇️ Télécharger le fichier XML
        </button>
      </div>
    </div>
  )
}
