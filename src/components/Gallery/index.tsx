import React, { FunctionComponent, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { currentGalleryIndexState, mapBoundingBoxState, selectedPicturesState } from "store"
import { GalleryContainer, GalleryPicture } from "./styles"

export const Gallery: FunctionComponent = () => {
  const mapBoundingBox = useRecoilValue(mapBoundingBoxState)

  const selectedPictures = useRecoilValue(selectedPicturesState)

  const [currentGalleryIndex, setCurrentGalleryIndex] = useRecoilState(currentGalleryIndexState)

  if (!mapBoundingBox) return null

  if (selectedPictures.length === 0) return null

  return (
    <GalleryContainer>
      <div
        onClick={(e) => {
          e.stopPropagation()
          setCurrentGalleryIndex((currentIndex) => Math.max(0, currentIndex - 1))
        }}
      >
        prev
      </div>
      <GalleryPicture alt="" src={selectedPictures[currentGalleryIndex].path} />
      <div
        onClick={(e) => {
          e.stopPropagation()
          setCurrentGalleryIndex((currentIndex) =>
            Math.min(selectedPictures.length - 1, currentIndex + 1)
          )
        }}
      >
        next
      </div>
    </GalleryContainer>
  )
}
