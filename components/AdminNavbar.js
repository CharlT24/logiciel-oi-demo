import Link from "next/link"

export default function AdminNavbar() {
  return (
    <nav className="bg-white shadow mb-6 px-4 py-3 flex justify-center space-x-4">
      <Link href="/espace" className="text-blue-600 hover:underline">🏡 Espace</Link>
      <Link href="/clients" className="text-blue-600 hover:underline">👥 Ajouter client</Link>
      <Link href="/biens" className="text-blue-600 hover:underline">🏠 Ajouter bien</Link>
      <Link href="/admin/utilisateurs" className="text-blue-600 hover:underline">🛠 Utilisateurs</Link>
    </nav>
  )
}
