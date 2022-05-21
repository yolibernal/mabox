import { Gallery } from "components/Gallery"
import { Header } from "components/Header"
import { Map } from "components/Map"
import { Slideshow } from "components/Slideshow"
import { Mode } from "Mode"
import { FunctionComponent, useEffect, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import {
  fromYearState,
  JoyStickDirection,
  joyStickDirectionState,
  mapBoundingBoxSizeState,
  mapCenterState,
  mapZoomState,
  modeState,
  slideshowIndexState,
  toYearState
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
  const mapBoundingBoxSize = useRecoilValue(mapBoundingBoxSizeState)
  const [joyStickDirection, setJoyStickDirection] = useRecoilState(
    joyStickDirectionState
  )
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

  useEffect(() => {
    const handleReceivedMessage = (message: any) => {
      console.log(message)
      console.log(typeof message)
      console.log(message.message)
      if (message.message === "TOP") {

      setJoyStickDirection(JoyStickDirection.Up)
      }
      //if (message.type === "solved") {
      //  console.log("SOLVED by", message.user)
      //  setStopTimer(true)
      //}
      //if (message.type === "timeout") {
      //  console.log("TIMEOUTED by", message.user)
      //  setResetTimer(true)
      //}
      //if (message.type === "new_round" && message.user) {
      //  setCurrentUser(message.user)
      //  setCurrentWord(message.word || null)
      //  setResetTimer(true)
      //  setStopTimer(false)
      //}
      //if (message.type === "new_commit") {
      //  setLatestCommitId(message.message || null)
      //}
      //setMessages((messages) => [...messages, message])
    }

    if (!websocket) return

    websocket.onmessage = (e: any) => {
      console.log(e.data)
      const message = JSON.parse(e.data)
      handleReceivedMessage(message)
    }
  }, [websocket])

  useKeyboardShortcuts({
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
        setToYear(toYear - 1)
      } else if (mode === Mode.Slideshow) {
        setSlideshowIndex((slideshowIndex) => Math.max(0, slideshowIndex - 1))
      }
    },
    k: (e) => {
      e.preventDefault()
      if (mode === Mode.Map) {
        if (!toYear) return
        setToYear(toYear + 1)
      } else if (mode === Mode.Slideshow) {
        setSlideshowIndex((slideshowIndex) => slideshowIndex + 1)
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

  // return <StartScreen />
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
