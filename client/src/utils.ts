import type { CSSProperties } from "react"
import { Word } from "../../shared/types"

export const borderSize = 3
export const marginSize = 10

export function formatTime(seconds: number) {
  return new Date(seconds * 1000).toTimeString().substr(3, 5)
}

export function getIndex(element: HTMLElement) {
  const index = element.getAttribute("data-index")
  if (index === null) {
    return null
  }
  return parseInt(index)
}

export function getLineStyle(board: string[], highlighedIndexes: number[], boardIndex: number): CSSProperties {
  if (highlighedIndexes.includes(boardIndex) === false || highlighedIndexes.length < 2) {
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

  const previousHighlightedIndex = highlighedIndexes[highlighedIndexes.indexOf(boardIndex) - 1]

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

function _isAdjacent(size: number, currentIndex: number, lastIndex: number) {
  const currentX = currentIndex % size
  const currentY = Math.floor(currentIndex / size)
  const lastX = lastIndex % size
  const lastY = Math.floor(lastIndex / size)

  return (
    // Above
    (currentX === lastX && currentY === lastY - 1) ||
    // Below
    (currentX === lastX && currentY === lastY + 1) ||
    // Right
    (currentX === lastX + 1 && currentY === lastY) ||
    // Left
    (currentX === lastX - 1 && currentY === lastY) ||
    // Above and Right
    (currentX === lastX + 1 && currentY === lastY - 1) ||
    // Below and Right
    (currentX === lastX + 1 && currentY === lastY + 1) ||
    // Above and Left
    (currentX === lastX - 1 && currentY === lastY - 1) ||
    // Below and Left
    (currentX === lastX - 1 && currentY === lastY + 1)
  )
}

export function isValidMove(currentWordIndexes: number[], index: number) {
  if (currentWordIndexes.length === 0) {
    return true
  }
  return (
    currentWordIndexes.includes(index) === false && _isAdjacent(4, index, currentWordIndexes[currentWordIndexes.length - 1])
  )
}

function _formWordFromIndexes(board: string[], indexes: number[]) {
  const letters = indexes.map(index => board[index])
  return letters.join("")
}

export function lookupWordFromIndexes(board: string[], totalWords: Word[], foundIndexes: number[]) {
  const foundString = _formWordFromIndexes(board, foundIndexes)
  return totalWords.find(({ string }) => string == foundString)
}

export function lookupWordFromString(totalWords: Word[], foundString: string) {
  return totalWords.find(({ string }) => string == foundString)
}

export function wordAlreadyFound(foundWords: Word[], foundWord: Word) {
  return foundWords.some(({ string }) => string === foundWord.string)
}
