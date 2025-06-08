import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import supabase from "@/lib/supabaseClient"
import Image from "next/image"
import Link from "next/link"

export default function Etape3UploadPhotos() {
  const router = useRouter()
  const { id } = router.query

  const [coverFile, setCoverFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [coverPreview, setCoverPreview] = useState(null)
  const [galleryPreviews, setGalleryPreviews] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (!id) return
    console.log("🔍 ID du bien :", id)
  }, [id])

  const handleUpload = async () => {
    if (!id) return alert("ID de bien manquant.")

    try {
      let totalUploads = galleryFiles.length + (coverFile ? 1 : 0)
      let uploadsDone = 0

      // 📸 Upload cover
      if (coverFile) {
        const { error: coverError } = await supabase.storage
          .from("photos")
          .upload(`covers/${id}/cover.jpg`, coverFile, {
            upsert: true,
          })

        if (coverError) throw coverError

        uploadsDone++
        setUploadProgress(Math.round((uploadsDone / totalUploads) * 100))
      }

      // 🖼️ Upload galerie
      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i]
        const filename = `${Date.now()}-${i}-${file.name}`

        const { error } = await supabase.storage
          .from("photos")
          .upload(`gallery/${id}/${filename}`, file, {
            upsert: true,
          })

        if (error) throw error

        uploadsDone++
        setUploadProgress(Math.round((uploadsDone / totalUploads) * 100))
      }

      alert("✅ Photos uploadées avec succès")
      router.push(`/biens/ajouter/etape4?id=${id}`)
    } catch (error) {
      console.error("❌ Erreur d’upload :", error)
      alert("Erreur lors de l’upload")
    }
  }

  const previewFile = (file, setPreview) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const previewGallery = (files) => {
    const previews = []
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        previews.push(reader.result)
        if (previews.length === files.length) {
          setGalleryPreviews(previews)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-orange-600">📸 Étape 3 : Ajoutez des photos</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* COVER */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4 border">
          <h2 className="font-semibold text-gray-800">🖼️ Photo de couverture</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0]
              if (file) {
                setCoverFile(file)
                previewFile(file, setCoverPreview)
              }
            }}
            className="text-sm"
          />
          {coverPreview && (
            <Image
              src={coverPreview}
              alt="Preview"
              width={400}
              height={300}
              className="rounded border mt-2 object-cover"
            />
          )}
        </div>

        {/* GALERIE */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4 border">
          <h2 className="font-semibold text-gray-800">🗂️ Galerie (jusqu’à 20 photos)</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files)
              if (files.length > 20) {
                alert("❌ Vous pouvez uploader maximum 20 photos.")
                return
              }
              setGalleryFiles(files)
              previewGallery(files)
            }}
            className="text-sm"
          />
          <div className="grid grid-cols-3 gap-2 mt-2">
            {galleryPreviews.map((src, idx) => (
              <Image
                key={idx}
                src={src}
                alt={`photo-${idx}`}
                width={150}
                height={150}
                className="rounded object-cover border"
              />
            ))}
          </div>
        </div>
      </div>

      {/* PROGRESS BAR */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-orange-500 h-4 transition-all"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex justify-between">
        <Link
          href={`/biens/ajouter/etape2?id=${id}`}
          className="text-sm text-orange-600 hover:underline"
        >
          ⬅️ Retour à l’étape 2
        </Link>
        <button
          onClick={handleUpload}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded shadow"
        >
          ✅ Enregistrer et passer à l’étape 4
        </button>
      </div>
    </div>
  )
}
