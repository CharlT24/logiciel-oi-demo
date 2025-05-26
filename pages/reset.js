import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabaseClient"

export default function ResetPage() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [accessToken, setAccessToken] = useState("")

  useEffect(() => {
    const hash = window.location.hash
    const token = new URLSearchParams(hash.substring(1)).get("access_token")
    if (token) {
      setAccessToken(token)
    } else {
      setError("Token manquant ou invalide.")
    }
  }, [])

  const handleReset = async (e) => {
    e.preventDefault()
    setError("")
    const { data, error } = await supabase.auth.updateUser(
      { password: newPassword },
      { accessToken }
    )

    if (error) return setError(error.message)

    setSuccess(true)
    setTimeout(() => router.push("/login"), 2000)
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-6 rounded shadow-md w-80 text-center"
      >
        <h2 className="text-xl font-semibold mb-4">🔐 Nouveau mot de passe</h2>

        {success ? (
          <p className="text-green-600">Mot de passe modifié ! Redirection...</p>
        ) : (
          <>
            <input
              className="w-full border p-2 mb-2 rounded"
              type="password"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <button
              type="submit"
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            >
              Valider
            </button>
          </>
        )}
      </form>
    </div>
  )
}
