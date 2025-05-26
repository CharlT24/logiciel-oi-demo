function escapeXml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const generateGreenAcresXML = (biens: any[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<greenacres>
${biens.map(b => `
  <property>
    <title>${escapeXml(b.titre)}</title>
    <location>${escapeXml(b.ville)}</location>
    <area>${b.surface_m2 || ""}</area>
    <price>${b.prix_vente || ""}</price>
    <description><![CDATA[${b.description || ""}]]></description>
    <type>${escapeXml(b.type_bien || "")}</type>
    <rooms>${b.nb_pieces || ""}</rooms>
    <bedrooms>${b.nb_chambres || ""}</bedrooms>
  </property>
`).join("\n")}
</greenacres>`
}
