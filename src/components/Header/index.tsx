import { FunctionComponent } from "react"
import { HeaderContainer } from "./styles"

export const Header: FunctionComponent = ({ children }) => {
  return <HeaderContainer>{children}</HeaderContainer>
}
