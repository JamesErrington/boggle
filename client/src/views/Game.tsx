import React, { useEffect } from "react"
import type { FunctionComponent } from "react"

import { Timer } from "../components/Timer"
import { Board } from "../components/Board"
import { GameControls } from "../components/GameControls"
import { WordTable } from "../components/WordTable"

import { useAppState, useAppDispatch } from "../context"
import { GameType } from "../reducer"

export const GameView: FunctionComponent = () => {
  const { timeLeft, isPaused, gameType } = useAppState()
  const dispatch = useAppDispatch()

  useEffect(() => {
    let interval
    if ((timeLeft <= 0 || isPaused) && interval !== null) {
      clearInterval(interval)
    } else if (gameType === GameType.SOLO && !isPaused && interval == null) {
      const timerInterval = setInterval(() => {
        dispatch({ type: "TickTimer_Solo" })
      }, 1000)
      return () => clearInterval(timerInterval)
    }
    return
  }, [dispatch, isPaused, timeLeft, gameType])

  return (
    <div className="game">
      <div className="timer-container">
        <Timer />
      </div>
      <div className="board-container">
        <Board />
      </div>
      <div className="game-controls-container">
        <GameControls />
      </div>
      <div className="word-container">
        <WordTable />
      </div>
    </div>
  )
}
