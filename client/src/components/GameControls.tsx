import React from "react"
import type { FunctionComponent } from "react"

import { NewGameButton } from "./NewGameButton"
import { HowToPlayButton } from "./HowToPlayButton"

import { useAppState, useAppDispatch } from "../context"
import { GameType } from "../reducer"

export const GameControls: FunctionComponent = () => {
  const { isPaused, timeLeft, gameType } = useAppState()
  const dispatch = useAppDispatch()

  const pauseDisabled = timeLeft <= 0
  const showSoloControls = gameType === GameType.SOLO

  function handlePauseClick() {
    dispatch({ type: "ToggleGamePaused" })
  }

  function handleRestartClick() {
    dispatch({ type: "RestartGame_Solo" })
  }

  return (
    <div>
      {showSoloControls && (
        <>
          <button onClick={handlePauseClick} disabled={pauseDisabled}>
            {isPaused ? "Unpause" : "Pause"}
          </button>
          <button onClick={handleRestartClick}>Restart</button>
          <NewGameButton />
          <HowToPlayButton />
        </>
      )}
    </div>
  )
}
