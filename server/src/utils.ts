import path from "path"
import { readFileSync } from "fs"

import { Trie } from "./trie"
import type { Word } from "../../shared/types"

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
    score: wordScore(word)
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
  return words.reduce((total, { score }) => total + score, 0)
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
