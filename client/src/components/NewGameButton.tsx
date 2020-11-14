import React from "react"
import type { FunctionComponent } from "react"

import { getSoloGame, requestStartGame } from "../network"
import { useAppState, useAppDispatch } from "../context"
import { GameType } from "../reducer"

interface Props {
  label: string
  singlePlayer: boolean
  enabled: boolean
}

export const NewGameButton: FunctionComponent<Props> = ({ label, singlePlayer, enabled }) => {
  const { socket, code } = useAppState()
  const dispatch = useAppDispatch()

  async function handleClick() {
    if (singlePlayer) {
      const game = await getSoloGame()
      dispatch({ type: "StartGame_Solo", payload: game })
    } else {
      if (socket) {
        requestStartGame(socket, code)
      } else {
        throw new Error("Tried to start game with no socket connection")
      }
    }
  }

  return (
    <button onClick={handleClick} disabled={!enabled}>
      {label}
    </button>
  )
}
