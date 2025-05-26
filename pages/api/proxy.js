// Fichier : /pages/api/proxy.js

export default async function handler(req, res) {
    const { url } = req.query;
  
    if (!url || !url.startsWith("https://maps.googleapis.com")) {
      return res.status(400).json({ error: "URL invalide ou non autorisée" });
    }
  
    try {
      const response = await fetch(decodeURIComponent(url));
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Erreur proxy:", error);
      res.status(500).json({ error: "Erreur serveur proxy" });
    }
  }
  