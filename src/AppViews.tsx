import { Controls } from "components/Controls"
import { Gallery } from "components/Gallery"
import { Map } from "components/Map"
import { Timeline } from "components/Timeline"
import { FunctionComponent } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { currentYearState, showGalleryState } from "store"
import { useKeyboardShortcuts } from "useKeyboardShortcuts"

export const AppViews: FunctionComponent = () => {
  const showGallery = useRecoilValue(showGalleryState)
  const [currentYear, setCurrentYear] = useRecoilState(currentYearState)
  useKeyboardShortcuts({
    j: (e) => {
      e.preventDefault()
      if (!currentYear) return
      setCurrentYear(currentYear - 1)
    },
    k: (e) => {
      e.preventDefault()
      if (!currentYear) return
      setCurrentYear(currentYear + 1)
    },
  })
  return (
    <>
      <Timeline />
      <Controls />

      {showGallery ? <Gallery /> : <Map />}
    </>
  )
}
