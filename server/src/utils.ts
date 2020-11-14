import path from "path"
import { readFileSync } from "fs"

import { Trie } from "./trie"
import type { Word, Player, Lobby, SocketConnectionQuery, FoundWords, Result } from "../../shared/types"

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

function _rollDie(die: string[]) {
  const index = Math.floor(Math.random() * 6)
  return die[index]
}

function wordScore(word: string) {
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

export function findAllWords(board: string[], dictionary: Set<string>) {
  const trie = new Trie(dictionary)
  const paths: Record<string, number[]> = {}

  for (let i = 0; i < board.length; i++) {
    const newTrie = trie.findTrie(board[i])

    if (newTrie && newTrie.hasChildren()) {
      _findAllPaths(board, newTrie, i, [i], paths)
    }
  }

  const words = Object.entries(paths).map(([word, path]) => ({
    string: word,
    path,
    score: wordScore(word),
    foundBySomeoneElse: false
  }))
  const totalWordCount = words.length
  const totalWordScore = _calculateScore(words)

  return {
    words,
    totalWordCount,
    totalWordScore
  }
}

function _calculateScore(words: Word[]) {
  return words.reduce((total, { score, foundBySomeoneElse }) => total + (foundBySomeoneElse ? 0 : score), 0)
}

function _uniqueWords(words: Word[]) {
  return words.reduce((total, { foundBySomeoneElse }) => total + (foundBySomeoneElse ? 0 : 1), 0)
}

export function processMultiplayerFoundWords(lobbyWords: Record<string, FoundWords>, words: Word[]) {
  // For each of the words we have just found, we need to check if any of them have been found already
  words.forEach(playerWord => {
    Object.values(lobbyWords).forEach(foundWords => {
      foundWords.words.forEach(otherPlayerWord => {
        if (playerWord.string === otherPlayerWord.string) {
          playerWord.foundBySomeoneElse = true
          otherPlayerWord.foundBySomeoneElse = true
        }
      })
    })
  })

  return {
    score: 0,
    words
  }
}

export function calculateMultiplayerScores(lobbyWords: Record<string, FoundWords>) {
  const result: Result = {
    winners: {},
    score: 0,
    uniqueWords: 0
  }
  Object.entries(lobbyWords).forEach(([id, foundWords]) => {
    const score = _calculateScore(foundWords.words)
    const uniqueWords = _uniqueWords(foundWords.words)
    foundWords.score = score

    if ((score > 0 && score > result.score) || (score === result.score && uniqueWords > result.uniqueWords)) {
      result.winners = {}
      result.score = score
      result.uniqueWords = uniqueWords
      result.winners[id] = {
        score,
        uniqueWords
      }
    } else if (score > 0 && score === result.score) {
      result.winners[id] = {
        score,
        uniqueWords
      }
    }
  })

  return result
}

function _findAllPaths(board: string[], dictionary: Trie, index: number, path: number[], paths: Record<string, number[]>) {
  const word = _formWordFromIndexes(board, path)

  if (word.length >= 3 && dictionary.contains(word)) {
    paths[word] = path
  }

  for (let i = 0; i < board.length; i++) {
    const nextPath = [...path, i]
    const nextWord = _formWordFromIndexes(board, nextPath)
    const newTrie = dictionary.findTrie(nextWord)

    if (newTrie && newTrie.hasChildren() && !path.includes(i) && _isAdjacent(Math.sqrt(board.length), i, index)) {
      _findAllPaths(board, newTrie, i, nextPath, paths)
    }
  }
}

function _formWordFromIndexes(board: string[], indexes: number[]) {
  const letters = indexes.map(index => board[index])
  return letters.join("")
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

export function setupGame(dictionary: Set<string>) {
  const board = generateBoard()
  const allWords = findAllWords(board, dictionary)

  return {
    board,
    ...allWords
  }
}

export function loadDictionary() {
  try {
    console.log("[server] Loading dictionary...")
    const words = readFileSync(path.join(__dirname, "static/word-list.txt"), { encoding: "utf-8" })
    console.log("[server] Dictionary loaded successfully")
    return new Set(words.split("\n"))
  } catch (ex) {
    console.error(ex)
    process.exit(1)
  }
}

export function _generateCode() {
  let code = ""
  for (let i = 0; i < 4; i++) {
    code = code + String.fromCharCode(Math.floor(Math.random() * (90 - 65) + 65))
  }
  return code
}

function _createLobby(host: Player, lobbies: Record<string, Lobby>): Lobby {
  let code = undefined
  while (code === undefined || Object.keys(lobbies).includes(code)) {
    code = _generateCode()
  }

  const lobby: Lobby = {
    code,
    host: host.id,
    players: [host],
    timeLeft: 120,
    foundWords: {}
  }
  lobbies[code] = lobby

  return lobby
}

export function resetLobby(lobby: Lobby) {
  lobby.foundWords = {}
  lobby.timeLeft = 120
}

export function findLobby(code: string, lobbies: Record<string, Lobby>): Lobby | undefined {
  const found = Object.entries(lobbies).find(([lobbyCode]) => lobbyCode === code)
  return (found && found[1]) || undefined
}

export function findPlayer(id: string, players: Player[]): Player {
  const found = players.find(player => player.id === id)
  if (!found) {
    throw new Error(`Failed to find player with id ${id}`)
  }
  return found
}

export function findOrCreateLobby(
  query: SocketConnectionQuery,
  player: Player,
  lobbies: Record<string, Lobby>
): Lobby | undefined | null {
  let lobby: Lobby | undefined = undefined
  if (query.create === "true") {
    lobby = _createLobby(player, lobbies)
    console.log(`[socket] Lobby ${lobby.code} created with host ${player.id}`)
  } else if (query.code) {
    const found = findLobby(query.code, lobbies)
    if (found) {
      const usernameTaken = found.players.some(lobbyPlayer => lobbyPlayer.username === player.username)
      if (usernameTaken) {
        return null
      }
      lobby = found
      lobby.players.push(player)
      console.log(`[socket] Player ${player.id} assigned to lobby ${lobby.code}`)
    }
  }

  return lobby
}
