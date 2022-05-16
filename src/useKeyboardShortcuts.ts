import { useEffect } from "react"
import tinykeys, { KeyBindingMap } from "tinykeys"

export const useKeyboardShortcuts = (keyBindingMap: KeyBindingMap) => {
  useEffect(() => {
    let unsubscribe = tinykeys(window, keyBindingMap)
    return () => {
      unsubscribe()
    }
  })
}
