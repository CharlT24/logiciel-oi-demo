// pages/api/pdf/vitrine.js
import { supabase } from "@/lib/supabaseClient"
import puppeteer from "puppeteer"

export default async function handler(req, res) {
  const { id } = req.query
  if (!id) return res.status(400).send("Missing ID")

  const { data: bien, error } = await supabase.from("biens").select("*").eq("id", id).single()
  if (error || !bien) return res.status(404).send("Bien introuvable")

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
        </style>
      </head>
      <body>
        <h1>${bien.titre}</h1>
        <p style="color: #555;">${bien.type_bien} • ${bien.surface_m2} m² • ${bien.nb_chambres} chambres</p>

        <div class="photos">
          <img src="${cover}" />
        </div>

        <div class="section info">
          <h2 style="font-size: 20px; color: #333;">🔎 Détails</h2>
          <p><strong>Prix affiché :</strong> ${bien.prix_vente?.toLocaleString()} €</p>
          <p><strong>Honoraires :</strong> ${bien.honoraires?.toLocaleString()} €</p>
          <p><strong>Type :</strong> ${bien.type_bien}</p>
          <p><strong>Étage :</strong> ${bien.etage || "-"}</p>
          <p><strong>Chauffage :</strong> ${bien.type_chauffage} (${bien.mode_chauffage})</p>
          <p><strong>Année :</strong> ${bien.annee_construction}</p>
        </div>

        ${bien.options?.length ? `<div class="section">
          <h2 style="font-size: 20px; color: #333;">✨ Équipements & Atouts</h2>
          ${bien.options.map(opt => `<span class="badge">${opt}</span>`).join(" ")}
        </div>` : ""}

        ${gallery.length ? `<div class="section gallery">
          ${gallery.slice(0, 6).map(src => `<img src="${src}" />`).join(" ")}
        </div>` : ""}

        ${bien.description ? `<div class="section">
          <h2 style="font-size: 20px; color: #333;">📝 Description</h2>
          <p style="font-size: 14px; color: #444; line-height: 1.5;">${bien.description}</p>
        </div>` : ""}

        <p style="margin-top: 40px; font-size: 12px; color: #888;">Fiche générée automatiquement • CRM Immo</p>
      </body>
    </html>
  `

  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle0' })
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true })
  await browser.close()

  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", `inline; filename=fiche-vitrine-${id}.pdf`)
  res.send(pdfBuffer)
}