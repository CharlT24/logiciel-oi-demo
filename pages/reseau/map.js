import { useEffect, useState } from "react"
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api"
import { supabase } from "@/lib/supabaseClient"

const containerStyle = {
  width: "100%",
  height: "80vh",
}

const center = {
  lat: 46.603354, // France centre
  lng: 1.888334,
}

export default function ReseauMap() {
  const [utilisateurs, setUtilisateurs] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from("utilisateurs").select("*")
      setUtilisateurs(data || [])
    }
    fetchUsers()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-orange-600">🗺️ Carte des agents</h1>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={6}>
          {utilisateurs.map((user) => (
            user.latitude && user.longitude && (
              <Marker
                key={user.id}
                position={{ lat: user.latitude, lng: user.longitude }}
                onClick={() => setSelected(user)}
              />
            )
          ))}

          {selected && (
            <InfoWindow
              position={{ lat: selected.latitude, lng: selected.longitude }}
              onCloseClick={() => setSelected(null)}
            >
              <div className="text-sm">
                <p className="font-bold">{selected.nom}</p>
                <p>{selected.ville}</p>
                <p className="text-orange-600 text-xs">
                  <a href={`/reseau/${selected.id}`}>➡️ Voir la fiche</a>
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}
