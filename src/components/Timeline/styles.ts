import styled from "styled-components"

export const TimelineWrapper = styled.div`
  width: 100%;
  height: 3%;
  float: left;
  background-color: lightgrey;
`

interface CurrentBarProps {
  widthPercent: number
}

export const CurrentBar = styled.div<CurrentBarProps>`
  background-color: green;
  height: 100%;
  width ${({ widthPercent }) => widthPercent}%;
`
