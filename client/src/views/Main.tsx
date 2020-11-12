import React from "react"
import type { FunctionComponent } from "react"

import { NewGameButton } from "../components/NewGameButton"
import { HowToPlayButton } from "../components/HowToPlayButton"

export const MainView: FunctionComponent = () => {
  return (
    <div className="main">
      <h1>Boggle!</h1>
      <div>
        {/* <button>New Multiplayer Game</button> */}
        <NewGameButton />
        <HowToPlayButton />
      </div>
    </div>
  )
}
