export default async function handler(req, res) {
  const mockResults = [
    {
      title: "🏠 Maison 100m² avec jardin (simulée)",
      price: "320 000 €",
      image: "https://via.placeholder.com/300x200.png?text=Maison+Simulée",
      link: "https://www.leboncoin.fr/annonce-fictive-1"
    },
    {
      title: "🏢 Appartement 70m² centre-ville (simulé)",
      price: "210 000 €",
      image: "https://via.placeholder.com/300x200.png?text=Appartement+Simulé",
      link: "https://www.leboncoin.fr/annonce-fictive-2"
    }
  ]

  res.status(200).json({
    results: mockResults,
    simulated: true
  })
}
