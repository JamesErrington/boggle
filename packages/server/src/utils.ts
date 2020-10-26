import { LobbyStatus } from "./types"
import type { Lobby, Player } from "./types"

const LOBBY_CODE_LENGTH = 4

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

function generateLobbyCode() {
  let code = ""
  for (let i = 0; i < LOBBY_CODE_LENGTH; i++) {
    code =
      code + String.fromCharCode(Math.floor(Math.random() * (90 - 65) + 65))
  }
  return code
}

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

export function generateLobby(host: Player, currentCodes: string[]): Lobby {
  let code = generateLobbyCode()
  while (currentCodes.includes(code)) {
    code = generateLobbyCode()
  }

  return {
    status: LobbyStatus.OPEN,
    hostId: host.id,
    players: [host],
    currentGame: {
      board: generateBoard()
    },
    code
  }
}
