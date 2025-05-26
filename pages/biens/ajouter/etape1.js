import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function Etape1() {
  const router = useRouter();
  const [agentId, setAgentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typeOffre, setTypeOffre] = useState("V");
  const [region, setRegion] = useState("");
  const pays = "France";
  const [titre, setTitre] = useState("");
  const [typeBien, setTypeBien] = useState("");
  const [mandat, setMandat] = useState("");
  const [statut, setStatut] = useState("Disponible");
  const [ville, setVille] = useState("");
  const [cp, setCp] = useState("");
  const [adresseBien, setAdresseBien] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [vente, setVente] = useState(false);
  const [location, setLocation] = useState(false);
  const [typesUbiflow, setTypesUbiflow] = useState([]);

  const API_KEY = "AIzaSyBdUW6LH-WYQDi_SmBW8iSm_nO_Uj8oCuU";

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const id = session?.user?.id;
      if (!id) router.push("/login");
      else {
        setAgentId(id);
        setLoading(false);
      }
    };
    getUser();

    const fetchTypes = async () => {
      const { data, error } = await supabase
        .from("types_ubiflow")
        .select("*")
        .order("label", { ascending: true });
      if (!error) setTypesUbiflow(data);
    };
    fetchTypes();
  }, []);

  const handleVilleInput = async (e) => {
    const value = e.target.value;
    setVille(value);
    if (value.length > 2) {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&types=(cities)&key=${API_KEY}&language=fr`;
      const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      setSuggestions(data.predictions || []);
    } else {
      setSuggestions([]);
    }
  };

  const handleVilleSelect = async (suggestion) => {
    setVille(suggestion.description);
    setSuggestions([]);

    const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${suggestion.place_id}&key=${API_KEY}&language=fr`;
    const detailRes = await fetch(`/api/proxy?url=${encodeURIComponent(detailUrl)}`);
    const detailData = await detailRes.json();

    const location = detailData?.result?.geometry?.location;
    if (location?.lat && location?.lng) {
      const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${API_KEY}&language=fr`;
      const geoRes = await fetch(`/api/proxy?url=${encodeURIComponent(geoUrl)}`);
      const geoData = await geoRes.json();

      const components = geoData?.results?.[0]?.address_components || [];

      const cpFound = components.find(comp => comp.types.includes("postal_code"))?.long_name;
      const regionFound = components.find(comp => comp.types.includes("administrative_area_level_1"))?.long_name;

      if (cpFound) setCp(cpFound);
      if (regionFound) setRegion(regionFound);
    }
  };

  const handleSubmit = async () => {
    if (!agentId) return alert("Chargement utilisateur en cours…");

    const selectedType = typesUbiflow.find((t) => t.label === typeBien);
    const codeTypeUbiflow = selectedType?.code || "1000";

    const newBien = {
      titre,
      type_bien: typeBien,
      code_type_ubiflow: codeTypeUbiflow,
      mandat,
      statut,
      ville,
      code_postal: cp,
      adresse_bien: adresseBien,
      vente,
      location,
      agent_id: agentId,
      type_offre: typeOffre,
      region,
      pays,
    };

    const { data, error } = await supabase.from("biens").insert([newBien]).select();
    if (error) return alert("Erreur à l’enregistrement");
    await supabase.rpc("recalcul_rapprochements");
    router.push(`/biens/ajouter/etape2?id=${data[0].id}`);
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 mt-10 rounded-xl shadow space-y-8 border">
      <h1 className="text-3xl font-bold text-orange-600">📝 Étape 1 : Localisation & Type de Bien</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="col-span-2">
          <label className="text-sm font-semibold">Adresse du Bien</label>
          <input type="text" className="input" value={adresseBien} onChange={(e) => setAdresseBien(e.target.value)} placeholder="Ex: 123 rue de Paris" />
        </div>

        <div className="relative">
          <label className="text-sm font-semibold">Ville</label>
          <input type="text" className="input" value={ville} onChange={handleVilleInput} placeholder="Ex: Marseille" />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border shadow-md rounded w-full mt-1 text-sm">
              {suggestions.map((s) => (
                <li key={s.place_id} onClick={() => handleVilleSelect(s)} className="px-3 py-2 hover:bg-orange-50 cursor-pointer">
                  {s.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold">Code Postal</label>
          <input type="text" className="input" value={cp} onChange={(e) => setCp(e.target.value)} placeholder="Ex: 13000" />
        </div>

        <div>
          <label className="text-sm font-semibold">Titre du Bien</label>
          <input type="text" className="input" value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex: Maison avec jardin" />
        </div>

        <div>
          <label className="text-sm font-semibold">Type de Bien</label>
          <select className="input" value={typeBien} onChange={(e) => setTypeBien(e.target.value)}>
            <option value="">-- Sélectionner --</option>
            {typesUbiflow.map((type) => (
              <option key={type.code} value={type.label}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold">Type de Mandat</label>
          <select className="input" value={mandat} onChange={(e) => setMandat(e.target.value)}>
            <option value="">-- Choisir --</option>
            <option value="Exclusif">Exclusif</option>
            <option value="Simple">Simple</option>
            <option value="Mandat de recherche">Mandat de recherche</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold">Statut du Bien</label>
 <select className="input" value="Disponible" disabled>
  <option value="Disponible">Disponible</option>
</select>
        </div>

        <div>
          <label className="text-sm font-semibold">Type d'offre</label>
          <select className="input" value={typeOffre} onChange={(e) => setTypeOffre(e.target.value)}>
            <option value="V">Vente</option>
            <option value="L">Location</option>
            <option value="F">Fonds de commerce</option>
            <option value="B">Cession de bail</option>
            <option value="W">Viager</option>
            <option value="G">Vente neuf</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold">Région</label>
          <input type="text" className="input" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Ex: Provence-Alpes-Côte d’Azur" />
        </div>

        <div className="md:col-span-2 flex gap-6 items-center">
          <label className="inline-flex items-center">
            <input type="checkbox" checked={vente} onChange={(e) => setVente(e.target.checked)} className="mr-2" /> Vente
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" checked={location} onChange={(e) => setLocation(e.target.checked)} className="mr-2" /> Location
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={handleSubmit}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-10 py-3 rounded-xl text-lg shadow"
        >
          ✅ Enregistrer et continuer ➔
        </button>
      </div>
    </div>
  );
}
