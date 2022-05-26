import { TimelineBackground } from "components/Timeline/styles"
import { Mode } from "Mode"
import React, { FunctionComponent } from "react"
import { useRecoilValue } from "recoil"
import {
  currentGalleryIndexState,
  modeState,
  selectedPicturesState,
  slideshowIndexState,
  slideshowPictureConfigsState,
} from "store"
import { cleanPercentage } from "utils"
import { ProgressBarLine, ProgressBarWrapper } from "./styles"

export const ProgressBar: FunctionComponent = () => {
  const notSelectedColor = "rgb(42, 100, 98)"
  const selectedColor = "rgb(80, 176, 172)"

  const mode = useRecoilValue(modeState)

  const selectedPictures = useRecoilValue(selectedPicturesState)
  const currentGalleryIndex = useRecoilValue(currentGalleryIndexState)

  const slideshowPictureConfigs = useRecoilValue(slideshowPictureConfigsState)
  const slideshowIndex = useRecoilValue(slideshowIndexState)

  const totalNumberOfPictures =
    mode === Mode.Gallery
      ? selectedPictures.length
      : slideshowPictureConfigs.length

  const currentIndex =
    mode === Mode.Gallery ? currentGalleryIndex : slideshowIndex

  const widthPercent =
    totalNumberOfPictures === 0
      ? 0
      : cleanPercentage((currentIndex + 1) / totalNumberOfPictures)

  return (
    <ProgressBarWrapper>
      <TimelineBackground backgroundColor={notSelectedColor}>
        <ProgressBarLine
          backgroundColor={selectedColor}
          widthPercent={widthPercent}
        >
          {currentIndex + 1} / {totalNumberOfPictures}
        </ProgressBarLine>
      </TimelineBackground>
    </ProgressBarWrapper>
  )
}
