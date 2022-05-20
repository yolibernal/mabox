import { accessToken, styleId, tilesize, username } from "config/mapbox.config"
import L from "leaflet"
import "leaflet.heat"
import { FunctionComponent, useEffect } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import { useRecoilValue, useSetRecoilState } from "recoil"
import {
  mapBoundingBoxState,
  mapCenterState,
  mapZoomState,
  pictureConfigsState,
} from "store"
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
  const setMapCenter = useSetRecoilState(mapCenterState)
  const setMapZoom = useSetRecoilState(mapZoomState)
  const setMapBoundingBox = useSetRecoilState(mapBoundingBoxState)

  useEffect(() => {
    const layer = L.heatLayer(addressPoints, {}).addTo(map)
    return () => {
      map.removeLayer(layer)
    }
  }, [addressPoints, map])

  useEffect(() => {
    map.setView(mapCenter, mapZoom)
  }, [mapCenter, mapZoom, map])

  useEffect(() => {
    const interval = setInterval(() => {
      setMapCenter(map.getCenter())
      setMapZoom(map.getZoom())
      setMapBoundingBox(map.getBounds())
    }, 0.1)
    return () => clearInterval(interval)
  }, [map, setMapCenter, setMapZoom, setMapBoundingBox])

  useEffect(() => {
    setMapBoundingBox(map.getBounds())
  }, [map, setMapBoundingBox, mapZoom, mapCenter])

  const url = `https://api.mapbox.com/styles/v1/${username}/${styleId}/tiles/${tilesize}/{z}/{x}/{y}@2x?access_token=${accessToken}`
  return (
    <TileLayer
      // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
      //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      url={url}
      zIndex={0}
    />
  )
}

interface Props {}

export const Map: FunctionComponent<Props> = () => {
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
