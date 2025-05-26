import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function MandatsPage() {
  const router = useRouter();
  const [mandatInfo, setMandatInfo] = useState({
    ville: "",
    code_postal: "",
    type_bien: "",
    proprietaire_nom: "",
    proprietaire_prenom: "",
    adresse_proprietaire: "",
    adresse_bien: "",
    date_debut: "",
    date_fin: ""
  });
  const [numeroMandat, setNumeroMandat] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setMandatInfo((prev) => ({ ...prev, [field]: value }));
  };

  const genererMandat = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mandats/generer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bien_id: "00000000-0000-0000-0000-000000000000", // À remplacer par l'ID réel
          agent_id: null,
          bien_info: {
            ville: mandatInfo.ville || "Non précisé",
            code_postal: mandatInfo.code_postal || "00000",
            type_bien: mandatInfo.type_bien || "Non précisé",
            adresse_bien: mandatInfo.adresse_bien || "Non précisé"
          },
          proprietaire_info: {
            nom: mandatInfo.proprietaire_nom || "Non précisé",
            prenom: mandatInfo.proprietaire_prenom || "Non précisé",
            adresse_principale: mandatInfo.adresse_proprietaire || "Non précisé"
          },
          date_debut: mandatInfo.date_debut,
          date_fin: mandatInfo.date_fin
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erreur serveur");
      }
      setNumeroMandat(data.numero_mandat);
      alert(`✅ Numéro de mandat généré: ${data.numero_mandat}`);
    } catch (err) {
      console.error("Erreur génération mandat:", err);
      alert("Erreur lors de la génération du mandat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">🧾 Générer un Mandat</h1>

      {numeroMandat && (
        <div className="bg-green-100 p-4 rounded mb-6">
          <p>✅ Numéro de mandat généré: <strong>{numeroMandat}</strong></p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Ville" value={mandatInfo.ville} onChange={(val) => handleChange("ville", val)} />
        <Input label="Code Postal" value={mandatInfo.code_postal} onChange={(val) => handleChange("code_postal", val)} />
        <Input label="Type de Bien" value={mandatInfo.type_bien} onChange={(val) => handleChange("type_bien", val)} />
        <Input label="Nom du Propriétaire" value={mandatInfo.proprietaire_nom} onChange={(val) => handleChange("proprietaire_nom", val)} />
        <Input label="Prénom du Propriétaire" value={mandatInfo.proprietaire_prenom} onChange={(val) => handleChange("proprietaire_prenom", val)} />
        <Input label="Adresse du Propriétaire" value={mandatInfo.adresse_proprietaire} onChange={(val) => handleChange("adresse_proprietaire", val)} />
        <Input label="Adresse du Bien (si différente)" value={mandatInfo.adresse_bien} onChange={(val) => handleChange("adresse_bien", val)} />
        <Input label="📅 Date de début" type="date" value={mandatInfo.date_debut} onChange={(val) => handleChange("date_debut", val)} />
        <Input label="📅 Date de fin" type="date" value={mandatInfo.date_fin} onChange={(val) => handleChange("date_fin", val)} />
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={genererMandat}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          disabled={loading}
        >
          ➕ Générer un mandat
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
