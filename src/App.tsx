import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { AppViews } from "AppViews"
import GlobalStyle from "global-styles"
import React from "react"
import { RecoilRoot } from "recoil"

const App = () => {
  return (
    <RecoilRoot>
      <MantineProvider>
        <ModalsProvider>
          <GlobalStyle />
          <AppViews />
        </ModalsProvider>
      </MantineProvider>
    </RecoilRoot>
  )
}

export default App
