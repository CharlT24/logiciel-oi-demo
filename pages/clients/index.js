import Link from "next/link"

export default function ChoixClients() {
  return (
    <div className="max-w-3xl mx-auto mt-20 text-center space-y-10">
      <h1 className="text-3xl font-bold text-orange-600">👥 Gestion des clients</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/clients/acquereurs" className="bg-orange-600 text-white px-6 py-4 rounded-xl shadow hover:bg-orange-700 transition">
          🛒 Voir les acquéreurs
        </Link>

        <Link href="/clients/proprietaires" className="bg-blue-600 text-white px-6 py-4 rounded-xl shadow hover:bg-blue-700 transition">
          🏡 Voir les propriétaires
        </Link>

        <Link href="/clients/locataires" className="bg-green-600 text-white px-6 py-4 rounded-xl shadow hover:bg-green-700 transition">
          🧍 Voir les locataires
        </Link>

        <Link href="/clients/partenaires" className="bg-purple-600 text-white px-6 py-4 rounded-xl shadow hover:bg-purple-700 transition">
          🤝 Voir les partenaires
        </Link>
      </div>
    </div>
  )
}
