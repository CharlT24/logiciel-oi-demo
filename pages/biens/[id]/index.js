// pages/biens/[id]/index.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DPEBar from "@/components/DPEBar";
import GESBar from "@/components/GESBar";

function getGESLetter(indice) {
  if (indice === null || indice === undefined) return "";
  if (indice <= 5) return "A";
  if (indice <= 10) return "B";
  if (indice <= 20) return "C";
  if (indice <= 35) return "D";
  if (indice <= 55) return "E";
  if (indice <= 80) return "F";
  return "G";
}

export default function FicheBien() {
  const router = useRouter();
  const { id } = router.query;
  const [bien, setBien] = useState(null);
  const [proprietaires, setProprietaires] = useState([]);
  const [coverUrl, setCoverUrl] = useState(null);
  const [galleryUrls, setGalleryUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agentId, setAgentId] = useState(null);
  const [agentInfo, setAgentInfo] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBien();
      fetchPhotos();
      fetchProprietaires();
      fetchAgentId();
    }
  }, [id]);

  const fetchBien = async () => {
    const { data, error } = await supabase.from("biens").select("*").eq("id", id).single();
    if (error) {
      console.error("Erreur chargement bien:", error);
      return;
    }
    setBien(data);
    if (data?.agent_id) {
      const { data: agentData, error: agentError } = await supabase
        .from("utilisateurs")
        .select("prenom, nom")
        .eq("id", data.agent_id)
        .single();
      if (!agentError && agentData) {
        setAgentInfo(agentData);
      }
    }
    setLoading(false);
  };

  const fetchProprietaires = async () => {
    const { data } = await supabase.from("proprietaires").select("*").eq("bien_id", id);
    if (data) setProprietaires(data);
  };

  const fetchPhotos = async () => {
    const { data: coverData } = supabase.storage.from("photos").getPublicUrl(`covers/${id}/cover.jpg`);
    setCoverUrl(coverData.publicUrl);
    const { data: gallery } = await supabase.storage.from("photos").list(`gallery/${id}`);
    if (gallery?.length) {
      const urls = gallery.map(photo =>
        supabase.storage.from("photos").getPublicUrl(`gallery/${id}/${photo.name}`).data.publicUrl
      );
      setGalleryUrls(urls);
    }
  };

  const fetchAgentId = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setAgentId(session?.user?.id || null);
  };

  const genererMandat = async () => {
    const confirmGen = confirm("Générer un numéro de mandat pour ce bien ?");
    if (!confirmGen) return;
    try {
      const res = await fetch("/api/mandats/generer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bien_id: bien.id,
          agent_id: bien.agent_id || null,
          bien_info: {
            ville: bien.ville || "",
            code_postal: bien.code_postal || "",
            type_bien: bien.type_bien || "",
            adresse_bien: bien.adresse_bien || "",
          },
          proprietaire_info: {
            nom: bien.proprietaire_nom || "",
            prenom: bien.proprietaire_prenom || "",
            adresse_principale: bien.adresse_proprietaire || "",
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Erreur serveur lors de la génération du mandat");
        return;
      }
      alert(`Mandat généré : ${data.numero_mandat}`);
      await new Promise((r) => setTimeout(r, 1000));
      await fetchBien();
    } catch (err) {
      console.error("Erreur JS :", err);
      alert("Erreur inattendue lors de la génération du mandat");
    }
  };

  if (loading || !bien) return <p className="text-center mt-10">Chargement...</p>;
  if (bien?.statut?.toLowerCase() === "archivé") return <p className="text-center mt-10 text-red-600">Ce bien est archivé.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <div className="flex justify-between items-center">
        <button onClick={() => router.push("/biens")} className="text-orange-600 text-sm hover:underline">
          ⬅️ Retour
        </button>
        <div className="flex gap-4">
          <a
            href={`/api/pdf/vitrine?id=${id}`}
            target="_blank"
            className="text-sm bg-orange-100 px-4 py-2 rounded shadow hover:bg-orange-200"
          >
            📄 Fiche Vitrine PDF
          </a>
          <a
            href={`/api/pdf/prive?id=${id}`}
            target="_blank"
            className="text-sm bg-gray-100 px-4 py-2 rounded shadow hover:bg-gray-200"
          >
            🔒 Fiche Privée PDF
          </a>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-orange-600">🏡 {bien.titre}
      </h1>
      {agentInfo && (
        <p className="text-sm text-gray-600">
          Saisi par : <strong>{agentInfo.prenom} {agentInfo.nom}</strong>
        </p>
      )}
      <p className="text-sm text-gray-600">{bien.ville} ({bien.code_postal})</p>
      <p className="text-sm text-gray-400">Mandat : {bien.mandat || "N/A"} – Statut : {bien.statut}</p>

      {bien.statut?.toLowerCase() === "estimation" && (
        <div className="mt-4">
          <button
            onClick={genererMandat}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl"
          >
            📄 Générer un mandat
          </button>
        </div>
      )}

      {coverUrl && <img src={coverUrl} alt="photo" className="w-full rounded-xl shadow-xl h-96 object-cover" />}

      {galleryUrls.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-orange-500 mt-6 mb-2">📸 Galerie ({galleryUrls.length} photos)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryUrls.map((url, idx) => (
              <img key={idx} src={url} className="rounded-lg shadow h-40 object-cover" />
            ))}
          </div>
        </div>
      )}

<div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
        <p>📐 Surface : <strong>{bien.surface_m2} m²</strong></p>
        <p>🛏️ Chambres : <strong>{bien.nb_chambres}</strong></p>
        <p>🛋️ Pièces : <strong>{bien.nb_pieces}</strong></p>
        <p>🏢 Étage : <strong>{bien.etage}</strong></p>
        <p>🏷️ Type : <strong>{bien.type_bien}</strong></p>
        <p>🏗️ Année : <strong>{bien.annee_construction}</strong></p>
        <p>🔥 Chauffage : <strong>{bien.type_chauffage} ({bien.mode_chauffage})</strong></p>
        <p>🌍 Terrain : <strong>{bien.surface_terrain} m²</strong></p>
        <p>📐 Carrez : <strong>{bien.surface_carrez} m²</strong></p>
      </div>

      {bien.options?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-orange-500">⚙️ Options & Caractéristiques</h2>
          <ul className="flex flex-wrap gap-2 text-sm mt-2">
            {bien.options.map((opt, idx) => (
              <li key={idx} className="bg-orange-100 px-3 py-1 rounded-full shadow text-gray-700">{opt}</li>
            ))}
          </ul>
        </div>
      )}

<div className="bg-orange-50 p-4 rounded shadow text-sm">
  {bien.charge_acquereur ? (
    <>
      <p>💰 Prix affiché (hors honoraires) : <strong>{bien.prix_net_vendeur?.toLocaleString()} €</strong></p>
      <p>➕ Honoraires : {bien.honoraires?.toLocaleString()} €</p>
      <p>📊 % Honoraires : {bien.pourcentage_honoraires}%</p>
    </>
  ) : (
    <>
      <p>💰 Prix affiché (FAI) : <strong>{bien.prix_vente?.toLocaleString()} €</strong></p>
      <p className="text-gray-400 italic">Honoraires à la charge du vendeur</p>
    </>
  )}

  {bien.taxe_fonciere && (
    <p>📜 Taxe foncière : {bien.taxe_fonciere} €</p>
  )}
  {bien.quote_part_charges && (
    <p>💼 Charges annuelles : {bien.quote_part_charges} €</p>
  )}
  {bien.fonds_travaux && (
    <p>🏛️ Fonds travaux : {bien.fonds_travaux} €</p>
  )}
</div>

      {/* Bloc DPE */}
{(bien.dpe_etiquette_conso || bien.dpe || bien.dpe_vierge) && (
  <div className="mt-10">
    <h2 className="text-lg font-semibold text-orange-500">🔍 Diagnostic Énergétique (DPE)</h2>

    {bien.dpe_vierge ? (
      <p className="text-sm mt-2 text-gray-600">DPE vierge (non soumis)</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 items-start">
        <div>
          <h3 className="font-medium text-sm text-gray-600 mb-1">Consommation d’énergie</h3>
          <DPEBar lettre={bien.dpe_etiquette_conso || bien.dpe || "-"} />
          {bien.dpe_conso_indice && (
            <p className="text-xs text-gray-600 mt-1">
              ⚡ {bien.dpe_conso_indice} kWh/m²/an
            </p>
          )}
        </div>
        <div>
          <h3 className="font-medium text-sm text-gray-600 mb-1">Émissions de GES</h3>
          <GESBar lettre={bien.dpe_etiquette_ges || getGESLetter(bien.dpe_ges_indice)} />
          {bien.dpe_ges_indice && (
            <p className="text-xs text-gray-600 mt-1">
              🌫️ {bien.dpe_ges_indice} kgCO₂/m²/an
            </p>
          )}
        </div>
        <div className="col-span-2 space-y-1 text-sm mt-4">
          {bien.dpe_date_realisation && <p>📅 Réalisé le : {bien.dpe_date_realisation}</p>}
          {(bien.montant_depenses_energies_min || bien.montant_depenses_energies_max) && (
            <p>
              💶 Estimation : {bien.montant_depenses_energies_min || "?"} € – {bien.montant_depenses_energies_max || "?"} €
            </p>
          )}
          {bien.energie_finale_kwh && (
            <p>🔥 Énergie finale : {bien.energie_finale_kwh} kWh/m²/an</p>
          )}
        </div>
      </div>
    )}
  </div>
)}

      {bien.description && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-orange-500">📝 Description</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line mt-2">
            {bien.description}
            {"\n\n"}🔍 Infos risques :{" "}
            <a
              href="https://www.georisques.gouv.fr"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Géorisques
            </a>
          </p>
        </div>
      )}

      {proprietaires.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-orange-500">👤 Propriétaires</h2>
          <div className="space-y-3 text-sm">
            {proprietaires.map((p, idx) => (
              <div key={idx} className="bg-gray-50 border p-4 rounded shadow">
                <p><strong>{p.prenom} {p.nom}</strong></p>
                <p>Email : {p.email}</p>
                <p>Téléphone : {p.telephone}</p>
                <p>Adresse : {p.adresse_principale}</p>
                {p.adresse_differente && <p>Adresse 2 : {p.adresse_differente}</p>}
                <p>Mandat #{p.numero_mandat} – du {p.date_debut_mandat} au {p.date_fin_mandat}</p>
              </div>
            ))}
          </div>
        </div>
      )}

<div className="mt-6">
        <h2 className="text-lg font-semibold text-orange-500 mb-2">📍 Localisation</h2>
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(bien.ville + ", " + bien.code_postal)}`}
          width="100%"
          height="350"
          className="rounded-xl shadow"
          loading="lazy"
        ></iframe>
      </div>
    </div> // ← fin de la div principale
  ); // ← fin du return
} // ← fin du composant

    

