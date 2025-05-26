import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { bien_id, agent_id, bien_info, proprietaire_info } = req.body;

  if (!bien_id) {
    return res.status(400).json({ message: "Bien ID manquant" });
  }

  try {
    const { data: lastMandat, error: lastError } = await supabase
      .from("registres_mandats")
      .select("numero_mandat")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (lastError && lastError.code !== "PGRST116") {
      throw lastError;
    }

    let nextNumber = 1;
    if (lastMandat?.numero_mandat) {
      nextNumber = parseInt(lastMandat.numero_mandat) + 1;
    }
    const numeroMandat = String(nextNumber).padStart(4, "0");

    const { error: insertError } = await supabase.from("registres_mandats").insert({
      numero_mandat: numeroMandat,
      ville: bien_info.ville,
      code_postal: bien_info.code_postal,
      type_bien: bien_info.type_bien,
      proprietaire_nom: proprietaire_info.nom,
      proprietaire_prenom: proprietaire_info.prenom,
      adresse_proprietaire: proprietaire_info.adresse_principale,
      adresse_bien: bien_info.adresse_bien || null,
      bien_id,
      agent_id,
    });

    if (insertError) {
      console.error("❌ Erreur insert mandat:", insertError);
      throw insertError;
    }

    // 🔎 DEBUG ID
    const idToMatch = bien_id.trim();
    console.log("🔎 Tentative de mise à jour du bien ID :", idToMatch, `(${typeof idToMatch})`);

    const { data: currentBien } = await supabase
      .from("biens")
      .select("statut")
      .eq("id", idToMatch)
      .single();

    console.log("📋 Statut actuel avant update :", currentBien?.statut);

    // 🔍 Affichage de tous les ID de la table
    const { data: allBiens } = await supabase.from("biens").select("id");
    console.log("📦 Liste des ID existants :", allBiens.map(b => b.id));

    // 🔄 Mise à jour du statut
    const { data: updateResult, error: updateError } = await supabase
      .from("biens")
      .update({ statut: "disponible" })
      .eq("id", idToMatch)
      .select();

    if (updateError) {
      console.error("❌ Erreur mise à jour statut :", updateError);
      return res.status(500).json({ message: updateError.message });
    }

    if (!updateResult || updateResult.length === 0) {
      console.warn("⚠️ Aucun bien mis à jour. ID introuvable ou statut déjà correct.");
    } else {
      console.log("✅ Statut mis à jour avec succès :", updateResult[0]);
    }

    return res.status(200).json({ success: true, numero_mandat: numeroMandat });
  } catch (err) {
    console.error("❌ Erreur serveur:", err.message || err);
    return res.status(500).json({ message: err.message || "Erreur serveur" });
  }
}
