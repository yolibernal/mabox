import React, { FunctionComponent } from "react"
import { useRecoilValue } from "recoil"
import {
  fromYearState,
  pictureYearRangeState,
  toYearState,
  zoomModeState,
} from "store"
import { cleanPercentage } from "utils"
import {
  CurrentBar,
  TimelineBackground,
  TimelineBar,
  TimelineHandleYear,
  TimelineWrapper,
} from "./styles"

export enum BarHandle {
  Left = "left",
  Right = "right",
}

interface Props {}

export const Timeline: FunctionComponent<Props> = () => {
  const pictureYearRange = useRecoilValue(pictureYearRangeState)
  const fromYear = useRecoilValue(fromYearState)
  const toYear = useRecoilValue(toYearState)
  const zoomMode = useRecoilValue(zoomModeState)

  const [minPictureYear, maxPictureYear] = pictureYearRange

  const range = maxPictureYear - minPictureYear

  const preBar = (fromYear - minPictureYear) / range
  const bar = (toYear - minPictureYear - (fromYear - minPictureYear)) / range

  const prebarPercent = cleanPercentage(preBar)
  const barPercent = cleanPercentage(bar) || 1

  const notSelectedColor = "rgb(42, 100, 98)"
  const selectedColor = "rgb(80, 176, 172)"
  return (
    <TimelineWrapper>
      <TimelineHandleYear widthPercent={prebarPercent}>
        {fromYear}
      </TimelineHandleYear>
      <TimelineBackground backgroundColor={notSelectedColor}>
        <TimelineBar
          backgroundColor={notSelectedColor}
          widthPercent={prebarPercent}
        />
        <CurrentBar
          backgroundColor={selectedColor}
          widthPercent={barPercent}
          selectedHandle={BarHandle.Left}
          zoomMode={zoomMode}
        />
      </TimelineBackground>
      <TimelineHandleYear widthPercent={prebarPercent + barPercent}>
        {toYear}
      </TimelineHandleYear>
    </TimelineWrapper>
  )
}
