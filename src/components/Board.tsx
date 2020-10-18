import React, { useEffect } from "react"
import type { FunctionComponent } from "react"

import { Square } from "./Square"

import { useBoggleDispatch, useBoggleState } from "../context"

interface Props {
  size: number
}

function getIndex(element: HTMLElement) {
  const index = element.getAttribute("data-index")
  if (index === null) {
    throw new Error(`Element ${element} has no attribute 'data-index'`)
  }
  return parseInt(index)
}

export const Board: FunctionComponent<Props> = ({ size }) => {
  const { letters, currentWordIndexes } = useBoggleState()
  const dispatch = useBoggleDispatch()

  const squareSize = size / 4
  const style = {
    width: size,
    height: size,
    
  }

  useEffect(() => {
    dispatch({ type: "GenerateLetters" })
  }, [dispatch])

  function handleMouseDown(event: any) {
    dispatch({ type: "StartWord", payload: getIndex(event.target) })
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
      {letters.map((letter, i) => (
        <Square
          key={i}
          index={i}
          size={squareSize}
          letter={letter}
          selected={currentWordIndexes.includes(i)}
        />
      ))}
    </div>
  )
}
