import React from "react"
import type { FunctionComponent, MouseEvent } from "react"

import { useAppDispatch } from "../context"
import type { Word } from "../../../shared/types"

interface Props {
  index: number
  word: Word
}

export const WordTableRow: FunctionComponent<Props> = ({ index, word }) => {
  const dispatch = useAppDispatch()

  function handleMouseEnter(event: MouseEvent<HTMLElement>) {
    const word = event.currentTarget.getAttribute("data-word")

    dispatch({ type: "HighlightWord", payload: word })
  }

  function handleMouseLeave() {
    dispatch({ type: "HighlightWord", payload: null })
  }
  return (
    <tr onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-word={word.string}>
      <td>{index + 1}</td>
      <td>{word.string}</td>
      <td>{word.score}</td>
    </tr>
  )
}
