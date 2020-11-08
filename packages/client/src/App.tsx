// import React, { useEffect } from "react"
// import type { FunctionComponent } from "react"

// import { MainSplash } from "./components/MainSplash"
// import { GameContainer } from "./components/GameContainer"

// import { useBoggleDispatch, useBoggleState } from "./context"
// import "./App.scss"
// import { loadDictionary } from "./utils"
// import { HowToPlayModal } from "./components/HowToPlayModal"
// import { Lobby } from "./components/Lobby"

// export const App: FunctionComponent = () => {
//   const { inGame, socket } = useBoggleState()
//   const dispatch = useBoggleDispatch()

//   useEffect(() => {
//     loadDictionary().then(payload =>
//       dispatch({ type: "LoadDictionary", payload })
//     )
//   }, [dispatch])

//   useEffect(() => {
//     console.log("Socket Effect")
//     if(socket) {
//       socket.on("update", (data: any) => {
//         console.log(`[socket] Update recieved:`, data)
//         dispatch({
//           type: "SocketUpdate",
//           payload: data
//         })
//       })

//       return () => socket.disconnect()
//     }
//     return () => {}
//   }, [socket, dispatch])

//   return (
//     <div className="App">
//       <Lobby />
//       {/* {!inGame && <MainSplash />}
//       {inGame && <GameContainer />}
//       <HowToPlayModal /> */}
//     </div>
//   )
// }
import React, { useEffect } from "react"
import type { FunctionComponent } from "react"

import { Main } from "./views/Main"
import { Game } from "./views/Game"
import { Lobby } from "./views/Lobby"
import { HowToPlayModal } from "./components/HowToPlayModal"

import { loadDictionary } from "./utils"
import { AppView } from "./hooks/reducer"
import { useBoggleDispatch, useBoggleState } from "./hooks/context"

import type { SocketUpdate } from "../../shared/types"
import "./App.scss"

interface Props {}

export const App: FunctionComponent<Props> = () => {
  const { view, helpModalOpen, socketState, gameType } = useBoggleState()
  const dispatch = useBoggleDispatch()
  const { socket } = socketState

  useEffect(() => {
    loadDictionary().then(payload => {
      dispatch({ type: "LoadDictionary", payload })
    })
  }, [dispatch])

  useEffect(() => {
    if (socket) {
      socket.on("update", (data: SocketUpdate) => {
        console.log(`[socket] Update recieved:`, data)
        dispatch({ type: "SocketUpdate", payload: data })
      })
      return () => socket.disconnect()
    }
    return () => {}
  }, [dispatch, socket])

  return (
    <div className="App">
      {/* {view === AppView.Main && <Main />}
      {view === AppView.Game && <Game gameType={gameType} />}
      {view === AppView.Lobby && <Lobby />}
      <HowToPlayModal isOpen={helpModalOpen} /> */}

      <button>Create Game</button>
      <button>Join Game</button>
      <button>Start Game</button>
      <button>Ack Start Game</button>
      <button>Timer Expires</button>
    </div>
  )
}
