import React, { createContext, useContext, useReducer } from "react"
import type { FunctionComponent } from "react"

import { boggleReducer, initialState } from "./reducer"
import type { Dispatch, State } from "./reducer"

const BoggleStateContext = createContext<State | undefined>(undefined)
const BoggleDispatchContext = createContext<Dispatch | undefined>(undefined)

export const BoggleProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(boggleReducer, initialState)

  return (
    <BoggleDispatchContext.Provider value={dispatch}>
      <BoggleStateContext.Provider value={state}>
        {children}
      </BoggleStateContext.Provider>
    </BoggleDispatchContext.Provider>
  )
}

export function useBoggleState() {
  const context = useContext(BoggleStateContext)

  if (context === undefined) {
    throw new Error("useBoggleState must be inside a BoggleProvider")
  }

  return context
}

export function useGameState() {
  const context = useContext(BoggleStateContext)

  if (context === undefined) {
    throw new Error("useBoggleState must be inside a BoggleProvider")
  }

  return context.gameState
}

export function useSocketState() {
  const context = useContext(BoggleStateContext)

  if (context === undefined) {
    throw new Error("useBoggleState must be inside a BoggleProvider")
  }

  return context.socketState
}

export function useBoggleDispatch() {
  const context = useContext(BoggleDispatchContext)

  if (context === undefined) {
    throw new Error("useBoggleDispatch must be inside a BoggleProvider")
  }
  return context
}
