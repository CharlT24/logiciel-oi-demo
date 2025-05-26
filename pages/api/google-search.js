import puppeteer from 'puppeteer'

export default async function handler(req, res) {
  const { ville = "Paris", budget = 300000, type = "maison" } = req.query

  const query = `${type} à vendre ${ville} ${budget}€`
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')

    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 })

    // Pause manuelle
    await new Promise(resolve => setTimeout(resolve, 1500))

    await page.waitForSelector('div.g', { timeout: 10000 }).catch(() => {
      console.warn("⚠️ Aucun résultat Google détecté.")
    })

    const results = await page.evaluate(() => {
      const nodes = document.querySelectorAll('div.g')
      const data = []

      nodes.forEach((el) => {
        const title = el.querySelector('h3')?.innerText
        const link = el.querySelector('a')?.href

        if (title && link) {
          data.push({ title, link })
        }
      })

      return data.slice(0, 5)
    })

    await browser.close()
    res.status(200).json({ results })
  } catch (error) {
    console.error("❌ Erreur Google Search:", error.message)
    res.status(500).json({ error: error.message })
  }
}
