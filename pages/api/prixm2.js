import prixm2 from "@/data/prixm2.json"

export default function handler(req, res) {
  res.status(200).json(prixm2)
}
