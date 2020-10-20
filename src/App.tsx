import React, { useEffect } from "react"
import type { FunctionComponent } from "react"

import { Board } from "./components/Board"
import { ScoreTable } from "./components/ScoreTable"

import { useBoggleDispatch, useBoggleState } from "./context"
import "./App.css"
import { loadDictionary } from "./utils"

export const App: FunctionComponent = () => {
  const { timer } = useBoggleState()
  const dispatch = useBoggleDispatch()

  function handleClick() {
    dispatch({ type: "NewGame" })
  }

  useEffect(() => {
    loadDictionary().then(payload => {
      dispatch({ type: "LoadDictionary", payload })
      dispatch({ type: "NewGame" })
    })
  }, [dispatch])

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: "TickTimer" })
    }, 1000)

    return () => clearInterval(timer)
  }, [dispatch])

  return (
    <div className="App">
      {timer}
      <div className="game">
        <Board size={400} />
        <ScoreTable />
      </div>
      <button onClick={handleClick}>New Game</button>
    </div>
  )
}
