// pages/immopro/ajouter/etape4.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function Etape4() {
  const router = useRouter()
  const [form, setForm] = useState({})

  useEffect(() => {
    document.title = "Étape 4 – Propriétaire ou Société"
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push({
      pathname: "/immopro/ajouter/confirmation",
      query: { ...form }
    })
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">👨‍🏢 Étape 4 : Propriétaire ou société</h1>
      <p className="text-gray-600">
        Renseignez les informations sur le vendeur ou la société, ainsi que le mandat associé.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nom_structure"
          placeholder="Nom du propriétaire ou de la société"
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="text"
          name="numero_mandat"
          placeholder="Numéro de mandat"
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="date"
          name="date_mandat"
          placeholder="Date du mandat"
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <button
          type="submit"
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Valider et terminer ➡️
        </button>
      </form>
    </div>
  )
}
