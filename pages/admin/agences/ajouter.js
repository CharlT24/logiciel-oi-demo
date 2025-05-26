import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function AjouterAgence() {
  const router = useRouter();
  const [form, setForm] = useState({
    nom: "",
    adresse: "",
    ville: "",
    code_postal: "",
    carte_t: false,
    telephone: "",
    email: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("agences").insert([form]);
    if (!error) router.push("/admin/agences");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ajouter une agence</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nom" placeholder="Nom de l'agence" className="w-full border p-2 rounded" onChange={handleChange} required />
        <input name="adresse" placeholder="Adresse" className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="ville" placeholder="Ville" className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="code_postal" placeholder="Code postal" className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="telephone" placeholder="Téléphone" className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="email" placeholder="Email" type="email" className="w-full border p-2 rounded" onChange={handleChange} />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="carte_t" onChange={handleChange} /> Agence avec carte T (sinon coworking)
        </label>
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
      </form>
    </div>
  );
}