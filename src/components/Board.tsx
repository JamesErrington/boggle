import React from "react"
import type { FunctionComponent } from "react"

import { Square } from "./Square"

import { useBoggleDispatch, useBoggleState } from "../context"

interface Props {
  size: number
  disabled: boolean
}

function getIndex(element: HTMLElement) {
  const index = element.getAttribute("data-index")
  if (index === null) {
    return null
  }
  return parseInt(index)
}

export const Board: FunctionComponent<Props> = React.memo(
  ({ size, disabled }) => {
    const { board, currentWordIndexes, paused } = useBoggleState()
    const dispatch = useBoggleDispatch()

    const squareSize = size / 4
    const style = {
      width: size,
      height: size,
      opacity: disabled ? "50%" : "100%"
    }

    function handleMouseDown(event: any) {
      if (disabled || paused) {
        return
      }

      const index = getIndex(event.target)
      if (index !== null) {
        dispatch({ type: "StartWord", payload: index })
      }
    }

    function handleMouseUp(event: any) {
      dispatch({ type: "EndWord" })
    }

    return (
      <div
        className="board"
        style={style}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {board.map((letter, i) => (
          <Square
            key={i}
            index={i}
            size={squareSize}
            letter={letter}
            selected={currentWordIndexes.includes(i)}
            paused={paused}
          />
        ))}
      </div>
    )
  }
)
