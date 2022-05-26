import { TimelineBar, TimelineWrapper } from "components/Timeline/styles"
import styled from "styled-components"

export const ProgressBarWrapper = styled(TimelineWrapper)`
  padding: 20px 0;
`

export const ProgressBarLine = styled(TimelineBar)`
  display: flex;
  justify-content: start;
  align-items: center;
  color: white;
  padding-left: 30px;
  white-space: nowrap;
`
