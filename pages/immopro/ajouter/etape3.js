// pages/immopro/ajouter/etape3.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function Etape3() {
  const router = useRouter()
  const [files, setFiles] = useState([])

  useEffect(() => {
    document.title = "Étape 3 – Photos du bien pro"
  }, [])

  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...dropped])
  }

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files)
    setFiles((prev) => [...prev, ...selected])
  }

  const handleNext = () => {
    if (files.length === 0) return alert("Merci d'ajouter au moins une photo")
    router.push("/immopro/ajouter/etape4")
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">🌇 Étape 3 : Photos du bien professionnel</h1>
      <p className="text-gray-600">Ajoutez les photos du bien en glissant-déposant ou via l'explorateur de fichiers.</p>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-orange-300 bg-orange-50 rounded-xl p-10 text-center cursor-pointer"
      >
        <p className="text-sm text-gray-600">
          Glissez-déposez vos fichiers ici ou cliquez ci-dessous :
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="mt-4"
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {files.map((file, index) => (
            <div key={index} className="aspect-video overflow-hidden rounded-lg border">
              <img
                src={URL.createObjectURL(file)}
                alt={`photo-${index}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleNext}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
      >
        Continuer ➡️
      </button>
    </div>
  )
}
