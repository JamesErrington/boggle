import React, { useState } from "react"
import type { FunctionComponent } from "react"

import { Board } from "./components/Board"

import "./App.css"

function getRandomCharCode() {
  return Math.floor(Math.random() * (122 - 97 + 1) + 97) //The maximum is inclusive and the minimum is inclusive
}

export const App: FunctionComponent = () => {
  const [letters, setLetters] = useState<string[]>([])

  function generateBoard() {
    const temp: string[] = []
    for (let i = 0; i < 16; i++) {
      temp.push(String.fromCharCode(getRandomCharCode()))
    }
    setLetters(temp)
  }

  return (
    <div className="App">
      <Board size={800} letters={letters} />
      <button onClick={generateBoard}>Generate Board</button>
    </div>
  )
}
