// pages/immopro/ajouter/etape2.js
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

export default function Etape2() {
  const router = useRouter()
  const [formData, setFormData] = useState({})
  const { type } = router.query

  useEffect(() => {
    document.title = "Étape 2 – Informations sur le bien pro"
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push({
      pathname: "/immopro/ajouter/etape3",
      query: { ...formData, type }
    })
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">🏢 Étape 2 : Informations sur le bien professionnel</h1>
      <p className="text-gray-600">
        Remplissez les informations importantes selon le type de bien. Tous les champs sont facultatifs.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" name="surface" placeholder="Surface en m²" onChange={handleChange} className="border p-2 rounded w-full" />
          <input type="number" name="prix" placeholder="Prix HT ou net vendeur" onChange={handleChange} className="border p-2 rounded w-full" />
          <input type="text" name="ville" placeholder="Ville" onChange={handleChange} className="border p-2 rounded w-full" />
          <input type="text" name="adresse" placeholder="Adresse exacte" onChange={handleChange} className="border p-2 rounded w-full" />
          <input type="text" name="disponibilite" placeholder="Disponibilité (immédiate, date...)" onChange={handleChange} className="border p-2 rounded w-full" />
          <input type="text" name="destination" placeholder="Destination (commerce, bureau...)" onChange={handleChange} className="border p-2 rounded w-full" />
          <input type="text" name="etat" placeholder="Etat (neuf, rénové...)" onChange={handleChange} className="border p-2 rounded w-full" />
          <input type="text" name="accessibilite" placeholder="Accessibilité (PMR, parking...)" onChange={handleChange} className="border p-2 rounded w-full" />
        </div>

        {type === "fonds_de_commerce" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-orange-500 mt-6">Informations Fonds de commerce</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" name="activite" placeholder="Activité exploitée (ex : restauration, coiffure...)" onChange={handleChange} className="border p-2 rounded w-full" />
              <input type="text" name="chiffre_affaires" placeholder="Chiffre d'affaires annuel (approx.)" onChange={handleChange} className="border p-2 rounded w-full" />
              <input type="text" name="ebe" placeholder="EBE (Excédent Brut d'Exploitation)" onChange={handleChange} className="border p-2 rounded w-full" />
              <input type="text" name="bail" placeholder="Type de bail / Durée restante" onChange={handleChange} className="border p-2 rounded w-full" />
              <input type="text" name="loyer" placeholder="Montant du loyer mensuel HT" onChange={handleChange} className="border p-2 rounded w-full" />
              <input type="text" name="charges" placeholder="Charges annuelles approximatives" onChange={handleChange} className="border p-2 rounded w-full" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-orange-500 mt-6">Description du bien</h2>
          <textarea
            name="description"
            rows="5"
            placeholder="Description libre, points forts, situation, etc."
            onChange={handleChange}
            className="border p-2 rounded w-full"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Continuer ➡️
        </button>
      </form>
    </div>
  )
}
