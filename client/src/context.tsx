import React, { createContext, useContext, useReducer } from "react"
import type { FunctionComponent } from "react"

import { appReducer, initialAppState } from "./reducer"
import type { Dispatch, AppState } from "./reducer"

const AppStateContext = createContext<AppState | undefined>(undefined)
const AppDispatchContext = createContext<Dispatch | undefined>(undefined)

export const AppProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialAppState)

  return (
    <AppDispatchContext.Provider value={dispatch}>
      <AppStateContext.Provider value={state}>{children}</AppStateContext.Provider>
    </AppDispatchContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)

  if (context === undefined) {
    throw new Error("useAppState must be inside a AppProvider")
  }

  return context
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext)

  if (context === undefined) {
    throw new Error("useAppDispatch must be inside a AppProvider")
  }
  return context
}
