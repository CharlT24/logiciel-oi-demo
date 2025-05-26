export const generateBienIciXML = (biens: any[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<listings>
${biens.map(b => `
  <listing>
    <title>${b.titre}</title>
    <location>${b.ville}</location>
    <price>${b.prix_vente}</price>
    <area>${b.surface_m2}</area>
  </listing>
`).join("\n")}
</listings>`
}
