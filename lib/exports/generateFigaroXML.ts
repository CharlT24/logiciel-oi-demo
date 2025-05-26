export const generateFigaroXML = (biens: any[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<figaro>
${biens.map(b => `
  <bien>
    <nom>${b.titre}</nom>
    <code_postal>${b.code_postal}</code_postal>
    <mandat>${b.mandat}</mandat>
  </bien>
`).join("\n")}
</figaro>`
}
