import { Gallery } from "components/Gallery"
import { Map } from "components/Map"
import { Timeline } from "components/Timeline"
import { FunctionComponent } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { currentYearState, showGalleryState } from "store"
import { useKeyboardShortcuts } from "useKeyboardShortcuts"

export const AppViews: FunctionComponent = () => {
  const showGallery = useRecoilValue(showGalleryState)
  const [currentYear, setCurrentYear] = useRecoilState(currentYearState)
  const setShowGallery = useSetRecoilState(showGalleryState)

  useKeyboardShortcuts({
    g: (e) => {
      e.preventDefault()
      setShowGallery((showGallery) => !showGallery)
    },
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

      {showGallery ? <Gallery /> : <Map />}
    </>
  )
}
