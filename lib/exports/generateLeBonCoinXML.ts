export const generateLeBonCoinXML = (biens: any[]) => {
  console.log("📤 biens reçus par generateLeBonCoinXML:", biens)

  if (!Array.isArray(biens)) throw new Error("biens n'est pas un tableau")

  return `<?xml version="1.0" encoding="UTF-8"?>
<annonces>
${biens.map((bien, i) => `
  <annonce>
    <id>${i + 1}</id>
    <titre>${bien.titre || "Sans titre"}</titre>
    <ville>${bien.ville || "NC"}</ville>
    <prix>${bien.prix_vente || 0}</prix>
    <surface>${bien.surface_m2 || 0}</surface>
    <dpe>${bien.dpe || "NC"}</dpe>
    <description>${bien.description || "Aucune description."}</description>
  </annonce>
`).join("\n")}
</annonces>`
}
