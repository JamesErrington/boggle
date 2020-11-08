export enum LobbyStatus {
  OPEN = "open",
  INGAME = "ingame"
}

interface GameState {
  board: string[]
}

export interface Player {
  id: string
  username: string
}

export interface Lobby {
  code: string
  hostId: string
  status: LobbyStatus
  players: Player[]
  currentGame: GameState
}
