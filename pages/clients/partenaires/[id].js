import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function FichePartenaire() {
  const router = useRouter();
  const { id } = router.query;
  const [partenaire, setPartenaire] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchPartenaire = async () => {
      const { data, error } = await supabase.from("partenaires").select("*").eq("id", id).single();
      if (!error) setPartenaire(data);
    };
    fetchPartenaire();
  }, [id]);

  if (!partenaire) return <p className="p-10 text-center">Chargement...</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-4">
      <h1 className="text-2xl font-bold text-orange-600">📄 Fiche partenaire</h1>

      <div className="bg-white shadow rounded-xl p-6 space-y-2 border">
        <h2 className="text-xl font-semibold text-gray-800">{partenaire.nom}</h2>
        <p className="text-sm text-gray-600">🏷️ {partenaire.type}</p>
        {partenaire.structure && <p className="text-sm text-gray-600">🏢 {partenaire.structure}</p>}
        <p className="text-sm text-gray-600">📍 {partenaire.ville}</p>
        <p className="text-sm text-gray-600">📧 {partenaire.email}</p>
        <p className="text-sm text-gray-600">📞 {partenaire.telephone}</p>
        {partenaire.site_web && (
          <p className="text-sm text-blue-600">
            🌐 <a href={partenaire.site_web} target="_blank" rel="noopener noreferrer" className="hover:underline">{partenaire.site_web}</a>
          </p>
        )}
        {partenaire.notes && (
          <div>
            <p className="text-sm font-medium text-gray-700 mt-4">📝 Notes</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">{partenaire.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}