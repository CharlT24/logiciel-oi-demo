import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "@/lib/supabaseClient";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, Table, TableRow, TableCell, WidthType } from "docx";
import { saveAs } from "file-saver";

export default function NouvelleEstimation() {
  const router = useRouter();
  const [agentId, setAgentId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    titre: "",
    type_bien: "",
    mandat: "",
    statut: "estimation",
    departement: "",
    ville: "",
    code_postal: "",
    adresse_bien: "",
    surface_m2: "",
    terrain_m2: "",
    nb_pieces: "",
    nb_chambres: "",
    annee_construction: "",
    type_chauffage: "",
    mode_chauffage: "",
    dpe: "",
    dpe_conso_indice: "",
    dpe_ges_indice: "",
    exposition: "",
    travaux: "",
    localisation: "",
    vente: false,
    location: false,
    note_elements_principaux: 10,
    note_energie: 10,
    note_sanitaires: 10,
    note_chambres: 10,
    note_cuisine: 10,
    note_sejour: 10,
    note_criteres_generaux: 10,
    note_environnement: 10,
    note_autres_elements: 10,
  });

  const [prixM2Data, setPrixM2Data] = useState([]);
  const [estimation, setEstimation] = useState(null);

  const generateWordDoc = async () => {
    const logoResponse = await fetch("/logo.png");
    const logoBuffer = await logoResponse.arrayBuffer();

    const header = new Paragraph({
      children: [
        new ImageRun({ data: logoBuffer, transformation: { width: 100, height: 50 } }),
        new TextRun({ text: "  Avis de valeur", bold: true, size: 32 })
      ],
      spacing: { after: 400 },
    });

    const rows = [
      ["Adresse", `${formData.adresse_bien}, ${formData.ville} ${formData.code_postal}`],
      ["Type de bien", formData.type_bien],
      ["Surface habitable", `${formData.surface_m2} m²`],
      ["Surface terrain", formData.terrain_m2 ? `${formData.terrain_m2} m²` : "-"],
      ["Nombre de pièces", formData.nb_pieces],
      ["Nombre de chambres", formData.nb_chambres],
      ["Année de construction", formData.annee_construction],
      ["Chauffage", `${formData.type_chauffage} (${formData.mode_chauffage})`],
      ["DPE", `${formData.dpe} (${formData.dpe_conso_indice} kWh/m²/an, ${formData.dpe_ges_indice} kgCO₂/m²/an)`],
      ["Exposition", formData.exposition],
      ["Travaux", formData.travaux],
      ["Localisation", formData.localisation],
    ];

    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: rows.map(([key, value]) =>
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: key, bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: value || "-" })] }),
          ]
        })
      ),
    });

    const estText = estimation ?
      `💶 Valeur estimée entre ${estimation.prixBas.toLocaleString()} € et ${estimation.prixHaut.toLocaleString()} €` :
      "Estimation non disponible";

    const paragraphs = [
      header,
      new Paragraph({ text: estText, spacing: { after: 400 }, bold: true }),
      table
    ];

    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(formData.ville)}&zoom=14&size=600x300&key=VOTRE_CLE_API_GOOGLE`;
    try {
      const mapBlob = await fetch(mapUrl).then(r => r.blob());
      const mapBuffer = await mapBlob.arrayBuffer();
      paragraphs.push(new Paragraph({
        children: [new ImageRun({ data: mapBuffer, transformation: { width: 600, height: 300 } })],
        spacing: { after: 300 }
      }));
    } catch (err) {
      console.warn("Erreur chargement carte Google Maps:", err);
    }

    const doc = new Document({
      sections: [{ children: paragraphs }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Avis_de_valeur_${formData.ville}.docx`);
  };

  const handleSubmit = async () => {
    if (!agentId) {
      console.error("Aucun agent connecté !");
      return;
    }

    try {
const cleanedData = {
  ...formData,
  surface_m2: formData.surface_m2 ? Number(formData.surface_m2) : null,
  terrain_m2: formData.terrain_m2 ? Number(formData.terrain_m2) : null,
  nb_pieces: formData.nb_pieces ? Number(formData.nb_pieces) : null,
  nb_chambres: formData.nb_chambres ? Number(formData.nb_chambres) : null,
  annee_construction: formData.annee_construction ? Number(formData.annee_construction) : null,
  dpe_conso_indice: formData.dpe_conso_indice ? Number(formData.dpe_conso_indice) : null,
  dpe_ges_indice: formData.dpe_ges_indice ? Number(formData.dpe_ges_indice) : null,
  note_elements_principaux: Number(formData.note_elements_principaux),
  note_energie: Number(formData.note_energie),
  note_sanitaires: Number(formData.note_sanitaires),
  note_chambres: Number(formData.note_chambres),
  note_cuisine: Number(formData.note_cuisine),
  note_sejour: Number(formData.note_sejour),
  note_criteres_generaux: Number(formData.note_criteres_generaux),
  note_environnement: Number(formData.note_environnement),
  note_autres_elements: Number(formData.note_autres_elements),
  estimation: estimation?.prixBas || null,
  created_at: new Date(),
  agent_id: agentId
};

const { data, error } = await supabase
  .from('biens')
  .insert([cleanedData]);

      console.log("Estimation enregistrée avec succès :", data);
      router.push("/biens");
    } catch (err) {
      console.error("Erreur serveur :", err.message);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const id = session?.user?.id;
      if (!id) router.push("/login");
      else {
        setAgentId(id);
        setLoading(false);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    fetch("/api/prixm2")
      .then((res) => res.json())
      .then((data) => setPrixM2Data(data))
      .catch((err) => console.error("Erreur chargement prixm2:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : type === "range" ? parseInt(value, 10) : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleVilleInput = async (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, ville: value }));

    if (value.length > 2) {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(value)}&types=(cities)&key=VOTRE_CLE_API_GOOGLE&language=fr`;
        const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
        const data = await res.json();

        if (data.predictions?.length > 0) {
          const placeId = data.predictions[0].place_id;
          const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=VOTRE_CLE_API_GOOGLE&language=fr`;
          const detailRes = await fetch(`/api/proxy?url=${encodeURIComponent(detailUrl)}`);
          const detailData = await detailRes.json();

          const cpFound = detailData?.result?.address_components?.find((c) =>
            c.types.includes("postal_code")
          )?.long_name;

          if (cpFound) {
            setFormData((prev) => ({ ...prev, code_postal: cpFound }));
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'autocomplétion de la ville:", error);
      }
    }
  };

  useEffect(() => {
    if (formData.departement && formData.surface_m2 && formData.type_bien && prixM2Data.length > 0) {
      const deptData = prixM2Data.find(
        (d) => d.departement === formData.departement && d.type_bien === formData.type_bien
      );

      if (!deptData) {
        setEstimation(null);
        return;
      }

      let prixM2Base = deptData.prix_m2 || 2000;

      if (formData.travaux === "à rénover") prixM2Base *= 0.8;
      else if (formData.travaux === "refait à neuf") prixM2Base *= 1.1;

      if (formData.localisation === "excellente") prixM2Base *= 1.1;
      else if (formData.localisation === "mauvaise") prixM2Base *= 0.9;

      const surface = formData.type_bien === "Terrain"
        ? parseFloat(formData.terrain_m2)
        : parseFloat(formData.surface_m2);

      let prixBas = surface * prixM2Base * 0.95;
      let prixHaut = surface * prixM2Base * 1.05;

      // Prise en compte des notes
      const notes = [
        formData.note_elements_principaux,
        formData.note_energie,
        formData.note_sanitaires,
        formData.note_chambres,
        formData.note_cuisine,
        formData.note_sejour,
        formData.note_criteres_generaux,
        formData.note_environnement,
        formData.note_autres_elements,
      ];
      const moyenneNotes = notes.reduce((sum, note) => sum + note, 0) / notes.length;

// Calcul de l'ajustement cumulatif
let ajustementTotal = 0;
notes.forEach((note) => {
  const ecart = note - 10;
  ajustementTotal += ecart * 0.02; // chaque point = ±2%
});

prixBas *= 1 + ajustementTotal;
prixHaut *= 1 + ajustementTotal;

      setEstimation({ prixBas: Math.round(prixBas), prixHaut: Math.round(prixHaut) });
    }
  }, [formData, prixM2Data]);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-10">
      <h1 className="text-3xl font-bold text-orange-600">📊 Nouvelle Estimation - Bien Immobilier</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <TextInput label="Titre" name="titre" value={formData.titre} onChange={handleChange} />
        <TextInput label="Adresse" name="adresse_bien" value={formData.adresse_bien} onChange={handleChange} />
        <select name="departement" value={formData.departement} onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="">-- Sélectionner Département --</option>
          {[...new Set(prixM2Data.map((d) => d.departement))].sort().map((dep) => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>
        <select name="type_bien" value={formData.type_bien} onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="">-- Sélectionner Type de Bien --</option>
          <option value="Appartement">Appartement</option>
          <option value="Maison">Maison</option>
          <option value="Immeuble">Immeuble</option>
          <option value="Terrain">Terrain</option>
          <option value="Local Commercial">Local Commercial</option>
        </select>
        <input type="text" name="ville" value={formData.ville} onChange={handleVilleInput} placeholder="Ville" className="w-full border rounded px-3 py-2 shadow-sm focus:ring-orange-500 focus:border-orange-500" />
        <TextInput label="Code Postal" name="code_postal" value={formData.code_postal} onChange={handleChange} />
        <TextInput label="Surface (m²)" name="surface_m2" value={formData.surface_m2} onChange={handleChange} />
        <TextInput label="Terrain (m²)" name="terrain_m2" value={formData.terrain_m2} onChange={handleChange} />
        <TextInput label="Nombre de pièces" name="nb_pieces" value={formData.nb_pieces} onChange={handleChange} />
        <TextInput label="Nombre de chambres" name="nb_chambres" value={formData.nb_chambres} onChange={handleChange} />
        <TextInput label="Année de construction" name="annee_construction" value={formData.annee_construction} onChange={handleChange} />
        <TextInput label="Type de chauffage" name="type_chauffage" value={formData.type_chauffage} onChange={handleChange} />
        <TextInput label="Mode de chauffage" name="mode_chauffage" value={formData.mode_chauffage} onChange={handleChange} />
        <TextInput label="DPE" name="dpe" value={formData.dpe} onChange={handleChange} />
        <TextInput label="Conso énergie" name="dpe_conso_indice" value={formData.dpe_conso_indice} onChange={handleChange} />
        <TextInput label="Émission GES" name="dpe_ges_indice" value={formData.dpe_ges_indice} onChange={handleChange} />
        <TextInput label="Exposition" name="exposition" value={formData.exposition} onChange={handleChange} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 pt-8">
        <RangeInput label="Éléments principaux" name="note_elements_principaux" value={formData.note_elements_principaux} onChange={handleChange} />
        <RangeInput label="Énergie" name="note_energie" value={formData.note_energie} onChange={handleChange} />
        <RangeInput label="Sanitaires" name="note_sanitaires" value={formData.note_sanitaires} onChange={handleChange} />
        <RangeInput label="Chambres" name="note_chambres" value={formData.note_chambres} onChange={handleChange} />
        <RangeInput label="Cuisine" name="note_cuisine" value={formData.note_cuisine} onChange={handleChange} />
        <RangeInput label="Séjour" name="note_sejour" value={formData.note_sejour} onChange={handleChange} />
        <RangeInput label="Critères généraux" name="note_criteres_generaux" value={formData.note_criteres_generaux} onChange={handleChange} />
        <RangeInput label="Environnement" name="note_environnement" value={formData.note_environnement} onChange={handleChange} />
        <RangeInput label="Autres éléments" name="note_autres_elements" value={formData.note_autres_elements} onChange={handleChange} />
      </div>

      {estimation && (
        <div className="mt-8 p-4 border rounded bg-gray-50 text-center">
          <h2 className="text-xl font-semibold mb-2">Estimation du Bien</h2>
          <p className="text-lg text-green-700">
            Entre {Number(estimation.prixBas).toLocaleString()} € et {Number(estimation.prixHaut).toLocaleString()} €
          </p>
        </div>
      )}

      <div className="pt-8">
        <label className="block text-sm font-medium mb-1">📸 Photo de couverture</label>
        <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} className="mb-4" />
        <label className="block text-sm font-medium mb-1">🖼️ Galerie de photos</label>
        <input type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles(Array.from(e.target.files))} />
      </div>

      <div className="flex justify-end pt-6 gap-4">
        <button onClick={generateWordDoc} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
          📄 Exporter Word
        </button>
        <button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-3 rounded-xl">
          ✅ Enregistrer l’estimation
        </button>
      </div>
    </div>
  );
}

function TextInput({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
      />
    </div>
  );
}

function RangeInput({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block font-medium text-sm text-gray-700 mb-1">
        {label}: {value}/20
      </label>
      <input
        type="range"
        name={name}
        value={value}
        min="0"
        max="20"
        step="1"
        onChange={onChange}
        className="w-full accent-orange-600"
      />
    </div>
  );
}
