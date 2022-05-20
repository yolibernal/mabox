import React, { FunctionComponent } from "react"
import { useSetRecoilState } from "recoil"
import { showGalleryState } from "store"

export const Controls: FunctionComponent = () => {
  const setShowGallery = useSetRecoilState(showGalleryState)
  return (
    <button
      onClick={() => {
        setShowGallery((showGallery) => !showGallery)
      }}
    >
      Show pictures
    </button>
  )
}
