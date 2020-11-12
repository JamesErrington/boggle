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
import React from "react"
import type { FunctionComponent } from "react"

import { MainView } from "./views/Main"
import { GameView } from "./views/Game"
import { HowToPlayModal } from "./components/HowToPlayModal"

import { useAppState } from "./context"
import { View } from "./reducer"

import "./App.scss"

// import { Main } from "../../packages/client/src/views/Main"
// import { Game } from "../../packages/client/src/views/Game"
// import { Lobby } from "../../packages/client/src/views/Lobby"
// import { HowToPlayModal } from "../../packages/client/src/components/HowToPlayModal"

// import { loadDictionary } from "../../packages/client/src/utils"
// import { AppView } from "../../packages/client/src/hooks/reducer"
// import { useBoggleDispatch, useBoggleState } from "../../packages/client/src/hooks/context"

// import type { SocketUpdate } from "../../packages/shared/types"
// import "./App.scss"

// interface Props {}

export const App: FunctionComponent = () => {
  const { view, helpModalOpen } = useAppState()
  // const dispatch = useAppDispatch()
  // const { view, helpModalOpen, socketState, gameType } = useBoggleState()
  // const dispatch = useBoggleDispatch()
  // const { socket } = socketState

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("update", (data: SocketUpdate) => {
  //       console.log(`[socket] Update recieved:`, data)
  //       dispatch({ type: "SocketUpdate", payload: data })
  //     })
  //     return () => socket.disconnect()
  //   }
  //   return () => {}
  // }, [dispatch, socket])

  return (
    <div className="App">
      {view === View.MAIN && <MainView />}
      {view === View.GAME && <GameView />}
      {/* {view === AppView.Lobby && <Lobby />} */}
      <HowToPlayModal isOpen={helpModalOpen} />

      {/* <button>Create Game</button>
      <button>Join Game</button>
      <button>Start Game</button>
      <button>Ack Start Game</button>
      <button>Timer Expires</button> */}
    </div>
  )
}
