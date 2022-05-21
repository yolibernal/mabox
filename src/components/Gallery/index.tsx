import React, { FunctionComponent } from "react"
import { useRecoilValue } from "recoil"
import {
  currentGalleryIndexState,
  mapBoundingBoxState,
  selectedPicturesState,
} from "store"
import { GalleryContainer, GalleryPicture } from "./styles"

export const Gallery: FunctionComponent = () => {
  const mapBoundingBox = useRecoilValue(mapBoundingBoxState)

  const selectedPictures = useRecoilValue(selectedPicturesState)

  const currentGalleryIndex = useRecoilValue(currentGalleryIndexState)

  if (!mapBoundingBox) return null

  if (selectedPictures.length === 0) return null

  return (
    <GalleryContainer>
      <GalleryPicture alt="" src={selectedPictures[currentGalleryIndex].path} />
    </GalleryContainer>
  )
}
