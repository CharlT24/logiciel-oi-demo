// 🔧 Fichier modifié : ModifierBien avec intégration complète des étapes 1 à 4 + DPE, GES, prix, mandat + galerie et cover
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { ReactSortable } from "react-sortablejs";

const OPTIONS_LIST = [
  "Chauffage individuel", "Climatisation", "Double vitrage", "Fibre optique",
  "Jardin", "Terrasse", "Balcon", "Piscine", "Garage", "Cave", "Ascenseur",
  "Interphone", "Portail automatique", "Accès PMR", "Séjour lumineux", "Cuisine équipée",
  "Cuisine américaine", "Suite parentale", "Combles aménageables", "Alarme", "Vue dégagée",
  "Vue mer", "Parking", "Exposition Sud", "Exposition Est", "Exposition Nord", "Exposition Ouest",
  "Dernier étage", "Plain-pied"
];

export default function ModifierBien() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [newPiece, setNewPiece] = useState({ nom: "", nomCustom: "", surface: "" });
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showAutre, setShowAutre] = useState(false);
  const [autreText, setAutreText] = useState("");
  const [typesBienDisponibles, setTypesBienDisponibles] = useState([]);

  useEffect(() => {
    const fetchBien = async () => {
      if (!id) return;
      const { data, error } = await supabase.from("biens").select("*").eq("id", id).single();
      if (error) console.error("Erreur chargement du bien:", error);
      else {
        let safeGallery = [];
        try {
          safeGallery = Array.isArray(data.gallery) ? data.gallery : JSON.parse(data.gallery || "[]");
        } catch (e) {
          console.warn("Gallery parsing error:", e);
        }
        setFormData({ ...data, gallery: safeGallery });
        setPieces(data.pieces ? JSON.parse(data.pieces) : []);
        setSelectedOptions(data.options || []);
      }
      setLoading(false);
    };
    fetchBien();
  }, [id]);

  useEffect(() => {
    const fetchTypes = async () => {
      const { data, error } = await supabase.from("types_ubiflow").select("label").order("label", { ascending: true });
      if (!error) setTypesBienDisponibles(data.map((t) => t.label));
    };
    fetchTypes();
  }, []);  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const addPiece = () => {
    const nomFinal = newPiece.nom === "Autre" ? newPiece.nomCustom : newPiece.nom;
    if (!nomFinal || !newPiece.surface) return;
    setPieces([...pieces, { nom: nomFinal, surface: newPiece.surface }]);
    setNewPiece({ nom: "", nomCustom: "", surface: "" });
  };

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileName = "cover.jpg";
    const path = `covers/${id}/${fileName}`;
    await supabase.storage.from("photos").upload(path, file, { upsert: true });
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    const galleryNames = [];
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${ext}`;
      const path = `gallery/${id}/${fileName}`;
      const { error } = await supabase.storage.from("photos").upload(path, file);
      if (!error) galleryNames.push(fileName);
    }
    setFormData((prev) => ({ ...prev, gallery: [...(prev.gallery || []), ...galleryNames] }));
  };

  const handleDeleteGalleryImage = async (imgName) => {
    const path = `gallery/${id}/${imgName}`;
    const { error } = await supabase.storage.from("photos").remove([path]);
    if (!error) {
      setFormData((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((img) => img !== imgName),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = {
      ...formData,
      pieces: JSON.stringify(pieces),
      options: showAutre && autreText.trim() ? [...selectedOptions, autreText.trim()] : selectedOptions
    };
    delete updateData.id;
    delete updateData.created_at;
    const { error } = await supabase.from("biens").update(updateData).eq("id", id);
    if (error) {
      console.error("Erreur à la mise à jour:", error.message);
    } else {
      alert("✅ Bien mis à jour");
      router.push(`/biens/${id}`);
    }
  };

  if (loading || !formData) return <p className="text-center mt-10">Chargement...</p>;
  const coverUrl = `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/covers/${id}/cover.jpg`;
  const galleryItems = Array.isArray(formData.gallery) ? formData.gallery : [];

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Modifier le Bien</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <TextInput label="Titre" name="titre" value={formData.titre} onChange={handleChange} />
        <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Type de bien</label>
  <select
    name="type_bien"
    value={formData.type_bien || ""}
    onChange={handleChange}
    className="w-full border rounded px-3 py-2"
  >
    <option value="">-- Sélectionner --</option>
    {typesBienDisponibles.map((type) => (
      <option key={type} value={type}>{type}</option>
    ))}
  </select>
</div>
        <TextInput label="Ville" name="ville" value={formData.ville} onChange={handleChange} />
        <TextInput label="Code postal" name="code_postal" value={formData.code_postal} onChange={handleChange} />
        <TextInput label="Mandat (non modifiable)" name="mandat" value={formData.mandat} onChange={handleChange} disabled />
        <TextInput label="📐 Surface (m²)" name="surface_m2" value={formData.surface_m2} onChange={handleChange} />
        <TextInput label="🛏️ Chambres" name="nb_chambres" value={formData.nb_chambres} onChange={handleChange} />
        <TextInput label="🛋️ Pièces" name="nb_pieces" value={formData.nb_pieces} onChange={handleChange} />
        <TextInput label="🏢 Étage" name="etage" value={formData.etage} onChange={handleChange} />

        <TextInput label="🏗️ Année" name="annee_construction" value={formData.annee_construction} onChange={handleChange} />
        <TextInput label="🔥 Chauffage" name="type_chauffage" value={formData.type_chauffage} onChange={handleChange} />
        <TextInput label="🌍 Terrain (m²)" name="terrain_m2" value={formData.terrain_m2} onChange={handleChange} />
        <TextInput label="📐 Carrez (m²)" name="surface_carrez" value={formData.surface_carrez} onChange={handleChange} />

        <TextInput label="Prix net vendeur (€)" name="prix_net_vendeur" value={formData.prix_net_vendeur} onChange={handleChange} />
        <TextInput label="Honoraires (€)" name="honoraires" value={formData.honoraires} onChange={handleChange} />
        <TextInput label="Prix de vente (€)" name="prix_vente" value={formData.prix_vente} onChange={handleChange} />

        <TextInput label="DPE" name="dpe" value={formData.dpe} onChange={handleChange} />
        <TextInput label="Indice conso énergie" name="dpe_conso_indice" value={formData.dpe_conso_indice} onChange={handleChange} />
        <TextInput label="Indice GES" name="dpe_ges_indice" value={formData.dpe_ges_indice} onChange={handleChange} />

        <div className="grid grid-cols-2 gap-4">
          <label>🧱 Pièces :</label>
          <div className="flex gap-2">
            <select value={newPiece.nom} onChange={(e) => setNewPiece({ ...newPiece, nom: e.target.value })}>
              <option value="">Sélectionner</option>
              {['Salon', 'Cuisine', 'Chambre', 'Salle de bain', 'Autre'].map(p => <option key={p}>{p}</option>)}
            </select>
            {newPiece.nom === "Autre" && (
              <input type="text" placeholder="Nom personnalisé" value={newPiece.nomCustom} onChange={(e) => setNewPiece({ ...newPiece, nomCustom: e.target.value })} />
            )}
            <input type="text" placeholder="Surface" value={newPiece.surface} onChange={(e) => setNewPiece({ ...newPiece, surface: e.target.value })} />
            <button type="button" onClick={addPiece}>➕</button>
          </div>
          <ul className="col-span-2">
            {pieces.map((p, i) => <li key={i}>• {p.nom} - {p.surface} m²</li>)}
          </ul>
        </div>

        <div>
          <label className="block font-semibold text-orange-600">⚙️ Options</label>
<div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6">
  {OPTIONS_LIST.map((opt, i) => (
    <div key={i} className="flex">
      <div className="w-6 flex justify-center">
        <input
          type="checkbox"
          checked={selectedOptions.includes(opt)}
          onChange={() => toggleOption(opt)}
          className="accent-orange-600"
        />
      </div>
      <span className="ml-2 text-sm text-gray-700">{opt}</span>
    </div>
  ))}
</div>
          <div className="mt-2">
            <input type="checkbox" checked={showAutre} onChange={(e) => setShowAutre(e.target.checked)} className="mr-2" /> Autre :
            {showAutre && <textarea className="w-full mt-2 border rounded p-2" value={autreText} onChange={(e) => setAutreText(e.target.value)} />}
          </div>
        </div>

        <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">📌 Statut du Bien</label>
  <select
    name="statut"
    value={formData.statut || ""}
    onChange={handleChange}
    className="w-full border rounded px-3 py-2"
  >
    <option value="">-- Sélectionner --</option>
    <option value="Disponible">Disponible</option>
    <option value="Sous compromis">Sous compromis</option>
    <option value="Vendu">Vendu</option>
    <option value="Archivé">Archivé</option>
  </select>
</div>

        <div>
          <label>📸 Couverture</label>
          <input type="file" accept="image/*" onChange={handleCoverUpload} />
          {id && <img src={coverUrl} className="w-full max-h-60 object-cover rounded mt-2" alt="cover" />}
        </div>

        <div>
          <label>🖼️ Galerie</label>
          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
          <ReactSortable
            list={galleryItems}
            setList={(newList) => setFormData((prev) => ({ ...prev, gallery: newList }))}
            className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2"
          >
            {galleryItems.map((img) => (
              <div key={img} data-id={img} className="relative">
                <img src={`https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/gallery/${id}/${img}`} alt="" className="w-full h-32 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => handleDeleteGalleryImage(img)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                >🗑️</button>
              </div>
            ))}
          </ReactSortable>
        </div>

        <div className="mb-4 text-center">
  <button
    type="button"
    onClick={() => router.back()}
    className="text-sm text-orange-600 hover:underline"
  >
    ← Retour sans enregistrer
  </button>
</div>


        <div className="text-center">
          <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded">
            💾 Sauvegarder les modifications
          </button>
        </div>
      </form>
    </div>
  );
}


function TextInput({ label, name, value, onChange, disabled = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
}
