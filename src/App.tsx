import React from "react"
import Map from "./components/Map"
import GlobalStyle from "./global-styles"
import { AppContainer } from "./styles"

const App = () => {
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Map addressPoints={[[51.505, -0.09, 1000]]} />
      </AppContainer>
    </>
  )
}

export default App
