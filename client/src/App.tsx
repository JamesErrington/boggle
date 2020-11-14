import React, { useEffect } from "react"
import type { FunctionComponent } from "react"

import { MainView } from "./views/Main"
import { GameView } from "./views/Game"
import { LobbyView } from "./views/Lobby"
import { HowToPlayModal } from "./components/HowToPlayModal"

import { useAppState, useAppDispatch } from "./context"
import { View } from "./reducer"
import type { SocketUpdate, SocketError } from "../../shared/types"

import "./App.scss"

export const App: FunctionComponent = () => {
  const { view, helpModalOpen, socket } = useAppState()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (socket) {
      socket.on("update", (update: SocketUpdate) => {
        // console.log(`[client] Socket recieved update ${update.type} with data`, update.payload)
        dispatch({
          type: "SocketUpdate",
          payload: update
        })
      })
      socket.on("error", (error: SocketError) => {
        console.error(`[client] ${error.payload.message}`)
        alert(error.payload.message)
      })
    }

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [socket])

  return (
    <div className="App">
      {view === View.MAIN && <MainView />}
      {view === View.GAME && <GameView />}
      {view === View.LOBBY && <LobbyView />}
      <HowToPlayModal isOpen={helpModalOpen} />
    </div>
  )
}
