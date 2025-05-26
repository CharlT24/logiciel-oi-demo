import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function Etape5() {
  const router = useRouter();
  const [proprietaires, setProprietaires] = useState([
    { nom: "", prenom: "", telephone: "", email: "", adresse_principale: "" }
  ]);
  const [numeroMandatSaisi, setNumeroMandatSaisi] = useState("");
  const [loading, setLoading] = useState(false);

  const addProprietaire = () => {
    setProprietaires([...proprietaires, { nom: "", prenom: "", telephone: "", email: "", adresse_principale: "" }]);
  };

  const handleChangeProprietaire = (index, field, value) => {
    const newProps = [...proprietaires];
    newProps[index][field] = value;
    setProprietaires(newProps);
  };

  const finaliserProprietaires = async () => {
    const bienId = router.query.id;

    if (!bienId) {
      alert("Bien introuvable");
      return;
    }

    try {
      setLoading(true);
      for (let proprio of proprietaires) {
        const { error } = await supabase.from("proprietaires").insert({
          bien_id: bienId,
          nom: proprio.nom,
          prenom: proprio.prenom,
          telephone: proprio.telephone,
          email: proprio.email,
          adresse_principale: proprio.adresse_principale || null
        });
        if (error) throw error;
      }
      alert("✅ Propriétaire(s) enregistré(s) avec succès!");

      if (numeroMandatSaisi.trim()) {
        alert("✅ Numéro de mandat saisi: " + numeroMandatSaisi);
        router.push("/biens");
      } else {
        router.push(`/ajouter/etape6?id=${bienId}`);
      }
    } catch (err) {
      console.error("Erreur création propriétaires:", err);
      alert("Erreur lors de l'enregistrement des propriétaires");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-orange-600">👤 Étape 5: Création des Propriétaires</h1>

      <div className="border rounded-lg p-4 space-y-6">
        <h2 className="text-xl font-semibold text-orange-500">Propriétaire(s)</h2>
        {proprietaires.map((proprio, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nom" value={proprio.nom} onChange={(val) => handleChangeProprietaire(index, "nom", val)} />
            <Input label="Prénom" value={proprio.prenom} onChange={(val) => handleChangeProprietaire(index, "prenom", val)} />
            <Input label="Téléphone" value={proprio.telephone} onChange={(val) => handleChangeProprietaire(index, "telephone", val)} />
            <Input label="Email" value={proprio.email} onChange={(val) => handleChangeProprietaire(index, "email", val)} />
            <Input label="Adresse principale (facultatif)" value={proprio.adresse_principale} onChange={(val) => handleChangeProprietaire(index, "adresse_principale", val)} />
          </div>
        ))}
        <button onClick={addProprietaire} className="mt-4 bg-gray-200 px-4 py-2 rounded">➕ Ajouter un propriétaire</button>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h2 className="text-xl font-semibold text-orange-500">Numéro de Mandat (facultatif)</h2>
        <Input label="Numéro de mandat (laisser vide pour générer automatiquement)" value={numeroMandatSaisi} onChange={(val) => setNumeroMandatSaisi(val)} />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={finaliserProprietaires}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          disabled={loading}
        >
          ✅ Valider et continuer
        </button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
      />
    </div>
  );
}
