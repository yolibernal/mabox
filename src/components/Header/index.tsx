import { MaboxLogo } from "components/MaboxLogo"
import { ModeDisplay } from "components/ModeDisplay"
import { ProgressBar } from "components/ProgressBar"
import { Timeline } from "components/Timeline"
import { Mode } from "Mode"
import { FunctionComponent } from "react"
import { useRecoilValue } from "recoil"
import { modeState } from "store"
import {
  HeaderContainer,
  HeaderLogoContainer,
  HeaderModeDisplayContainer,
  HeaderTimelineContainer,
} from "./styles"

export const Header: FunctionComponent = () => {
  const mode = useRecoilValue(modeState)
  return (
    <HeaderContainer>
      <HeaderLogoContainer>
        <MaboxLogo />
      </HeaderLogoContainer>
      <HeaderTimelineContainer>
        {mode === Mode.Map ? <Timeline /> : <ProgressBar />}
      </HeaderTimelineContainer>
      <HeaderModeDisplayContainer>
        <ModeDisplay mode={mode} />
      </HeaderModeDisplayContainer>
    </HeaderContainer>
  )
}
