import React, { useRef } from "react"
import type { FunctionComponent, MouseEvent, TouchEvent } from "react"
import useComponentSize from "@rehooks/component-size"

import { Square } from "./Square"

import { useAppDispatch, useAppState } from "../context"
import { getIndex, getLineStyle, borderSize, marginSize } from "../utils"

const touch = "ontouchstart" in window

export const Board: FunctionComponent = () => {
  const { board, isPaused, timeLeft, currentWordIndexes } = useAppState()
  const dispatch = useAppDispatch()
  const ref = useRef(null)
  const { width: size } = useComponentSize(ref)

  const squareSize = Math.floor((size - 12) / 4)
  const style = {
    width: size,
    height: size
  }
  const isDisabled = timeLeft <= 0

  function handleMouseDown(event: MouseEvent<HTMLElement>) {
    const index = getIndex(event.target as HTMLElement)
    if (isPaused || isDisabled || touch || index === null) {
      return
    }

    dispatch({ type: "AddToWord", payload: index })
  }

  function handleMouseUp() {
    if (touch) {
      return
    }

    dispatch({ type: "EndWord" })
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    const index = getIndex(event.target as HTMLElement)
    if (isDisabled || isPaused || index === null) {
      return
    }

    dispatch({ type: "AddToWord_Mobile", payload: index })
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
          isSelectable={currentWordIndexes.length > 0}
          isSelected={currentWordIndexes.includes(i)}
          lineStyle={getLineStyle(board, currentWordIndexes, i)}
          isPaused={isPaused}
          borderSize={borderSize}
          marginSize={marginSize}
        />
      ))}
    </div>
  )
}
