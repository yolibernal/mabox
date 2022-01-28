import L from "leaflet"
import "leaflet.heat"
import { FunctionComponent, useEffect } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import { useRecoilValue } from "recoil"
import { mapCenterState, mapZoomState, pictureConfigsState } from "store"
import { MapWrapper } from "./styles"

interface MapLayerProps {
  addressPoints?: L.HeatLatLngTuple[]
  mapZoom: number
  mapCenter: L.LatLngExpression
}

const MapLayers: FunctionComponent<MapLayerProps> = ({
  addressPoints = [],
  mapZoom,
  mapCenter,
}) => {
  const map = useMap()

  useEffect(() => {
    L.heatLayer(addressPoints, {}).addTo(map)
  }, [addressPoints, map])

  useEffect(() => {
    map.setView(mapCenter, mapZoom)
  }, [mapCenter, mapZoom, map])

  return (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  )
}

interface Props {}

const Map: FunctionComponent<Props> = () => {
  const pictureConfigs = useRecoilValue(pictureConfigsState)
  const mapZoom = useRecoilValue(mapZoomState)
  const mapCenter = useRecoilValue(mapCenterState)

  const addressPoints = pictureConfigs.map(
    (pictureConfig) =>
      [
        pictureConfig.location.lat,
        pictureConfig.location.lng,
        100,
      ] as L.HeatLatLngTuple
  )

  return (
    <MapWrapper>
      <MapContainer center={mapCenter} zoom={mapZoom}>
        <MapLayers
          addressPoints={addressPoints}
          mapZoom={mapZoom}
          mapCenter={mapCenter}
        />
      </MapContainer>
    </MapWrapper>
  )
}

export default Map
