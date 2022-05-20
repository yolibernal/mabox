import { Mode } from "Mode"
import styled from "styled-components"

export const ModeDisplayContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const ModeContainer = styled.span<{ mode: Mode }>`
  text-transform: uppercase;
  font-weight: 700;
  font-size: 35px;
  margin-left: 10px;
  color: ${({ mode }) => {
    switch (mode) {
      case Mode.Map:
        return "rgb(42, 100, 98)"
      case Mode.Gallery:
        return "rgb(237,116,54)"
      case Mode.Slideshow:
        return "rgb(80, 176, 172)"
      default:
        return "#000"
    }
  }};
`
