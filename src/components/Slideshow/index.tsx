import { GalleryPicture } from "components/Gallery/styles"
import { Map } from "components/Map"
import React, { FunctionComponent } from "react"
import {
  SlideshowContainer,
  SlideshowGalleryContainer,
  SlideshowMapContainer,
} from "./styles"

export const Slideshow: FunctionComponent = () => {
  return (
    <SlideshowContainer>
      <SlideshowGalleryContainer>
        <GalleryPicture src="/pictures/Berlin/IMG_20211201_142820.jpg" />
      </SlideshowGalleryContainer>
      <SlideshowMapContainer>
        <Map />
      </SlideshowMapContainer>
    </SlideshowContainer>
  )
}
