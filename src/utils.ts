export function generateBoard() {
  const board: string[] = []
  for (let i = 0; i < 16; i++) {
    board.push(String.fromCharCode(getRandomCharCode()))
  }
  return board
}

function getRandomCharCode() {
  return Math.floor(Math.random() * (122 - 97 + 1) + 97)
}

export function formWordFromIndexes(board: string[], indexes: number[]) {
  const letters = indexes.map((index) => board[index])
  return letters.join("")
}

function isAdjacent(currentIndex: number, lastIndex: number) {
  const currentX = currentIndex % 4
  const currentY = Math.floor(currentIndex / 4)
  const lastX = lastIndex % 4
  const lastY = Math.floor(lastIndex / 4)

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
  return (
    currentWordIndexes.length > 0 &&
    currentWordIndexes.includes(index) === false &&
    isAdjacent(index, currentWordIndexes[currentWordIndexes.length - 1])
  )
}
