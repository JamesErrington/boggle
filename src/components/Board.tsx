import React from "react"
import type { FunctionComponent } from "react"

import { Square } from "./Square"

interface Props {
  size: number
  letters: string[]
}

export const Board: FunctionComponent<Props> = ({ size, letters }) => {
  const squareSize = size / 4
  const style = {
    width: size,
    height: size
  }

  return (
    <div className="board" style={style}>
      {letters.map((letter, i) => (
        <Square key={i} size={squareSize} letter={letter} />
      ))}
    </div>
  )
}
