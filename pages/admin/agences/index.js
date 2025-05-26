import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ListeAgences() {
  const [agences, setAgences] = useState([]);

  useEffect(() => {
    const fetchAgences = async () => {
      const { data, error } = await supabase.from("agences").select("*");
      if (!error) setAgences(data);
    };
    fetchAgences();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des agences</h1>
        <Link href="/admin/agences/ajouter" className="bg-orange-500 text-white px-4 py-2 rounded shadow">
          ➕ Ajouter une agence
        </Link>
      </div>

      <table className="min-w-full bg-white shadow rounded overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-left text-sm uppercase">
            <th className="p-3">Nom</th>
            <th className="p-3">Ville</th>
            <th className="p-3">Carte T</th>
            <th className="p-3">Type</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agences.map((agence) => (
            <tr key={agence.id} className="border-t">
              <td className="p-3 font-medium">{agence.nom}</td>
              <td className="p-3">{agence.ville}</td>
              <td className="p-3">{agence.carte_t ? "✔️" : "❌"}</td>
              <td className="p-3">{agence.carte_t ? "Agence" : "Coworking"}</td>
              <td className="p-3">
                <Link href={`/admin/agences/${agence.id}/modifier`} className="text-blue-500 hover:underline">
                  Modifier
                </Link>
              </td>
            </tr>
          ))}
          {agences.length === 0 && (
            <tr><td className="p-3 text-gray-500" colSpan="5">Aucune agence enregistrée</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
