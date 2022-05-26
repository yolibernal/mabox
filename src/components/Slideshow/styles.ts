import styled from "styled-components"

export const SlideshowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  height: 100%;

  & > * {
    margin: 10px;
  }
`
export const SlideshowGalleryContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  width: 60%;
  min-height: 0;
`
export const SlideshowMapContainer = styled.div`
  display: flex;
  flex-grow: 5;
  justify-content: center;
`
