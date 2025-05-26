import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Documents() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [documents, setDocuments] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    checkRoleAndFetchDocs()
  }, [])

  const checkRoleAndFetchDocs = async () => {
    const session = await supabase.auth.getSession()
    const userId = session.data?.session?.user?.id
    if (!userId) return

    const { data: userData } = await supabase.from("utilisateurs").select("role").eq("id", userId).single()
    setIsAdmin(userData?.role === "admin")

    fetchDocuments()
  }

  const fetchDocuments = async () => {
    const { data, error } = await supabase.storage.from("documents").list("", { limit: 100 })
    if (error) {
      console.error("Erreur récupération fichiers :", error)
    } else {
      setDocuments(data)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)

    const fileName = `${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from("documents").upload(fileName, file)

    if (error) {
      alert("Erreur à l’upload")
    } else {
      alert("✅ Fichier uploadé avec succès")
      fetchDocuments()
    }
    setUploading(false)
  }

  const getPublicUrl = (filename) => {
    return supabase.storage.from("documents").getPublicUrl(filename).data.publicUrl
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">📁 Documents</h1>

      {isAdmin && (
        <div className="bg-orange-50 border border-orange-200 rounded p-4 space-y-2">
          <p className="text-sm text-gray-700">Uploader un nouveau fichier (PDF, Word...)</p>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} disabled={uploading} />
          {uploading && <p className="text-sm text-gray-500">⏳ Envoi en cours...</p>}
        </div>
      )}

      <div className="space-y-4 mt-6">
        {documents.length === 0 ? (
          <p className="text-gray-500">Aucun document disponible.</p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.name}
              className="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              <p className="text-gray-700 truncate">{doc.name}</p>
              <a
                href={getPublicUrl(doc.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                📥 Télécharger
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
