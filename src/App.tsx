import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import Map from "components/Map"
import { Timeline } from "components/Timeline"
import GlobalStyle from "global-styles"
import React from "react"
import { RecoilRoot } from "recoil"
import { AppContainer } from "styles"

const App = () => {
  return (
    <RecoilRoot>
      <MantineProvider>
        <ModalsProvider>
          <GlobalStyle />
          <AppContainer>
            <Timeline />
            <Map />
          </AppContainer>
        </ModalsProvider>
      </MantineProvider>
    </RecoilRoot>
  )
}

export default App
