export interface Player {
  id: string
  username: string
}

export enum LobbyState {
  Open = "OPEN",
  InGame = "INGAME"
}

export interface Lobby {
  code: string
  hostId: string
  players: Player[]
  state: LobbyState
  currentGame: {
    board: string[]
  }
}

export type SocketUpdate =
  | {
      type: "HostGame"
      payload: {
        code: string
        player: Player
        isHost: boolean
      }
    }
  | {
      type: "UpdatePlayers"
      payload: Player[]
    }
  | {
      type: "StartGame"
      payload: string[]
    }
