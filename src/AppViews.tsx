import { Controls } from "components/Controls"
import { Gallery } from "components/Gallery"
import { Map } from "components/Map"
import { Timeline } from "components/Timeline"
import { FunctionComponent } from "react"
import { useRecoilValue } from "recoil"
import { showGalleryState } from "store"

export const AppViews: FunctionComponent = () => {
  const showGallery = useRecoilValue(showGalleryState)
  return (
    <>
      <Timeline />
      <Controls />

      {showGallery ? <Gallery /> : <Map />}
    </>
  )
}
