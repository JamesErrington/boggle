import React from "react"
import type { FunctionComponent } from "react"

import { useBoggleDispatch } from "../context"

interface Props {}

export const MainSplash: FunctionComponent<Props> = () => {
  const dispatch = useBoggleDispatch()

  function handleNewGameClick() {
    dispatch({ type: "NewGame" })
  }

  function handleHTPClick() {
    dispatch({ type: "ToggleModal" })
  }

  return (
    <div className="main-splash">
      <h1>Boggle!</h1>
      <div>
        <button onClick={handleNewGameClick}>New Game</button>
        <button onClick={handleHTPClick}>How To Play</button>
      </div>
    </div>
  )
}
