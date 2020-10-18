import type { Dispatch as ReactDispatch } from "react"

import { generateBoard, formWordFromIndexes, isValidMove } from "./utils"

export interface State {
  letters: string[]
  currentWordIndexes: number[]
  foundWords: string[]
}

type Action =
  | { type: "GenerateLetters" }
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

export type Dispatch = ReactDispatch<Action>

export function boggleReducer(state: State, action: Action) {
  switch (action.type) {
    case "GenerateLetters": {
      return {
        ...state,
        letters: generateBoard()
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
          state.letters,
          state.currentWordIndexes
        )
        if (state.foundWords.includes(foundWord) === false) {
          return {
            ...state,
            foundWords: [...state.foundWords, foundWord],
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
    default: {
      throw new Error(`Unhandled action: ${action}`)
    }
  }
}
