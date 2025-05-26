// /pages/mandats/liste.js
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ListeMandats() {
  const [mandats, setMandats] = useState([]);

  useEffect(() => {
    const fetchMandats = async () => {
      const { data, error } = await supabase
        .from("registres_mandats")
        .select("id, bien_id, date_debut, date_fin")
        .order("date_fin", { ascending: true });

      if (!error && data) {
        const biensIds = data.map(r => r.bien_id);
        const { data: biens } = await supabase
          .from("biens")
          .select("id, titre")
          .in("id", biensIds);

        const result = data.map(r => {
          const bien = biens.find(b => b.id === r.bien_id);
          return {
            ...r,
            titre: bien?.titre || "Sans titre"
          };
        });
        setMandats(result);
      }
    };
    fetchMandats();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">📁 Tous les mandats</h1>
      {mandats.length === 0 ? (
        <p className="text-sm text-gray-600">Aucun mandat trouvé.</p>
      ) : (
        <ul className="space-y-3">
          {mandats.map((m) => (
            <li key={m.id} className="flex justify-between border p-3 rounded">
              <Link href={`/biens/${m.bien_id}`} className="text-orange-700 font-semibold">
                {m.titre}
              </Link>
              <div className="text-sm text-gray-500">
                {new Date(m.date_debut).toLocaleDateString("fr-FR")} - {new Date(m.date_fin).toLocaleDateString("fr-FR")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
