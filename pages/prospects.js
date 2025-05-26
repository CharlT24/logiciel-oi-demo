import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Prospects() {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    const { data, error } = await supabase.from("prospects").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Erreur chargement prospects :", error.message);
    } else {
      setProspects(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Supprimer ce prospect ?");
    if (!confirm) return;

    const { error } = await supabase.from("prospects").delete().eq("id", id);
    if (error) {
      alert("Erreur lors de la suppression");
    } else {
      setProspects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (loading) return <p className="text-center mt-10">Chargement des prospects...</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">📬 Liste des prospects reçus</h1>

      {prospects.length === 0 ? (
        <p className="text-gray-500">Aucun prospect pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
            <thead className="bg-orange-100">
              <tr>
                <th className="py-2 px-4 border">Nom</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Téléphone</th>
                <th className="py-2 px-4 border">Ville</th>
                <th className="py-2 px-4 border">Type de bien</th>
                <th className="py-2 px-4 border">Surface</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prospects.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{p.nom}</td>
                  <td className="py-2 px-4 border">{p.email}</td>
                  <td className="py-2 px-4 border">{p.telephone}</td>
                  <td className="py-2 px-4 border">{p.ville}</td>
                  <td className="py-2 px-4 border">{p.type_bien}</td>
                  <td className="py-2 px-4 border">{p.surface_m2} m²</td>
                  <td className="py-2 px-4 border">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border text-center">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                    >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
