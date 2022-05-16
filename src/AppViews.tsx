import { Gallery } from "components/Gallery"
import { Map } from "components/Map"
import { Timeline } from "components/Timeline"
import { FunctionComponent } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { fromYearState, showGalleryState, toYearState } from "store"
import { useKeyboardShortcuts } from "useKeyboardShortcuts"

export const AppViews: FunctionComponent = () => {
  const showGallery = useRecoilValue(showGalleryState)
  const [toYear, setToYear] = useRecoilState(toYearState)
  const [fromYear, setFromYear] = useRecoilState(fromYearState)
  const setShowGallery = useSetRecoilState(showGalleryState)

  useKeyboardShortcuts({
    g: (e) => {
      e.preventDefault()
      setShowGallery((showGallery) => !showGallery)
    },
    j: (e) => {
      e.preventDefault()
      if (!toYear) return
      setToYear(toYear - 1)
    },
    k: (e) => {
      e.preventDefault()
      if (!toYear) return
      setToYear(toYear + 1)
    },
    h: (e) => {
      e.preventDefault()
      if (!fromYear) return
      setFromYear(fromYear - 1)
    },
    l: (e) => {
      e.preventDefault()
      if (!fromYear) return
      setFromYear(fromYear + 1)
    },
    b: (e) => {
      e.preventDefault()
      if (!fromYear) return
      setToYear(toYear - 1)
      setFromYear(toYear - 1)
    },
    n: (e) => {
      e.preventDefault()
      if (!fromYear) return
      setToYear(toYear + 1)
      setFromYear(toYear + 1)
    },
  })
  return (
    <>
      <Timeline />

      {showGallery ? <Gallery /> : <Map />}
    </>
  )
}
