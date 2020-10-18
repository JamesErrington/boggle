import React from "react"
import type { FunctionComponent } from "react"

import { useBoggleState } from "../context"

interface Props {}

export const WordList: FunctionComponent<Props> = () => {
  const { foundWords } = useBoggleState()
  return (
    <ol>
      {foundWords.map((word) => (
        <li key={word}>{word}</li>
      ))}
    </ol>
  )
}
