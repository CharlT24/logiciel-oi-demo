// Étape 2 complète avec IA + Pièces + tous champs visibles + amélioration chauffage + % honoraires
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"
import Link from "next/link"

export default function Etape2() {
  const router = useRouter()
  const { id } = router.query

const [formData, setFormData] = useState({
  surface_m2: "",
  nb_pieces: "",
  nb_chambres: "",
  etage: "",
  dpe_conso_indice: "",
  dpe_ges_indice: "",
  energie_finale_kwh: "",
  dpe_vierge: false,
  type_chauffage: "",
  type_chauffage_secondaire: "",
  annee_construction: "",
  surface_terrain: "",
  surface_carrez: "",
  prix_vente: "",
  prix_net_vendeur: "",
  honoraires: "",
  pourcentage_honoraires: "",
  taxe_fonciere: "",
  quote_part_charges: "",
  fonds_travaux: "",
  charge_vendeur: false,
  charge_acquereur: false,
  description: "",

  // 🆕 Champs ajoutés
  type_offre: "V",
  loyer_mensuel: "",
  honoraires_location: "",
  bareme: "",
  dpe_etiquette_conso: "",
  dpe_etiquette_ges: "",
  dpe_date_realisation: "",
  date_indice_prix_energies: "",
  montant_depenses_energies_min: "",
  montant_depenses_energies_max: "",
  montant_depense_energie_estime: "",
  altitude: "",
});
    

  const [error, setError] = useState(null)
  const [pieces, setPieces] = useState([])
  const [newPiece, setNewPiece] = useState({ nom: "", surface: "" })
  const [generating, setGenerating] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value
    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue }
      if (["prix_net_vendeur", "honoraires"].includes(name)) {
        const prixNet = parseFloat(name === "prix_net_vendeur" ? value : prev.prix_net_vendeur || 0)
        const honoraires = parseFloat(name === "honoraires" ? value : prev.honoraires || 0)
        updated.prix_vente = (prixNet + honoraires).toFixed(2)
        updated.pourcentage_honoraires = prixNet > 0 ? ((honoraires / prixNet) * 100).toFixed(2) : ""
      }
      return updated
    })
  }

  const toFloat = (v) => v === "" ? null : parseFloat(v)
  const toInt = (v) => v === "" ? null : parseInt(v)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.dpe_vierge && (!formData.dpe_conso_indice || !formData.dpe_ges_indice)) {
      setError("Veuillez renseigner les indices DPE ou cocher 'DPE vierge'")
      return
    }
    const rawUpdates = {
      ...formData,
      surface_m2: toFloat(formData.surface_m2),
      nb_pieces: toInt(formData.nb_pieces),
      nb_chambres: toInt(formData.nb_chambres),
      prix_vente: toFloat(formData.prix_vente),
      prix_net_vendeur: toFloat(formData.prix_net_vendeur),
      honoraires: toFloat(formData.honoraires),
      pourcentage_honoraires: toFloat(formData.pourcentage_honoraires),
      dpe_cout_min: toInt(formData.dpe_cout_min),
      dpe_cout_max: toInt(formData.dpe_cout_max),
      energie_finale_kwh: toInt(formData.energie_finale_kwh),
      taxe_fonciere: toInt(formData.taxe_fonciere),
      quote_part_charges: toInt(formData.quote_part_charges),
      fonds_travaux: toInt(formData.fonds_travaux),
      pieces: JSON.stringify(pieces)
    }

    const updates = Object.fromEntries(Object.entries(rawUpdates).filter(([_, v]) => v !== "" && v !== undefined))
    const { error } = await supabase.from("biens").update(updates).eq("id", id)
    if (error) {
      console.error("❌ Erreur Supabase :", error)
      setError("Erreur lors de la mise à jour")
    } else {
      router.push(`/biens/ajouter/etape3?id=${id}`)
    }
  }

  const addPiece = () => {
    const nomFinal = newPiece.nom === "Autre" ? newPiece.nomCustom : newPiece.nom;
    if (!nomFinal || !newPiece.surface) return;
  
    setPieces([...pieces, { nom: nomFinal, surface: newPiece.surface }]);
    setNewPiece({ nom: "", nomCustom: "", surface: "" });
  }  

  const handleGenerateDescription = async () => {
    setGenerating(true)
    const res = await fetch("/api/ia/description", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titre: "Bien immobilier",
        surface: formData.surface_m2,
        ville: "ville inconnue",
        prix: formData.prix_vente,
        type: "appartement ou maison",
        description: formData.description,
        pieces
      })
    })
    const data = await res.json()
    setFormData((prev) => ({ ...prev, description: data.description }))
    setGenerating(false)
  }

  const typesChauffage = [
    "Aucun", "Gaz", "Électrique", "Fioul", "Bois", "Pompe à chaleur", "Solaire", "Climatisation réversible", "Réseau urbain", "Autre"
  ]

  const listePieces = [
    "Salon",
    "Salle à manger",
    "Cuisine",
    "Chambre",
    "Salle de bain",
    "Salle d'eau",
    "WC",
    "Bureau",
    "Buanderie",
    "Dressing",
    "Garage",
    "Cave",
    "Grenier",
    "Terrasse",
    "Balcon",
    "Véranda",
    "Autre"
  ];  

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-10 mt-10 space-y-6 border">
      <h1 className="text-3xl font-bold text-orange-600">📐 Étape 2 : Caractéristiques détaillées</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <Input label="Surface (m²)*" name="surface_m2" value={formData.surface_m2} onChange={handleChange} required />
        <Input label="Surface terrain (m²)" name="surface_terrain" value={formData.surface_terrain} onChange={handleChange} />
        <Input label="Surface Carrez" name="surface_carrez" value={formData.surface_carrez} onChange={handleChange} />
        <Input label="Nombre de pièces*" name="nb_pieces" value={formData.nb_pieces} onChange={handleChange} required />
        <Input label="Nombre de chambres" name="nb_chambres" value={formData.nb_chambres} onChange={handleChange} />
        <Input label="Étage" name="etage" value={formData.etage} onChange={handleChange} />
<Select label="DPE - Étiquette conso" name="dpe_etiquette_conso" value={formData.dpe_etiquette_conso} onChange={handleChange}
  options={["A", "B", "C", "D", "E", "F", "G"]} />

<Select label="DPE - Étiquette GES" name="dpe_etiquette_ges" value={formData.dpe_etiquette_ges} onChange={handleChange}
  options={["A", "B", "C", "D", "E", "F", "G"]} />

<Input label="Indice consommation (kWhEP/m².an)" name="dpe_conso_indice" value={formData.dpe_conso_indice} onChange={handleChange} />
<Input label="Indice GES (kg CO₂/m².an)" name="dpe_ges_indice" value={formData.dpe_ges_indice} onChange={handleChange} />
<Input label="Énergie finale (kWh/an)" name="energie_finale_kwh" value={formData.energie_finale_kwh} onChange={handleChange} />
<Input label="Date de réalisation DPE" name="dpe_date_realisation" value={formData.dpe_date_realisation} onChange={handleChange} />

<label className="col-span-2 inline-flex items-center mt-2">
  <input type="checkbox" name="dpe_vierge" checked={formData.dpe_vierge} onChange={handleChange} className="mr-2" />
  Ce bien est <strong className="ml-1">exempté de DPE (vierge)</strong>
</label>
        <Select label="Type de chauffage" name="type_chauffage" value={formData.type_chauffage} onChange={handleChange} options={typesChauffage} />
        <Select label="Type de chauffage secondaire"name="type_chauffage_secondaire"value={formData.type_chauffage_secondaire} onChange={handleChange}options={typesChauffage}/>
        <Input label="Mode de chauffage" name="mode_chauffage" value={formData.mode_chauffage} onChange={handleChange} />
        <Input label="Année de construction" name="annee_construction" value={formData.annee_construction} onChange={handleChange} />
        <Input label="Prix net vendeur (€)*" name="prix_net_vendeur" value={formData.prix_net_vendeur} onChange={handleChange} required />
        <Input label="Honoraires (€)*" name="honoraires" value={formData.honoraires} onChange={handleChange} required />
        <Input label="% Honoraires" name="pourcentage_honoraires" value={formData.pourcentage_honoraires} onChange={handleChange} readOnly />
        <Input label="💰 Prix total affiché (€)" name="prix_vente" value={formData.prix_vente} onChange={handleChange} readOnly />
        <Input label="Taxe foncière (€)" name="taxe_fonciere" value={formData.taxe_fonciere} onChange={handleChange} />
        <Input label="Quote-part annuelle (€)" name="quote_part_charges" value={formData.quote_part_charges} onChange={handleChange} />
        <Input label="Fonds travaux (€)" name="fonds_travaux" value={formData.fonds_travaux} onChange={handleChange} />
        <Select label="Type d'offre" name="type_offre" value={formData.type_offre} onChange={handleChange}
  options={["V", "L", "S", "F", "B", "W", "G"]} />

<Input label="Loyer mensuel (€)" name="loyer_mensuel" value={formData.loyer_mensuel} onChange={handleChange} />
<Input label="Honoraires location (€)" name="honoraires_location" value={formData.honoraires_location} onChange={handleChange} />
<Input label="Barème d'honoraires" name="bareme" value={formData.bareme} onChange={handleChange} />

<Input label="Altitude (m)" name="altitude" value={formData.altitude} onChange={handleChange} />


        <div className="col-span-2 space-x-6">
  <label className="inline-flex items-center">
    <input type="checkbox" name="charge_vendeur" checked={formData.charge_vendeur} onChange={handleChange} className="mr-2" />
    Charge vendeur
  </label>
  <label className="inline-flex items-center">
    <input type="checkbox" name="charge_acquereur" checked={formData.charge_acquereur} onChange={handleChange} className="mr-2" />
    Charge acquéreur
  </label>
</div>

        <div className="col-span-2">
          <h2 className="text-lg font-semibold text-orange-500 mb-2">🧱 Pièces du bien</h2>
          <div className="flex gap-4 mb-2">
  <select
    value={newPiece.nom}
    onChange={(e) => setNewPiece({ ...newPiece, nom: e.target.value })}
    className="input w-full"
  >
    <option value="">-- Sélectionner une pièce --</option>
    {listePieces.map((piece) => (
      <option key={piece} value={piece}>{piece}</option>
    ))}
  </select>

  {newPiece.nom === "Autre" && (
    <input
      type="text"
      placeholder="Nom personnalisé"
      value={newPiece.nomCustom || ""}
      onChange={(e) => setNewPiece({ ...newPiece, nomCustom: e.target.value })}
      className="input w-full"
    />
  )}

  <input
    value={newPiece.surface}
    onChange={(e) => setNewPiece({ ...newPiece, surface: e.target.value })}
    placeholder="Surface en m²"
    className="input w-1/3"
  />
  
  <button type="button" onClick={addPiece} className="bg-orange-600 text-white px-4 rounded">
    ➕ Ajouter
  </button>
</div>
          {pieces.length > 0 && (
            <ul className="space-y-1 text-sm text-gray-700">
              {pieces.map((p, i) => (
                <li key={i}>• {p.nom} - {p.surface} m²</li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-span-2">
          <label className="block font-medium mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="w-full border border-gray-300 rounded px-3 py-2" />
          <button type="button" onClick={handleGenerateDescription} disabled={generating} className="mt-2 bg-blue-600 text-white text-sm px-4 py-1 rounded hover:bg-blue-700">
            {generating ? "✍️ Rédaction en cours..." : "🪄 Générer avec l'IA"}
          </button>
          <p className="text-sm text-gray-500 mt-1">
            Cette phrase est obligatoire : <br />
            <em>Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site <a href="https://www.georisques.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-orange-600 underline">Géorisques</a>.</em>
          </p>
        </div>

        <div className="col-span-2 flex justify-between mt-6">
          <Link href={`/biens/ajouter/etape1?id=${id}`} className="text-sm text-orange-600 hover:underline">⬅️ Retour étape 1</Link>
          <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded font-semibold">➡️ Étape suivante</button>
        </div>
      </form>
    </div>
  )
}

function Input({ label, name, value, onChange, required = false, readOnly = false }) {
  return (
    <div>
      <label className="block font-medium text-sm mb-1">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        className={`w-full border border-gray-300 rounded px-3 py-2 ${readOnly ? 'bg-gray-100' : ''}`}
        type="text"
      />
    </div>
  )
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block font-medium text-sm mb-1">{label}</label>
      <select name={name} value={value} onChange={onChange} className="w-full border border-gray-300 rounded px-3 py-2">
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}
