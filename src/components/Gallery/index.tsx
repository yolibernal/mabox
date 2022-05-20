import React, { FunctionComponent, useState } from "react"
import { useRecoilValue } from "recoil"
import {
  mapBoundingBoxState,
  pictureConfigsState,
  showGalleryState,
} from "store"

export const Gallery: FunctionComponent = () => {
  const showGallery = useRecoilValue(showGalleryState)
  const mapBoundingBox = useRecoilValue(mapBoundingBoxState)

  const pictureConfigs = useRecoilValue(pictureConfigsState)

  const [currentIndex, setCurrentIndex] = useState(0)

  if (!mapBoundingBox) return null

  const pictureConfigsInBound = pictureConfigs.filter(
    (pictureConf) =>
      pictureConf.location.lat > mapBoundingBox.getSouth() &&
      pictureConf.location.lat < mapBoundingBox.getNorth() &&
      pictureConf.location.lng > mapBoundingBox.getWest() &&
      pictureConf.location.lng < mapBoundingBox.getEast()
  )
  if (!showGallery) return null

  return (
    <div>
      <div>Gallery</div>
      <img
        style={{ width: "500px", height: "500px" }}
        alt=""
        src={pictureConfigsInBound[currentIndex].path}
      />
      <div
        onClick={(e) => {
          e.stopPropagation()
          setCurrentIndex((currentIndex) => Math.max(0, currentIndex - 1))
        }}
      >
        prev
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation()
          setCurrentIndex((currentIndex) =>
            Math.min(pictureConfigsInBound.length - 1, currentIndex + 1)
          )
        }}
      >
        next
      </div>
    </div>
  )
}
