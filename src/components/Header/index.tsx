import { MaboxLogo } from "components/MaboxLogo"
import { ModeDisplay } from "components/ModeDisplay"
import { Timeline } from "components/Timeline"
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
        <Timeline />
      </HeaderTimelineContainer>
      <HeaderModeDisplayContainer>
        <ModeDisplay mode={mode} />
      </HeaderModeDisplayContainer>
    </HeaderContainer>
  )
}
