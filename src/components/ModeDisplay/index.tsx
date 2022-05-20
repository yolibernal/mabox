import { FunctionComponent } from "react"
import { ModeContainer, ModeDisplayContainer } from "./styles"

export enum Mode {
  Map = "map",
  Gallery = "gallery",
  Slideshow = "slideshow",
}

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
