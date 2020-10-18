import React from "react"
import type { FunctionComponent } from "react"

import { Board } from "./components/Board"
import { WordList } from "./components/WordList"

import { useBoggleDispatch } from "./context"
import "./App.css"

export const App: FunctionComponent = () => {
  const dispatch = useBoggleDispatch()

  function handleClick() {
    dispatch({ type: "GenerateLetters" })
  }

  return (
    <div className="App">
      <WordList />
      <Board size={400} />
      <button onClick={handleClick}>Generate Board</button>
    </div>
  )
}
