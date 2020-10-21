import React, { useEffect, useState } from "react"
import type { FunctionComponent } from "react"

import { Board } from "./Board"
import { ScoreTable } from "./ScoreTable"

import { useBoggleDispatch, useBoggleState } from "../context"

function formatTimer(seconds: number) {
  return new Date(seconds * 1000).toTimeString().substr(3, 5)
}

interface Props {}

export const GameContainer: FunctionComponent<Props> = () => {
  const { timer, paused } = useBoggleState()
  const dispatch = useBoggleDispatch()
  const [interval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

  const formattedTimer = formatTimer(timer)

  function handlePauseClick() {
    dispatch({ type: "TogglePaused", payload: !paused })
  }

  function handleNewGameClick() {
    dispatch({ type: "NewGame" })
  }

  function handleRestartClick() {
    dispatch({ type: "RestartGame" })
  }

  function handleHTPClick() {
    dispatch({ type: "ToggleModal" })
  }

  useEffect(() => {
    const timerInterval = setInterval(() => {
      dispatch({ type: "TickTimer" })
    }, 1000)
    setTimerInterval(timerInterval)

    return () => clearInterval(timerInterval)
  }, [dispatch])

  useEffect(() => {
    if ((timer <= 0 || paused) && interval !== null) {
      clearInterval(interval)
    }
  }, [timer, paused])

  return (
    <div className="game">
      <div className="timer-container">
        <h3>{formattedTimer}</h3>
      </div>
      <div className="board-container">
        <Board size={400} disabled={timer <= 0} />
      </div>
      <div className="score-container">
        <ScoreTable />
      </div>
      <div className="game-controls-container">
        <div>
          <button onClick={handlePauseClick} disabled={timer <= 0}>
            {paused ? "Unpause" : "Pause"}
          </button>
          <button onClick={handleRestartClick}>Restart</button>
          <button onClick={handleNewGameClick}>New Game</button>
          <button onClick={handleHTPClick}>How To Play</button>
        </div>
      </div>
    </div>
  )
}
