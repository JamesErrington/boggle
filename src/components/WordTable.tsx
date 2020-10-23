import React from "react"
import type { FunctionComponent } from "react"

import { wordScore } from "../utils"

interface Props {
  foundWords: string[]
  unfoundWords: string[]
  showUnfound: boolean
}

export const WordTable: FunctionComponent<Props> = React.memo(
  ({ foundWords, unfoundWords, showUnfound }) => {
    return (
      <div className="word-table-container">
        <table className="found-word-table">
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
        <table className="unfound-word-table">
          <tbody>
            {showUnfound && (
              <>
                <tr>
                  <td colSpan={3}>You Missed:</td>
                </tr>
                {unfoundWords.map((word, index) => (
                  <tr key={word}>
                    <td>{foundWords.length + index + 1}</td>
                    <td>{word}</td>
                    <td>{wordScore(word)}</td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    )
  }
)
