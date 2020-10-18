import React, { createContext, useContext, useReducer } from "react"
import type { FunctionComponent } from "react"

import { boggleReducer } from "./reducers"
import type { Dispatch, State } from "./reducers"

const BoggleStateContext = createContext<State | undefined>(undefined)
const BoggleDispatchContext = createContext<Dispatch | undefined>(undefined)

const initialState: State = {
  letters: [],
  currentWordIndexes: [],
  foundWords: []
}

const BoggleProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(boggleReducer, initialState)

  return (
    <BoggleDispatchContext.Provider value={dispatch}>
      <BoggleStateContext.Provider value={state}>
        {children}
      </BoggleStateContext.Provider>
    </BoggleDispatchContext.Provider>
  )
}

function useBoggleState() {
  const context = useContext(BoggleStateContext)

  if (context === undefined) {
    throw new Error("useBoggleState must be inside a BoggleProvider")
  }
  return context
}

function useBoggleDispatch() {
  const context = useContext(BoggleDispatchContext)

  if (context === undefined) {
    throw new Error("useBoggleDispatch must be inside a BoggleProvider")
  }
  return context
}

export { BoggleProvider, useBoggleState, useBoggleDispatch }
