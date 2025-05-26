import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Agenda() {
  const sessionHook = useSession()
  const session = sessionHook?.data
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (session?.accessToken) {
      fetchGoogleCalendarEvents()
    }
  }, [session])

  const fetchGoogleCalendarEvents = async () => {
    try {
      const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=5&orderBy=startTime&singleEvents=true", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      })

      if (!res.ok) throw new Error("Erreur API Google Calendar")

      const data = await res.json()
      setEvents(data.items || [])
    } catch (err) {
      console.error("❌", err)
      setError("Erreur lors de la récupération de l'agenda Google.")
    }
  }

  const handleOutlookLogin = () => {
    alert("🔧 Connexion Outlook à venir (Microsoft Graph API)")
  }

  if (sessionHook.status === "loading") {
    return (
      <div className="text-center mt-20 text-gray-500 text-sm">
        ⏳ Chargement de la session...
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">📅 Mon Agenda / Google</h1>

      {!session && (
        <div className="space-y-4">
          <p className="text-gray-600">Connecte-toi pour synchroniser ton agenda</p>
          <button
            onClick={() => signIn("google")}
            className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 block"
          >🔐 Connexion Google</button>
          <button
            onClick={handleOutlookLogin}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 block"
          >🔷 Connexion Outlook</button>
        </div>
      )}

      {session && (
        <div className="space-y-4">
          <p className="text-gray-600">Connecté en tant que : <strong>{session.user.email}</strong></p>
          <button
            onClick={() => signOut()}
            className="text-red-600 text-sm hover:underline"
          >🚪 Se déconnecter</button>

          <hr />

          <h2 className="text-lg font-semibold">📆 Événements à venir</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {events.length > 0 ? (
            <ul className="space-y-3 text-sm">
              {events.map(event => (
                <li key={event.id} className="p-3 bg-orange-50 border rounded">
                  <p className="font-semibold text-gray-800">📌 {event.summary || "(Sans titre)"}</p>
                  <p className="text-gray-600">🗓️ {event.start?.dateTime?.slice(0, 16).replace("T", " ") || event.start?.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Aucun événement trouvé.</p>
          )}
        </div>
      )}
    </div>
  )
}