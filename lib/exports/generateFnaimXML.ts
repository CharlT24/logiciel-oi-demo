export const generateFnaimXML = (biens: any[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<fnaim>
${biens.map(b => `
  <annonce>
    <titre>${b.titre}</titre>
    <prix>${b.prix_vente}</prix>
    <surface>${b.surface_m2}</surface>
  </annonce>
`).join("\n")}
</fnaim>`
}
