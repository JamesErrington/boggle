import { Trie } from "./trie"
import { State, AppView, GameType, initialGameState } from "./hooks/reducer"

export function formWordFromIndexes(board: string[], indexes: number[]) {
  const letters = indexes.map(index => board[index])
  return letters.join("")
}

function isAdjacent(size: number, currentIndex: number, lastIndex: number) {
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
    currentWordIndexes.includes(index) === false &&
    isAdjacent(4, index, currentWordIndexes[currentWordIndexes.length - 1])
  )
}

export async function loadDictionary() {
  const response = await fetch("/boggle/word-list.txt")
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

export function calculateScore(words: string[]) {
  return words.reduce((score, word) => score + wordScore(word), 0)
}

export function findAllWords(board: string[], dictionary: Set<string>) {
  const trie = new Trie(dictionary)
  const paths: Record<string, number[]> = {}

  for (let i = 0; i < board.length; i++) {
    const newTrie = trie.findTrie(board[i])

    if (newTrie && newTrie.hasChildren()) {
      findAllPaths(board, newTrie, i, [i], paths)
    }
  }

  return [Object.keys(paths), Object.values(paths)] as any
}

function findAllPaths(
  board: string[],
  dictionary: Trie,
  index: number,
  path: number[],
  paths: Record<string, number[]>
) {
  const word = formWordFromIndexes(board, path)

  if (word.length >= 3 && dictionary.contains(word)) {
    paths[word] = path
  }

  for (let i = 0; i < board.length; i++) {
    const nextPath = [...path, i]
    const nextWord = formWordFromIndexes(board, nextPath)
    const newTrie = dictionary.findTrie(nextWord)

    if (
      newTrie &&
      newTrie.hasChildren() &&
      !path.includes(i) &&
      isAdjacent(Math.sqrt(board.length), i, index)
    ) {
      findAllPaths(board, newTrie, i, nextPath, paths)
    }
  }
}

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

export function setupGame(state: State, board: string[], gameType: GameType) {
  if (state.dictionary === null) {
    throw new Error("Dictionary not intialised")
  }

  const [allWordsStrings, allWordsIndexes] = findAllWords(
    board,
    state.dictionary
  )
  const allWordsScore = calculateScore(allWordsStrings)

  return {
    ...state,
    gameType,
    view: AppView.Game,
    gameState: {
      ...initialGameState,
      board,
      allWordsStrings,
      allWordsIndexes,
      allWordsScore
    }
  }
}
