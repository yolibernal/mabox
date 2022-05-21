import { Gallery } from "components/Gallery"
import { Header } from "components/Header"
import { Map } from "components/Map"
import { Slideshow } from "components/Slideshow"
import { StartScreen } from "components/StartScreen"
import { Mode } from "Mode"
import { FunctionComponent, useEffect, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import {
  appStartedState,
  currentGalleryIndexState,
  fromYearState,
  JoyStickDirection,
  joyStickDirectionState,
  mapBoundingBoxSizeState,
  mapCenterState,
  mapZoomState,
  modeState,
  selectedPicturesState,
  slideshowIndexState,
  slideshowPictureConfigsState,
  toYearState,
} from "store"
import { AppContainer, ContentContainer } from "styles"
import { useKeyboardShortcuts } from "useKeyboardShortcuts"

export const AppViews: FunctionComponent = () => {
  const [toYear, setToYear] = useRecoilState(toYearState)
  const [fromYear, setFromYear] = useRecoilState(fromYearState)
  const setMapZoom = useSetRecoilState(mapZoomState)
  const setMapCenter = useSetRecoilState(mapCenterState)
  const setSlideshowIndex = useSetRecoilState(slideshowIndexState)
  const setCurrentGalleryIndex = useSetRecoilState(currentGalleryIndexState)
  const mapBoundingBoxSize = useRecoilValue(mapBoundingBoxSizeState)
  const [appStarted, setAppStarted] = useRecoilState(appStartedState)
  const [joyStickDirection, setJoyStickDirection] = useRecoilState(
    joyStickDirectionState
  )
  const slideshowPictureConfigs = useRecoilValue(slideshowPictureConfigsState)
  const selectedPictures = useRecoilValue(selectedPicturesState)
  const [mode, setMode] = useRecoilState(modeState)

  useKeyboardShortcuts({
    z: (e) => {
      e.preventDefault()
      setAppStarted(true)
    },
    f: (e) => {
      e.preventDefault()
      if (mode === Mode.Slideshow) {
        setMode(Mode.Map)
      } else {
        setMode(Mode.Slideshow)
      }
    },
    g: (e) => {
      e.preventDefault()
      if (mode === Mode.Gallery) {
        setMode(Mode.Map)
      } else {
        setMode(Mode.Gallery)
      }
    },
    j: (e) => {
      e.preventDefault()
      if (mode === Mode.Map) {
        if (!toYear) return
        const newToYear = toYear - 1
        if (newToYear < fromYear) return
        setToYear(newToYear)
      } else if (mode === Mode.Slideshow) {
        setSlideshowIndex((slideshowIndex) => Math.max(0, slideshowIndex - 1))
      } else if (mode === Mode.Gallery) {
        setCurrentGalleryIndex((currentIndex) => Math.max(0, currentIndex - 1))
      }
    },
    k: (e) => {
      e.preventDefault()
      if (mode === Mode.Map) {
        if (!toYear) return
        setToYear(toYear + 1)
      } else if (mode === Mode.Slideshow) {
        setSlideshowIndex((slideshowIndex) =>
          Math.min(slideshowIndex + 1, slideshowPictureConfigs.length - 1)
        )
      } else if (mode === Mode.Gallery) {
        setCurrentGalleryIndex((currentIndex) =>
          Math.min(selectedPictures.length - 1, currentIndex + 1)
        )
      }
    },
    h: (e) => {
      e.preventDefault()
      if (!fromYear) return
      setFromYear(fromYear - 1)
    },
    l: (e) => {
      e.preventDefault()
      if (!fromYear) return
      const newFromYear = fromYear + 1
      if (newFromYear > toYear) return
      setFromYear(newFromYear)
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
    q: (e) => {
      e.preventDefault()
      setMapZoom((mapZoom) => mapZoom - 1)
    },
    e: (e) => {
      e.preventDefault()
      setMapZoom((mapZoom) => mapZoom + 1)
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

  if (!appStarted) {
    return <StartScreen />
  }
  return (
    <AppContainer>
      <Header />
      <ContentContainer>
        {mode === Mode.Gallery ? (
          <Gallery />
        ) : mode === Mode.Slideshow ? (
          <Slideshow />
        ) : (
          <Map />
        )}
      </ContentContainer>
    </AppContainer>
  )
}
