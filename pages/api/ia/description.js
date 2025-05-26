// Fichier : /pages/api/ia/description.js

export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Méthode non autorisée" })
    }
  
    const { titre, surface, ville, prix, type, description, pieces } = req.body
  
    const key = "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"
  
    const prompt = `Tu es un assistant immobilier. Rédige une annonce engageante pour un bien :\n\nTitre: ${titre}\nSurface: ${surface} m²\nType: ${type}\nVille: ${ville}\nPrix: ${prix} €\nDescription libre: ${description}\n\nPièces détaillées :\n${pieces.map(p => `- ${p.nom} de ${p.surface} m²`).join("\n")}\n\nRespecte le ton professionnel et clair.`
  
    try {
      const completion = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Tu es un assistant immobilier professionnel." },
            { role: "user", content: prompt }
          ],
          max_tokens: 400
        })
      })
  
      const data = await completion.json()
      const result = data?.choices?.[0]?.message?.content || "Pas de réponse."
      res.status(200).json({ description: result })
    } catch (err) {
      console.error("❌ GPT API error:", err)
      res.status(500).json({ error: "Erreur GPT" })
    }
  }
  