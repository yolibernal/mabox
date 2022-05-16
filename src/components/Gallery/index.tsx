import React, { FunctionComponent, useState } from "react"
import { useRecoilValue } from "recoil"
import {
  mapBoundingBoxState,
  selectedPicturesState,
  showGalleryState,
} from "store"

export const Gallery: FunctionComponent = () => {
  const showGallery = useRecoilValue(showGalleryState)
  const mapBoundingBox = useRecoilValue(mapBoundingBoxState)

  const selectedPictures = useRecoilValue(selectedPicturesState)

  const [currentIndex, setCurrentIndex] = useState(0)

  if (!mapBoundingBox) return null

  if (!showGallery) return null

  if (selectedPictures.length === 0) return null

  return (
    <div>
      <div>Gallery</div>
      <img
        style={{ width: "500px", height: "500px" }}
        alt=""
        src={selectedPictures[currentIndex].path}
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
            Math.min(selectedPictures.length - 1, currentIndex + 1)
          )
        }}
      >
        next
      </div>
    </div>
  )
}
