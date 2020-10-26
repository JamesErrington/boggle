import React from "react"
import type { FunctionComponent } from "react"

import { useBoggleDispatch, useBoggleState } from "../context"

interface Props {}

export const HowToPlayModal: FunctionComponent<Props> = () => {
  const { modalOpen } = useBoggleState()
  const dispatch = useBoggleDispatch()

  function handleCloseClick() {
    dispatch({ type: "ToggleModal" })
  }

  return (
    <div
      className="how-to-play-modal"
      style={{ display: modalOpen ? "flex" : "none" }}
    >
      <h2>Boggle</h2>
      <h3>How To Play</h3>
      <div className="how-to-play-rules">It's Boggle. You'll work it out</div>

      <button onClick={handleCloseClick}>Close</button>
    </div>
  )
}
