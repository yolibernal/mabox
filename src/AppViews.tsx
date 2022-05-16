import { Gallery } from "components/Gallery"
import { Map } from "components/Map"
import { Timeline } from "components/Timeline"
import { FunctionComponent, useEffect, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import {
  fromYearState,
  JoyStickDirection,
  joyStickDirectionState,
  mapBoundingBoxSizeState,
  mapCenterState,
  showGalleryState,
  toYearState,
} from "store"
import { useKeyboardShortcuts } from "useKeyboardShortcuts"

export const AppViews: FunctionComponent = () => {
  const showGallery = useRecoilValue(showGalleryState)
  const [toYear, setToYear] = useRecoilState(toYearState)
  const [fromYear, setFromYear] = useRecoilState(fromYearState)
  const setMapCenter = useSetRecoilState(mapCenterState)
  const mapBoundingBoxSize = useRecoilValue(mapBoundingBoxSizeState)
  const [joyStickDirection, setJoyStickDirection] = useRecoilState(
    joyStickDirectionState
  )
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
    w: (e) => {
      e.preventDefault()
      setJoyStickDirection(JoyStickDirection.Up)
    },
    a: (e) => {
      e.preventDefault()
      setJoyStickDirection(JoyStickDirection.Left)
    },
    s: (e) => {
      e.preventDefault()
      setJoyStickDirection(JoyStickDirection.Down)
    },
    d: (e) => {
      e.preventDefault()
      setJoyStickDirection(JoyStickDirection.Right)
    },
    Space: (e) => {
      e.preventDefault()
      setJoyStickDirection(null)
    },
  })

  const [joystickInterval, setJoystickInterval] = useState<NodeJS.Timer | null>(
    null
  )

  useEffect(() => {
    if (joystickInterval) {
      clearInterval(joystickInterval)
    }
    const interval = setInterval(() => {
      if (!mapBoundingBoxSize) return
      if (!joyStickDirection) return

      let diff: L.LatLngTuple | null = null
      if (joyStickDirection === JoyStickDirection.Right) {
        const viewDistance = mapBoundingBoxSize[1]
        diff = [0, viewDistance * 0.1]
      }
      if (joyStickDirection === JoyStickDirection.Left) {
        const viewDistance = mapBoundingBoxSize[1]
        diff = [0, -viewDistance * 0.1]
      }
      if (joyStickDirection === JoyStickDirection.Up) {
        const viewDistance = mapBoundingBoxSize[0]
        diff = [viewDistance * 0.1, 0]
      }
      if (joyStickDirection === JoyStickDirection.Down) {
        const viewDistance = mapBoundingBoxSize[0]
        diff = [-viewDistance * 0.1, 0]
      }
      setMapCenter((mapCenter) => {
        if (!diff) return mapCenter
        const newMapCenter = [...mapCenter] as L.LatLngTuple
        newMapCenter[0] = mapCenter[0] + diff[0]
        newMapCenter[1] = mapCenter[1] + diff[1]
        return newMapCenter
      })
    }, 250)
    setJoystickInterval(interval)
    return () => {
      clearInterval(interval)
    }
  }, [joyStickDirection, setMapCenter, mapBoundingBoxSize])
  return (
    <>
      <Timeline />

      {showGallery ? <Gallery /> : <Map />}
    </>
  )
}
