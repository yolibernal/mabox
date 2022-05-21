import { GalleryPicture } from "components/Gallery/styles"
import { Map } from "components/Map"
import React, { FunctionComponent } from "react"
import { useRecoilValue } from "recoil"
import { slideshowIndexState, slideshowPictureConfigsState } from "store"
import {
  SlideshowContainer,
  SlideshowGalleryContainer,
  SlideshowMapContainer,
} from "./styles"

export const Slideshow: FunctionComponent = () => {
  const slideshowPictureConfigs = useRecoilValue(slideshowPictureConfigsState)
  const slideshowIndex = useRecoilValue(slideshowIndexState)

  const currentPictureConfig = slideshowPictureConfigs[slideshowIndex]
  return (
    <SlideshowContainer>
      <SlideshowGalleryContainer>
        <GalleryPicture src={currentPictureConfig.path} />
      </SlideshowGalleryContainer>
      <SlideshowMapContainer>
        <Map
          showHeatmap={false}
          transitionLatLng={[
            currentPictureConfig.location.lat,
            currentPictureConfig.location.lng,
          ]}
        />
      </SlideshowMapContainer>
    </SlideshowContainer>
  )
}
