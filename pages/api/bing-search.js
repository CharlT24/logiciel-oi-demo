export default async function handler(req, res) {
  const { ville_recherche, type_bien, budget_max } = req.body
  const mockResults = [
    {
      titre: `${type_bien} à vendre à ${ville_recherche}`,
      prix: budget_max - 5000,
      url: "https://www.bing.com/example-bien"
    }
  ]
  res.status(200).json(mockResults)
}
