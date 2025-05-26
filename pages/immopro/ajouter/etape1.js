import { useRouter } from "next/router";
import { useState } from "react";

export default function Etape1() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [error, setError] = useState("");  // Pour afficher un message d'erreur

  const handleSubmit = (e) => {
    e.preventDefault();

    // Si le type n'est pas sélectionné, afficher un message d'erreur
    if (!type) {
      setError("Merci de sélectionner un type d'immobilier professionnel");
      return;
    }

    // Si tout est valide, naviguer vers l'étape 2 avec le type sélectionné
    router.push({
      pathname: "/immopro/ajouter/etape2",
      query: { type }
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">🏢 Étape 1 : Type de bien</h1>
      <p className="text-gray-600">Quel type d'immobilier professionnel souhaitez-vous ajouter ?</p>

      {/* Afficher l'erreur si nécessaire */}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block">
            <input
              type="radio"
              name="type"
              value="fonds_de_commerce"
              onChange={(e) => setType(e.target.value)}
              className="mr-2"
            />
            Fonds de commerce
          </label>

          <label className="block">
            <input
              type="radio"
              name="type"
              value="locaux_commerciaux"
              onChange={(e) => setType(e.target.value)}
              className="mr-2"
            />
            Locaux commerciaux
          </label>
        </div>

        <button
          type="submit"
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Continuer ➡️
        </button>
      </form>
    </div>
  );
}
