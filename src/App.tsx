import React, { useEffect } from "react"
import type { FunctionComponent } from "react"

import { Board } from "./components/Board"
import { WordList } from "./components/WordList"

import { useBoggleDispatch } from "./context"
import "./App.css"
import { loadDictionary } from "./utils"

export const App: FunctionComponent = () => {
  const dispatch = useBoggleDispatch()

  function handleClick() {
    dispatch({ type: "GenerateLetters" })
  }

  useEffect(() => {
    loadDictionary().then(payload =>
      dispatch({ type: "LoadDictionary", payload })
    )
  })

  return (
    <div className="App">
      <WordList />
      <Board size={400} />
      <button onClick={handleClick}>Generate Board</button>
    </div>
  )
}
