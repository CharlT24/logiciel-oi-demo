import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AdminPDFUpload() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setMessage(null)

    const filePath = `newsletters/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setMessage("❌ Erreur lors de l'upload")
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(filePath)

    const { error: insertError } = await supabase
      .from("newsletters")
      .insert({ url: urlData.publicUrl })

    if (insertError) {
      setMessage("❌ Erreur en base de données")
    } else {
      setMessage("✅ PDF uploadé et publié avec succès !")
    }
    setUploading(false)
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">📰 Uploader une Newsletter</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 rounded w-full"
      />

      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
      >
        {uploading ? "⏳ Upload..." : "🚀 Publier la Newsletter"}
      </button>

      {message && <p className="text-center text-sm font-medium">{message}</p>}
    </div>
  )
}
