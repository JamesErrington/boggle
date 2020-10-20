const dice = [
  ["R", "I", "F", "O", "B", "X"],
  ["I", "F", "E", "H", "E", "Y"],
  ["D", "E", "N", "O", "W", "S"],
  ["U", "T", "O", "K", "N", "D"],
  ["H", "M", "S", "R", "A", "O"],
  ["L", "U", "P", "E", "T", "S"],
  ["A", "C", "I", "T", "O", "A"],
  ["Y", "L", "G", "K", "U", "E"],
  ["Qu", "B", "M", "J", "O", "A"],
  ["E", "H", "I", "S", "P", "N"],
  ["V", "E", "T", "I", "G", "N"],
  ["B", "A", "L", "I", "Y", "T"],
  ["E", "Z", "A", "V", "N", "D"],
  ["R", "A", "L", "E", "S", "C"],
  ["U", "W", "I", "L", "R", "G"],
  ["P", "A", "C", "E", "M", "D"]
]

function rollDie(die: string[]) {
  const index = Math.floor(Math.random() * 6)
  return die[index]
}

export function generateBoard() {
  const board: string[] = []
  const tempDice = [...dice]

  for (let i = 0; i < 16; i++) {
    const dieIndex = Math.floor(Math.random() * tempDice.length)
    const die = tempDice[dieIndex]
    board.push(rollDie(die))
    tempDice.splice(dieIndex, 1)
  }
  return board
}

export function formWordFromIndexes(board: string[], indexes: number[]) {
  const letters = indexes.map(index => board[index])
  return letters.join("").toLowerCase()
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

export async function loadDictionary() {
  const response = await fetch("/word-list.txt")
  const text = await response.text()

  return new Set(text.split("\n"))
}

export function wordScore(word: string) {
  return word.length === 3 || word.length === 4
    ? 1
    : word.length === 5
    ? 2
    : word.length === 6
    ? 3
    : word.length === 7
    ? 5
    : 11
}

export function calculateScore(foundWords: string[]) {
  return foundWords.reduce((score, word) => score + wordScore(word), 0)
}
