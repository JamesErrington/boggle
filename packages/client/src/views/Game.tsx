import React, { useEffect } from "react"
import type { FunctionComponent } from "react"

import { Timer } from "../components/Timer"
import { Board } from "../components/Board"
import { GameControls } from "../components/GameControls"
import { WordTable } from "../components/WordTable"

import { useBoggleDispatch, useGameState } from "../hooks/context"
import { GameType } from "../hooks/reducer"

interface Props {
  gameType: GameType
}

export const Game: FunctionComponent<Props> = ({ gameType }) => {
  const {
    board,
    allWordsStrings,
    allWordsScore,
    foundWordsStrings,
    foundWordsScore,
    currentWordIndexes,
    isPaused,
    timeLeft
  } = useGameState()
  const dispatch = useBoggleDispatch()

  useEffect(() => {
    let interval
    if ((timeLeft <= 0 || isPaused) && interval !== null) {
      clearInterval(interval)
    } else if (gameType === GameType.Solo && !isPaused && interval == null) {
      const timerInterval = setInterval(() => {
        dispatch({ type: "TickTimer_Solo" })
      }, 1000)
      return () => clearInterval(timerInterval)
    }
  }, [dispatch, isPaused, timeLeft, gameType])

  return (
    <div className="game">
      <div className="timer-container">
        <Timer
          timeLeft={timeLeft}
          foundScore={foundWordsScore}
          foundWordsCount={foundWordsStrings.length}
          totalScore={allWordsScore}
          totalWordsCount={allWordsStrings.length}
        />
      </div>
      <div className="board-container">
        <Board
          board={board}
          isPaused={isPaused}
          isDisabled={timeLeft <= 0}
          highlightedIndexes={currentWordIndexes}
        />
      </div>
      <div className="game-controls-container">
        <GameControls
          isPaused={isPaused}
          pauseDisabled={timeLeft <= 0}
          showSoloControls={true}
        />
      </div>
      <div className="word-container">
        <WordTable
          foundWords={foundWordsStrings}
          allWordsStrings={allWordsStrings}
          showNonFound={timeLeft <= 0}
        />
      </div>
    </div>
  )
}
