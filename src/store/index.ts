import { BarHandle } from "components/Timeline"
import L, { LatLngBounds } from "leaflet"
import { Mode } from "Mode"
import pictureConfigsFile from "picture-configs.json"
import { atom, selector } from "recoil"
import slideshowConfigsFile from "slideshow-configs.json"

export const zoomModeState = atom({
  key: "zoomModeState",
  default: false,
})

export const selectedHandleState = atom<BarHandle>({
  key: "selectedHandleState",
  default: BarHandle.Right,
})

export const appStartedState = atom({
  key: "appStartedState",
  default: false,
})

export const slideshowIndexState = atom({
  key: "slideshowIndexState",
  default: 0,
})

export const modeState = atom({
  key: "modeState",
  default: Mode.Map,
})

export const currentGalleryIndexState = atom({
  key: "currentGalleryIndexState",
  default: 0,
})

export const pictureConfigsState = atom({
  key: "pictureConfigsState",
  default: pictureConfigsFile,
})

// TODO: Add slidewshow configs
export const slideshowPictureConfigsState = atom({
  key: "slideshowPictureConfigsState",
  default: slideshowConfigsFile,
})

export const mapZoomState = atom({
  key: "mapZoomState",
  default: 13,
})

export const mapCenterState = atom({
  key: "mapCenterState",
  default: [49.0069, 8.4037] as L.LatLngTuple,
})

export const mapBoundingBoxState = atom<LatLngBounds | null>({
  key: "mapBoundingBoxState",
  default: null,
})

export const mapBoundingBoxSizeState = selector({
  key: "mapBoundingBoxSizeState",
  get: ({ get }) => {
    const mapBoundingBox = get(mapBoundingBoxState)
    if (!mapBoundingBox) {
      return null
    }
    return [
      mapBoundingBox.getNorth() - mapBoundingBox.getSouth(),
      mapBoundingBox.getEast() - mapBoundingBox.getWest(),
    ] as [number, number]
  },
})

export enum JoyStickDirection {
  Left = "left",
  Right = "right",
  Up = "up",
  Down = "down",
}

export const joyStickDirectionState = atom<JoyStickDirection | null>({
  key: "joyStickDirectionState",
  default: null,
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

export const getMinPictureYearState = selector({
  key: "getMinPictureYear",
  get: ({ get }) => {
    const pictureYearRange = get(pictureYearRangeState)
    return pictureYearRange[0]
  },
})

export const getMaxPictureYearState = selector({
  key: "getMaxPictureYear",
  get: ({ get }) => {
    const pictureYearRange = get(pictureYearRangeState)
    return pictureYearRange[1]
  },
})

export const fromYearState = atom({
  key: "fromYearState",
  default: getMinPictureYearState,
})

export const toYearState = atom({
  key: "toYearState",
  default: getMaxPictureYearState,
})

export const selectedPicturesState = selector({
  key: "selectedPicturesState",
  get: ({ get }) => {
    const mapBoundingBox = get(mapBoundingBoxState)
    const fromYear = get(fromYearState)
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
    if (fromYear) {
      pictureConfigs = pictureConfigs.filter((pictureConf) =>
        pictureConf.date
          ? new Date(pictureConf.date).getFullYear() >= fromYear
          : false
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
