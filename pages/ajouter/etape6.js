import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function Etape6() {
  const router = useRouter();
  const [mandat, setMandat] = useState({ numero: "", date_debut: "", date_fin: "", statut: "provisoire" });
  const [loading, setLoading] = useState(false);

  const genererNumeroMandat = async () => {
    const bienId = router.query.id;
    if (!bienId) {
      alert("ID du bien introuvable");
      return;
    }

    try {
      const res = await fetch("/api/mandats/generer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bien_id: bienId,
          agent_id: null,
          bien_info: {},
          proprietaire_info: {},
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erreur serveur");
      }

      setMandat(prev => ({ ...prev, numero: data.numero_mandat }));
      alert(`✅ Numéro de mandat généré: ${data.numero_mandat}`);
    } catch (err) {
      console.error("Erreur génération mandat:", err);
      alert("Erreur lors de la génération du mandat");
    }
  };

  const finaliserMandat = async () => {
    alert("✅ Mandat finalisé");
    router.push("/biens");
  };  

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-orange-600">📄 Étape 6: Création du Mandat</h1>

      {mandat.numero && (
        <div className="bg-green-100 p-4 rounded-md">
          <p>✅ Numéro mandat: <strong>{mandat.numero}</strong></p>
        </div>
      )}

      <div className="border rounded-lg p-4 space-y-4">
        <h2 className="text-xl font-semibold text-orange-500">Détails Mandat</h2>
        <Input label="Date début" type="date" value={mandat.date_debut} onChange={(val) => setMandat(prev => ({ ...prev, date_debut: val }))} />
        <Input label="Date fin" type="date" value={mandat.date_fin} onChange={(val) => setMandat(prev => ({ ...prev, date_fin: val }))} />
        <Input label="Statut" value={mandat.statut} onChange={(val) => setMandat(prev => ({ ...prev, statut: val }))} />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={genererNumeroMandat}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          disabled={loading}
        >
          ➕ Générer numéro de mandat
        </button>

        <button
          onClick={finaliserMandat}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          disabled={!mandat.numero}
        >
          ✅ Finaliser et enregistrer
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
