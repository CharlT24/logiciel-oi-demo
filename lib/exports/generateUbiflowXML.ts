import { create } from "xmlbuilder2";
import { getUbiflowCodeType } from "@/lib/exports/mappings";

export function generateUbiflowXML(biens) {
  try {
    const root = create({ version: "1.0", encoding: "UTF-8" }).ele("client", { reference: "OI123" });

    for (const bien of biens) {
      const annonce = root.ele("annonce");

      let typeOffre = String(bien.type_offre || "V").toUpperCase().trim();
      if (!["V", "L", "F", "B", "W", "G"].includes(typeOffre)) {
        console.warn(`⚠️ type_offre invalide pour le bien ${bien.id} (${bien.titre})`);
        typeOffre = "V";
      }

const reference = `OI-${(bien.id || "").slice(0, 8)}`;
      annonce.ele("reference").txt(reference);
      annonce.ele("titre").txt(bien.titre || "");
      annonce.ele("texte").txt(bien.description || "Description disponible en agence.");
      const codeType = getUbiflowCodeType(bien.type_bien || "", bien.description || "");
      annonce.ele("code_type").txt(codeType);
      annonce.ele("type_offre").txt(typeOffre);

      // ✅ Contact affiché directement
      annonce.ele("contact_a_afficher").txt(bien.agent?.nom || "");
      annonce.ele("email_a_afficher").txt(bien.agent?.email || "");
      annonce.ele("telephone_a_afficher").txt(bien.agent?.telephone || "");

      // PHOTOS
      const photos = annonce.ele("photos");
      const coverUrl = `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/covers/${bien.id}/cover.jpg`;
      photos.ele("photo", { ordre: "1" }).txt(coverUrl);
      if (Array.isArray(bien.gallery)) {
        bien.gallery.forEach((img, index) => {
          const url = `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/gallery/${bien.id}/${img}`;
          photos.ele("photo", { ordre: `${index + 2}` }).txt(url);
        });
      }

      // BIEN
      const codePostal = String(bien.code_postal).trim();
      const rawVille = String(bien.ville).trim();
      const commune = rawVille.split(",")[0].replace(/France/gi, "").trim();

      const bienNode = annonce.ele("bien");
      bienNode.ele("type").txt(codeType); // Code Ubiflow
      bienNode.ele("libelle_type").txt(bien.type_bien || "");
      bienNode.ele("code_postal").txt(codePostal);
      bienNode.ele("ville").txt(commune);
      bienNode.ele("nb_pieces_logement").txt(bien.nb_pieces || "");
      bienNode.ele("nombre_de_chambres").txt(bien.nb_chambres || "");
      bienNode.ele("surface").txt(bien.surface_m2 || "");
      bienNode.ele("surface_sejour").txt("");
      bienNode.ele("surface_terrain").txt(bien.surface_terrain || "");
      bienNode.ele("annee_construction").txt(bien.annee_construction || "");

      // ✅ DIAGNOSTIQUES
      const diag = annonce.ele("diagnostiques");
      diag.ele("dpe_etiquette_conso").txt(bien.dpe || "");
      diag.ele("dpe_valeur_conso").txt(bien.dpe_conso_indice || "");
      diag.ele("dpe_etiquette_ges").txt(bien.dpe_etiquette_ges || "");
      const gesVal = parseFloat(bien.dpe_ges_indice);
      diag.ele("dpe_valeur_ges").txt(gesVal > 0 ? gesVal.toString() : "");
      diag.ele("dpe_date_realisation").txt(bien.dpe_date_realisation || "");
      diag.ele("montant_depenses_energies_min").txt(bien.montant_depenses_energies_min || "");
      diag.ele("montant_depenses_energies_max").txt(bien.montant_depenses_energies_max || "");
      diag.ele("montant_depense_energie_estime").txt(bien.montant_depense_energie_estime || "");
      diag.ele("date_indice_prix_energies").txt(bien.date_indice_prix_energies || "");
      diag.ele("altitude").txt(bien.altitude || "");

      // PRESTATIONS
      const prestations = annonce.ele("prestation");
      prestations.ele("type").txt(typeOffre);
      if (["V", "W", "F", "B", "G"].includes(typeOffre)) {
        if (bien.honoraires) prestations.ele("honoraires").txt(bien.honoraires);
        prestations.ele("honoraires_payeurs").txt(bien.charge_honoraires || "Vendeur");
        if (bien.bareme) prestations.ele("bareme").txt(bien.bareme);
      }
      if (typeOffre === "L") {
        if (bien.loyer_mensuel) prestations.ele("loyer_mensuel").txt(bien.loyer_mensuel);
        if (bien.honoraires_location) prestations.ele("honoraires_location").txt(bien.honoraires_location);
        prestations.ele("honoraires_payeurs").txt(bien.charge_honoraires || "Locataire");
        if (bien.bareme) prestations.ele("bareme").txt(bien.bareme);
      }

      // ✅ CONTACT (doublé ici pour compatibilité si requis)
      const contact = annonce.ele("contact");
      contact.ele("contact_a_afficher").txt(bien.agent?.nom || "");
      contact.ele("email_a_afficher").txt(bien.agent?.email || "");
      contact.ele("telephone_a_afficher").txt(bien.agent?.telephone || "");
    }

    return root.end({ prettyPrint: true });
  } catch (err) {
    console.error("❌ Erreur pendant la génération du XML :", err);
    throw err;
  }
}
