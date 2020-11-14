import React from "react"
import type { FunctionComponent } from "react"

import { NewGameButton } from "../components/NewGameButton"
import { HowToPlayButton } from "../components/HowToPlayButton"

import { useAppDispatch } from "../context"

export const MainView: FunctionComponent = () => {
  const dispatch = useAppDispatch()

  function handleMultiplayerClick() {
    dispatch({ type: "LobbyView" })
  }
  return (
    <div className="main">
      <h1>Boggle!</h1>
      <div>
        <button onClick={handleMultiplayerClick}>Multiplayer</button>
        <NewGameButton label="Single Player" singlePlayer={true} enabled={true} />
        <HowToPlayButton />
      </div>
    </div>
  )
}
