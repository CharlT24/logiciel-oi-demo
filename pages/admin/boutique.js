import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function AdminBoutique() {
  const [produits, setProduits] = useState([]);
  const [newProd, setNewProd] = useState({ nom: "", description: "", prix: 0, stock: 0, image_url: "" });

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = async () => {
    const { data, error } = await supabase.from("boutique").select("*");
    if (!error) setProduits(data);
  };

  const ajouterProduit = async () => {
    const { error } = await supabase.from("boutique").insert([newProd]);
    if (!error) {
      alert("✅ Produit ajouté !");
      setNewProd({ nom: "", description: "", prix: 0, stock: 0, image_url: "" });
      fetchProduits();
    } else {
      alert("❌ Erreur à l’ajout du produit");
    }
  };

  const supprimerProduit = async (id) => {
    const confirmDelete = window.confirm("❌ Confirmer la suppression de ce produit ?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("boutique").delete().eq("id", id);
    if (!error) {
      alert("✅ Produit supprimé !");
      fetchProduits();
    } else {
      alert("❌ Erreur à la suppression");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-orange-600">⚙️ Admin Boutique</h1>

      <div className="space-y-4 bg-white p-4 rounded shadow">
        <input placeholder="Nom" className="input w-full" value={newProd.nom} onChange={(e) => setNewProd({ ...newProd, nom: e.target.value })} />
        <input placeholder="Description" className="input w-full" value={newProd.description} onChange={(e) => setNewProd({ ...newProd, description: e.target.value })} />
        <input placeholder="Prix (€)" type="number" className="input w-full" value={newProd.prix} onChange={(e) => setNewProd({ ...newProd, prix: Number(e.target.value) })} />
        <input placeholder="Stock" type="number" className="input w-full" value={newProd.stock} onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })} />
        <input placeholder="Image URL" className="input w-full" value={newProd.image_url} onChange={(e) => setNewProd({ ...newProd, image_url: e.target.value })} />
        <button onClick={ajouterProduit} className="bg-green-600 text-white px-4 py-2 rounded">Ajouter le produit</button>
      </div>

      <h2 className="text-2xl font-bold mt-8">📦 Produits existants</h2>
      <ul className="space-y-2">
        {produits.map((prod) => (
          <li key={prod.id} className="border p-2 rounded flex justify-between items-center">
            <div>
              <strong>{prod.nom}</strong> — {prod.prix} € ({prod.stock} en stock)
            </div>
            <button
              onClick={() => supprimerProduit(prod.id)}
              className="text-red-600 hover:underline"
            >
              🗑️ Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
