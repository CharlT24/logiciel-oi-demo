// /pages/auth/index.js
import { signIn, useSession, signOut } from "next-auth/react"

export default function LoginPublic() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="p-10 text-center space-y-4">
        <h1 className="text-2xl font-bold">Bienvenue {session.user.name}</h1>
        <p>{session.user.email}</p>
        <button
          onClick={() => signOut()}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          🚪 Se déconnecter
        </button>
      </div>
    )
  }

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-6">Connexion via Google</h1>
      <button
        onClick={() => signIn("google")}
        className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
      >
        🔐 Se connecter avec Google
      </button>
    </div>
  )
}
