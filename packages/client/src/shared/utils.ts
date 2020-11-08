const dice = [
  ["r", "i", "f", "o", "b", "x"],
  ["i", "f", "e", "h", "e", "y"],
  ["d", "e", "n", "o", "w", "s"],
  ["u", "t", "o", "k", "n", "d"],
  ["h", "m", "s", "r", "a", "o"],
  ["l", "u", "p", "e", "t", "s"],
  ["a", "c", "i", "t", "o", "a"],
  ["y", "l", "g", "k", "u", "e"],
  ["qu", "b", "m", "j", "o", "a"],
  ["e", "h", "i", "s", "p", "n"],
  ["v", "e", "t", "i", "g", "n"],
  ["b", "a", "l", "i", "y", "t"],
  ["e", "Z", "a", "v", "n", "d"],
  ["r", "a", "l", "e", "s", "c"],
  ["u", "w", "i", "l", "r", "g"],
  ["p", "a", "c", "e", "m", "d"]
]

export function _rollDie(die: string[]) {
  const index = Math.floor(Math.random() * 6)
  return die[index]
}

export function generateBoard() {
  const board: string[] = []
  const tempDice = [...dice]

  for (let i = 0; i < 16; i++) {
    const dieIndex = Math.floor(Math.random() * tempDice.length)
    const die = tempDice[dieIndex]
    board.push(_rollDie(die))
    tempDice.splice(dieIndex, 1)
  }
  return board
}
