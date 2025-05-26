import puppeteer from 'puppeteer'

export default async function handler(req, res) {
  const { ville = "Lyon", min = 100000, max = 500000, type = "maison" } = req.query

  const url = `https://www.leboncoin.fr/recherche?category=9&real_estate_type=${type}&locations=${ville}&price=${min}-${max}`

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')

    console.log("🔍 Ouverture de la page Leboncoin...")
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    })

    console.log("⏳ Attente des annonces...")
    await page.waitForSelector('[data-qa-id="aditem_container"]', { timeout: 20000 }).catch(() => {
      console.warn("⚠️ Aucune annonce détectée – le sélecteur n'est peut-être plus à jour.")
    })

    console.log("📦 Récupération des annonces...")
    const annonces = await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-qa-id="aditem_container"]')
      if (!cards || cards.length === 0) return []

      const data = []

      cards.forEach(card => {
        const title = card.querySelector('[data-qa-id="aditem_title"]')?.innerText?.trim()
        const price = card.querySelector('[data-qa-id="aditem_price"]')?.innerText?.trim()
        const image = card.querySelector('img')?.src
        const link = 'https://www.leboncoin.fr' + card.getAttribute('href')

        if (title && price && link) {
          data.push({ title, price, image, link })
        }
      })

      return data
    })

    await browser.close()

    if (!annonces || annonces.length === 0) {
      console.warn("⚠️ Aucune annonce récupérée")
      return res.status(200).json({ results: [], message: "Aucune annonce trouvée." })
    }

    console.log(`✅ ${annonces.length} annonces récupérées.`)
    res.status(200).json({ results: annonces })
  } catch (error) {
    console.error("❌ Erreur Puppeteer:", error.message)
    res.status(500).json({ error: "Scraping échoué", details: error.message })
  }
}
