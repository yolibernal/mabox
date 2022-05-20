import styled from "styled-components"

interface TimelineWrapperProps {
  backgroundColor?: string
}

export const TimelineWrapper = styled.div<TimelineWrapperProps>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  background-color: ${({ backgroundColor }) => backgroundColor || "lightgrey"};
`

interface CurrentBarProps {
  widthPercent: number
  backgroundColor?: string
}

export const CurrentBar = styled.div<CurrentBarProps>`
  background-color: ${({ backgroundColor }) => backgroundColor || "green"};
  height: 100%;
  width ${({ widthPercent }) => widthPercent}%;
`
