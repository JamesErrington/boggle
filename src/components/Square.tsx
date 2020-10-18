import React from "react"
import type { FunctionComponent } from "react"
import { useBoggleDispatch } from "../context"

interface Props {
  index: number
  size: number
  letter: string
  selected: boolean
}

const borderSize = 2
const marginSize = 10

export const Square: FunctionComponent<Props> = ({
  index,
  size,
  letter,
  selected
}) => {
  const dispatch = useBoggleDispatch()

  const style = {
    width: size - 2 * marginSize,
    height: size - 2 * marginSize,
    border: `${borderSize}px solid black`,
    margin: marginSize,
    fontSize: size / 2,
    backgroundColor: selected ? "green" : "unset"
  }

  function handleMouseEnter(event: any) {
    dispatch({ type: "AddToWord", payload: index })
  }

  return (
    <div
      className="square"
      style={style}
      data-index={index}
      onMouseEnter={handleMouseEnter}
    >
      {letter}
    </div>
  )
}
