import client, { Socket } from "socket.io-client"
import type { Dispatch as ReactDispatch } from "react"

import { handleSocketUpdate } from "../hooks/socketUpdate"
import {
  formWordFromIndexes,
  isValidMove,
  setupGame,
  wordScore
} from "../utils"
import { generateBoard } from "../shared/utils"
import type { Player, SocketUpdate } from "../shared/types"

export interface State {
  view: AppView
  gameType: GameType
  dictionary: Set<string> | null
  helpModalOpen: boolean
  gameState: GameState
  socketState: SocketState
}

export enum AppView {
  Main = "MAIN",
  Lobby = "LOBBY",
  Game = "GAME"
}

export enum GameType {
  Solo = "SOLO",
  Multi = "MULTI"
}

interface GameState {
  board: string[]
  allWordsIndexes: number[][]
  allWordsStrings: string[]
  allWordsScore: number
  foundWordsIndexes: number[]
  foundWordsStrings: string[]
  foundWordsScore: number
  nonFoundWordsStrings: string[]
  currentWordIndexes: number[]
  isPaused: boolean
  timeLeft: number
}

export const initialGameState: GameState = {
  board: [],
  allWordsIndexes: [],
  allWordsStrings: [],
  allWordsScore: 0,
  foundWordsIndexes: [],
  foundWordsStrings: [],
  foundWordsScore: 0,
  nonFoundWordsStrings: [],
  currentWordIndexes: [],
  isPaused: false,
  timeLeft: 120
}

interface SocketState {
  socket: typeof Socket | null
  code: string
  isHost: boolean
  player: Player
  players: Player[]
}

const initialSocketState = {
  socket: null,
  code: "",
  isHost: false,
  player: {
    id: "",
    username: ""
  },
  players: []
}

export const initialState: State = {
  view: AppView.Main,
  gameType: GameType.Solo,
  dictionary: null,
  helpModalOpen: false,
  gameState: initialGameState,
  socketState: initialSocketState
}

type Action =
  | { type: "LoadDictionary"; payload: Set<string> }
  | { type: "ToggleModal" }
  | { type: "TogglePaused" }
  | { type: "OpenLobby" }
  | { type: "SocketUpdate"; payload: SocketUpdate }
  | { type: "HostGame_Multi"; payload: string }
  | {
      type: "JoinGame_Multi"
      payload: {
        username: string
        code: string
      }
    }
  | { type: "StartGame_Multi" }
  | { type: "StartGame_Solo" }
  | { type: "RestartGame_Solo" }
  | { type: "AddToWord"; payload: number }
  | { type: "AddToWord_Mobile"; payload: number }
  | { type: "EndWord" }
  | { type: "TickTimer_Solo" }
  | { type: "HighlightWord"; payload: string | null }

export type Dispatch = ReactDispatch<Action>

export function boggleReducer(state: State, action: Action): State {
  // console.log(`[reducer] New Action: ${action.type}`)
  switch (action.type) {
    case "LoadDictionary": {
      return {
        ...state,
        dictionary: action.payload
      }
    }
    case "ToggleModal": {
      return {
        ...state,
        helpModalOpen: !state.helpModalOpen
      }
    }
    case "TogglePaused": {
      return {
        ...state,
        gameState: {
          ...state.gameState,
          isPaused: !state.gameState.isPaused
        }
      }
    }
    case "SocketUpdate": {
      return handleSocketUpdate(state, action.payload)
    }
    case "HostGame_Multi": {
      const socket = client({
        query: {
          create: true,
          username: action.payload
        }
      })

      return {
        ...state,
        socketState: {
          ...state.socketState,
          socket
        }
      }
    }
    case "JoinGame_Multi": {
      const socket = client({
        query: {
          code: action.payload.code,
          username: action.payload.username
        }
      })

      return {
        ...state,
        socketState: {
          ...state.socketState,
          socket
        }
      }
    }
    case "StartGame_Multi": {
      if (state.socketState.socket) {
        state.socketState.socket.emit("start", {
          code: state.socketState.code
        })
      }
      return state
    }
    case "StartGame_Solo": {
      if (state.dictionary === null) {
        throw new Error("Game started with no dictionary loaded")
      }

      const board = generateBoard()
      return setupGame(state, board, GameType.Solo)
    }
    case "RestartGame_Solo": {
      if (state.gameType !== GameType.Solo) {
        throw new Error("Tried to restart game when not in solo mode")
      }

      return {
        ...state,
        gameState: {
          ...initialGameState,
          board: state.gameState.board,
          allWordsStrings: state.gameState.allWordsStrings,
          allWordsIndexes: state.gameState.allWordsIndexes,
          allWordsScore: state.gameState.allWordsScore
        }
      }
    }
    case "AddToWord": {
      const {
        gameState: { currentWordIndexes }
      } = state
      const { payload } = action
      // If the selected square is the one we just came from, we remove the last selection
      const [last, ...rest] = [...currentWordIndexes].reverse()
      if (payload === currentWordIndexes[currentWordIndexes.length - 2]) {
        return {
          ...state,
          gameState: {
            ...state.gameState,
            currentWordIndexes: rest.reverse()
          }
        }
      }

      if (isValidMove(currentWordIndexes, payload)) {
        return {
          ...state,
          gameState: {
            ...state.gameState,
            currentWordIndexes: [...currentWordIndexes, payload]
          }
        }
      }

      return state
    }
    case "AddToWord_Mobile": {
      const {
        board,
        currentWordIndexes,
        foundWordsStrings,
        foundWordsIndexes,
        foundWordsScore,
        allWordsStrings
      } = state.gameState
      const { payload } = action
      // If we tap on the same square, remove it
      console.log(payload)
      console.log(currentWordIndexes)
      if (payload === currentWordIndexes[currentWordIndexes.length - 1]) {
        const [last, ...rest] = [...currentWordIndexes].reverse()
        return {
          ...state,
          gameState: {
            ...state.gameState,
            currentWordIndexes: rest.reverse()
          }
        }
      }

      if (isValidMove(currentWordIndexes, payload) === false) {
        return state
      }

      const newIndexes = [...currentWordIndexes, payload]
      const foundWord = formWordFromIndexes(board, newIndexes)

      if (
        newIndexes.length < 3 ||
        foundWordsStrings.includes(foundWord) ||
        !allWordsStrings.includes(foundWord)
      ) {
        return {
          ...state,
          gameState: {
            ...state.gameState,
            currentWordIndexes: newIndexes
          }
        }
      }
      const score = wordScore(foundWord)
      const newFoundWordsStrings = [...foundWordsStrings, foundWord]
      const nonFoundWordsStrings = allWordsStrings.filter(
        word => !newFoundWordsStrings.includes(word)
      )
      return {
        ...state,
        gameState: {
          ...state.gameState,
          currentWordIndexes: [],
          foundWordsStrings: newFoundWordsStrings,
          foundWordsIndexes: [...foundWordsIndexes, ...currentWordIndexes],
          foundWordsScore: foundWordsScore + score,
          nonFoundWordsStrings
        }
      }
    }
    case "EndWord": {
      const {
        board,
        currentWordIndexes,
        foundWordsStrings,
        foundWordsIndexes,
        foundWordsScore,
        allWordsStrings
      } = state.gameState
      const foundWord = formWordFromIndexes(board, currentWordIndexes)

      if (
        currentWordIndexes.length < 3 ||
        foundWordsStrings.includes(foundWord) ||
        !allWordsStrings.includes(foundWord)
      ) {
        return {
          ...state,
          gameState: {
            ...state.gameState,
            currentWordIndexes: []
          }
        }
      }

      const score = wordScore(foundWord)
      const newFoundWordsStrings = [...foundWordsStrings, foundWord]
      const nonFoundWordsStrings = allWordsStrings.filter(
        word => !newFoundWordsStrings.includes(word)
      )
      return {
        ...state,
        gameState: {
          ...state.gameState,
          currentWordIndexes: [],
          foundWordsStrings: newFoundWordsStrings,
          foundWordsIndexes: [...foundWordsIndexes, ...currentWordIndexes],
          foundWordsScore: foundWordsScore + score,
          nonFoundWordsStrings
        }
      }
    }
    case "TickTimer_Solo": {
      if (state.gameState.timeLeft <= 0) {
        return {
          ...state,
          gameState: {
            ...state.gameState,
            timeLeft: 0
          }
        }
      }
      return {
        ...state,
        gameState: {
          ...state.gameState,
          timeLeft: state.gameState.timeLeft - 1
        }
      }
    }
    case "HighlightWord": {
      if (action.payload === null) {
        return {
          ...state,
          gameState: {
            ...state.gameState,
            currentWordIndexes: []
          }
        }
      }
      const { allWordsStrings, allWordsIndexes } = state.gameState
      const index = allWordsStrings.indexOf(action.payload)

      return {
        ...state,
        gameState: {
          ...state.gameState,
          currentWordIndexes: allWordsIndexes[index]
        }
      }
    }
    case "OpenLobby": {
      return {
        ...state,
        view: AppView.Lobby,
        gameType: GameType.Multi
      }
    }
    default: {
      // @ts-ignore
      throw new Error(`Unhandled action type ${action.type}`)
    }
  }
}

// export interface State {
//   dictionary: Set<string>
//   board: string[]
//   allWords: Record<string, number[]>
//   currentWordIndexes: number[]
//   foundWords: Set<string>
//   timer: number
//   inGame: boolean
//   isPaused: boolean
//   modalOpen: boolean
//   socket: typeof Socket | null
//   socketState: SocketState | null
// }

// interface JoinGamePayload {
//   name: string
//   create?: boolean
//   code?: string
// }

// declare enum LobbyStatus {
//   OPEN = "open"
// }

// interface Player {
//   id: string
//   name: string
// }

// interface SocketState {
//   code: string
//   isHost: boolean
//   status: LobbyStatus
//   players: Player[]
//   player: Player
//   currentGame: {
//     board: string[]
//   }
// }

// type Action =
//   | {
//       type: "LoadDictionary"
//       payload: Set<string>
//     }
//   | { type: "NewGame" }
//   | { type: "RestartGame" }
//   | {
//       type: "TogglePaused"
//       payload: boolean
//     }
//   | {
//       type: "EndWord"
//     }
//   | {
//       type: "AddToWord"
//       payload: number
//     }
//   | {
//       type: "AddToWordMobile"
//       payload: number
//     }
//   | {
//       type: "TickTimer"
//     }
//   | { type: "ToggleModal" }
//   | {
//       type: "JoinGame"
//       payload: JoinGamePayload
//     }
//   | {
//       type: "SocketUpdate"
//       payload: SocketState
//     }
//   | { type: "StartGame" }

// export type Dispatch = ReactDispatch<Action>

// export const initialState: State = {
//   dictionary: new Set(),
//   board: [],
//   allWords: {},
//   currentWordIndexes: [],
//   foundWords: new Set(),
//   timer: 120,
//   inGame: false,
//   isPaused: false,
//   modalOpen: false,
//   socket: null,
//   socketState: null
// }

// export function boggleReducer(state: State, action: Action) {
//   switch (action.type) {

//     case "EndWord": {
//       if (state.currentWordIndexes.length > 2) {
//         const foundWord = formWordFromIndexes(
//           state.board,
//           state.currentWordIndexes
//         )
//         if (
//           state.foundWords.has(foundWord) === false &&
//           state.dictionary.has(foundWord)
//         ) {
//           return {
//             ...state,
//             foundWords: new Set([...state.foundWords, foundWord]),
//             currentWordIndexes: []
//           }
//         }
//       }
//       return {
//         ...state,
//         currentWordIndexes: []
//       }
//     }
//     case "AddToWord": {
//       const { currentWordIndexes } = state
//       const { payload } = action
//       // If the selected square is the one we just came from, we remove the last selection
//       const [last, ...rest] = [...currentWordIndexes].reverse()
//       if (payload === currentWordIndexes[currentWordIndexes.length - 2]) {
//         return {
//           ...state,
//           currentWordIndexes: rest.reverse()
//         }
//       }

//       if (isValidMove(currentWordIndexes, payload)) {
//         return {
//           ...state,
//           currentWordIndexes: [...currentWordIndexes, payload]
//         }
//       }
//       return state
//     }
//     case "AddToWordMobile": {
//       const { currentWordIndexes } = state
//       const { payload } = action
//       // If we tap on the same square, remove it
//       if (payload === currentWordIndexes[currentWordIndexes.length - 1]) {
//         const [last, ...rest] = [...currentWordIndexes].reverse()
//         return {
//           ...state,
//           currentWordIndexes: rest.reverse()
//         }
//       }

//       if (isValidMove(currentWordIndexes, payload) === false) {
//         return state
//       }

//       const newIndexes = [...state.currentWordIndexes, payload]
//       const foundWord = formWordFromIndexes(state.board, newIndexes)

//       if (
//         state.foundWords.has(foundWord) === false &&
//         state.dictionary.has(foundWord)
//       ) {
//         return {
//           ...state,
//           foundWords: new Set([...state.foundWords, foundWord]),
//           currentWordIndexes: []
//         }
//       }
//       return {
//         ...state,
//         currentWordIndexes: newIndexes
//       }
//     }
//     case "TickTimer": {
//       return {
//         ...state,
//         timer: state.timer - 1
//       }
//     }
//     case "ToggleModal": {
//       return {
//         ...state,
//         modalOpen: !state.modalOpen
//       }
//     }
//     case "JoinGame": {
//       const { name, create, code } = action.payload
//       const query = `name=${name}&${create ? `create=${create}` : ""}${code ? `code=${code}` : ""}`
//       const socket = client({
//         query
//       })

//       return {
//         ...state,
//         socket: socket
//       }
//     }
//     case "SocketUpdate": {
//       return {
//         ...state,
//         socketState: {
//           ...state.socketState,
//           ...action.payload
//         }
//       }
//     }
//     case "StartGame": {
//       console.log("StartGame dispatch")
//       if(state.socket && state.socketState) {
//         console.log("Emit Start")
//         state.socket.emit("start", {
//           code: state.socketState.code
//         })
//         return state
//       }

//       throw new Error("Attempted to start multiplayer game with no active socket set")
//     }
//     default: {
//       // @ts-ignore
//       throw new Error(`Unhandled action: ${action.type}`)
//     }
//   }
// }
