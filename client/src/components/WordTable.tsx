import React from "react"
import type { FunctionComponent } from "react"

import { WordTableRow } from "./WordTableRow"

import { useAppState } from "../context"

export const WordTable: FunctionComponent = () => {
  const { totalWords, foundWords, timeLeft } = useAppState()
  const nonFoundWords = totalWords.filter(word => foundWords.some(foundWord => word.string === foundWord.string) === false)
  const showNonFound = timeLeft <= 0

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
            <WordTableRow key={word.string} word={word} index={index} />
          ))}
        </tbody>
      </table>
      <table className="unfound-word-table">
        <tbody>
          {showNonFound && (
            <>
              <tr>
                <td colSpan={3}>You Missed:</td>
              </tr>
              {nonFoundWords.map((word, index) => (
                <WordTableRow key={word.string} word={word} index={index} />
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}
