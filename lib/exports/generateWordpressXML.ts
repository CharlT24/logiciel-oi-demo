export const generateWordpressXML = (biens: any[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<biens>
${biens.map(b => `
  <bien>
    <id>${b.id}</id>
    <titre>${b.titre}</titre>
    <description><![CDATA[${b.description || ""}]]></description>
    <prix>${b.prix_vente}</prix>
    <prix_net_vendeur>${b.prix_net_vendeur}</prix_net_vendeur>
    <honoraires>${b.honoraires}</honoraires>
    <pourcentage_honoraires>${b.pourcentage_honoraires}</pourcentage_honoraires>
    <ville>${b.ville}</ville>
    <code_postal>${b.code_postal}</code_postal>
    <surface>${b.surface_m2}</surface>
    <surface_terrain>${b.surface_terrain}</surface_terrain>
    <surface_carrez>${b.surface_carrez}</surface_carrez>
    <nb_pieces>${b.nb_pieces}</nb_pieces>
    <nb_chambres>${b.nb_chambres}</nb_chambres>
    <etage>${b.etage}</etage>
    <type_bien>${b.type_bien}</type_bien>
    <statut>${b.statut}</statut>
    <mandat>${b.mandat}</mandat>
    <annee_construction>${b.annee_construction}</annee_construction>
    <type_chauffage>${b.type_chauffage}</type_chauffage>
    <mode_chauffage>${b.mode_chauffage}</mode_chauffage>
    <dpe>${b.dpe}</dpe>
    <dpe_conso_indice>${b.dpe_conso_indice}</dpe_conso_indice>
    <dpe_ges_indice>${b.dpe_ges_indice}</dpe_ges_indice>
    <energie_finale_kwh>${b.energie_finale_kwh}</energie_finale_kwh>
    <dpe_cout_min>${b.dpe_cout_min}</dpe_cout_min>
    <dpe_cout_max>${b.dpe_cout_max}</dpe_cout_max>
    <taxe_fonciere>${b.taxe_fonciere}</taxe_fonciere>
    <quote_part_charges>${b.quote_part_charges}</quote_part_charges>
    <fonds_travaux>${b.fonds_travaux}</fonds_travaux>
    <agent_id>${b.agent_id}</agent_id>
    <cover>${b.cover}</cover>
    <gallery>
      ${(b.gallery || []).map((img: string) => `<photo>${img}</photo>`).join("\n      ")}
    </gallery>
    <options>${(b.options || []).join(", ")}</options>
  </bien>
`).join("\n")}
</biens>`;
};
