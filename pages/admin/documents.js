import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"

export default function AdminDocuments() {
  const router = useRouter()
  const [documents, setDocuments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkRoleAndFetchDocs()
  }, [])

  const checkRoleAndFetchDocs = async () => {
    const session = await supabase.auth.getSession()
    const userId = session.data?.session?.user?.id
    if (!userId) return

    const { data: userData } = await supabase.from("utilisateurs").select("role").eq("id", userId).single()

    if (userData?.role === "admin") {
      setIsAdmin(true)
      fetchDocuments()
    } else {
      router.push("/dashboard")
    }
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
    setUploadSuccess(false)

    const fileName = `${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from("documents").upload(fileName, file)

    if (error) {
      alert("❌ Erreur lors de l’upload")
    } else {
      setUploadSuccess(true)
      fetchDocuments()
    }

    setUploading(false)
  }

  const handleDelete = async (fileName) => {
    const { error } = await supabase.storage.from("documents").remove([fileName])

    if (error) {
      alert("❌ Erreur lors de la suppression")
    } else {
      alert("✅ Fichier supprimé avec succès")
      fetchDocuments()
    }
  }

  const getPublicUrl = (filename) => {
    return supabase.storage.from("documents").getPublicUrl(filename).data.publicUrl
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📁 Gestion des documents</h1>

      {isAdmin && (
        <div className="bg-white p-6 border rounded-xl shadow space-y-4">
          <h2 className="text-lg font-bold text-orange-700">Uploader un fichier (PDF/Word)</h2>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleUpload}
            className="text-sm"
          />
          {uploading && <p className="text-sm text-gray-400">Envoi en cours...</p>}
          {uploadSuccess && <p className="text-sm text-green-600">✅ Document ajouté avec succès</p>}
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-800">Documents existants</h2>
        {documents.length === 0 ? (
          <p className="text-gray-500">Aucun document disponible.</p>
        ) : (
          <div className="space-y-4 mt-4">
            {documents.map((doc) => (
              <div key={doc.name} className="flex justify-between items-center border p-4 rounded-lg shadow hover:bg-gray-50 transition">
                <p className="text-gray-700">{doc.name}</p>
                <div className="flex items-center gap-3">
                  <a
                    href={getPublicUrl(doc.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline"
                  >
                    📥 Télécharger
                  </a>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(doc.name)}
                      className="text-red-600 hover:underline"
                    >
                      🗑️ Supprimer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
