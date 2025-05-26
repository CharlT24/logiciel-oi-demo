const CSV_SEPARATOR = "!#";

function wrap(value: any): string {
  return `"${String(value ?? "").replace(/"/g, "'")}"`;
}

export function generateSeLogerCSV(biens: any[]): string {
  const headers = [
    "ID_ANNONCE", "CATEGORIE", "TYPEBIEN", "TITRE", "TEXTE", "PRIX", "SURFACE",
    "NB_PIECES", "NB_CHAMBRES", "NB_SDB", "NB_WC", "SURFACE_SEJOUR", "SURFACE_TERRAIN",
    "ETAGE", "NB_ETAGES", "ASCENSEUR", "CHAUFFAGE", "CUISINE", "BALCON", "TERRASSE",
    "SURFACE_TERRASSE", "CAVE", "PARKING", "GARAGE", "JARDIN", "EXPOSITION",
    "ADRESSE", "CP", "VILLE", "LATITUDE", "LONGITUDE", "DPE", "GES",
    "DPE_ETIQUETTE", "GES_ETIQUETTE", "NOM_CONTACT", "EMAIL_CONTACT", "TEL_CONTACT",
    "URL_PHOTO_1", "URL_PHOTO_2", "URL_PHOTO_3", "URL_PHOTO_4", "URL_PHOTO_5"
  ];

  const rows = [headers.map(wrap).join(CSV_SEPARATOR)];

  for (const bien of biens) {
    const photos = Array.isArray(bien.gallery) ? bien.gallery.slice(0, 5) : [];
    const photoUrls = photos.map((img: string) =>
      `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/gallery/${bien.id}/${img}`
    );

    const row = [
      `OI-${(bien.id || "").slice(0, 8)}`,
      bien.type_offre || "Vente",
      bien.type_bien || "",
      bien.titre || "",
      (bien.description || "").replace(/\n/g, "<BR>"),
      bien.prix_vente || 0,
      bien.surface_m2 || 0,
      bien.nb_pieces || "",
      bien.nb_chambres || "",
      bien.nb_sdb || "",
      bien.nb_wc || "",
      bien.surface_sejour || "",
      bien.surface_terrain || "",
      bien.etage || "",
      bien.nb_etages || "",
      bien.ascenseur ? "O" : "N",
      bien.type_chauffage || "",
      bien.cuisine || "",
      bien.balcon ? "O" : "N",
      bien.terrasse ? "O" : "N",
      bien.surface_terrasse || "",
      bien.cave ? "O" : "N",
      bien.parking ? "O" : "N",
      bien.garage ? "O" : "N",
      bien.jardin ? "O" : "N",
      bien.exposition || "",
      bien.adresse_bien || "",
      bien.code_postal || "",
      bien.ville || "",
      bien.latitude || "",
      bien.longitude || "",
      bien.dpe_conso_indice || "",
      bien.dpe_ges_indice || "",
      bien.dpe || "",
      bien.dpe_etiquette_ges || "",
      bien.agent?.nom || "",
      bien.agent?.email || "",
      bien.agent?.telephone || "",
      ...photoUrls,
      ...Array(5 - photoUrls.length).fill("") // compléter à 5 max
    ];

    rows.push(row.map(wrap).join(CSV_SEPARATOR));
  }

  return rows.join("\r\n");
}
