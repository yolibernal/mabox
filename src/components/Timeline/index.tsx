import React, { FunctionComponent } from "react"
import { useRecoilValue } from "recoil"
import { fromYearState, pictureYearRangeState, toYearState } from "store"
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

  const [minPictureYear, maxPictureYear] = pictureYearRange

  const range = maxPictureYear - minPictureYear

  const preBar = (fromYear - minPictureYear) / range
  const bar = (toYear - minPictureYear - (fromYear - minPictureYear)) / range

  const cleanPercentage = (value: number) => {
    let percentage = value * 100
    percentage = Math.min(percentage, 100)
    percentage = Math.max(percentage, 0)
    return percentage
  }

  const notSelectedColor = "rgb(42, 100, 98)"
  const selectedColor = "rgb(80, 176, 172)"

  const prebarPercent = cleanPercentage(preBar)
  const barPercent = cleanPercentage(bar) || 1
  return (
    <TimelineWrapper>
      <TimelineHandleYear widthPercent={prebarPercent}>1960</TimelineHandleYear>
      <TimelineBackground backgroundColor={notSelectedColor}>
        <TimelineBar
          backgroundColor={notSelectedColor}
          widthPercent={prebarPercent}
        />
        <CurrentBar
          backgroundColor={selectedColor}
          widthPercent={barPercent}
          selectedHandle={BarHandle.Left}
        />
      </TimelineBackground>
      <TimelineHandleYear widthPercent={prebarPercent + barPercent}>
        1960
      </TimelineHandleYear>
    </TimelineWrapper>
  )
}
