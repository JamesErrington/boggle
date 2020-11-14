export interface Word {
  string: string
  path: number[]
  score: number
  foundBySomeoneElse: boolean
}

interface FoundWords {
  score: number
  words: Word[]
}

export interface Result {
  uniqueWords: number
  score: number
  winners: Record<string, { score: number; uniqueWords: number }>
}

export interface GenerateGameResponse {
  board: string[]
  words: Word[]
  totalWordScore: number
  totalWordCount: number
}

export interface SocketConnectionQuery {
  username: string
  create?: "true" | "false"
  code?: string
}

export interface ReadyQuery {
  code: string
  ready: string
}

export interface StartGameQuery {
  code: string
}

export interface FoundWordsQuery {
  code: string
  foundWords: Word[]
}

export interface Player {
  id: string
  username: string
  points: number
  ready: boolean
}

export interface Lobby {
  host: string
  code: string
  players: Player[]
  timeLeft: number
  foundWords: Record<string, FoundWords>
}

export type SocketUpdate =
  | {
      type: "LobbyState"
      payload: {
        code: string
        player: Player
        isHost: boolean
      }
    }
  | {
      type: "Players"
      payload: Player[]
    }
  | {
      type: "StartGame"
      payload: {
        board: string[]
        words: Word[]
        totalWordScore: number
        totalWordCount: number
        timeLeft: number
        player: Player
      }
    }
  | {
      type: "TimerTick"
      payload: number
    }
  | {
      type: "FoundWords"
      payload: {
        foundWords: Record<string, FoundWords>
        result: Result
        players: Player[]
      }
    }

export type SocketError = NoLobbyError | UsernameTakenError

export interface NoLobbyError {
  type: "NoLobby"
  payload: {
    message: string
  }
}

export interface UsernameTakenError {
  type: "UsernameTaken"
  payload: {
    message: string
  }
}
