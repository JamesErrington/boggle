import type { Dispatch as ReactDispatch } from "react"

import { generateBoard, formWordFromIndexes, isValidMove } from "./utils"

export interface State {
  dictionary: Set<string>
  board: string[]
  currentWordIndexes: number[]
  foundWords: Set<string>
  timer: number
}

type Action =
  | { type: "LoadDictionary"; payload: Set<string> }
  | { type: "NewGame" }
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

export type Dispatch = ReactDispatch<Action>

export const initialState: State = {
  dictionary: new Set(),
  board: [],
  currentWordIndexes: [],
  foundWords: new Set(),
  timer: 0
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
        board: generateBoard()
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
        timer: state.timer + 1
      }
    }
    default: {
      // @ts-ignore
      throw new Error(`Unhandled action: ${action.type}`)
    }
  }
}
