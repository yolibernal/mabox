import React, { FunctionComponent, useState } from "react"
import { useRecoilValue } from "recoil"
import { mapBoundingBoxState, selectedPicturesState } from "store"
import { GalleryContainer, GalleryPicture } from "./styles"

export const Gallery: FunctionComponent = () => {
  const mapBoundingBox = useRecoilValue(mapBoundingBoxState)

  const selectedPictures = useRecoilValue(selectedPicturesState)

  const [currentIndex, setCurrentIndex] = useState(0)

  if (!mapBoundingBox) return null

  if (selectedPictures.length === 0) return null

  return (
    <GalleryContainer>
      <div
        onClick={(e) => {
          e.stopPropagation()
          setCurrentIndex((currentIndex) => Math.max(0, currentIndex - 1))
        }}
      >
        prev
      </div>
      <GalleryPicture alt="" src={selectedPictures[currentIndex].path} />
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
    </GalleryContainer>
  )
}
