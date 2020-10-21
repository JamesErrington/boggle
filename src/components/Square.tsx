import React from "react"
import type { FunctionComponent } from "react"
import { useBoggleDispatch, useBoggleState } from "../context"

interface Props {
  index: number
  size: number
  letter: string
  selected: boolean
  paused: boolean
}

const borderSize = 3
const marginSize = 10

export const Square: FunctionComponent<Props> = React.memo(
  ({ index, size, letter, selected, paused }) => {
    const { currentWordIndexes } = useBoggleState()
    const dispatch = useBoggleDispatch()

    const style = {
      width: size - 2 * marginSize,
      height: size - 2 * marginSize,
      border: `${borderSize}px solid black`,
      margin: marginSize,
      fontSize: size / 2,
      backgroundColor: selected ? "green" : "white"
    }

    function handleMouseEnter(event: any) {
      if (currentWordIndexes.length > 0) {
        dispatch({ type: "AddToWord", payload: index })
      }
    }

    return (
      <div
        className="square"
        style={style}
        data-index={index}
        onMouseEnter={handleMouseEnter}
      >
        {paused ? "" : letter}
      </div>
    )
  }
)
