import React from "react"
import type { FunctionComponent, CSSProperties } from "react"

import { useAppDispatch } from "../context"

interface Props {
  index: number
  size: number
  letter: string
  isSelectable: boolean
  isSelected: boolean
  lineStyle: CSSProperties
  isPaused: boolean
  borderSize: number
  marginSize: number
}

export const Square: FunctionComponent<Props> = ({
  index,
  size,
  letter,
  isSelectable,
  isSelected,
  lineStyle,
  isPaused,
  borderSize,
  marginSize
}) => {
  const dispatch = useAppDispatch()

  const squareStyle = {
    width: size - 2 * marginSize,
    height: size - 2 * marginSize,
    border: `${borderSize}px solid black`,
    margin: marginSize,
    fontSize: size / 2
  }

  function handleMouseEnter() {
    if (isSelectable) {
      dispatch({ type: "AddToWord", payload: index })
    }
  }

  return (
    <div className="square" style={squareStyle} data-index={index} onMouseEnter={handleMouseEnter}>
      {isSelected && (
        <>
          <div className="circle"></div>
          <div className="line" style={lineStyle}></div>
        </>
      )}
      {isPaused ? "" : letter}
    </div>
  )
}
