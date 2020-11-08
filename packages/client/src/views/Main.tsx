import React from "react"
import type { FunctionComponent } from "react"

import { useBoggleDispatch } from "../hooks/context"

interface Props {}

export const Main: FunctionComponent<Props> = () => {
  const dispatch = useBoggleDispatch()

  function handleNewMultiplayerGameClick() {
    dispatch({ type: "OpenLobby" })
  }

  function handleNewSoloGameClick() {
    dispatch({ type: "StartGame_Solo" })
  }

  function handleHTPClick() {
    dispatch({ type: "ToggleModal" })
  }

  return (
    <div className="main">
      <h1>Boggle!</h1>
      <div>
        <button onClick={handleNewMultiplayerGameClick}>
          New Multiplayer Game
        </button>
        <button onClick={handleNewSoloGameClick}>New Solo Game</button>
        <button onClick={handleHTPClick}>How To Play</button>
      </div>
    </div>
  )
}
