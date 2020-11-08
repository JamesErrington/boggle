import { GameType, State } from "./reducer"
import { SocketUpdate } from "../../../shared/types"
import { setupGame } from "../utils"

export function handleSocketUpdate(state: State, action: SocketUpdate): State {
  switch (action.type) {
    case "HostGame": {
      const { code, player, isHost } = action.payload
      return {
        ...state,
        socketState: {
          ...state.socketState,
          players: [],
          code,
          player,
          isHost
        }
      }
    }
    case "UpdatePlayers": {
      return {
        ...state,
        socketState: {
          ...state.socketState,
          players: action.payload
        }
      }
    }
    case "StartGame": {
      return setupGame(state, action.payload, GameType.Multi)
    }
    default: {
      // @ts-ignore
      throw new Error(`Unhandled action type ${action.type}`)
    }
  }
}
