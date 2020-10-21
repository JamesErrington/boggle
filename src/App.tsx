import React, { useEffect } from "react"
import type { FunctionComponent } from "react"

import { MainSplash } from "./components/MainSplash"
import { GameContainer } from "./components/GameContainer"

import { useBoggleDispatch, useBoggleState } from "./context"
import "./App.scss"
import { loadDictionary } from "./utils"
import { HowToPlayModal } from "./components/HowToPlayModal"

export const App: FunctionComponent = () => {
  const { inGame } = useBoggleState()
  const dispatch = useBoggleDispatch()

  useEffect(() => {
    loadDictionary().then(payload =>
      dispatch({ type: "LoadDictionary", payload })
    )
  }, [dispatch])

  return (
    <div className="App">
      {!inGame && <MainSplash />}
      {inGame && <GameContainer />}
      <HowToPlayModal />
    </div>
  )
}
