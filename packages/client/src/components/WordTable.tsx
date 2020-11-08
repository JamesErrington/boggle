import React from "react"
import type { FunctionComponent } from "react"

import { WordTableRow } from "./WordTableRow"

interface Props {
  foundWords: string[]
  allWordsStrings: string[]
  showNonFound: boolean
}

export const WordTable: FunctionComponent<Props> = ({
  foundWords,
  allWordsStrings,
  showNonFound
}) => {
  const nonFoundWords = allWordsStrings.filter(
    word => !foundWords.includes(word)
  )

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
            <WordTableRow key={word} word={word} index={index} />
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
                <WordTableRow key={word} word={word} index={index} />
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}
