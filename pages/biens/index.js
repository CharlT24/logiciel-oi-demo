import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"
import Link from "next/link"
import { useRouter } from "next/router"


export default function ListeBiens() {
  const [biens, setBiens] = useState([])
  const [allBiens, setAllBiens] = useState([])
  const [agents, setAgents] = useState([])
  const [filtres, setFiltres] = useState({ ville: "", statut: "", agent_id: "" })
  const [role, setRole] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchBiens()
    fetchAgents()
    checkRole()
  }, [])

const fetchBiens = async () => {
  const { data, error } = await supabase.from("biens").select("*");
  if (!error) {
    // mettre les biens de l’agent connecté en premier
    const triés = data.sort((a, b) => {
      if (a.agent_id === userId && b.agent_id !== userId) return -1;
      if (a.agent_id !== userId && b.agent_id === userId) return 1;
      return 0;
    });
    setAllBiens(triés);
    setBiens(triés);
  }
};

  const fetchAgents = async () => {
    const { data } = await supabase.from("utilisateurs").select("id, nom").eq("role", "agent")
    if (data) setAgents(data)
  }

const [userId, setUserId] = useState(null); // 👈 ajout

const checkRole = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const uid = session?.user?.id;
  if (!uid) return;
  setUserId(uid); // 👈 enregistre l’ID
  const { data } = await supabase.from("utilisateurs").select("role").eq("id", uid).single();
  setRole(data?.role || "");
};

const handleSecureDelete = async (id) => {
  const confirmed = confirm("❗ Es-tu sûr de vouloir supprimer ce bien ?");
  if (!confirmed) return;
  const secondCheck = confirm("🛑 Cette action est irréversible. Confirmer la suppression ?");
  if (!secondCheck) return;
  await handleDelete(id);
};


  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce bien ? Cette action est irréversible.")) return

    const { error } = await supabase.from("biens").delete().eq("id", id)

    if (!error) {
      try {
        await fetch(`http://localhost/wordpress/wp-json/oi/v1/supabase-delete/${id}`, {
          method: "DELETE",
        })
        alert("✅ Bien supprimé sur Supabase & WordPress")
      } catch (err) {
        console.error("Erreur WordPress :", err)
        alert("⚠️ Supprimé de Supabase, mais pas de WordPress")
      }

      setBiens((prev) => prev.filter((b) => b.id !== id))
    } else {
      alert("❌ Erreur lors de la suppression")
    }
  }

  const handleFiltreChange = (e) => {
    const { name, value } = e.target
    const newFiltres = { ...filtres, [name]: value }
    setFiltres(newFiltres)

    const filtrés = allBiens.filter((bien) => {
      return (
        (!newFiltres.ville || bien.ville === newFiltres.ville) &&
        (!newFiltres.statut || bien.statut === newFiltres.statut) &&
        (!newFiltres.agent_id || bien.agent_id === newFiltres.agent_id)
      )
    })
    setBiens(filtrés)
  }

  const synchroniserWordPress = async () => {
    if (!confirm("Confirmer l'envoi de tous les biens vers WordPress ?")) return

    for (const bien of biens) {
      const cover = "cover.jpg"
      const { data: galleryData } = await supabase.storage.from("photos").list(`gallery/${bien.id}`)
      const gallery = galleryData?.map(photo => photo.name) || []

      const payload = {
        id: bien.id,
        titre: bien.titre,
        description: bien.description,
        prix_vente: bien.prix_vente,
        honoraires: bien.honoraires,
        prix_net_vendeur: bien.prix_net_vendeur,
        pourcentage_honoraires: bien.pourcentage_honoraires,
          charge_acquereur: bien.charge_acquereur,
           charge_vendeur: bien.charge_vendeur,
        quote_part_charges: bien.quote_part_charges,
        taxe_fonciere: bien.taxe_fonciere,
        fonds_travaux: bien.fonds_travaux,
        surface_m2: bien.surface_m2,
        surface_terrain: bien.surface_terrain,
        surface_carrez: bien.surface_carrez,
        ville: bien.ville,
        code_postal: bien.code_postal,
        nb_pieces: bien.nb_pieces,
        nb_chambres: bien.nb_chambres,
        etage: bien.etage,
        type_bien: bien.type_bien,
        statut: bien.statut,
        mandat: bien.mandat,
        annee_construction: bien.annee_construction,
        type_chauffage: bien.type_chauffage,
        mode_chauffage: bien.mode_chauffage,
        dpe: bien.dpe,
        dpe_conso_indice: bien.dpe_conso_indice,
        dpe_ges_indice: bien.dpe_ges_indice,
        dpe_cout_min: bien.dpe_cout_min,
        dpe_cout_max: bien.dpe_cout_max,
        agent_nom: bien.agent_id,
        options: bien.options,
        cover,
        gallery
      }      

      console.log("🧪 Payload envoyé à WordPress :", payload)

      try {
        const res = await fetch("http://localhost/wordpress/wp-json/oi/v1/biens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })

        if (!res.ok) throw new Error("Erreur réponse WordPress")

        console.log(`✅ Exporté : ${bien.titre}`)
      } catch (err) {
        console.error(`❌ Erreur pour ${bien.titre}`, err)
      }
    }

    alert("✅ Synchronisation terminée")
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
      {/* Haut de page */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-orange-600">🏡 Tous les biens</h1>

        <div className="flex flex-wrap gap-4">
          {/* ➕ Ajouter un bien */}
          <button
            onClick={() => router.push("/biens/ajouter/etape1")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded shadow"
          >
            ➕ Ajouter un bien
          </button>

          {/* 🧮 Créer une estimation */}
          <button
            onClick={() => router.push("/biens/ajouter/estimation")}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded shadow"
          >
            🧮 Créer une estimation
          </button>

          {/* 🔁 Synchroniser WordPress (admin) */}
          {role === "admin" && (
            <button
              onClick={synchroniserWordPress}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow"
            >
              🔁 Synchroniser avec WordPress
            </button>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select name="ville" value={filtres.ville} onChange={handleFiltreChange} className="input">
          <option value="">Toutes les villes</option>
          {[...new Set(allBiens.map((b) => b.ville))].map((ville) => (
            <option key={ville} value={ville}>{ville}</option>
          ))}
        </select>
        <select name="statut" value={filtres.statut} onChange={handleFiltreChange} className="input">
          <option value="">Tous les statuts</option>
          <option value="disponible">Disponible</option>
          <option value="sous_compromis">Sous compromis</option>
          <option value="vendu">Vendu</option>
        </select>
        <select name="agent_id" value={filtres.agent_id} onChange={handleFiltreChange} className="input">
          <option value="">Tous les agents</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>{agent.nom}</option>
          ))}
        </select>
      </div>

      {/* Liste des biens */}
      {biens.length === 0 ? (
        <p className="text-gray-500 mt-10">Aucun bien trouvé avec ces filtres.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {biens.map((bien) => {
            const prixFAI = (bien.prix_vente || 0) + (bien.honoraires || 0)
            const image = `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/covers/${bien.id}/cover.jpg`

            return (
              <div key={bien.id} className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition flex flex-col">
                <img src={image} alt={bien.titre} className="w-full h-52 object-cover" />
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="font-bold text-xl text-gray-800 truncate">{bien.titre}</h2>
                    <p className="text-sm text-gray-500 mb-2">{bien.ville}</p>

                    <div className="flex flex-wrap gap-3 mt-3">
                      <Link href={`/biens/${bien.id}`} legacyBehavior>
                        <a className="bg-orange-100 text-orange-700 text-sm font-semibold px-5 py-2 rounded-xl shadow-sm hover:bg-orange-200 transition">
                          {bien.surface_m2} m²
                        </a>
                      </Link>
                      <Link href={`/biens/${bien.id}`} legacyBehavior>
                        <a className="bg-orange-100 text-orange-700 text-sm font-semibold px-5 py-2 rounded-xl shadow-sm hover:bg-orange-200 transition">
                          {prixFAI.toLocaleString()} €
                        </a>
                      </Link>
                      {bien.statut && (
                        <Link href={`/biens/${bien.id}`} legacyBehavior>
                          <a className="bg-gray-100 text-gray-700 text-sm font-medium px-5 py-2 rounded-xl shadow-sm hover:bg-gray-200 transition capitalize">
                            {bien.statut.replace('_', ' ')}
                          </a>
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
 {(bien.agent_id === userId || role === "admin") && (
  <button
    onClick={() => router.push(`/biens/${bien.id}/modifier`)}
    className="text-sm bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
  >
    📝 Modifier
  </button>
)}

{(bien.agent_id === userId || role === "admin") && (
  <button
    onClick={() => handleSecureDelete(bien.id)}
    className="text-sm text-red-600 hover:text-red-800 transition"
  >
    🗑 Supprimer
  </button>
)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
