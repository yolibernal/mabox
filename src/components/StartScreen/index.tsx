import { MaboxLogo } from "components/MaboxLogo"
import React, { FunctionComponent } from "react"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"
import {
  InitializationBox,
  StartScreenContainer,
  StartScreenLogoContainer,
} from "./styles"

export const StartScreen: FunctionComponent = () => {
  return (
    <StartScreenContainer>
      <Particles
        id="tsparticles"
        init={async (main) => {
          await loadFull(main)
        }}
        options={{
          fullScreen: {
            enable: true,
            zIndex: -1, // or any value is good for you, if you use -1 set `interactivity.detectsOn` to `"window"` if you need mouse interactions
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#000",
            },
            links: {
              color: "#000",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 3,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
      <StartScreenLogoContainer>
        <MaboxLogo />
      </StartScreenLogoContainer>
      <InitializationBox>Press JOYSTICK to initialize...</InitializationBox>
    </StartScreenContainer>
  )
}
