// utils/xmlGenerator.js

export const generateXML = (biens) => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<client>\n`

  for (const bien of biens) {
    xml += `  <annonce>\n`
    xml += `    <id>${bien.id}</id>\n`
    xml += `    <titre><![CDATA[${bien.titre || ""}]]></titre>\n`
    xml += `    <texte><![CDATA[${bien.description || ""}]]></texte>\n`
    xml += `    <code_postal>${bien.code_postal || ""}</code_postal>\n`
    xml += `    <ville>${bien.ville || ""}</ville>\n`
    xml += `    <code_type>${bien.code_type || "1200"}</code_type>\n` // maison par défaut
    xml += `    <prix>${bien.prix_vente || 0}</prix>\n`
    xml += `    <surface>${bien.surface_m2 || 0}</surface>\n`
    xml += `    <nombre_pieces>${bien.nb_pieces || ""}</nombre_pieces>\n`
    xml += `    <nombre_chambres>${bien.nb_chambres || ""}</nombre_chambres>\n`
    xml += `    <etage>${bien.etage || ""}</etage>\n`
    xml += `    <dpe>${bien.dpe || ""}</dpe>\n`
    xml += `    <ges>${bien.dpe_ges_indice || ""}</ges>\n`

    // Photos
    if (bien.gallery && Array.isArray(bien.gallery)) {
      bien.gallery.forEach((photo) => {
        xml += `    <photo>${`https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/gallery/${bien.id}/${photo}`}</photo>\n`
      })
    }

    xml += `  </annonce>\n`
  }

  xml += `</client>\n`
  return xml
}
