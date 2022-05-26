import { Mode } from "Mode"
import { FunctionComponent } from "react"
import { ModeContainer, ModeDisplayContainer } from "./styles"

interface Props {
  mode: Mode
}

export const ModeDisplay: FunctionComponent<Props> = ({ mode }) => {
  return (
    <ModeDisplayContainer>
      <ModeContainer mode={mode}>{mode}</ModeContainer>
    </ModeDisplayContainer>
  )
}
