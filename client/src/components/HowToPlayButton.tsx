import React from "react"
import type { FunctionComponent } from "react"

import { useAppDispatch } from "../context"

export const HowToPlayButton: FunctionComponent = () => {
  const dispatch = useAppDispatch()

  function handleClick() {
    dispatch({ type: "ToggleHelpModal" })
  }

  return <button onClick={handleClick}>How To Play</button>
}
