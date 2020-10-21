import type { Dispatch as ReactDispatch } from "react"

import { generateBoard, formWordFromIndexes, isValidMove } from "./utils"

export interface State {
  dictionary: Set<string>
  board: string[]
  currentWordIndexes: number[]
  foundWords: Set<string>
  timer: number
  inGame: boolean
  paused: boolean
  modalOpen: boolean
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
      type: "StartWord"
      payload: number
    }
  | {
      type: "EndWord"
    }
  | {
      type: "AddToWord"
      payload: number
    }
  | {
      type: "TickTimer"
    }
  | { type: "ToggleModal" }

export type Dispatch = ReactDispatch<Action>

export const initialState: State = {
  dictionary: new Set(),
  board: [],
  currentWordIndexes: [],
  foundWords: new Set(),
  timer: 120,
  inGame: false,
  paused: false,
  modalOpen: false
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
      return {
        ...initialState,
        dictionary: state.dictionary,
        board: generateBoard(),
        inGame: true
      }
    }
    case "RestartGame": {
      return {
        ...initialState,
        dictionary: state.dictionary,
        board: state.board,
        inGame: true
      }
    }
    case "TogglePaused": {
      return {
        ...state,
        paused: action.payload
      }
    }
    case "StartWord": {
      return {
        ...state,
        currentWordIndexes: [action.payload]
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
    default: {
      // @ts-ignore
      throw new Error(`Unhandled action: ${action.type}`)
    }
  }
}
