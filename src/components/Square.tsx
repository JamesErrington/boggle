import React from "react"
import type { FunctionComponent } from "react"

interface Props {
  size: number
  letter: string
}

const borderSize = 2

export const Square: FunctionComponent<Props> = ({ size, letter }) => {
  const style = {
    width: size,
    height: size,
    border: `${borderSize}px solid black`,
    fontSize: size / 2
  }

  return (
    <div className="square" style={style}>
      {letter}
    </div>
  )
}
