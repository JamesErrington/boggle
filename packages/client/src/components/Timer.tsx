import React from "react"
import type { FunctionComponent } from "react"

import { formatTime } from "../utils"

interface Props {
  timeLeft: number
  foundWordsCount: number
  totalWordsCount: number
  foundScore: number
  totalScore: number
}

export const Timer: FunctionComponent<Props> = ({
  timeLeft,
  foundWordsCount,
  totalWordsCount,
  foundScore,
  totalScore
}) => {
  const formattedTime = formatTime(timeLeft)
  const showTotals = timeLeft <= 0

  return (
    <div className="timer">
      <h3>Time Left</h3>
      <h3>{formattedTime}</h3>
      <div className="score-container">
        <h3>
          Found: {foundWordsCount} {showTotals && `/ ${totalWordsCount}`}
        </h3>
        <h3>
          Score: {foundScore} {showTotals && `/ ${totalScore}`}
        </h3>
      </div>
    </div>
  )
}
