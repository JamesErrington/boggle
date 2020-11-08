import React, { useRef } from "react"
import type { FunctionComponent, CSSProperties } from "react"
import useComponentSize from "@rehooks/component-size"

import { Square } from "./Square"

import { useBoggleDispatch } from "../hooks/context"
import { getIndex } from "../utils"

interface Props {
  board: string[]
  isPaused: boolean
  isDisabled: boolean
  highlightedIndexes: number[]
}

const touch = "ontouchstart" in window
const borderSize = 3
const marginSize = 10

export const Board: FunctionComponent<Props> = ({
  board,
  isPaused,
  isDisabled,
  highlightedIndexes
}) => {
  const dispatch = useBoggleDispatch()
  const ref = useRef(null)
  const { width: size } = useComponentSize(ref)

  const squareSize = Math.floor((size - 12) / 4)
  const style = {
    width: size,
    height: size
  }

  function handleMouseDown(event: any) {
    const index = getIndex(event.target)
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

  function handleTouchStart(event: any) {
    const index = getIndex(event.target)
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
          isSelectable={highlightedIndexes.length > 0}
          isSelected={highlightedIndexes.includes(i)}
          lineStyle={getLineStyle(board, highlightedIndexes, i)}
          isPaused={isPaused}
          borderSize={borderSize}
          marginSize={marginSize}
        />
      ))}
    </div>
  )
}

function getLineStyle(
  board: string[],
  highlighedIndexes: number[],
  boardIndex: number
): CSSProperties {
  if (
    highlighedIndexes.includes(boardIndex) === false ||
    highlighedIndexes.length < 2
  ) {
    return {
      display: "none"
    }
  }

  const currentHighlightedIndex = highlighedIndexes.indexOf(boardIndex)
  if (currentHighlightedIndex === 0) {
    return {
      display: "none"
    }
  }

  const previousHighlightedIndex =
    highlighedIndexes[highlighedIndexes.indexOf(boardIndex) - 1]

  const size = Math.sqrt(board.length)
  const currentX = boardIndex % size
  const currentY = Math.floor(boardIndex / size)
  const lastX = previousHighlightedIndex % size
  const lastY = Math.floor(previousHighlightedIndex / size)

  const longSize = `calc(100% + ${2 * (borderSize + marginSize)}px)`
  const diagonalSize = `calc(1.4 * (100% + ${2 * (borderSize + marginSize)}px))`
  const smallSize = "10px"
  if (currentX === lastX && currentY === lastY - 1) {
    // Above
    return {
      width: smallSize,
      height: longSize,
      top: "50%"
    }
  } else if (currentX === lastX && currentY === lastY + 1) {
    // Below
    return {
      width: smallSize,
      height: longSize,
      bottom: "50%"
    }
  } else if (currentX === lastX + 1 && currentY === lastY) {
    // Right
    return {
      width: longSize,
      height: smallSize,
      right: "50%"
    }
  } else if (currentX === lastX - 1 && currentY === lastY) {
    // Left
    return {
      width: longSize,
      height: smallSize,
      left: "50%"
    }
  } else if (currentX === lastX + 1 && currentY === lastY - 1) {
    // Above and Right
    return {
      width: diagonalSize,
      height: smallSize,
      transform: "rotate(-45deg)",
      bottom: "-25%",
      right: "25%"
    }
  } else if (currentX === lastX + 1 && currentY === lastY + 1) {
    // Below and Right
    return {
      width: diagonalSize,
      height: smallSize,
      transform: "rotate(45deg)",
      top: "-25%",
      right: "25%"
    }
  } else if (currentX === lastX - 1 && currentY === lastY - 1) {
    // Above and Left
    return {
      width: diagonalSize,
      height: smallSize,
      transform: "rotate(45deg)",
      bottom: "-25%",
      left: "25%"
    }
  } else if (currentX === lastX - 1 && currentY === lastY + 1) {
    // Below and Left
    return {
      width: diagonalSize,
      height: smallSize,
      transform: "rotate(-45deg)",
      top: "-25%",
      left: "25%"
    }
  }

  return {}
}
