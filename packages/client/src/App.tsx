import React, { useEffect } from "react"
import type { FunctionComponent } from "react"

import { MainSplash } from "./components/MainSplash"
import { GameContainer } from "./components/GameContainer"

import { useBoggleDispatch, useBoggleState } from "./context"
import "./App.scss"
import { loadDictionary } from "./utils"
import { HowToPlayModal } from "./components/HowToPlayModal"
import { Lobby } from "./components/Lobby"

export const App: FunctionComponent = () => {
  const { inGame, socket } = useBoggleState()
  const dispatch = useBoggleDispatch()

  useEffect(() => {
    loadDictionary().then(payload =>
      dispatch({ type: "LoadDictionary", payload })
    )
  }, [dispatch])

  useEffect(() => {
    console.log("Socket Effect")
    if(socket) {
      socket.on("update", (data: any) => {
        console.log(`[socket] Update recieved:`, data)
        dispatch({
          type: "SocketUpdate",
          payload: data
        })
      })

      return () => socket.disconnect()
    }
    return () => {}
  }, [socket, dispatch])

  return (
    <div className="App">
      <Lobby />
      {/* {!inGame && <MainSplash />}
      {inGame && <GameContainer />}
      <HowToPlayModal /> */}
    </div>
  )
}
