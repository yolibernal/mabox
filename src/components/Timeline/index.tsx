import React, { FunctionComponent } from "react"
import { useRecoilValue } from "recoil"
import { currentDateState, pictureTimeRangeState } from "store"
import { CurrentBar, TimelineWrapper } from "./styles"

interface Props {}

export const Timeline: FunctionComponent<Props> = () => {
  const pictureTimeRange = useRecoilValue(pictureTimeRangeState)
  const currentDate = useRecoilValue(currentDateState)
  const currentYear = currentDate?.getFullYear()

  let yearPercent = null
  if (currentYear) {
    const [minDate, maxDate] = pictureTimeRange

    const minYear = minDate.getFullYear()
    const maxYear = maxDate.getFullYear() + 1

    yearPercent = ((currentYear - minYear) / (maxYear - minYear)) * 100
    yearPercent = Math.min(yearPercent, 100)
    yearPercent = Math.max(yearPercent, 0)
  }

  return (
    <TimelineWrapper>
      <CurrentBar widthPercent={yearPercent != null ? yearPercent : 100} />
    </TimelineWrapper>
  )
}
