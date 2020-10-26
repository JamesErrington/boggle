import client from "socket.io-client"
import type { Dispatch as ReactDispatch } from "react"
import type { Socket } from "socket.io-client"

import {
  generateBoard,
  formWordFromIndexes,
  isValidMove,
  findAllWords
} from "./utils"


export interface State {
  dictionary: Set<string>
  board: string[]
  allWords: Record<string, number[]>
  currentWordIndexes: number[]
  foundWords: Set<string>
  timer: number
  inGame: boolean
  paused: boolean
  modalOpen: boolean
  socket: typeof Socket | null
  socketState: SocketState | null
}

interface JoinGamePayload {
  name: string
  create?: boolean
  code?: string
}

declare enum LobbyStatus {
  OPEN = "open"
}

interface Player {
  id: string
  name: string
}

interface SocketState {
  code: string
  isHost: boolean
  status: LobbyStatus
  players: Player[]
  player: Player
  currentGame: {
    board: string[]
  }
}

type Action =
  | {
      type: "LoadDictionary"
      payload: Set<string>
    }
  | { type: "NewGame" }
  | { type: "RestartGame" }
  | {
      type: "TogglePaused"
      payload: boolean
    }
  | {
      type: "EndWord"
    }
  | {
      type: "AddToWord"
      payload: number
    }
  | {
      type: "AddToWordMobile"
      payload: number
    }
  | {
      type: "TickTimer"
    }
  | { type: "ToggleModal" }
  | { 
      type: "JoinGame"
      payload: JoinGamePayload 
    }
  | { 
      type: "SocketUpdate"
      payload: SocketState
    }
  | { type: "StartGame" }

export type Dispatch = ReactDispatch<Action>

export const initialState: State = {
  dictionary: new Set(),
  board: [],
  allWords: {},
  currentWordIndexes: [],
  foundWords: new Set(),
  timer: 120,
  inGame: false,
  paused: false,
  modalOpen: false,
  socket: null,
  socketState: null
}

export function boggleReducer(state: State, action: Action) {
  switch (action.type) {
    case "LoadDictionary": {
      return {
        ...state,
        dictionary: action.payload
      }
    }
    case "NewGame": {
      const board = generateBoard()
      const words = findAllWords(board, state.dictionary)

      return {
        ...initialState,
        dictionary: state.dictionary,
        allWords: words,
        inGame: true,
        board
      }
    }
    case "RestartGame": {
      return {
        ...initialState,
        dictionary: state.dictionary,
        board: state.board,
        allWords: state.allWords,
        inGame: true
      }
    }
    case "TogglePaused": {
      return {
        ...state,
        paused: action.payload
      }
    }
    case "EndWord": {
      if (state.currentWordIndexes.length > 2) {
        const foundWord = formWordFromIndexes(
          state.board,
          state.currentWordIndexes
        )
        if (
          state.foundWords.has(foundWord) === false &&
          state.dictionary.has(foundWord)
        ) {
          return {
            ...state,
            foundWords: new Set([...state.foundWords, foundWord]),
            currentWordIndexes: []
          }
        }
      }
      return {
        ...state,
        currentWordIndexes: []
      }
    }
    case "AddToWord": {
      const { currentWordIndexes } = state
      const { payload } = action
      // If the selected square is the one we just came from, we remove the last selection
      const [last, ...rest] = [...currentWordIndexes].reverse()
      if (payload === currentWordIndexes[currentWordIndexes.length - 2]) {
        return {
          ...state,
          currentWordIndexes: rest.reverse()
        }
      }

      if (isValidMove(currentWordIndexes, payload)) {
        return {
          ...state,
          currentWordIndexes: [...currentWordIndexes, payload]
        }
      }
      return state
    }
    case "AddToWordMobile": {
      const { currentWordIndexes } = state
      const { payload } = action
      // If we tap on the same square, remove it
      if (payload === currentWordIndexes[currentWordIndexes.length - 1]) {
        const [last, ...rest] = [...currentWordIndexes].reverse()
        return {
          ...state,
          currentWordIndexes: rest.reverse()
        }
      }

      if (isValidMove(currentWordIndexes, payload) === false) {
        return state
      }

      const newIndexes = [...state.currentWordIndexes, payload]
      const foundWord = formWordFromIndexes(state.board, newIndexes)

      if (
        state.foundWords.has(foundWord) === false &&
        state.dictionary.has(foundWord)
      ) {
        return {
          ...state,
          foundWords: new Set([...state.foundWords, foundWord]),
          currentWordIndexes: []
        }
      }
      return {
        ...state,
        currentWordIndexes: newIndexes
      }
    }
    case "TickTimer": {
      return {
        ...state,
        timer: state.timer - 1
      }
    }
    case "ToggleModal": {
      return {
        ...state,
        modalOpen: !state.modalOpen
      }
    }
    case "JoinGame": {
      const { name, create, code } = action.payload
      const query = `name=${name}&${create ? `create=${create}` : ""}${code ? `code=${code}` : ""}`
      const socket = client({
        query
      })

      return {
        ...state,
        socket: socket
      }
    }
    case "SocketUpdate": {
      return {
        ...state,
        socketState: {
          ...state.socketState,
          ...action.payload
        }
      }
    }
    case "StartGame": {
      console.log("StartGame dispatch")
      if(state.socket && state.socketState) {
        console.log("Emit Start")
        state.socket.emit("start", {
          code: state.socketState.code
        })
        return state
      }
      
      throw new Error("Attempted to start multiplayer game with no active socket set")
    }
    default: {
      // @ts-ignore
      throw new Error(`Unhandled action: ${action.type}`)
    }
  }
}
