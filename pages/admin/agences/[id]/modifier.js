import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function ModifierAgence() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (id) {
      supabase.from("agences").select("*").eq("id", id).single().then(({ data }) => {
        setForm(data);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("agences").update(form).eq("id", id);
    if (!error) router.push("/admin/agences");
  };

  if (!form) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Modifier l'agence</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nom" value={form.nom} placeholder="Nom de l'agence" className="w-full border p-2 rounded" onChange={handleChange} required />
        <input name="adresse" value={form.adresse} placeholder="Adresse" className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="ville" value={form.ville} placeholder="Ville" className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="code_postal" value={form.code_postal} placeholder="Code postal" className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="telephone" value={form.telephone} placeholder="Téléphone" className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="email" value={form.email} placeholder="Email" type="email" className="w-full border p-2 rounded" onChange={handleChange} />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="carte_t" checked={form.carte_t} onChange={handleChange} /> Carte T (Agence)
        </label>
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
