import { useRecoilState } from "recoil"
import { mapZoomState } from "store"

export const useWebsocket = () => {
  const ws = new WebSocket("ws://localhost:8000/ws")
  const [mapZoom, setMapZoom] = useRecoilState(mapZoomState)

  ws.onopen = () => {
    console.log("connected")
    ws.send("Hi!")
  }

  ws.onmessage = (event) => {
    console.log(event.data)
  }

  ws.onclose = () => {
    console.log("disconnected")
  }
}
