import React from "react"
import type { FunctionComponent } from "react"

import { useBoggleDispatch } from "../hooks/context"

interface Props {
  showSoloControls: boolean
  pauseDisabled: boolean
  isPaused: boolean
}

export const GameControls: FunctionComponent<Props> = ({
  showSoloControls,
  pauseDisabled,
  isPaused
}) => {
  const dispatch = useBoggleDispatch()

  function handlePauseClick() {
    dispatch({ type: "TogglePaused" })
  }

  function handleRestartClick() {
    dispatch({ type: "RestartGame_Solo" })
  }

  function handleNewGameClick() {
    dispatch({ type: "StartGame_Solo" })
  }

  function handleHTPClick() {
    dispatch({ type: "ToggleModal" })
  }

  return (
    <div>
      {showSoloControls && (
        <>
          <button onClick={handlePauseClick} disabled={pauseDisabled}>
            {isPaused ? "Unpause" : "Pause"}
          </button>
          <button onClick={handleRestartClick}>Restart</button>
          <button onClick={handleNewGameClick}>New Game</button>
        </>
      )}
      <button onClick={handleHTPClick}>How To Play</button>
    </div>
  )
}
