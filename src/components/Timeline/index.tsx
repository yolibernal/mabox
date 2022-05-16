import React, { FunctionComponent } from "react"
import { useRecoilValue } from "recoil"
import { currentYearState, pictureTimeRangeState } from "store"
import { CurrentBar, TimelineWrapper } from "./styles"

interface Props {}

export const Timeline: FunctionComponent<Props> = () => {
  const pictureTimeRange = useRecoilValue(pictureTimeRangeState)
  const currentYear = useRecoilValue(currentYearState)

  let yearPercent = null
  if (currentYear) {
    const [minDate, maxDate] = pictureTimeRange

    const minPictureYear = minDate.getFullYear()
    const maxPictureYear = maxDate.getFullYear() + 1

    yearPercent =
      ((currentYear - minPictureYear) / (maxPictureYear - minPictureYear)) * 100
    yearPercent = Math.min(yearPercent, 100)
    yearPercent = Math.max(yearPercent, 0)
  }

  return (
    <TimelineWrapper>
      <CurrentBar widthPercent={yearPercent != null ? yearPercent : 100} />
    </TimelineWrapper>
  )
}
