import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function AjouterPartenaire() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  const [form, setForm] = useState({
    nom: "",
    type: "",
    ville: "",
    email: "",
    telephone: "",
    structure: "",
    site_web: "",
    notes: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      const uid = session?.session?.user?.id;
      if (!uid) return router.push("/login");
      setUserId(uid);
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.type || !form.ville || !form.email || !form.telephone) {
      return alert("Merci de remplir tous les champs obligatoires");
    }

    const { error } = await supabase.from("partenaires").insert({
      ...form,
      created_by: userId,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error(error);
      alert("Erreur lors de l'ajout du partenaire");
    } else {
      router.push("/clients/partenaires");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">➕ Ajouter un partenaire</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nom" onChange={handleChange} value={form.nom} placeholder="Nom complet *" className="input" required />

        <select name="type" onChange={handleChange} value={form.type} className="input" required>
          <option value="">-- Type de partenaire * --</option>
          <option value="Notaire">Notaire</option>
          <option value="Diagnostiqueur">Diagnostiqueur</option>
          <option value="Courtier">Courtier</option>
          <option value="Architecte">Architecte</option>
          <option value="Promoteur">Promoteur</option>
          <option value="Constructeur">Constructeur</option>
          <option value="Géomètre">Géomètre</option>
          <option value="Avocat">Avocat</option>
          <option value="Home staging">Home staging</option>
          <option value="Travaux">Entreprise de travaux</option>
          <option value="Gestionnaire">Gestionnaire de patrimoine</option>
        </select>

        <input name="ville" onChange={handleChange} value={form.ville} placeholder="Ville *" className="input" required />
        <input name="email" onChange={handleChange} value={form.email} placeholder="Email *" type="email" className="input" required />
        <input name="telephone" onChange={handleChange} value={form.telephone} placeholder="Téléphone *" className="input" required />
        <input name="structure" onChange={handleChange} value={form.structure} placeholder="Nom de la société (optionnel)" className="input" />
        <input name="site_web" onChange={handleChange} value={form.site_web} placeholder="Site web (optionnel)" className="input" />
        <textarea name="notes" onChange={handleChange} value={form.notes} rows="4" placeholder="Notes complémentaires..." className="input" />

        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
          ✅ Enregistrer le partenaire
        </button>
      </form>
    </div>
  );
}
