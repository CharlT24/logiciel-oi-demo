import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PartenairesIndex() {
  const [partenaires, setPartenaires] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [villeFilter, setVilleFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData?.session?.user?.id;
      setUserId(uid);

      if (uid) {
        const { data: user } = await supabase
          .from("utilisateurs")
          .select("role")
          .eq("id", uid)
          .single();
        if (user?.role === "admin") setIsAdmin(true);
      }
    };

    const fetchPartenaires = async () => {
      const { data, error } = await supabase
        .from("partenaires")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) {
        setPartenaires(data);
        setFiltered(data);
      }
    };

    fetchUser();
    fetchPartenaires();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce partenaire ?")) return;
    const { error } = await supabase.from("partenaires").delete().eq("id", id);
    if (!error) {
      setPartenaires((prev) => prev.filter((p) => p.id !== id));
      setFiltered((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const applyFilters = () => {
    let data = [...partenaires];
    if (villeFilter) {
      data = data.filter((p) => p.ville?.toLowerCase().includes(villeFilter.toLowerCase()));
    }
    if (typeFilter) {
      data = data.filter((p) => p.type?.toLowerCase() === typeFilter.toLowerCase());
    }
    setFiltered(data);
  };

  useEffect(() => {
    applyFilters();
  }, [villeFilter, typeFilter]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      
      {/* Bouton retour */}
      <button
        type="button"
        onClick={() => router.back()}
        className="text-sm text-orange-600 hover:underline"
      >
        ← Retour
      </button>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-600">🤝 Partenaires</h1>
        <Link href="/clients/partenaires/ajouter">
          <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm">
            ➕ Ajouter un partenaire
          </button>
        </Link>
      </div>

      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Filtrer par ville..."
          className="border p-2 rounded w-64"
          value={villeFilter}
          onChange={(e) => setVilleFilter(e.target.value)}
        />
        <select
          className="border p-2 rounded w-64"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Tous les types</option>
          <option value="Notaire">Notaire</option>
          <option value="Diagnostiqueur">Diagnostiqueur</option>
          <option value="Courtier">Courtier</option>
          <option value="Architecte">Architecte</option>
          <option value="Promoteur">Promoteur</option>
          <option value="Constructeur">Constructeur</option>
          <option value="Géomètre">Géomètre</option>
          <option value="Avocat">Avocat</option>
          <option value="Home staging">Home staging</option>
          <option value="Travaux">Travaux</option>
          <option value="Gestionnaire">Gestionnaire</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">Aucun partenaire trouvé.</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow space-y-2 relative">
              <h2 className="text-lg font-semibold text-gray-800">{p.nom}</h2>
              <p className="text-sm text-gray-600">📍 {p.ville}</p>
              <p className="text-sm text-gray-600">🏷️ {p.type}</p>
              <p className="text-sm text-gray-500">📞 {p.telephone}</p>
              <p className="text-sm text-gray-500">📧 {p.email}</p>
              <Link
                href={`/clients/partenaires/${p.id}`}
                className="text-orange-600 hover:underline text-sm"
              >
                Voir la fiche ➜
              </Link>

              {(isAdmin || userId === p.created_by) && (
                <button
                  onClick={() => router.push(`/clients/partenaires/modifier/${p.id}`)}
                  className="absolute top-3 right-8 text-blue-600 hover:text-blue-800 text-sm"
                >
                  📝
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => handleDelete(p.id)}
                  className="absolute top-3 right-3 text-red-600 hover:text-red-800 text-sm"
                >
                  🗑
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
