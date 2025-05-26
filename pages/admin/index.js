import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    const checkAdmin = async () => {
      const session = await supabase.auth.getSession()
      const userId = session.data?.session?.user?.id

      if (!userId) return

      const { data: userData } = await supabase
        .from("utilisateurs")
        .select("role")
        .eq("id", userId)
        .single()

      if (userData?.role === "admin") {
        setIsAdmin(true)
      }
    }

    checkAdmin()
  }, [])

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

  const fetchDocuments = async () => {
    const { data, error } = await supabase.storage.from("documents").list("", { limit: 100 })
    if (error) {
      console.error("Erreur récupération fichiers :", error)
    } else {
      setDocuments(data)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">⚙️ Espace Administration</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => router.push("/admin/parametres/utilisateurs")}
          className="bg-orange-500 text-white px-5 py-4 rounded shadow hover:bg-orange-600 transition"
        >
          👥 Gérer les utilisateurs
        </button>

        <button
          onClick={() => router.push("/admin/export")}
          className="bg-blue-500 text-white px-5 py-4 rounded shadow hover:bg-blue-600 transition"
        >
          🌍 Plateformes d’export
        </button>

        <button
          onClick={() => router.push("/admin/site")}
          className="bg-green-500 text-white px-5 py-4 rounded shadow hover:bg-green-600 transition"
        >
          🖥️ Gestion du site vitrine
        </button>

        <button
          onClick={() => router.push("/admin/pdf")}
          className="bg-red-500 text-white px-5 py-4 rounded shadow hover:bg-red-600 transition"
        >
          📰 Uploader une newsletter
        </button>

        <button
          onClick={() => router.push("/admin/crm")}
          className="bg-purple-500 text-white px-5 py-4 rounded shadow hover:bg-purple-600 transition"
        >
          🛠️ Personnalisation CRM
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => router.push("/admin/documents")}
              className="bg-yellow-500 text-white px-5 py-4 rounded shadow hover:bg-yellow-600 transition"
            >
              📁 Gestion des documents
            </button>

            <button
  onClick={() => router.push("/admin/boutique")}
  className="bg-pink-500 text-white px-5 py-4 rounded shadow hover:bg-pink-600 transition"
>
  🛒 Gérer la boutique
</button>

            <button
              onClick={() => router.push("/admin/agences/ajouter")}
              className="bg-indigo-500 text-white px-5 py-4 rounded shadow hover:bg-indigo-600 transition"
            >
              🏢 Créer une agence
            </button>

            {/* Nouveau bouton pour accéder au registre des mandats */}
            <button
              onClick={() => router.push("/admin/mandats")}
              className="bg-teal-500 text-white px-5 py-4 rounded shadow hover:bg-teal-600 transition"
            >
              📜 Registre des mandats
            </button>
          </>
        )}
      </div>

      {isAdmin && (
        <div className="mt-10 bg-white p-6 border rounded-xl shadow space-y-4">
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

      {isAdmin && (
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

                    <button
                      onClick={() => handleDelete(doc.name)}
                      className="text-red-600 hover:underline"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
