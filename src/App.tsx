import Map from "components/Map"
import { Timeline } from "components/Timeline"
import GlobalStyle from "global-styles"
import React from "react"
import { RecoilRoot } from "recoil"
import { AppContainer } from "styles"

const App = () => {
  return (
    <RecoilRoot>
      <GlobalStyle />
      <AppContainer>
        <Timeline />
        <Map />
      </AppContainer>
    </RecoilRoot>
  )
}

export default App
