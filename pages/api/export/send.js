import nodemailer from "nodemailer"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" })
  }

  try {
    const xmlContent = req.body

    // Configuration du transporteur SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    })

    // Envoi de l'email avec pièce jointe XML
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: "portail@example.com", // 📩 à remplacer par le vrai portail
      subject: "📤 Export automatique d’un bien immobilier",
      text: "Veuillez trouver ci-joint le fichier XML de l’annonce exportée.",
      attachments: [
        {
          filename: "bien.xml",
          content: xmlContent,
          contentType: "application/xml"
        }
      ]
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("Erreur d'envoi XML :", error)
    return res.status(500).json({ error: "Erreur interne lors de l'envoi XML" })
  }
}