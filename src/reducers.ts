import type { Dispatch as ReactDispatch } from "react"

import { generateBoard, formWordFromIndexes, isValidMove } from "./utils"

export interface State {
  dictionary: Set<string>
  letters: string[]
  currentWordIndexes: number[]
  foundWords: Set<string>
}

type Action =
  | { type: "LoadDictionary"; payload: Set<string> }
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
    case "LoadDictionary": {
      return {
        ...state,
        dictionary: action.payload
      }
    }
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
    default: {
      throw new Error(`Unhandled action: ${action}`)
    }
  }
}
