import React from "react"
import type { FunctionComponent } from "react"

import { getSoloGame } from "../network"
import { useAppDispatch } from "../context"

export const NewGameButton: FunctionComponent = () => {
  const dispatch = useAppDispatch()

  async function handleClick() {
    const game = await getSoloGame()
    dispatch({ type: "StartGame_Solo", payload: game })
  }

  return <button onClick={handleClick}>New Game</button>
}
