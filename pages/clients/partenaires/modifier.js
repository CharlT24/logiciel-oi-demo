import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function ModifierPartenaire() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const { data, error } = await supabase.from("partenaires").select("*").eq("id", id).single();
      if (error) {
        alert("Erreur de chargement du partenaire");
        return;
      }
      setForm(data);
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("partenaires").update({
      ...form,
      updated_at: new Date().toISOString(),
    }).eq("id", id);

    if (error) {
      alert("Erreur lors de la modification");
      console.error(error);
    } else {
      router.push("/clients/partenaires");
    }
  };

  if (!form) return <p className="text-center p-10">Chargement...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">✏️ Modifier le partenaire</h1>

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
          💾 Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}