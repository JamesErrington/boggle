import type { Dispatch as ReactDispatch } from "react"

import { isValidMove, lookupWordFromIndexes, lookupWordFromString, wordAlreadyFound } from "./utils"
import type { Word, GenerateGameResponse } from "../../shared/types"

export enum View {
  "MAIN" = 0,
  "GAME" = 1
}

export enum GameType {
  "SOLO" = 0
}

export interface AppState {
  view: View
  gameType: GameType | null
  helpModalOpen: boolean
  isPaused: boolean
  timeLeft: number
  board: string[]
  totalWords: Word[]
  totalWordCount: number
  totalWordScore: number
  foundWords: Word[]
  foundWordCount: number
  foundWordScore: number
  currentWordIndexes: number[]
}

export const initialAppState: AppState = {
  view: View.MAIN,
  gameType: null,
  helpModalOpen: false,
  isPaused: false,
  timeLeft: 120,
  board: [],
  totalWords: [],
  totalWordCount: 0,
  totalWordScore: 0,
  foundWords: [],
  foundWordCount: 0,
  foundWordScore: 0,
  currentWordIndexes: []
}

type Action =
  | { type: "ToggleHelpModal" }
  | { type: "ToggleGamePaused" }
  | { type: "StartGame_Solo"; payload: GenerateGameResponse }
  | { type: "RestartGame_Solo" }
  | { type: "AddToWord"; payload: number }
  | { type: "AddToWord_Mobile"; payload: number }
  | { type: "EndWord" }
  | { type: "TickTimer_Solo" }
  | { type: "HighlightWord"; payload: string | null }

export type Dispatch = ReactDispatch<Action>

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "StartGame_Solo": {
      const { board, words, totalWordCount, totalWordScore } = action.payload
      return {
        ...initialAppState,
        view: View.GAME,
        gameType: GameType.SOLO,
        board,
        totalWords: words,
        totalWordCount,
        totalWordScore
      }
    }
    case "ToggleHelpModal": {
      return {
        ...state,
        helpModalOpen: !state.helpModalOpen
      }
    }
    case "ToggleGamePaused": {
      return {
        ...state,
        isPaused: !state.isPaused
      }
    }
    case "RestartGame_Solo": {
      const { board, totalWords, totalWordCount, totalWordScore } = state
      return {
        ...initialAppState,
        view: View.GAME,
        gameType: GameType.SOLO,
        board: board,
        totalWords: totalWords,
        totalWordCount: totalWordCount,
        totalWordScore: totalWordScore
      }
    }
    case "AddToWord": {
      const { currentWordIndexes } = state
      const { payload } = action
      // If the selected square is the one we just came from, we remove the last selection
      const [_, ...rest] = [...currentWordIndexes].reverse()
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
    case "AddToWord_Mobile": {
      const { board, currentWordIndexes, foundWords, totalWords } = state
      const { payload } = action
      // If we tap on the same square, remove it
      if (payload === currentWordIndexes[currentWordIndexes.length - 1]) {
        const [_, ...rest] = [...currentWordIndexes].reverse()
        return {
          ...state,
          currentWordIndexes: rest.reverse()
        }
      }

      if (isValidMove(currentWordIndexes, payload) === false) {
        return state
      }

      const newIndexes = [...currentWordIndexes, payload]
      const foundWord = lookupWordFromIndexes(board, totalWords, newIndexes)
      // If this word exists in the total words, and we haven't already found it, add it in
      if (foundWord && wordAlreadyFound(foundWords, foundWord) == false) {
        const newFoundWords = [...foundWords, foundWord]
        return {
          ...state,
          foundWords: newFoundWords,
          foundWordCount: newFoundWords.length,
          foundWordScore: state.foundWordScore + foundWord.score,
          currentWordIndexes: []
        }
      }

      return {
        ...state,
        currentWordIndexes: newIndexes
      }
    }
    case "EndWord": {
      const { board, totalWords, foundWords, currentWordIndexes } = state
      const foundWord = lookupWordFromIndexes(board, totalWords, currentWordIndexes)
      // If this word exists in the total words, and we haven't already found it, add it in
      if (foundWord && wordAlreadyFound(foundWords, foundWord) == false) {
        const newFoundWords = [...foundWords, foundWord]
        return {
          ...state,
          foundWords: newFoundWords,
          foundWordCount: newFoundWords.length,
          foundWordScore: state.foundWordScore + foundWord.score,
          currentWordIndexes: []
        }
      }

      return {
        ...state,
        currentWordIndexes: []
      }
    }
    case "TickTimer_Solo": {
      if (state.timeLeft <= 0) {
        return {
          ...state,
          timeLeft: 0
        }
      }

      return {
        ...state,
        timeLeft: state.timeLeft - 1
      }
    }
    case "HighlightWord": {
      const { totalWords } = state
      if (action.payload === null) {
        return {
          ...state,
          currentWordIndexes: []
        }
      }

      const foundWord = lookupWordFromString(totalWords, action.payload) as Word
      return {
        ...state,
        currentWordIndexes: foundWord.path
      }
    }
    default: {
      throw new Error(`Unhandled action type ${(action as Action).type}`)
    }
  }
}
