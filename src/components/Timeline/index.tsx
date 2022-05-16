import React, { FunctionComponent } from "react"
import { useRecoilValue } from "recoil"
import { fromYearState, pictureYearRangeState, toYearState } from "store"
import { CurrentBar, TimelineWrapper } from "./styles"

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

  const notSelectedColor = "lightgrey"
  const selectedColor = "green"
  return (
    <TimelineWrapper backgroundColor={notSelectedColor}>
      <CurrentBar
        backgroundColor={notSelectedColor}
        widthPercent={cleanPercentage(preBar)}
      />
      <CurrentBar
        backgroundColor={selectedColor}
        widthPercent={cleanPercentage(bar) || 1}
      />
    </TimelineWrapper>
  )
}
