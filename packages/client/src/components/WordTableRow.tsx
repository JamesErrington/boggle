import React from "react"
import type { FunctionComponent } from "react"

import { wordScore } from "../utils"
import { useBoggleDispatch } from "../hooks/context"

interface Props {
  index: number
  word: string
}

export const WordTableRow: FunctionComponent<Props> = ({ index, word }) => {
  const dispatch = useBoggleDispatch()

  function handleMouseEnter(event: any) {
    const word = event.currentTarget.getAttribute("data-word")

    dispatch({ type: "HighlightWord", payload: word })
  }

  function handleMouseLeave() {
    dispatch({ type: "HighlightWord", payload: null })
  }
  return (
    <tr
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-word={word}
    >
      <td>{index + 1}</td>
      <td>{word}</td>
      <td>{wordScore(word)}</td>
    </tr>
  )
}
