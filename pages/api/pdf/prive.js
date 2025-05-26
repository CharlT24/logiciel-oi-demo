// pages/api/pdf/prive.js
import { supabase } from "@/lib/supabaseClient"
import puppeteer from "puppeteer"

export default async function handler(req, res) {
  const { id } = req.query
  if (!id) return res.status(400).send("Missing ID")

  const { data: bien, error } = await supabase.from("biens").select("*").eq("id", id).single()
  if (error || !bien) return res.status(404).send("Bien introuvable")

  const { data: proprietaires } = await supabase.from("proprietaires").select("*").eq("bien_id", id)
  const cover = `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/covers/${id}/cover.jpg`
  const galleryData = await supabase.storage.from("photos").list(`gallery/${id}`)
  const gallery = galleryData?.data?.map(p => `https://fkavtsofmglifzalclyn.supabase.co/storage/v1/object/public/photos/gallery/${id}/${p.name}`) || []

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #e95f1c; font-size: 28px; }
          .section { margin-top: 30px; }
          .photos img { max-width: 100%; margin: 10px 0; border-radius: 12px; }
          .gallery { display: flex; gap: 10px; flex-wrap: wrap; }
          .gallery img { width: 200px; height: 140px; object-fit: cover; border-radius: 8px; }
          .info p { margin: 6px 0; font-size: 14px; }
          .badge { background: #f2f2f2; padding: 6px 12px; border-radius: 20px; display: inline-block; margin: 4px; font-size: 13px; }
          .sub { font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>${bien.titre}</h1>
        <p class="sub">${bien.type_bien} • ${bien.surface_m2} m² • ${bien.nb_chambres} chambres • ${bien.ville} (${bien.code_postal})</p>

        <div class="photos">
          <img src="${cover}" />
        </div>

        <div class="section info">
          <h2>🔎 Détails complets</h2>
          <p><strong>Prix affiché :</strong> ${bien.prix_vente?.toLocaleString()} €</p>
          <p><strong>Honoraires :</strong> ${bien.honoraires?.toLocaleString()} €</p>
          <p><strong>Net vendeur :</strong> ${bien.prix_net_vendeur?.toLocaleString()} €</p>
          <p><strong>% Honoraires :</strong> ${bien.pourcentage_honoraires}%</p>
          <p><strong>Mandat :</strong> ${bien.mandat}</p>
          <p><strong>Statut :</strong> ${bien.statut}</p>
          <p><strong>Étage :</strong> ${bien.etage}</p>
          <p><strong>Chauffage :</strong> ${bien.type_chauffage} (${bien.mode_chauffage})</p>
          <p><strong>Année construction :</strong> ${bien.annee_construction}</p>
          <p><strong>Surface Carrez :</strong> ${bien.surface_carrez} m²</p>
          <p><strong>Terrain :</strong> ${bien.surface_terrain} m²</p>
          <p><strong>Taxe foncière :</strong> ${bien.taxe_fonciere} €</p>
          <p><strong>Charges annuelles :</strong> ${bien.quote_part_charges} €</p>
          <p><strong>Fonds travaux :</strong> ${bien.fonds_travaux} €</p>
        </div>

        ${bien.options?.length ? `<div class="section">
          <h2>✨ Équipements</h2>
          ${bien.options.map(opt => `<span class="badge">${opt}</span>`).join(" ")}
        </div>` : ""}

        ${gallery.length ? `<div class="section gallery">
          ${gallery.map(src => `<img src="${src}" />`).join(" ")}
        </div>` : ""}

        ${bien.description ? `<div class="section">
          <h2>📝 Description</h2>
          <p style="font-size: 14px; color: #444; line-height: 1.5;">${bien.description}</p>
        </div>` : ""}

        ${proprietaires?.length ? `<div class="section">
          <h2>👤 Propriétaire(s)</h2>
          ${proprietaires.map(p => `
            <p><strong>${p.prenom} ${p.nom}</strong> – ${p.email} – ${p.telephone}</p>
            <p class="sub">Adresse : ${p.adresse_principale}</p>
            ${p.adresse_differente ? `<p class="sub">Adresse 2 : ${p.adresse_differente}</p>` : ""}
            <p class="sub">Mandat #${p.numero_mandat} – du ${p.date_debut_mandat} au ${p.date_fin_mandat}</p>
            <br />
          `).join("")}
        </div>` : ""}

        <p style="margin-top: 40px; font-size: 12px; color: #888;">Fiche confidentielle générée via CRM Immo</p>
      </body>
    </html>
  `

  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle0' })
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true })
  await browser.close()

  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", `inline; filename=fiche-privee-${id}.pdf`)
  res.send(pdfBuffer)
}