import L from "leaflet"
import "leaflet.heat"
import { FunctionComponent, useEffect } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import { MapWrapper } from "./styles"

interface Props {
  addressPoints?: L.HeatLatLngTuple[]
}

const MapLayers: FunctionComponent<Props> = ({ addressPoints = [] }) => {
  const map = useMap()

  useEffect(() => {
    L.heatLayer(addressPoints, {}).addTo(map)
  }, [addressPoints, map])

  return (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  )
}

const Map: FunctionComponent<Props> = ({ addressPoints = [] }) => {
  return (
    <MapWrapper>
      <MapContainer
        className="map__container"
        center={[51.505, -0.09]}
        zoom={13}
      >
        <MapLayers addressPoints={addressPoints} />
      </MapContainer>
    </MapWrapper>
  )
}

export default Map
