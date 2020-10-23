import React, { useEffect, useMemo } from "react"
import type { FunctionComponent } from "react"

import { Board } from "./Board"
import { WordTable } from "./WordTable"

import { useBoggleDispatch, useBoggleState } from "../context"
import { calculateScore } from "../utils"

function formatTimer(seconds: number) {
  return new Date(seconds * 1000).toTimeString().substr(3, 5)
}

interface Props {}

export const GameContainer: FunctionComponent<Props> = () => {
  const { timer, paused, foundWords, allWords } = useBoggleState()
  const dispatch = useBoggleDispatch()

  const allWordsStrings = Object.keys(allWords)
  const unfoundWords = useMemo(() => {
    return allWordsStrings.filter(word => !foundWords.includes(word))
  }, [allWordsStrings, foundWords])
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
    let interval
    if ((timer <= 0 || paused) && interval !== null) {
      clearInterval(interval)
    } else if (!paused && interval == null) {
      const timerInterval = setInterval(() => {
        dispatch({ type: "TickTimer" })
      }, 1000)
      return () => clearInterval(timerInterval)
    }
  }, [dispatch, paused, timer])

  return (
    <div className="game">
      <div className="timer-container">
        <h3>Time Left</h3>
        <h3>{formattedTimer}</h3>
        <div className="score-container">
          <h3>
            Found: {foundWords.length}{" "}
            {timer <= 0 && `/ ${allWordsStrings.length}`}
          </h3>
          <h3>
            Score: {calculateScore(foundWords)}{" "}
            {timer <= 0 && `/ ${calculateScore(allWordsStrings)}`}
          </h3>
        </div>
      </div>
      <div className="board-container">
        <Board disabled={timer <= 0} />
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
      <div className="word-container">
        <WordTable
          foundWords={foundWords}
          unfoundWords={unfoundWords}
          showUnfound={timer <= 0}
        />
      </div>
    </div>
  )
}
