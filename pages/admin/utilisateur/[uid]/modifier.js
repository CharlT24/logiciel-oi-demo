import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ModifierUtilisateur() {
  const router = useRouter();
  const { uid } = router.query;
  const [user, setUser] = useState(null);
  const [agences, setAgences] = useState([]);
  const [uploadPreview, setUploadPreview] = useState("");

  useEffect(() => {
    if (uid) {
      supabase.from("utilisateurs").select("*").eq("id", uid).single().then(({ data }) => {
        setUser(data);
        if (data?.id) {
          const url = `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/avatars/${data.id}.jpg`;
          setUploadPreview(url);
        }
      });
      supabase.from("agences").select("id, nom").then(({ data }) => setAgences(data));
    }
  }, [uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.id) return;

    const { error } = await supabase.storage
      .from("photos")
      .upload(`avatars/${user.id}.jpg`, file, { upsert: true });

    if (error) {
      alert("Erreur lors de l’upload");
      return;
    }

    const publicUrl = `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/avatars/${user.id}.jpg`;
    setUploadPreview(publicUrl);
    alert("✅ Photo mise à jour !");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("utilisateurs").update(user).eq("id", uid);
    if (!error) router.push("/admin/parametres/utilisateurs");
  };

  if (!user) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Modifier l'utilisateur</h1>

      {uploadPreview && (
        <img
          src={uploadPreview}
          alt="avatar"
          className="w-32 h-32 rounded-full object-cover border shadow"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block mt-2 mb-4"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="prenom"
          value={user.prenom || ""}
          onChange={handleChange}
          placeholder="Prénom"
          className="w-full border p-2 rounded"
        />
        <input
          name="nom"
          value={user.nom || ""}
          onChange={handleChange}
          placeholder="Nom"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="email"
          value={user.email || ""}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <input
          name="telephone"
          value={user.telephone || ""}
          onChange={handleChange}
          placeholder="Téléphone"
          className="w-full border p-2 rounded"
        />
        <input
          name="ville"
          value={user.ville || ""}
          onChange={handleChange}
          placeholder="Ville"
          className="w-full border p-2 rounded"
        />
        <input
          name="rsac"
          value={user.rsac || ""}
          onChange={handleChange}
          placeholder="Numéro RSAC"
          className="w-full border p-2 rounded"
        />
        <select
          name="agence_id"
          value={user.agence_id || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Aucune agence</option>
          {agences.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nom}
            </option>
          ))}
        </select>

        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
          Enregistrer
        </button>
      </form>
    </div>
  );
}
