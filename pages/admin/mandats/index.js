import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function ListeMandats() {
  const [mandats, setMandats] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchMandats();
  }, []);

  const fetchMandats = async () => {
    const { data, error } = await supabase
      .from("registres_mandats")
      .select("*")
      .eq("statut", "provisoire")
      .order("created_at", { ascending: false });

    if (!error) setMandats(data);
  };

  const validerMandat = async (id) => {
    if (!confirm("Valider ce mandat définitivement ?")) return;

    const { error } = await supabase
      .from("registres_mandats")
      .update({
        statut: "valide",
        date_validation: new Date().toISOString()
      })
      .eq("id", id);

    if (!error) {
      alert("✅ Mandat validé");
      fetchMandats();
    } else {
      alert("❌ Erreur validation");
    }
  };

  const annulerMandat = async (id) => {
    if (!confirm("Annuler ce mandat ?")) return;

    const { error } = await supabase
      .from("registres_mandats")
      .update({
        statut: "annulé",
        date_validation: new Date().toISOString()
      })
      .eq("id", id);

    if (!error) {
      alert("🚫 Mandat annulé");
      fetchMandats();
    } else {
      alert("❌ Erreur annulation");
    }
  };

  const isOlderThan5Days = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 5;
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-600">📋 Mandats à valider</h1>
        <button
          onClick={() => router.push("/admin/mandats/registre")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm"
        >
          📜 Voir le registre des mandats validés
        </button>
      </div>

      {mandats.length > 0 && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl text-center">
          ⚠️ {mandats.length} mandat(s) en attente de validation !
        </div>
      )}

      {mandats.length === 0 ? (
        <p className="text-gray-500">Aucun mandat à valider pour l'instant.</p>
      ) : (
        <div className="space-y-4">
          {mandats.map((mandat) => (
            <div
              key={mandat.id}
              className={`p-4 rounded-xl flex justify-between items-center shadow ${isOlderThan5Days(mandat.created_at) ? 'bg-yellow-50 border border-yellow-300' : 'bg-white'}`}
            >
              <div>
                <p className="text-lg font-bold text-gray-700">Mandat #{mandat.numero_mandat}</p>
                <p className="text-sm text-gray-500">Créé le {new Date(mandat.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => validerMandat(mandat.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm"
                >
                  ✅ Valider
                </button>
                <button
                  onClick={() => annulerMandat(mandat.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm"
                >
                  ❌ Annuler
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}