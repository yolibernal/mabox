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
  selectedHandleState,
  selectedPicturesState,
  slideshowIndexState,
  slideshowPictureConfigsState,
  toYearState,
  zoomModeState,
} from "store"
import { AppContainer, ContentContainer } from "styles"
import { useKeyboardShortcuts } from "useKeyboardShortcuts"
import { v4 as uuidv4 } from "uuid"

export const AppViews: FunctionComponent = () => {
  const [toYear, setToYear] = useRecoilState(toYearState)
  const [fromYear, setFromYear] = useRecoilState(fromYearState)
  const setMapZoom = useSetRecoilState(mapZoomState)
  const setMapCenter = useSetRecoilState(mapCenterState)
  const setSlideshowIndex = useSetRecoilState(slideshowIndexState)
  const setCurrentGalleryIndex = useSetRecoilState(currentGalleryIndexState)
  const mapBoundingBoxSize = useRecoilValue(mapBoundingBoxSizeState)
  const [appStarted, setAppStarted] = useRecoilState(appStartedState)
  const [zoomMode, setZoomMode] = useRecoilState(zoomModeState)
  const [selectedHandle, setSelectedHandle] =
    useRecoilState(selectedHandleState)
  const [joyStickDirection, setJoyStickDirection] = useRecoilState(
    joyStickDirectionState
  )
  const slideshowPictureConfigs = useRecoilValue(slideshowPictureConfigsState)
  const selectedPictures = useRecoilValue(selectedPicturesState)
  const [mode, setMode] = useRecoilState(modeState)
  const [websocket, setWebsocket] = useState<WebSocket>()

  useEffect(() => {
    const myClientId = uuidv4()
    //  (`ws://192.168.178.85:8000/ws/${client_id}`);
    const url = `ws://192.168.178.85:8000/ws/${myClientId}`
    const ws = new WebSocket(url)

    ws.onopen = () => {
      const connectMessage = {
        clientId: myClientId,
        type: "connected",
      }
      ws.send(JSON.stringify(connectMessage))
    }

    setWebsocket(ws)

    return () => ws.close()
  }, [])

  enum Device {
    Joystick = "JOYSTICK",
    RotaryEncoder = "ROTARY_ENCODER",
    Button1 = "BUTTON 1",
    Button2 = "BUTTON 2",
  }

  enum JoystickMessage {
    Center = "CENTER",
    Right = "RIGHT",
    Top = "TOP",
    Left = "LEFT",
    Bottom = "BOTTOM",
    Pressed = "PRESSED",
  }

  enum RotaryEncoderMessage {
    Clockwise = "CLOCKWISE",
    Anticlockwise = "ANTICLOCKWISE",
    Pressed = "PRESSED",
  }

  enum ButtonMessage {
    Active = "ACTIVE",
    Inactive = "INACTIVE",
  }

  useEffect(() => {
    const handleReceivedMessage = (message: {
      device: Device
      message: JoystickMessage | RotaryEncoderMessage | ButtonMessage
    }) => {
      if (message.device === Device.Joystick) {
        if (message.message === JoystickMessage.Pressed) {
          if (!appStarted) setAppStarted(true)
        }

        if (mode !== Mode.Map) return

        if (message.message === JoystickMessage.Top) {
          setJoyStickDirection(JoyStickDirection.Up)
        }
        if (message.message === JoystickMessage.Left) {
          setJoyStickDirection(JoyStickDirection.Left)
        }
        if (message.message === JoystickMessage.Right) {
          setJoyStickDirection(JoyStickDirection.Right)
        }
        if (message.message === JoystickMessage.Bottom) {
          setJoyStickDirection(JoyStickDirection.Down)
        }
        if (message.message === JoystickMessage.Center) {
          setJoyStickDirection(null)
        }
        if (message.message === JoystickMessage.Pressed) {
          if (selectedHandle === "LEFT") {
            setSelectedHandle("RIGHT")
          } else if (selectedHandle === "RIGHT") {
            setSelectedHandle("LEFT")
          }
        }
      }

      if (message.device === Device.RotaryEncoder) {
        if (message.message === RotaryEncoderMessage.Pressed) {
          setZoomMode((zoomMode) => !zoomMode)
        }

        if (zoomMode) {
          if (message.message === RotaryEncoderMessage.Anticlockwise) {
            setMapZoom((mapZoom) => mapZoom - 1)
          }
          if (message.message === RotaryEncoderMessage.Clockwise) {
            setMapZoom((mapZoom) => mapZoom + 1)
          }
        }

        if (!zoomMode) {
          if (message.message === RotaryEncoderMessage.Anticlockwise) {
            if (mode === Mode.Map) {
              if (selectedHandle === "RIGHT") {
                if (!toYear) return
                const newToYear = toYear - 1
                if (newToYear < fromYear) return
                setToYear(newToYear)
              }
              if (selectedHandle === "LEFT") {
                if (!fromYear) return
                setFromYear(fromYear - 1)
                if (!fromYear) return
              }
            } else if (mode === Mode.Slideshow) {
              setSlideshowIndex((slideshowIndex) =>
                Math.max(0, slideshowIndex - 1)
              )
            } else if (mode === Mode.Gallery) {
              setCurrentGalleryIndex((currentIndex) =>
                Math.max(0, currentIndex - 1)
              )
            }
          }
          if (message.message === RotaryEncoderMessage.Clockwise) {
            if (mode === Mode.Map) {
              if (selectedHandle === "RIGHT") {
                if (!toYear) return
                setToYear(toYear + 1)
              }
              if (selectedHandle === "LEFT") {
                const newFromYear = fromYear + 1
                if (newFromYear > toYear) return
                setFromYear(newFromYear)
              }
            } else if (mode === Mode.Slideshow) {
              setSlideshowIndex((slideshowIndex) =>
                Math.min(slideshowIndex + 1, slideshowPictureConfigs.length - 1)
              )
            } else if (mode === Mode.Gallery) {
              setCurrentGalleryIndex((currentIndex) =>
                Math.min(selectedPictures.length - 1, currentIndex + 1)
              )
            }
          }
        }
      }

      if (message.device === Device.Button1) {
        if (message.message === ButtonMessage.Active) {
          setMode(Mode.Slideshow)
        }
        if (message.message === ButtonMessage.Inactive) {
          setMode(Mode.Map)
        }
      }

      if (message.device === Device.Button2) {
        if (message.message === ButtonMessage.Active) {
          setMode(Mode.Gallery)
        }
        if (message.message === ButtonMessage.Inactive) {
          setMode(Mode.Map)
        }
      }
    }

    if (!websocket) return

    websocket.onmessage = (e: any) => {
      console.log(e.data)
      const message = JSON.parse(e.data)
      handleReceivedMessage(message)
    }
  }, [websocket])

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
