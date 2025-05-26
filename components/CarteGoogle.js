// components/CarteGoogle.js

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { useMemo } from "react"

export default function CarteGoogle({ lat, lng }) {
  const center = useMemo(() => ({ lat, lng }), [lat, lng])

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  })

  if (!isLoaded) return <p>Chargement de la carte...</p>

  return (
    <div className="w-full h-64 mt-4 rounded-lg overflow-hidden shadow">
      <GoogleMap
        center={center}
        zoom={13}
        mapContainerStyle={{ width: "100%", height: "100%" }}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  )
}
