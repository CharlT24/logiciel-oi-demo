// pages/api/google.js
export default async function handler(req, res) {
    const { query } = req.query
  
    const apiKey = process.env.GOOGLE_API_KEY
    const cx = process.env.GOOGLE_CX
  
    if (!apiKey || !cx || !query) {
      return res.status(400).json({ error: "Paramètres manquants" })
    }
  
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`
  
    try {
      const response = await fetch(url)
      const data = await response.json()
  
      const results = data.items?.map((item) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      })) || []
  
      res.status(200).json(results)
    } catch (error) {
      console.error("❌ Erreur Google Search :", error)
      res.status(500).json({ error: "Erreur serveur" })
    }
  }
  