import { generateBoard } from "../../shared/utils"
import { Player, Lobby, LobbyState } from "../../shared/types"

const LOBBY_CODE_LENGTH = 4

export function _generateLobbyCode() {
  let code = ""
  for (let i = 0; i < LOBBY_CODE_LENGTH; i++) {
    code =
      code + String.fromCharCode(Math.floor(Math.random() * (90 - 65) + 65))
  }
  return code
}

export function generateLobby(host: Player, currentCodes: string[]): Lobby {
  let code = _generateLobbyCode()
  while (currentCodes.includes(code)) {
    code = _generateLobbyCode()
  }

  return {
    state: LobbyState.Open,
    hostId: host.id,
    players: [host],
    currentGame: {
      board: generateBoard()
    },
    code
  }
}

