import React, { useRef } from "react"
import type { FunctionComponent } from "react"
import useComponentSize from "@rehooks/component-size"

import { Square } from "./Square"

import { useBoggleDispatch, useBoggleState } from "../context"

const touch = "ontouchstart" in window

interface Props {
  disabled: boolean
}

function getIndex(element: HTMLElement) {
  const index = element.getAttribute("data-index")
  if (index === null) {
    return null
  }
  return parseInt(index)
}

export const Board: FunctionComponent<Props> = React.memo(({ disabled }) => {
  const ref = useRef(null)
  const { board, currentWordIndexes, paused } = useBoggleState()
  const dispatch = useBoggleDispatch()
  const { width: size } = useComponentSize(ref)

  const squareSize = Math.floor((size - 12) / 4)
  const style = {
    width: size,
    height: size,
    opacity: disabled ? "50%" : "100%"
  }

  function handleMouseDown(event: any) {
    const index = getIndex(event.target)
    if (disabled || paused || touch || index === null) {
      return
    }

    dispatch({ type: "AddToWord", payload: index })
  }

  function handleMouseUp(event: any) {
    if (touch) {
      return
    }

    dispatch({ type: "EndWord" })
  }

  function handleTouchStart(event: any) {
    const index = getIndex(event.target)
    if (disabled || paused || index === null) {
      return
    }

    dispatch({ type: "AddToWordMobile", payload: index })
  }

  return (
    <div
      ref={ref}
      className="board"
      style={style}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
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
})
