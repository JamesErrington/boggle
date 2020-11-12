import React from "react"
import type { FunctionComponent } from "react"

import { useAppDispatch } from "../context"

interface Props {
  isOpen: boolean
}

export const HowToPlayModal: FunctionComponent<Props> = ({ isOpen }) => {
  const dispatch = useAppDispatch()

  function handleCloseClick() {
    dispatch({ type: "ToggleHelpModal" })
  }

  return (
    <div className="how-to-play-modal" style={{ display: isOpen ? "flex" : "none" }}>
      <h2>Boggle</h2>
      <h3>How To Play</h3>
      <div className="how-to-play-rules">
        <p>It's Boggle. You'll work it out</p>
      </div>

      <button onClick={handleCloseClick}>Close</button>
    </div>
  )
}
