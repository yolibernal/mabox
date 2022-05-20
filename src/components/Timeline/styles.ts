import styled from "styled-components"
import { BarHandle } from "."

export const TimelineWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

interface TimelineBackgroundProps {
  backgroundColor?: string
}
export const TimelineBackground = styled.div<TimelineBackgroundProps>`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  background-color: ${({ backgroundColor }) => backgroundColor || "lightgrey"};
  border-left: 1px solid black;
  border-right: 1px solid black;
`

interface TimelineBarProps {
  widthPercent: number
  backgroundColor?: string
}

export const TimelineBar = styled.div<TimelineBarProps>`
  background-color: ${({ backgroundColor }) => backgroundColor || "green"};
  height: 100%;
  width ${({ widthPercent }) => widthPercent}%;
`
interface CurrentBarProps {
  selectedHandle?: BarHandle
}
export const CurrentBar = styled(TimelineBar)<CurrentBarProps>`
  border-left: ${({ selectedHandle }) =>
    selectedHandle === BarHandle.Left
      ? "4px solid rgb(237,116,54)"
      : "2px solid black"};
  border-right: ${({ selectedHandle }) =>
    selectedHandle === BarHandle.Right
      ? "4px solid rgb(237,116,54)"
      : "2px solid black"};
`

export const TimelineHandleYear = styled.div<{
  widthPercent: number
}>`
  padding-left: ${({ widthPercent }) => widthPercent}%;
  font-size: 14px;
`
