// pages/immopro/index.js
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function ImmoProIndex() {
  const [annonces, setAnnonces] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = "Biens Immo Pro";

    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData?.session?.user?.id;
      setUserId(currentUserId);

      if (currentUserId) {
        const { data: userData } = await supabase
          .from("utilisateurs")
          .select("role")
          .eq("id", currentUserId)
          .single();

        if (userData?.role === "admin") {
          setIsAdmin(true);
        }
      }

      const { data, error } = await supabase
        .from("immo_pro")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Erreur chargement immo_pro:", error);
      setAnnonces(data || []);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce bien ?")) return;
    const { error } = await supabase.from("immo_pro").delete().eq("id", id);
    if (error) return alert("Erreur suppression");
    setAnnonces((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-600">🏢 Biens Immo Pro</h1>
        <Link href="/immopro/ajouter/etape1">
          <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm">
            ➕ Ajouter un bien pro
          </button>
        </Link>
      </div>

      {annonces.length === 0 ? (
        <p className="text-gray-500">Aucun bien pro enregistré pour l'instant.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {annonces.map((bien) => (
            <div key={bien.id} className="bg-white p-4 rounded-xl shadow space-y-2 border relative">
              <h2 className="font-semibold text-lg text-gray-800">
                {bien.type === "fonds_de_commerce" ? "Fonds de commerce" : "Locaux commerciaux"}
              </h2>
              <p className="text-sm text-gray-600">📍 {bien.ville}</p>
              <p className="text-sm text-gray-600">📐 {bien.surface} m²</p>
              <p className="text-sm text-gray-600">💰 {bien.prix} € HT</p>
              <p className="text-sm text-gray-400 text-xs">🕒 Ajouté le {new Date(bien.created_at).toLocaleDateString()}</p>

              {/* Actions en haut à droite */}
              <div className="absolute top-3 right-3 flex gap-2">
                {(isAdmin || userId === bien.created_by) && (
                  <button
                    onClick={() => router.push(`/immopro/modifier/${bien.id}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    📝
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(bien.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    🗑
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
