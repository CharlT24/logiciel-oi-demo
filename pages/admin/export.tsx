// pages/admin/export.tsx
import { useEffect, useState } from "react"

export default function ExportAdmin() {
  const [biens, setBiens] = useState([])
  const [portail, setPortail] = useState("leboncoin")
const [portails, setPortails] = useState([
  "seloger",
  "figaro",
  "fnaim",
  "greenacres",
  "wordpress",
  "ubiflow"
])


  const [xmlPreview, setXmlPreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [newPortail, setNewPortail] = useState("")
  const [credentials, setCredentials] = useState({
    url: "",
    username: "",
    password: "",
    destination: "",
    autoExport: false,
  })

  useEffect(() => {
    fetch("/api/biens/exportables")
      .then(res => res.json())
      .then(data => setBiens(data.biens || []))
  }, [])

const handleExport = async () => {
  setLoading(true);
  setStatus("");
  try {
    const res = await fetch(`/api/export/${portail}`);

    const isCSV = portail === "seloger";
    const text = await res.text(); // supporte XML ET CSV

    setXmlPreview(text);
    setStatus(isCSV ? "✅ Fichier CSV généré" : "✅ Fichier XML généré");
  } catch (e) {
    setXmlPreview("Erreur lors de la génération du fichier.");
    setStatus("❌ Erreur serveur");
  }
  setLoading(false);
};

  const handleMultiExport = async () => {
    setLoading(true)
    setStatus("")
    let success = 0
    for (const p of portails) {
      try {
        const res = await fetch(`/api/export/${p}`)
        if (res.ok) success++
      } catch (err) {
        console.error(`❌ Erreur export ${p}:`, err)
      }
    }
    setStatus(`✅ ${success} exports générés sur ${portails.length}`)
    setLoading(false)
  }

  const ajouterPortail = () => {
    if (!newPortail) return
    setPortails([...portails, newPortail])
    setNewPortail("")
  }

  const handleCredentialsChange = (field: string, value: any) => {
    setCredentials(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveCredentials = async () => {
    try {
      const res = await fetch("/api/export/save-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portail, ...credentials })
      })
      const result = await res.json()
      if (result.success) setStatus("🔐 Identifiants enregistrés.")
      else setStatus("❌ Erreur enregistrement credentials")
    } catch (err) {
      console.error(err)
      setStatus("❌ Échec serveur")
    }
  }

  const [copied, setCopied] = useState(false)

const copyXmlLink = () => {
  const link = `${window.location.origin}/api/export/${portail}`
  navigator.clipboard.writeText(link).then(() => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  })
}


  return (
  <div className="max-w-5xl mx-auto py-10 space-y-6">
    <h1 className="text-2xl font-bold text-orange-600">Export vers portails</h1>

    <div className="flex gap-4 items-center">
      <label className="font-medium">Portail :</label>
      <select
        value={portail}
        onChange={(e) => setPortail(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        {portails
          .filter(p => !["leboncoin", "bienici"].includes(p)) // ❌ exclus
          .map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
      </select>

      <button
        onClick={handleExport}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
      >
        Générer XML / CSV
      </button>

      <a
        href={`/api/export/${portail}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Télécharger le fichier
      </a>
    </div>

    {xmlPreview && (
      <div>
        <h2 className="text-lg font-semibold mt-6 mb-2">Aperçu du fichier :</h2>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-[400px] whitespace-pre-wrap">
          {xmlPreview}
        </pre>
        <a
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(xmlPreview)}`}
          download={`export-${portail}.${portail === "seloger" ? "csv" : "xml"}`}
          className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Télécharger ce fichier
        </a>
      </div>
    )}

    <button
      onClick={copyXmlLink}
      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
    >
      Copier lien direct
    </button>

    <div className="flex gap-4 mt-4 items-end">
      <div>
        <label className="block text-sm font-medium">Ajouter un portail :</label>
        <input
          value={newPortail}
          onChange={(e) => setNewPortail(e.target.value)}
          className="border px-3 py-2 rounded w-48"
          placeholder="nom-du-portail"
        />
      </div>
      <button
        onClick={ajouterPortail}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ajouter
      </button>
    </div>

    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Coordonnées du portail sélectionné</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="URL/API Endpoint"
          className="input"
          value={credentials.url || ""}
          onChange={(e) => handleCredentialsChange("url", e.target.value)}
        />
        <input
          placeholder="Utilisateur (si FTP/API)"
          className="input"
          value={credentials.username || ""}
          onChange={(e) => handleCredentialsChange("username", e.target.value)}
        />
        <input
          placeholder="Mot de passe ou token"
          className="input"
          type="password"
          value={credentials.password || ""}
          onChange={(e) => handleCredentialsChange("password", e.target.value)}
        />
        <input
          placeholder="Répertoire ou config spécifique"
          className="input"
          value={credentials.destination || ""}
          onChange={(e) => handleCredentialsChange("destination", e.target.value)}
        />
        <label className="col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            checked={credentials.autoExport || false}
            onChange={(e) =>
              handleCredentialsChange("autoExport", e.target.checked)
            }
          />
          Export automatique chaque nuit ?
        </label>
      </div>
      <button
        onClick={handleSaveCredentials}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Sauvegarder les identifiants
      </button>
    </div>

    {status && <p className="text-green-700 font-medium mt-4">{status}</p>}

    <div className="bg-orange-50 p-4 rounded border text-sm">
      <strong>Biens exportables : {biens.length}</strong>
      <ul className="list-disc ml-6">
        {biens.map((b: any) => (
          <li key={b.id}>
            {b.titre} ({b.ville})
          </li>
        ))}
      </ul>
    </div>
  </div> // ← fermeture du return
);         // ← fermeture du JSX
}          // ← fermeture du composant ExportAdmin

