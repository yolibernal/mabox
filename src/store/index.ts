import L from "leaflet"
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

export const currentDateState = atom({
  key: "currentDateState",
  default: null as Date | null,
})

export const pictureTimeRangeState = selector({
  key: "pictureTimeRangeState",
  get: ({ get }) => {
    const pictureConfigs = get(pictureConfigsState)
    const dates = pictureConfigs
      .map((config) => (config.date ? Date.parse(config.date) : null))
      .filter((date) => date) as number[]

    const minDate = Math.min(...dates)
    const maxDate = Math.max(...dates)

    return [new Date(minDate), new Date(maxDate)] as [Date, Date]
  },
})
