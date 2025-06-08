// pages/boutique/index.tsx
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function Boutique() {
  const [produits, setProduits] = useState([]);
  const [panier, setPanier] = useState([]);

  useEffect(() => {
    const fetchProduits = async () => {
      const { data, error } = await supabase.from("boutique").select("*").eq("actif", true);
      if (!error) setProduits(data);
    };
    fetchProduits();
  }, []);

  const ajouterAuPanier = (produit, quantite) => {
    setPanier((prev) => [...prev, { ...produit, quantite }]);
  };

  const handlePaiement = async () => {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ panier }),
  });

  const data = await res.json();
  if (data.url) {
    window.location.href = data.url; // redirige vers Stripe
  } else {
    alert("❌ Erreur lors de la création du paiement");
  }
};


  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-orange-600">🛒 Boutique</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {produits.map((prod) => (
          <div key={prod.id} className="border rounded shadow p-4 space-y-2">
            <img src={prod.image_url} alt={prod.nom} className="w-full h-48 object-cover rounded" />
            <h2 className="text-lg font-semibold">{prod.nom}</h2>
            <p className="text-gray-700">{prod.prix} €</p>
            <p className="text-sm text-gray-500">Stock : {prod.stock}</p>
            <input
              type="number"
              min="1"
              max={prod.stock}
              defaultValue="1"
              className="border rounded px-2 py-1 w-full"
              onChange={(e) => (prod.quantiteChoisie = e.target.value)}
            />
            <button
              onClick={() => ajouterAuPanier(prod, prod.quantiteChoisie || 1)}
              className="bg-orange-500 text-white px-4 py-2 rounded w-full"
            >
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">🛍️ Mon panier</h2>
        {panier.length === 0 ? (
          <p className="text-gray-500">Votre panier est vide.</p>
        ) : (
          <ul className="space-y-2">
            {panier.map((item, index) => (
              <li key={index} className="border p-2 rounded flex justify-between">
                {item.nom} x {item.quantite} — {item.prix * item.quantite} €
              </li>
            ))}
          </ul>
        )}
        {panier.length > 0 && (
<button
  onClick={handlePaiement}
  className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
>
  Passer au paiement
</button>
        )}
      </div>
    </div>
  );
}
