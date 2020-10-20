import React from "react"
import type { FunctionComponent } from "react"

import { useBoggleState } from "../context"
import { calculateScore, wordScore } from "../utils"

interface Props {}

export const ScoreTable: FunctionComponent<Props> = React.memo(() => {
  const { foundWords } = useBoggleState()
  const score = calculateScore(foundWords)

  return (
    <div className="score-table-container">
      <h3>Total Score: {score}</h3>
      <table className="score-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Word</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {foundWords.map((word, index) => (
            <tr key={word}>
              <td>{index + 1}</td>
              <td>{word}</td>
              <td>{wordScore(word)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
