import React, { FunctionComponent } from "react"
import { useRecoilValue } from "recoil"
import { pictureYearRangeState, toYearState } from "store"
import { CurrentBar, TimelineWrapper } from "./styles"

interface Props {}

export const Timeline: FunctionComponent<Props> = () => {
  const pictureYearRange = useRecoilValue(pictureYearRangeState)
  const toYear = useRecoilValue(toYearState)

  let yearPercent = null
  if (toYear) {
    const [minPictureYear, maxPictureYear] = pictureYearRange

    yearPercent =
      ((toYear - minPictureYear) / (maxPictureYear + 1 - minPictureYear)) * 100
    yearPercent = Math.min(yearPercent, 100)
    yearPercent = Math.max(yearPercent, 0)
  }

  return (
    <TimelineWrapper>
      <CurrentBar widthPercent={yearPercent != null ? yearPercent : 100} />
    </TimelineWrapper>
  )
}
