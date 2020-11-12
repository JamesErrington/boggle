export interface Word {
  string: string
  path: number[]
  score: number
}

export interface GenerateGameResponse {
  board: string[]
  words: Word[]
  totalWordScore: number
  totalWordCount: number
}
