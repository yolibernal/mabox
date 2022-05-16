import L, { LatLngBounds } from "leaflet"
import pictureConfigsFile from "picture-configs.json"
import { atom, selector } from "recoil"

export const pictureConfigsState = atom({
  key: "pictureConfigsState",
  default: pictureConfigsFile,
})

export const mapZoomState = atom({
  key: "mapZoomState",
  default: 13,
})

export const mapCenterState = atom({
  key: "mapCenterState",
  default: [49.0069, 8.4037] as L.LatLngExpression,
})

export const mapBoundingBoxState = atom<LatLngBounds | null>({
  key: "mapBoundingBoxState",
  default: null,
})

export const toYearState = atom({
  key: "toYearState",
  default: new Date().getFullYear(),
})

export const pictureYearRangeState = selector({
  key: "pictureYearRangeState",
  get: ({ get }) => {
    const pictureConfigs = get(pictureConfigsState)
    const dates = pictureConfigs
      .map((config) => (config.date ? Date.parse(config.date) : null))
      .filter((date) => date) as number[]

    const minPictureDate = Math.min(...dates)
    const maxPictureDate = Math.max(...dates)

    return [
      new Date(minPictureDate).getFullYear(),
      new Date(maxPictureDate).getFullYear(),
    ]
  },
})

export const selectedPicturesState = selector({
  key: "selectedPicturesState",
  get: ({ get }) => {
    const mapBoundingBox = get(mapBoundingBoxState)
    const toYear = get(toYearState)

    let pictureConfigs = get(pictureConfigsState)

    if (mapBoundingBox) {
      pictureConfigs = pictureConfigs.filter(
        (pictureConf) =>
          pictureConf.location.lat > mapBoundingBox.getSouth() &&
          pictureConf.location.lat < mapBoundingBox.getNorth() &&
          pictureConf.location.lng > mapBoundingBox.getWest() &&
          pictureConf.location.lng < mapBoundingBox.getEast()
      )
    }
    if (toYear) {
      pictureConfigs = pictureConfigs.filter((pictureConf) =>
        pictureConf.date
          ? new Date(pictureConf.date).getFullYear() <= toYear
          : false
      )
    }
    return pictureConfigs
  },
})

export const showGalleryState = atom({
  key: "showGalleryState",
  default: false,
})
