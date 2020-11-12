import React from "react"
import type { FunctionComponent } from "react"

import { useAppState } from "../context"
import { formatTime } from "../utils"

export const Timer: FunctionComponent = () => {
  const { timeLeft, totalWordCount, totalWordScore, foundWordCount, foundWordScore } = useAppState()
  const formattedTime = formatTime(timeLeft)
  const showTotals = timeLeft <= 0

  return (
    <div className="timer">
      <h3>Time Left</h3>
      <h3>{formattedTime}</h3>
      <div className="score-container">
        <h3>
          Found: {foundWordCount} {showTotals && `/ ${totalWordCount}`}
        </h3>
        <h3>
          Score: {foundWordScore} {showTotals && `/ ${totalWordScore}`}
        </h3>
      </div>
    </div>
  )
}
